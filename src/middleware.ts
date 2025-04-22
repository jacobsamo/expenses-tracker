import { auth } from "@/lib/server/auth";
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const path = context.url.pathname;

  if (path.startsWith("/api/auth")) return next();

  const isAuthed = await auth.api.getSession({
    headers: context.request.headers,
  });

  if (isAuthed) {
    context.locals.user = isAuthed.user;
    context.locals.session = isAuthed.session;
  } else {
    context.locals.user = null;
    context.locals.session = null;
  }

  if (!isAuthed && path === "/") {
    return context.rewrite(
      new Request("/login", {
        headers: {
          "x-redirect-to": context.url.pathname,
        },
      }),
    );
  }

  if (isAuthed && path === "/login") {
    return context.rewrite(new Request("/"));
  }

  return next();
});
