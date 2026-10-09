"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { updateQuoteStatus } from "@/lib/actions/quotes"

export function QuoteStatusControls({ quoteId, status }: { quoteId: string; status: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function transition(next: "sent" | "accepted" | "rejected") {
    startTransition(async () => {
      try {
        await updateQuoteStatus(quoteId, next)
        toast.success(`Quote marked as ${next}`)
        router.refresh()
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to update quote")
      }
    })
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status === "draft" && (
        <Button size="sm" disabled={isPending} onClick={() => transition("sent")} className="bg-brand-cta text-white">
          Mark as Sent
        </Button>
      )}
      {status === "sent" && (
        <>
          <Button size="sm" disabled={isPending} onClick={() => transition("accepted")} className="bg-brand-cta text-white">
            Mark Accepted
          </Button>
          <Button size="sm" variant="outline" disabled={isPending} onClick={() => transition("rejected")}>
            Mark Rejected
          </Button>
        </>
      )}
    </div>
  )
}
