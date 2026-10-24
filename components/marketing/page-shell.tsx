import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { SectionEyebrow } from "@/components/marketing/section-eyebrow"
import type { CompanyProfile } from "@/lib/supabase/queries"

export function PageShell({
  company,
  eyebrow,
  title,
  description,
  children,
}: {
  company: CompanyProfile | null
  eyebrow?: string
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <>
      <SiteHeader phone={company?.phone_primary} />
      <main className="flex-1 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-3.5" /> Home / <span className="text-foreground">{title}</span>
          </Link>
        </div>
        <div className="mx-auto max-w-7xl px-4 pt-6 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <SectionEyebrow className="mx-auto">{eyebrow ?? title}</SectionEyebrow>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h1>
            {description && (
              <p className="mt-4 text-muted-foreground">{description}</p>
            )}
          </div>
          {children}
        </div>
      </main>
      <SiteFooter company={company} />
    </>
  )
}
