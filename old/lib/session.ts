import { authClient } from "./utils/auth-client";

export const getSession = async ({ headers }: { headers: Headers }) => {
  const session = await authClient.getSession({
    fetchOptions: {
      headers,
    },
  });

  return session;
};
