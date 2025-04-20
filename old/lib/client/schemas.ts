import { z } from "zod";

// Base schemas that don't depend on server code
export const expenseBaseSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  amount: z.number(),
  date: z.coerce.date(),
  category: z.string(),
  description: z.string().optional(),
  userId: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const expenseItemBaseSchema = z.object({
  id: z.string().optional(),
  expenseId: z.string().optional(),
  name: z.string(),
  amount: z.number(),
  quantity: z.number(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const nullAbleSchema = z.object({
  type: z.literal(null),
  content: z.literal(null),
});

export const createExpenseSchema = z.object({
  type: z.literal("expense"),
  content: z.object({
    expense: expenseBaseSchema,
    expenseItems: expenseItemBaseSchema.array().nullish(),
  }),
});

export const updateExpenseSchema = z.object({
  expense: expenseBaseSchema,
  expenseItems: expenseItemBaseSchema.array().nullish(),
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
