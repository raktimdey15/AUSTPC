import crypto from "crypto";
import { env } from "../config/env.js";

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function safeHexEqual(left, right) {
  try {
    return crypto.timingSafeEqual(Buffer.from(left, "hex"), Buffer.from(right, "hex"));
  } catch {
    return false;
  }
}

export function verifyAdminCredentials(username, password) {
  if (username.trim() !== env.adminUsername) {
    return false;
  }

  return safeHexEqual(sha256(password), env.adminPasswordHash);
}

export function createAdminToken(username) {
  const payload = {
    sub: username,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + env.tokenTtlSeconds,
  };

  const payloadPart = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", env.tokenSecret).update(payloadPart).digest("base64url");

  return `${payloadPart}.${signature}`;
}

export function verifyAdminToken(token) {
  if (!token || typeof token !== "string") {
    return null;
  }

  const [payloadPart, signature] = token.split(".");
  if (!payloadPart || !signature) {
    return null;
  }

  const expectedSignature = crypto.createHmac("sha256", env.tokenSecret).update(payloadPart).digest("base64url");
  if (expectedSignature.length !== signature.length || !crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature))) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadPart, "base64url").toString("utf8"));
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
