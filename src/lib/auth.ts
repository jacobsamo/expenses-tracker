import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance
import { nextCookies } from "better-auth/next-js";
import { env } from "env";

export const auth = betterAuth({
  appName: "Expenses Tracker",
  baseURL: env.NEXT_PUBLIC_APP_URL,
  socialProviders: {
    google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET
    }
  },
  plugins: [nextCookies()],
  database: drizzleAdapter(db, {
    provider: "sqlite", // or "mysql", "sqlite"`
  }),
  logger: console,
  //   onAPIError: () => {
  //     console.error("API Error", error, ctx);
  //   },
});
