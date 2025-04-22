// import { auth } from "@/lib/server/auth";
// import type { APIContext, MiddlewareNext } from "astro";
// import { sequence } from "astro:middleware";

// const authMiddleware = async (context: APIContext, next: MiddlewareNext) => {

//   const isAuthed = await auth.api.getSession({
//     headers: context.request.headers,
//   });

//   if (isAuthed) {
//     context.locals.user = isAuthed.user;
//     context.locals.session = isAuthed.session;
//     return await next();
//   }

//   context.locals.user = null;
//   context.locals.session = null;

//   return await next();
// };

// const protectRoutes = async (context: APIContext, next: MiddlewareNext) => {
//   const isAuthed = context.locals.session;
//   const path = context.url.pathname;

//   if (!isAuthed && path === "/") {
//     return context.rewrite(
//       new Request("/login", {
//         headers: {
//           "x-redirect-to": context.url.pathname,
//         },
//       }),
//     );
//   }

//   return await next();
// };

// export const onRequest = sequence(authMiddleware, protectRoutes);

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
