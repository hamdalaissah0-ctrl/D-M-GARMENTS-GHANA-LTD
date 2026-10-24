// Ported from NextJSTemplates/startup-nextjs (MIT License), real D&M content.
import { Wallet, BadgeCheck, HeartHandshake, type LucideIcon } from "lucide-react"
import SectionTitle from "./SectionTitle"

// The two greens sampled directly from the hero banner graphic
// (dark background green + the lighter accent green used in its text).
const DARK_GREEN = "#0F4D26"
const LIGHT_GREEN = "#8CC63E"

const FEATURES: { icon: LucideIcon; title: string; paragraph: string; variant: "dark" | "light" }[] = [
  {
    icon: Wallet,
    title: "No Minimum Order",
    paragraph: "We take on requests of any size — no minimum order quantity, ever.",
    variant: "dark",
  },
  {
    icon: BadgeCheck,
    title: "Full Customisation In-House",
    paragraph: "Embroidery, DTF printing and branding handled under one roof.",
    variant: "light",
  },
  {
    icon: HeartHandshake,
    title: "Direct Communication",
    paragraph: "Talk directly with our team by phone or WhatsApp throughout your order.",
    variant: "dark",
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, paragraph, variant }) => {
            const dark = variant === "dark"
            return (
              <div
                key={title}
                className="w-full rounded-2xl p-8 shadow-sm"
                style={{ backgroundColor: dark ? DARK_GREEN : LIGHT_GREEN }}
              >
                <div
                  className="mb-8 flex h-14 w-14 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: dark ? LIGHT_GREEN : DARK_GREEN,
                    color: dark ? DARK_GREEN : LIGHT_GREEN,
                  }}
                >
                  <Icon className="size-6" />
                </div>
                <h3 className={`mb-3 text-xl font-bold sm:text-2xl lg:text-xl xl:text-2xl ${dark ? "text-white" : "text-[#0F4D26]"}`}>
                  {title}
                </h3>
                <p className={`text-base leading-relaxed font-medium ${dark ? "text-white/75" : "text-[#0F4D26]"}`}>
                  {paragraph}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
