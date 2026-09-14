-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for admin_users
DROP POLICY IF EXISTS "Admins can view own record" ON admin_users;
CREATE POLICY "Admins can view own record"
ON admin_users FOR SELECT
USING (auth.uid() = id);

-- RLS Policies for events
DROP POLICY IF EXISTS "Public can view events" ON events;
CREATE POLICY "Public can view events"
ON events FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins can insert events" ON events;
CREATE POLICY "Admins can insert events"
ON events FOR INSERT
WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can update events" ON events;
CREATE POLICY "Admins can update events"
ON events FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can delete events" ON events;
CREATE POLICY "Admins can delete events"
ON events FOR DELETE
USING (is_admin());

-- RLS Policies for gallery_photos
DROP POLICY IF EXISTS "Public can view gallery photos" ON gallery_photos;
CREATE POLICY "Public can view gallery photos"
ON gallery_photos FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins can insert photos" ON gallery_photos;
CREATE POLICY "Admins can insert photos"
ON gallery_photos FOR INSERT
WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can update photos" ON gallery_photos;
CREATE POLICY "Admins can update photos"
ON gallery_photos FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can delete photos" ON gallery_photos;
CREATE POLICY "Admins can delete photos"
ON gallery_photos FOR DELETE
USING (is_admin());
