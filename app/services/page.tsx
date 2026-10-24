import type { Metadata } from "next"
import { Sparkles } from "lucide-react"
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
          {services.map((service, i) => {
            const filled = i % 3 === 1
            return (
              <Card key={service.id} className={filled ? "bg-brand-panel text-white" : ""}>
                <CardContent className="p-6">
                  <span
                    className={`flex size-11 items-center justify-center rounded-xl ${
                      filled ? "bg-white/10 text-white" : "bg-brand-cta text-white"
                    }`}
                  >
                    <Sparkles className="size-5" />
                  </span>
                  <p className={`mt-4 font-semibold ${filled ? "text-white" : "text-foreground"}`}>
                    {service.name}
                  </p>
                  <p className={`mt-1.5 text-sm line-clamp-3 ${filled ? "text-white/70" : "text-muted-foreground"}`}>
                    {service.description ?? "Content required"}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </PageShell>
  )
}
