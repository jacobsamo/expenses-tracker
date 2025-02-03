import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance
import { nextCookies } from "better-auth/next-js";
import { env } from "env";

export * from "./client";

export const auth = betterAuth({
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID!,
      clientSecret: env.GOOGLE_CLIENT_SECRET!,
    },
  },
  emailVerification: {},
  plugins: [nextCookies()],
  database: drizzleAdapter(db, {
    provider: "sqlite", // or "mysql", "sqlite"`
  }),
});
