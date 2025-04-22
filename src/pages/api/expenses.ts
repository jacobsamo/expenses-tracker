import { db } from "@/lib/server/db";
import { createExpenseFromFile } from "@/lib/server/db/actions/create-expense-from-file";
import { uploadReceipt } from "@/lib/server/db/actions/upload-receipt";
import { expensesTable, itemsTable } from "@/lib/server/db/schemas";
import type { ExpenseItem, NewExpense, NewExpenseItem } from "@/lib/types";
import { CreateNewExpenseSchema } from "@/lib/zod-schemas";
import type { APIContext, APIRoute } from "astro";
import {
  GOOGLE_GENERATIVE_AI_API_KEY,
  R2_ACCESS_ID,
  R2_ACCESS_KEY,
  R2_BUCKET,
  R2_ENDPOINT,
  R2_PUBLIC_URL,
} from "astro:env/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const GET: APIRoute = async (context: APIContext) => {
  try {
    const { locals } = context;

    if (!locals.session || !locals?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const userExpenses = await db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.userId, locals.user.id));

    return Response.json(userExpenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export const POST: APIRoute = async (context: APIContext) => {
  try {
    const { request, locals } = context;

    if (!locals.session || !locals?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { id: userId } = locals.user;
    const formData = await request.formData();

    const type = formData.get("type");
    if (!type || (type !== "expense" && type !== "receipt")) {
      return Response.json({ error: "Invalid type" }, { status: 400 });
    }

    let reqData;
    if (type === "receipt") {
      const receiptFile = formData.get("receiptFile");

      if (!(receiptFile instanceof Blob)) {
        return Response.json({ error: "Invalid file type" }, { status: 400 });
      }

      reqData = { type, content: { receiptFile } };
    } else {
      const content = formData.get("content");
      if (!content) {
        return Response.json({ error: "Missing content" }, { status: 400 });
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
      const receiptUrl = await uploadReceipt(data.content.receiptFile, {
        R2_BUCKET: R2_BUCKET,
        R2_ACCESS_KEY: R2_ACCESS_KEY,
        R2_ACCESS_ID: R2_ACCESS_ID,
        R2_ENDPOINT: R2_ENDPOINT,
        R2_PUBLIC_URL: R2_PUBLIC_URL,
      });
      const aiResult = await createExpenseFromFile(
        data.content.receiptFile,
        GOOGLE_GENERATIVE_AI_API_KEY,
      );

      newExpense = {
        ...aiResult.expense,
        date: aiResult.expense.date
          ? new Date(aiResult.expense.date.toString())
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
      return Response.json({ error: "No Expense found" }, { status: 400 });
    }
    // Insert the expense record into the database
    const [expense] = await db.insert(expensesTable).values(newExpense).returning();

    // revalidateTag("expenses");

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
          })),
        )
        .returning();
      // revalidateTag("expense-items");
    }

    return Response.json({
      expense: expense,
      expenseItems: insertedItems,
    });
  } catch (error) {
    console.error("Error creating expense:", error);

    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors }, { status: 400 });
    }
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
