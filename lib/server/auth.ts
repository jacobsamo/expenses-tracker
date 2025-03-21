import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createDb } from "./db";

export const auth = (
  baseUrl: string,
  googleClientId: string,
  googleClientSecret: string,
  connectionUrl: string,
  authToken: string,
) => {
  const db = createDb(connectionUrl, authToken);

  return betterAuth({
    baseURL: baseUrl,
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
        clientId: googleClientId,
        clientSecret: googleClientSecret,
      },
    },

    // https://www.better-auth.com/docs/authentication/email-password
    // emailAndPassword: {
    //   enabled: true,
    // },
  });
};
