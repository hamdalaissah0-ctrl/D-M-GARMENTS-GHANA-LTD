import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { PageShell } from "@/components/marketing/page-shell"
import { ContentRequired } from "@/components/marketing/content-required"
import { PortfolioTabs } from "@/components/marketing/portfolio-tabs"
import { SectionEyebrow } from "@/components/marketing/section-eyebrow"
import { VideoGallery } from "@/components/marketing/video-gallery"
import { FeaturedVideo } from "@/components/marketing/featured-video"
import { Card, CardContent } from "@/components/ui/card"
import { getCompanyProfile, getPublishedVideos, getFeaturedVideo } from "@/lib/supabase/queries"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Real manufacturing projects and production videos from D&M Garments Ghana Limited.",
}

export default async function PortfolioPage() {
  const supabase = await createClient()
  const [company, { data: projects }, videos, featuredVideo] = await Promise.all([
    getCompanyProfile(),
    supabase.from("portfolio_projects").select("*").eq("status", "published").order("sort_order", { ascending: true }),
    getPublishedVideos(),
    getFeaturedVideo(),
  ])

  const projectsPanel =
    !projects || projects.length === 0 ? (
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
    )

  const videosPanel =
    videos.length === 0 ? (
      <ContentRequired
        title="No videos published yet"
        description="Production and behind-the-scenes footage will appear here once supplied by D&M."
      />
    ) : (
      <>
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <SectionEyebrow className="mx-auto">Inside D&amp;M Garments</SectionEyebrow>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Craftsmanship in Motion
          </h2>
          <div className="mx-auto mt-3 h-1 w-14 rounded-full bg-[#8CC63E]" />
          <p className="mt-4 text-muted-foreground">
            Discover the precision, creativity, and technology behind our garment manufacturing,
            custom uniforms, professional apparel, and fabric printing services.
          </p>
        </div>
        <VideoGallery videos={videos} />
      </>
    )

  return (
    <PageShell
      company={company}
      title="Portfolio"
      description="Real D&M manufacturing work — never stock photography presented as our own."
    >
      <PortfolioTabs projects={projectsPanel} videos={videosPanel} />

      <div className="-mx-4 -mb-16 sm:-mx-6 sm:-mb-16 lg:-mx-8 lg:-mb-16">
        {featuredVideo && <FeaturedVideo video={featuredVideo} />}

        <section className="bg-brand-panel py-16 text-white md:py-20">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Let&apos;s Bring Your Designs to Life
            </h2>
            <p className="max-w-lg text-white/65">
              From corporate uniforms and safety wear to custom garment branding and fabric
              printing, D&amp;M Garments delivers tailored solutions for businesses and
              institutions.
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-4">
              <Link
                href="/order"
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-cta px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/20 transition-opacity hover:opacity-90"
              >
                Request a Quote <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Explore Our Portfolio
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  )
}
