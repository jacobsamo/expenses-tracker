import CreateExpenseModal from "@/lib/components/modals/create-expense-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card";
import type { Expense } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export function Dashboard() {
  const { data: expenses, isLoading } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      const response = await fetch("/api/expenses");
      if (response.ok) {
        const data = (await response.json()) as Expense[];
        return data;
      }
      return null;
    },
  });

  if (isLoading) {
    return <Loader2 className="h-16 w-16 animate-spin" />;
  }

  if (!expenses && !isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Expenses Created Yet</CardTitle>
        </CardHeader>
        <CardContent>
          Create A New Expense
          <CreateExpenseModal />
        </CardContent>
      </Card>
    );
  }

  // const totalExpenses = expenses.reduce(
  //   (sum, expense) => sum + expense.amount,
  //   0
  // );
  // const expensesByCategory = expenses.reduce((acc, expense) => {
  //   acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
  //   return acc;
  // }, {} as Record<string, number>);

  // const chartData = Object.entries(expensesByCategory).map(
  //   ([category, amount]) => ({
  //     category,
  //     amount,
  //   })
  // );

  // return (
  //   <div className="space-y-4">
  //     <Card>
  //       <CardHeader>
  //         <CardTitle>Total Expenses</CardTitle>
  //       </CardHeader>
  //       <CardContent>
  //         <p className="text-3xl font-bold">${totalExpenses.toFixed(2)}</p>
  //       </CardContent>
  //     </Card>
  //     <Card>
  //       <CardHeader>
  //         <CardTitle>Expenses by Category</CardTitle>
  //       </CardHeader>
  //       <CardContent>
  //         <ResponsiveContainer width="100%" height={300}>
  //           <BarChart data={chartData}>
  //             <CartesianGrid strokeDasharray="3 3" />
  //             <XAxis dataKey="category" />
  //             <YAxis />
  //             <Tooltip />
  //             <Bar dataKey="amount" fill="#8884d8" />
  //           </BarChart>
  //         </ResponsiveContainer>
  //       </CardContent>
  //     </Card>
  //   </div>
  // );
}
