import { Button } from "@/lib/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/lib/components/ui/dropdown-menu";
import { expensesSchema } from "@/lib/zod-schemas";
import { useMutation } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import EditExpenseModal from "../modals/edit-expense-modal";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const expense = expensesSchema.parse(row.original);

  const deleteExpense = useMutation({
    mutationKey: ["deleteExpense", "expenses"],
    mutationFn: async () => {
      const req = await fetch(`/api/expenses/${expense.expenseId}`, {
        method: "DELETE",
      });

      return req;
    },
    onSuccess: () => {
      toast.success("Deleted Expense");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem asChild>
          <EditExpenseModal expense={expense} />
        </DropdownMenuItem>
        <DropdownMenuItem
          className="bg-desctructive"
          onClick={() => deleteExpense.mutate()}
        >
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
