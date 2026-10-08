import type { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"

const STATIC_ROUTES = [
  "",
  "/products",
  "/services",
  "/industries",
  "/portfolio",
  "/about",
  "/contact",
  "/faq",
  "/order",
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  const supabase = await createClient()

  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from("categories").select("slug, updated_at").eq("status", "published"),
    supabase
      .from("products")
      .select("slug, updated_at, categories(slug)")
      .eq("status", "active"),
  ])

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }))

  const categoryEntries: MetadataRoute.Sitemap = (categories ?? []).map((c) => ({
    url: `${siteUrl}/products/${c.slug}`,
    lastModified: c.updated_at ? new Date(c.updated_at) : new Date(),
  }))

  const productEntries: MetadataRoute.Sitemap = (products ?? [])
    .filter((p) => p.categories?.slug)
    .map((p) => ({
      url: `${siteUrl}/products/${p.categories!.slug}/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    }))

  return [...staticEntries, ...categoryEntries, ...productEntries]
}
