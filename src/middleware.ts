import { auth } from "@/lib/server/auth";
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  // const isAuthed = await auth.api.getSession({
  //   headers: context.request.headers,
  // });

  // // // Set user and session in locals
  // if (isAuthed) {
  //   context.locals.user = isAuthed.user;
  //   context.locals.session = isAuthed.session;
  // } else {
  //   context.locals.user = null;
  //   context.locals.session = null;
  // }

  // const path = context.url.pathname;

  // // Allow all requests to /api/auth/* regardless of auth status
  // if (path.startsWith("/api/auth/")) {
  //   return next();
  // }

  // // For API requests, don't redirect, just return 401
  // if (path.startsWith("/api/")) {
  //   // if (!isAuthed) {
  //   //   return new Response(JSON.stringify({ error: "Unauthorized" }), {
  //   //     status: 401,
  //   //     headers: {
  //   //       "Content-Type": "application/json",
  //   //     },
  //   //   });
  //   // }
  //   return next();
  // }

  // if (!isAuthed) {
  //   return next()
  // }

  // // If user is authenticated and trying to access /login, redirect to home
  // if (isAuthed && path === "/login") {
  //   return Response.redirect(new URL("/", context.url), 302);
  // }

  // // If user is not authenticated and trying to access protected routes, redirect to login
  // if (!isAuthed && path !== "/login") {
  //   return Response.redirect(new URL("/login", context.url), 302);
  // }

  return next();
});
