import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminTopbar } from "@/components/admin/admin-topbar"
import { getCurrentStaffProfile } from "@/lib/supabase/queries"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const profile = await getCurrentStaffProfile()

  if (!profile) {
    redirect("/auth/login")
  }

  if (!profile.active) {
    redirect("/auth/login?error=inactive")
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar profile={profile} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar profile={profile} />
        <main className="flex-1 overflow-x-hidden bg-secondary/20 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
