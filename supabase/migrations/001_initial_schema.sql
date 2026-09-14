-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid REFERENCES auth.users(id) PRIMARY KEY,
  created_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  category text,
  description text,
  long_description text,
  date text,
  venue text,
  image_url text,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create gallery_photos table
CREATE TABLE IF NOT EXISTS gallery_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  storage_path text NOT NULL,
  category text NOT NULL,
  event_id uuid REFERENCES events(id),
  uploaded_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_gallery_photos_category ON gallery_photos(category);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_created_at ON gallery_photos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_event_id ON gallery_photos(event_id);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at DESC);

-- Trigger for updated_at on gallery_photos
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_gallery_photos_updated_at ON gallery_photos;
CREATE TRIGGER update_gallery_photos_updated_at
BEFORE UPDATE ON gallery_photos
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Trigger for updated_at on events
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON events
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
