"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LogoMark } from "@/components/layout/logo-mark"
import { createClient } from "@/lib/supabase/client"

export default function ConfirmPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-brand-hero px-4 py-12 text-white">
          <Loader2 className="size-6 animate-spin" />
        </main>
      }
    >
      <ConfirmPageContent />
    </Suspense>
  )
}

function ConfirmPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tokenHash = searchParams.get("token_hash")
  const type = searchParams.get("type")

  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  const missingParams = !tokenHash || type !== "recovery"

  async function handleConfirm() {
    if (!tokenHash) return
    setPending(true)
    setError(undefined)

    const supabase = createClient()
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "recovery",
    })

    if (error) {
      setError("This password reset link is invalid or has expired. Request a new one from the sign-in page.")
      setPending(false)
      return
    }

    router.replace("/auth/update-password")
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-hero px-4 py-12 text-white">
      <Card className="w-full max-w-sm border-white/10 bg-white/5 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <LogoMark className="mx-auto" />
          <div className="mt-4">
            <p className="font-semibold text-white">D&amp;M Garments</p>
            <h1 className="mt-1 text-sm text-white/80">
              {missingParams
                ? "This password reset link is invalid or has expired. Request a new one from the sign-in page."
                : "Confirm you'd like to reset your password."}
            </h1>
          </div>
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
          {!missingParams && (
            <Button
              type="button"
              disabled={pending}
              onClick={handleConfirm}
              className="mt-6 w-full bg-brand-cta text-white"
            >
              {pending ? <Loader2 className="size-4 animate-spin" /> : null}
              {pending ? "Confirming..." : "Reset my password"}
            </Button>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
