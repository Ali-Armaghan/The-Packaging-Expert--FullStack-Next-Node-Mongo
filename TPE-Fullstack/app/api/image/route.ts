import sharp from "sharp";
import { isAllowedImageHost } from "@/lib/media/allowedImageHosts";

export const runtime = "nodejs";

const MAX_WIDTH = 3840;
const FETCH_TIMEOUT_MS = 25_000;

function badRequest(message: string) {
  return new Response(message, { status: 400 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url");
  const widthRaw = Number(searchParams.get("w") || 0);
  const qualityRaw = Number(searchParams.get("q") || 75);

  if (!rawUrl) return badRequest("Missing url");

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return badRequest("Invalid url");
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return badRequest("Invalid protocol");
  }

  if (!isAllowedImageHost(parsed.hostname)) {
    return badRequest("Host not allowed");
  }

  const width = Math.min(
    MAX_WIDTH,
    Math.max(16, Number.isFinite(widthRaw) ? Math.round(widthRaw) : 1080),
  );
  const quality = Math.min(
    100,
    Math.max(30, Number.isFinite(qualityRaw) ? Math.round(qualityRaw) : 75),
  );

  let upstream: Response;
  try {
    upstream = await fetch(parsed.toString(), {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      redirect: "follow",
      headers: { Accept: "image/*,*/*" },
    });
  } catch {
    return new Response("Upstream image timed out", { status: 504 });
  }

  if (!upstream.ok) {
    return new Response("Upstream image fetch failed", {
      status: upstream.status === 404 ? 404 : 502,
    });
  }

  const contentType = upstream.headers.get("content-type") || "";
  if (contentType.includes("svg")) {
    const svg = await upstream.arrayBuffer();
    return new Response(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=2592000, immutable",
      },
    });
  }

  const input = Buffer.from(await upstream.arrayBuffer());
  const accept = request.headers.get("accept") || "";
  const preferAvif = accept.includes("image/avif");

  try {
    const pipeline = sharp(input, {
      animated: false,
      limitInputPixels: 40_000_000,
    })
      .rotate()
      .resize({
        width,
        fit: "inside",
        withoutEnlargement: true,
      });

    const { data, info } = preferAvif
      ? await pipeline.avif({ quality, effort: 3 }).toBuffer({ resolveWithObject: true })
      : await pipeline.webp({ quality, effort: 4 }).toBuffer({ resolveWithObject: true });

    return new Response(new Uint8Array(data), {
      status: 200,
      headers: {
        "Content-Type": preferAvif ? "image/avif" : "image/webp",
        "Cache-Control": "public, max-age=2592000, immutable",
        "Content-Length": String(info.size),
      },
    });
  } catch {
    return new Response("Failed to optimize image", { status: 500 });
  }
}
