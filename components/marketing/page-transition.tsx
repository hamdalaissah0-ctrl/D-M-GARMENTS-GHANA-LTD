"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div
      key={pathname}
      className="flex min-h-full flex-1 flex-col animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out"
    >
      {children}
    </div>
  )
}
