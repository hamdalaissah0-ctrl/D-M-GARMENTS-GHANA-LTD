-- Automatic order_status_history on status change, and a generic audit_logs
-- trigger for orders/customers/products so admin mutations don't each need
-- to remember to log manually.

create function public.log_order_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
begin
  if new.status is distinct from old.status then
    insert into public.order_status_history (order_id, from_status, to_status, changed_by)
    values (new.id, old.status, new.status, auth.uid());
  end if;
  return new;
end;
$$;

create trigger orders_log_status_change
  after update on public.orders
  for each row execute function public.log_order_status_change();

create function public.log_audit_event()
returns trigger
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.audit_logs (actor_id, action, entity_type, entity_id, new_value)
    values (auth.uid(), 'created', tg_table_name, new.id::text, to_jsonb(new));
    return new;
  elsif tg_op = 'UPDATE' then
    insert into public.audit_logs (actor_id, action, entity_type, entity_id, old_value, new_value)
    values (auth.uid(), 'updated', tg_table_name, new.id::text, to_jsonb(old), to_jsonb(new));
    return new;
  elsif tg_op = 'DELETE' then
    insert into public.audit_logs (actor_id, action, entity_type, entity_id, old_value)
    values (auth.uid(), 'deleted', tg_table_name, old.id::text, to_jsonb(old));
    return old;
  end if;
  return null;
end;
$$;

create trigger orders_audit
  after insert or update or delete on public.orders
  for each row execute function public.log_audit_event();

create trigger customers_audit
  after insert or update or delete on public.customers
  for each row execute function public.log_audit_event();

create trigger products_audit
  after insert or update or delete on public.products
  for each row execute function public.log_audit_event();

create trigger quotes_audit
  after insert or update or delete on public.quotes
  for each row execute function public.log_audit_event();

-- Keep order_assignments in sync with orders.assigned_to automatically.
create function public.log_order_assignment()
returns trigger
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
begin
  if new.assigned_to is distinct from old.assigned_to and new.assigned_to is not null then
    insert into public.order_assignments (order_id, assigned_to, assigned_by)
    values (new.id, new.assigned_to, auth.uid());
  end if;
  return new;
end;
$$;

create trigger orders_log_assignment
  after update on public.orders
  for each row execute function public.log_order_assignment();
