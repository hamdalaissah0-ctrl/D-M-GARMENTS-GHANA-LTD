"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateStaffRole, toggleStaffActive } from "@/lib/actions/staff"
import type { Database } from "@/types/database"

type StaffRole = Database["public"]["Enums"]["staff_role"]

export function StaffRowControls({
  staffId,
  role,
  active,
  isSelf,
}: {
  staffId: string
  role: StaffRole
  active: boolean
  isSelf: boolean
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleRoleChange(value: string | null) {
    if (!value) return
    startTransition(async () => {
      try {
        await updateStaffRole(staffId, value as StaffRole)
        toast.success("Role updated")
        router.refresh()
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to update role")
      }
    })
  }

  function handleToggleActive() {
    startTransition(async () => {
      try {
        await toggleStaffActive(staffId, !active)
        toast.success(active ? "Staff deactivated" : "Staff activated")
        router.refresh()
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to update status")
      }
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={role} onValueChange={handleRoleChange} disabled={isPending || isSelf}>
        <SelectTrigger className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="super_admin">Super Admin</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="sales">Sales</SelectItem>
          <SelectItem value="production">Production</SelectItem>
          <SelectItem value="viewer">Viewer</SelectItem>
        </SelectContent>
      </Select>
      <Button
        size="sm"
        variant="outline"
        disabled={isPending || isSelf}
        onClick={handleToggleActive}
      >
        {active ? "Deactivate" : "Activate"}
      </Button>
    </div>
  )
}
