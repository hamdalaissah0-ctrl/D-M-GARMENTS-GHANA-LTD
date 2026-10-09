create sequence public.quote_number_seq;

create function public.generate_quote_number()
returns text
language sql
as $$
  select 'QT-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.quote_number_seq')::text, 6, '0');
$$;

alter table public.quotes alter column quote_number set default public.generate_quote_number();
