import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import contentRoutes from "./routes/content.js";
import sectionRoutes from "./routes/sections.js";
import uploadRoutes from "./routes/upload.js";

const app = express();

app.disable("x-powered-by");
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/uploads", uploadRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

export default app;