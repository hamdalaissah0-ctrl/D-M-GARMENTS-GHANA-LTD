import type { Metadata } from "next"
import { PageShell } from "@/components/marketing/page-shell"
import { getCompanyProfile } from "@/lib/supabase/queries"

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms that apply to using the D&M Garments Ghana Limited website and submitting order requests.",
}

export default async function TermsPage() {
  const company = await getCompanyProfile()
  const companyName = company?.company_name ?? "D&M Garments Ghana Limited"
  const address = company?.address ?? "Ghana"
  const email = company?.email ?? "dnmgghanalimited@gmail.com"
  const phone = company?.phone_primary ?? ""

  return (
    <PageShell company={company} title="Terms of Use">
      <div className="prose prose-sm max-w-3xl space-y-8 text-sm leading-relaxed text-foreground [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_p]:text-muted-foreground [&_li]:text-muted-foreground">
        <p className="text-muted-foreground">Last updated: 17 October 2026</p>

        <p>
          These Terms of Use (&quot;Terms&quot;) govern your use of this website, operated by{" "}
          {companyName} (&quot;D&amp;M Garments&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By using
          this website or submitting an order request, you agree to these Terms. If you do not agree, please do not
          use this website.
        </p>

        <h2>1. What we do</h2>
        <p>
          D&amp;M Garments is a garment manufacturing business based in Ghana, producing hospitality, corporate,
          workwear, PPE, school uniforms, and branded clothing, with embroidery, DTF printing, and UV printing
          handled in-house.
        </p>
        <p>
          This website is not an online store. Submitting an order request through this site is a request for a
          quotation, not a purchase — placing a request does not create a binding order, and no payment is taken on
          this website. After you submit a request, our team reviews it and contacts you to discuss pricing,
          specifications, and timelines. An order is only confirmed once you and D&amp;M Garments agree on those
          terms directly.
        </p>

        <h2>2. Using this website</h2>
        <p>You agree to use this website only for lawful purposes. You agree not to:</p>
        <ul>
          <li>Submit false, misleading, or fraudulent order or contact requests.</li>
          <li>Attempt to disrupt, overload, or gain unauthorised access to this website or its systems.</li>
          <li>Upload any file you do not have the right to share with us.</li>
          <li>Use this website to violate any applicable law or the rights of any third party.</li>
        </ul>

        <h2>3. Order requests and quotations</h2>
        <ul>
          <li>Submitting an order request does not guarantee that we can fulfil it.</li>
          <li>Prices, availability, and production timelines are confirmed directly with you after we review your request, not automatically on this website.</li>
          <li>We have no minimum order quantity — we take on requests of any size, from a single piece to bulk orders.</li>
          <li>You are responsible for making sure the information and files you submit (sizes, quantities, branding details, reference images) are accurate and complete.</li>
        </ul>

        <h2>4. Your submitted content</h2>
        <p>
          When you upload reference images or files, you confirm that you have the right to share them with us and
          to have them used for the purpose of preparing and fulfilling your order. We will not use your uploaded
          files for any other purpose.
        </p>

        <h2>5. Intellectual property</h2>
        <p>
          The content on this website — including our logo, text, photographs of our own products and work, and
          overall design — belongs to D&amp;M Garments or its licensors and may not be copied or reused without
          our permission, except as necessary to browse the site normally.
        </p>

        <h2>6. Third-party links</h2>
        <p>
          This website contains links to third-party services such as WhatsApp for direct communication with our
          team. We are not responsible for the content, policies, or practices of third-party websites or services
          you access through these links.
        </p>

        <h2>7. Disclaimers</h2>
        <p>
          This website and its content are provided &quot;as is&quot;. While we work to keep information accurate
          and the site available, we do not guarantee that it will always be error-free, uninterrupted, or
          available. To the extent permitted by law, D&amp;M Garments is not liable for any indirect or
          consequential loss arising from your use of this website. Nothing in these Terms limits any right you
          have that cannot be excluded under applicable Ghanaian law.
        </p>

        <h2>8. Governing law</h2>
        <p>
          These Terms are governed by the laws of Ghana. Any dispute arising from your use of this website will be
          subject to the exclusive jurisdiction of the courts of Ghana.
        </p>

        <h2>9. Changes to these Terms</h2>
        <p>
          We may update these Terms from time to time. The &quot;Last updated&quot; date at the top of this page
          reflects the most recent revision. Continued use of this website after changes are posted means you
          accept the updated Terms.
        </p>

        <h2>10. Contact us</h2>
        <p>
          If you have any questions about these Terms, contact us:
          <br />
          {companyName}
          <br />
          {address}
          {phone && (
            <>
              <br />
              {phone}
            </>
          )}
          <br />
          {email}
        </p>
      </div>
    </PageShell>
  )
}
