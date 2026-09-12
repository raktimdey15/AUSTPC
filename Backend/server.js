import "./config/loadEnv.js";
import { validateEnv, env } from "./config/env.js";
import app from "./app.js";
import { connectDB, disconnectDB } from "./config/db.js";
import { ensureIndexes } from "./scripts/ensureIndexes.js";

validateEnv();

let server;

connectDB()
  .then(async () => {
    await ensureIndexes();
    server = app.listen(env.port, () =>
      console.log(`[server] running on http://localhost:${env.port} (${env.nodeEnv})`)
    );
  })
  .catch((error) => {
    console.error("[server] failed to start:", error.message);
    process.exit(1);
  });

async function shutdown(signal) {
  console.log(`\n[server] ${signal} received, shutting down...`);
  try {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    await disconnectDB();
    console.log("[server] clean shutdown complete");
    process.exit(0);
  } catch (error) {
    console.error("[server] error during shutdown:", error);
    process.exit(1);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
