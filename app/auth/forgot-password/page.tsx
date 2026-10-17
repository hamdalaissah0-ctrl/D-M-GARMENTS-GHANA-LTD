"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { LogoMark } from "@/components/layout/logo-mark"
import { requestPasswordReset } from "@/lib/actions/auth"

const initialState = { error: undefined as string | undefined, sent: false }

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(async (_prev: typeof initialState, formData: FormData) => {
    const result = await requestPasswordReset(formData)
    return { error: result.error, sent: !!result.sent }
  }, initialState)

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-hero px-4 py-12 text-white">
      <Card className="w-full max-w-sm border-white/10 bg-white/5 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <LogoMark />
            <div>
              <p className="font-semibold text-white">D&amp;M Garments</p>
              <h1 className="text-xs text-white/60">Reset your password</h1>
            </div>
          </div>

          {state.sent ? (
            <div className="mt-8 space-y-3 text-center text-sm text-white/80">
              <p>If an account exists for that email, a password reset link has been sent.</p>
              <p className="text-white/50">Check your inbox and follow the link to set a new password.</p>
            </div>
          ) : (
            <form action={formAction} className="mt-8 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-white/80">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
                />
              </div>
              {state.error && <p className="text-sm text-red-400">{state.error}</p>}
              <Button type="submit" disabled={pending} className="w-full bg-brand-cta text-white">
                {pending ? <Loader2 className="size-4 animate-spin" /> : null}
                {pending ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          )}

          <Link href="/auth/login" className="mt-6 block text-center text-xs text-white/50 hover:text-white">
            ← Back to sign in
          </Link>
        </CardContent>
      </Card>
    </main>
  )
}
