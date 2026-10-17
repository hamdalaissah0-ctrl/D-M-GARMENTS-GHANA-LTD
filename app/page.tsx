import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { ContentRequired } from "@/components/marketing/content-required"
import { MissionVisionBanners } from "@/components/marketing/mission-vision-banners"
import { ScrollReveal } from "@/components/marketing/scroll-reveal"
import Hero from "@/components/template/Hero"
import Features from "@/components/template/Features"
import AboutSectionOne from "@/components/template/AboutSectionOne"
import AboutSectionTwo from "@/components/template/AboutSectionTwo"
import Testimonials from "@/components/template/Testimonials"
import {
  getCompanyProfile,
  getPublishedTestimonials,
  getPublishedCategories,
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
  const [company, testimonials, categories] = await Promise.all([
    getCompanyProfile(),
    getPublishedTestimonials(),
    getPublishedCategories(),
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
      <SiteHeader />
      <main className="flex-1">
        <Hero company={company} />
        <Features />
        <AboutSectionOne />

        <MissionVisionBanners />

        {/* Services — horizontal scroll, square covers, Jiji-style entry points */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal className="flex items-end justify-between">
              <div>
                <span className="text-sm font-semibold tracking-wide text-primary uppercase">
                  What We Manufacture
                </span>
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
              <span className="text-sm font-semibold tracking-wide text-primary uppercase">
                Our Process
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                How Ordering Works
              </h2>
            </ScrollReveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {HOW_IT_WORKS.map(({ icon: Icon, label, description }, i) => (
                <ScrollReveal key={label} direction="up" className={`delay-${i}`}>
                  <Card className="h-full border-border/70">
                    <CardContent className="flex h-full flex-col p-6">
                      <span className="flex size-11 items-center justify-center rounded-xl bg-brand-cta text-white">
                        <Icon className="size-5" />
                      </span>
                      <p className="mt-5 font-semibold text-foreground">{label}</p>
                      <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <Testimonials testimonials={testimonials} />

        {/* Final CTA */}
        <section className="relative overflow-hidden bg-brand-hero text-white">
          <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 py-20 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to talk about your order?
            </h2>
            <p className="max-w-lg text-white/65">
              Tell us what you need and our team will review your request and get in touch —
              no payment required to start.
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                nativeButton={false}
                className="rounded-full bg-brand-cta text-white shadow-lg shadow-black/20 hover:opacity-90"
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
                  className="rounded-full border-white/25 bg-white/5 text-white hover:bg-white/10"
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
