import { Target, Eye } from "lucide-react"
import { ScrollReveal } from "@/components/marketing/scroll-reveal"

const MISSION =
  "Our mission is to deliver exceptional garment manufacturing solutions through quality craftsmanship, innovative production, and sustainable practices. We are committed to producing garments that meet the highest standards of quality, comfort, durability, and style, while providing reliable service and creating lasting value for our customers and business partners."

const VISION =
  "To become a leading and trusted garment manufacturing company, recognized for excellence in quality, innovation, craftsmanship, and sustainable production, while setting new standards in the apparel industry locally and globally."

export function MissionVisionBanners() {
  return (
    <section className="overflow-hidden">
      <div className="grid lg:grid-cols-2">
        <ScrollReveal direction="left" className="bg-brand-panel px-6 py-16 text-white sm:px-10 lg:px-16">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-cta">
            <Target className="size-6" />
          </span>
          <h3 className="mt-5 text-2xl font-bold tracking-tight">Mission Statement</h3>
          <p className="mt-4 leading-relaxed text-white/70">{MISSION}</p>
        </ScrollReveal>

        <ScrollReveal direction="right" className="bg-brand-cta px-6 py-16 text-white sm:px-10 lg:px-16">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-white/15">
            <Eye className="size-6" />
          </span>
          <h3 className="mt-5 text-2xl font-bold tracking-tight">Vision Statement</h3>
          <p className="mt-4 leading-relaxed text-white/85">{VISION}</p>
        </ScrollReveal>
      </div>
    </section>
  )
}
