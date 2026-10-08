-- Allow anonymous customers to upload reference files for an in-progress
-- RFQ submission, scoped to a `pending/<idempotency_key>/...` prefix only.
-- Server-side enforces the real MIME/size checks when order_files rows are
-- created; this bucket config is defense-in-depth, not the sole guard.

update storage.buckets
set file_size_limit = 15728640, -- 15 MB, matches site_settings.upload_limits
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
where id = 'customer-order-files';

create policy order_files_storage_anon_upload on storage.objects for insert to anon, authenticated
  with check (
    bucket_id = 'customer-order-files'
    and (storage.foldername(name))[1] = 'pending'
  );
