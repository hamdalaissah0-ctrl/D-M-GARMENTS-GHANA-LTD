# D&M Garments — Architecture

## Stack (frozen — see ASSET-SOURCES.md / DECISIONS.md before adding anything new)

- Next.js 16.4.0 (App Router, Turbopack, React 19.3)
- TypeScript strict
- Tailwind CSS v4 (`@utility`/`@theme` tokens in `app/globals.css`, no `tailwind.config` file)
- shadcn/ui on the `base-nova` preset — this uses **`@base-ui/react`, not Radix**. No `asChild`; use the `render` prop. `Select.onValueChange` can receive `null`.
- Supabase: Postgres, Auth, Storage, Edge Functions (Deno). No Realtime in use yet.
- React Hook Form + Zod (`@hookform/resolvers`)
- `sonner` for toasts
- `lucide-react` for icons (single icon family already — matches the new spec's rule)
- `server-only` guards the service-role Supabase client from client bundles
- Cloudflare Turnstile (hand-written `components/shared/turnstile-widget.tsx`, no third-party wrapper) — gates all 3 public mutation forms, real production keys live (ADR-007)
- `@vercel/analytics` — pageviews + custom conversion events (ADR, see IMPLEMENTATION-STATUS.md Phase 17)

## Deliberately not adopted (named by the new spec, rejected with a reason — not oversights)

- Motion (animation library) — current animations are hand-rolled CSS transitions + an IntersectionObserver `ScrollReveal` wrapper (`components/marketing/scroll-reveal.tsx`). Approved for future use if a specific need arises (layout animation, gesture) that CSS can't do cleanly.
- Zustand — no client state library; the only multi-step client state (quick-order form) is local `useState` inside one component, not a shared basket (ADR-004: no basket by design).
- WhatsApp Cloud API — manual `wa.me` links are the permanent choice (ADR-008).
- Groq AI — skipped pending a concrete use case (ADR-009).
- Resend / transactional email — notifications are SMS-only (Arkesel) right now; email provider in `_shared/notifications.ts` is a stub.
- Sentry — no error monitoring yet; needs its own account (same category as Turnstile/Vercel Analytics setup).
- Playwright / any test runner — zero automated tests exist (Phase 19, not yet started).

## Routing (`app/`)

Public: `/` (home), `/(marketing)/about`, `/(marketing)/contact`, `/(marketing)/faq`, `/services`, `/industries`, `/portfolio`, `/products`, `/products/[category]`, `/products/[category]/[product]`, `/order`, `/track`, `/privacy`, `/terms`, `/auth/login`, `/not-found`.

Admin (`/admin/*`, guarded by `proxy.ts`): dashboard, `orders`, `orders/[id]`, `messages`, `customers`, `customers/[id]`, `categories`, `products`, `products/new`, `products/[id]`, `quotes`, `quotes/[id]`, `settings`, `staff`, `content`.

Auth/session handling lives in `proxy.ts` (renamed from `middleware.ts` by the Next 16 codemod — function is `proxy`, matcher covers `/admin/:path*` and `/auth/login`).

## Server actions (`lib/actions/`)

`auth.ts`, `orders.ts`, `catalogue.ts`, `settings.ts`, `staff.ts`, `quotes.ts`, `content.ts`, `messages.ts` — all `"use server"`, all use the RLS-respecting client (`lib/supabase/server.ts`), never the service-role client, because RLS policies already grant staff access by role.

## Data access (`lib/supabase/queries.ts`)

Single growing file of read queries (`getCompanyProfile`, `getPublishedCategories`, `getCurrentStaffProfile`, `getAdminDashboardStats`, `getRecentOrders`, `getOrdersList`, `getOrderDetail`, `getOrderFileSignedUrl`, `getCustomersList`, `getCustomerDetail`, `getStaffProfiles`, `getCategoryWithGallery`, `getContactSubmissions`). Not yet split by domain.

## Edge Functions (`supabase/functions/`)

`submit-order`, `submit-contact`, `track-order`, shared `_shared/cors.ts`, `_shared/turnstile.ts` (server-side Turnstile `siteverify`), `_shared/rate-limit.ts` (Postgres-backed fixed-window limiter), and `_shared/notifications.ts` (NotificationProvider interface; only `ArkeselSmsProvider` is real — WhatsApp/email providers in that file are stubs, hence the lint warnings on unused params). All three public-facing functions check the rate limit first (cheapest), then require a valid Turnstile token.

## Known structural gaps vs. the new phase plan

- No quotation **basket** — current flow is "configure one item → submit immediately" (Jiji-style quick order), not a multi-item cart that persists across navigation. This is a deliberate product decision from the user (ADR-004), not an oversight — revisit only if the user asks for multi-item quotes.
- `lib/supabase/queries.ts` is a single file, not split per the spec's suggested domain boundaries — low priority, works fine at current size.
