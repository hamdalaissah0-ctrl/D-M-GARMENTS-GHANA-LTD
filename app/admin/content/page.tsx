import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { TestimonialFormDialog } from "@/components/admin/testimonial-form-dialog"
import { FaqFormDialog } from "@/components/admin/faq-form-dialog"
import { PortfolioFormDialog } from "@/components/admin/portfolio-form-dialog"
import { getCurrentStaffProfile } from "@/lib/supabase/queries"
import { createClient } from "@/lib/supabase/server"

const STATUS_CLASSES: Record<string, string> = {
  published: "bg-primary/10 text-primary",
  draft: "bg-secondary text-secondary-foreground",
  archived: "bg-secondary text-secondary-foreground",
}

export default async function AdminContentPage() {
  const profile = await getCurrentStaffProfile()
  if (!profile || (profile.role !== "super_admin" && profile.role !== "admin")) {
    redirect("/admin")
  }

  const supabase = await createClient()
  const [{ data: testimonials }, { data: faqs }, { data: portfolioProjects }, { data: portfolioImages }] =
    await Promise.all([
      supabase.from("testimonials").select("*").order("created_at", { ascending: false }),
      supabase.from("faqs").select("*").order("created_at", { ascending: false }),
      supabase.from("portfolio_projects").select("*").order("created_at", { ascending: false }),
      supabase.from("portfolio_images").select("*"),
    ])

  const imageByProject = new Map((portfolioImages ?? []).map((img) => [img.portfolio_project_id, img.storage_path]))

  return (
    <Tabs defaultValue="testimonials">
      <TabsList>
        <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        <TabsTrigger value="faqs">FAQs</TabsTrigger>
        <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
      </TabsList>

      <TabsContent value="testimonials" className="mt-5 space-y-5">
        <div className="flex justify-end">
          <TestimonialFormDialog />
        </div>
        <Card>
          <CardContent className="p-0">
            {!testimonials || testimonials.length === 0 ? (
              <p className="p-8 text-center text-sm text-muted-foreground">No testimonials yet.</p>
            ) : (
              <div className="divide-y divide-border">
                {testimonials.map((t) => (
                  <div key={t.id} className="flex items-center justify-between gap-3 p-4">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{t.customer_name}</p>
                      <p className="truncate text-sm text-muted-foreground">{t.quote}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={STATUS_CLASSES[t.status]}>{t.status}</Badge>
                      <TestimonialFormDialog testimonial={t} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="faqs" className="mt-5 space-y-5">
        <div className="flex justify-end">
          <FaqFormDialog />
        </div>
        <Card>
          <CardContent className="p-0">
            {!faqs || faqs.length === 0 ? (
              <p className="p-8 text-center text-sm text-muted-foreground">No FAQs yet.</p>
            ) : (
              <div className="divide-y divide-border">
                {faqs.map((f) => (
                  <div key={f.id} className="flex items-center justify-between gap-3 p-4">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{f.question}</p>
                      <p className="truncate text-sm text-muted-foreground">{f.answer}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={STATUS_CLASSES[f.status]}>{f.status}</Badge>
                      <FaqFormDialog faq={f} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="portfolio" className="mt-5 space-y-5">
        <div className="flex justify-end">
          <PortfolioFormDialog />
        </div>
        <Card>
          <CardContent className="p-0">
            {!portfolioProjects || portfolioProjects.length === 0 ? (
              <p className="p-8 text-center text-sm text-muted-foreground">No portfolio projects yet.</p>
            ) : (
              <div className="divide-y divide-border">
                {portfolioProjects.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-3 p-4">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{p.title}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {p.industry ?? "No industry"} {p.year ? `· ${p.year}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={STATUS_CLASSES[p.status]}>{p.status}</Badge>
                      <PortfolioFormDialog project={p} currentImageUrl={imageByProject.get(p.id) ?? null} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
