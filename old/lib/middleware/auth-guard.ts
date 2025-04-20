import { auth } from "@/lib/server/auth";
import { createMiddleware } from "@tanstack/react-start";
import { getWebRequest, setResponseStatus } from "@tanstack/react-start/server";
import { getEvent } from "vinxi/http";
import { cloudflareMiddleware } from "./cloudflare-middleware";

// https://tanstack.com/start/latest/docs/framework/react/middleware
// This is a sample middleware that you can use in your server functions.

/**
 * Middleware to force authentication on a server function, and add the user to the context.
 */
export const authMiddleware = createMiddleware()
  .middleware([cloudflareMiddleware])
  .server(async ({ next }) => {
    const { headers } = getWebRequest()!;
    const event = getEvent();
    const env = event.context.cloudflare.env;

    const authentication = auth(
      env.VITE_BASE_URL,
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      env.TURSO_CONNECTION_URL,
      env.TURSO_AUTH_TOKEN,
    );
    const session = await authentication.api.getSession({
      headers,
      query: {
        // ensure session is fresh
        // https://www.better-auth.com/docs/concepts/session-management#session-caching
        // disableCookieCache: true,
      },
    });

    if (!session) {
      setResponseStatus(401);
      throw new Error("Unauthorized");
    }

    return next({ context: { user: session.user } });
  });
