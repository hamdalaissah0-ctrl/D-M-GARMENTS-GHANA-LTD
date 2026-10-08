import Link from "next/link"
import { Button } from "@/components/ui/button"

const NAV_LINKS = [
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight text-foreground">
            D&amp;M Garments
          </span>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            Ghana Limited
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Button size="sm" nativeButton={false} render={<Link href="/order">Request a Quote</Link>} />
      </div>
    </header>
  )
}
