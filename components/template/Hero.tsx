// Layout/structure ported from NextJSTemplates/startup-nextjs (MIT License),
// recoloured to the D&M brand green and filled with real content.
import Link from "next/link"
import { Phone } from "lucide-react"
import type { CompanyProfile } from "@/lib/supabase/queries"

export default function Hero({ company }: { company: CompanyProfile | null }) {
  return (
    <section
      id="home"
      className="relative z-10 overflow-hidden bg-white py-16 md:py-20 lg:py-28"
    >
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto max-w-[800px] text-center">
              <span className="border-stroke-stroke mb-5 inline-block rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide text-primary uppercase">
                D&amp;M Garments Ghana Limited
              </span>
              <h1 className="text-black mb-5 text-3xl leading-tight font-bold sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
                High-Quality Garments, Made for Your Business
              </h1>
              <p className="text-body-color mb-12 text-base leading-relaxed! sm:text-lg md:text-xl">
                {company?.company_name ?? "D&M Garments Ghana Limited"} manufactures
                hospitality, corporate, workwear and PPE uniforms — with embroidery, DTF
                printing and branding built in.
                {company?.no_moq ? " No minimum order quantity." : ""}
              </p>
              <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <Link
                  href="/products"
                  className="bg-primary rounded-xs px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:opacity-90"
                >
                  Request a Quote
                </Link>
                {company?.phone_primary && (
                  <a
                    href={`tel:${company.phone_primary}`}
                    className="text-black inline-flex items-center gap-2 rounded-xs bg-black/5 px-8 py-4 text-base font-semibold duration-300 ease-in-out hover:bg-black/10"
                  >
                    <Phone className="size-4" /> {company.phone_primary}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 z-[-1] opacity-30 lg:opacity-100">
        <svg width="450" height="556" viewBox="0 0 450 556" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="277" cy="63" r="225" fill="url(#paint0_linear_hero)" />
          <circle cx="17.9997" cy="182" r="18" fill="url(#paint1_radial_hero)" />
          <circle cx="76.9997" cy="288" r="34" fill="url(#paint2_radial_hero)" />
          <circle
            cx="325.486"
            cy="302.87"
            r="180"
            transform="rotate(-37.6852 325.486 302.87)"
            fill="url(#paint3_linear_hero)"
          />
          <defs>
            <linearGradient id="paint0_linear_hero" x1="-54.5003" y1="-178" x2="222" y2="288" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0B5A34" />
              <stop offset="1" stopColor="#0B5A34" stopOpacity="0" />
            </linearGradient>
            <radialGradient
              id="paint1_radial_hero"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(17.9997 182) rotate(90) scale(18)"
            >
              <stop offset="0.145833" stopColor="#0B5A34" stopOpacity="0" />
              <stop offset="1" stopColor="#0B5A34" stopOpacity="0.08" />
            </radialGradient>
            <radialGradient
              id="paint2_radial_hero"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(76.9997 288) rotate(90) scale(34)"
            >
              <stop offset="0.145833" stopColor="#0B5A34" stopOpacity="0" />
              <stop offset="1" stopColor="#0B5A34" stopOpacity="0.08" />
            </radialGradient>
            <linearGradient id="paint3_linear_hero" x1="226.775" y1="-66.1548" x2="292.157" y2="351.421" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0B5A34" />
              <stop offset="1" stopColor="#0B5A34" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 z-[-1] opacity-30 lg:opacity-100">
        <svg width="364" height="201" viewBox="0 0 364 201" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5.88928 72.3303C33.6599 66.4798 101.397 64.9086 150.178 105.427C211.155 156.076 229.59 162.093 264.333 166.607C299.076 171.12 337.718 183.657 362.889 212.24"
            stroke="url(#paint0_linear_hero2)"
          />
          <circle opacity="0.8" cx="214.505" cy="60.5054" r="49.7205" transform="rotate(-13.421 214.505 60.5054)" stroke="url(#paint1_linear_hero2)" />
          <circle cx="220" cy="63" r="43" fill="url(#paint2_radial_hero2)" />
          <defs>
            <linearGradient id="paint0_linear_hero2" x1="184.389" y1="69.2405" x2="184.389" y2="212.24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0B5A34" stopOpacity="0" />
              <stop offset="1" stopColor="#0B5A34" />
            </linearGradient>
            <linearGradient id="paint1_linear_hero2" x1="214.505" y1="10.2849" x2="212.684" y2="99.5816" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0B5A34" />
              <stop offset="1" stopColor="#0B5A34" stopOpacity="0" />
            </linearGradient>
            <radialGradient
              id="paint2_radial_hero2"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(220 63) rotate(90) scale(43)"
            >
              <stop offset="0.145833" stopColor="#0B5A34" stopOpacity="0" />
              <stop offset="1" stopColor="#0B5A34" stopOpacity="0.08" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </section>
  )
}
