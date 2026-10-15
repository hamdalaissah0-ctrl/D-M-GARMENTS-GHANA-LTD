import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { PageShell } from "@/components/marketing/page-shell"
import { ContentRequired } from "@/components/marketing/content-required"
import { getCompanyProfile, getPublishedCategories } from "@/lib/supabase/queries"

export const metadata: Metadata = {
  title: "Services",
  description: "Browse uniform and garment manufacturing services from D&M Garments Ghana Limited.",
}

export default async function ProductsPage() {
  const [company, categories] = await Promise.all([
    getCompanyProfile(),
    getPublishedCategories(),
  ])

  return (
    <PageShell
      company={company}
      title="Our Services"
      description="Tap a service to view samples, choose your size and quantity, and submit your request."
    >
      {categories.length === 0 ? (
        <ContentRequired
          title="Catalogue not published yet"
          description="Services will appear here once added in the admin CMS. You can still submit a custom manufacturing request."
        />
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products/${category.slug}`}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-border shadow-sm transition-shadow hover:shadow-lg"
            >
              {category.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-secondary" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-base font-semibold text-white">{category.name}</p>
                <span className="mt-1 inline-flex items-center gap-1 text-xs text-white/75">
                  View Samples <ArrowUpRight className="size-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  )
}
