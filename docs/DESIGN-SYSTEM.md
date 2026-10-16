# D&M Garments — Design System

## Current state (KEEP, but not yet audited against the new spec's component checklist)

- Brand tokens in `app/globals.css`: `--primary: oklch(0.38 0.1 155)` (brand green) plus custom utilities `.bg-brand-hero`, `.bg-brand-panel`, `.bg-brand-cta`, `.text-gradient-brand`.
- shadcn/ui primitives installed on the `base-nova` (`@base-ui/react`) preset: Button, Input, Textarea, Label, Select, Dialog, Tabs, Badge, Card, Accordion (no `type="single" collapsible` props — base-ui's Accordion API differs from Radix's).
- Icon family: Lucide only (`lucide-react`) — already matches the new spec's rule, no change needed.
- Typography: not yet on `next/font` with Inter/Manrope — needs verification against current `app/layout.tsx` font setup before claiming compliance.
- Animation: hand-rolled CSS transitions + `components/marketing/scroll-reveal.tsx` (IntersectionObserver fade/slide). No Motion library.

## Gaps vs. the new spec's Phase 02 component checklist

Not yet built as reusable primitives: Tooltip, Popover, Dropdown, Command Palette, Drawer/Sheet, Toast (sonner covers this already), Pagination, Breadcrumb, Skeleton, Spinner, dedicated Empty/Error-state components beyond `ContentRequired`.

`components/marketing/content-required.tsx` is the existing honest-empty-state component — core to the no-fake-content rule, keep as-is and reuse rather than inventing a parallel Empty State primitive.

## Ported template components (`components/template/`)

`SectionTitle.tsx`, `Hero.tsx`, `Features.tsx`, `AboutSectionOne.tsx`, `AboutSectionTwo.tsx`, `Testimonials.tsx` — ported from `NextJSTemplates/startup-nextjs` (MIT licence, verified before use), recolored to the brand green, filled with real D&M content, Testimonials wired to live Supabase data with the `ContentRequired` empty state preserved. This was an explicit user instruction ("clone an open-source UI"), licence was checked, and content was not left as template placeholder text — satisfies the new spec's "never blindly copy" rule retroactively, but the adaptation step (tokens, dependency trim) should be spot-checked next time this area is touched.

## Visual direction (from the new spec — adopt going forward)

Industrial / premium / clean / confident / human / physical / manufacturing-led / photography-led / Ghanaian business / B2B. Avoid: gradient-heavy SaaS look, glassmorphism, glowing borders, floating blobs, generic icon grids, stock people mislabeled as D&M staff. The homepage already leans photography-led per the user's repeated feedback (remove cluttered flyer banners, let real product/mission content lead) — this is a continuation of established direction, not a new constraint.

## Imagery rules (binding, unchanged from day one)

Never label stock or generic sample imagery as "our factory" / "our team" / "our customer." Only D&M-supplied or explicitly-approved-as-sample imagery may appear in catalogue galleries, and it's never attributed as a specific real claim unless true.
