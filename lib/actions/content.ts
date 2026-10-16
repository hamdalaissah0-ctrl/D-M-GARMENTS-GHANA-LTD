"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/types/database"

type ContentStatus = Database["public"]["Enums"]["content_status"]

// ---- Testimonials ----

export interface TestimonialInput {
  id?: string
  customer_name: string
  company_name: string | null
  quote: string
  rating: number | null
  status: ContentStatus
}

export async function upsertTestimonial(input: TestimonialInput) {
  const supabase = await createClient()
  const payload = {
    customer_name: input.customer_name,
    company_name: input.company_name,
    quote: input.quote,
    rating: input.rating,
    status: input.status,
  }

  const { error } = input.id
    ? await supabase.from("testimonials").update(payload).eq("id", input.id)
    : await supabase.from("testimonials").insert(payload)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/content")
  revalidatePath("/")
}

export async function deleteTestimonial(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("testimonials").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/content")
  revalidatePath("/")
}

// ---- FAQs ----

export interface FaqInput {
  id?: string
  question: string
  answer: string
  category: string | null
  status: ContentStatus
}

export async function upsertFaq(input: FaqInput) {
  const supabase = await createClient()
  const payload = {
    question: input.question,
    answer: input.answer,
    category: input.category,
    status: input.status,
  }

  const { error } = input.id
    ? await supabase.from("faqs").update(payload).eq("id", input.id)
    : await supabase.from("faqs").insert(payload)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/content")
  revalidatePath("/faq")
}

export async function deleteFaq(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("faqs").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/content")
  revalidatePath("/faq")
}

// ---- Portfolio projects ----

export interface PortfolioInput {
  id?: string
  title: string
  industry: string | null
  description: string | null
  year: number | null
  featured: boolean
  status: ContentStatus
  image_url: string | null
}

export async function upsertPortfolioProject(input: PortfolioInput) {
  const supabase = await createClient()
  const payload = {
    title: input.title,
    industry: input.industry,
    description: input.description,
    year: input.year,
    featured: input.featured,
    status: input.status,
  }

  let projectId = input.id

  if (projectId) {
    const { error } = await supabase.from("portfolio_projects").update(payload).eq("id", projectId)
    if (error) throw new Error(error.message)
  } else {
    const { data, error } = await supabase
      .from("portfolio_projects")
      .insert(payload)
      .select("id")
      .single()
    if (error) throw new Error(error.message)
    projectId = data.id
  }

  if (input.image_url) {
    const { data: existing } = await supabase
      .from("portfolio_images")
      .select("id")
      .eq("portfolio_project_id", projectId)
      .limit(1)

    if (existing && existing.length > 0) {
      await supabase
        .from("portfolio_images")
        .update({ storage_path: input.image_url })
        .eq("id", existing[0].id)
    } else {
      await supabase
        .from("portfolio_images")
        .insert({ portfolio_project_id: projectId, storage_path: input.image_url, sort_order: 0 })
    }
  }

  revalidatePath("/admin/content")
  revalidatePath("/portfolio")
}

export async function deletePortfolioProject(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("portfolio_projects").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/content")
  revalidatePath("/portfolio")
}
