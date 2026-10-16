-- Phase 12 (Customer Request Tracking): public /track page.
-- Customers look up an order by order_number + the phone they submitted
-- with. Phone matching compares the last 9 digits (Ghana mobile numbers
-- are 9 digits after the leading 0 / country code) so "0551234567" and
-- "233551234567" both match. Only customer-safe fields are returned —
-- never internal notes, staff names, or who changed what.

create or replace function public.track_order_request(
  p_order_number text,
  p_phone text
)
returns table (
  order_number text,
  status public.order_status,
  created_at timestamptz,
  preferred_deadline date,
  item_count integer,
  history jsonb
)
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
declare
  v_order_id uuid;
begin
  select o.id into v_order_id
  from public.orders o
  join public.customers c on c.id = o.customer_id
  where upper(trim(o.order_number)) = upper(trim(p_order_number))
    and right(regexp_replace(coalesce(c.phone, ''), '\D', '', 'g'), 9)
        = right(regexp_replace(coalesce(p_phone, ''), '\D', '', 'g'), 9)
    and length(regexp_replace(coalesce(p_phone, ''), '\D', '', 'g')) >= 9
  limit 1;

  if v_order_id is null then
    return;
  end if;

  return query
  select
    o.order_number,
    o.status,
    o.created_at,
    o.preferred_deadline,
    (select count(*)::integer from public.order_items oi where oi.order_id = o.id),
    coalesce(
      (
        select jsonb_agg(jsonb_build_object('status', h.to_status, 'changed_at', h.changed_at) order by h.changed_at asc)
        from public.order_status_history h
        where h.order_id = o.id
      ),
      '[]'::jsonb
    )
  from public.orders o
  where o.id = v_order_id;
end;
$$;

grant execute on function public.track_order_request to anon, authenticated;
