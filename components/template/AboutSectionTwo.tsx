// Ported from NextJSTemplates/startup-nextjs (MIT License), real D&M content.
import Image from "next/image"

const MEDIA_BASE = "https://otscslkmvhunzlxfrqse.supabase.co/storage/v1/object/public/media"

const ITEMS = [
  {
    title: "In-House Production",
    paragraph: "DTF printing, UV printing and embroidery are all handled under one roof — no outsourcing, no delays.",
  },
  {
    title: "Direct Communication",
    paragraph: "Talk directly with our team by phone or WhatsApp throughout your order, from request to delivery.",
  },
  {
    title: "No Minimum Order",
    paragraph: "Whether it's 10 pieces or 10,000, we take on requests of any size.",
  },
]

export default function AboutSectionTwo() {
  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap items-center">
          <div className="relative mx-auto mb-12 aspect-[4/5] w-full max-w-[500px] px-4 lg:mb-0 lg:w-1/2">
            <Image
              src={`${MEDIA_BASE}/products/school-uniform-green.png`}
              alt="D&M Garments — school uniform sample"
              fill
              sizes="(min-width: 1024px) 500px, 100vw"
              className="shadow-three rounded-lg object-cover"
            />
          </div>
          <div className="w-full px-4 lg:w-1/2">
            <div className="max-w-[470px]">
              {ITEMS.map((item) => (
                <div key={item.title} className="mb-9">
                  <h3 className="text-black mb-4 text-xl font-bold sm:text-2xl lg:text-xl xl:text-2xl">
                    {item.title}
                  </h3>
                  <p className="text-body-color text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed">
                    {item.paragraph}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
