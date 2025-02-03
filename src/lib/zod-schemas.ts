import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { expensesTable } from "@/db/schemas";

export const expensesSchema = createInsertSchema(expensesTable);
