import { auth } from "@/lib/server/auth";

export const getSession = async ({ headers }: { headers: Headers }) => {
  const session = await auth.api.getSession({
    headers: headers,
  });

  return session;
};
