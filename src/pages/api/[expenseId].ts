import { db } from "@/lib/server/db";
import { expensesTable } from "@/lib/server/db/schemas";
import { updateExpenseSchema } from "@/lib/zod-schemas";
import type { APIContext, APIRoute } from "astro";
import { and, eq } from "drizzle-orm";

export const GET = async (context: APIContext) => {
  const { params, locals } = context;

  if (!locals.session || !locals?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  if (!params.expenseId) {
    return Response.json(
      {
        message: "No expenseId provided",
      },
      {
        status: 400,
      },
    );
  }

  const userExpenses = await db
    .select()
    .from(expensesTable)
    .where(
      and(
        eq(expensesTable.userId, locals.user.id),
        eq(expensesTable.expenseId, params.expenseId),
      ),
    );

  return new Response(JSON.stringify(userExpenses), { status: 200 });
};

export const DELETE: APIRoute = async (context: APIContext) => {
  const { params, locals } = context;

  if (!locals.session || !locals?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  if (!params.expenseId) {
    return Response.json(
      {
        message: "No expenseId provided",
      },
      {
        status: 400,
      },
    );
  }

  await db.delete(expensesTable).where(eq(expensesTable.expenseId, params.expenseId));
  console.log(`Deleted expense with id: ${params.expenseId}`);
  return new Response(
    JSON.stringify({ message: `Deleted expense with id: ${params.expenseId}` }),
    { status: 200 },
  );
};

export const PUT: APIRoute = async (context: APIContext) => {
  const { params, request, locals } = context;

  if (!locals.session || !locals?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  if (!params.expenseId) {
    return Response.json(
      {
        message: "No expenseId provided",
      },
      {
        status: 400,
      },
    );
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
