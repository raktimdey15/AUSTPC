-- 1. Add photographer_name to gallery_photos
ALTER TABLE gallery_photos ADD COLUMN IF NOT EXISTS photographer_name text;

-- 2. Create membership_drives table
CREATE TABLE IF NOT EXISTS membership_drives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  semester_name text NOT NULL,
  status text NOT NULL DEFAULT 'CLOSED', -- 'OPEN' or 'CLOSED'
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  opened_at timestamptz,
  closed_at timestamptz,
  spreadsheet_id text,
  spreadsheet_url text,
  drive_folder_id text,
  drive_folder_url text,
  form_schema jsonb NOT NULL DEFAULT '[]'::jsonb
);

-- 3. Create membership_responses table
CREATE TABLE IF NOT EXISTS membership_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  drive_id uuid REFERENCES membership_drives(id) ON DELETE CASCADE,
  applicant_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  photo_url text,
  photo_drive_id text,
  submitted_at timestamptz DEFAULT now()
);

-- 4. Enable RLS
ALTER TABLE membership_drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_responses ENABLE ROW LEVEL SECURITY;

-- 5. Policies for membership_drives
-- Public can read all membership drives (to see if one is OPEN)
DROP POLICY IF EXISTS "Public can view membership drives" ON membership_drives;
CREATE POLICY "Public can view membership drives"
ON membership_drives FOR SELECT
USING (true);

-- Admins can manage membership drives
DROP POLICY IF EXISTS "Admins can manage membership drives" ON membership_drives;
CREATE POLICY "Admins can manage membership drives"
ON membership_drives FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- 6. Policies for membership_responses
-- Public can insert a response
DROP POLICY IF EXISTS "Public can submit membership response" ON membership_responses;
CREATE POLICY "Public can submit membership response"
ON membership_responses FOR INSERT
WITH CHECK (true);

-- Admins can read/manage responses
DROP POLICY IF EXISTS "Admins can manage membership responses" ON membership_responses;
CREATE POLICY "Admins can manage membership responses"
ON membership_responses FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- Update Triggers
DROP TRIGGER IF EXISTS update_membership_drives_updated_at ON membership_drives;
CREATE TRIGGER update_membership_drives_updated_at
BEFORE UPDATE ON membership_drives
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
