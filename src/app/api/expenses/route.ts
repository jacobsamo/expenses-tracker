import { db } from "@/db";
import { createExpenseFromReceiptUrl } from "@/db/actions/create-expense-from-receipt";
import { uploadReceipt } from "@/db/actions/upload-receipt";
import { expensesTable, itemsTable } from "@/db/schemas";
import { getSession } from "@/lib/auth/session";
import { expenseItemsSchema, expensesSchema } from "@/lib/zod-schemas";
import type { Expense, ExpenseItem } from "@/types";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

const createExpenseSchema = z.object({
  type: z.literal("expense"),
  content: z.object({
    expense: expensesSchema,
    expenseItems: expenseItemsSchema.array().nullable(),
  }),
});

const receiptSchema = z.object({
  type: z.literal("receipt"),
  content: z.object({
    receiptFile: z.instanceof(File),
  }),
});

const CreateNewExpenseSchema = z.union([createExpenseSchema, receiptSchema]);

export type CreateExpenseReturnType = {
  expense: Expense | null;
  expenseItems: ExpenseItem[] | null;
};

export async function POST(req: Request) {
  const session = await getSession();

  if (!session || !session.data?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await req.json();
  const data = CreateNewExpenseSchema.parse(json);
  let newExpense: Expense | null = null;
  let newItems: ExpenseItem[] | null = null;

  switch (data.type) {
    case "receipt":
      const receiptUrl = await uploadReceipt(data.content.receiptFile);
      const generateAiExpense = await createExpenseFromReceiptUrl(receiptUrl);

      const [expense] = await db
        .insert(expensesTable)
        .values({
          ...generateAiExpense.expense,
          receiptUrl: receiptUrl,
          userId: session.data.user.id,
        })
        .returning();
      newExpense = expense;

      if (generateAiExpense.expenseItems) {
        newItems = await db
          .insert(itemsTable)
          .values(
            generateAiExpense.expenseItems.map((item) => {
              return {
                expenseId: expense.expenseId,
                userId: session.data.user.id,
                totalItemCost: item.totalItemCost ?? null,
                costPerItem: item.costPerItem ?? null,
                name: item.name ?? null,
                quantity: item.quantity ?? null,
              };
            })
          )
          .returning();
      }
      break;
    case "expense":
      const [ex] = await db
        .insert(expensesTable)
        .values({
          ...data.content.expense,
          userId: session.data.user.id,
        })
        .returning();
      newExpense = ex;

      if (data.content.expenseItems) {
        newItems = await db
          .insert(itemsTable)
          .values(
            data.content.expenseItems.map((item) => {
              return {
                ...item,
                expenseId: expense.expenseId,
                userId: session.data.user.id,
              };
            })
          )
          .returning();
      }
      break;
    default:
      return NextResponse.json({ error: "No type set" }, { status: 401 });
  }

  if (data.type == "receipt") {
  }

  return NextResponse.json({
    expense: newExpense,
    expenseItems: newItems,
  });
}

export async function GET(req: Request) {
  const session = await getSession();
  if (!session || !session.data?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userExpenses = await db
    .select()
    .from(expensesTable)
    .where(eq(expensesTable.userId, session.data.user.id));

  return NextResponse.json(userExpenses);
}
