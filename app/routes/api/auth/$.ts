import { auth } from "@/lib/server/auth";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { getEvent } from "vinxi/http";

export const APIRoute = createAPIFileRoute("/api/auth/$")({
  GET: ({ request }) => {
    const { context } = getEvent();
    const env = context.cloudflare.env;

    const authentication = auth(
      env.VITE_BASE_URL,
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      env.TURSO_CONNECTION_URL,
      env.TURSO_AUTH_TOKEN,
    );
    return authentication.handler(request);
  },
  POST: ({ request }) => {
    const event = getEvent();
    const env = event.context.cloudflare.env;

    const authentication = auth(
      env.VITE_BASE_URL,
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      env.TURSO_CONNECTION_URL,
      env.TURSO_AUTH_TOKEN,
    );
    return authentication.handler(request);
  },
});
