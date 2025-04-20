import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schemas";
import { TURSO_CONNECTION_URL, TURSO_AUTH_TOKEN } from "astro:env/server";

export const db = drizzle({
  connection: import.meta.env.PROD
    ? {
        url: TURSO_CONNECTION_URL,
        authToken: TURSO_AUTH_TOKEN,
      }
    : {
        url: "http://127.0.0.1:8080",
      },
  logger: process.env.NODE_ENV === "development",
  schema,
});
