# D&M Garments — Integrations

| Integration | Status | Notes |
|---|---|---|
| Supabase (Postgres/Auth/Storage/Edge Functions) | LIVE | Project `otscslkmvhunzlxfrqse`, connected via Vercel integration |
| Arkesel SMS | LIVE | `ArkeselSmsProvider` in `supabase/functions/_shared/notifications.ts`, real API key in env |
| WhatsApp | MANUAL ONLY (permanent, by decision) | `wa.me` deep links from `QuickOrderForm` and the admin order workspace. User explicitly chose to stay on this over the Cloud API (2026-10-16) — see ADR-008 |
| Email | STUB | `NotificationProvider` interface has an email variant with unused params (lint warnings) — no real provider wired |
| Groq AI | DELIBERATELY SKIPPED | User asked directly 2026-10-17, chose to skip — no use case was ever defined, see ADR-009 |
| Cloudflare Turnstile | LIVE (production keys) | `components/shared/turnstile-widget.tsx` + server-side `verifyTurnstile()` in both Edge Functions, gating `/order`, `/products/[category]` quick order, and `/contact`. Real widget (site key `0x4AAAAAAFY157bEdws25usy`) created by the user for domain `d-m-garments-ghana-ltd.vercel.app`, wired into `.env.local`, the Supabase Edge Function secret, and Vercel production env vars, production redeployed. Confirmed working end-to-end by the user from a real browser on 2026-10-16 |
| Sentry | LIVE (production DSN) | `@sentry/nextjs` (client/server/edge + `global-error.tsx`). Real DSN from user's own Sentry account, set as Vercel production env var only (blank in local dev on purpose). Verified end-to-end: a deliberately-triggered production error appeared in the Sentry dashboard within a minute (2026-10-17). Source-map upload not yet configured — optional, needs `SENTRY_AUTH_TOKEN` |
| Vercel Analytics | LIVE | `@vercel/analytics` in `app/layout.tsx`; custom events `order_submitted`, `contact_submitted`, `phone_clicked`, `whatsapp_clicked`. Verified firing in dev console 2026-10-17; user has enabled "Web Analytics" in the Vercel dashboard |
| GitHub | LIVE | `hamdalaissah0-ctrl/D-M-GARMENTS-GHANA-LTD`, pushed via Terminal panel (gh/git credential isolation — see DECISIONS.md) |
| Vercel | LIVE | Auto-deploys from `main` via pre-existing GitHub integration. Function region pinned to `lhr1` (London) via `vercel.json` to match Supabase's `eu-west-2`, confirmed live (ADR-016) — on the existing Hobby plan, no upgrade needed |
