import { siteConfig } from "@/config/site";

/** Returns a safe absolute http(s) URL, or the fallback. */
export function safeAbsoluteUrl(
  value: string | null | undefined,
  fallback: string,
): string {
  const raw = (value ?? "").trim();
  if (!raw) return fallback;

  try {
    const parsed = new URL(raw);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
  } catch {
    // relative path → resolve against site origin
    if (raw.startsWith("/")) {
      try {
        return new URL(raw, siteConfig.url).toString();
      } catch {
        return fallback;
      }
    }
  }

  return fallback;
}

export function isHttpUrl(value: string | null | undefined): boolean {
  const raw = (value ?? "").trim();
  if (!raw) return false;
  if (raw.startsWith("/")) return true;
  try {
    const parsed = new URL(raw);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
