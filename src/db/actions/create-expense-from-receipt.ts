import { expenseItemsSchema, expensesSchema } from "@/lib/zod-schemas";
import { createGoogleGenerativeAI, google } from "@ai-sdk/google";
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
  // items: expenseItemsSchema
  //   .omit({
  //     expenseId: true,
  //     itemId: true,
  //     createdAt: true,
  //     userId: true,
  //   })
  //   .array()
  //   .nullable(),
});

export const fileToDataContent = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  return new Uint8Array(arrayBuffer);
};

export const createExpenseFromReceiptUrl = async (receiptFile: File) => {
  console.log("Starting ai extraction");

  const fileArray = await fileToDataContent(receiptFile);

  const aiReq = await generateObject({
    model: google("gemini-1.5-flash"),
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
            image: fileArray,
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
    expenseItems: null,
  };
};
