import type { Metadata } from "next"
import { PageShell } from "@/components/marketing/page-shell"
import { ContentRequired } from "@/components/marketing/content-required"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { getCompanyProfile } from "@/lib/supabase/queries"

export const metadata: Metadata = {
  title: "Services",
  description: "Manufacturing services offered by D&M Garments Ghana Limited.",
}

export default async function ServicesPage() {
  const supabase = await createClient()
  const company = await getCompanyProfile()
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true })

  return (
    <PageShell company={company} title="Services">
      {!services || services.length === 0 ? (
        <ContentRequired
          title="No services published yet"
          description="Services will appear here once added in the admin CMS."
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id}>
              <CardContent className="p-5">
                <p className="font-medium text-foreground">{service.name}</p>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-3">
                  {service.description ?? "Content required"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  )
}
