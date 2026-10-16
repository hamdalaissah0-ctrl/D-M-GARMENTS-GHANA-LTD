"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

async function requireStaff() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")
  return { supabase, userId: user.id }
}

export async function setContactHandled(id: string, handled: boolean) {
  const { supabase, userId } = await requireStaff()
  const { error } = await supabase
    .from("contact_submissions")
    .update({ handled, handled_by: handled ? userId : null })
    .eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/messages")
  revalidatePath("/admin")
}
