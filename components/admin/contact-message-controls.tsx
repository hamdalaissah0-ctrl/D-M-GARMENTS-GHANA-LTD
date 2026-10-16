"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { setContactHandled } from "@/lib/actions/messages"

export function ContactMessageControls({ id, handled }: { id: string; handled: boolean }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function toggle() {
    startTransition(async () => {
      try {
        await setContactHandled(id, !handled)
        toast.success(handled ? "Marked as unhandled" : "Marked as handled")
        router.refresh()
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to update")
      }
    })
  }

  return (
    <Button size="sm" variant="outline" disabled={isPending} onClick={toggle}>
      {handled ? "Mark unhandled" : "Mark handled"}
    </Button>
  )
}
