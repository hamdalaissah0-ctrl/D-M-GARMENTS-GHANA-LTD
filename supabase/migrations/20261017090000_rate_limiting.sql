-- Phase 15 (Security) follow-up: rate limiting on public mutation endpoints.
-- Simple fixed-window counter backed by Postgres — no new external service
-- needed since Supabase is already provisioned. Scale here is small (one
-- Ghanaian manufacturing business, not high-traffic), so a blanket cleanup
-- delete on each check is fine; revisit with pg_cron if volume ever justifies it.

create table public.rate_limit_events (
  id bigserial primary key,
  bucket_key text not null,
  created_at timestamptz not null default now()
);

create index rate_limit_events_bucket_key_created_at_idx
  on public.rate_limit_events (bucket_key, created_at);

alter table public.rate_limit_events enable row level security;
-- No public policies: this table is only ever touched via the
-- security-definer function below, never read/written directly.

create function public.check_rate_limit(
  p_bucket_key text,
  p_max_requests integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
declare
  v_count integer;
begin
  delete from public.rate_limit_events
  where created_at < now() - (p_window_seconds || ' seconds')::interval;

  select count(*) into v_count
  from public.rate_limit_events
  where bucket_key = p_bucket_key
    and created_at >= now() - (p_window_seconds || ' seconds')::interval;

  if v_count >= p_max_requests then
    return false;
  end if;

  insert into public.rate_limit_events (bucket_key) values (p_bucket_key);
  return true;
end;
$$;

grant execute on function public.check_rate_limit to anon, authenticated;
