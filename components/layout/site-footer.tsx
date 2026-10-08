import Link from "next/link"
import type { CompanyProfile } from "@/lib/supabase/queries"

export function SiteFooter({ company }: { company: CompanyProfile | null }) {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-foreground">
              {company?.company_name ?? "D&M Garments Ghana Limited"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {company?.address ?? "Content required"}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">Contact</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>
                {company?.phone_primary ? (
                  <a href={`tel:${company.phone_primary}`} className="hover:text-foreground">
                    {company.phone_primary}
                  </a>
                ) : (
                  "Content required"
                )}
              </li>
              <li>
                {company?.email ? (
                  <a href={`mailto:${company.email}`} className="hover:text-foreground">
                    {company.email}
                  </a>
                ) : (
                  "Content required"
                )}
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">Company</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-10 text-xs text-muted-foreground">
          © {year} {company?.company_name ?? "D&M Garments Ghana Limited"}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
