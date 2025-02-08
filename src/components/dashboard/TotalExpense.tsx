import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Expense } from "@/types";

export function TotalExpense({ expenses }: { expenses: Expense[] | null }) {
  const totalExpense = expenses
    ? expenses.reduce((sum, expense) => sum + expense.amount, 0)
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        {totalExpense ? (
          <p className="text-3xl font-bold">${totalExpense.toFixed(2)}</p>
        ) : (
          <p>$0</p>
        )}
      </CardContent>
    </Card>
  );
}
