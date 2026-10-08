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
import { ArrowRight, ShieldCheck, Ruler, Boxes } from "lucide-react"

const CAPABILITIES = [
  { label: "Uniform manufacturing", icon: Ruler },
  { label: "PPE", icon: ShieldCheck },
  { label: "Embroidery", icon: Boxes },
  { label: "DTF printing", icon: Boxes },
  { label: "Branding", icon: Boxes },
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
        {/* Section 1 — hero */}
        <section className="border-b border-border bg-secondary/30">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="flex flex-col justify-center gap-6">
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                High-Quality Garments Made for Your Business
              </h1>
              <p className="text-lg text-muted-foreground">
                {company?.company_name ?? "D&M Garments Ghana Limited"} manufactures
                hospitality, corporate, workwear and PPE uniforms — with embroidery,
                DTF printing and branding built in.
                {company?.no_moq ? " No minimum order quantity." : ""}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  nativeButton={false}
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
                  render={<Link href="/products">Explore Our Products</Link>}
                />
              </div>
            </div>
            <div className="flex items-center justify-center">
              <ContentRequired
                title="Product photography required"
                description="Hero imagery will appear here once D&M supplies approved garment and production photos."
              />
            </div>
          </div>
        </section>

        {/* Section 5 — manufacturing capabilities */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-foreground">
            Manufacturing capabilities
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
            {CAPABILITIES.map(({ label, icon: Icon }) => (
              <Card key={label}>
                <CardContent className="flex flex-col items-center gap-3 py-6 text-center">
                  <Icon className="size-6 text-primary" />
                  <span className="text-sm font-medium text-foreground">{label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Section 2/4 — featured products */}
        <section className="border-t border-border bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-foreground">
              Featured manufacturing work
            </h2>
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
                  <Card key={product.id}>
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
          </div>
        </section>

        {/* Section 7 — how ordering works */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-foreground">How ordering works</h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-5">
            {["Choose", "Specify", "Upload", "Submit", "We Contact You"].map(
              (step, i) => (
                <li key={step} className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-medium text-foreground">{step}</span>
                </li>
              )
            )}
          </ol>
        </section>

        {/* Section 4 — portfolio */}
        <section className="border-t border-border bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-foreground">
              Actual D&amp;M projects
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
          </div>
        </section>

        {/* Section 3 — testimonials */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-foreground">
            Why businesses choose D&amp;M
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
        </section>

        {/* Section 9 — contact CTA */}
        <section className="border-t border-border bg-primary">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-16 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-primary-foreground">
              Ready to talk about your order?
            </h2>
            <Button
              size="lg"
              variant="secondary"
              nativeButton={false}
              render={
                <Link href="/order">
                  Request a Quote <ArrowRight className="ms-1 size-4" />
                </Link>
              }
            />
          </div>
        </section>
      </main>
      <SiteFooter company={company} />
    </>
  )
}
