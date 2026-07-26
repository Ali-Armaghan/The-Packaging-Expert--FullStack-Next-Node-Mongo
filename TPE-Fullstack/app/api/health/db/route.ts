import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json({ ok: true, database: "connected" });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        database: "disconnected",
        error:
          error instanceof Error
            ? error.message
            : "Could not connect to MongoDB",
        hint: "In MongoDB Atlas → Network Access, allow your current IP (or 0.0.0.0/0 for testing), wait 1-2 minutes, then retry.",
      },
      { status: 503 },
    );
  }
}
