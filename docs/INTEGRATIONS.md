# D&M Garments — Integrations

| Integration | Status | Notes |
|---|---|---|
| Supabase (Postgres/Auth/Storage/Edge Functions) | LIVE | Project `otscslkmvhunzlxfrqse`, connected via Vercel integration |
| Arkesel SMS | LIVE | `ArkeselSmsProvider` in `supabase/functions/_shared/notifications.ts`, real API key in env |
| WhatsApp | MANUAL ONLY | `wa.me` deep links from `QuickOrderForm` — no WhatsApp Cloud API, no server-side send |
| Email | STUB | `NotificationProvider` interface has an email variant with unused params (lint warnings) — no real provider wired |
| Groq AI | NOT STARTED | `GROQ_API_KEY` present in `.env.example` but nothing calls it yet |
| Cloudflare Turnstile | NOT STARTED | No bot protection on `/order` or `/contact` |
| Sentry | NOT STARTED | No error monitoring |
| Vercel Analytics | NOT STARTED | No analytics events instrumented |
| GitHub | LIVE | `hamdalaissah0-ctrl/D-M-GARMENTS-GHANA-LTD`, pushed via Terminal panel (gh/git credential isolation — see DECISIONS.md) |
| Vercel | LIVE | Auto-deploys from `main` via pre-existing GitHub integration |
