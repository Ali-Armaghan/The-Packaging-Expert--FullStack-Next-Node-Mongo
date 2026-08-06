import sharp from "sharp";

const RASTER_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export type OptimizedUpload = {
  buffer: Buffer;
  filename: string;
  contentType: string;
};

/**
 * Convert raster uploads to optimized WebP before S3.
 * SVG is left unchanged. Animated GIF becomes a still WebP frame.
 */
export async function optimizeImageForUpload(
  file: File,
): Promise<OptimizedUpload> {
  const originalName = file.name || "image";

  if (file.type === "image/svg+xml") {
    return {
      buffer: Buffer.from(await file.arrayBuffer()),
      filename: originalName,
      contentType: "image/svg+xml",
    };
  }

  if (!RASTER_TYPES.has(file.type)) {
    throw new Error("Unsupported image type for optimization");
  }

  const input = Buffer.from(await file.arrayBuffer());
  const buffer = await sharp(input, {
    animated: false,
    limitInputPixels: 40_000_000,
  })
    .rotate()
    .resize({
      width: 2400,
      height: 2400,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({
      quality: 78,
      effort: 4,
      smartSubsample: true,
    })
    .toBuffer();

  const base =
    originalName.replace(/\.[^.]+$/, "").replace(/[^\w.-]+/g, "-") || "image";

  return {
    buffer,
    filename: `${base}.webp`,
    contentType: "image/webp",
  };
}
