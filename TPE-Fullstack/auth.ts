import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { authConfig } from "@/auth.config";
import { connectToDatabase } from "@/lib/db/mongoose";
import { verifyPassword } from "@/lib/auth/password";
import { AdminUser } from "@/models/AdminUser";

const credentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

function toPlainPermissions(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(String);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          console.error("[auth] Invalid credentials payload");
          return null;
        }

        const email = parsed.data.email.toLowerCase();

        try {
          await connectToDatabase();

          const user = await AdminUser.findOne({
            email,
            isActive: true,
          }).lean();

          if (!user) {
            console.error(
              `[auth] No active admin for ${email} in db=${process.env.MONGODB_DB_NAME || "packaging_expert"}`,
            );
            return null;
          }

          const valid = await verifyPassword(
            parsed.data.password,
            user.passwordHash,
          );
          if (!valid) {
            console.error(`[auth] Bad password for ${email}`);
            return null;
          }

          // Must be plain JSON-serializable values for Auth.js JWT encryption.
          return {
            id: String(user._id),
            email: String(user.email),
            name: String(user.name),
            role: String(user.role),
            permissions: toPlainPermissions(user.permissions),
          };
        } catch (error) {
          console.error("[auth] Login authorize failed:", error);
          return null;
        }
      },
    }),
  ],
});
