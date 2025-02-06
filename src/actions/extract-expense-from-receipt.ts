// "use server";
// import { expensesSchema } from "@/lib/zod-schemas";
// import { authActionClient } from "./safe-action";
// import { db } from "@/db";
// import { expensesTable } from "@/db/schemas";
// import { createGoogleGenerativeAI } from "@ai-sdk/google";
// import { generateObject } from "ai";
// import { env } from "env";
// import { z } from "zod";

// const schema = z.object({
//   receiptUrl: z.string(),
// });

// const aiExpenseSchema = expensesSchema.omit({
//   receiptUrl: true,
//   userId: true,
//   createdAt: true,
//   expenseId: true,
// });

// export const createExpenseFromReceiptUrl = authActionClient
//   .schema(schema)
//   .action(async ({ clientInput, ctx }) => {
//     console.log("Starting ai extraction");
//     const google = createGoogleGenerativeAI({
//       apiKey: env.GOOGLE_API_KEY,
//     });

//     const aiReq = await generateObject({
//       model: google("gemini-1.5-flash", {
//         structuredOutputs: true,
//       }),
//       schema: aiExpenseSchema,
//       messages: [
//         {
//           role: "user",
//           content: [
//             {
//               type: "text",
//               text: "Extract the expense from the receipt image",
//             },
//             {
//               type: "image",
//               image: clientInput.receiptUrl,
//             },
//           ],
//         },
//       ],
//     });

//     console.log("AI respinse", aiReq);

//     const [newExpense] = await db
//       .insert(expensesTable)
//       .values({
//         ...aiReq.object,
//         receiptUrl: clientInput.receiptUrl,
//         userId: ctx.user.id,
//       })
//       .returning();

//     console.log("Expnese created", newExpense);

//     return newExpense;
//   });
