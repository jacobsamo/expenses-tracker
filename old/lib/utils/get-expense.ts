import type { Expense } from "@/lib/types";

export const getExpenses = async () => {
  const response = await fetch("/api/expenses");
  if (response.ok) {
    const data = (await response.json()) as Expense[];
    return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  return null;
};
