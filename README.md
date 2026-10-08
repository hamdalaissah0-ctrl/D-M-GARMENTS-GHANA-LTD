# D&M Garments Ghana Limited — Digital Manufacturing Platform

A manufacturing order-intake platform for D&M Garments Ghana Limited: public catalogue,
custom RFQ (request-for-quotation) engine, CRM-lite, and an internal admin/staff dashboard.
This is **not** an e-commerce storefront — order submission is an enquiry, not a payment;
D&M reviews requirements and quotes a price afterwards.

See `DM_Garments_Master_Digital_Platform_Plan_Professional.pdf` (the governing spec) for
the full product, UX, and architecture requirements this build follows.

## Stack

- **Frontend**: Next.js (App Router) + TypeScript (strict) + Tailwind CSS + shadcn/ui (base-ui) + Lucide icons
- **Backend**: Supabase — Postgres, Auth, Storage, Edge Functions, Row Level Security
- **Validation**: Zod + React Hook Form
- **SMS**: Arkesel
- **AI**: Groq (free tier) — planned, not yet wired in
- **WhatsApp**: manual `wa.me` deep links for staff-to-customer chat today; automated
  Cloud API notifications are a future phase once a WABA is verified (see
  `supabase/functions/_shared/notifications.ts`)

## Project principle: never invent business facts

Prices, certifications, staff names, policies, testimonials, and portfolio work must come
from the Supabase CMS or explicit D&M-supplied data — never fabricated. Where content isn't
yet supplied, the UI shows a visible "Content required" placeholder (see
`components/marketing/content-required.tsx`) instead of guessing.

## Local development

```bash
npm install
npm run dev
```

Requires `.env.local` (see `.env.example`) with:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `ARKESEL_API_KEY` / `ARKESEL_SENDER_ID` (for SMS notifications)
- `GROQ_API_KEY` (once AI features are built)

## Database

Schema lives in `supabase/migrations/`. Apply with:

```bash
supabase link --project-ref <ref>
supabase db push
```

Row Level Security is enabled on every table. Public/anon access to orders, customers and
contact submissions goes **only** through the `submit_order_request` / `submit_contact_request`
Postgres functions (via the `submit-order` / `submit-contact` Edge Functions) — there is no
direct anon table access to customer or order data.

## Edge Functions

```bash
supabase functions deploy submit-order submit-contact --use-api --no-verify-jwt
```

- `submit-order` — validates input, calls `submit_order_request` (idempotent — a duplicate
  submission with the same key returns the original order, never a second one), records
  uploaded file references, and best-effort notifies D&M by SMS.
- `submit-contact` — simple contact form submission.

## Repository layout

```
app/              Next.js App Router routes
components/
  layout/         Site header/footer
  marketing/      Public content components
  order/          RFQ form
  ui/             shadcn/ui primitives
lib/
  supabase/       client/server/admin Supabase clients, typed queries, upload helper
  validation/     Zod schemas
types/database.ts Generated Supabase types (`supabase gen types typescript --linked`)
supabase/
  migrations/     SQL migrations (source of truth for schema)
  functions/      Deno Edge Functions
```

## Status

This is an early-stage build. Shipped so far: public homepage, catalogue browsing (category
+ product detail), the full RFQ submission flow with file upload (verified end-to-end against
the live database and Edge Functions), and a working contact form. **Not yet built**: staff
authentication, the admin/CRM dashboard, quotes, WhatsApp Cloud API integration, AI features,
and SEO/analytics instrumentation beyond the basics (sitemap, robots, metadata).
