// Fixed-window rate limiting backed by the check_rate_limit() Postgres
// function. Call this before any expensive/costly work (Turnstile
// verification, SMS dispatch) so a flood gets rejected cheaply.

interface RateLimitClient {
  rpc(
    fn: "check_rate_limit",
    args: { p_bucket_key: string; p_max_requests: number; p_window_seconds: number }
  ): Promise<{ data: boolean | null; error: unknown }>
}

export async function checkRateLimit(
  supabase: RateLimitClient,
  bucketKey: string,
  maxRequests: number,
  windowSeconds: number
): Promise<boolean> {
  const { data, error } = await supabase.rpc("check_rate_limit", {
    p_bucket_key: bucketKey,
    p_max_requests: maxRequests,
    p_window_seconds: windowSeconds,
  })

  if (error) {
    console.error("check_rate_limit failed", error)
    // Fail open — a rate-limiter outage must never take down real submissions.
    return true
  }

  return data === true
}
