import type { Database } from "@/types/database"

export type OrderStatus = Database["public"]["Enums"]["order_status"]

export const ORDER_STATUSES: OrderStatus[] = [
  "new",
  "reviewing",
  "contact_required",
  "contacted",
  "requirements_confirmed",
  "quotation_pending",
  "quotation_sent",
  "negotiating",
  "approved",
  "production_pending",
  "in_production",
  "quality_check",
  "ready",
  "completed",
  "cancelled",
  "archived",
]

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: "New",
  reviewing: "Reviewing",
  contact_required: "Contact Required",
  contacted: "Contacted",
  requirements_confirmed: "Requirements Confirmed",
  quotation_pending: "Quotation Pending",
  quotation_sent: "Quotation Sent",
  negotiating: "Negotiating",
  approved: "Approved",
  production_pending: "Production Pending",
  in_production: "In Production",
  quality_check: "Quality Check",
  ready: "Ready",
  completed: "Completed",
  cancelled: "Cancelled",
  archived: "Archived",
}

export const ORDER_STATUS_TONE: Record<OrderStatus, "neutral" | "info" | "warning" | "success" | "danger"> = {
  new: "info",
  reviewing: "info",
  contact_required: "warning",
  contacted: "info",
  requirements_confirmed: "info",
  quotation_pending: "warning",
  quotation_sent: "warning",
  negotiating: "warning",
  approved: "success",
  production_pending: "info",
  in_production: "info",
  quality_check: "warning",
  ready: "success",
  completed: "success",
  cancelled: "danger",
  archived: "neutral",
}
