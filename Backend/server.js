import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import uploadRoutes from "./routes/upload.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/uploads", uploadRoutes);

// Multer / generic error handler (must have 4 args to be recognized by Express)
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`[server] running on http://localhost:${PORT}`));
  })
  .catch((error) => {
    console.error("[server] failed to start:", error.message);
    process.exit(1);
  });
