-- Public bucket for catalogue/content imagery uploaded via the admin CMS
-- (product photos, category images, portfolio images, blog covers, etc.)
-- Reads are public; writes are staff-only (admin role), matching content table policy.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy media_public_read on storage.objects for select to anon, authenticated
  using (bucket_id = 'media');

create policy media_admin_write on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());

create policy media_admin_update on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_admin());

create policy media_admin_delete on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());
