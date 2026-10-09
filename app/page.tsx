import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { ContentRequired } from "@/components/marketing/content-required"
import {
  getCompanyProfile,
  getFeaturedProducts,
  getPublishedTestimonials,
  getFeaturedPortfolio,
} from "@/lib/supabase/queries"
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Ruler,
  Sparkles,
  Printer,
  Shirt,
  Users,
  Wallet,
  BadgeCheck,
  HeartHandshake,
  Phone,
} from "lucide-react"

const CAPABILITIES = [
  { label: "Uniform Manufacturing", icon: Shirt },
  { label: "PPE", icon: ShieldCheck },
  { label: "Embroidery", icon: Sparkles },
  { label: "DTF Printing", icon: Printer },
  { label: "Branding", icon: Ruler },
]

const WHY_CHOOSE_US = [
  {
    icon: Users,
    title: "Manufacturing-Focused",
    description:
      "We're a production business first — built to manufacture uniforms at scale, not a reseller.",
    href: "/about",
  },
  {
    icon: Wallet,
    title: "No Minimum Order",
    description: "No minimum order quantity — we take on requests of any size.",
    href: "/order",
  },
  {
    icon: BadgeCheck,
    title: "Full Customisation",
    description: "Embroidery, DTF printing and branding built into every order.",
    href: "/services",
  },
  {
    icon: HeartHandshake,
    title: "Direct Communication",
    description: "Talk directly with our team by phone or WhatsApp throughout your order.",
    href: "/contact",
  },
]

const HOW_IT_WORKS = [
  { step: "01", label: "Choose", description: "Browse our catalogue or describe something custom." },
  { step: "02", label: "Specify", description: "Tell us quantity, colours, branding and sizing." },
  { step: "03", label: "Upload", description: "Attach reference designs or logos." },
  { step: "04", label: "Submit", description: "Send your request — no payment required yet." },
  { step: "05", label: "We Contact You", description: "Our team reviews and reaches out with a quote." },
]

export default async function HomePage() {
  const [company, featuredProducts, testimonials, portfolio] = await Promise.all([
    getCompanyProfile(),
    getFeaturedProducts(),
    getPublishedTestimonials(),
    getFeaturedPortfolio(),
  ])

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-brand-hero text-white">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
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
              <div className="mt-10 flex flex-wrap gap-4">
                <Button
                  size="lg"
                  nativeButton={false}
                  className="bg-brand-cta text-white shadow-lg shadow-black/20 hover:opacity-90"
                  render={
                    <Link href="/order">
                      Request a Quote <ArrowRight className="ms-1 size-4" />
                    </Link>
                  }
                />
                <Button
                  size="lg"
                  variant="outline"
                  nativeButton={false}
                  className="border-white/25 bg-white/5 text-white hover:bg-white/10"
                  render={<Link href="/products">Explore Our Products</Link>}
                />
              </div>
            </div>
          </div>

          {/* Floating info card, echoes the reference layout's top-right note */}
          <div className="relative mx-auto hidden max-w-7xl px-4 pb-16 sm:px-6 lg:block lg:px-8">
            <div className="absolute top-[-9.5rem] right-8 w-64 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <p className="text-sm text-white/70">
                A Ghanaian garment manufacturer built for custom production.
              </p>
              <Button
                size="sm"
                variant="outline"
                nativeButton={false}
                className="mt-4 w-full border-white/25 bg-transparent text-white hover:bg-white/10"
                render={<Link href="/contact">Contact Us</Link>}
              />
            </div>
          </div>
        </section>

        {/* About Us */}
        <section className="bg-brand-panel text-white">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
            <div className="order-2 lg:order-1">
              <div className="flex items-center gap-2 text-primary">
                <span className="size-2 rounded-full bg-primary" />
                <span className="text-sm font-semibold tracking-wide uppercase">About Us</span>
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                D&amp;M Garments:
                <br />A Manufacturing Business, Not a Storefront
              </h2>
              <p className="mt-5 max-w-lg text-white/65">
                {company?.company_name ?? "D&M Garments Ghana Limited"} is a garment
                manufacturing and branding business based at{" "}
                {company?.address ?? "Content required"}. We manufacture hospitality,
                corporate, workwear, PPE and branded clothing — with embroidery, DTF printing
                and branding handled in-house.
              </p>
              <Button
                variant="outline"
                nativeButton={false}
                className="mt-7 border-white/25 bg-transparent text-white hover:bg-white/10"
                render={
                  <Link href="/about">
                    Read More <ArrowUpRight className="ms-1 size-4" />
                  </Link>
                }
              />
            </div>
            <div className="order-1 lg:order-2">
              <ContentRequired
                title="Production photography required"
                description="Workshop and production photos will appear here once D&M supplies approved images."
              />
            </div>
          </div>
        </section>

        {/* Why choose us */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold tracking-wide text-primary uppercase">
              Best Manufacturing Partner In Ghana
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Why You Should Choose Our Services?
            </h2>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE_US.map(({ icon: Icon, title, description, href }) => (
              <Card key={title} className="border-border/70">
                <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-cta text-white shadow-sm">
                    <Icon className="size-6" />
                  </span>
                  <p className="font-semibold text-foreground">{title}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                  <Link
                    href={href}
                    className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    Learn more <ArrowUpRight className="size-3.5" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Manufacturing capabilities */}
        <section className="border-y border-border bg-secondary/40">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              What We Manufacture
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
              {CAPABILITIES.map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card py-7 text-center shadow-sm"
                >
                  <span className="flex size-11 items-center justify-center rounded-xl bg-brand-cta text-white">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-sm font-medium text-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured products */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Featured Manufacturing Work
            </h2>
            <Link
              href="/products"
              className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex"
            >
              View all <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
          {featuredProducts.length === 0 ? (
            <div className="mt-8">
              <ContentRequired
                title="No products published yet"
                description="Featured products will appear here once the catalogue is populated in the admin CMS."
              />
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden border-border/70">
                  <div className="h-1.5 bg-brand-cta" />
                  <CardContent className="p-5">
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {product.short_description ?? "Content required"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* How ordering works */}
        <section className="bg-secondary/40">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              How Ordering Works
            </h2>
            <div className="relative mt-12 grid gap-10 sm:grid-cols-5">
              <div className="absolute top-6 right-0 left-0 hidden h-px bg-border sm:block" />
              {HOW_IT_WORKS.map((item) => (
                <div key={item.step} className="relative flex flex-col gap-3">
                  <span className="relative z-10 flex size-12 items-center justify-center rounded-full bg-brand-cta text-sm font-bold text-white shadow-sm">
                    {item.step}
                  </span>
                  <p className="font-semibold text-foreground">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Actual D&amp;M Projects
          </h2>
          {portfolio.length === 0 ? (
            <div className="mt-8">
              <ContentRequired
                title="No portfolio projects published yet"
                description="Real D&M production work will be shown here — never stock photography presented as D&M's own work."
              />
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {portfolio.map((project) => (
                <Card key={project.id}>
                  <CardContent className="p-5">
                    <p className="font-medium text-foreground">{project.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {project.industry ?? "Content required"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Testimonials */}
        <section className="border-t border-border bg-secondary/40">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Why Businesses Choose D&amp;M
            </h2>
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
                className="bg-brand-cta text-white shadow-lg shadow-black/20 hover:opacity-90"
                render={
                  <Link href="/order">
                    Request a Quote <ArrowRight className="ms-1 size-4" />
                  </Link>
                }
              />
              {company?.phone_primary && (
                <Button
                  size="lg"
                  variant="outline"
                  nativeButton={false}
                  className="border-white/25 bg-white/5 text-white hover:bg-white/10"
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
