import { db } from "@/lib/server/db";
import { expensesTable } from "@/lib/server/db/schemas";
import { getSession } from "@/lib/session";
import { updateExpenseSchema } from "@/lib/zod-schemas";
import type { APIRoute } from "astro";
import { and, eq } from "drizzle-orm";

export const GET: APIRoute = async ({ request, params }) => {
  const session = await getSession({ headers: request.headers });

  if (!session || !session?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const userExpenses = await db
    .select()
    .from(expensesTable)
    .where(
      and(
        eq(expensesTable.userId, session.user.id),
        eq(expensesTable.expenseId, params.expenseId),
      ),
    );

  return new Response(JSON.stringify(userExpenses), { status: 200 });
};

export const DELETE: APIRoute = async ({ request, params }) => {
  const session = await getSession({ headers: request.headers });

  if (!session || !session?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  await db.delete(expensesTable).where(eq(expensesTable.expenseId, params.expenseId));
  console.log(`Deleted expense with id: ${params.expenseId}`);
  return new Response(
    JSON.stringify({ message: `Deleted expense with id: ${params.expenseId}` }),
    { status: 200 },
  );
};

export const PUT: APIRoute = async ({ request, params }) => {
  const session = await getSession({ headers: request.headers });

  if (!session || !session?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const j = await request.json();
  const data = updateExpenseSchema.parse(j);

  const updatedExpense = await db
    .update(expensesTable)
    .set(data.expense)
    .where(eq(expensesTable.expenseId, params.expenseId))
    .returning();

  return new Response(
    JSON.stringify({
      message: `Updated expense with id: ${params.expenseId}`,
      updatedExpense: updatedExpense,
    }),
  );
};
