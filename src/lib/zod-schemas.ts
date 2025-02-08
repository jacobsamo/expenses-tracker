import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { expensesTable, itemsTable } from "@/db/schemas";

export const expensesSchema = createInsertSchema(expensesTable);

export const expenseItemsSchema = createInsertSchema(itemsTable);

export const nullAbleSchema = z.object({
  type: z.literal(null),
  content: z.literal(null),
});

export const createExpenseSchema = z.object({
  type: z.literal("expense"),
  content: z.object({
    expense: expensesSchema.extend({
      userId: z.string().optional(),
    }),
    expenseItems: expenseItemsSchema.array().nullish(),
  }),
});

export const receiptSchema = z.object({
  type: z.literal("receipt"),
  content: z.object({
    receiptFile: z.instanceof(File),
  }),
});

export const CreateNewExpenseSchema = z.union([
  nullAbleSchema,
  createExpenseSchema,
  receiptSchema,
]);
