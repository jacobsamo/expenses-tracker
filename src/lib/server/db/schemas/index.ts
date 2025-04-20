import { relations } from "drizzle-orm";
import { user } from "./auth-schema";
import { expensesTable, itemsTable } from "./expenses";

export * from "./auth-schema";
export * from "./expenses";

export const expensesRelations = relations(expensesTable, ({ one, many }) => ({
  user: one(user, {
    fields: [expensesTable.userId],
    references: [user.id],
  }),
  items: many(itemsTable),
}));

export const itemsTableRelations = relations(itemsTable, ({ one }) => ({
  expense: one(expensesTable, {
    fields: [itemsTable.expenseId],
    references: [expensesTable.expenseId],
  }),
}));

export const usersRelations = relations(user, ({ many }) => ({
  expenses: many(expensesTable),
}));
