import crypto from "crypto";

function parseOrigins(value) {
  return (value || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

const nodeEnv = process.env.NODE_ENV || "development";

export const env = {
  nodeEnv,
  isProduction: nodeEnv === "production",
  port: Number(process.env.PORT || 5000),
  // Comma-separated list, e.g. "http://localhost:5173,https://austpc.example.com"
  clientOrigins: parseOrigins(process.env.CLIENT_ORIGIN || "http://localhost:5173"),
  trustProxy: process.env.TRUST_PROXY === "true",
  // Serve the built React app (Frontend/dist) from this server, so one service
  // hosts both the site and the API. Defaults on in production.
  serveFrontend: process.env.SERVE_FRONTEND
    ? process.env.SERVE_FRONTEND === "true"
    : nodeEnv === "production",

  mongodbUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/austpc",

  adminUsername: process.env.ADMIN_USERNAME || "austpc_admin",
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH || sha256(process.env.ADMIN_PASSWORD || "Admin@2026!"),
  tokenSecret: process.env.ADMIN_TOKEN_SECRET || "austpc-dev-token-secret",
  tokenTtlSeconds: Number(process.env.ADMIN_TOKEN_TTL_SECONDS || 60 * 60 * 8),

  // "auto" uses S3 when credentials are present, otherwise local disk storage.
  storageDriver: process.env.STORAGE_DRIVER || "auto",
  // Base URL used to build public URLs for locally stored uploads.
  publicBaseUrl: process.env.PUBLIC_BASE_URL || "",

  s3: {
    region: process.env.AWS_REGION || "",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    bucketName: process.env.S3_BUCKET_NAME || "",
    endpoint: process.env.S3_ENDPOINT || "",
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
  },
};

export function isS3Configured() {
  return Boolean(env.s3.accessKeyId && env.s3.secretAccessKey && env.s3.bucketName);
}

export function resolveStorageDriver() {
  if (env.storageDriver === "s3" || env.storageDriver === "local") {
    return env.storageDriver;
  }
  return isS3Configured() ? "s3" : "local";
}

export function validateEnv() {
  const problems = [];

  if (env.tokenSecret === "austpc-dev-token-secret") {
    problems.push("ADMIN_TOKEN_SECRET is using the insecure default.");
  }
  if (!process.env.ADMIN_PASSWORD_HASH && !process.env.ADMIN_PASSWORD) {
    problems.push("ADMIN_PASSWORD_HASH is not set; falling back to the default dev password.");
  }
  if (env.storageDriver === "s3" && !isS3Configured()) {
    problems.push("STORAGE_DRIVER=s3 but AWS credentials/bucket are missing.");
  }

  if (problems.length > 0) {
    if (env.isProduction) {
      throw new Error(`Refusing to start in production:\n- ${problems.join("\n- ")}`);
    }
    for (const problem of problems) {
      console.warn(`[env] warning: ${problem}`);
    }
  }
}
