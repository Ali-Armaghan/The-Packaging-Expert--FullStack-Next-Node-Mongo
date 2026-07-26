import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    permissions?: string[];
  }

  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: string;
      permissions: string[];
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    /** JSON stringified string[] — avoids DataCloneError in JWT encrypt */
    permissionsJson?: string;
    permissions?: string[];
  }
}
