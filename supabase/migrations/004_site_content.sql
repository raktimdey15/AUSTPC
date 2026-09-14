-- Create site_content table (JSON Document Store)
CREATE TABLE IF NOT EXISTS site_content (
  id integer PRIMARY KEY DEFAULT 1,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Ensure only one row ever exists in site_content
ALTER TABLE site_content ADD CONSTRAINT single_row CHECK (id = 1);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  department text NOT NULL,
  email text NOT NULL,
  semester text NOT NULL,
  phone text NOT NULL,
  skills text NOT NULL,
  submitted_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin (if not already declared in 002)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for site_content
DROP POLICY IF EXISTS "Public can view site content" ON site_content;
CREATE POLICY "Public can view site content"
ON site_content FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins can update site content" ON site_content;
CREATE POLICY "Admins can update site content"
ON site_content FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- RLS Policies for applications
DROP POLICY IF EXISTS "Public can submit applications" ON applications;
CREATE POLICY "Public can submit applications"
ON applications FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view applications" ON applications;
CREATE POLICY "Admins can view applications"
ON applications FOR SELECT
USING (is_admin());

DROP POLICY IF EXISTS "Admins can update applications" ON applications;
CREATE POLICY "Admins can update applications"
ON applications FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can delete applications" ON applications;
CREATE POLICY "Admins can delete applications"
ON applications FOR DELETE
USING (is_admin());
