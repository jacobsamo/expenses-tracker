import { getSession } from "@/lib/auth/session";
import {
  DEFAULT_SERVER_ERROR_MESSAGE,
  createSafeActionClient,
} from "next-safe-action";

export const actionClient = createSafeActionClient({
  handleServerError: (error) => {
    if (error instanceof Error) {
      return error.message;
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});

export const authActionClient = actionClient.use(
  async ({ next, clientInput, metadata }) => {
    const session = await getSession();

    if (!session) {
      throw Error("Unauthorized");
    }

    return next();
  }
);
