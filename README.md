# AUSTPC Website

Website for the AUST Photography Club — a React + Vite frontend with an
Express + MongoDB backend and an admin panel for editing every page's content.

## Quick start

Three terminals from the repository root:

```powershell
# Terminal 1 — database (persistent local MongoDB, no install needed)
cd Backend
npm install
npm run db

# Terminal 2 — API (first time: npm run seed to load default content)
cd Backend
npm run seed
npm run dev          # http://localhost:5000

# Terminal 3 — frontend
cd Frontend
npm install
npm run dev          # http://localhost:5173
```

Admin panel: <http://localhost:5173/admin> — log in with **austpc_admin / Admin@2026!**
(local defaults from `Backend/.env`; change these before deploying).

## Structure

| Path | Description |
| --- | --- |
| `Frontend/` | React 19 + Vite + Tailwind site and admin dashboard |
| `Backend/` | Express API, MongoDB models, image uploads — see [Backend/README.md](Backend/README.md) |
| `render.yaml` | Render Blueprint for one-service hosting |
| `DEPLOYMENT.md` | Step-by-step guide to putting the site online |

## Going live

The backend serves the built React app, so the whole site deploys as a single
service. Follow **[DEPLOYMENT.md](DEPLOYMENT.md)** for Render + MongoDB Atlas
(free tier, ~20 minutes).

To run the production build locally:

```powershell
npm run build      # installs both projects and builds the frontend
npm start          # serves site + API together on http://localhost:5000
```

## How content flows

1. Visitors load the site; `ContentContext` fetches `GET /api/content` and renders it
   (falling back to a local cache if the API is unreachable).
2. An admin edits any section in the dashboard and clicks **Finalize & Save**,
   which sends `PUT /api/content` with the admin bearer token.
3. Join-form submissions go to `POST /api/applications` and are stored in a
   separate, admin-only collection — never exposed through the public content API.
4. Images chosen in the admin panel upload to `POST /api/uploads`, are re-encoded
   to WebP, stored in S3 (or on disk when S3 isn't configured), and the returned
   URL is saved into the content.

Full API reference, data model, and deployment checklist: **[Backend/README.md](Backend/README.md)**.
