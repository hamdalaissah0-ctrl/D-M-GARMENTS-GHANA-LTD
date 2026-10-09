"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/actions/auth"
import type { Profile } from "@/lib/supabase/queries"

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/quotes", label: "Quotes" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/staff", label: "Staff" },
  { href: "/admin/settings", label: "Settings" },
]

export function AdminTopbar({ profile }: { profile: Profile }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const isAdmin = profile.role === "super_admin" || profile.role === "admin"
  const current = NAV_ITEMS.find((item) =>
    item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href)
  )

  return (
    <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <Button size="icon" variant="ghost" className="md:hidden" onClick={() => setOpen((v) => !v)}>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
        <h1 className="text-lg font-semibold text-foreground">{current?.label ?? "Admin"}</h1>
      </div>

      <form action={signOut}>
        <Button type="submit" size="sm" variant="ghost" className="gap-1.5">
          <LogOut className="size-4" /> Sign Out
        </Button>
      </form>

      {open && (
        <nav className="absolute top-16 right-0 left-0 flex flex-col gap-1 border-b border-border bg-background p-3 shadow-lg md:hidden">
          {NAV_ITEMS.filter((item) => !["/admin/staff", "/admin/settings", "/admin/content"].includes(item.href) || isAdmin).map(
            (item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>
      )}
    </div>
  )
}
