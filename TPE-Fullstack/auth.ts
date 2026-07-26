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
        if (!parsed.success) return null;

        try {
          await connectToDatabase();

          const user = await AdminUser.findOne({
            email: parsed.data.email.toLowerCase(),
            isActive: true,
          }).lean();

          if (!user) return null;

          const valid = await verifyPassword(
            parsed.data.password,
            user.passwordHash,
          );
          if (!valid) return null;

          // Must be plain JSON-serializable values for Auth.js JWT encryption.
          return {
            id: String(user._id),
            email: String(user.email),
            name: String(user.name),
            role: String(user.role),
            permissions: toPlainPermissions(user.permissions),
          };
        } catch (error) {
          console.error(
            "[auth] Database connection failed during login:",
            error,
          );
          return null;
        }
      },
    }),
  ],
});
