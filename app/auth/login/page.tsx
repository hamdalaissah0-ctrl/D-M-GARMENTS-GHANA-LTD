"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { LogoMark } from "@/components/layout/logo-mark"
import { signIn } from "@/lib/actions/auth"

const initialState = { error: undefined as string | undefined }

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(async (_prev: typeof initialState, formData: FormData) => {
    const result = await signIn(formData)
    return result ?? initialState
  }, initialState)

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-hero px-4 py-12 text-white">
      <Card className="w-full max-w-sm border-white/10 bg-white/5 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <LogoMark />
            <div>
              <p className="font-semibold text-white">D&amp;M Garments</p>
              <p className="text-xs text-white/60">Staff sign in</p>
            </div>
          </div>

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
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-white/80">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="border-white/15 bg-white/5 text-white"
              />
            </div>
            {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
            <Button type="submit" disabled={pending} className="w-full bg-brand-cta text-white">
              {pending ? <Loader2 className="size-4 animate-spin" /> : null}
              {pending ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <Link href="/" className="mt-6 block text-center text-xs text-white/50 hover:text-white">
            ← Back to the website
          </Link>
        </CardContent>
      </Card>
    </main>
  )
}
