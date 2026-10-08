import type { Metadata } from "next"
import { Phone, Mail, MapPin } from "lucide-react"
import { PageShell } from "@/components/marketing/page-shell"
import { ContactForm } from "@/components/marketing/contact-form"
import { getCompanyProfile } from "@/lib/supabase/queries"

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with D&M Garments Ghana Limited.",
}

export default async function ContactPage() {
  const company = await getCompanyProfile()

  return (
    <PageShell
      company={company}
      title="Contact D&M Garments"
      description="Have a question before you submit a request? Reach us directly."
    >
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="size-4 text-primary" />
            <span>{company?.address ?? "Content required"}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="size-4 text-primary" />
            <span>{company?.phone_primary ?? "Content required"}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Mail className="size-4 text-primary" />
            <span>{company?.email ?? "Content required"}</span>
          </div>
        </div>
        <ContactForm />
      </div>
    </PageShell>
  )
}
