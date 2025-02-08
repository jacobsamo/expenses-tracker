import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import type { Expense } from "@/types";

export function ExpenseBarChart({ expenses }: { expenses: Expense[] }) {
  // const dailyExpenses = expenses.reduce((acc, expense) => {
  //   const date = expense.date.toString().split("T")[0];
  //   acc[date] = (acc[date] || 0) + expense.amount;
  //   return acc;
  // }, {} as Record<string, number>);

  // const data = Object.entries(dailyExpenses).map(([date, amount]) => ({
  //   date,
  //   amount,
  // }));

  // return (
  //   <ResponsiveContainer width="100%" height={300}>
  //     <BarChart
  //       data={data}
  //       margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
  //     >
  //       <XAxis dataKey="date" />
  //       <YAxis />
  //       <Tooltip />
  //       <Bar dataKey="amount" fill="hsl(var(--primary))" />
  //     </BarChart>
  //   </ResponsiveContainer>
  // );

  return <></>
}
