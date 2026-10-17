# D&M Garments — Routes

## Public

| Route | Purpose |
|---|---|
| `/` | Homepage — Hero, Features, About×2, Mission/Vision banners, Services horizontal scroll, How-It-Works, Testimonials (live data), Final CTA |
| `/(marketing)/about` | Company about page (real mission/vision copy) |
| `/(marketing)/contact` | Contact form |
| `/(marketing)/faq` | Live FAQ list (now populated via admin Content CMS) |
| `/services` | Services overview |
| `/industries` | Industries overview |
| `/portfolio` | Portfolio projects (gated on real data; empty-state until populated) |
| `/products` | Square-tile category grid (Services landing) |
| `/products/[category]` | Jiji-style PDP: `SampleGallery` + `QuickOrderForm` |
| `/products/[category]/[product]` | Individual product detail |
| `/order` | Original multi-item RFQ form (fallback, kept alongside per-category quick order) |
| `/track` | Public order status lookup by order number + phone, Turnstile-gated (added 2026-10-16) |
| `/privacy`, `/terms` | Real drafted legal content (user-approved, real company facts and processors), not placeholders — added 2026-10-17 |
| `/auth/login` | Staff login, with "Forgot password?" link |
| `/auth/forgot-password` | Request a password reset email (added 2026-10-17) |
| `/auth/update-password` | Set a new password from the reset-email link; shows an invalid-link state outside a valid recovery session (added 2026-10-17) |
| `/not-found` | 404 |

## Admin (`/admin/*`, auth-guarded by `proxy.ts`)

| Route | Purpose |
|---|---|
| `/admin` | Dashboard stats |
| `/admin/orders`, `/admin/orders/[id]` | Order inbox + workspace (items/files/communications/notes/status history/assignment/notification delivery status) |
| `/admin/messages` | Contact-form message inbox, mark handled/unhandled (added 2026-10-16) |
| `/admin/customers`, `/admin/customers/[id]` | Customer directory |
| `/admin/categories` | Category CRUD |
| `/admin/products`, `/admin/products/new`, `/admin/products/[id]` | Product CRUD |
| `/admin/quotes`, `/admin/quotes/[id]` | Quote creation + status |
| `/admin/settings` | Company settings |
| `/admin/staff` | Staff invite/role management |
| `/admin/content` | Testimonials / FAQs / Portfolio CMS (newest addition, verified working end-to-end 2026-10-16) |
