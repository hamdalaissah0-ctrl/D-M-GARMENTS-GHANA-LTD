"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { OrderStatus } from "@/lib/order-status"
import type { Database } from "@/types/database"

type CommunicationChannel = Database["public"]["Enums"]["communication_channel"]
type OrderPriority = Database["public"]["Enums"]["order_priority"]

async function requireStaff() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")
  return { supabase, userId: user.id }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const { supabase } = await requireStaff()
  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/orders/${orderId}`)
  revalidatePath("/admin/orders")
  revalidatePath("/admin")
}

export async function updateOrderPriority(orderId: string, priority: OrderPriority) {
  const { supabase } = await requireStaff()
  const { error } = await supabase.from("orders").update({ priority }).eq("id", orderId)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/orders/${orderId}`)
}

export async function assignOrder(orderId: string, assignedTo: string | null) {
  const { supabase } = await requireStaff()
  const { error } = await supabase.from("orders").update({ assigned_to: assignedTo }).eq("id", orderId)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/orders/${orderId}`)
  revalidatePath("/admin/orders")
}

export async function setOrderFollowUp(orderId: string, followUpAt: string | null, reason: string | null) {
  const { supabase } = await requireStaff()
  const { error } = await supabase
    .from("orders")
    .update({ next_follow_up_at: followUpAt, follow_up_reason: reason })
    .eq("id", orderId)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/orders/${orderId}`)
}

export async function addOrderNote(orderId: string, note: string) {
  const { supabase, userId } = await requireStaff()
  if (!note.trim()) throw new Error("Note cannot be empty")
  const { error } = await supabase.from("order_notes").insert({ order_id: orderId, staff_id: userId, note })
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/orders/${orderId}`)
}

export async function addCommunication(
  orderId: string,
  customerId: string,
  channel: CommunicationChannel,
  summary: string,
  outcome: string | null,
  nextAction: string | null
) {
  const { supabase, userId } = await requireStaff()
  if (!summary.trim()) throw new Error("Summary cannot be empty")
  const { error } = await supabase.from("communications").insert({
    order_id: orderId,
    customer_id: customerId,
    staff_id: userId,
    channel,
    summary,
    outcome,
    next_action: nextAction,
  })
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/orders/${orderId}`)
}
