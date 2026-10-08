import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { ContentRequired } from "@/components/marketing/content-required"
import { createClient } from "@/lib/supabase/server"
import { getCompanyProfile } from "@/lib/supabase/queries"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; product: string }>
}): Promise<Metadata> {
  const { product: slug } = await params
  const supabase = await createClient()
  const { data: product } = await supabase
    .from("products")
    .select("name, seo_title, seo_description, short_description")
    .eq("slug", slug)
    .eq("status", "active")
    .single()

  if (!product) return {}

  return {
    title: product.seo_title ?? product.name,
    description: product.seo_description ?? product.short_description ?? undefined,
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ category: string; product: string }>
}) {
  const { product: slug } = await params
  const supabase = await createClient()
  const company = await getCompanyProfile()

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .single()

  if (!product) notFound()

  const [{ data: images }, { data: options }] = await Promise.all([
    supabase
      .from("product_images")
      .select("*")
      .eq("product_id", product.id)
      .order("sort_order", { ascending: true }),
    supabase
      .from("product_options")
      .select("*")
      .eq("product_id", product.id)
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
  ])

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            {!images || images.length === 0 ? (
              <ContentRequired
                title="Product photography required"
                description="Images will appear here once supplied by D&M."
              />
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {images.map((img) => (
                  // Storage URLs are resolved via the admin CMS upload pipeline.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={img.id}
                    src={img.storage_path}
                    alt={img.alt_text ?? product.name}
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                {product.name}
              </h1>
              <p className="mt-3 text-muted-foreground">
                {product.description ?? product.short_description ?? "Content required"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground">Minimum quantity</p>
              <p className="text-sm text-muted-foreground">
                {product.minimum_quantity
                  ? `${product.minimum_quantity} units`
                  : "No minimum quantity specified"}
              </p>
            </div>

            {options && options.length > 0 && (
              <div>
                <p className="text-sm font-medium text-foreground">Available customisation</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {options.map((opt) => (
                    <span
                      key={opt.id}
                      className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                    >
                      {opt.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Button size="lg" nativeButton={false} render={<Link href="/order">Request This Product</Link>} />
          </div>
        </div>
      </main>
      <SiteFooter company={company} />
    </>
  )
}
