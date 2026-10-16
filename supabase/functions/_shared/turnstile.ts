// Server-side Cloudflare Turnstile verification. The widget token alone
// proves nothing — it must be checked against Cloudflare's siteverify
// endpoint with the secret key before any mutation is trusted.
// https://developers.cloudflare.com/turnstile/get-started/server-side-validation/

export async function verifyTurnstile(
  token: unknown,
  remoteIp?: string | null
): Promise<boolean> {
  if (typeof token !== "string" || token.length === 0) return false

  const secret = Deno.env.get("TURNSTILE_SECRET_KEY")
  if (!secret) {
    console.error("TURNSTILE_SECRET_KEY is not configured")
    return false
  }

  const formData = new FormData()
  formData.append("secret", secret)
  formData.append("response", token)
  if (remoteIp) formData.append("remoteip", remoteIp)

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: formData }
    )
    const data = await res.json()
    return data.success === true
  } catch (err) {
    console.error("Turnstile verification request failed", err)
    return false
  }
}
