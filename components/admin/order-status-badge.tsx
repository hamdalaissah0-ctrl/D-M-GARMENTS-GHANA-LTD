import { Badge } from "@/components/ui/badge"
import { cn } from "cn"
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONE, type OrderStatus } from "@/lib/order-status"

const TONE_CLASSES: Record<string, string> = {
  neutral: "bg-secondary text-secondary-foreground",
  info: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  warning: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  success: "bg-primary/10 text-primary",
  danger: "bg-destructive/10 text-destructive",
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge className={cn("border-transparent font-medium", TONE_CLASSES[ORDER_STATUS_TONE[status]])}>
      {ORDER_STATUS_LABELS[status]}
    </Badge>
  )
}
