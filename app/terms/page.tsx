import type { Metadata } from "next"
import { PageShell } from "@/components/marketing/page-shell"
import { ContentRequired } from "@/components/marketing/content-required"
import { getCompanyProfile } from "@/lib/supabase/queries"

export const metadata: Metadata = {
  title: "Terms of Use",
}

export default async function TermsPage() {
  const company = await getCompanyProfile()

  return (
    <PageShell company={company} title="Terms of Use">
      <ContentRequired
        title="Legal review required"
        description="Terms of use text must be drafted and reviewed by a qualified professional before publishing — this platform never generates legal or compliance claims automatically."
      />
    </PageShell>
  )
}
