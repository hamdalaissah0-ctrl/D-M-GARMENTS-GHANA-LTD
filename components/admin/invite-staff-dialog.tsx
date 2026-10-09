"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, UserPlus, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { inviteStaff } from "@/lib/actions/staff"
import type { Database } from "@/types/database"

type StaffRole = Database["public"]["Enums"]["staff_role"]

export function InviteStaffDialog() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<StaffRole>("viewer")
  const [credentials, setCredentials] = useState<{ email: string; tempPassword: string } | null>(null)

  function handleSubmit() {
    if (!fullName.trim() || !email.trim()) {
      toast.error("Name and email are required")
      return
    }
    startTransition(async () => {
      try {
        const result = await inviteStaff(fullName, email, role)
        setCredentials(result)
        router.refresh()
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to create staff account")
      }
    })
  }

  function handleClose(next: boolean) {
    setOpen(next)
    if (!next) {
      setFullName("")
      setEmail("")
      setRole("viewer")
      setCredentials(null)
    }
  }

  function copyCredentials() {
    if (!credentials) return
    navigator.clipboard.writeText(`Email: ${credentials.email}\nTemporary password: ${credentials.tempPassword}`)
    toast.success("Copied to clipboard")
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger
        render={
          <Button className="bg-brand-cta text-white">
            <UserPlus className="size-4" /> Add Staff
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{credentials ? "Staff Account Created" : "Add Staff"}</DialogTitle>
        </DialogHeader>

        {credentials ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Share these credentials with the new staff member. This password won&apos;t be shown again.
            </p>
            <div className="space-y-1 rounded-lg bg-secondary/50 p-3 text-sm">
              <p>
                <span className="font-medium text-foreground">Email:</span> {credentials.email}
              </p>
              <p>
                <span className="font-medium text-foreground">Password:</span> {credentials.tempPassword}
              </p>
            </div>
            <Button variant="outline" onClick={copyCredentials} className="w-full">
              <Copy className="size-4" /> Copy Credentials
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => v && setRole(v as StaffRole)}>
                <SelectTrigger className="w-full">
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
            </div>
          </div>
        )}

        <DialogFooter>
          {!credentials && (
            <Button onClick={handleSubmit} disabled={isPending} className="bg-brand-cta text-white">
              {isPending ? <Loader2 className="size-4 animate-spin" /> : null} Create Account
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
