import { S3Client } from "@aws-sdk/client-s3";
import { env } from "./env.js";

let client = null;

// Lazy singleton: the client is only constructed when S3 is actually used,
// so a local-storage dev setup never needs AWS credentials.
export function getS3Client() {
  if (!client) {
    client = new S3Client({
      region: env.s3.region || "us-east-1",
      credentials: {
        accessKeyId: env.s3.accessKeyId,
        secretAccessKey: env.s3.secretAccessKey,
      },
      ...(env.s3.endpoint
        ? {
            endpoint: env.s3.endpoint,
            forcePathStyle: env.s3.forcePathStyle,
          }
        : {}),
    });
  }
  return client;
}

export const BUCKET_NAME = env.s3.bucketName;
