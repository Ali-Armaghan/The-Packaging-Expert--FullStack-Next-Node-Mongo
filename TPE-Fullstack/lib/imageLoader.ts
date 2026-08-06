type ImageLoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

/**
 * Remote (S3) → `/api/image` (longer upstream timeout).
 * Local public paths → serve as-is (custom loader cannot reliably use `/_next/image`).
 */
export default function imageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  if (/^https?:\/\//i.test(src)) {
    const params = new URLSearchParams({
      url: src,
      w: String(width),
      q: String(quality ?? 75),
    });
    return `/api/image?${params.toString()}`;
  }

  return src;
}
