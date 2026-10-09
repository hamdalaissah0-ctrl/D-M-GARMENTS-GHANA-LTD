import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function AdminProductsPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name)")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button size="sm" nativeButton={false} className="bg-brand-cta text-white" render={<Link href="/admin/products/new"><Plus className="size-4" /> New Product</Link>} />
      </div>

      <Card>
        <CardContent className="p-0">
          {!products || products.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">
              No products yet — add your first product to populate the public catalogue.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}`}
                  className="flex items-center justify-between gap-3 p-4 hover:bg-secondary/40"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {product.categories?.name ?? "Uncategorised"}
                      {product.featured ? " · Featured" : ""}
                    </p>
                  </div>
                  <Badge
                    className={
                      product.status === "active"
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary text-secondary-foreground"
                    }
                  >
                    {product.status}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
