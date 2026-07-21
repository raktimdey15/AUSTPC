import { S3Client } from "@aws-sdk/client-s3";

const isCustomEndpoint = Boolean(process.env.S3_ENDPOINT);

export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  ...(isCustomEndpoint
    ? {
        endpoint: process.env.S3_ENDPOINT,
        forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
      }
    : {}),
});

export const BUCKET_NAME = process.env.S3_BUCKET_NAME;
