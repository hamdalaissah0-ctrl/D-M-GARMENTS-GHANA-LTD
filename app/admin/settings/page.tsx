import { redirect } from "next/navigation"
import { CompanySettingsForm } from "@/components/admin/company-settings-form"
import { getCompanyProfile, getCurrentStaffProfile } from "@/lib/supabase/queries"

export default async function AdminSettingsPage() {
  const profile = await getCurrentStaffProfile()
  if (!profile || (profile.role !== "super_admin" && profile.role !== "admin")) {
    redirect("/admin")
  }

  const company = await getCompanyProfile()
  if (!company) return null

  return (
    <div>
      <h1 className="mb-5 text-lg font-semibold text-foreground">Company Settings</h1>
      <CompanySettingsForm company={company} />
    </div>
  )
}
