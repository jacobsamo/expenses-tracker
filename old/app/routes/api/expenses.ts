import { createDb } from "@/lib/server/db";
import { createExpenseFromFile } from "@/lib/server/db/actions/create-expense-from-file";
import { uploadReceipt } from "@/lib/server/db/actions/upload-receipt";
import { expensesTable, itemsTable } from "@/lib/server/db/schemas";
import { getSession } from "@/lib/session";
import type { Expense, ExpenseItem, NewExpense, NewExpenseItem } from "@/lib/types";
import { CreateNewExpenseSchema } from "@/lib/zod-schemas";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { eq } from "drizzle-orm";
import { getEvent } from "vinxi/http";
import { z } from "zod";

export type CreateExpenseReturnType = {
  expense: Expense | null;
  expenseItems: ExpenseItem[] | null;
};

export const APIRoute = createAPIFileRoute("/api/expenses")({
  GET: async ({ request }) => {
    const session = await getSession({ headers: request.headers });

    if (!session || !session.data?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { context } = getEvent();
    const env = context.cloudflare.env;
    const db = createDb(env.TURSO_CONNECTION_URL, env.TURSO_AUTH_TOKEN);

    const userExpenses = await db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.userId, session.data.user.id));

    return Response.json(userExpenses);
  },
  POST: async ({ request }) => {
    try {
      const session = await getSession({ headers: request.headers });

      if (!session || !session.data?.user) {
        console.error("No user");
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { id: userId } = session.data.user;
      const formData = await request.formData();

      const type = formData.get("type");
      if (!type || (type !== "expense" && type !== "receipt")) {
        return Response.json({ error: "Invalid type" }, { status: 400 });
      }

      const { context } = getEvent();
      const env = context.cloudflare.env;

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
          R2_BUCKET: env.R2_BUCKET,
          R2_ACCESS_KEY: env.R2_ACCESS_KEY,
          R2_ACCESS_ID: env.R2_ACCESS_ID,
          R2_ENDPOINT: env.R2_ENDPOINT,
          R2_PUBLIC_URL: env.R2_PUBLIC_URL,
        });
        const aiResult = await createExpenseFromFile(
          data.content.receiptFile,
          env.GOOGLE_GENERATIVE_AI_API_KEY,
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

      const db = createDb(env.TURSO_CONNECTION_URL, env.TURSO_AUTH_TOKEN);

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
  },
});
