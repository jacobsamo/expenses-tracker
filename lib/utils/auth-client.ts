import { createAuthClient } from "better-auth/react";
import { env } from "env";

export const authClient = createAuthClient({
  baseURL: env.VITE_BASE_URL,
});

export const { signIn, signOut, signUp, useSession } = authClient;

