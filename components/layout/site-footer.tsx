import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"
import { LogoMark } from "@/components/layout/logo-mark"
import type { CompanyProfile } from "@/lib/supabase/queries"

export function SiteFooter({ company }: { company: CompanyProfile | null }) {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-brand-panel text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <LogoMark />
              <span className="text-base font-semibold">
                {company?.company_name ?? "D&M Garments Ghana Limited"}
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-white/60">
              Uniform and garment manufacturing — hospitality, corporate, workwear and PPE,
              with embroidery, DTF printing and branding built in.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold">Contact</p>
            <ul className="mt-3 space-y-2 text-sm text-white/60">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{company?.address ?? "Content required"}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-primary" />
                {company?.phone_primary ? (
                  <a href={`tel:${company.phone_primary}`} className="hover:text-white">
                    {company.phone_primary}
                  </a>
                ) : (
                  "Content required"
                )}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-primary" />
                {company?.email ? (
                  <a href={`mailto:${company.email}`} className="hover:text-white">
                    {company.email}
                  </a>
                ) : (
                  "Content required"
                )}
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold">Company</p>
            <ul className="mt-3 space-y-2 text-sm text-white/60">
              <li>
                <Link href="/about" className="hover:text-white">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-xs text-white/40">
            © {year} {company?.company_name ?? "D&M Garments Ghana Limited"}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
