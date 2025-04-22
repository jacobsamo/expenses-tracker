// eslint-disable-next-line @typescript-eslint/no-require-imports
require("dotenv").config();
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/server/db/schemas",
  out: "./drizzle/migrations",
  dialect: "turso",
  dbCredentials:
    process.env.NODE_ENV === "production"
      ? {
          url: process.env.TURSO_CONNECTION_URL!,
          authToken: process.env.TURSO_AUTH_TOKEN!,
        }
      : {
          url: "http://127.0.0.1:8080",
        },
  // dbCredentials: {
  //   url: process.env.TURSO_CONNECTION_URL!,
  //   authToken: process.env.TURSO_AUTH_TOKEN!,
  // },
});
