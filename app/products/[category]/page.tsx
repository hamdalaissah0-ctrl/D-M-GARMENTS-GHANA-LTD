import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { PageShell } from "@/components/marketing/page-shell"
import { ContentRequired } from "@/components/marketing/content-required"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { getCompanyProfile } from "@/lib/supabase/queries"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category: slug } = await params
  const supabase = await createClient()
  const { data: category } = await supabase
    .from("categories")
    .select("name, seo_title, seo_description, description")
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (!category) return {}

  return {
    title: category.seo_title ?? category.name,
    description: category.seo_description ?? category.description ?? undefined,
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category: slug } = await params
  const supabase = await createClient()
  const company = await getCompanyProfile()

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (!category) notFound()

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", category.id)
    .eq("status", "active")
    .order("sort_order", { ascending: true })

  return (
    <PageShell company={company} title={category.name} description={category.description ?? undefined}>
      {!products || products.length === 0 ? (
        <ContentRequired
          title="No products in this category yet"
          description="Products will appear here once added in the admin CMS."
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${category.slug}/${product.slug}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="p-5">
                  <p className="font-medium text-foreground">{product.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {product.short_description ?? "Content required"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  )
}
