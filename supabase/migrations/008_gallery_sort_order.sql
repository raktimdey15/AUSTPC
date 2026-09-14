-- Add sort_order to gallery_photos
ALTER TABLE gallery_photos
ADD COLUMN sort_order INTEGER DEFAULT 0 NOT NULL;

-- Create an index for faster sorting
CREATE INDEX idx_gallery_photos_sort_order ON gallery_photos(sort_order);

-- Initialize sort_order based on created_at so existing photos maintain chronological order
WITH RankedPhotos AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as new_order
    FROM gallery_photos
)
UPDATE gallery_photos
SET sort_order = RankedPhotos.new_order
FROM RankedPhotos
WHERE gallery_photos.id = RankedPhotos.id;
