"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Home, Shirt, Images, Info, Mail, Phone } from "lucide-react"
import { LogoMark } from "@/components/layout/logo-mark"

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/products", label: "Services", icon: Shirt },
  { href: "/portfolio", label: "Portfolio", icon: Images },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Mail },
]

export function SiteHeader({ phone }: { phone?: string | null } = {}) {
  const [navbarOpen, setNavbarOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    document.body.style.overflow = navbarOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [navbarOpen])

  return (
    <header className="sticky top-0 z-40 w-full px-3 pt-3 sm:px-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 rounded-full border border-border/70 bg-white/95 py-1.5 pr-1.5 pl-3 shadow-sm backdrop-blur-sm sm:pl-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <LogoMark className="size-8" />
          <span className="hidden text-sm font-semibold tracking-tight text-foreground sm:inline">
            D&amp;M <span className="text-primary">Garments</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-accent text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <link.icon className="size-3.5" />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
            >
              <Phone className="size-3.5" /> Call Us
            </a>
          )}
          <Link
            href="/order"
            className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90"
          >
            Request a Quote
          </Link>
        </div>

        <button
          onClick={() => setNavbarOpen((v) => !v)}
          aria-label="Toggle menu"
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-foreground lg:hidden"
        >
          {navbarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {navbarOpen && (
        <nav className="mx-auto mt-2 max-w-6xl rounded-3xl border border-border/70 bg-white p-4 shadow-lg lg:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setNavbarOpen(false)}
                    className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium ${
                      active ? "bg-accent text-primary" : "text-foreground"
                    }`}
                  >
                    <link.icon className="size-4" />
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
          <div className="mt-3 flex flex-col gap-2 border-t border-border/70 pt-3">
            {phone && (
              <a
                href={`tel:${phone}`}
                onClick={() => setNavbarOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-foreground"
              >
                <Phone className="size-3.5" /> Call Us
              </a>
            )}
            <Link
              href="/order"
              onClick={() => setNavbarOpen(false)}
              className="rounded-full bg-foreground px-4 py-2.5 text-center text-sm font-semibold text-background"
            >
              Request a Quote
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
