"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { track } from "@vercel/analytics"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Plus, Trash2, UploadCloud, Loader2, CheckCircle2 } from "lucide-react"

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
import {
  orderRequestSchema,
  type OrderRequestFormInput,
  type OrderRequestInput,
} from "@/lib/validation/order"
import {
  uploadOrderReferenceFile,
  validateFile,
  type UploadedFile,
} from "@/lib/supabase/upload"
import { TurnstileWidget } from "@/components/shared/turnstile-widget"

export function OrderForm() {
  const idempotencyKey = useMemo(() => crypto.randomUUID(), [])
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ orderNumber: string } | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

  const form = useForm<OrderRequestFormInput, unknown, OrderRequestInput>({
    resolver: zodResolver(orderRequestSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      whatsapp_phone: "",
      email: "",
      company_name: "",
      location: "",
      items: [{ product_name: "", product_description: "", quantity: 1 }],
      customer_description: "",
      preferred_deadline: "",
      delivery_location: "",
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  })

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ""
    if (files.length === 0) return

    if (uploadedFiles.length + files.length > 10) {
      toast.error("You can upload up to 10 files.")
      return
    }

    for (const file of files) {
      const validationError = validateFile(file)
      if (validationError) {
        toast.error(validationError)
        continue
      }
      setUploading(true)
      try {
        const uploaded = await uploadOrderReferenceFile(idempotencyKey, file)
        setUploadedFiles((prev) => [...prev, uploaded])
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Upload failed")
      } finally {
        setUploading(false)
      }
    }
  }

  function removeFile(path: string) {
    setUploadedFiles((prev) => prev.filter((f) => f.storage_path !== path))
  }

  async function onSubmit(values: OrderRequestInput) {
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
            full_name: values.full_name,
            phone: values.phone,
            whatsapp_phone: values.whatsapp_phone || undefined,
            email: values.email || undefined,
            company_name: values.company_name || undefined,
            location: values.location || undefined,
            items: values.items,
            customer_description: values.customer_description,
            preferred_deadline: values.preferred_deadline || undefined,
            delivery_location: values.delivery_location || undefined,
            uploaded_files: uploadedFiles,
            turnstile_token: turnstileToken,
          }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error ?? "Submission failed")
      }

      setResult({ orderNumber: data.order_number })
      track("order_submitted", { source: "full_rfq_form", item_count: values.items.length })
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "We couldn't submit your request right now. Your information has not been lost — please try again or contact D&M directly."
      )
      setTurnstileToken(null)
    } finally {
      setSubmitting(false)
    }
  }

  if (result) {
    return (
      <Card className="mx-auto max-w-xl">
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <CheckCircle2 className="size-10 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">
            Your request has been received.
          </h2>
          <p className="text-sm text-muted-foreground">
            Request number: <span className="font-medium text-foreground">{result.orderNumber}</span>
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Our team will review your request and contact you using the details you provided.
          </p>
          <Link href="/track" className="text-sm font-medium text-primary hover:underline">
            Track your request status
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto max-w-3xl space-y-10">
        {/* Items */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">What do you need?</h2>
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardContent className="grid gap-4 p-5 sm:grid-cols-[1fr_auto]">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`items.${index}.product_name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product / Service</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Hospitality Shirt" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            name={field.name}
                            onBlur={field.onBlur}
                            ref={field.ref}
                            disabled={field.disabled}
                            value={typeof field.value === "number" || typeof field.value === "string" ? field.value : ""}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="sm:col-span-2">
                    <FormField
                      control={form.control}
                      name={`items.${index}.product_description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Colours, fabric, branding (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="White body, green collar, embroidery on chest" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="self-start text-muted-foreground"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ product_name: "", product_description: "", quantity: 1 })}
          >
            <Plus className="size-4" /> Add another item
          </Button>
        </section>

        {/* Description */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Tell us what you need</h2>
          <FormField
            control={form.control}
            name="customer_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Requirements</FormLabel>
                <FormControl>
                  <Textarea
                    rows={5}
                    placeholder="Describe the colour, material, branding, sizes, placement of logos, intended use, deadline, or any other requirements."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* Upload */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Upload Reference Designs</h2>
          <label
            htmlFor="file-upload"
            className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-border bg-secondary/30 px-6 py-10 text-center transition-colors hover:bg-secondary/50"
          >
            <UploadCloud className="size-6 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Drag and drop or click to upload JPG, PNG, WEBP or PDF (max 15 MB each)
            </span>
            <input
              id="file-upload"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,application/pdf"
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>
          {uploading && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Uploading...
            </p>
          )}
          {uploadedFiles.length > 0 && (
            <ul className="space-y-2">
              {uploadedFiles.map((f) => (
                <li
                  key={f.storage_path}
                  className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
                >
                  <span className="truncate">{f.original_filename}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(f.storage_path)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Customer details */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Your details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
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
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="whatsapp_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp number (optional)</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              name="company_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <TurnstileWidget onVerify={setTurnstileToken} onExpire={() => setTurnstileToken(null)} />

        <Button
          type="submit"
          size="lg"
          disabled={submitting || uploading || !turnstileToken}
          className="w-full sm:w-auto"
        >
          {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
          {submitting ? "Submitting..." : "Submit Request"}
        </Button>
      </form>
    </Form>
  )
}
