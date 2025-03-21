import { db } from "@/lib/server/db";
import { expensesTable } from "@/lib/server/db/schemas";
import { getSession } from "@/lib/session";
import { updateExpenseSchema } from "@/lib/zod-schemas";
import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { and, eq } from "drizzle-orm";

export const APIRoute = createAPIFileRoute("/api/expenses/$expenseId")({
  GET: async ({ request, params }) => {
    const session = await getSession({ headers: request.headers });

    if (!session || !session.data?.user) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    const userExpenses = await db
      .select()
      .from(expensesTable)
      .where(
        and(
          eq(expensesTable.userId, session.data.user.id),
          eq(expensesTable.expenseId, params.expenseId),
        ),
      );

    return json(userExpenses);
  },
  DELETE: async ({ request, params }) => {
    const session = await getSession({ headers: request.headers });

    if (!session || !session.data?.user) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.delete(expensesTable).where(eq(expensesTable.expenseId, params.expenseId));
    console.log(`Deleted expense with id: ${params.expenseId}`);
    return json({ message: `Deleted expense with id: ${params.expenseId}` });
  },
  PUT: async ({ request, params }) => {
    const session = await getSession({ headers: request.headers });

    if (!session || !session.data?.user) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    const j = await request.json();
    const data = updateExpenseSchema.parse(j);

    const updatedExpense = await db
      .update(expensesTable)
      .set(data.expense)
      .where(eq(expensesTable.expenseId, params.expenseId))
      .returning();

    return json({
      message: `Updated expense with id: ${params.expenseId}`,
      updatedExpense: updatedExpense,
    });
  },
});
