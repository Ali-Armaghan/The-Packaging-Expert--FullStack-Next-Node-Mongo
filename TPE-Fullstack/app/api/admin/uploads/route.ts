import { apiError, apiFromUnknownError, apiSuccess } from "@/lib/api/response";
import { requireAnyAdminPermission } from "@/lib/auth/session";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_UPLOAD_BYTES,
  uploadToS3,
} from "@/lib/s3";

export async function POST(request: Request) {
  try {
    const { error, session } = await requireAnyAdminPermission();
    if (error || !session) return error!;

    const formData = await request.formData();
    const file = formData.get("file");
    const folderRaw = formData.get("folder");
    const folder =
      typeof folderRaw === "string" && folderRaw.trim()
        ? folderRaw.trim()
        : "uploads";

    if (!(file instanceof File)) {
      return apiError("No file provided", 400);
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return apiError(
        "Unsupported file type. Use JPG, PNG, WEBP, GIF, or SVG.",
        400,
      );
    }

    if (file.size <= 0 || file.size > MAX_UPLOAD_BYTES) {
      return apiError("File must be under 5MB", 400);
    }

    const uploaded = await uploadToS3({
      file,
      filename: file.name || "image.png",
      contentType: file.type,
      folder,
    });

    return apiSuccess(uploaded, 201);
  } catch (error) {
    return apiFromUnknownError(error);
  }
}
