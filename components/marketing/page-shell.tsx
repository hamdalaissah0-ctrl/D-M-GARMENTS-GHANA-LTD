import type { ReactNode } from "react"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import type { CompanyProfile } from "@/lib/supabase/queries"

export function PageShell({
  company,
  title,
  description,
  children,
}: {
  company: CompanyProfile | null
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              {title}
            </h1>
            {description && (
              <p className="mt-3 max-w-2xl text-muted-foreground">{description}</p>
            )}
          </div>
          {children}
        </div>
      </main>
      <SiteFooter company={company} />
    </>
  )
}
