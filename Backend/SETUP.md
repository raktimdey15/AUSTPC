# AUSTPC Photo Upload — Setup Guide

## 1. Backend

1. Copy the `AUSTPC-backend` folder to sit next to `Frontend`, e.g.:
   ```
   AUSTPC/
     Frontend/
     Backend/   <- this folder
   ```
2. `cd Backend && npm install`
3. Copy `.env.example` to `.env` and fill in:
   - `MONGODB_URI` — your local/Atlas MongoDB connection string
   - `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET_NAME` — your S3 (or R2/MinIO) credentials
   - Make your S3 bucket public-read for the objects you upload (or front it with CloudFront) so the stored `url` is directly viewable.
4. `npm run dev` — starts the API on `http://localhost:5000`.

Endpoints:
- `POST /api/uploads` — multipart field `image` (+ optional `category`) → `{ id, url, category }`
- `GET /api/uploads?category=gallery` — list uploads
- `DELETE /api/uploads/:id` — removes from S3 + MongoDB

## 2. Frontend

1. Copy `frontend-updates/src/utils/api.ts` into `Frontend/src/utils/api.ts` (create the `utils` folder if it doesn't exist).
2. Copy `frontend-updates/src/components/Common/ImageUploadField.tsx` into
   `Frontend/src/components/Common/ImageUploadField.tsx` (new file).
3. Add to `Frontend/.env`:
   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
4. In `Frontend/src/pages/Admin/admin.tsx`:
   - **Delete** the inline `function ImageUploadField(...) { ... }` block near the top of the file (the FileReader/base64 version).
   - **Add** this import near the other imports:
     ```tsx
     import ImageUploadField from "../../components/Common/ImageUploadField";
     ```
   - Every existing `<ImageUploadField label="..." value={...} onChange={...} />` call keeps working as-is
     (props are unchanged), but you can optionally pass a `category` prop so uploads are tagged in MongoDB, e.g.:
     ```tsx
     <ImageUploadField label="Event Image" value={event.image} onChange={(v) => onChange({ ...event, image: v })} category="event" />
     <ImageUploadField label="Photo" value={member.photo} onChange={(v) => onChange({ ...member, photo: v })} category="member" />
     <ImageUploadField label={`Gallery Image ${index + 1}`} value={image} onChange={(v) => updateGallery(index, v)} category="gallery" />
     <ImageUploadField label="Hero Image" value={slide} onChange={...} category="hero" />
     <ImageUploadField label="Poster" value={event.poster} onChange={...} category="upcoming-event" />
     <ImageUploadField label="Logo" value={item.logo} onChange={...} category="collaboration" />
     ```

That's it — selecting a file now uploads it to S3 via your Express API, saves a record in MongoDB, and
stores the returned public URL in your site content (still persisted the same way you already have it,
e.g. localStorage/Context) instead of a giant base64 string.

## Notes
- 8MB max file size and jpeg/png/webp/gif only — adjust in `Backend/middleware/upload.js` if needed.
- If you don't want to manage AWS creds yet, swap `config/s3.js` for Supabase Storage's S3-compatible
  endpoint — just set `S3_ENDPOINT` and `S3_FORCE_PATH_STYLE=true` in `.env`.
- Want an "existing uploads" picker in the admin panel instead of always uploading fresh? Use
  `GET /api/uploads?category=...` to list and let the admin pick a previously uploaded image.
