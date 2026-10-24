import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { ContentRequired } from "@/components/marketing/content-required"
import { MissionVisionBanners } from "@/components/marketing/mission-vision-banners"
import { ScrollReveal } from "@/components/marketing/scroll-reveal"
import { SectionEyebrow } from "@/components/marketing/section-eyebrow"
import { VideoTeaser } from "@/components/marketing/video-teaser"
import Hero from "@/components/template/Hero"
import Features from "@/components/template/Features"
import AboutSectionOne from "@/components/template/AboutSectionOne"
import AboutSectionTwo from "@/components/template/AboutSectionTwo"
import Testimonials from "@/components/template/Testimonials"
import {
  getCompanyProfile,
  getPublishedTestimonials,
  getPublishedCategories,
  getPublishedVideos,
} from "@/lib/supabase/queries"
import {
  ArrowRight,
  ArrowUpRight,
  Phone,
  Upload,
  ClipboardList,
  Send,
  PhoneCall,
} from "lucide-react"

const HOW_IT_WORKS = [
  { icon: ClipboardList, label: "Choose a Service", description: "Browse our categories and pick what you need." },
  { icon: Upload, label: "Add Your Details", description: "Select size, quantity, colours and branding." },
  { icon: Send, label: "Submit Your Order", description: "No payment required — just tell us what you need." },
  { icon: PhoneCall, label: "We Contact You", description: "Our team reviews and follows up with a quote." },
]

export default async function HomePage() {
  const [company, testimonials, categories, videos] = await Promise.all([
    getCompanyProfile(),
    getPublishedTestimonials(),
    getPublishedCategories(),
    getPublishedVideos(),
  ])

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company?.company_name ?? "D&M Garments Ghana Limited",
    url: siteUrl,
    logo: "https://otscslkmvhunzlxfrqse.supabase.co/storage/v1/object/public/media/branding/dm-logo.png",
    ...(company?.address ? { address: { "@type": "PostalAddress", streetAddress: company.address } } : {}),
    ...(company?.phone_primary ? { telephone: company.phone_primary } : {}),
    ...(company?.email ? { email: company.email } : {}),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <SiteHeader phone={company?.phone_primary} />
      <main className="flex-1">
        <Hero
          company={company}
          imageUrl="https://otscslkmvhunzlxfrqse.supabase.co/storage/v1/object/public/media/branding/hero-banner.jpg"
        />
        <Features />
        <AboutSectionOne />

        <MissionVisionBanners />

        {/* Services — horizontal scroll, square covers, Jiji-style entry points */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal className="flex items-end justify-between">
              <div>
                <SectionEyebrow>What We Manufacture</SectionEyebrow>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Browse Our Services
                </h2>
              </div>
              <p className="hidden text-sm text-muted-foreground sm:block">
                Tap a service to view samples &amp; order
              </p>
            </ScrollReveal>
          </div>

          {categories.length === 0 ? (
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mt-8">
                <ContentRequired
                  title="No services published yet"
                  description="Services will appear here once added in the admin CMS."
                />
              </div>
            </div>
          ) : (
            <div className="mt-10 flex gap-5 overflow-x-auto px-4 pb-4 sm:px-6 lg:px-8">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products/${category.slug}`}
                  className="group relative aspect-square w-64 shrink-0 overflow-hidden rounded-2xl border border-border shadow-sm transition-shadow hover:shadow-lg"
                >
                  {category.image_url ? (
                    <Image
                      src={category.image_url}
                      alt={category.name}
                      fill
                      sizes="256px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-secondary" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-base font-semibold text-white">{category.name}</p>
                    <span className="mt-1 inline-flex items-center gap-1 text-xs text-white/75">
                      View Samples <ArrowUpRight className="size-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <AboutSectionTwo />

        {/* How it works */}
        <section className="bg-secondary/30 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal className="max-w-2xl">
              <SectionEyebrow>Our Process</SectionEyebrow>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                How Ordering Works
              </h2>
            </ScrollReveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {HOW_IT_WORKS.map(({ icon: Icon, label, description }, i) => {
                const filled = i % 2 === 1
                return (
                  <ScrollReveal key={label} direction="up" className={`delay-${i}`}>
                    <Card
                      className={`h-full border-border/70 ${filled ? "bg-brand-panel text-white" : ""}`}
                    >
                      <CardContent className="flex h-full flex-col p-6">
                        <span
                          className={`flex size-11 items-center justify-center rounded-xl ${
                            filled ? "bg-white/10 text-white" : "bg-brand-cta text-white"
                          }`}
                        >
                          <Icon className="size-5" />
                        </span>
                        <p className={`mt-5 font-semibold ${filled ? "text-white" : "text-foreground"}`}>
                          {label}
                        </p>
                        <p className={`mt-1.5 text-sm ${filled ? "text-white/70" : "text-muted-foreground"}`}>
                          {description}
                        </p>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                )
              })}
            </div>
          </div>
        </section>

        <Testimonials testimonials={testimonials} />

        <VideoTeaser videos={videos} />

        {/* Final CTA */}
        <section className="relative overflow-hidden" style={{ backgroundColor: "#8CC63E" }}>
          <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 py-20 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-[#0F4D26] sm:text-4xl">
              Ready to talk about your order?
            </h2>
            <p className="max-w-lg text-[#0F4D26]">
              Tell us what you need and our team will review your request and get in touch —
              no payment required to start.
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                nativeButton={false}
                className="rounded-full bg-[#0F4D26] text-white shadow-lg shadow-black/10 hover:opacity-90"
                render={
                  <Link href="/products">
                    Request a Quote <ArrowRight className="ms-1 size-4" />
                  </Link>
                }
              />
              {company?.phone_primary && (
                <Button
                  size="lg"
                  variant="outline"
                  nativeButton={false}
                  className="rounded-full border-[#0F4D26]/30 bg-white/30 text-[#0F4D26] hover:bg-white/50"
                  render={
                    <a href={`tel:${company.phone_primary}`}>
                      <Phone className="size-4" /> Call D&amp;M
                    </a>
                  }
                />
              )}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter company={company} />
    </>
  )
}
