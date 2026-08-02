import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { AdminUser } from "@/models/AdminUser";

export const runtime = "nodejs";

export async function GET() {
  try {
    const dbName = process.env.MONGODB_DB_NAME || "packaging_expert";
    const seedEmail = (
      process.env.ADMIN_SEED_EMAIL || "admin@packagingexpert.com"
    )
      .trim()
      .toLowerCase();

    await connectToDatabase();

    const adminUserCount = await AdminUser.countDocuments({});
    const seedEmailExists = Boolean(
      await AdminUser.exists({ email: seedEmail, isActive: true }),
    );

    return NextResponse.json({
      ok: true,
      database: "connected",
      dbName,
      hasAuthSecret: Boolean(process.env.AUTH_SECRET),
      adminUserCount,
      seedEmail,
      seedEmailExists,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        database: "disconnected",
        hasAuthSecret: Boolean(process.env.AUTH_SECRET),
        error:
          error instanceof Error
            ? error.message
            : "Could not connect to MongoDB",
      },
      { status: 503 },
    );
  }
}
