import { VITE_BASE_URL } from "astro:env/client";
import {
  BETTER_AUTH_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "astro:env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";

export const auth = betterAuth({
  baseURL: VITE_BASE_URL,
  secret: BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "sqlite", // or "mysql", "sqlite"`
  }),

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  // https://www.better-auth.com/docs/concepts/oauth
  socialProviders: {
    google: {
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      // redirectURI: VITE_BASE_URL,
    },
  },
  onAPIError: {
    onError(error, ctx) {
      console.error("Error on API", {
        error,
        ctx,
      });
    },
  },
  // https://www.better-auth.com/docs/authentication/email-password
  // emailAndPassword: {
  //   enabled: true,
  // },
});
