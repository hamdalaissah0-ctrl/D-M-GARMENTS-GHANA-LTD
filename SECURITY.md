# Security

## Reporting

If you discover a security issue, contact the project maintainer directly rather than
opening a public issue.

## Rules this codebase follows

- The Supabase **service-role key never reaches the browser**. It is only read in
  `lib/supabase/admin.ts` (guarded by the `server-only` package) and inside Deno Edge
  Functions, which run server-side.
- Every table has Row Level Security enabled. Anonymous/public writes to `orders`,
  `order_items`, `order_files`, and `customers` are **not** possible directly — the only
  write path is the `submit_order_request` / `submit_contact_request` SECURITY DEFINER
  Postgres functions, called through the `submit-order` / `submit-contact` Edge Functions.
- Order submission is idempotent (`orders.idempotency_key`, unique) — resubmitting the same
  request never creates a duplicate order.
- Customer file uploads go to a **private** Storage bucket (`customer-order-files`), scoped
  to a `pending/<idempotency-key>/...` prefix for anonymous uploads, with MIME type and size
  limits enforced at the bucket level. Staff read access requires authentication.
- RLS helper functions (`is_staff()`, `is_admin()`, `current_staff_role()`) are
  `security definer` with `set row_security = off` to avoid self-referential RLS recursion
  on the `profiles` table — do not remove `row_security = off` from these without
  understanding why it's there.
