-- Premium video gallery (production, fabric printing, corporate uniforms,
-- safety wear, product showcase) requested by the user, backed by real
-- D&M footage transcoded to web-compatible H.264 MP4 and uploaded to the
-- existing public "media" storage bucket. Mirrors the portfolio_projects
-- table's shape and RLS pattern.

create table public.portfolio_videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null,
  video_url text not null,
  thumbnail_url text not null,
  duration_seconds integer,
  width integer,
  height integer,
  featured boolean not null default false,
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_portfolio_videos_updated_at before update on public.portfolio_videos
  for each row execute function public.set_updated_at();

alter table public.portfolio_videos enable row level security;

create policy portfolio_videos_public_read on public.portfolio_videos for select to anon, authenticated
  using (status = 'published' or public.is_staff());
create policy portfolio_videos_admin_write on public.portfolio_videos for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
