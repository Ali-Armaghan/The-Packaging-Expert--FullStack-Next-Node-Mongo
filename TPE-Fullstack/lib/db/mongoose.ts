import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

global.mongooseCache = cached;

export async function connectToDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI;
  const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "packaging_expert";

  if (!MONGODB_URI) {
    throw new Error(
      "Missing MONGODB_URI. Copy .env.local.example to .env.local and set your connection string.",
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: MONGODB_DB_NAME,
        bufferCommands: false,
        serverSelectionTimeoutMS: 8000,
      })
      .catch((error) => {
        cached.promise = null;
        cached.conn = null;
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export function isDatabaseConnectionError(error: unknown) {
  if (!(error instanceof Error)) return false;
  return (
    error.name === "MongooseServerSelectionError" ||
    error.message.includes("MONGODB_URI") ||
    error.message.includes("whitelist") ||
    error.message.includes("ECONNREFUSED")
  );
}
