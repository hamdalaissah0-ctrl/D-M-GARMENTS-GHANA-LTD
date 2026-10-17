"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { track } from "@vercel/analytics"
import { toast } from "sonner"
import { Phone, MessageCircle, Minus, Plus, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "cn"
import { TurnstileWidget } from "@/components/shared/turnstile-widget"
import type { CompanyProfile } from "@/lib/supabase/queries"

export function QuickOrderForm({
  categoryName,
  availableSizes,
  company,
}: {
  categoryName: string
  availableSizes: string[]
  company: CompanyProfile | null
}) {
  const idempotencyKey = useMemo(() => crypto.randomUUID(), [])
  const [size, setSize] = useState<string | null>(availableSizes[0] ?? null)
  const [quantity, setQuantity] = useState(50)
  const [details, setDetails] = useState("")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

  async function handleSubmit() {
    if (!fullName.trim() || !phone.trim()) {
      toast.error("Please enter your name and phone number")
      return
    }
    if (!turnstileToken) {
      toast.error("Please complete the verification check below")
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/submit-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          },
          body: JSON.stringify({
            idempotency_key: idempotencyKey,
            full_name: fullName,
            phone,
            items: [
              {
                product_name: categoryName,
                quantity,
                product_description: size ? `Size: ${size}` : undefined,
              },
            ],
            customer_description: [size ? `Size: ${size}` : null, details].filter(Boolean).join("\n"),
            turnstile_token: turnstileToken,
          }),
        }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Submission failed")
      setResult(data.order_number)
      track("order_submitted", { category: categoryName, quantity })
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : "We couldn't submit your request right now. Please try again or contact D&M directly."
      )
      setTurnstileToken(null)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Contact D&M directly */}
      {(company?.phone_primary || company?.whatsapp_number) && (
        <div className="flex gap-3">
          {company?.phone_primary && (
            <Button
              variant="outline"
              nativeButton={false}
              className="flex-1"
              render={
                <a href={`tel:${company.phone_primary}`} onClick={() => track("phone_clicked", { source: "quick_order", category: categoryName })}>
                  <Phone className="size-4" /> Call Us
                </a>
              }
            />
          )}
          {company?.whatsapp_number && (
            <Button
              variant="outline"
              nativeButton={false}
              className="flex-1 border-primary/30 text-primary hover:bg-primary/5"
              render={
                <a
                  href={`https://wa.me/${company.whatsapp_number.replace(/\D/g, "")}?text=${encodeURIComponent(
                    `Hello D&M Garments, I'd like to ask about ${categoryName}.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => track("whatsapp_clicked", { source: "quick_order", category: categoryName })}
                >
                  <MessageCircle className="size-4" /> WhatsApp
                </a>
              }
            />
          )}
        </div>
      )}

      {/* Size */}
      {availableSizes.length > 0 && (
        <div>
          <p className="text-sm font-medium text-foreground">Size</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {availableSizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={cn(
                  "rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors",
                  size === s
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <p className="text-sm font-medium text-foreground">Quantity</p>
        <div className="mt-2 flex items-center gap-3">
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => setQuantity((q) => Math.max(1, q - 10))}
          >
            <Minus className="size-4" />
          </Button>
          <Input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
            className="w-24 text-center"
          />
          <Button type="button" size="icon" variant="outline" onClick={() => setQuantity((q) => q + 10)}>
            <Plus className="size-4" />
          </Button>
        </div>
      </div>

      {/* Details */}
      <div>
        <p className="text-sm font-medium text-foreground">Colours, branding & other details</p>
        <Textarea
          className="mt-2"
          rows={3}
          placeholder="E.g. navy and white, embroider our school crest on the chest..."
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
      </div>

      {/* Contact details */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="quick-order-full-name">Your name</Label>
          <Input id="quick-order-full-name" className="mt-1.5" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="quick-order-phone">Phone number</Label>
          <Input
            id="quick-order-phone"
            className="mt-1.5"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>

      <TurnstileWidget onVerify={setTurnstileToken} onExpire={() => setTurnstileToken(null)} />

      <Button
        size="lg"
        className="w-full bg-brand-cta text-white"
        disabled={submitting || !turnstileToken}
        onClick={handleSubmit}
      >
        {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
        {submitting ? "Submitting..." : "Submit Order"}
      </Button>

      <Dialog open={!!result} onOpenChange={(open) => !open && setResult(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="sr-only">Order submitted</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <CheckCircle2 className="size-12 text-primary" />
            <p className="text-lg font-semibold text-foreground">Your order has been submitted!</p>
            <p className="text-sm text-muted-foreground">
              Order number: <span className="font-medium text-foreground">{result}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Our team will review your request and contact you using the details you provided.
            </p>
            <Link href="/track" className="text-sm font-medium text-primary hover:underline">
              Track your request status
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
