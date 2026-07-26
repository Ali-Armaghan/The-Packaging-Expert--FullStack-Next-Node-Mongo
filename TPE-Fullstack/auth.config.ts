import type { NextAuthConfig } from "next-auth";

function toPlainPermissions(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(String);
}

export const authConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = String(user.id ?? "");
        token.role = String(user.role ?? "admin");
        // Store as JSON string — Auth.js JWT encrypt cannot clone some array types.
        token.permissionsJson = JSON.stringify(
          toPlainPermissions(user.permissions),
        );
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? "");
        session.user.role = String(token.role ?? "admin");
        try {
          session.user.permissions = toPlainPermissions(
            JSON.parse(String(token.permissionsJson ?? "[]")),
          );
        } catch {
          session.user.permissions = [];
        }
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
