export async function sanitizeBlogHtml(html: string): Promise<string> {
  if (!html.trim()) return "";

  try {
    const DOMPurify = (await import("isomorphic-dompurify")).default;
    return DOMPurify.sanitize(html, {
      USE_PROFILES: { html: true },
      ADD_ATTR: ["target", "rel"],
    });
  } catch {
    // Fallback if jsdom/DOMPurify fails in the Next runtime
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/\son\w+\s*=\s*(["']).*?\1/gi, "")
      .replace(/\son\w+\s*=\s*[^\s>]+/gi, "");
  }
}
