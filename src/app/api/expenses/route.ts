import { db } from "@/db";
import { createExpenseFromReceiptUrl } from "@/db/actions/create-expense-from-receipt";
import { uploadReceipt } from "@/db/actions/upload-receipt";
import { expensesTable, itemsTable } from "@/db/schemas";
import { getSession } from "@/lib/auth/session";
import {
  CreateNewExpenseSchema,
  receiptSchema,
  createExpenseSchema,
} from "@/lib/zod-schemas";
import type { Expense, ExpenseItem, NewExpense, NewExpenseItem } from "@/types";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.union([receiptSchema, createExpenseSchema]);

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
    const formData = await req.formData();

    const type = formData.get("type");
    if (!type || (type !== "expense" && type !== "receipt")) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    let reqData;
    if (type === "receipt") {
      const receiptFile = formData.get("receiptFile");

      if (!(receiptFile instanceof Blob)) {
        return NextResponse.json(
          { error: "Invalid file type" },
          { status: 400 }
        );
      }

      reqData = { type, content: { receiptFile } };
    } else {
      const content = formData.get("content");
      if (!content) {
        return NextResponse.json({ error: "Missing content" }, { status: 400 });
      }

      reqData = { type, content: JSON.parse(content as string) };
    }

    // Validate the parsed data using Zod
    const data = CreateNewExpenseSchema.parse(reqData);

    let newExpense: NewExpense | null = null;
    let newItems: Omit<NewExpenseItem, "expenseId" | "userId">[] | null = null;

    // Process the request based on its type
    if (data.type === "expense") {
      newExpense = { ...data.content.expense, userId };
      newItems = data.content.expenseItems ?? null;
    } else if (data.type === "receipt") {
      const receiptUrl = await uploadReceipt(data.content.receiptFile);
      const aiResult = await createExpenseFromReceiptUrl(
        data.content.receiptFile
      );

      newExpense = {
        ...aiResult.expense,
        date: aiResult.expense.date
          ? new Date(aiResult.expense.date)
          : new Date(),
        receiptUrl,
        userId,
      };

      if (aiResult.expenseItems) {
        newItems = null;
        // newItems = aiResult.expenseItems.map((item) => ({
        //   totalItemCost: item.totalItemCost ?? null,
        //   costPerItem: item.costPerItem ?? null,
        //   name: item.name ?? null,
        //   quantity: item.quantity ?? null,
        // }));
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
    console.error("Error creating expense:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
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
