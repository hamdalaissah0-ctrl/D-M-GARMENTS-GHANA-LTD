"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Loader2, Plus, Quote as QuoteIcon, Trash2 } from "lucide-react"
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
import { createQuote, type QuoteItemInput } from "@/lib/actions/quotes"

export function CreateQuoteDialog({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [items, setItems] = useState<QuoteItemInput[]>([{ description: "", quantity: 1, unit_price: 0 }])
  const [validityDays, setValidityDays] = useState("14")
  const [notes, setNotes] = useState("")

  function updateItem(index: number, patch: Partial<QuoteItemInput>) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  function handleSubmit() {
    const validItems = items.filter((i) => i.description.trim() && i.quantity > 0)
    if (validItems.length === 0) {
      toast.error("Add at least one line item")
      return
    }
    startTransition(async () => {
      try {
        await createQuote(orderId, validItems, parseInt(validityDays, 10) || 14, notes || null)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to create quote")
      }
    })
  }

  const total = items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" className="w-full">
            <QuoteIcon className="size-4" /> Create Quote
          </Button>
        }
      />
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Quote</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] space-y-4 overflow-y-auto">
          {items.map((item, index) => (
            <div key={index} className="space-y-2 rounded-lg border border-border p-3">
              <Input
                placeholder="Description"
                value={item.description}
                onChange={(e) => updateItem(index, { description: e.target.value })}
              />
              <div className="flex gap-2">
                <Input
                  type="number"
                  min={1}
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, { quantity: parseInt(e.target.value, 10) || 1 })}
                />
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="Unit price (GHS)"
                  value={item.unit_price}
                  onChange={(e) => updateItem(index, { unit_price: parseFloat(e.target.value) || 0 })}
                />
                {items.length > 1 && (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => setItems((prev) => prev.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setItems((prev) => [...prev, { description: "", quantity: 1, unit_price: 0 }])}
          >
            <Plus className="size-4" /> Add Line
          </Button>

          <div className="space-y-1.5">
            <Label>Validity (days)</Label>
            <Input
              type="number"
              min={1}
              value={validityDays}
              onChange={(e) => setValidityDays(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Notes (optional)</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
          </div>

          <p className="text-right text-sm font-semibold text-foreground">
            Total: GHS {total.toFixed(2)}
          </p>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isPending} className="bg-brand-cta text-white">
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null} Create Draft Quote
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
