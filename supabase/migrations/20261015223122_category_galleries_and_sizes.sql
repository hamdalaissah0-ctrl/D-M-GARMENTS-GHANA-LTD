-- Category sample-image galleries (Jiji-style "scroll through all samples")
-- and a configurable size list shown on each category's order page.

create table public.category_images (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index category_images_category_id_idx on public.category_images (category_id);

alter table public.categories
  add column available_sizes text[] not null default array['S','M','L','XL','XXL','XXXL'];

alter table public.category_images enable row level security;

create policy category_images_public_read on public.category_images for select to anon, authenticated
  using (true);

create policy category_images_admin_write on public.category_images for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
