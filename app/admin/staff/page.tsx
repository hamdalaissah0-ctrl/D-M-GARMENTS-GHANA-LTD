import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { InviteStaffDialog } from "@/components/admin/invite-staff-dialog"
import { StaffRowControls } from "@/components/admin/staff-row-controls"
import { getCurrentStaffProfile } from "@/lib/supabase/queries"
import { createClient } from "@/lib/supabase/server"

export default async function AdminStaffPage() {
  const profile = await getCurrentStaffProfile()
  if (!profile || (profile.role !== "super_admin" && profile.role !== "admin")) {
    redirect("/admin")
  }

  const supabase = await createClient()
  const { data: staff } = await supabase.from("profiles").select("*").order("created_at", { ascending: true })

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <InviteStaffDialog />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {(staff ?? []).map((member) => (
              <div key={member.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium text-foreground">
                    {member.full_name} {member.id === profile.id && "(you)"}
                  </p>
                  <p className="text-sm text-muted-foreground">{member.phone ?? "No phone on file"}</p>
                </div>
                <StaffRowControls
                  staffId={member.id}
                  role={member.role}
                  active={member.active}
                  isSelf={member.id === profile.id}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
