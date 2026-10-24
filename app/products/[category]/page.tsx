import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { SampleGallery } from "@/components/marketing/sample-gallery"
import { QuickOrderForm } from "@/components/order/quick-order-form"
import { getCategoryWithGallery, getCompanyProfile } from "@/lib/supabase/queries"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category: slug } = await params
  const result = await getCategoryWithGallery(slug)
  if (!result) return {}
  return {
    title: result.category.seo_title ?? result.category.name,
    description: result.category.seo_description ?? result.category.description ?? undefined,
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category: slug } = await params
  const [result, company] = await Promise.all([getCategoryWithGallery(slug), getCompanyProfile()])

  if (!result) notFound()
  const { category, images } = result

  const galleryImages =
    images.length > 0
      ? images
      : category.image_url
        ? [{ storage_path: category.image_url, alt_text: category.name }]
        : []

  return (
    <>
      <SiteHeader phone={company?.phone_primary} />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <SampleGallery images={galleryImages} alt={category.name} />

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {category.name}
              </h1>
              <p className="mt-3 text-muted-foreground">
                {category.description ?? "Content required"}
              </p>

              <div className="mt-8 border-t border-border pt-8">
                <QuickOrderForm
                  categoryName={category.name}
                  availableSizes={category.available_sizes ?? []}
                  company={company}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter company={company} />
    </>
  )
}
