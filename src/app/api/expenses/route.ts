import { db } from "@/db";
import { expensesTable } from "@/db/schemas";
import { getSession } from "@/lib/auth/session";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || !session.data?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { category, amount, date, description, receiptUrl } = await req.json();

  const newExpense = await db
    .insert(expensesTable)
    .values({
      userId: session.data.user.id,
      category,
      amount,
      date,
      description,
      receiptUrl,
    })
    .returning();

  return NextResponse.json(newExpense[0]);
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
