import "server-only"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

/**
 * Service-role client. Bypasses RLS — only ever import this from server-side
 * code (route handlers, server actions). The `server-only` import makes any
 * accidental client-component import a build error.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
