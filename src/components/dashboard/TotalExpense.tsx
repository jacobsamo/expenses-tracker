import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Expense } from "@/types"

export function TotalExpense({ expenses }: { expenses: Expense[] }) {
  const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">${totalExpense.toFixed(2)}</p>
      </CardContent>
    </Card>
  )
}

