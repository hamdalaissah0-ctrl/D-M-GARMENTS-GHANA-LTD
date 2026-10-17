import type { Metadata } from "next"
import { PageShell } from "@/components/marketing/page-shell"
import { getCompanyProfile } from "@/lib/supabase/queries"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How D&M Garments Ghana Limited collects, uses and protects your information.",
}

export default async function PrivacyPage() {
  const company = await getCompanyProfile()
  const companyName = company?.company_name ?? "D&M Garments Ghana Limited"
  const address = company?.address ?? "Ghana"
  const email = company?.email ?? "dnmgghanalimited@gmail.com"
  const phone = company?.phone_primary ?? ""

  return (
    <PageShell company={company} title="Privacy Policy">
      <div className="prose prose-sm max-w-3xl space-y-8 text-sm leading-relaxed text-foreground [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_p]:text-muted-foreground [&_li]:text-muted-foreground">
        <p className="text-muted-foreground">Last updated: 17 October 2026</p>

        <p>
          {companyName} (&quot;D&amp;M Garments&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) respects your
          privacy. This policy explains what information we collect when you use this website, why we collect it, and
          how we use and protect it. It applies to visitors, customers, and anyone who submits an order request,
          contacts us, or tracks an order through this site.
        </p>

        <h2>1. Information we collect</h2>
        <p>We collect information you give us directly when you:</p>
        <ul>
          <li>
            Submit an order or request for quotation — your name, phone number, email (optional), company name
            (optional), delivery location, order details, and any reference images or files you upload.
          </li>
          <li>Contact us through the contact form — your name, message, and phone number or email (optional).</li>
          <li>Track an order — the order number and phone number you submitted with.</li>
        </ul>
        <p>We also automatically collect limited technical information when you browse the site:</p>
        <ul>
          <li>
            Standard web analytics (pages viewed, general location by country/region, device type) via Vercel
            Analytics, which does not use tracking cookies.
          </li>
          <li>
            Technical error information (such as the page you were on and what went wrong) if something breaks,
            via Sentry, so we can fix it.
          </li>
          <li>
            A verification signal from Cloudflare Turnstile when you submit a form, to confirm you&apos;re a real
            visitor and not an automated bot.
          </li>
        </ul>

        <h2>2. How we use your information</h2>
        <ul>
          <li>To review and respond to your order requests and quotations.</li>
          <li>To contact you about your order by phone, SMS, or WhatsApp.</li>
          <li>To let you look up the status of an order you submitted.</li>
          <li>To maintain and improve this website, including diagnosing technical problems.</li>
          <li>To protect this website and our customers from spam and abuse.</li>
        </ul>
        <p>
          We do not sell your information, and we do not use it for advertising. Order information is not shared
          with anyone outside D&amp;M Garments except the service providers listed below, who help us operate this
          website and are only given the access they need to do so.
        </p>

        <h2>3. Who we share information with</h2>
        <p>We use the following service providers to run this website and process orders:</p>
        <ul>
          <li>
            <strong>Supabase</strong> — hosts our database, file storage, and staff login system.
          </li>
          <li>
            <strong>Vercel</strong> — hosts this website.
          </li>
          <li>
            <strong>Arkesel</strong> — delivers SMS notifications to our team when a new order or message comes in.
          </li>
          <li>
            <strong>Cloudflare</strong> — provides bot/spam protection (Turnstile) on our forms.
          </li>
          <li>
            <strong>Sentry</strong> — helps us detect and fix technical errors on the site.
          </li>
        </ul>
        <p>
          We may also disclose information where required by law, or to protect the rights, property, or safety of
          D&amp;M Garments, our customers, or others.
        </p>

        <h2>4. File uploads</h2>
        <p>
          Reference images or files you upload with an order request are stored privately and are only accessible
          to D&amp;M Garments staff reviewing your request — they are never made public.
        </p>

        <h2>5. Data retention</h2>
        <p>
          We keep order and contact information for as long as reasonably necessary to fulfil your request, maintain
          business records, and meet any legal or accounting obligations. You can ask us to delete information that
          is no longer needed by contacting us using the details below.
        </p>

        <h2>6. Your rights</h2>
        <p>
          You can ask us at any time to see what information we hold about you, correct inaccurate information, or
          request that we delete it, subject to any legal or legitimate business reasons we may need to keep it
          (such as an active or recent order). To make a request, contact us using the details below.
        </p>

        <h2>7. Children&apos;s privacy</h2>
        <p>
          This website is intended for businesses and individuals placing manufacturing orders, and is not directed
          at children. We do not knowingly collect personal information from children.
        </p>

        <h2>8. Security</h2>
        <p>
          We use industry-standard measures to protect your information, including encrypted connections (HTTPS),
          access controls restricting order data to authorised staff, and rate limiting and bot protection on our
          public forms. No method of transmission or storage is completely secure, but we work to protect your
          information appropriately.
        </p>

        <h2>9. Changes to this policy</h2>
        <p>
          We may update this policy from time to time as our services change. The &quot;Last updated&quot; date at
          the top of this page reflects the most recent revision.
        </p>

        <h2>10. Contact us</h2>
        <p>
          If you have any questions about this policy or how we handle your information, contact us:
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
