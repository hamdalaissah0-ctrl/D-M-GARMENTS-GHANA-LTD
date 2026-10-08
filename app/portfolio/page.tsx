import type { Metadata } from "next"
import { PageShell } from "@/components/marketing/page-shell"
import { ContentRequired } from "@/components/marketing/content-required"
import { Card, CardContent } from "@/components/ui/card"
import { getCompanyProfile } from "@/lib/supabase/queries"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Real manufacturing projects completed by D&M Garments Ghana Limited.",
}

export default async function PortfolioPage() {
  const supabase = await createClient()
  const company = await getCompanyProfile()
  const { data: projects } = await supabase
    .from("portfolio_projects")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true })

  return (
    <PageShell
      company={company}
      title="Portfolio"
      description="Real D&M manufacturing work — never stock photography presented as our own."
    >
      {!projects || projects.length === 0 ? (
        <ContentRequired
          title="No portfolio projects published yet"
          description="Completed production work will appear here once supplied by D&M."
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardContent className="p-5">
                <p className="font-medium text-foreground">{project.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {project.industry ?? "Content required"}
                  {project.year ? ` · ${project.year}` : ""}
                </p>
                {project.description && (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                    {project.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  )
}
