import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { OrderStatusBadge } from "@/components/admin/order-status-badge"
import { getCustomerDetail } from "@/lib/supabase/queries"
import type { OrderStatus } from "@/lib/order-status"

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const detail = await getCustomerDetail(id)
  if (!detail) notFound()

  const { customer, orders, communications } = detail

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardContent className="p-5">
          <h1 className="text-lg font-semibold text-foreground">{customer.full_name}</h1>
          <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            {customer.company_name && <p>{customer.company_name}</p>}
            <p>{customer.phone}</p>
            {customer.whatsapp_phone && <p>WhatsApp: {customer.whatsapp_phone}</p>}
            {customer.email && <p>{customer.email}</p>}
            {customer.location && <p>{customer.location}</p>}
          </div>
          {customer.notes && (
            <div className="mt-4">
              <p className="text-sm font-medium text-foreground">Notes</p>
              <p className="mt-1 text-sm text-muted-foreground">{customer.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardContent className="p-5">
            <h2 className="font-semibold text-foreground">Orders ({orders.length})</h2>
            {orders.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">No orders yet.</p>
            ) : (
              <div className="mt-3 divide-y divide-border">
                {orders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between py-3 hover:bg-secondary/30"
                  >
                    <div>
                      <p className="font-medium text-foreground">{order.order_number}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <OrderStatusBadge status={order.status as OrderStatus} />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h2 className="font-semibold text-foreground">Communications ({communications.length})</h2>
            {communications.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">No communications logged yet.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {communications.map((c) => (
                  <li key={c.id} className="rounded-lg border border-border p-3 text-sm">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-medium text-foreground capitalize">{c.channel}</span>
                      <span>{new Date(c.occurred_at).toLocaleString()}</span>
                    </div>
                    <p className="mt-1 text-foreground">{c.summary}</p>
                    <p className="mt-1 text-xs text-muted-foreground">by {c.profiles?.full_name ?? "Staff"}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
