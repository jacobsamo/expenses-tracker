import { auth } from "@/lib/server/auth";
import type { APIRoute } from "astro";

export const ALL: APIRoute = async (ctx) => {
  console.log("Hit API endpoint", {
    url: ctx.request.url,
    // env: import.meta.env,
    method: ctx.request.method,
  });
  return auth.handler(ctx.request);
};
