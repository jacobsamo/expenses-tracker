import type { Expense } from "@/lib/types";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
// import { DataTableColumnHeade } from "@/lib/components/ui/data-table/sortable-column-header";
import { DataTable } from "@/lib/components/ui/data-table";
import { DataTableToggleSortColumnHeader } from "@/lib/components/ui/data-table/toggle-sort-header";
import { getExpenses } from "@/lib/utils/get-expense";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { DataTableRowActions } from "./data-table-row-actions";

export const expenseTableColumns: ColumnDef<Expense>[] = [
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableToggleSortColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-Au", {
        style: "currency",
        currency: "AUD",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "business",
    header: "Business Name",
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableToggleSortColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {format(new Date(row.getValue("date")), "PP p")}
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "receiptUrl",
    header: "Receipt",
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];



export function ExpenseList() {
  const {
    data: expenses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      return await getExpenses();
    },
    // retry: false, // Don't retry on 401
  });

  if (isLoading) return <Loader2 className="animate-spin rounded-full size-8" />;

  if (!expenses || expenses.length === 0) return <div>No expenses created yet</div>;

  return <DataTable columns={expenseTableColumns} data={expenses} />;
}
