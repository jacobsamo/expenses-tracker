import { expenseItemsSchema, expensesSchema } from "@/lib/zod-schemas";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { env } from "env";
import { z } from "zod";

const aiExpenseSchema = z.object({
  expense: expensesSchema
    .omit({
      receiptUrl: true,
      userId: true,
      createdAt: true,
      expenseId: true,
    })
    .extend({
      category: z.enum([
        "fuel",
        "groceries",
        "food",
        "activities",
        "accommodation",
        "going-out",
      ]),
    }),
  items: expenseItemsSchema
    .omit({
      expenseId: true,
      itemId: true,
      createdAt: true,
      userId: true,
    })
    .array()
    .optional(),
});

export const createExpenseFromReceiptUrl = async (receiptUrl: string) => {
  console.log("Starting ai extraction");
  const google = createGoogleGenerativeAI({
    apiKey: env.GOOGLE_API_KEY,
  });

  const aiReq = await generateObject({
    model: google("gemini-1.5-flash", {
      structuredOutputs: true,
    }),
    schema: aiExpenseSchema,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Extract the expense from the receipt image",
          },
          {
            type: "image",
            image: receiptUrl,
          },
        ],
      },
    ],
  });

  console.log("Ai return result", {
    ...aiReq,
  });

  return {
    expense: aiReq.object.expense,
    expenseItems: aiReq.object.items ?? null,
  };
};
