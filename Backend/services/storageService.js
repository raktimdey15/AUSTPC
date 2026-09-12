import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { env, resolveStorageDriver } from "../config/env.js";
import { getS3Client } from "../config/s3.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Backend/uploads — served statically by app.js at /uploads.
export const LOCAL_UPLOADS_DIR = path.join(__dirname, "..", "uploads");

function buildS3PublicUrl(key) {
  if (env.s3.endpoint) {
    return `${env.s3.endpoint.replace(/\/$/, "")}/${env.s3.bucketName}/${key}`;
  }
  return `https://${env.s3.bucketName}.s3.${env.s3.region}.amazonaws.com/${key}`;
}

function buildLocalPublicUrl(key) {
  const base = env.publicBaseUrl || `http://localhost:${env.port}`;
  return `${base.replace(/\/$/, "")}/uploads/${key}`;
}

async function saveObjectS3(key, buffer, contentType) {
  await getS3Client().send(
    new PutObjectCommand({
      Bucket: env.s3.bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );
  return buildS3PublicUrl(key);
}

async function deleteObjectS3(key) {
  await getS3Client().send(new DeleteObjectCommand({ Bucket: env.s3.bucketName, Key: key }));
}

async function saveObjectLocal(key, buffer) {
  const filePath = path.join(LOCAL_UPLOADS_DIR, key);
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(path.resolve(LOCAL_UPLOADS_DIR))) {
    throw new Error("Invalid storage key");
  }
  await fs.mkdir(path.dirname(resolved), { recursive: true });
  await fs.writeFile(resolved, buffer);
  return buildLocalPublicUrl(key);
}

async function deleteObjectLocal(key) {
  const resolved = path.resolve(path.join(LOCAL_UPLOADS_DIR, key));
  if (!resolved.startsWith(path.resolve(LOCAL_UPLOADS_DIR))) {
    throw new Error("Invalid storage key");
  }
  await fs.rm(resolved, { force: true });
}

/**
 * Store a buffer under `key` and return its public URL.
 * Driver is chosen once per call so a config change doesn't require restart logic here.
 */
export async function saveObject(key, buffer, contentType) {
  const driver = resolveStorageDriver();
  if (driver === "s3") {
    return saveObjectS3(key, buffer, contentType);
  }
  return saveObjectLocal(key, buffer);
}

/**
 * Delete by key. `storage` is persisted per-image so files uploaded under one
 * driver are still deletable after switching drivers.
 */
export async function deleteObject(key, storage) {
  if (storage === "s3") {
    await deleteObjectS3(key);
    return;
  }
  await deleteObjectLocal(key);
}

export function activeStorageDriver() {
  return resolveStorageDriver();
}
