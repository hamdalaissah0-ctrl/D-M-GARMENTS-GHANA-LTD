# D&M Garments — Database

Live Supabase project: `otscslkmvhunzlxfrqse`. All schema changes go through `supabase/migrations/*.sql` + `supabase db push --yes`. Never alter production schema outside a migration file.

## Migrations applied (chronological)

1. `20261008190154_init_core_schema.sql` — core schema: `profiles`, `company_profile`, `site_settings`, `customers`, `categories`, `products`, `product_images`, `orders`, `order_items`, `order_files`, `order_notes`, `order_status_history`, `order_assignments`, `quotes`, `quote_items`, `communications`, `notification_events`, `audit_logs`, `pages`, `faqs`, `testimonials`, `portfolio_projects`, `portfolio_images`, `blog_posts`, `contact_submissions`; RLS policies on all of them; `submit_order_request()` / `submit_contact_request()` RPCs; private `customer-order-files` bucket. Helper functions (`is_staff()`, `is_admin()`) are `security definer` + `set row_security = off` to avoid RLS self-recursion when called from a policy on `profiles` itself.
2. `20261008191046_fix_order_number_ambiguity.sql` — fixed PL/pgSQL ambiguous-column error (42702) in `submit_order_request` by aliasing `insert into public.orders as o (...) returning o.id, o.order_number into ...`.
3. `20261008191423_storage_upload_policy.sql` — anon INSERT policy scoped to `pending/` prefix in the order-files bucket, with size/MIME limits.
4. `20261009021823_order_audit_triggers.sql` — `log_order_status_change()`, generic `log_audit_event()` (attached to orders/customers/products/quotes), `log_order_assignment()`.
5. `20261009022546_public_media_bucket.sql` — public `media` bucket, admin-only write policies (used for logo, category images, portfolio images).
6. `20261009022916_quote_number_generator.sql` — `QT-YYYY-NNNNNN` sequence/generator for quotes.
7. `20261015223122_category_galleries_and_sizes.sql` — `category_images` table (Jiji-style sample galleries) + `categories.available_sizes text[]` (default `['S','M','L','XL','XXL','XXXL']`).
8. `20261016120000_contact_notifications.sql` — adds `notification_events.contact_submission_id` (nullable FK to `contact_submissions`) and updates `submit_contact_request()` to also queue a staff SMS notification, same pattern as orders.

## Identifiers

Internal PKs are UUID throughout. Customer-facing references use generated sequences, never raw IDs: orders get `order_number`, quotes get `QT-YYYY-NNNNNN`. This already matches the new spec's "never expose sequential DB IDs as security tokens" rule.

## Storage buckets

- `customer-order-files` — private, customer order attachments, signed-URL access only.
- `media` — public, admin-write-only, used for branding/logo, category galleries, portfolio images.

No separate `product-public` / `portfolio-public` split yet — both public image types share the one `media` bucket under different path prefixes (`branding/`, `categories/`, `portfolio/`). Acceptable at current scale; would only need splitting if access policies need to diverge per asset type.

## Notifications

`notification_events` (the project's equivalent of the spec's `notification_logs`) tracks channel/recipient/status (`pending/sent/failed/retrying`)/attempt_count/last_attempt_at/error_message, linked to either an order (`order_id`) or a contact message (`contact_submission_id`, added 2026-10-16). Both `submit_order_request()` and `submit_contact_request()` queue a row; both Edge Functions dispatch the SMS and update the row's status inline. No retry mechanism yet — a `retrying` status exists in the enum but nothing sets it.

## Not yet built (named by the new spec, no current table)

- Public order/quote tracking by reference + phone (`/track`) — no supporting query or RLS policy for anonymous-by-reference lookup exists yet.
- `fabrics`, `colours`, `branding_methods` as normalized option tables — current catalogue stores available sizes as a `text[]` column on `categories`, not as relational option tables. Fine for the current size-only selector; would need real tables if fabric/colour/branding selection is added to the order flow.
