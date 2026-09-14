# AUSTPC Backend

Express + MongoDB (Mongoose) API that powers the AUSTPC website: public site
content, membership applications, image uploads, and the admin panel.

## Quick start (local development)

```powershell
cd Backend
npm install

# 1. Terminal A — start the local database (zero install; data persists in Backend/data/db)
npm run db

# 2. Terminal B — seed default site content + create indexes (first time only)
npm run seed

# 3. Terminal B — start the API
npm run dev        # auto-restarts on file changes; use `npm start` for plain run
```

The API listens on <http://localhost:5000>. The frontend dev server
(`http://localhost:5173`) is allowed by CORS out of the box.

Admin login (local defaults, set in `.env`): **austpc_admin / Admin@2026!**

> `.env` is created for local dev and is git-ignored. `.env.example` documents
> every variable. **Change the admin password and token secret before deploying.**

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start API with auto-reload |
| `npm start` | Start API |
| `npm run db` | Run a persistent local MongoDB on `127.0.0.1:27017` (dev only) |
| `npm run seed` | Create indexes + insert default site content if the DB is empty |
| `npm run seed:force` | Same, but overwrite existing site content with the defaults |

`npm run db` uses `mongodb-memory-server` to download a real `mongod` binary on
first run (no admin rights, no system install) and stores data in
`Backend/data/db`, so content survives restarts. In production point
`MONGODB_URI` at MongoDB Atlas or a self-hosted server instead.

## Architecture

```
server.js            boot: env validation → DB connect → index sync → listen, graceful shutdown
app.js               middleware (helmet, CORS allowlist, rate limits, morgan, JSON) + routes
config/
  env.js             central typed env config + production safety checks
  db.js              Mongoose connection
  s3.js              lazy S3 client (only built when S3 is actually used)
  contentSections.js allowlist of content sections + state sanitizer
  defaultContent.js  canonical default site content (mirrors the frontend defaults)
models/
  SiteContent.js     singleton document holding all editor-managed page content
  Application.js     membership applications (own collection — never public)
  Image.js           upload metadata (storage driver recorded per image)
controllers/ routes/ services/
  content            public read, admin whole-state save (sanitized)
  sections           granular per-section read/write
  applications       public create, admin list/status/delete
  uploads            admin upload (webp re-encode via sharp), public list, admin delete
services/storageService.js  S3 or local-disk storage behind one interface
middleware/          adminAuth (HMAC bearer token), rateLimit, multer upload
scripts/             run-local-db.js, seed.js, ensureIndexes.js
```

### Data model

- **`sitecontents`** — one document (`key: "site-content"`) whose `state` holds
  every editor-managed section (hero, pages, events, members, notices, …).
  Writes are sanitized against the section allowlist; unknown keys are dropped.
- **`applications`** — join-form submissions with a review `status`
  (`pending → reviewed/accepted/rejected`). Indexed by `createdAt` and
  `email+semester`. Kept out of the content blob so applicant personal data is
  never exposed through public endpoints and admin saves can't clobber them.
- **`images`** — metadata for uploaded images (key, public URL, category,
  storage driver). Files live in S3 or `Backend/uploads`.

### Image storage

`STORAGE_DRIVER=auto` (default) uses S3 when `AWS_ACCESS_KEY_ID`,
`AWS_SECRET_ACCESS_KEY`, and `S3_BUCKET_NAME` are set; otherwise files are
stored under `Backend/uploads/<category>/<uuid>.webp` and served at
`/uploads/...`. Every upload is re-encoded to WebP (quality 82, EXIF rotation
applied), which also strips any malicious payload from the original file.
Works with any S3-compatible provider (Cloudflare R2, MinIO, …) via
`S3_ENDPOINT`.

### Admin auth

Single-admin model: credentials come from env (`ADMIN_USERNAME` +
`ADMIN_PASSWORD_HASH`, SHA-256 hex). Login issues an HMAC-SHA256-signed expiring
token (`ADMIN_TOKEN_TTL_SECONDS`, default 8h) sent as `Authorization: Bearer`.
Login is rate-limited (10 attempts / 15 min / IP). In production the server
refuses to boot with default secrets.

## API reference

Public endpoints:

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/health` | Liveness + DB connection state |
| GET | `/api/content` | Full site content state (sanitized) |
| GET | `/api/sections/:section` | One content section |
| GET | `/api/uploads?category=` | List uploaded images |
| POST | `/api/applications` | Submit a membership application (rate-limited) |
| POST | `/api/content/applications` | Legacy alias of the above |
| POST | `/api/auth/login` | Admin login → `{ token, username }` |

Admin endpoints (require `Authorization: Bearer <token>`):

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/auth/me` | Validate session |
| PUT | `/api/content` | Replace the whole content state (sanitized) |
| PUT | `/api/sections/:section` | Replace one section (`{ "value": ... }`) |
| GET | `/api/applications?status=` | List applications (newest first) |
| PATCH | `/api/applications/:id/status` | Set `pending/reviewed/accepted/rejected` |
| DELETE | `/api/applications/:id` | Delete an application |
| POST | `/api/uploads` | Upload image (multipart field `image`, optional `category`) |
| DELETE | `/api/uploads/:id` | Delete an image (removes the stored file too) |

## Deployment

Step-by-step instructions for Render + MongoDB Atlas are in
**[../DEPLOYMENT.md](../DEPLOYMENT.md)**. The essentials for any host:

1. Set `NODE_ENV=production`.
2. Generate a fresh `ADMIN_TOKEN_SECRET` and `ADMIN_PASSWORD_HASH` (commands in
   `.env.example`); the server refuses to start in production with defaults.
3. Point `MONGODB_URI` at MongoDB Atlas (free tier works) or your own server.
   An empty database self-seeds with the default content on first request.
4. Set `CLIENT_ORIGIN` to the public site origin(s), comma-separated.
5. Set `SERVE_FRONTEND=true` (the default in production) to serve
   `Frontend/dist` from this server, or `false` if you host the frontend
   separately.
6. Either configure the `AWS_*`/`S3_*` variables, or keep local storage and set
   `PUBLIC_BASE_URL` to the backend's public URL — noting that local uploads
   need a persistent disk to survive restarts.
7. Behind a reverse proxy (nginx, Render, Railway…), set `TRUST_PROXY=true` so
   rate limiting sees real client IPs.
