import { createClient } from "jsr:@supabase/supabase-js@2"
import { corsHeaders, handleOptions } from "../_shared/cors.ts"
import { verifyTurnstile } from "../_shared/turnstile.ts"
import { createNotificationProvider } from "../_shared/notifications.ts"

interface SubmitContactBody {
  full_name: string
  email?: string
  phone?: string
  message: string
  turnstile_token?: string
}

function isValidBody(body: unknown): body is SubmitContactBody {
  if (typeof body !== "object" || body === null) return false
  const b = body as Record<string, unknown>
  return (
    typeof b.full_name === "string" &&
    b.full_name.trim().length > 0 &&
    typeof b.message === "string" &&
    b.message.trim().length > 0 &&
    b.message.length < 4000
  )
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
  const turnstileOk = await verifyTurnstile(body.turnstile_token, clientIp)
  if (!turnstileOk) {
    return new Response(
      JSON.stringify({ error: "Verification failed. Please reload and try again." }),
      { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  )

  const { data, error } = await supabase.rpc("submit_contact_request", {
    p_full_name: body.full_name,
    p_email: body.email ?? null,
    p_phone: body.phone ?? null,
    p_message: body.message,
    p_source: "website",
  })

  if (error) {
    console.error("submit_contact_request failed", error)
    return new Response(
      JSON.stringify({ error: "We couldn't submit your message right now." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }

  // Best-effort SMS notify — failure here must never fail the contact submission.
  try {
    const { data: pending } = await supabase
      .from("notification_events")
      .select("id, recipient, template, payload")
      .eq("contact_submission_id", data)
      .eq("status", "pending")

    if (pending && pending.length > 0) {
      const provider = createNotificationProvider()
      for (const event of pending) {
        const payload = event.payload as { full_name?: string; message?: string }
        const message = `NEW D&M CONTACT MESSAGE\nFrom: ${payload.full_name}\nPhone: ${body.phone ?? "n/a"}\nMessage: ${payload.message}\nSubmitted: ${new Date().toISOString()}`

        const result = await provider.sendSMS(event.recipient, message)

        await supabase
          .from("notification_events")
          .update({
            status: result.ok ? "sent" : "failed",
            attempt_count: 1,
            last_attempt_at: new Date().toISOString(),
            error_message: result.ok ? null : result.error,
          })
          .eq("id", event.id)
      }
    }
  } catch (notifyErr) {
    console.error("notification dispatch failed", notifyErr)
  }

  return new Response(JSON.stringify({ id: data }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  })
})
