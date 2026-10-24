import type { Metadata } from "next"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { OrderForm } from "@/components/order/order-form"
import { getCompanyProfile } from "@/lib/supabase/queries"

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Submit a manufacturing request to D&M Garments Ghana Limited — tell us what you need, upload reference designs, and our team will contact you.",
}

export default async function OrderPage() {
  const company = await getCompanyProfile()

  return (
    <>
      <SiteHeader phone={company?.phone_primary} />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Request a Quote
            </h1>
            <p className="mt-3 text-muted-foreground">
              Tell us what you need and our team will review your request and get in touch.
            </p>
          </div>
          <OrderForm />
        </div>
      </main>
      <SiteFooter company={company} />
    </>
  )
}
