// Ported from NextJSTemplates/startup-nextjs (MIT License), real D&M content.
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

            <div className="w-full px-4 lg:w-1/2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${MEDIA_BASE}/products/school-uniform-navy.png`}
                alt="D&M Garments — school uniform, manufactured in-house"
                className="shadow-three mx-auto aspect-[4/5] max-w-[500px] rounded-lg object-cover lg:mr-0"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
