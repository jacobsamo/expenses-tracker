import { auth } from "@/lib/server/auth";
import type { APIRoute } from "astro";

// export const ALL: APIRoute = async (ctx) => {
//   return auth.handler(ctx.request);
// };

export const GET: APIRoute = async (ctx) => {
  return auth.handler(ctx.request);
};

export const POST: APIRoute = async (ctx) => {
  return auth.handler(ctx.request);
};