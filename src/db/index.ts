import { drizzle } from "drizzle-orm/libsql";
import { env } from "env";
import * as schema from "./schemas";

export const db = drizzle({
  connection:
    process.env.NODE_ENV === "production"
      ? {
          url: env.TURSO_CONNECTION_URL!,
          authToken: env.TURSO_AUTH_TOKEN!,
        }
      : {
          url: "http://127.0.0.1:8080",
        },
  logger: process.env.NODE_ENV === "development",
  schema,
});
