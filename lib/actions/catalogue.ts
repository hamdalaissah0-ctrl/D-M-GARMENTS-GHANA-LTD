"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { slugify } from "@/lib/slugify"
import type { Database } from "@/types/database"

type ContentStatus = Database["public"]["Enums"]["content_status"]
type ProductStatus = Database["public"]["Enums"]["product_status"]

export interface CategoryInput {
  id?: string
  name: string
  description: string | null
  image_url: string | null
  status: ContentStatus
}

export async function upsertCategory(input: CategoryInput) {
  const supabase = await createClient()
  const slug = slugify(input.name)
  const payload = {
    name: input.name,
    slug,
    description: input.description,
    image_url: input.image_url,
    status: input.status,
  }

  const { error } = input.id
    ? await supabase.from("categories").update(payload).eq("id", input.id)
    : await supabase.from("categories").insert(payload)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/categories")
  revalidatePath("/products")
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("categories").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/categories")
}

export interface ProductInput {
  id?: string
  category_id: string | null
  name: string
  short_description: string | null
  description: string | null
  status: ProductStatus
  featured: boolean
  minimum_quantity: number | null
  image_url: string | null
}

export async function upsertProduct(input: ProductInput) {
  const supabase = await createClient()
  const slug = slugify(input.name)
  const payload = {
    category_id: input.category_id,
    name: input.name,
    slug,
    short_description: input.short_description,
    description: input.description,
    status: input.status,
    featured: input.featured,
    minimum_quantity: input.minimum_quantity,
  }

  let productId = input.id

  if (productId) {
    const { error } = await supabase.from("products").update(payload).eq("id", productId)
    if (error) throw new Error(error.message)
  } else {
    const { data, error } = await supabase.from("products").insert(payload).select("id").single()
    if (error) throw new Error(error.message)
    productId = data.id
  }

  if (input.image_url) {
    const { data: existing } = await supabase
      .from("product_images")
      .select("id")
      .eq("product_id", productId)
      .limit(1)

    if (existing && existing.length > 0) {
      await supabase.from("product_images").update({ storage_path: input.image_url }).eq("id", existing[0].id)
    } else {
      await supabase
        .from("product_images")
        .insert({ product_id: productId, storage_path: input.image_url, sort_order: 0 })
    }
  }

  revalidatePath("/admin/products")
  revalidatePath("/products")
  redirect("/admin/products")
}

export async function archiveProduct(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("products").update({ status: "archived" }).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/products")
  revalidatePath("/products")
}
