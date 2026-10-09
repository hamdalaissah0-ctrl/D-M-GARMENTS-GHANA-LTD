import { ProductForm } from "@/components/admin/product-form"
import { createClient } from "@/lib/supabase/server"

export default async function NewProductPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  return (
    <div>
      <h1 className="mb-5 text-lg font-semibold text-foreground">New Product</h1>
      <ProductForm categories={categories ?? []} />
    </div>
  )
}
