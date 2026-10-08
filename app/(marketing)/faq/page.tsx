import type { Metadata } from "next"
import { PageShell } from "@/components/marketing/page-shell"
import { ContentRequired } from "@/components/marketing/content-required"
import { getCompanyProfile, getPublishedFaqs } from "@/lib/supabase/queries"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about ordering from D&M Garments Ghana Limited.",
}

export default async function FaqPage() {
  const [company, faqs] = await Promise.all([getCompanyProfile(), getPublishedFaqs()])

  return (
    <PageShell company={company} title="Frequently Asked Questions">
      {faqs.length === 0 ? (
        <ContentRequired
          title="No FAQs published yet"
          description="Answers will appear here once approved by D&M."
        />
      ) : (
        <Accordion className="max-w-2xl">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </PageShell>
  )
}
