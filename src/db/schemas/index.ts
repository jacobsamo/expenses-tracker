import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuid } from "uuid";
import { user } from "./auth-schema";
export * from "./auth-schema";

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

export const itemsTable = sqliteTable("items", {
  itemId: text("item_id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => uuid()),
  expenseId: text("expense_id")
    .notNull()
    .references(() => expensesTable.expenseId),
  totalItemCost: integer("total_item_cost"),
  quantity: integer("quantity"),
  costPerItem: integer("cost_per_item"),
  name: text("name"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$type<Date>(),
});

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
