import { drizzle } from "drizzle-orm/libsql";
import { env } from "env";
import * as schema from "./schemas";

export const db = drizzle({
  connection: {
    url: env.TURSO_CONNECTION_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
  logger: process.env.NODE_ENV === "development",
  schema,
});
