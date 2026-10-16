"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Phone, MessageCircle, Loader2, FileText, Download } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { OrderStatusBadge } from "@/components/admin/order-status-badge"
import { CreateQuoteDialog } from "@/components/admin/create-quote-dialog"
import { ORDER_STATUSES, ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/order-status"
import {
  updateOrderStatus,
  updateOrderPriority,
  assignOrder,
  setOrderFollowUp,
  addOrderNote,
  addCommunication,
} from "@/lib/actions/orders"
import type { Tables } from "@/types/database"

type Order = Tables<"orders"> & { customers: Tables<"customers"> | null }
type OrderItem = Tables<"order_items">
type OrderFile = Tables<"order_files"> & { signedUrl: string | null }
type OrderNote = Tables<"order_notes"> & { profiles: { full_name: string } | null }
type StatusHistoryRow = Tables<"order_status_history"> & { profiles: { full_name: string } | null }
type CommunicationRow = Tables<"communications"> & { profiles: { full_name: string } | null }
type NotificationRow = Tables<"notification_events">
type Profile = Tables<"profiles">

export function OrderWorkspace({
  order,
  items,
  files,
  notes,
  history,
  communications,
  notifications,
  staff,
}: {
  order: Order
  items: OrderItem[]
  files: OrderFile[]
  notes: OrderNote[]
  history: StatusHistoryRow[]
  communications: CommunicationRow[]
  notifications: NotificationRow[]
  staff: Profile[]
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [note, setNote] = useState("")
  const [commSummary, setCommSummary] = useState("")
  const [commOutcome, setCommOutcome] = useState("")
  const [commChannel, setCommChannel] = useState<"call" | "whatsapp" | "sms" | "email" | "in_person">("call")

  const customer = order.customers

  function handleStatusChange(status: string | null) {
    if (!status) return
    startTransition(async () => {
      try {
        await updateOrderStatus(order.id, status as OrderStatus)
        toast.success("Status updated")
        router.refresh()
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to update status")
      }
    })
  }

  function handleAssign(staffId: string | null) {
    if (!staffId) return
    startTransition(async () => {
      try {
        await assignOrder(order.id, staffId === "unassigned" ? null : staffId)
        toast.success("Assignment updated")
        router.refresh()
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to assign")
      }
    })
  }

  function handlePriority(priority: string | null) {
    if (!priority) return
    startTransition(async () => {
      try {
        await updateOrderPriority(order.id, priority as "normal" | "high" | "urgent")
        toast.success("Priority updated")
        router.refresh()
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to update priority")
      }
    })
  }

  function handleAddNote() {
    if (!note.trim()) return
    startTransition(async () => {
      try {
        await addOrderNote(order.id, note)
        setNote("")
        toast.success("Note added")
        router.refresh()
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to add note")
      }
    })
  }

  function handleAddCommunication() {
    if (!commSummary.trim() || !customer) return
    startTransition(async () => {
      try {
        await addCommunication(order.id, customer.id, commChannel, commSummary, commOutcome || null, null)
        setCommSummary("")
        setCommOutcome("")
        toast.success("Communication logged")
        router.refresh()
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to log communication")
      }
    })
  }

  function handleFollowUp(formData: FormData) {
    const date = String(formData.get("follow_up_date") ?? "")
    const reason = String(formData.get("follow_up_reason") ?? "")
    startTransition(async () => {
      try {
        await setOrderFollowUp(order.id, date ? new Date(date).toISOString() : null, reason || null)
        toast.success("Follow-up saved")
        router.refresh()
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to save follow-up")
      }
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        {/* Items */}
        <Card>
          <CardContent className="p-5">
            <h2 className="font-semibold text-foreground">Requested Items</h2>
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground">{item.product_name_snapshot}</p>
                    <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                  </div>
                  {item.product_description_snapshot && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.product_description_snapshot}
                    </p>
                  )}
                </div>
              ))}
            </div>
            {order.customer_description && (
              <div className="mt-4">
                <p className="text-sm font-medium text-foreground">Full Description</p>
                <p className="mt-1 text-sm whitespace-pre-wrap text-muted-foreground">
                  {order.customer_description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Files */}
        <Card>
          <CardContent className="p-5">
            <h2 className="font-semibold text-foreground">
              Reference Files {files.length > 0 && `(${files.length})`}
            </h2>
            {files.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">No files uploaded.</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {files.map((file) => (
                  <li
                    key={file.id}
                    className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <FileText className="size-4 shrink-0 text-muted-foreground" />
                      <span className="truncate text-sm text-foreground">{file.original_filename}</span>
                    </div>
                    {file.signedUrl && (
                      <a
                        href={file.signedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        <Download className="size-3.5" /> View
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Communications */}
        <Card>
          <CardContent className="p-5">
            <h2 className="font-semibold text-foreground">Communication Log</h2>
            <div className="mt-4 space-y-3 rounded-lg border border-border p-3">
              <div className="flex gap-2">
                <Select
                  value={commChannel}
                  onValueChange={(v) => v && setCommChannel(v as typeof commChannel)}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="call">Call</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="in_person">In Person</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Outcome (optional)"
                  value={commOutcome}
                  onChange={(e) => setCommOutcome(e.target.value)}
                />
              </div>
              <Textarea
                placeholder="What was discussed?"
                value={commSummary}
                onChange={(e) => setCommSummary(e.target.value)}
                rows={2}
              />
              <Button size="sm" onClick={handleAddCommunication} disabled={isPending || !commSummary.trim()}>
                {isPending ? <Loader2 className="size-4 animate-spin" /> : null} Log Communication
              </Button>
            </div>

            {communications.length > 0 && (
              <ul className="mt-4 space-y-3">
                {communications.map((c) => (
                  <li key={c.id} className="rounded-lg border border-border p-3 text-sm">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-medium text-foreground capitalize">{c.channel}</span>
                      <span>{new Date(c.occurred_at).toLocaleString()}</span>
                    </div>
                    <p className="mt-1 text-foreground">{c.summary}</p>
                    {c.outcome && <p className="mt-1 text-muted-foreground">Outcome: {c.outcome}</p>}
                    <p className="mt-1 text-xs text-muted-foreground">by {c.profiles?.full_name ?? "Staff"}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Internal notes */}
        <Card>
          <CardContent className="p-5">
            <h2 className="font-semibold text-foreground">Internal Notes</h2>
            <p className="text-xs text-muted-foreground">Never visible to the customer.</p>
            <div className="mt-3 flex gap-2">
              <Textarea
                placeholder="Add an internal note..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
              />
            </div>
            <Button size="sm" className="mt-2" onClick={handleAddNote} disabled={isPending || !note.trim()}>
              {isPending ? <Loader2 className="size-4 animate-spin" /> : null} Add Note
            </Button>

            {notes.length > 0 && (
              <ul className="mt-4 space-y-2">
                {notes.map((n) => (
                  <li key={n.id} className="rounded-lg bg-secondary/50 p-3 text-sm">
                    <p className="text-foreground">{n.note}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {n.profiles?.full_name ?? "Staff"} · {new Date(n.created_at).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Status history */}
        <Card>
          <CardContent className="p-5">
            <h2 className="font-semibold text-foreground">Status History</h2>
            <ol className="mt-4 space-y-3 border-l border-border pl-4">
              {history.map((h) => (
                <li key={h.id} className="relative text-sm">
                  <span className="absolute top-1.5 -left-[21px] size-2.5 rounded-full bg-primary" />
                  <p className="text-foreground">
                    {h.from_status ? ORDER_STATUS_LABELS[h.from_status as OrderStatus] + " → " : ""}
                    {ORDER_STATUS_LABELS[h.to_status as OrderStatus]}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {h.profiles?.full_name ?? "System"} · {new Date(h.changed_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {/* Customer */}
        <Card>
          <CardContent className="p-5">
            <h2 className="font-semibold text-foreground">Customer</h2>
            {customer ? (
              <CustomerSummary customer={customer} orderNumber={order.order_number} />
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">No customer linked.</p>
            )}
          </CardContent>
        </Card>

        {/* Status / priority / assignment */}
        <Card>
          <CardContent className="space-y-4 p-5">
            <div>
              <p className="text-sm font-medium text-foreground">Status</p>
              <div className="mt-1.5 flex items-center gap-2">
                <OrderStatusBadge status={order.status as OrderStatus} />
              </div>
              <Select value={order.status} onValueChange={handleStatusChange} disabled={isPending}>
                <SelectTrigger className="mt-2 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {ORDER_STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground">Priority</p>
              <Select value={order.priority} onValueChange={handlePriority} disabled={isPending}>
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground">Assigned To</p>
              <Select
                value={order.assigned_to ?? "unassigned"}
                onValueChange={handleAssign}
                disabled={isPending}
              >
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {staff.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification delivery */}
        {notifications.length > 0 && (
          <Card>
            <CardContent className="p-5">
              <h2 className="font-semibold text-foreground">Notifications</h2>
              <ul className="mt-3 space-y-2">
                {notifications.map((n) => (
                  <li key={n.id} className="flex items-start justify-between gap-3 text-sm">
                    <div className="min-w-0">
                      <p className="text-foreground capitalize">
                        {n.channel} to {n.recipient}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(n.created_at).toLocaleString()}
                      </p>
                      {n.status === "failed" && n.error_message && (
                        <p className="mt-0.5 text-xs text-destructive">{n.error_message}</p>
                      )}
                    </div>
                    <Badge
                      className={
                        n.status === "sent"
                          ? "bg-primary/10 text-primary"
                          : n.status === "failed"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-secondary text-secondary-foreground"
                      }
                    >
                      {n.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Quote */}
        <Card>
          <CardContent className="p-5">
            <h2 className="font-semibold text-foreground">Quote</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Generate a quotation once requirements are confirmed.
            </p>
            <div className="mt-3">
              <CreateQuoteDialog orderId={order.id} />
            </div>
          </CardContent>
        </Card>

        {/* Follow-up */}
        <Card>
          <CardContent className="p-5">
            <h2 className="font-semibold text-foreground">Follow-up</h2>
            <form action={handleFollowUp} className="mt-3 space-y-2">
              <Input
                type="date"
                name="follow_up_date"
                defaultValue={order.next_follow_up_at ? order.next_follow_up_at.slice(0, 10) : ""}
              />
              <Input
                name="follow_up_reason"
                placeholder="Reason"
                defaultValue={order.follow_up_reason ?? ""}
              />
              <Button size="sm" type="submit" disabled={isPending} className="w-full">
                Save Follow-up
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function CustomerSummary({
  customer,
  orderNumber,
}: {
  customer: Tables<"customers">
  orderNumber: string
}) {
  const whatsappNumber = (customer.whatsapp_phone ?? customer.phone ?? "").replace(/\D/g, "")
  const whatsappMessage = `Hello ${customer.full_name}, this is D&M Garments regarding your request ${orderNumber}.`

  return (
    <div className="mt-3 space-y-1.5 text-sm">
      <p className="font-medium text-foreground">{customer.full_name}</p>
      {customer.company_name && <p className="text-muted-foreground">{customer.company_name}</p>}
      <p className="text-muted-foreground">{customer.phone}</p>
      {customer.email && <p className="text-muted-foreground">{customer.email}</p>}
      {customer.location && <p className="text-muted-foreground">{customer.location}</p>}

      <div className="mt-4 flex gap-2">
        <Button
          size="sm"
          variant="outline"
          nativeButton={false}
          className="flex-1"
          render={
            <a href={`tel:${customer.phone}`}>
              <Phone className="size-4" /> Call
            </a>
          }
        />
        <Button
          size="sm"
          variant="outline"
          nativeButton={false}
          className="flex-1"
          render={
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="size-4" /> WhatsApp
            </a>
          }
        />
      </div>
      <Link
        href={`/admin/customers/${customer.id}`}
        className="mt-2 block text-center text-sm font-medium text-primary hover:underline"
      >
        View customer profile
      </Link>
    </div>
  )
}
