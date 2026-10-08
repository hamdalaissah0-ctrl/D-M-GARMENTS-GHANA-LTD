import type { Metadata } from "next"
import { PageShell } from "@/components/marketing/page-shell"
import { ContentRequired } from "@/components/marketing/content-required"
import { getCompanyProfile } from "@/lib/supabase/queries"

export const metadata: Metadata = {
  title: "About Us",
  description: "About D&M Garments Ghana Limited.",
}

export default async function AboutPage() {
  const company = await getCompanyProfile()

  return (
    <PageShell company={company} title="About D&M Garments Ghana Limited">
      <div className="max-w-3xl space-y-6">
        <p className="text-muted-foreground">
          {company?.company_name ?? "D&M Garments Ghana Limited"} is a garment
          manufacturing and branding business based at{" "}
          {company?.address ?? "Content required"}, Ghana.
        </p>
        <ContentRequired
          title="Company history required"
          description="D&M's founding story, years in operation, and manufacturing capabilities will appear here once supplied — nothing is invented."
        />
      </div>
    </PageShell>
  )
}
