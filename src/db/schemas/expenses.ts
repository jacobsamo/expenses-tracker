import { sql } from "drizzle-orm";
import { real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuid } from "uuid";
import { user } from "./auth-schema";

export const categoryEnum = [
  "fuel",
  "groceries",
  "food",
  "activities",
  "accommodation",
  "going-out",
] as const;

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
  amount: real("amount").notNull(),
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
  totalItemCost: real("total_item_cost"),
  quantity: real("quantity"),
  costPerItem: real("cost_per_item"),
  name: text("name"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$type<Date>(),
});

// export const businessesTable = sqliteTable("business", {
//   businessId: text("business_id")
//     .primaryKey()
//     .notNull()
//     .$defaultFn(() => uuid()),
//   name: text("name").notNull(),
//   category: text("category").notNull(),
//   createdAt: text("created_at")
//     .notNull()
//     .default(sql`(CURRENT_TIMESTAMP)`)
//     .$type<Date>(),
// });

// export const businessLinkTable = sqliteTable("business_link", {
//   businessLinkId: text("business_link_id")
//     .primaryKey()
//     .notNull()
//     .$defaultFn(() => uuid()),
//   businessId: text("business_id")
//     .notNull()
//     .references(() => businessesTable.businessId),
//   expenseId: text("expense_id")
//     .notNull()
//     .references(() => expensesTable.expenseId),
//   userId: text("user_id")
//     .notNull()
//     .references(() => user.id),
// });

// export const categoryTable = sqliteTable("category", {
//   categoryId: text("category_id")
//     .primaryKey()
//     .notNull()
//     .$defaultFn(() => uuid()),
//   name: text("name").notNull(),
//   userId: text("user_id")
//     .notNull()
//     .references(() => user.id),
//   createdAt: text("created_at")
//     .notNull()
//     .default(sql`(CURRENT_TIMESTAMP)`)
//     .$type<Date>(),
// });

// export const categoryLinkTable = sqliteTable("category_link", {
//   businessLinkId: text("category_link_id")
//     .primaryKey()
//     .notNull()
//     .$defaultFn(() => uuid()),
//   categoryId: text("category_id")
//     .notNull()
//     .references(() => categoryTable.categoryId),
//   expenseId: text("expense_id")
//     .notNull()
//     .references(() => expensesTable.expenseId),
//   userId: text("user_id")
//     .notNull()
//     .references(() => user.id),
// });
