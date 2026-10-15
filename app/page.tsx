import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { ContentRequired } from "@/components/marketing/content-required"
import { MissionVisionBanners } from "@/components/marketing/mission-vision-banners"
import { ScrollReveal } from "@/components/marketing/scroll-reveal"
import {
  getCompanyProfile,
  getPublishedTestimonials,
  getPublishedCategories,
} from "@/lib/supabase/queries"
import {
  ArrowRight,
  ArrowUpRight,
  Phone,
  Wallet,
  BadgeCheck,
  HeartHandshake,
  ShieldCheck,
  Upload,
  ClipboardList,
  Send,
  PhoneCall,
} from "lucide-react"

const MEDIA_BASE = "https://otscslkmvhunzlxfrqse.supabase.co/storage/v1/object/public/media"

const BENTO_FEATURES = [
  {
    icon: Wallet,
    title: "No Minimum Order",
    description: "We take on requests of any size — no minimum order quantity, ever.",
    dark: false,
  },
  {
    icon: BadgeCheck,
    title: "Full Customisation In-House",
    description: "Embroidery, DTF printing and branding handled under one roof.",
    dark: true,
  },
  {
    icon: HeartHandshake,
    title: "Direct Communication",
    description: "Talk directly with our team by phone or WhatsApp throughout your order.",
    dark: false,
  },
]

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

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-brand-hero text-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${MEDIA_BASE}/branding/hero-banner.png`}
            alt="D&M Garments — school uniforms, fabric printing and embroidery"
            className="absolute inset-0 size-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/20" />
          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-white/80 uppercase">
                D&amp;M Garments Ghana Limited
              </span>
              <h1 className="mt-6 text-4xl leading-tight font-bold tracking-tight sm:text-5xl lg:text-6xl">
                High-Quality Garments,{" "}
                <span className="text-gradient-brand">Made for Your Business</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-white/70">
                {company?.company_name ?? "D&M Garments Ghana Limited"} manufactures
                hospitality, corporate, workwear and PPE uniforms — with embroidery, DTF
                printing and branding built in.
                {company?.no_moq ? " No minimum order quantity." : ""}
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Button
                  size="lg"
                  nativeButton={false}
                  className="gap-3 rounded-full bg-brand-cta pr-2 text-white shadow-lg shadow-black/20 hover:opacity-90"
                  render={
                    <Link href="/products">
                      Request a Quote
                      <span className="flex size-7 items-center justify-center rounded-full bg-white/20">
                        <ArrowRight className="size-4" />
                      </span>
                    </Link>
                  }
                />
                {company?.phone_primary && (
                  <a
                    href={`tel:${company.phone_primary}`}
                    className="flex items-center gap-3 text-sm text-white/80 hover:text-white"
                  >
                    <span className="flex size-10 items-center justify-center rounded-full bg-white/10">
                      <Phone className="size-4" />
                    </span>
                    <span>
                      Call Us
                      <br />
                      <span className="font-semibold text-white">{company.phone_primary}</span>
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Floating fact card */}
          <div className="relative mx-auto hidden max-w-7xl px-4 pb-16 sm:px-6 lg:block lg:px-8">
            <div className="absolute top-[-7rem] right-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary">
                <ShieldCheck className="size-5 text-primary-foreground" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">No Minimum Order</p>
                <p className="text-xs text-white/60">Any quantity, always welcome</p>
              </div>
            </div>
          </div>
        </section>

        {/* Bento features */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <ScrollReveal className="max-w-2xl">
            <span className="text-sm font-semibold tracking-wide text-primary uppercase">
              Our Approach
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Essential features for manufacturing success
            </h2>
          </ScrollReveal>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {BENTO_FEATURES.map(({ icon: Icon, title, description, dark }, i) => (
              <ScrollReveal key={title} direction="up" className={i === 1 ? "lg:translate-y-6" : ""}>
                <Card
                  className={
                    dark
                      ? "h-full border-transparent bg-brand-panel text-white"
                      : "h-full border-border/70"
                  }
                >
                  <CardContent className="flex h-full flex-col p-7">
                    <span
                      className={`flex size-12 items-center justify-center rounded-xl ${
                        dark ? "bg-white/15" : "bg-brand-cta text-white"
                      }`}
                    >
                      <Icon className="size-6" />
                    </span>
                    <h3 className="mt-6 text-lg font-semibold">{title}</h3>
                    <p className={`mt-2 text-sm ${dark ? "text-white/70" : "text-muted-foreground"}`}>
                      {description}
                    </p>
                    <Link
                      href="/products"
                      className={`mt-6 inline-flex items-center gap-1.5 text-sm font-medium ${
                        dark ? "text-white" : "text-primary"
                      } hover:underline`}
                    >
                      Explore More <ArrowUpRight className="size-3.5" />
                    </Link>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* About / Who we are */}
        <section className="bg-secondary/30 py-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
            <ScrollReveal direction="left" className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${MEDIA_BASE}/branding/production-equipment.png`}
                alt="D&M Garments production equipment — DTF and UV printing"
                className="w-full rounded-2xl border border-border object-cover shadow-sm"
              />
              <div className="absolute -bottom-6 -left-4 flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 shadow-md sm:-left-6">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary">
                  <BadgeCheck className="size-5 text-primary-foreground" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">In-House Production</p>
                  <p className="text-xs text-muted-foreground">DTF · UV · Embroidery</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <span className="text-sm font-semibold tracking-wide text-primary uppercase">
                Who We Are
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                A manufacturing business, not a storefront
              </h2>
              <p className="mt-5 text-muted-foreground">
                {company?.company_name ?? "D&M Garments Ghana Limited"} is a garment
                manufacturing and branding business based at{" "}
                {company?.address ?? "Content required"}. We manufacture hospitality,
                corporate, workwear, PPE and branded clothing — with embroidery, DTF printing
                and branding handled in-house.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Embroidery", "DTF Printing", "UV Printing", "School Uniforms", "Branding"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Button
                className="mt-8 rounded-full bg-brand-cta text-white"
                nativeButton={false}
                render={
                  <Link href="/about">
                    More About Us <ArrowUpRight className="ms-1 size-4" />
                  </Link>
                }
              />
            </ScrollReveal>
          </div>
        </section>

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
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
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

        {/* Testimonials */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Why Businesses Choose D&amp;M
              </h2>
            </ScrollReveal>
            {testimonials.length === 0 ? (
              <div className="mt-8">
                <ContentRequired
                  title="No testimonials published yet"
                  description="Only real, D&M-supplied customer testimonials are published here — never fabricated reviews."
                />
              </div>
            ) : (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((t) => (
                  <Card key={t.id}>
                    <CardContent className="p-5">
                      <p className="text-sm text-foreground">&ldquo;{t.quote}&rdquo;</p>
                      <p className="mt-3 text-sm font-medium text-foreground">
                        {t.customer_name}
                      </p>
                      {t.company_name && (
                        <p className="text-xs text-muted-foreground">{t.company_name}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

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
