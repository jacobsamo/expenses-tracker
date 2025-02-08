DROP INDEX "session_token_unique";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
ALTER TABLE `expenses` ALTER COLUMN "amount" TO "amount" real NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `items` ALTER COLUMN "total_item_cost" TO "total_item_cost" real;--> statement-breakpoint
ALTER TABLE `items` ALTER COLUMN "quantity" TO "quantity" real;--> statement-breakpoint
ALTER TABLE `items` ALTER COLUMN "cost_per_item" TO "cost_per_item" real;