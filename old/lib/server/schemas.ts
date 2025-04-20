import { expensesTable, itemsTable } from "@/lib/server/db/schemas";
import { createInsertSchema } from "drizzle-zod";

export const expensesSchema = createInsertSchema(expensesTable);
export const expenseItemsSchema = createInsertSchema(itemsTable);
