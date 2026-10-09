"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { TablesUpdate } from "@/types/database"

export interface QuoteItemInput {
  description: string
  quantity: number
  unit_price: number
}

export async function createQuote(
  orderId: string,
  items: QuoteItemInput[],
  validityDays: number,
  notes: string | null
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)

  const { data: quote, error } = await supabase
    .from("quotes")
    .insert({
      order_id: orderId,
      status: "draft",
      subtotal,
      total: subtotal,
      validity_days: validityDays,
      notes,
      created_by: user.id,
    })
    .select("id")
    .single()

  if (error) throw new Error(error.message)

  const { error: itemsError } = await supabase.from("quote_items").insert(
    items.map((item, index) => ({
      quote_id: quote.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      line_total: item.quantity * item.unit_price,
      sort_order: index,
    }))
  )

  if (itemsError) throw new Error(itemsError.message)

  revalidatePath(`/admin/orders/${orderId}`)
  revalidatePath("/admin/quotes")
  redirect(`/admin/quotes/${quote.id}`)
}

export async function updateQuoteStatus(quoteId: string, status: "draft" | "sent" | "accepted" | "rejected" | "expired") {
  const supabase = await createClient()
  const payload: TablesUpdate<"quotes"> = { status }
  if (status === "sent") payload.sent_at = new Date().toISOString()
  if (status === "accepted") payload.accepted_at = new Date().toISOString()

  const { data: quote, error } = await supabase
    .from("quotes")
    .update(payload)
    .eq("id", quoteId)
    .select("order_id")
    .single()

  if (error) throw new Error(error.message)

  if (status === "accepted" && quote) {
    await supabase.from("orders").update({ status: "approved" }).eq("id", quote.order_id)
  }

  revalidatePath(`/admin/quotes/${quoteId}`)
  revalidatePath("/admin/quotes")
}
