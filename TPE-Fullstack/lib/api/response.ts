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

export function apiFromUnknownError(error: unknown) {
  if (error instanceof ZodError) {
    return apiError("Validation failed", 400, error.flatten());
  }

  if (error instanceof Error) {
    if (error.message.includes("MONGODB_URI")) {
      return apiError("Database is not configured", 503, error.message);
    }
    return apiError(error.message || "Something went wrong", 500);
  }

  return apiError("Something went wrong", 500);
}
