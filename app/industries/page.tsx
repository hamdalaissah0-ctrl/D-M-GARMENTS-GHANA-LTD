import type { Metadata } from "next"
import { PageShell } from "@/components/marketing/page-shell"
import { ContentRequired } from "@/components/marketing/content-required"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { getCompanyProfile } from "@/lib/supabase/queries"

export const metadata: Metadata = {
  title: "Industries",
  description: "Industries served by D&M Garments Ghana Limited.",
}

export default async function IndustriesPage() {
  const supabase = await createClient()
  const company = await getCompanyProfile()
  const { data: industries } = await supabase
    .from("industries")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true })

  return (
    <PageShell company={company} title="Industries We Serve">
      {!industries || industries.length === 0 ? (
        <ContentRequired
          title="No industries published yet"
          description="Industries will appear here once confirmed by D&M."
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <Card key={industry.id}>
              <CardContent className="p-5">
                <p className="font-medium text-foreground">{industry.name}</p>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-3">
                  {industry.description ?? "Content required"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  )
}
