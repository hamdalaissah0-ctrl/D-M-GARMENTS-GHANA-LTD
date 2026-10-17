"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { track } from "@vercel/analytics"
import { toast } from "sonner"
import { CheckCircle2, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { TurnstileWidget } from "@/components/shared/turnstile-widget"

const contactSchema = z.object({
  full_name: z.string().trim().min(2, "Full name is required"),
  email: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
  phone: z.string().trim().optional(),
  message: z.string().trim().min(10, "Tell us a bit more").max(4000),
})

type ContactInput = z.infer<typeof contactSchema>

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { full_name: "", email: "", phone: "", message: "" },
  })

  async function onSubmit(values: ContactInput) {
    if (!turnstileToken) {
      toast.error("Please complete the verification check below")
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/submit-contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          },
          body: JSON.stringify({
            full_name: values.full_name,
            email: values.email || undefined,
            phone: values.phone || undefined,
            message: values.message,
            turnstile_token: turnstileToken,
          }),
        }
      )
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? "Submission failed")
      }
      setSent(true)
      track("contact_submitted")
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "We couldn't send your message right now. Please try again or contact D&M directly."
      )
      setTurnstileToken(null)
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <CheckCircle2 className="size-8 text-primary" />
          <p className="font-medium text-foreground">Message sent.</p>
          <p className="text-sm text-muted-foreground">
            Our team will get back to you using the details you provided.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email (optional)</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone (optional)</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <TurnstileWidget onVerify={setTurnstileToken} onExpire={() => setTurnstileToken(null)} />
        <Button type="submit" disabled={submitting || !turnstileToken}>
          {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
          {submitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </Form>
  )
}
