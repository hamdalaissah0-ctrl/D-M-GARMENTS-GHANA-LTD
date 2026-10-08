import type { Metadata } from "next"
import Link from "next/link"
import { PageShell } from "@/components/marketing/page-shell"
import { ContentRequired } from "@/components/marketing/content-required"
import { Card, CardContent } from "@/components/ui/card"
import { getCompanyProfile, getPublishedCategories } from "@/lib/supabase/queries"

export const metadata: Metadata = {
  title: "Products",
  description: "Browse uniform and garment manufacturing categories from D&M Garments Ghana Limited.",
}

export default async function ProductsPage() {
  const [company, categories] = await Promise.all([
    getCompanyProfile(),
    getPublishedCategories(),
  ])

  return (
    <PageShell
      company={company}
      title="Products"
      description="Browse our manufacturing categories, or request a quote for something custom."
    >
      {categories.length === 0 ? (
        <ContentRequired
          title="Catalogue not published yet"
          description="Product categories will appear here once added in the admin CMS. You can still submit a custom manufacturing request."
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.id} href={`/products/${category.slug}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="p-5">
                  <p className="font-medium text-foreground">{category.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {category.description ?? "Content required"}
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
