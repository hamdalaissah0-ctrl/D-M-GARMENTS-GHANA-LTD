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
import { upsertFaq, type FaqInput } from "@/lib/actions/content"
import type { Tables } from "@/types/database"

export function FaqFormDialog({ faq }: { faq?: Tables<"faqs"> }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const [question, setQuestion] = useState(faq?.question ?? "")
  const [answer, setAnswer] = useState(faq?.answer ?? "")
  const [category, setCategory] = useState(faq?.category ?? "")
  const [status, setStatus] = useState<FaqInput["status"]>(faq?.status ?? "draft")

  function handleSubmit() {
    if (!question.trim() || !answer.trim()) {
      toast.error("Question and answer are required")
      return
    }
    startTransition(async () => {
      try {
        await upsertFaq({
          id: faq?.id,
          question,
          answer,
          category: category || null,
          status,
        })
        toast.success(faq ? "FAQ updated" : "FAQ created")
        setOpen(false)
        router.refresh()
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to save FAQ")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            size={faq ? "icon" : "default"}
            variant={faq ? "ghost" : "default"}
            className={faq ? "" : "bg-brand-cta text-white"}
          >
            {faq ? <Pencil className="size-4" /> : <><Plus className="size-4" /> New FAQ</>}
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{faq ? "Edit FAQ" : "New FAQ"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Question</Label>
            <Input value={question} onChange={(e) => setQuestion(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Answer</Label>
            <Textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={4} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Category (optional)</Label>
              <Input value={category ?? ""} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => v && setStatus(v as FaqInput["status"])}>
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
