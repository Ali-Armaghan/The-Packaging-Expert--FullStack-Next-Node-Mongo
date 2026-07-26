import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

function loadEnvFile(fileName: string) {
  const filePath = resolve(process.cwd(), fileName);
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split("\n")) {
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
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

async function main() {
  const { connectToDatabase } = await import("../lib/db/mongoose");
  try {
    await connectToDatabase();
    console.log("MongoDB connection: OK");
    process.exit(0);
  } catch (error) {
    console.error("MongoDB connection: FAILED");
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
