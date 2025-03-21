import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "@tanstack/react-start/config";
import { resolve } from "path";
import { cloudflare } from "unenv";
import tsConfigPaths from "vite-tsconfig-paths";
import { getCloudflareProxyEnv, isInCloudflareCI } from "./lib/cloudflare";

// disable for now as we not need to verify it works right not
// import { parseEnv } from "./lib/env";
// await parseEnv();

async function proxyCloudflareEnv() {
  if (isInCloudflareCI()) return undefined;

  const env = await getCloudflareProxyEnv();

  const viteDefine = Object.fromEntries(
    Object.entries(env)
      .filter(([key]) => key.startsWith("VITE_"))
      .map(([key, value]) => [`import.meta.env.${key}`, `"${value}"`]),
  );

  return viteDefine;
}

export default defineConfig({
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": resolve(process.cwd()),
      },
    },
    define: await proxyCloudflareEnv(),
  },
  server: {
    preset: "cloudflare-pages",
    unenv: cloudflare, // Use Cloudflare's unenv for compatibility
    rollupConfig: {
      external: ["node:async_hooks"],
    },
  },
});
