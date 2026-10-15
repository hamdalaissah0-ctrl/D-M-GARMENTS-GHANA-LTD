// Sticky/mobile-menu behavior ported from NextJSTemplates/startup-nextjs
// (MIT License), adapted to D&M's real nav, logo and CTA.
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { LogoMark } from "@/components/layout/logo-mark"

const NAV_LINKS = [
  { href: "/products", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function SiteHeader() {
  const [navbarOpen, setNavbarOpen] = useState(false)
  const [sticky, setSticky] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY >= 80)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 left-0 z-40 flex w-full items-center border-b border-transparent bg-white/95 backdrop-blur-sm transition ${
        sticky ? "shadow-sticky border-body-color/10" : ""
      }`}
    >
      <div className="container">
        <div className="relative -mx-4 flex items-center justify-between">
          <div className="w-60 max-w-full px-4">
            <Link href="/" className="block w-full py-4">
              <div className="flex items-center gap-2.5">
                <LogoMark />
                <span className="flex flex-col leading-none whitespace-nowrap">
                  <span className="text-base font-semibold tracking-tight text-black">
                    D&amp;M Garments
                  </span>
                  <span className="text-[11px] text-body-color">Ghana Limited</span>
                </span>
              </div>
            </Link>
          </div>

          <div className="flex w-full items-center justify-end px-4">
            <button
              onClick={() => setNavbarOpen((v) => !v)}
              aria-label="Toggle menu"
              className="ring-primary absolute top-1/2 right-4 block translate-y-[-50%] rounded-lg px-3 py-[6px] focus:ring-2 lg:hidden"
            >
              {navbarOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>

            <nav
              className={`border-body-color/20 absolute right-4 z-30 w-[250px] rounded border bg-white px-6 py-4 duration-300 lg:visible lg:static lg:flex lg:w-auto lg:items-center lg:gap-10 lg:border-none lg:bg-transparent! lg:p-0 lg:opacity-100 ${
                navbarOpen ? "top-full opacity-100" : "invisible top-[120%] opacity-0 lg:visible lg:opacity-100"
              }`}
            >
              <ul className="block lg:flex lg:items-center lg:gap-8">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setNavbarOpen(false)}
                      className={`flex py-2 text-base lg:inline-flex lg:py-6 ${
                        pathname === link.href
                          ? "text-primary"
                          : "text-dark hover:text-primary"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/order"
                onClick={() => setNavbarOpen(false)}
                className="bg-primary mt-3 block rounded-xs px-6 py-2.5 text-center text-sm font-semibold text-white duration-300 hover:opacity-90 lg:mt-0 lg:inline-block"
              >
                Request a Quote
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
