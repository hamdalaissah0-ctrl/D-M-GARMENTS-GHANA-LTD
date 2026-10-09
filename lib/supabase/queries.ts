import { createClient } from "@/lib/supabase/server"
import type { Tables } from "@/types/database"

export type Profile = Tables<"profiles">
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

export async function getCurrentStaffProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
  return data
}

export type OrderWithCustomer = Tables<"orders"> & {
  customers: Pick<Tables<"customers">, "full_name" | "company_name" | "phone"> | null
}

export async function getAdminDashboardStats() {
  const supabase = await createClient()

  const [newOrders, pendingFollowUps, quotesPending, inProduction, completed] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .lte("next_follow_up_at", new Date().toISOString())
      .not("next_follow_up_at", "is", null),
    supabase.from("quotes").select("id", { count: "exact", head: true }).in("status", ["draft", "sent"]),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "in_production"),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "completed"),
  ])

  return {
    newOrders: newOrders.count ?? 0,
    pendingFollowUps: pendingFollowUps.count ?? 0,
    quotesPending: quotesPending.count ?? 0,
    inProduction: inProduction.count ?? 0,
    completed: completed.count ?? 0,
  }
}

export async function getRecentOrders(limit = 8): Promise<OrderWithCustomer[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("orders")
    .select("*, customers(full_name, company_name, phone)")
    .order("created_at", { ascending: false })
    .limit(limit)
  return (data as OrderWithCustomer[]) ?? []
}

export async function getStaffProfiles(): Promise<Profile[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("active", true)
    .order("full_name", { ascending: true })
  return data ?? []
}

export interface OrderListFilters {
  status?: string
  search?: string
}

export async function getOrdersList(filters: OrderListFilters) {
  const supabase = await createClient()
  let query = supabase
    .from("orders")
    .select("*, customers(full_name, company_name, phone), profiles:assigned_to(full_name)")
    .order("created_at", { ascending: false })

  if (filters.status) {
    query = query.eq("status", filters.status as never)
  }

  const { data } = await query.limit(200)
  let rows = data ?? []

  if (filters.search) {
    const needle = filters.search.toLowerCase()
    rows = rows.filter(
      (r) =>
        r.order_number.toLowerCase().includes(needle) ||
        r.customers?.full_name?.toLowerCase().includes(needle) ||
        r.customers?.company_name?.toLowerCase().includes(needle) ||
        r.customers?.phone?.toLowerCase().includes(needle)
    )
  }

  return rows
}

export async function getOrderDetail(orderId: string) {
  const supabase = await createClient()

  const [{ data: order }, { data: items }, { data: files }, { data: notes }, { data: history }, { data: communications }] =
    await Promise.all([
      supabase.from("orders").select("*, customers(*)").eq("id", orderId).single(),
      supabase.from("order_items").select("*").eq("order_id", orderId).order("sort_order"),
      supabase.from("order_files").select("*").eq("order_id", orderId).order("uploaded_at"),
      supabase
        .from("order_notes")
        .select("*, profiles(full_name)")
        .eq("order_id", orderId)
        .order("created_at", { ascending: false }),
      supabase
        .from("order_status_history")
        .select("*, profiles(full_name)")
        .eq("order_id", orderId)
        .order("changed_at", { ascending: false }),
      supabase
        .from("communications")
        .select("*, profiles(full_name)")
        .eq("order_id", orderId)
        .order("occurred_at", { ascending: false }),
    ])

  if (!order) return null

  return { order, items: items ?? [], files: files ?? [], notes: notes ?? [], history: history ?? [], communications: communications ?? [] }
}

export async function getOrderFileSignedUrl(storagePath: string): Promise<string | null> {
  const supabase = await createClient()
  const { data } = await supabase.storage
    .from("customer-order-files")
    .createSignedUrl(storagePath, 60 * 10)
  return data?.signedUrl ?? null
}

export async function getCustomersList(search?: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(300)
  let rows = data ?? []
  if (search) {
    const needle = search.toLowerCase()
    rows = rows.filter(
      (r) =>
        r.full_name.toLowerCase().includes(needle) ||
        r.phone?.toLowerCase().includes(needle) ||
        r.company_name?.toLowerCase().includes(needle) ||
        r.email?.toLowerCase().includes(needle)
    )
  }
  return rows
}

export async function getCustomerDetail(customerId: string) {
  const supabase = await createClient()
  const [{ data: customer }, { data: orders }, { data: communications }] = await Promise.all([
    supabase.from("customers").select("*").eq("id", customerId).single(),
    supabase.from("orders").select("*").eq("customer_id", customerId).order("created_at", { ascending: false }),
    supabase
      .from("communications")
      .select("*, profiles(full_name)")
      .eq("customer_id", customerId)
      .order("occurred_at", { ascending: false }),
  ])
  if (!customer) return null
  return { customer, orders: orders ?? [], communications: communications ?? [] }
}
