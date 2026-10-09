import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-secondary text-secondary-foreground",
  sent: "bg-amber-500/10 text-amber-700",
  accepted: "bg-primary/10 text-primary",
  rejected: "bg-destructive/10 text-destructive",
  expired: "bg-secondary text-secondary-foreground",
}

export default async function AdminQuotesPage() {
  const supabase = await createClient()
  const { data: quotes } = await supabase
    .from("quotes")
    .select("*, orders(order_number, customers(full_name, company_name))")
    .order("created_at", { ascending: false })

  return (
    <Card>
      <CardContent className="p-0">
        {!quotes || quotes.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            No quotes yet — create one from an order&apos;s detail page.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {quotes.map((quote) => (
              <Link
                key={quote.id}
                href={`/admin/quotes/${quote.id}`}
                className="flex items-center justify-between gap-3 p-4 hover:bg-secondary/40"
              >
                <div>
                  <p className="font-medium text-foreground">{quote.quote_number}</p>
                  <p className="text-sm text-muted-foreground">
                    {quote.orders?.order_number} · {quote.orders?.customers?.full_name}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">
                    {quote.currency} {quote.total.toFixed(2)}
                  </span>
                  <Badge className={STATUS_COLORS[quote.status]}>{quote.status}</Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
