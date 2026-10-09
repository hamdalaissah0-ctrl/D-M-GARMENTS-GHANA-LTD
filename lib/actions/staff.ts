"use server"

import { revalidatePath } from "next/cache"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/types/database"

type StaffRole = Database["public"]["Enums"]["staff_role"]

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (!profile || (profile.role !== "super_admin" && profile.role !== "admin")) {
    throw new Error("Only admins can manage staff")
  }
}

function generateTempPassword(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(18))
  return btoa(String.fromCharCode(...bytes)).replace(/[+/=]/g, "").slice(0, 16)
}

export async function inviteStaff(fullName: string, email: string, role: StaffRole) {
  await requireAdmin()
  const admin = createAdminClient()

  const tempPassword = generateTempPassword()

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
  })

  if (createError || !created.user) {
    throw new Error(createError?.message ?? "Failed to create staff account")
  }

  const { error: profileError } = await admin.from("profiles").insert({
    id: created.user.id,
    full_name: fullName,
    role,
    active: true,
  })

  if (profileError) {
    await admin.auth.admin.deleteUser(created.user.id)
    throw new Error(profileError.message)
  }

  revalidatePath("/admin/staff")
  return { email, tempPassword }
}

export async function updateStaffRole(staffId: string, role: StaffRole) {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await supabase.from("profiles").update({ role }).eq("id", staffId)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/staff")
}

export async function toggleStaffActive(staffId: string, active: boolean) {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await supabase.from("profiles").update({ active }).eq("id", staffId)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/staff")
}
