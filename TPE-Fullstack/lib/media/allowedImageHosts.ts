/** Hosts allowed for remote image optimization / proxying. */
export function isAllowedImageHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return (
    host === "packaging-expert-media.s3.us-east-1.amazonaws.com" ||
    host === "packaging-expert-media.s3.amazonaws.com" ||
    host.endsWith(".amazonaws.com") ||
    host === "images.unsplash.com" ||
    host === "picsum.photos"
  );
}
