// @ts-check
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";
import { loadEnv } from "vite";


const { MODE } = loadEnv(process.env.NODE_ENV ?? "development", process.cwd(), "");

// https://astro.build/config
export default defineConfig({
  site: "https://expenses.jacobsamo.com",
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
      configPath: 'wrangler.toml',
    },
    imageService: 'passthrough',
  }),
  output: 'server',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
      // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
      alias: MODE === "production" ? {
        "react-dom/server": "react-dom/server.edge",
      } :undefined
    },
  },
  env: {
    schema: {
      VITE_BASE_URL: envField.string({
        context: "client",
        access: "public",
        // url: true,
      }),
      BETTER_AUTH_SECRET: envField.string({
        context: "server",
        access: "secret",
      }),
      // BETTER_AUTH_URL: envField.string({
      //   context: "server",
      //   access: "public",
      //   // url: true,
      // }),
      GOOGLE_CLIENT_SECRET: envField.string({
        context: "server",
        access: "secret",
      }),
      GOOGLE_CLIENT_ID: envField.string({
        context: "server",
        access: "secret",
      }),
      GOOGLE_GENERATIVE_AI_API_KEY: envField.string({
        context: "server",
        access: "secret",
      }),
      TURSO_CONNECTION_URL: envField.string({
        context: "server",
        access: "secret",
      }),
      TURSO_AUTH_TOKEN: envField.string({
        context: "server",
        access: "secret",
      }),
      R2_BUCKET: envField.string({ context: "server", access: "secret" }),
      R2_ACCESS_KEY: envField.string({ context: "server", access: "secret" }),
      R2_ACCESS_ID: envField.string({ context: "server", access: "secret" }),
      R2_ENDPOINT: envField.string({
        context: "server",
        access: "secret",
        url: true,
      }),
      R2_PUBLIC_URL: envField.string({
        context: "server",
        access: "secret",
        url: true,
      }),
    },
  },
});
