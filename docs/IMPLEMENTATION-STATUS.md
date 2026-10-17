# D&M Garments — Implementation Status

Last updated: 2026-10-16

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
| 15 Security | PASS — RLS, server-side validation, auth/authz, signed URLs, audit logs, Turnstile (real production keys, confirmed working by the user from a real browser 2026-10-16) all in place; MISSING: rate limiting, Sentry |
| 16 SEO | PASS — `sitemap.ts`/`robots.ts` already existed (prior audit entry was stale); added `metadataBase`, sitewide OpenGraph/Twitter defaults, real favicon/apple-icon (replacing the default Next.js starter icon), Organization JSON-LD on the homepage, FAQPage JSON-LD on `/faq`, and the 3 missing routes (`/track`, `/privacy`, `/terms`) to the sitemap. Removed unused default Next.js starter SVGs from `public/`. Verified via live DOM inspection 2026-10-17 |
| 17 Analytics | MISSING — no events instrumented |
| 18 Performance | NOT AUDITED |
| 19 Testing | MISSING — zero automated tests |
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

### REFACTOR (works, but should be tightened if touched again)
- `lib/supabase/queries.ts` — single growing file; fine at current size, split by domain if it keeps growing
- `supabase/functions/_shared/notifications.ts` — email/WhatsApp provider stubs have unused-param lint warnings; either implement or prefix params with `_` intentionally (already done) and leave until a real provider is wired

### REPLACE (not currently planned — only if user asks)
- Nothing identified. The Jiji-style single-item order flow (ADR-004) and manual `wa.me` WhatsApp links (ADR-008) are both intentional product decisions, not placeholders awaiting replacement.

### REMOVE
- Default Next.js starter assets (`public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`, default `app/favicon.ico`) — confirmed unreferenced anywhere in the codebase, removed 2026-10-17 and replaced with the real D&M logo as `app/icon.png`/`app/apple-icon.png`.

### MISSING (named by the new spec, not yet built — prioritize per user request, not automatically)
- Groq AI integration — user asked directly 2026-10-17, chose to skip: no use case was ever defined (spec only said "planned"), and building a feature with no defined behavior would be invented scope. Revisit only if the user brings a concrete use case.
- Sentry error monitoring, Vercel Analytics events
- SEO metadata factory, sitemap/robots/JSON-LD audit
- Automated tests (lint/typecheck/build already run each session; no Playwright/unit tests exist)
- Rate limiting on public mutation endpoints

## Governing rule going forward

Per the user's 2026-10-16 instruction (ADR-005): work phase-by-phase, don't jump between frontend/db/dashboard/animations/APIs/SEO simultaneously. At the end of any substantial change: list files created/changed, list DB changes, list dependencies added, run lint+typecheck+build, fix failures, update this file, mark PASS or BLOCKED before continuing. Do not introduce a competing library (state management, animation, icons, forms, uploads) without logging the reason in `DECISIONS.md` first — see `ASSET-SOURCES.md` for the approved manifest.
