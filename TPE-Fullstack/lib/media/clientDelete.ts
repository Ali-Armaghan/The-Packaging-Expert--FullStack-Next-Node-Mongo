/** Best-effort client helper to delete media from S3 via admin API. */
export async function deleteUploadedMedia(urls: string | string[]) {
  const list = (Array.isArray(urls) ? urls : [urls])
    .map((url) => url.trim())
    .filter(Boolean);

  if (!list.length) return;

  try {
    await fetch("/api/admin/uploads", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urls: list }),
    });
  } catch {
    // UI should still clear the field; orphan cleanup can happen on entity save/delete.
  }
}
