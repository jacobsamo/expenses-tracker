import { expensesTable, itemsTable } from "@/db/schemas";
import type { expenseItemsSchema, expensesSchema } from "@/lib/zod-schemas";
import type { z } from "zod";

export type Expense = typeof expensesTable.$inferSelect;
export type NewExpense = z.infer<typeof expensesSchema>;
export type ExpenseItem = typeof itemsTable.$inferSelect;
export type NewExpenseItem = z.infer<typeof expenseItemsSchema>;
