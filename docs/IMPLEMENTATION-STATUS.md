# D&M Garments — Implementation Status

Last updated: 2026-10-17

## Phase tracker

| Phase | Status |
|---|---|
| 00 Existing System Audit | PASS (this document) |
| 01 Architecture Freeze | PASS — see `ARCHITECTURE.md`; stack confirmed, no competing libraries present |
| 02 Design System | PARTIAL — core primitives exist (KEEP), several checklist components missing (see `DESIGN-SYSTEM.md`) |
| 03 Global Website Shell | PASS — header/footer/mobile nav/error/loading boundaries exist and work |
| 04 Homepage | PASS — built and shipped, section-by-section (not a monolith) |
| 05 Product Catalogue | PASS — `/products`, `/products/[category]` live with real data |
| 06 Product Configurator | PARTIAL BY DESIGN — single-item quick-order (size/qty/details), not a multi-step configurator (ADR-004: never requested) |
| 07 Quotation Basket | NOT BUILT BY DESIGN — see ADR-004; revisit only on explicit request |
| 08 Database | PASS — 7 migrations applied, live schema matches app |
| 09 Quotation/Order Backend | PASS — idempotent submission, audit trail, RLS, server-verified Turnstile on all 3 public forms (2026-10-16) |
| 10 File Storage | PASS — private order-files bucket + public media bucket, correctly separated |
| 11 Notifications | PASS — SMS (Arkesel) live for both orders and contact messages; `notification_events` table tracks per-channel delivery status (channel/recipient/status/attempts/error), surfaced in the admin order detail page (2026-10-16). WhatsApp is permanently manual-link by decision (ADR-008), email still stubbed — neither blocks PASS |
| 12 Customer Request Tracking | PASS — public `/track` page, Turnstile-gated `track_order_request()` RPC matches by order number + last-9-digits phone, returns only customer-safe fields (no internal notes/staff names), never confirms/denies which part of a wrong pair was incorrect (2026-10-16) |
| 13 Admin System | PASS — orders/messages/customers/categories/products/quotes/settings/staff all live |
| 14 CMS | PASS — Testimonials/FAQs/Portfolio admin shipped and verified 2026-10-16 |
| 15 Security | PASS — RLS, server-side validation, auth/authz, signed URLs, audit logs, Turnstile (real production keys), and rate limiting (`check_rate_limit()` Postgres function, fixed-window, all 3 public Edge Functions) all in place and verified 2026-10-17; MISSING: Sentry |
| 16 SEO | PASS — `sitemap.ts`/`robots.ts` already existed (prior audit entry was stale); added `metadataBase`, sitewide OpenGraph/Twitter defaults, real favicon/apple-icon (replacing the default Next.js starter icon), Organization JSON-LD on the homepage, FAQPage JSON-LD on `/faq`, and the 3 missing routes (`/track`, `/privacy`, `/terms`) to the sitemap. Removed unused default Next.js starter SVGs from `public/`. Verified via live DOM inspection 2026-10-17 |
| 17 Analytics | PASS (code) / ACTION NEEDED (dashboard) — `@vercel/analytics` wired into the root layout (automatic pageviews) plus custom events: `order_submitted` (both order forms), `contact_submitted`, `phone_clicked`/`whatsapp_clicked` (quick-order form). Verified firing correctly in dev console 2026-10-17. User must toggle "Web Analytics" on for the project in the Vercel dashboard (Project → Analytics tab) for events to actually be collected in production — the code works regardless, but nothing is retained until that's enabled. Sentry still NOT STARTED |
| 18 Performance | NOT AUDITED |
| 19 Testing | PASS (scoped) — Playwright E2E suite (`e2e/`, 15 tests × 2 projects), covering what's honestly testable without a Turnstile test-key environment: page rendering, navigation (desktop + mobile menu), catalogue browsing, admin-auth redirect, 404, JSON-LD/favicon correctness, and form-disabled-until-verified gating. Does **not** cover actual order/contact/track *submission* (Turnstile blocks automated browsers by design — the same protection verified manually in Phases 9/11/12/15). Runs against the production build (`next build && next start`), not dev mode, after discovering Turbopack's on-demand dev compilation causes flaky navigation timing. Found and fixed a real accessibility bug along the way: `quick-order-form.tsx` and `track-order-form.tsx` had `<Label>` elements not programmatically associated with their `<Input>`s (no `htmlFor`/`id`) |
| 20 Production | PARTIAL — deployed and live on Vercel; launch checklist (Turnstile, monitoring, Lighthouse, a11y scan) not run |

## KEEP / REFACTOR / REPLACE / REMOVE / MISSING classification

### KEEP (working, real, no change needed)
- Next.js 16 / React 19 / TypeScript strict / Tailwind v4 / shadcn (base-nova) stack
- Supabase schema, RLS policies, audit triggers, storage buckets
- `submit_order_request`/`submit_contact_request` RPCs (idempotent, already fixed for column ambiguity)
- Admin auth guard (`proxy.ts`) and full admin CRUD surface
- Arkesel SMS integration
- Content CMS (testimonials/FAQs/portfolio) — verified end-to-end 2026-10-16
- `ContentRequired` empty-state pattern (central to the no-fake-content rule)
- Ported `components/template/*` (MIT-licensed, real content, already recolored)
- Lucide as sole icon family (already matches the new spec)
- Turnstile bot protection on `/order`, the quick-order form, and `/contact` — real production keys live on all environments, confirmed working by the user from a real browser 2026-10-16
- Admin Messages inbox (`/admin/messages`) and order-detail notification-delivery visibility — closes the gap where contact-form submissions were stored but never surfaced to staff or alerted by SMS; verified end-to-end 2026-10-16
- Public order tracking (`/track`) — `track_order_request()` RPC verified directly (correct pair returns data, wrong phone returns nothing); linked from the footer and both order-success confirmations; 2026-10-16
- SEO: metadataBase, sitewide OG/Twitter defaults, real favicon/apple-icon, homepage Organization JSON-LD, FAQ page FAQPage JSON-LD, complete sitemap — verified via live DOM inspection 2026-10-17
- Analytics: `@vercel/analytics` with pageviews + `order_submitted`/`contact_submitted`/`phone_clicked`/`whatsapp_clicked` custom events, verified firing in dev console 2026-10-17. User has enabled the Vercel dashboard "Web Analytics" toggle (2026-10-17)
- Playwright E2E suite (`e2e/`) covering rendering/navigation/catalogue/auth-guard/404/JSON-LD/form-gating — 28 passing, 2 skipped (project-specific). Runs against the production build. See Phase 19 row for scope boundary (no Turnstile-gated submission coverage)
- Rate limiting on all 3 public Edge Functions — `check_rate_limit()` fixed-window Postgres function (no new external service), 5 req/10min per IP on `submit-order`/`submit-contact`, 10 req/10min per IP *and* per order-number on `track-order` (defends against both IP flooding and distributed phone-guessing against one order). Verified directly against the RPC: 5 allowed then rejected on the 6th, test rows cleaned up

### REFACTOR (works, but should be tightened if touched again)
- `lib/supabase/queries.ts` — single growing file; fine at current size, split by domain if it keeps growing
- `supabase/functions/_shared/notifications.ts` — email/WhatsApp provider stubs have unused-param lint warnings; either implement or prefix params with `_` intentionally (already done) and leave until a real provider is wired

### REPLACE (not currently planned — only if user asks)
- Nothing identified. The Jiji-style single-item order flow (ADR-004) and manual `wa.me` WhatsApp links (ADR-008) are both intentional product decisions, not placeholders awaiting replacement.

### REMOVE
- Default Next.js starter assets (`public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`, default `app/favicon.ico`) — confirmed unreferenced anywhere in the codebase, removed 2026-10-17 and replaced with the real D&M logo as `app/icon.png`/`app/apple-icon.png`.

### MISSING (named by the new spec, not yet built — prioritize per user request, not automatically)
- Groq AI integration — user asked directly 2026-10-17, chose to skip: no use case was ever defined (spec only said "planned"), and building a feature with no defined behavior would be invented scope. Revisit only if the user brings a concrete use case.
- Sentry error monitoring — needs its own account, same category as the Turnstile/Vercel Analytics setup already done
- Lighthouse/performance audit (Phase 18, not started)

## Governing rule going forward

Per the user's 2026-10-16 instruction (ADR-005): work phase-by-phase, don't jump between frontend/db/dashboard/animations/APIs/SEO simultaneously. At the end of any substantial change: list files created/changed, list DB changes, list dependencies added, run lint+typecheck+build, fix failures, update this file, mark PASS or BLOCKED before continuing. Do not introduce a competing library (state management, animation, icons, forms, uploads) without logging the reason in `DECISIONS.md` first — see `ASSET-SOURCES.md` for the approved manifest.
