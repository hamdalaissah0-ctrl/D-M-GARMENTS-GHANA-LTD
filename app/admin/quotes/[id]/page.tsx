import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { QuoteStatusControls } from "@/components/admin/quote-status-controls"
import { createClient } from "@/lib/supabase/server"
import { getCompanyProfile } from "@/lib/supabase/queries"

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-secondary text-secondary-foreground",
  sent: "bg-amber-500/10 text-amber-700",
  accepted: "bg-primary/10 text-primary",
  rejected: "bg-destructive/10 text-destructive",
  expired: "bg-secondary text-secondary-foreground",
}

export default async function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const company = await getCompanyProfile()

  const [{ data: quote }, { data: items }] = await Promise.all([
    supabase.from("quotes").select("*, orders(order_number, customers(*))").eq("id", id).single(),
    supabase.from("quote_items").select("*").eq("quote_id", id).order("sort_order"),
  ])

  if (!quote) notFound()

  const customer = quote.orders?.customers

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{quote.quote_number}</h1>
          <Link href={`/admin/orders/${quote.order_id}`} className="text-sm text-primary hover:underline">
            {quote.orders?.order_number}
          </Link>
        </div>
        <Badge className={STATUS_COLORS[quote.status]}>{quote.status}</Badge>
      </div>

      <Card>
        <CardContent className="space-y-5 p-6">
          <div className="flex items-start justify-between text-sm">
            <div>
              <p className="font-semibold text-foreground">{company?.company_name}</p>
              <p className="text-muted-foreground">{company?.address}</p>
              <p className="text-muted-foreground">{company?.phone_primary}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-foreground">{customer?.full_name}</p>
              {customer?.company_name && <p className="text-muted-foreground">{customer.company_name}</p>}
              <p className="text-muted-foreground">{customer?.phone}</p>
            </div>
          </div>

          <div className="divide-y divide-border rounded-lg border border-border">
            {(items ?? []).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 text-sm">
                <div>
                  <p className="text-foreground">{item.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} × {quote.currency} {item.unit_price.toFixed(2)}
                  </p>
                </div>
                <p className="font-medium text-foreground">
                  {quote.currency} {item.line_total.toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-1 text-right text-sm">
            <p className="text-muted-foreground">
              Subtotal: {quote.currency} {quote.subtotal.toFixed(2)}
            </p>
            {quote.discount > 0 && (
              <p className="text-muted-foreground">
                Discount: -{quote.currency} {quote.discount.toFixed(2)}
              </p>
            )}
            {quote.tax > 0 && (
              <p className="text-muted-foreground">
                Tax: {quote.currency} {quote.tax.toFixed(2)}
              </p>
            )}
            <p className="text-lg font-semibold text-foreground">
              Total: {quote.currency} {quote.total.toFixed(2)}
            </p>
          </div>

          {quote.notes && (
            <div>
              <p className="text-sm font-medium text-foreground">Notes</p>
              <p className="text-sm text-muted-foreground">{quote.notes}</p>
            </div>
          )}

          <p className="text-xs text-muted-foreground">Valid for {quote.validity_days} days from issue.</p>

          <QuoteStatusControls quoteId={quote.id} status={quote.status} />
        </CardContent>
      </Card>
    </div>
  )
}
