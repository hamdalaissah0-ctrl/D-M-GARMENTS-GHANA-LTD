import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { OrderStatusBadge } from "@/components/admin/order-status-badge"
import { getAdminDashboardStats, getRecentOrders } from "@/lib/supabase/queries"
import { Inbox, Clock, Quote, Factory, CheckCircle2 } from "lucide-react"
import type { OrderStatus } from "@/lib/order-status"

export default async function AdminDashboardPage() {
  const [stats, recentOrders] = await Promise.all([getAdminDashboardStats(), getRecentOrders()])

  const cards = [
    { label: "New Orders", value: stats.newOrders, icon: Inbox, href: "/admin/orders?status=new" },
    { label: "Pending Follow-ups", value: stats.pendingFollowUps, icon: Clock, href: "/admin/orders" },
    { label: "Quotes Pending", value: stats.quotesPending, icon: Quote, href: "/admin/quotes" },
    { label: "In Production", value: stats.inProduction, icon: Factory, href: "/admin/orders?status=in_production" },
    { label: "Completed", value: stats.completed, icon: CheckCircle2, href: "/admin/orders?status=completed" },
  ]

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-brand-cta text-white">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-3xl font-bold text-foreground">{value}</span>
                </div>
                <p className="mt-3 text-sm font-medium text-muted-foreground">{label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="font-semibold text-foreground">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between gap-4 p-4 hover:bg-secondary/40"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{order.order_number}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {order.customers?.full_name ?? "Unknown customer"}
                      {order.customers?.company_name ? ` · ${order.customers.company_name}` : ""}
                    </p>
                  </div>
                  <OrderStatusBadge status={order.status as OrderStatus} />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
