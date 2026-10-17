// RFQ submission entry point. Called directly from the public website with
// the anon key; all privileged work (writing customers/orders, dispatching
// notifications) happens here, server-side, with the service-role key.
// See spec §15 (submission protection / idempotency) and §02.3 (public
// order submission security).

import { createClient } from "jsr:@supabase/supabase-js@2"
import { corsHeaders, handleOptions } from "../_shared/cors.ts"
import { createNotificationProvider } from "../_shared/notifications.ts"
import { verifyTurnstile } from "../_shared/turnstile.ts"
import { checkRateLimit } from "../_shared/rate-limit.ts"

interface OrderItemInput {
  product_id?: string
  product_name?: string
  product_description?: string
  quantity: number
  options?: Record<string, unknown>
}

interface UploadedFileInput {
  storage_path: string
  original_filename: string
  mime_type: string
  size_bytes: number
}

interface SubmitOrderBody {
  idempotency_key: string
  full_name: string
  phone: string
  whatsapp_phone?: string
  email?: string
  company_name?: string
  location?: string
  items: OrderItemInput[]
  customer_description?: string
  preferred_deadline?: string
  delivery_location?: string
  uploaded_files?: UploadedFileInput[]
  turnstile_token?: string
}

const MAX_FILES = 10

const MAX_ITEMS = 20
const MAX_DESCRIPTION_LENGTH = 4000

function isValidBody(body: unknown): body is SubmitOrderBody {
  if (typeof body !== "object" || body === null) return false
  const b = body as Record<string, unknown>

  if (typeof b.idempotency_key !== "string" || b.idempotency_key.length < 8) {
    return false
  }
  if (typeof b.full_name !== "string" || b.full_name.trim().length === 0) {
    return false
  }
  if (typeof b.phone !== "string" || b.phone.trim().length < 6) {
    return false
  }
  if (!Array.isArray(b.items) || b.items.length === 0 || b.items.length > MAX_ITEMS) {
    return false
  }
  for (const item of b.items) {
    if (typeof item !== "object" || item === null) return false
    const i = item as Record<string, unknown>
    if (typeof i.quantity !== "number" || i.quantity <= 0 || i.quantity > 1_000_000) {
      return false
    }
  }
  if (
    typeof b.customer_description === "string" &&
    b.customer_description.length > MAX_DESCRIPTION_LENGTH
  ) {
    return false
  }
  if (b.uploaded_files !== undefined) {
    if (!Array.isArray(b.uploaded_files) || b.uploaded_files.length > MAX_FILES) {
      return false
    }
    for (const file of b.uploaded_files) {
      if (typeof file !== "object" || file === null) return false
      const f = file as Record<string, unknown>
      if (
        typeof f.storage_path !== "string" ||
        !f.storage_path.startsWith("pending/") ||
        typeof f.original_filename !== "string" ||
        typeof f.mime_type !== "string" ||
        typeof f.size_bytes !== "number"
      ) {
        return false
      }
    }
  }

  return true
}

Deno.serve(async (req) => {
  const optionsResponse = handleOptions(req)
  if (optionsResponse) return optionsResponse

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }

  if (!isValidBody(body)) {
    return new Response(
      JSON.stringify({ error: "Request failed validation" }),
      { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }

  const clientIp = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  )

  const rateLimitOk = await checkRateLimit(supabase, `submit-order:${clientIp ?? "unknown"}`, 5, 600)
  if (!rateLimitOk) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please wait a few minutes and try again." }),
      { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }

  const turnstileOk = await verifyTurnstile(body.turnstile_token, clientIp)
  if (!turnstileOk) {
    return new Response(
      JSON.stringify({ error: "Verification failed. Please reload and try again." }),
      { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }

  const { data, error } = await supabase.rpc("submit_order_request", {
    p_idempotency_key: body.idempotency_key,
    p_full_name: body.full_name,
    p_phone: body.phone,
    p_whatsapp_phone: body.whatsapp_phone ?? null,
    p_email: body.email ?? null,
    p_company_name: body.company_name ?? null,
    p_location: body.location ?? null,
    p_items: body.items,
    p_customer_description: body.customer_description ?? null,
    p_preferred_deadline: body.preferred_deadline ?? null,
    p_delivery_location: body.delivery_location ?? null,
    p_source: "website",
  })

  if (error) {
    console.error("submit_order_request failed", error)
    return new Response(
      JSON.stringify({ error: "We couldn't submit your request right now." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }

  const result = Array.isArray(data) ? data[0] : data

  if (body.uploaded_files && body.uploaded_files.length > 0) {
    const { error: filesError } = await supabase.from("order_files").insert(
      body.uploaded_files.map((f) => ({
        order_id: result.order_id,
        storage_path: f.storage_path,
        original_filename: f.original_filename,
        mime_type: f.mime_type,
        size_bytes: f.size_bytes,
      }))
    )
    if (filesError) {
      console.error("order_files insert failed", filesError)
    }
  }

  // Best-effort SMS notify — failure here must never fail the order itself.
  try {
    const { data: pending } = await supabase
      .from("notification_events")
      .select("id, recipient, template, payload")
      .eq("order_id", result.order_id)
      .eq("status", "pending")

    if (pending && pending.length > 0) {
      const provider = createNotificationProvider()
      for (const event of pending) {
        const payload = event.payload as { order_number?: string; customer_name?: string }
        const message = `NEW D&M ORDER\nOrder: ${payload.order_number}\nCustomer: ${payload.customer_name}\nPhone: ${body.phone}\nItems: ${body.items.length}\nSubmitted: ${new Date().toISOString()}`

        const result2 = await provider.sendSMS(event.recipient, message)

        await supabase
          .from("notification_events")
          .update({
            status: result2.ok ? "sent" : "failed",
            attempt_count: 1,
            last_attempt_at: new Date().toISOString(),
            error_message: result2.ok ? null : result2.error,
          })
          .eq("id", event.id)
      }
    }
  } catch (notifyErr) {
    console.error("notification dispatch failed", notifyErr)
  }

  return new Response(
    JSON.stringify({
      order_id: result.order_id,
      order_number: result.order_number,
    }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  )
})
