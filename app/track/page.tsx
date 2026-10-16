import type { Metadata } from "next"
import { PageShell } from "@/components/marketing/page-shell"
import { TrackOrderForm } from "@/components/order/track-order-form"
import { getCompanyProfile } from "@/lib/supabase/queries"

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Check the status of your D&M Garments order request.",
}

export default async function TrackPage() {
  const company = await getCompanyProfile()

  return (
    <PageShell
      company={company}
      title="Track Your Order"
      description="Enter your order number and the phone number you submitted with to check its status."
    >
      <div className="mx-auto max-w-xl">
        <TrackOrderForm />
      </div>
    </PageShell>
  )
}
