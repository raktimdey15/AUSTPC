import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import { env } from "./config/env.js";
import { apiLimiter } from "./middleware/rateLimit.js";
import { LOCAL_UPLOADS_DIR } from "./services/storageService.js";
import authRoutes from "./routes/auth.js";
import contentRoutes from "./routes/content.js";
import sectionRoutes from "./routes/sections.js";
import uploadRoutes from "./routes/upload.js";
import applicationRoutes from "./routes/applications.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_DIST = path.join(__dirname, "..", "Frontend", "dist");

const app = express();

app.disable("x-powered-by");
if (env.trustProxy) {
  app.set("trust proxy", 1);
}

app.use(
  helmet({
    // Images are served cross-origin to the Vite dev server / deployed frontend.
    crossOriginResourcePolicy: { policy: "cross-origin" },
    // This server also serves the HTML document, so the CSP must permit what
    // the React app actually needs: its own bundle, inline styles (Tailwind and
    // framer-motion set them), and images from anywhere (admins paste external
    // URLs, and uploads may live on S3/R2).
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        fontSrc: ["'self'", "data:"],
        connectSrc: ["'self'", ...env.clientOrigins],
        objectSrc: ["'none'"],
        frameAncestors: ["'self'"],
      },
    },
  })
);

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser tools (no Origin header) and allowlisted origins.
      if (!origin || env.clientOrigins.length === 0 || env.clientOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      const error = new Error(`Origin ${origin} is not allowed by CORS`);
      error.status = 403;
      callback(error);
    },
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(morgan(env.isProduction ? "combined" : "dev"));

// Locally stored uploads (used when S3 isn't configured).
app.use(
  "/uploads",
  express.static(LOCAL_UPLOADS_DIR, {
    fallthrough: false,
    immutable: true,
    maxAge: "365d",
  })
);

app.use("/api", apiLimiter);

// Used as Render's health check. Reports 503 when the database link is down so
// the platform restarts the instance instead of serving a broken site.
app.get("/api/health", (_req, res) => {
  const databaseUp = mongoose.connection.readyState === 1;
  res.status(databaseUp ? 200 : 503).json({
    status: databaseUp ? "ok" : "degraded",
    uptimeSeconds: Math.round(process.uptime()),
    database: databaseUp ? "connected" : "disconnected",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/applications", applicationRoutes);

// 404 for unknown API routes. Declared before the SPA fallback so a mistyped
// API path returns JSON instead of the React index.html.
app.use("/api", (_req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Serve the built React app from this same server (single-service deployment).
if (env.serveFrontend) {
  // Hashed asset filenames can be cached forever; index.html must not be.
  app.use(
    express.static(FRONTEND_DIST, {
      maxAge: "365d",
      index: false,
      setHeaders(res, filePath) {
        if (filePath.endsWith("index.html")) {
          res.setHeader("Cache-Control", "no-cache");
        }
      },
    })
  );

  // History fallback: every non-API route renders the SPA so deep links like
  // /admin/dashboard and /events/:slug work on a hard refresh.
  app.get("*", (_req, res, next) => {
    res.sendFile(path.join(FRONTEND_DIST, "index.html"), (error) => {
      if (error) next(error);
    });
  });
}

// Central error handler.
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  if (status >= 500) {
    console.error("[error]", err);
  }
  res.status(status).json({
    message: status >= 500 && env.isProduction ? "Server error" : err.message || "Server error",
  });
});

export default app;
