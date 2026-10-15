// Layout ported from NextJSTemplates/startup-nextjs (MIT License), wired to
// real Supabase testimonials — never fabricated reviews.
import { Star } from "lucide-react"
import SectionTitle from "./SectionTitle"
import { ContentRequired } from "@/components/marketing/content-required"
import type { Testimonial } from "@/lib/supabase/queries"

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="bg-gray-light relative z-10 py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title="Why Businesses Choose D&M"
          paragraph="Real feedback from real D&M customers — nothing here is fabricated."
          center
        />

        {testimonials.length === 0 ? (
          <ContentRequired
            title="No testimonials published yet"
            description="Only real, D&M-supplied customer testimonials are published here — never fabricated reviews."
          />
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.id} className="w-full">
                <div className="shadow-two hover:shadow-one rounded-xs bg-white p-8 duration-300 lg:px-5 xl:px-8">
                  {t.rating && (
                    <div className="mb-5 flex items-center space-x-1 text-yellow-400">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="size-4.5 fill-current" />
                      ))}
                    </div>
                  )}
                  <p className="border-body-color/10 text-body-color mb-8 border-b pb-8 text-base leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center">
                    <div className="bg-primary/10 text-primary mr-4 flex size-[50px] shrink-0 items-center justify-center rounded-full text-lg font-semibold">
                      {t.customer_name.charAt(0)}
                    </div>
                    <div className="w-full">
                      <h3 className="text-dark mb-1 text-lg font-semibold lg:text-base xl:text-lg">
                        {t.customer_name}
                      </h3>
                      {t.company_name && (
                        <p className="text-body-color text-sm">{t.company_name}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
