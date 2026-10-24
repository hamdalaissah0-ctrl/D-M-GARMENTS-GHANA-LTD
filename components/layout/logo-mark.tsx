import Image from "next/image"

const LOGO_URL =
  "https://otscslkmvhunzlxfrqse.supabase.co/storage/v1/object/public/media/branding/dm-logo.png"

export function LogoMark({ className, alt }: { className?: string; alt?: string }) {
  return (
    <Image
      src={LOGO_URL}
      alt={alt ?? "D&M Garments Ghana Limited"}
      width={36}
      height={36}
      priority
      className={`size-9 shrink-0 rounded-lg object-contain ${className ?? ""}`}
    />
  )
}
