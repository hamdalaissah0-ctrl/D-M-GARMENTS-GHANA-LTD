import type { Metadata } from "next"
import { PageShell } from "@/components/marketing/page-shell"
import { ContentRequired } from "@/components/marketing/content-required"
import { getCompanyProfile } from "@/lib/supabase/queries"

export const metadata: Metadata = {
  title: "Privacy Policy",
}

export default async function PrivacyPage() {
  const company = await getCompanyProfile()

  return (
    <PageShell company={company} title="Privacy Policy">
      <ContentRequired
        title="Legal review required"
        description="Privacy policy text must be drafted and reviewed by a qualified professional before publishing — this platform never generates legal or compliance claims automatically."
      />
    </PageShell>
  )
}
