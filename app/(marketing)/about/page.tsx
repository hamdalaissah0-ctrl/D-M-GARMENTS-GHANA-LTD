import type { Metadata } from "next"
import { MapPin, MessageCircle, PackageCheck, Factory } from "lucide-react"
import { PageShell } from "@/components/marketing/page-shell"
import { ContentRequired } from "@/components/marketing/content-required"
import { MissionVisionBanners } from "@/components/marketing/mission-vision-banners"
import { MapEmbed } from "@/components/marketing/map-embed"
import { getCompanyProfile } from "@/lib/supabase/queries"

export const metadata: Metadata = {
  title: "About Us",
  description: "About D&M Garments Ghana Limited.",
}

export default async function AboutPage() {
  const company = await getCompanyProfile()

  const INFO_CARDS = [
    {
      icon: Factory,
      title: "In-House Production",
      body: "Embroidery, DTF and UV printing are all handled under one roof — no outsourcing, no delays.",
    },
    {
      icon: PackageCheck,
      title: company?.no_moq ? "No Minimum Order" : "Flexible Order Sizes",
      body: company?.no_moq
        ? "We take on requests of any size — no minimum order quantity, ever."
        : "Talk to us about your order size and timeline.",
    },
    {
      icon: MessageCircle,
      title: "Direct Communication",
      body: company?.phone_primary
        ? `Reach our team directly on ${company.phone_primary}, by call or WhatsApp.`
        : "Talk directly with our team throughout your order.",
    },
    {
      icon: MapPin,
      title: "Based in Ghana",
      body: company?.address ?? "Content required",
    },
  ]

  return (
    <PageShell company={company} title="About D&M Garments Ghana Limited">
      <div className="max-w-3xl space-y-6">
        <p className="text-muted-foreground">
          {company?.company_name ?? "D&M Garments Ghana Limited"} is a garment
          manufacturing and branding business based at{" "}
          {company?.address ?? "Content required"}.
        </p>
        <ContentRequired
          title="Company history required"
          description="D&M's founding story, years in operation, and manufacturing capabilities will appear here once supplied — nothing is invented."
        />
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {INFO_CARDS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-2xl border border-border bg-white p-6">
            <span className="flex size-11 items-center justify-center rounded-xl bg-brand-cta text-white">
              <Icon className="size-5" />
            </span>
            <p className="mt-4 font-semibold text-foreground">{title}</p>
            <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>

      {company?.address && (
        <div className="mt-12">
          <MapEmbed address={company.address} />
        </div>
      )}

      <div className="mt-16 -mx-4 -mb-16 sm:-mx-6 sm:-mb-16 lg:-mx-8 lg:-mb-16">
        <MissionVisionBanners />
      </div>
    </PageShell>
  )
}
