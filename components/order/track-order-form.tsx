"use client"

import { useState } from "react"
import { toast } from "sonner"
import { CheckCircle2, Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { TurnstileWidget } from "@/components/shared/turnstile-widget"
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/order-status"

interface TrackResult {
  order_number: string
  status: OrderStatus
  created_at: string
  preferred_deadline: string | null
  item_count: number
  history: { status: OrderStatus; changed_at: string }[]
}

export function TrackOrderForm() {
  const [orderNumber, setOrderNumber] = useState("")
  const [phone, setPhone] = useState("")
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<TrackResult | null>(null)
  const [notFound, setNotFound] = useState(false)

  async function handleSubmit() {
    if (!orderNumber.trim() || !phone.trim()) {
      toast.error("Enter your order number and phone number")
      return
    }
    if (!turnstileToken) {
      toast.error("Please complete the verification check below")
      return
    }
    setSubmitting(true)
    setResult(null)
    setNotFound(false)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/track-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          },
          body: JSON.stringify({ order_number: orderNumber, phone, turnstile_token: turnstileToken }),
        }
      )
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 404) {
          setNotFound(true)
        } else {
          toast.error(data.error ?? "We couldn't look up that request right now.")
        }
        setTurnstileToken(null)
        return
      }
      setResult(data as TrackResult)
    } catch {
      toast.error("We couldn't look up that request right now. Please try again.")
      setTurnstileToken(null)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="track-order-number">Order number</Label>
              <Input
                id="track-order-number"
                className="mt-1.5"
                placeholder="DM-2026-000123"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="track-phone">Phone number</Label>
              <Input
                id="track-phone"
                className="mt-1.5"
                type="tel"
                placeholder="The number you submitted with"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          <TurnstileWidget onVerify={setTurnstileToken} onExpire={() => setTurnstileToken(null)} />
          <Button onClick={handleSubmit} disabled={submitting || !turnstileToken}>
            {submitting ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
            {submitting ? "Looking up..." : "Track Request"}
          </Button>
        </CardContent>
      </Card>

      {notFound && (
        <Card>
          <CardContent className="p-5 text-sm text-muted-foreground">
            No request found with that order number and phone number. Double-check both and try
            again, or contact D&amp;M directly if you need help.
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-foreground">{result.order_number}</h2>
              <span className="text-sm font-medium text-primary">
                {ORDER_STATUS_LABELS[result.status]}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Submitted {new Date(result.created_at).toLocaleDateString()} ·{" "}
              {result.item_count} item{result.item_count === 1 ? "" : "s"}
              {result.preferred_deadline
                ? ` · Needed by ${new Date(result.preferred_deadline).toLocaleDateString()}`
                : ""}
            </p>

            <ol className="mt-6 space-y-4 border-l border-border pl-4">
              {result.history.map((h, i) => (
                <li key={i} className="relative text-sm">
                  <span
                    className={`absolute top-1.5 -left-[21px] size-2.5 rounded-full ${
                      i === result.history.length - 1 ? "bg-primary" : "bg-border"
                    }`}
                  />
                  <p className="flex items-center gap-1.5 text-foreground">
                    {i === result.history.length - 1 && (
                      <CheckCircle2 className="size-4 text-primary" />
                    )}
                    {ORDER_STATUS_LABELS[h.status]}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(h.changed_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
