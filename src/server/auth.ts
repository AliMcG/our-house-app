import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { env } from "@/env";
import { db } from "@/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      token: string
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  /**
   * AliMcG's hacky attempt to use events or callbacks to log sign-in info
   * for debugging invite acceptance flow.
   * @see https://next-auth.js.org/configuration/events
   * The hope is to be able to add a token/ inviteToken to the session
   * when the user signs in so that we can use it in the
   * google-invite-callback route to identify the invite being accepted.
   */
  // events: {
  //   async signIn(message) {
  //     console.log("User signed in:", message);
  //   },
  // },
  // C:\Code\our-house-app\node_modules\next-auth\src\core\types.ts
  // C:\Code\our-house-app\node_modules\next-auth\core\types.d.ts
  callbacks: {
    //  jwt: ({ token, user, account, profile, trigger }) => {
    //   console.log("JWT signIn callback:", { token, user, account, profile });
    //   if (trigger === "signIn") {
    //     console.log("JWT signIn callback:", { token, user, account, profile });
    //   }
    //   if (user) {
    //     token.id = user.id;
    //     token.email = user.email;
    //   }
    //   return token;
    // },
    session: ({ session, user, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        token: token
      },
      
    }),

  },
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
