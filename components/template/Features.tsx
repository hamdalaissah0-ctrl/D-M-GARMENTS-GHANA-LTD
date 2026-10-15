// Ported from NextJSTemplates/startup-nextjs (MIT License), real D&M content.
import { Wallet, BadgeCheck, HeartHandshake, type LucideIcon } from "lucide-react"
import SectionTitle from "./SectionTitle"

const FEATURES: { icon: LucideIcon; title: string; paragraph: string }[] = [
  {
    icon: Wallet,
    title: "No Minimum Order",
    paragraph: "We take on requests of any size — no minimum order quantity, ever.",
  },
  {
    icon: BadgeCheck,
    title: "Full Customisation In-House",
    paragraph: "Embroidery, DTF printing and branding handled under one roof.",
  },
  {
    icon: HeartHandshake,
    title: "Direct Communication",
    paragraph: "Talk directly with our team by phone or WhatsApp throughout your order.",
  },
]

export default function Features() {
  return (
    <section id="features" className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title="Essential features for manufacturing success"
          paragraph="Everything you need to get quality, custom-branded garments made — without the usual back and forth."
          center
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, paragraph }) => (
            <div key={title} className="w-full">
              <div className="bg-primary/10 text-primary mb-10 flex h-[70px] w-[70px] items-center justify-center rounded-md">
                <Icon className="size-7" />
              </div>
              <h3 className="text-black mb-5 text-xl font-bold sm:text-2xl lg:text-xl xl:text-2xl">
                {title}
              </h3>
              <p className="text-body-color pr-[10px] text-base leading-relaxed font-medium">
                {paragraph}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
