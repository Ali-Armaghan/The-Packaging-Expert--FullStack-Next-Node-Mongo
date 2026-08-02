import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

let cachedClient: S3Client | null = null;

function getS3Client() {
  if (cachedClient) return cachedClient;

  cachedClient = new S3Client({
    region: getRequiredEnv("AWS_REGION"),
    credentials: {
      accessKeyId: getRequiredEnv("AWS_ACCESS_KEY_ID"),
      secretAccessKey: getRequiredEnv("AWS_SECRET_ACCESS_KEY"),
    },
  });

  return cachedClient;
}

function getPublicBaseUrl() {
  const configured = process.env.AWS_S3_PUBLIC_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");

  const bucket = getRequiredEnv("AWS_S3_BUCKET");
  const region = getRequiredEnv("AWS_REGION");
  return `https://${bucket}.s3.${region}.amazonaws.com`;
}

function sanitizeFilename(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export type UploadToS3Input = {
  file: File | Buffer;
  filename: string;
  contentType: string;
  folder?: string;
};

export async function uploadToS3({
  file,
  filename,
  contentType,
  folder = "uploads",
}: UploadToS3Input) {
  const bucket = getRequiredEnv("AWS_S3_BUCKET");
  const client = getS3Client();
  const safeName = sanitizeFilename(filename) || "file";
  const key = `${folder.replace(/^\/|\/$/g, "")}/${Date.now()}-${randomUUID().slice(0, 8)}-${safeName}`;

  const body = Buffer.isBuffer(file)
    ? file
    : Buffer.from(await (file as File).arrayBuffer());

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return {
    key,
    url: `${getPublicBaseUrl()}/${key}`,
  };
}

export const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
