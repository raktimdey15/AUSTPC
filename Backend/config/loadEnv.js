// Side-effect module: loads Backend/.env by absolute path.
//
// Import this FIRST, before anything that reads process.env. ES module imports
// are hoisted and evaluated in order, so a bare `import "./config/loadEnv.js"`
// runs before the modules imported after it — whereas a plain dotenv.config()
// call placed among the imports would run too late.
//
// Using an absolute path (rather than dotenv's cwd-relative default) means the
// server behaves identically whether it is started from Backend/ or from the
// repository root, as the Render start command does.
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, "..", ".env") });
