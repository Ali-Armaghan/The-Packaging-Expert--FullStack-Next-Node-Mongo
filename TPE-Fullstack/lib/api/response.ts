import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(
  message: string,
  status = 400,
  details?: unknown,
) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(details !== undefined ? { details } : {}),
    },
    { status },
  );
}

function summarizeZodFlatten(error: ZodError) {
  const flat = error.flatten();
  const parts = Object.entries(flat.fieldErrors).flatMap(([key, messages]) =>
    (messages ?? []).slice(0, 1).map((message) => `${key}: ${message}`),
  );
  if (parts.length === 0 && flat.formErrors.length > 0) {
    return flat.formErrors[0] ?? "Validation failed";
  }
  return parts.slice(0, 4).join(" · ") || "Validation failed";
}

export function apiFromUnknownError(error: unknown) {
  if (error instanceof ZodError) {
    return apiError(summarizeZodFlatten(error), 400, error.flatten());
  }

  if (error instanceof Error) {
    if (error.message.includes("MONGODB_URI")) {
      return apiError("Database is not configured", 503, error.message);
    }
    return apiError(error.message || "Something went wrong", 500);
  }

  return apiError("Something went wrong", 500);
}
