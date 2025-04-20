CREATE TABLE `items` (
	`item_id` text PRIMARY KEY NOT NULL,
	`expense_id` text NOT NULL,
	`total_item_cost` integer,
	`quantity` integer,
	`cost_per_item` integer,
	`name` text,
	`user_id` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`expense_id`) REFERENCES `expenses`(`expense_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
