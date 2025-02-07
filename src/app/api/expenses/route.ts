import { db } from "@/db";
import { createExpenseFromReceiptUrl } from "@/db/actions/create-expense-from-receipt";
import { uploadReceipt } from "@/db/actions/upload-receipt";
import { expensesTable, itemsTable } from "@/db/schemas";
import { getSession } from "@/lib/auth/session";
import { CreateNewExpenseSchema } from "@/lib/zod-schemas";
import type { Expense, ExpenseItem, NewExpense, NewExpenseItem } from "@/types";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

export type CreateExpenseReturnType = {
  expense: Expense | null;
  expenseItems: ExpenseItem[] | null;
};

export async function POST(req: Request) {
  try {
    const session = await getSession();

    if (!session || !session.data?.user) {
      console.error("No user");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = session.data.user;
    console.log("User loged in", userId);
    const json = await req.json();
    const data = CreateNewExpenseSchema.parse(json);
    console.log("Data sent to server", data);
    if (!data.type || !data.content) {
      return NextResponse.json({
        error: "A creation type and or content needs to be provided",
      });
    }

    let newExpense: NewExpense | null = null;
    let newItems: Omit<NewExpenseItem, "expenseId" | "userId">[] | null = null;

    // Process the request based on its type
    if (data.type === "expense") {
      newExpense = { ...data.content.expense, userId };
      newItems = data.content.expenseItems ?? null;
    } else if (data.type === "receipt") {
      const receiptUrl = await uploadReceipt(data.content.receiptFile);
      const aiResult = await createExpenseFromReceiptUrl(receiptUrl);

      newExpense = { ...aiResult.expense, receiptUrl, userId };

      if (aiResult.expenseItems) {
        newItems = aiResult.expenseItems.map((item) => ({
          totalItemCost: item.totalItemCost ?? null,
          costPerItem: item.costPerItem ?? null,
          name: item.name ?? null,
          quantity: item.quantity ?? null,
        }));
      }
    }

    if (!newExpense) {
      console.error("No expense found");
      return NextResponse.json({ error: "No Expense found" }, { status: 400 });
    }

    // Insert the expense record into the database
    const [expense] = await db
      .insert(expensesTable)
      .values(newExpense)
      .returning();

    // If there are expense items, insert them as well
    let insertedItems: ExpenseItem[] | null = null;
    if (newItems) {
      insertedItems = await db
        .insert(itemsTable)
        .values(
          newItems.map((item) => ({
            ...item,
            expenseId: expense.expenseId,
            userId,
          }))
        )
        .returning();
    }

    console.log("New items", {});

    return NextResponse.json({
      expense: expense,
      expenseItems: insertedItems,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Error creating expense:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
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
