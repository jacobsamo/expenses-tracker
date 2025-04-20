import { expensesSchema } from "@/lib/zod-schemas";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { categoryEnum } from "../schemas";

const aiExpenseSchema = z.object({
  expense: expensesSchema
    .omit({
      receiptUrl: true,
      userId: true,
      createdAt: true,
      expenseId: true,
      date: true,
    })
    .extend({
      category: z.enum(categoryEnum),
      date: z.string(),
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

export const createExpenseFromFile = async (
  receiptFile: File,
  GOOGLE_GENERATIVE_AI_API_KEY: string,
) => {
  console.log("Starting ai extraction");

  const fileArray = await fileToDataContent(receiptFile);
  const google = createGoogleGenerativeAI({
    apiKey: GOOGLE_GENERATIVE_AI_API_KEY,
  });

  const aiReq = await generateObject({
    model: google("gemini-1.5-flash-8b-latest"),
    schema: aiExpenseSchema,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Extract the expense from the receipt image, the amount is a float not an integer which is in dollars and cents, return the date as a javascript Date object",
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
    object: aiReq.object,
    dateFromObject: {
      date: aiReq.object.expense.date,
      jsDate: aiReq.object.expense.date
        ? new Date(aiReq.object.expense.date.toString())
        : null,
    },
    response: aiReq.response,
    finishReason: aiReq.finishReason,
    usage: aiReq.usage,
    warning: aiReq.warnings,
    metadata: aiReq.experimental_providerMetadata,
  });

  return {
    expense: aiReq.object.expense,
    expenseItems: null,
  };
};
