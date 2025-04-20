import type { CloudflareEnv } from "@/lib/cloudflare";
import { createMiddleware } from "@tanstack/react-start";

export const cloudflareMiddleware = createMiddleware().server(async ({ next }) => {
  if (import.meta.env.DEV) {
    const { getPlatformProxy } = await import("wrangler");
    const proxy = await getPlatformProxy<CloudflareEnv>();

    const result = await next({
      context: {
        cloudflare: proxy.env,
      },
    });

    await proxy.dispose();

    return result;
  }

  return next({
    context: {
      cloudflare: globalThis.process.env as unknown as CloudflareEnv,
    },
  });
});
