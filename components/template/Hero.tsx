import Link from "next/link"
import Image from "next/image"
import { Phone, MessageCircle, ShieldCheck, Scissors, Truck } from "lucide-react"
import { SectionEyebrow } from "@/components/marketing/section-eyebrow"
import type { CompanyProfile } from "@/lib/supabase/queries"

const FLOATING_BADGES = [
  { icon: Scissors, label: "Embroidery & DTF Printing", position: "top-6 -left-6 sm:-left-10" },
  { icon: ShieldCheck, label: "Quality Checked", position: "top-1/2 -right-4 -translate-y-1/2 sm:-right-10" },
  { icon: Truck, label: "Nationwide Delivery", position: "bottom-6 -left-4 sm:-left-8" },
]

export default function Hero({
  company,
  imageUrl,
}: {
  company: CompanyProfile | null
  imageUrl?: string | null
}) {
  const whatsappNumber = company?.phone_primary?.replace(/[^0-9]/g, "")

  return (
    <section className="relative overflow-hidden bg-secondary/20 py-14 sm:py-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 size-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/3 -right-24 size-96 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <SectionEyebrow>GARMENT MANUFACTURING · GHANA</SectionEyebrow>
          <h1 className="mt-5 text-4xl leading-[1.1] font-bold tracking-tight text-foreground sm:text-5xl">
            High-Quality Uniforms, <span className="text-primary">Made Right.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            {company?.company_name ?? "D&M Garments Ghana Limited"} manufactures hospitality,
            corporate, workwear and PPE uniforms — with embroidery, DTF printing and branding
            built in.
            {company?.no_moq ? " No minimum order quantity." : ""}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {whatsappNumber ? (
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-cta px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-opacity hover:opacity-90"
              >
                <MessageCircle className="size-4" /> WhatsApp Us
              </a>
            ) : (
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-cta px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-opacity hover:opacity-90"
              >
                Request a Quote
              </Link>
            )}
            {company?.phone_primary && (
              <a
                href={`tel:${company.phone_primary}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-white px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
              >
                <Phone className="size-4" /> Call Us
              </a>
            )}
          </div>

          <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 shrink-0 text-primary" />
            Every order goes through a quality check before it ships.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-accent">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="D&M Garments Ghana Limited — manufactured uniforms"
                fill
                sizes="(min-width: 1024px) 480px, 90vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Content required
              </div>
            )}
          </div>
          {FLOATING_BADGES.map(({ icon: Icon, label, position }) => (
            <div
              key={label}
              className={`absolute hidden items-center gap-2 rounded-2xl border border-border/70 bg-white/95 px-3.5 py-2.5 text-xs font-semibold text-foreground shadow-lg backdrop-blur-sm sm:flex ${position}`}
            >
              <span className="flex size-6 items-center justify-center rounded-lg bg-accent text-primary">
                <Icon className="size-3.5" />
              </span>
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
