/**
 * Zero-install local MongoDB for development.
 *
 * Runs a real `mongod` (auto-downloaded on first run by mongodb-memory-server)
 * with a PERSISTENT data directory at Backend/data/db, listening on the same
 * URI the backend uses by default: mongodb://127.0.0.1:27017/austpc
 *
 * Keep this process running in one terminal, then in another:
 *   npm run seed   (first time)
 *   npm run dev
 *
 * For production, point MONGODB_URI at MongoDB Atlas or a self-hosted server
 * instead — this script is for development only.
 */
import "../config/loadEnv.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { MongoMemoryServer } from "mongodb-memory-server";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "..", "data", "db");
const PORT = Number(process.env.LOCAL_DB_PORT || 27017);

fs.mkdirSync(DB_PATH, { recursive: true });

console.log("[local-db] starting MongoDB (first run downloads the binary — please wait)...");

let server;
try {
  server = await MongoMemoryServer.create({
    instance: {
      ip: "127.0.0.1",
      port: PORT,
      dbPath: DB_PATH,
      // wiredTiger persists to dbPath; data survives restarts.
      storageEngine: "wiredTiger",
    },
  });
} catch (error) {
  console.error(`[local-db] failed to start on port ${PORT}:`, error.message);
  console.error("[local-db] is another MongoDB already running on that port?");
  process.exit(1);
}

console.log(`[local-db] MongoDB running at mongodb://127.0.0.1:${PORT}`);
console.log(`[local-db] data directory: ${DB_PATH}`);
console.log("[local-db] press Ctrl+C to stop (data is kept)");

async function stop(signal) {
  console.log(`\n[local-db] ${signal} received, stopping (data is kept)...`);
  try {
    await server.stop({ doCleanup: false });
  } finally {
    process.exit(0);
  }
}

process.on("SIGINT", () => stop("SIGINT"));
process.on("SIGTERM", () => stop("SIGTERM"));
