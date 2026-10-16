# D&M Garments — Decision Log (ADRs)

## ADR-001
**Decision:** Use Supabase (Postgres + Auth + Storage + Edge Functions) as the sole backend.
**Reason:** One integrated service covers database, auth, file storage and serverless functions with RLS tying them together — avoids bolting together several unrelated backend services.
**Rejected:** Firebase, separate Prisma+hosted-Postgres setup, Clerk for auth.
**Reason rejected:** Would duplicate auth/data infrastructure Supabase already provides, and RLS integration is the main reason this architecture was chosen in the first place.

## ADR-002
**Decision:** shadcn/ui on the `base-nova` (`@base-ui/react`) preset, not the Radix-based default preset.
**Reason:** This is what `shadcn init` produced for this project; switching presets mid-project would require rewriting every `asChild`-pattern component already built.
**Implication:** No `asChild` prop exists anywhere in this codebase — always use the `render` prop instead. `Select.onValueChange` can be called with `null`.

## ADR-003
**Decision:** Clone and adapt `NextJSTemplates/startup-nextjs` (MIT licence) for the homepage/about UI instead of hand-building every component from scratch.
**Reason:** Explicit user instruction after repeated dissatisfaction with hand-designed UI ("find an open-source website... clone it, using its UI... edit the details to fit our requirements").
**Process followed:** Licence verified (MIT, permissive), components copied into `components/template/`, recolored to brand palette, filled with real D&M content (not template placeholder/demo data), tested against this project's architecture (base-ui Button `render` prop, etc.) before shipping.
**Rejected:** Continuing fully hand-designed components — user explicitly rejected this approach after multiple rounds of dissatisfaction.

## ADR-004
**Decision:** Order submission is a single-item "quick order" (Jiji-style: pick a category, configure one item, submit) rather than a persistent multi-item quotation basket.
**Reason:** Explicit user spec: click a category → scroll samples → pick size/quantity → enter details → submit → confirmation. No basket/cart concept was requested.
**Implication:** No Zustand/localStorage basket state exists. The original multi-item `/order` form is kept as a fallback, not the primary flow. Revisit only if the user asks for multi-item quote requests.

## ADR-005
**Decision (2026-10-16):** Adopt the user-provided "controlled AI implementation specification" as the working methodology going forward: phased execution (audit → architecture freeze → design system → ... → launch), approved-library manifest (`ASSET-SOURCES.md`), persistent `/docs/*.md` memory files, and phase-completion checkpoints (lint/typecheck/build + PASS/BLOCKED marking before moving on).
**Reason:** User supplied a detailed methodology to reduce "AI scrambling" and token waste on a project that was previously built via ad-hoc "CONTINUE" instructions.
**Implication:** Phase 00 (audit) is being retrofitted onto an already-substantially-built platform, not a greenfield repo — see `IMPLEMENTATION-STATUS.md` for the KEEP/REFACTOR/REPLACE/REMOVE/MISSING classification. Existing working functionality and production data are preserved; this is a go-forward discipline change, not a rebuild.

## ADR-006
**Decision:** Credential isolation workaround — `git commit` via the Bash tool, `git push` always via the Terminal panel.
**Reason:** `gh`/git credentials are isolated per-shell on this machine between the Bash tool and the Terminal panel (separate Windows Credential Manager scopes); Bash-tool pushes fail silently/require re-auth.
**Implication:** Never attempt `git push` from the Bash tool on this machine — route through `mcp__terminal__run_in_terminal` every time.

## ADR-007
**Decision:** Load the Cloudflare Turnstile script directly (official `challenges.cloudflare.com/turnstile/v0/api.js`) in a small hand-written `TurnstileWidget` client component, rather than adding a third-party React wrapper package.
**Reason:** Avoids adding a new dependency for a ~60-line integration; keeps to the "no duplicate/unnecessary libraries" rule. Verification happens server-side in both Edge Functions (`_shared/turnstile.ts`) via `siteverify`, matching the spec's required flow (never trust the client-side token alone).
**Implication:** All three public forms (`/order`, the per-category quick-order form, `/contact`) require a valid Turnstile token before submission; the Edge Functions reject with 403 if verification fails.
**Update (2026-10-16):** User created a real Turnstile widget (site key `0x4AAAAAAFY157bEdws25usy`, domain `d-m-garments-ghana-ltd.vercel.app`) in their own Cloudflare dashboard. Real keys are now live in `.env.local`, the Supabase Edge Function secret (`TURNSTILE_SECRET_KEY`), and Vercel production env vars (site key as public `config`, secret key as private `secret`); production was redeployed to bake in the new `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. One automated-browser test tripped Cloudflare's generic bot-detection family (`600xxx`, documented as retryable "bot behavior detected" — not a config error); the user then confirmed a successful submission from a real browser. Phase 15 is now PASS.
