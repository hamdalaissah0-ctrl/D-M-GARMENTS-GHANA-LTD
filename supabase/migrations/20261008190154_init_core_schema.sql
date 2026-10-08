-- D&M Garments Ghana Limited — core platform schema
-- Manufacturing order-intake platform: CMS + RFQ engine + CRM-lite + admin.
-- See DM_Garments_Master_Digital_Platform_Plan (sections 00-06) for the source spec.

-- ============================================================================
-- EXTENSIONS
-- ============================================================================
create extension if not exists pgcrypto;

-- ============================================================================
-- ENUM TYPES
-- ============================================================================
create type public.staff_role as enum ('super_admin', 'admin', 'sales', 'production', 'viewer');

create type public.content_status as enum ('draft', 'published', 'archived');

create type public.product_status as enum ('active', 'inactive', 'archived');

create type public.order_status as enum (
  'new', 'reviewing', 'contact_required', 'contacted', 'requirements_confirmed',
  'quotation_pending', 'quotation_sent', 'negotiating', 'approved',
  'production_pending', 'in_production', 'quality_check', 'ready',
  'completed', 'cancelled', 'archived'
);

create type public.order_priority as enum ('normal', 'high', 'urgent');

create type public.order_source as enum ('website', 'phone', 'whatsapp', 'walk_in', 'referral', 'other');

create type public.notification_channel as enum ('sms', 'whatsapp', 'email');

create type public.notification_status as enum ('pending', 'sent', 'failed', 'retrying');

create type public.communication_channel as enum ('call', 'whatsapp', 'sms', 'email', 'in_person');

create type public.quote_status as enum ('draft', 'sent', 'accepted', 'rejected', 'expired');

-- ============================================================================
-- HELPER FUNCTIONS (generic ones only — profiles-dependent ones follow the
-- `profiles` table below)
-- ============================================================================
create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================================
-- PROFILES (staff accounts; 1:1 with auth.users)
-- ============================================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role public.staff_role not null default 'viewer',
  phone text,
  avatar_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- security definer, row_security=off to avoid RLS recursion when these are
-- called from inside a policy on `profiles` itself
create function public.current_staff_role()
returns public.staff_role
language sql
stable
security definer
set search_path = public
set row_security = off
as $$
  select role from public.profiles where id = auth.uid() and active = true;
$$;

create function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
set row_security = off
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and active = true
  );
$$;

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
set row_security = off
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and active = true and role in ('super_admin', 'admin')
  );
$$;

-- ============================================================================
-- COMPANY PROFILE (singleton, publicly readable — the only business facts
-- the public site may render without an explicit "Content required" placeholder)
-- ============================================================================
create table public.company_profile (
  id integer primary key default 1,
  company_name text not null default 'D&M Garments Ghana Limited',
  address text,
  phone_primary text,
  phone_secondary text,
  email text,
  whatsapp_number text,
  brand_color_hex text not null default '#0B5A34',
  logo_url text,
  business_hours jsonb,
  social_links jsonb not null default '{}'::jsonb,
  footer_text text,
  no_moq boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id),
  constraint company_profile_singleton check (id = 1)
);

create trigger set_company_profile_updated_at before update on public.company_profile
  for each row execute function public.set_updated_at();

insert into public.company_profile (id, company_name, address, phone_primary, phone_secondary, email, no_moq)
values (
  1,
  'D&M Garments Ghana Limited',
  '14 Baatsonaa Highway, Ghana',
  '+233558276991',
  '+233207524273',
  'dnmgghanalimited@gmail.com',
  true
);

-- ============================================================================
-- OPERATIONAL SETTINGS (staff-only; rate limits, upload limits, notification
-- toggles — distinct from company_profile, which is public business info)
-- ============================================================================
create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id)
);

create trigger set_site_settings_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

insert into public.site_settings (key, value) values
  ('upload_limits', '{"max_files": 10, "max_file_size_mb": 15, "allowed_mime_types": ["image/jpeg","image/png","image/webp","application/pdf"]}'),
  ('rate_limits', '{"order_submission_per_hour": 5, "contact_submission_per_hour": 5}'),
  ('notification_providers', '{"sms": "arkesel", "whatsapp": "wa_me_manual", "ai": "groq"}');

-- ============================================================================
-- CUSTOMERS / CRM-LITE
-- ============================================================================
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  company_name text,
  email text,
  phone text,
  alternative_phone text,
  whatsapp_phone text,
  location text,
  customer_type text,
  source public.order_source not null default 'website',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index customers_phone_idx on public.customers (phone);
create index customers_email_idx on public.customers (email);

create trigger set_customers_updated_at before update on public.customers
  for each row execute function public.set_updated_at();

create table public.customer_contacts (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  channel public.communication_channel not null,
  value text not null,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create index customer_contacts_customer_id_idx on public.customer_contacts (customer_id);

-- ============================================================================
-- CATALOGUE: categories / products / options / images / features / services
-- ============================================================================
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  sort_order integer not null default 0,
  status public.content_status not null default 'draft',
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_categories_updated_at before update on public.categories
  for each row execute function public.set_updated_at();

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  short_description text,
  description text,
  status public.product_status not null default 'active',
  featured boolean not null default false,
  sort_order integer not null default 0,
  minimum_quantity integer,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_id_idx on public.products (category_id);

create trigger set_products_updated_at before update on public.products
  for each row execute function public.set_updated_at();

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index product_images_product_id_idx on public.product_images (product_id);

create table public.product_options (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  option_type text not null,
  label text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index product_options_product_id_idx on public.product_options (product_id);

create table public.product_features (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  label text not null,
  sort_order integer not null default 0
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_services_updated_at before update on public.services
  for each row execute function public.set_updated_at();

create table public.industries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_industries_updated_at before update on public.industries
  for each row execute function public.set_updated_at();

-- ============================================================================
-- ORDER NUMBER GENERATION — never expose raw UUIDs to customers
-- ============================================================================
create sequence public.order_number_seq;

create function public.generate_order_number()
returns text
language sql
as $$
  select 'DM-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.order_number_seq')::text, 6, '0');
$$;

-- ============================================================================
-- ORDERS (RFQ / manufacturing enquiries) — order != payment
-- ============================================================================
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default public.generate_order_number(),
  idempotency_key text unique,
  customer_id uuid not null references public.customers(id) on delete restrict,
  status public.order_status not null default 'new',
  source public.order_source not null default 'website',
  priority public.order_priority not null default 'normal',
  assigned_to uuid references public.profiles(id),
  customer_description text,
  preferred_deadline date,
  delivery_location text,
  next_follow_up_at timestamptz,
  follow_up_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_customer_id_idx on public.orders (customer_id);
create index orders_status_idx on public.orders (status);
create index orders_assigned_to_idx on public.orders (assigned_to);

create trigger set_orders_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name_snapshot text not null,
  product_description_snapshot text,
  quantity integer not null check (quantity > 0),
  selected_options_snapshot jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0
);

create index order_items_order_id_idx on public.order_items (order_id);

create table public.order_files (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  storage_path text not null,
  original_filename text not null,
  mime_type text not null,
  size_bytes bigint not null,
  checksum text,
  uploaded_at timestamptz not null default now(),
  uploaded_by uuid references public.profiles(id)
);

create index order_files_order_id_idx on public.order_files (order_id);

create table public.order_notes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  staff_id uuid not null references public.profiles(id),
  note text not null,
  created_at timestamptz not null default now()
);

create index order_notes_order_id_idx on public.order_notes (order_id);

create table public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  from_status public.order_status,
  to_status public.order_status not null,
  changed_by uuid references public.profiles(id),
  note text,
  changed_at timestamptz not null default now()
);

create index order_status_history_order_id_idx on public.order_status_history (order_id);

create table public.order_assignments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  assigned_to uuid not null references public.profiles(id),
  assigned_by uuid references public.profiles(id),
  note text,
  assigned_at timestamptz not null default now()
);

create index order_assignments_order_id_idx on public.order_assignments (order_id);

-- ============================================================================
-- QUOTES
-- ============================================================================
create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  quote_number text not null unique,
  status public.quote_status not null default 'draft',
  subtotal numeric(12,2) not null default 0,
  discount numeric(12,2) not null default 0,
  tax numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  currency text not null default 'GHS',
  validity_days integer not null default 14,
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  accepted_at timestamptz
);

create index quotes_order_id_idx on public.quotes (order_id);

create table public.quote_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  description text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null,
  line_total numeric(12,2) not null,
  sort_order integer not null default 0
);

create index quote_items_quote_id_idx on public.quote_items (quote_id);

-- ============================================================================
-- COMMUNICATIONS LOG
-- ============================================================================
create table public.communications (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  staff_id uuid not null references public.profiles(id),
  channel public.communication_channel not null,
  summary text not null,
  outcome text,
  next_action text,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index communications_order_id_idx on public.communications (order_id);
create index communications_customer_id_idx on public.communications (customer_id);

-- ============================================================================
-- NOTIFICATIONS (provider-agnostic queue; see NotificationProvider abstraction)
-- ============================================================================
create table public.notification_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  channel public.notification_channel not null,
  recipient text not null,
  template text not null,
  payload jsonb not null default '{}'::jsonb,
  status public.notification_status not null default 'pending',
  attempt_count integer not null default 0,
  last_attempt_at timestamptz,
  error_message text,
  created_at timestamptz not null default now()
);

create index notification_events_order_id_idx on public.notification_events (order_id);
create index notification_events_status_idx on public.notification_events (status);

-- ============================================================================
-- AUDIT LOG
-- ============================================================================
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id text,
  old_value jsonb,
  new_value jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index audit_logs_entity_idx on public.audit_logs (entity_type, entity_id);

-- ============================================================================
-- CONTENT: pages / faqs / testimonials / blog / portfolio / seo / redirects
-- ============================================================================
create table public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content jsonb,
  status public.content_status not null default 'draft',
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_pages_updated_at before update on public.pages
  for each row execute function public.set_updated_at();

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text,
  sort_order integer not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_faqs_updated_at before update on public.faqs
  for each row execute function public.set_updated_at();

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  company_name text,
  quote text not null,
  rating integer check (rating between 1 and 5),
  image_url text,
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  industry text,
  services text[],
  description text,
  year integer,
  featured boolean not null default false,
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_portfolio_projects_updated_at before update on public.portfolio_projects
  for each row execute function public.set_updated_at();

create table public.portfolio_images (
  id uuid primary key default gen_random_uuid(),
  portfolio_project_id uuid not null references public.portfolio_projects(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  sort_order integer not null default 0
);

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text,
  cover_image_url text,
  author_id uuid references public.profiles(id),
  status public.content_status not null default 'draft',
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_blog_posts_updated_at before update on public.blog_posts
  for each row execute function public.set_updated_at();

create table public.seo_pages (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,
  title text,
  meta_description text,
  canonical_url text,
  og_image_url text,
  structured_data jsonb,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_seo_pages_updated_at before update on public.seo_pages
  for each row execute function public.set_updated_at();

create table public.redirects (
  id uuid primary key default gen_random_uuid(),
  old_path text not null unique,
  new_path text not null,
  status_code integer not null default 301,
  created_at timestamptz not null default now()
);

create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  message text not null,
  source text,
  handled boolean not null default false,
  handled_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ============================================================================
-- SECURE RFQ SUBMISSION — the only write path for anonymous order creation.
-- Matches spec §15 (idempotency, no duplicate orders on double submit) and
-- §02.3 (anon submitters never get direct table access to customers/orders).
-- ============================================================================
create function public.submit_order_request(
  p_idempotency_key text,
  p_full_name text,
  p_phone text,
  p_whatsapp_phone text,
  p_email text,
  p_company_name text,
  p_location text,
  p_items jsonb, -- [{ product_id, product_name, product_description, quantity, options }]
  p_customer_description text,
  p_preferred_deadline date default null,
  p_delivery_location text default null,
  p_source public.order_source default 'website'
)
returns table (order_id uuid, order_number text)
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
declare
  v_existing_order_id uuid;
  v_existing_order_number text;
  v_customer_id uuid;
  v_order_id uuid;
  v_order_number text;
  v_item jsonb;
begin
  if p_idempotency_key is not null then
    select o.id, o.order_number into v_existing_order_id, v_existing_order_number
    from public.orders o
    where o.idempotency_key = p_idempotency_key;

    if v_existing_order_id is not null then
      return query select v_existing_order_id, v_existing_order_number;
      return;
    end if;
  end if;

  if p_full_name is null or length(trim(p_full_name)) = 0 then
    raise exception 'full_name is required';
  end if;
  if p_phone is null or length(trim(p_phone)) = 0 then
    raise exception 'phone is required';
  end if;
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'at least one order item is required';
  end if;

  select id into v_customer_id
  from public.customers
  where phone = p_phone
  order by created_at desc
  limit 1;

  if v_customer_id is null then
    insert into public.customers (full_name, company_name, email, phone, whatsapp_phone, location, source)
    values (p_full_name, p_company_name, p_email, p_phone, p_whatsapp_phone, p_location, p_source)
    returning id into v_customer_id;
  end if;

  insert into public.orders (
    idempotency_key, customer_id, status, source, customer_description,
    preferred_deadline, delivery_location
  )
  values (
    p_idempotency_key, v_customer_id, 'new', p_source, p_customer_description,
    p_preferred_deadline, p_delivery_location
  )
  returning id, order_number into v_order_id, v_order_number;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    insert into public.order_items (
      order_id, product_id, product_name_snapshot, product_description_snapshot,
      quantity, selected_options_snapshot
    )
    values (
      v_order_id,
      nullif(v_item->>'product_id', '')::uuid,
      coalesce(v_item->>'product_name', 'Custom request'),
      v_item->>'product_description',
      coalesce((v_item->>'quantity')::integer, 1),
      coalesce(v_item->'options', '{}'::jsonb)
    );
  end loop;

  insert into public.order_status_history (order_id, from_status, to_status, changed_by, note)
  values (v_order_id, null, 'new', null, 'Submitted via website RFQ form');

  insert into public.notification_events (order_id, channel, recipient, template, payload)
  select v_order_id, ch, co.value, 'new_order_internal',
         jsonb_build_object('order_number', v_order_number, 'customer_name', p_full_name)
  from public.company_profile cp
  cross join lateral (values ('sms'::public.notification_channel, cp.phone_primary)) as co(ch, value)
  where cp.phone_primary is not null;

  return query select v_order_id, v_order_number;
end;
$$;

grant execute on function public.submit_order_request to anon, authenticated;

create function public.submit_contact_request(
  p_full_name text,
  p_email text,
  p_phone text,
  p_message text,
  p_source text default 'website'
)
returns uuid
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
declare
  v_id uuid;
begin
  if p_full_name is null or length(trim(p_full_name)) = 0 then
    raise exception 'full_name is required';
  end if;
  if p_message is null or length(trim(p_message)) = 0 then
    raise exception 'message is required';
  end if;

  insert into public.contact_submissions (full_name, email, phone, message, source)
  values (p_full_name, p_email, p_phone, p_message, p_source)
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function public.submit_contact_request to anon, authenticated;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.company_profile enable row level security;
alter table public.site_settings enable row level security;
alter table public.customers enable row level security;
alter table public.customer_contacts enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_options enable row level security;
alter table public.product_features enable row level security;
alter table public.services enable row level security;
alter table public.industries enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_files enable row level security;
alter table public.order_notes enable row level security;
alter table public.order_status_history enable row level security;
alter table public.order_assignments enable row level security;
alter table public.quotes enable row level security;
alter table public.quote_items enable row level security;
alter table public.communications enable row level security;
alter table public.notification_events enable row level security;
alter table public.audit_logs enable row level security;
alter table public.pages enable row level security;
alter table public.faqs enable row level security;
alter table public.testimonials enable row level security;
alter table public.portfolio_projects enable row level security;
alter table public.portfolio_images enable row level security;
alter table public.blog_posts enable row level security;
alter table public.seo_pages enable row level security;
alter table public.redirects enable row level security;
alter table public.contact_submissions enable row level security;

-- profiles: staff can read all staff profiles; only admins manage roles
create policy profiles_select_staff on public.profiles for select to authenticated
  using (public.is_staff());
create policy profiles_update_self on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
create policy profiles_admin_all on public.profiles for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- company_profile: public read, admin write
create policy company_profile_public_read on public.company_profile for select to anon, authenticated
  using (true);
create policy company_profile_admin_write on public.company_profile for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- site_settings: staff-only, admin write
create policy site_settings_staff_read on public.site_settings for select to authenticated
  using (public.is_staff());
create policy site_settings_admin_write on public.site_settings for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- customers / customer_contacts: staff only (never public)
create policy customers_staff_read on public.customers for select to authenticated
  using (public.is_staff());
create policy customers_staff_write on public.customers for insert to authenticated
  with check (public.is_staff());
create policy customers_staff_update on public.customers for update to authenticated
  using (public.is_staff()) with check (public.is_staff());
create policy customers_admin_delete on public.customers for delete to authenticated
  using (public.is_admin());

create policy customer_contacts_staff_all on public.customer_contacts for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

-- catalogue content: public reads published/active rows; admins manage everything
create policy categories_public_read on public.categories for select to anon, authenticated
  using (status = 'published' or public.is_staff());
create policy categories_admin_write on public.categories for insert to authenticated
  with check (public.is_admin());
create policy categories_admin_update on public.categories for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy categories_admin_delete on public.categories for delete to authenticated
  using (public.is_admin());

create policy products_public_read on public.products for select to anon, authenticated
  using (status = 'active' or public.is_staff());
create policy products_admin_write on public.products for insert to authenticated
  with check (public.is_admin());
create policy products_admin_update on public.products for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy products_admin_delete on public.products for delete to authenticated
  using (public.is_admin());

create policy product_images_public_read on public.product_images for select to anon, authenticated
  using (true);
create policy product_images_admin_write on public.product_images for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy product_options_public_read on public.product_options for select to anon, authenticated
  using (is_active or public.is_staff());
create policy product_options_admin_write on public.product_options for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy product_features_public_read on public.product_features for select to anon, authenticated
  using (true);
create policy product_features_admin_write on public.product_features for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy services_public_read on public.services for select to anon, authenticated
  using (status = 'published' or public.is_staff());
create policy services_admin_write on public.services for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy industries_public_read on public.industries for select to anon, authenticated
  using (status = 'published' or public.is_staff());
create policy industries_admin_write on public.industries for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- orders & related: staff only; anon has zero direct table access
-- (the only anon write path is the submit_order_request() security-definer function)
create policy orders_staff_read on public.orders for select to authenticated
  using (public.is_staff());
create policy orders_staff_update on public.orders for update to authenticated
  using (public.is_staff()) with check (public.is_staff());
create policy orders_admin_delete on public.orders for delete to authenticated
  using (public.is_admin());

create policy order_items_staff_read on public.order_items for select to authenticated
  using (public.is_staff());
create policy order_items_staff_write on public.order_items for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

create policy order_files_staff_read on public.order_files for select to authenticated
  using (public.is_staff());
create policy order_files_staff_write on public.order_files for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

create policy order_notes_staff_read on public.order_notes for select to authenticated
  using (public.is_staff());
create policy order_notes_staff_insert on public.order_notes for insert to authenticated
  with check (public.is_staff() and staff_id = auth.uid());
create policy order_notes_admin_delete on public.order_notes for delete to authenticated
  using (public.is_admin());

create policy order_status_history_staff_read on public.order_status_history for select to authenticated
  using (public.is_staff());
create policy order_status_history_staff_insert on public.order_status_history for insert to authenticated
  with check (public.is_staff());

create policy order_assignments_staff_read on public.order_assignments for select to authenticated
  using (public.is_staff());
create policy order_assignments_staff_insert on public.order_assignments for insert to authenticated
  with check (public.is_staff());

-- quotes: sales/admin create and manage, all staff can read
create policy quotes_staff_read on public.quotes for select to authenticated
  using (public.is_staff());
create policy quotes_staff_write on public.quotes for insert to authenticated
  with check (public.is_staff());
create policy quotes_staff_update on public.quotes for update to authenticated
  using (public.is_staff()) with check (public.is_staff());
create policy quotes_admin_delete on public.quotes for delete to authenticated
  using (public.is_admin());

create policy quote_items_staff_all on public.quote_items for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

create policy communications_staff_read on public.communications for select to authenticated
  using (public.is_staff());
create policy communications_staff_insert on public.communications for insert to authenticated
  with check (public.is_staff() and staff_id = auth.uid());

create policy notification_events_staff_read on public.notification_events for select to authenticated
  using (public.is_staff());

create policy audit_logs_admin_read on public.audit_logs for select to authenticated
  using (public.is_admin());

-- content tables: public reads published only; admin manages
create policy pages_public_read on public.pages for select to anon, authenticated
  using (status = 'published' or public.is_staff());
create policy pages_admin_write on public.pages for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy faqs_public_read on public.faqs for select to anon, authenticated
  using (status = 'published' or public.is_staff());
create policy faqs_admin_write on public.faqs for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy testimonials_public_read on public.testimonials for select to anon, authenticated
  using (status = 'published' or public.is_staff());
create policy testimonials_admin_write on public.testimonials for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy portfolio_projects_public_read on public.portfolio_projects for select to anon, authenticated
  using (status = 'published' or public.is_staff());
create policy portfolio_projects_admin_write on public.portfolio_projects for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy portfolio_images_public_read on public.portfolio_images for select to anon, authenticated
  using (true);
create policy portfolio_images_admin_write on public.portfolio_images for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy blog_posts_public_read on public.blog_posts for select to anon, authenticated
  using (status = 'published' or public.is_staff());
create policy blog_posts_admin_write on public.blog_posts for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy seo_pages_public_read on public.seo_pages for select to anon, authenticated
  using (status = 'published' or public.is_staff());
create policy seo_pages_admin_write on public.seo_pages for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy redirects_public_read on public.redirects for select to anon, authenticated
  using (true);
create policy redirects_admin_write on public.redirects for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy contact_submissions_staff_read on public.contact_submissions for select to authenticated
  using (public.is_staff());
create policy contact_submissions_staff_update on public.contact_submissions for update to authenticated
  using (public.is_staff()) with check (public.is_staff());

-- ============================================================================
-- PRIVATE STORAGE BUCKET for customer-uploaded reference files
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('customer-order-files', 'customer-order-files', false)
on conflict (id) do nothing;

create policy order_files_storage_staff_read on storage.objects for select to authenticated
  using (bucket_id = 'customer-order-files' and public.is_staff());
