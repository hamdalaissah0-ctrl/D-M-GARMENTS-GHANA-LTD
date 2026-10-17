"use client"

import { useActionState, useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { LogoMark } from "@/components/layout/logo-mark"
import { createClient } from "@/lib/supabase/client"
import { updatePassword } from "@/lib/actions/auth"

const initialState = { error: undefined as string | undefined }

export default function UpdatePasswordPage() {
  const [state, formAction, pending] = useActionState(async (_prev: typeof initialState, formData: FormData) => {
    const result = await updatePassword(formData)
    return result ?? initialState
  }, initialState)

  // The reset-password email link carries a recovery token in the URL.
  // Instantiating the browser client processes it and establishes the
  // session cookie the server action below needs to actually update it.
  const [ready, setReady] = useState(false)
  const [linkError, setLinkError] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setReady(true)
      } else {
        setLinkError(true)
      }
    })
  }, [])

  if (linkError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-hero px-4 py-12 text-white">
        <Card className="w-full max-w-sm border-white/10 bg-white/5 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <LogoMark className="mx-auto" />
            <h1 className="mt-4 text-sm text-white/80">
              This password reset link is invalid or has expired. Request a new one from the sign-in page.
            </h1>
          </CardContent>
        </Card>
      </main>
    )
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-hero px-4 py-12 text-white">
        <Loader2 className="size-6 animate-spin" />
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-hero px-4 py-12 text-white">
      <Card className="w-full max-w-sm border-white/10 bg-white/5 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <LogoMark />
            <div>
              <p className="font-semibold text-white">D&amp;M Garments</p>
              <h1 className="text-xs text-white/60">Set a new password</h1>
            </div>
          </div>

          <form action={formAction} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-white/80">
                New password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="border-white/15 bg-white/5 text-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-white/80">
                Confirm new password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="border-white/15 bg-white/5 text-white"
              />
            </div>
            {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
            <Button type="submit" disabled={pending} className="w-full bg-brand-cta text-white">
              {pending ? <Loader2 className="size-4 animate-spin" /> : null}
              {pending ? "Saving..." : "Save New Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
