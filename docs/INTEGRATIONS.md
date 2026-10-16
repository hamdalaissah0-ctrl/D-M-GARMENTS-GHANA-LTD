# D&M Garments — Integrations

| Integration | Status | Notes |
|---|---|---|
| Supabase (Postgres/Auth/Storage/Edge Functions) | LIVE | Project `otscslkmvhunzlxfrqse`, connected via Vercel integration |
| Arkesel SMS | LIVE | `ArkeselSmsProvider` in `supabase/functions/_shared/notifications.ts`, real API key in env |
| WhatsApp | MANUAL ONLY | `wa.me` deep links from `QuickOrderForm` — no WhatsApp Cloud API, no server-side send |
| Email | STUB | `NotificationProvider` interface has an email variant with unused params (lint warnings) — no real provider wired |
| Groq AI | NOT STARTED | `GROQ_API_KEY` present in `.env.example` but nothing calls it yet |
| Cloudflare Turnstile | LIVE (test keys) | `components/shared/turnstile-widget.tsx` + server-side `verifyTurnstile()` in both Edge Functions, gating `/order`, `/products/[category]` quick order, and `/contact`. Running on Cloudflare's published test keys everywhere (see `.env.local` / Supabase secret) — **needs real production site+secret keys from the user's own Cloudflare dashboard before launch**, see `IMPLEMENTATION-STATUS.md` |
| Sentry | NOT STARTED | No error monitoring |
| Vercel Analytics | NOT STARTED | No analytics events instrumented |
| GitHub | LIVE | `hamdalaissah0-ctrl/D-M-GARMENTS-GHANA-LTD`, pushed via Terminal panel (gh/git credential isolation — see DECISIONS.md) |
| Vercel | LIVE | Auto-deploys from `main` via pre-existing GitHub integration |
