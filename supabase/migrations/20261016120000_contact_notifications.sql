-- Phase 11 (Notifications): contact-form submissions currently never alert
-- staff — only order submissions dispatch an SMS. This closes that gap by
-- reusing the existing notification_events queue for contact messages too.

alter table public.notification_events
  add column contact_submission_id uuid references public.contact_submissions(id) on delete cascade;

create index notification_events_contact_submission_id_idx
  on public.notification_events (contact_submission_id);

create or replace function public.submit_contact_request(
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

  insert into public.notification_events (contact_submission_id, channel, recipient, template, payload)
  select v_id, 'sms'::public.notification_channel, cp.phone_primary, 'new_contact_internal',
         jsonb_build_object('full_name', p_full_name, 'message', left(p_message, 200))
  from public.company_profile cp
  where cp.phone_primary is not null;

  return v_id;
end;
$$;

grant execute on function public.submit_contact_request to anon, authenticated;
