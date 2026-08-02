import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

function loadEnvFile(fileName: string) {
  const filePath = resolve(process.cwd(), fileName);
  if (!existsSync(filePath)) return;

  const content = readFileSync(filePath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

async function main() {
  const { connectToDatabase } = await import("../lib/db/mongoose");
  const { getAllPermissionIds } = await import("../lib/auth/permissions");
  const { hashPassword } = await import("../lib/auth/password");
  const { AdminUser } = await import("../models/AdminUser");

  const email = (process.env.ADMIN_SEED_EMAIL || "admin@packagingexpert.com")
    .trim()
    .toLowerCase();
  const password = process.env.ADMIN_SEED_PASSWORD || "Admin@12345";
  const name = process.env.ADMIN_SEED_NAME || "Super Admin";

  await connectToDatabase();

  const existing = await AdminUser.findOne({ email });
  if (existing) {
    existing.role = "superadmin";
    existing.permissions = [];
    existing.isActive = true;
    existing.name = name;
    existing.passwordHash = await hashPassword(password);
    await existing.save();
    console.log(`Updated superadmin: ${email}`);
  } else {
    await AdminUser.create({
      name,
      email,
      passwordHash: await hashPassword(password),
      role: "superadmin",
      permissions: [],
      isActive: true,
    });
    console.log(`Created superadmin: ${email}`);
  }

  console.log(`Login email: ${email}`);
  console.log(`Login password: ${password}`);
  console.log(`Permission ids: ${getAllPermissionIds().join(", ")}`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
