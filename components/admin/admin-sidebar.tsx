"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Package,
  FolderTree,
  Quote,
  UserCog,
  Settings,
  FileText,
  MessageSquare,
} from "lucide-react"
import { LogoMark } from "@/components/layout/logo-mark"
import { cn } from "cn"
import type { Profile } from "@/lib/supabase/queries"

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/quotes", label: "Quotes", icon: Quote },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/content", label: "Content", icon: FileText, minRole: "admin" as const },
  { href: "/admin/staff", label: "Staff", icon: UserCog, minRole: "admin" as const },
  { href: "/admin/settings", label: "Settings", icon: Settings, minRole: "admin" as const },
]

export function AdminSidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname()
  const isAdmin = profile.role === "super_admin" || profile.role === "admin"

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card md:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
        <LogoMark />
        <div className="flex flex-col leading-none">
          <span className="text-sm font-semibold text-foreground">D&amp;M Garments</span>
          <span className="text-[11px] text-muted-foreground">Staff Dashboard</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV_ITEMS.filter((item) => !item.minRole || isAdmin).map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-cta text-white shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="size-4.5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-4">
        <p className="truncate text-sm font-medium text-foreground">{profile.full_name}</p>
        <p className="text-xs text-muted-foreground capitalize">{profile.role.replace("_", " ")}</p>
      </div>
    </aside>
  )
}
