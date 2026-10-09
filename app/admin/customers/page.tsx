import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getCustomersList } from "@/lib/supabase/queries"

export default async function CustomersListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const customers = await getCustomersList(q)

  return (
    <div className="space-y-5">
      <form className="flex flex-wrap gap-3">
        <Input name="q" defaultValue={q} placeholder="Search name, phone, company, email..." className="max-w-sm" />
        <Button type="submit" variant="outline">
          Search
        </Button>
      </form>

      <Card>
        <CardContent className="p-0">
          {customers.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">No customers yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {customers.map((c) => (
                <Link
                  key={c.id}
                  href={`/admin/customers/${c.id}`}
                  className="flex items-center justify-between gap-3 p-4 hover:bg-secondary/40"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{c.full_name}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {c.company_name ? `${c.company_name} · ` : ""}
                      {c.phone}
                      {c.email ? ` · ${c.email}` : ""}
                    </p>
                  </div>
                  <span className="text-xs whitespace-nowrap text-muted-foreground">
                    Since {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
