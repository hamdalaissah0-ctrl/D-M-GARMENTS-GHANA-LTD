import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { OrderStatusBadge } from "@/components/admin/order-status-badge"
import { getOrdersList } from "@/lib/supabase/queries"
import { ORDER_STATUSES, ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/order-status"
import { cn } from "cn"

export default async function OrdersListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>
}) {
  const params = await searchParams
  const orders = await getOrdersList({ status: params.status, search: params.q })

  return (
    <div className="space-y-5">
      <form className="flex flex-wrap gap-3">
        <Input
          name="q"
          defaultValue={params.q}
          placeholder="Search order number, customer, phone..."
          className="max-w-sm"
        />
        {params.status && <input type="hidden" name="status" value={params.status} />}
        <Button type="submit" variant="outline">
          Search
        </Button>
      </form>

      <div className="flex flex-wrap gap-2">
        <Link href="/admin/orders">
          <Button size="sm" variant={!params.status ? "default" : "outline"} className={!params.status ? "bg-brand-cta text-white" : ""}>
            All
          </Button>
        </Link>
        {ORDER_STATUSES.map((status) => (
          <Link key={status} href={`/admin/orders?status=${status}`}>
            <Button
              size="sm"
              variant={params.status === status ? "default" : "outline"}
              className={cn(params.status === status && "bg-brand-cta text-white")}
            >
              {ORDER_STATUS_LABELS[status]}
            </Button>
          </Link>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">No orders match.</p>
          ) : (
            <div className="divide-y divide-border">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 p-4 hover:bg-secondary/40"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{order.order_number}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {order.customers?.full_name ?? "Unknown customer"}
                      {order.customers?.company_name ? ` · ${order.customers.company_name}` : ""}
                      {order.customers?.phone ? ` · ${order.customers.phone}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {order.profiles?.full_name && (
                      <span className="text-xs text-muted-foreground">
                        Assigned: {order.profiles.full_name}
                      </span>
                    )}
                    <OrderStatusBadge status={order.status as OrderStatus} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
