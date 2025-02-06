import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { expensesTable, itemsTable } from "@/db/schemas";

export const expensesSchema = createInsertSchema(expensesTable);

export const expenseItemsSchema = createInsertSchema(itemsTable);
