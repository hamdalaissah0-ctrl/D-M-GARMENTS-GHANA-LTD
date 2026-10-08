import { createClient } from "@/lib/supabase/server"
import type { Tables } from "@/types/database"

export type CompanyProfile = Tables<"company_profile">
export type Category = Tables<"categories">
export type Product = Tables<"products">
export type Testimonial = Tables<"testimonials">
export type PortfolioProject = Tables<"portfolio_projects">
export type Faq = Tables<"faqs">

export async function getCompanyProfile(): Promise<CompanyProfile | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("company_profile")
    .select("*")
    .eq("id", 1)
    .single()
  return data
}

export async function getPublishedCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
  return data ?? []
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("status", "active")
    .eq("featured", true)
    .order("sort_order", { ascending: true })
    .limit(6)
  return data ?? []
}

export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
  return data ?? []
}

export async function getFeaturedPortfolio(): Promise<PortfolioProject[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("portfolio_projects")
    .select("*")
    .eq("status", "published")
    .eq("featured", true)
    .order("sort_order", { ascending: true })
  return data ?? []
}

export async function getPublishedFaqs(): Promise<Faq[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("faqs")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
  return data ?? []
}
