-- Create a new public storage bucket for site assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for the 'site-assets' bucket

-- Public can read all objects
DROP POLICY IF EXISTS "Public can read site-assets" ON storage.objects;
CREATE POLICY "Public can read site-assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-assets');

-- Only admins can insert/upload new objects
DROP POLICY IF EXISTS "Admins can upload to site-assets" ON storage.objects;
CREATE POLICY "Admins can upload to site-assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'site-assets' AND
  EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = auth.uid()
  )
);

-- Only admins can update objects
DROP POLICY IF EXISTS "Admins can update site-assets" ON storage.objects;
CREATE POLICY "Admins can update site-assets"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'site-assets' AND
  EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = auth.uid()
  )
)
WITH CHECK (
  bucket_id = 'site-assets' AND
  EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = auth.uid()
  )
);

-- Only admins can delete objects
DROP POLICY IF EXISTS "Admins can delete site-assets" ON storage.objects;
CREATE POLICY "Admins can delete site-assets"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'site-assets' AND
  EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = auth.uid()
  )
);
