import { getSession } from "@/lib/session";
import {
  DEFAULT_SERVER_ERROR_MESSAGE,
  createSafeActionClient,
} from "next-safe-action";

export const actionClient = createSafeActionClient({
  handleServerError: (error, { ctx, metadata, clientInput }) => {
    console.error("An error occured", {
      error,
      ctx,
      metadata,
      clientInput,
    });
    if (error instanceof Error) {
      return error.message;
    }
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});

export const authActionClient = actionClient.use(
  async ({ next, clientInput, metadata }) => {
    const session = await getSession();

    if (!session || !session.data) {
      throw Error("Unauthorized");
    }

    return next({
      ctx: {
        session: session.data.session,
        user: session.data.user,
      },
    });
  }
);
