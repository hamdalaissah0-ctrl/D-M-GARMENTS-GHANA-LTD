"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export interface CompanyProfileInput {
  company_name: string
  address: string | null
  phone_primary: string | null
  phone_secondary: string | null
  email: string | null
  whatsapp_number: string | null
  footer_text: string | null
  no_moq: boolean
  logo_url: string | null
}

export async function updateCompanyProfile(input: CompanyProfileInput) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { error } = await supabase
    .from("company_profile")
    .update({ ...input, updated_by: user?.id })
    .eq("id", 1)

  if (error) throw new Error(error.message)

  revalidatePath("/admin/settings")
  revalidatePath("/")
  revalidatePath("/about")
  revalidatePath("/contact")
}
