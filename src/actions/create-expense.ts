// "use server";
// import { expensesSchema } from "@/lib/zod-schemas";
// import { authActionClient } from "./safe-action";
// import { db } from "@/db";
// import { expensesTable } from "@/db/schemas";

// export const createExpense = authActionClient
//   .schema(expensesSchema)
//   .action(async ({ clientInput, ctx }) => {
//     const [newExpense] = await db
//       .insert(expensesTable)
//       .values({
//         ...clientInput,
//         userId: ctx.user.id,
//       })
//       .returning();

//     return newExpense;
//   });
