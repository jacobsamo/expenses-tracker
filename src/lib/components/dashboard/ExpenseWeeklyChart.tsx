import type { Expense } from "@/lib/types";
import { endOfWeek, format, startOfWeek } from "date-fns";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function ExpenseWeeklyChart({ expenses }: { expenses: Expense[] }) {
  const weeklyExpenses = expenses.reduce(
    (acc, expense) => {
      const weekStart = startOfWeek(expense.date);
      const weekEnd = endOfWeek(expense.date);
      const weekKey = `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d")}`;

      if (!acc[weekKey]) {
        acc[weekKey] = 0;
      }
      acc[weekKey] += expense.amount;
      return acc;
    },
    {} as Record<string, number>,
  );

  const data = Object.entries(weeklyExpenses)
    .map(([week, amount]) => ({ week, amount }))
    .sort(
      (a, b) =>
        new Date(a.week.split(" - ")[0]).getTime() -
        new Date(b.week.split(" - ")[0]).getTime(),
    );

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="amount" fill="var(--primary)" />
      </BarChart>
    </ResponsiveContainer>
  );
}
