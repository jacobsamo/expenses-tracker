import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth-schema";
export * from "./auth-schema";
import { v4 as uuid } from "uuid";

export const expensesTable = sqliteTable("expenses", {
  expenseId: text("expense_id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => uuid()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  business: text("business"),
  category: text("category").notNull(),
  amount: integer("amount").notNull(),
  description: text("description"),
  receiptUrl: text("receipt_url"),
  date: text("date")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$type<Date>(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$type<Date>(),
});

export const expensesRelations = relations(expensesTable, ({ one }) => ({
  user: one(user, {
    fields: [expensesTable.userId],
    references: [user.id],
  }),
}));

export const usersRelations = relations(user, ({ many }) => ({
  expenses: many(expensesTable),
}));
