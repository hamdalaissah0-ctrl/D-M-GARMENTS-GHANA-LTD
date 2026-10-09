export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-cta text-[11px] font-extrabold tracking-tight text-white shadow-sm ${className ?? ""}`}
    >
      D&amp;M
    </span>
  )
}
