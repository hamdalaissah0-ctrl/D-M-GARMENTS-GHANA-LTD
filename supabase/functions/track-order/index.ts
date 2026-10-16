import { createClient } from "jsr:@supabase/supabase-js@2"
import { corsHeaders, handleOptions } from "../_shared/cors.ts"
import { verifyTurnstile } from "../_shared/turnstile.ts"

interface TrackOrderBody {
  order_number: string
  phone: string
  turnstile_token?: string
}

function isValidBody(body: unknown): body is TrackOrderBody {
  if (typeof body !== "object" || body === null) return false
  const b = body as Record<string, unknown>
  return (
    typeof b.order_number === "string" &&
    b.order_number.trim().length > 0 &&
    typeof b.phone === "string" &&
    b.phone.trim().length >= 9
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
      JSON.stringify({ error: "Enter the order number and phone number you submitted." }),
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

  const { data, error } = await supabase.rpc("track_order_request", {
    p_order_number: body.order_number,
    p_phone: body.phone,
  })

  if (error) {
    console.error("track_order_request failed", error)
    return new Response(
      JSON.stringify({ error: "We couldn't look up that request right now." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }

  const result = Array.isArray(data) ? data[0] : data

  if (!result) {
    return new Response(
      JSON.stringify({ error: "No request found with that order number and phone number." }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  })
})
