import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
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

function getBucket() {
  return getRequiredEnv("AWS_S3_BUCKET");
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

/**
 * Resolve an object key from a public S3 URL belonging to this bucket.
 * Returns null for empty/external/unrelated URLs.
 */
export function getS3KeyFromUrl(url: string | null | undefined): string | null {
  const trimmed = (url ?? "").trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    const base = new URL(getPublicBaseUrl());
    const bucket = getBucket();
    const host = parsed.hostname.toLowerCase();
    const baseHost = base.hostname.toLowerCase();

    const isOurHost =
      host === baseHost ||
      host === `${bucket}.s3.amazonaws.com` ||
      host.startsWith(`${bucket}.s3.`);

    if (!isOurHost) return null;

    // Path-style: s3.region.amazonaws.com/bucket/key
    let pathname = decodeURIComponent(parsed.pathname.replace(/^\/+/, ""));
    if (host.startsWith("s3.") && pathname.startsWith(`${bucket}/`)) {
      pathname = pathname.slice(bucket.length + 1);
    }

    if (!pathname || pathname.includes("..")) return null;
    return pathname;
  } catch {
    return null;
  }
}

export async function uploadToS3({
  file,
  filename,
  contentType,
  folder = "uploads",
}: UploadToS3Input) {
  const bucket = getBucket();
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

export async function deleteFromS3ByKey(key: string) {
  const bucket = getBucket();
  const client = getS3Client();
  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
}

/** Best-effort delete for one or more public URLs. Skips non-S3 / foreign URLs. */
export async function deleteS3Urls(
  urls: Array<string | null | undefined>,
): Promise<{ deleted: string[]; skipped: string[]; failed: string[] }> {
  const unique = Array.from(
    new Set(urls.map((url) => (url ?? "").trim()).filter(Boolean)),
  );

  const deleted: string[] = [];
  const skipped: string[] = [];
  const failed: string[] = [];

  for (const url of unique) {
    const key = getS3KeyFromUrl(url);
    if (!key) {
      skipped.push(url);
      continue;
    }
    try {
      await deleteFromS3ByKey(key);
      deleted.push(url);
    } catch {
      failed.push(url);
    }
  }

  return { deleted, skipped, failed };
}

export function extractImageUrlsFromHtml(html: string | null | undefined) {
  if (!html) return [] as string[];
  const urls: string[] = [];
  const regex = /<img[^>]+src=["']([^"']+)["']/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    if (match[1]) urls.push(match[1]);
  }
  return urls;
}

export function diffRemovedUrls(
  previous: Array<string | null | undefined>,
  next: Array<string | null | undefined>,
) {
  const nextSet = new Set(
    next.map((url) => (url ?? "").trim()).filter(Boolean),
  );
  return Array.from(
    new Set(
      previous
        .map((url) => (url ?? "").trim())
        .filter((url) => url && !nextSet.has(url)),
    ),
  );
}

export const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
