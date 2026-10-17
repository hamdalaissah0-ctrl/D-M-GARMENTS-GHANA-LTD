# D&M Garments — Approved Asset / Library Manifest

Per the controlled-build spec adopted 2026-10-16. Do not add a library or asset source outside this list without logging the reason in `DECISIONS.md` first.

```
PHOTOS
Real D&M-supplied photography/flyers (priority 1 — already extracted from user-supplied PDFs into Supabase Storage)
Unsplash, Pexels, Pixabay (generic/sample imagery only, never mislabeled as D&M's own)

UI
shadcn/ui (base-nova / @base-ui/react preset)

ICONS
Lucide (lucide-react) — already the sole icon family in use

SECONDARY ICONS
Phosphor or Tabler, only if Lucide genuinely lacks a symbol — none needed so far

ANIMATION
CSS transitions + hand-rolled IntersectionObserver (current)
Motion — approved for future use, not yet installed; adopt only when a specific animation need (e.g. layout animation, gesture) can't be done cleanly with CSS

OPTIONAL ANIMATED COMPONENTS
Aceternity, Magic UI — approved for sparing use (e.g. one hero text effect, one CTA background), not yet installed

ILLUSTRATIONS
unDraw — for 404/empty-state/upload-empty only, never for hero manufacturing imagery

LOTTIE
LottieFiles — for small success animations only (quote submitted, upload complete); prefer a simple SVG checkmark for the quote-success modal per the spec's own recommendation

FONTS
Google Fonts via next/font — confirmed: Inter loaded via next/font/google in app/layout.tsx

ANALYTICS
@vercel/analytics — pageviews + custom conversion events (order_submitted, contact_submitted, phone_clicked, whatsapp_clicked)

TESTING
@playwright/test — E2E suite in e2e/, runs against the production build (see ADR-010)
```

## Image hierarchy (binding)

1. Actual D&M photography/flyers (already in Storage)
2. Actual D&M product photographs
3. Actual client-approved project images
4. Supplier/brand-approved assets
5. Carefully selected commercial-use stock (Unsplash/Pexels/Pixabay)
6. Illustrations only where photography doesn't make sense

Never caption a stock photo as "our factory," "our team," "our machines," or "our customer."
