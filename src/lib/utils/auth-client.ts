import { VITE_BASE_URL } from "astro:env/client";
import {
  createAuthClient as createVanillaAuthClient,
  type ClientOptions,
} from "better-auth/client";
import { createAuthClient as createReactAuthClient } from "better-auth/react";

const authConfig: ClientOptions = {
  baseURL: VITE_BASE_URL,
  
};

export const reactAuthClient = createReactAuthClient(authConfig);

export const vanillaAuthClient = createVanillaAuthClient(authConfig);
