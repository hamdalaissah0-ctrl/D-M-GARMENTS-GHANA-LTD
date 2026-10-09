import { notFound } from "next/navigation"
import { ProductForm } from "@/components/admin/product-form"
import { createClient } from "@/lib/supabase/server"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: product }, { data: categories }, { data: images }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).single(),
    supabase.from("categories").select("*").order("name"),
    supabase.from("product_images").select("*").eq("product_id", id).order("sort_order").limit(1),
  ])

  if (!product) notFound()

  return (
    <div>
      <h1 className="mb-5 text-lg font-semibold text-foreground">Edit Product</h1>
      <ProductForm
        product={product}
        categories={categories ?? []}
        currentImageUrl={images?.[0]?.storage_path ?? null}
      />
    </div>
  )
}
