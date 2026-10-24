import type { ReactNode } from "react"

export function SectionEyebrow({
  children,
  className,
  dark = false,
}: {
  children: ReactNode
  className?: string
  dark?: boolean
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase ${
        dark ? "bg-white/10 text-white" : "bg-accent text-primary"
      } ${className ?? ""}`}
    >
      {children}
    </span>
  )
}
