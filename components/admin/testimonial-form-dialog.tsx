"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, Plus, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { upsertTestimonial, type TestimonialInput } from "@/lib/actions/content"
import type { Tables } from "@/types/database"

export function TestimonialFormDialog({ testimonial }: { testimonial?: Tables<"testimonials"> }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const [customerName, setCustomerName] = useState(testimonial?.customer_name ?? "")
  const [companyName, setCompanyName] = useState(testimonial?.company_name ?? "")
  const [quote, setQuote] = useState(testimonial?.quote ?? "")
  const [rating, setRating] = useState(testimonial?.rating?.toString() ?? "5")
  const [status, setStatus] = useState<TestimonialInput["status"]>(testimonial?.status ?? "draft")

  function handleSubmit() {
    if (!customerName.trim() || !quote.trim()) {
      toast.error("Customer name and quote are required")
      return
    }
    startTransition(async () => {
      try {
        await upsertTestimonial({
          id: testimonial?.id,
          customer_name: customerName,
          company_name: companyName || null,
          quote,
          rating: rating ? parseInt(rating, 10) : null,
          status,
        })
        toast.success(testimonial ? "Testimonial updated" : "Testimonial created")
        setOpen(false)
        router.refresh()
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to save testimonial")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            size={testimonial ? "icon" : "default"}
            variant={testimonial ? "ghost" : "default"}
            className={testimonial ? "" : "bg-brand-cta text-white"}
          >
            {testimonial ? <Pencil className="size-4" /> : <><Plus className="size-4" /> New Testimonial</>}
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{testimonial ? "Edit Testimonial" : "New Testimonial"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Customer Name</Label>
            <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Company (optional)</Label>
            <Input value={companyName ?? ""} onChange={(e) => setCompanyName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Quote</Label>
            <Textarea value={quote} onChange={(e) => setQuote(e.target.value)} rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Rating (1-5)</Label>
              <Input type="number" min={1} max={5} value={rating} onChange={(e) => setRating(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => v && setStatus(v as TestimonialInput["status"])}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isPending} className="bg-brand-cta text-white">
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null} Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
