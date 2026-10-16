# D&M Garments — Integrations

| Integration | Status | Notes |
|---|---|---|
| Supabase (Postgres/Auth/Storage/Edge Functions) | LIVE | Project `otscslkmvhunzlxfrqse`, connected via Vercel integration |
| Arkesel SMS | LIVE | `ArkeselSmsProvider` in `supabase/functions/_shared/notifications.ts`, real API key in env |
| WhatsApp | MANUAL ONLY | `wa.me` deep links from `QuickOrderForm` — no WhatsApp Cloud API, no server-side send |
| Email | STUB | `NotificationProvider` interface has an email variant with unused params (lint warnings) — no real provider wired |
| Groq AI | NOT STARTED | `GROQ_API_KEY` present in `.env.example` but nothing calls it yet |
| Cloudflare Turnstile | LIVE (production keys) | `components/shared/turnstile-widget.tsx` + server-side `verifyTurnstile()` in both Edge Functions, gating `/order`, `/products/[category]` quick order, and `/contact`. Real widget (site key `0x4AAAAAAFY157bEdws25usy`) created by the user for domain `d-m-garments-ghana-ltd.vercel.app`, wired into `.env.local`, the Supabase Edge Function secret, and Vercel production env vars, production redeployed. Confirmed working end-to-end by the user from a real browser on 2026-10-16 |
| Sentry | NOT STARTED | No error monitoring |
| Vercel Analytics | NOT STARTED | No analytics events instrumented |
| GitHub | LIVE | `hamdalaissah0-ctrl/D-M-GARMENTS-GHANA-LTD`, pushed via Terminal panel (gh/git credential isolation — see DECISIONS.md) |
| Vercel | LIVE | Auto-deploys from `main` via pre-existing GitHub integration |
