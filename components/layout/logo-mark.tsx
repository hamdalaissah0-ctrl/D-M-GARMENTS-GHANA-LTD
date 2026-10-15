const LOGO_URL =
  "https://otscslkmvhunzlxfrqse.supabase.co/storage/v1/object/public/media/branding/dm-logo.png"

export function LogoMark({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_URL}
      alt="D&M Garments Ghana Limited"
      className={`size-9 shrink-0 rounded-lg object-contain ${className ?? ""}`}
    />
  )
}
