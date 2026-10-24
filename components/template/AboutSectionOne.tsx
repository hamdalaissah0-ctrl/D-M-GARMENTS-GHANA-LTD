// Ported from NextJSTemplates/startup-nextjs (MIT License), real D&M content.
import Image from "next/image"
import { Check } from "lucide-react"
import SectionTitle from "./SectionTitle"

const MEDIA_BASE = "https://otscslkmvhunzlxfrqse.supabase.co/storage/v1/object/public/media"

function ListItem({ text }: { text: string }) {
  return (
    <p className="text-body-color mb-5 flex items-center text-lg font-medium">
      <span className="bg-primary/10 text-primary mr-4 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-md">
        <Check className="size-4" />
      </span>
      {text}
    </p>
  )
}

export default function AboutSectionOne() {
  return (
    <section id="about" className="pt-16 md:pt-20 lg:pt-28">
      <div className="container">
        <div className="border-body-color/15 border-b pb-16 md:pb-20 lg:pb-28">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4 lg:w-1/2">
              <SectionTitle
                title="A manufacturing business, not a storefront"
                paragraph="We manufacture hospitality, corporate, workwear, PPE and branded clothing — with embroidery, DTF printing and branding handled in-house."
                mb="44px"
              />

              <div className="mb-12 max-w-[570px] lg:mb-0">
                <div className="mx-[-12px] flex flex-wrap">
                  <div className="w-full px-3 sm:w-1/2 lg:w-full xl:w-1/2">
                    <ListItem text="In-house embroidery" />
                    <ListItem text="DTF & UV printing" />
                  </div>
                  <div className="w-full px-3 sm:w-1/2 lg:w-full xl:w-1/2">
                    <ListItem text="No minimum order" />
                    <ListItem text="Direct communication" />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mx-auto aspect-[4/5] w-full max-w-[500px] px-4 lg:mr-0 lg:w-1/2">
              <Image
                src={`${MEDIA_BASE}/products/dtf-printing-staff.webp`}
                alt="D&M Garments staff member at the DTF printer, working on branded fabric"
                fill
                sizes="(min-width: 1024px) 500px, 100vw"
                className="shadow-three rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
