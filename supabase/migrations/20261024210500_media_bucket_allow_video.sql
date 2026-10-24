-- The "media" bucket was image-only (10MB cap). The video gallery needs it
-- to also accept the transcoded H.264 MP4s (largest is ~8.6MB). Applied live
-- via the Storage Admin API at build time (PUT /storage/v1/bucket/media) —
-- this migration documents that change for the tracked schema history and
-- re-applies it idempotently.

update storage.buckets
  set allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'video/mp4'],
      file_size_limit = 15728640
  where id = 'media';
