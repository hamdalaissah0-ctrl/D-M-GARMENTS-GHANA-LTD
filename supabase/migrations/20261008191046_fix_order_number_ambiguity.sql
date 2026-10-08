-- Fix: RETURNS TABLE(order_id, order_number) creates implicit PL/pgSQL
-- variables that collided with the unqualified `order_number` column in the
-- RETURNING clause (SQLSTATE 42702). Alias the insert target explicitly.

create or replace function public.submit_order_request(
  p_idempotency_key text,
  p_full_name text,
  p_phone text,
  p_whatsapp_phone text,
  p_email text,
  p_company_name text,
  p_location text,
  p_items jsonb,
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

  select c.id into v_customer_id
  from public.customers c
  where c.phone = p_phone
  order by c.created_at desc
  limit 1;

  if v_customer_id is null then
    insert into public.customers (full_name, company_name, email, phone, whatsapp_phone, location, source)
    values (p_full_name, p_company_name, p_email, p_phone, p_whatsapp_phone, p_location, p_source)
    returning customers.id into v_customer_id;
  end if;

  insert into public.orders as o (
    idempotency_key, customer_id, status, source, customer_description,
    preferred_deadline, delivery_location
  )
  values (
    p_idempotency_key, v_customer_id, 'new', p_source, p_customer_description,
    p_preferred_deadline, p_delivery_location
  )
  returning o.id, o.order_number into v_order_id, v_order_number;

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
  select v_order_id, co.ch, co.value, 'new_order_internal',
         jsonb_build_object('order_number', v_order_number, 'customer_name', p_full_name)
  from public.company_profile cp
  cross join lateral (values ('sms'::public.notification_channel, cp.phone_primary)) as co(ch, value)
  where cp.phone_primary is not null;

  return query select v_order_id, v_order_number;
end;
$$;

grant execute on function public.submit_order_request to anon, authenticated;
