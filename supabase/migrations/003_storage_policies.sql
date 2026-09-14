-- Storage policies for the 'gallery' bucket
-- These assume you have created a public bucket named 'gallery' in the Supabase Dashboard.

-- Public can read all objects in the gallery bucket
DROP POLICY IF EXISTS "Public can read gallery objects" ON storage.objects;
CREATE POLICY "Public can read gallery objects"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');

-- Only admins can insert/upload new objects
DROP POLICY IF EXISTS "Admins can upload to gallery" ON storage.objects;
CREATE POLICY "Admins can upload to gallery"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'gallery' AND
  EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = auth.uid()
  )
);

-- Only admins can update objects
DROP POLICY IF EXISTS "Admins can update gallery objects" ON storage.objects;
CREATE POLICY "Admins can update gallery objects"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'gallery' AND
  EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = auth.uid()
  )
)
WITH CHECK (
  bucket_id = 'gallery' AND
  EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = auth.uid()
  )
);

-- Only admins can delete objects
DROP POLICY IF EXISTS "Admins can delete gallery objects" ON storage.objects;
CREATE POLICY "Admins can delete gallery objects"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'gallery' AND
  EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = auth.uid()
  )
);
