import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { env } from "@/env";
import { db } from "./db";

export const auth = betterAuth({
  baseURL: env.VITE_BASE_URL,
  database: drizzleAdapter(db, {
    provider: "sqlite", // or "mysql", "sqlite"`
  }),

  // https://www.better-auth.com/docs/concepts/session-management#session-caching
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  // https://www.better-auth.com/docs/concepts/oauth
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },

  // https://www.better-auth.com/docs/authentication/email-password
  // emailAndPassword: {
  //   enabled: true,
  // },
});
