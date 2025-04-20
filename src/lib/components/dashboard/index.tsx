import CreateExpenseModal from "@/lib/components/modals/create-expense-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card";
import { getExpenses } from "@/lib/utils/get-expense";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { ExpenseList } from "../expense-list";
import { ExpenseLineChart } from "./ExpenseLineChart";
import { ExpenseWeeklyChart } from "./ExpenseWeeklyChart";
import { DisplayPieChart } from "./pie-chart";
import { TotalExpense } from "./TotalExpense";

// Generate random expenses for the last 3 months
export default function Dashboard() {
  const [dateRange, setDateRange] = useState<
    { from: Date | undefined; to: Date | undefined } | undefined
  >();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const {
    data: expenses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      return await getExpenses();
    },
    // retry: false, // Don't retry on 401
  });

  const filteredExpenses = () => {
    if (!expenses) {
      return null;
    }

    return expenses;

    // if (!dateRange || dateRange.from === undefined || dateRange.to === undefined) {
    //   return expenses;
    // }

    // return expenses.filter((expense) => {
    //   const isInDateRange = dateRange
    //     ? expense.date >= dateRange.from && expense.date <= dateRange.to
    //     : true;
    //   const isInCategory = selectedCategory
    //     ? expense.category === selectedCategory
    //     : true;
    //   return isInDateRange && isInCategory;
    // });
  };

  const expensesByDate = filteredExpenses();

  if (isLoading) {
    return <Loader2 className="h-16 w-16 animate-spin" />;
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p>There was an error loading your expenses. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  if (!expensesByDate) {
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TotalExpense expenses={expensesByDate} />
        <DisplayPieChart chartTitle="Expenses by Category" expenses={expensesByDate} />

        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Expense Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpenseLineChart expenses={expensesByDate} />
          </CardContent>
        </Card>
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Weekly Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpenseWeeklyChart expenses={expensesByDate} />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Expense Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseList />
        </CardContent>
      </Card>
    </div>
  );
}

// export default function Dashboard() {
//   const { data: expenses, isLoading } = useQuery({
//     queryKey: ["expenses"],
//     queryFn: async () => {
//       const response = await fetch("/api/expenses");
//       if (response.ok) {
//         const data = (await response.json()) as Expense[];
//         return data;
//       }
//       return null;
//     },
//   });

//   if (isLoading) {
//     return <Loader2 className="h-16 w-16 animate-spin" />;
//   }

//   if (!expenses) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>No Expenses Created Yet</CardTitle>
//         </CardHeader>
//         <CardContent>
//           Create A New Expense
//           <CreateExpenseModal />
//         </CardContent>
//       </Card>
//     );
//   }

//   const totalExpenses = expenses.reduce(
//     (sum, expense) => sum + expense.amount,
//     0
//   );
//   const expensesByCategory = expenses.reduce((acc, expense) => {
//     acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
//     return acc;
//   }, {} as Record<string, number>);

//   const chartData = Object.entries(expensesByCategory).map(
//     ([category, amount]) => ({
//       category,
//       amount,
//     })
//   );

//   return (
//     <div className="space-y-4">
//       <Card>
//         <CardHeader>
//           <CardTitle>Total Expenses</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-3xl font-bold">${totalExpenses.toFixed(2)}</p>
//         </CardContent>
//       </Card>
//       <Card>
//         <CardHeader>
//           <CardTitle>Expenses by Category</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={chartData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="category" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="amount" fill="#8884d8" />
//             </BarChart>
//           </ResponsiveContainer>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
