
"use client";
import { useQuery } from "@tanstack/react-query";
import type { Expense } from "@/types";
import { format } from "date-fns";
import type { ColumnDef } from "@tanstack/react-table"
// import { DataTableColumnHeade } from "@/components/ui/data-table/sortable-column-header";
import { DataTableToggleSortColumnHeader } from "@/components/ui/data-table/toggle-sort-header";
import { DataTable } from "@/components/ui/data-table";


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
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-Au", {
        style: "currency",
        currency: "AUD",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
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
    cell: ({ row }) => <div className="text-right font-medium">{format(new Date(row.getValue("date")), "PP p")}</div>
  },
  {
    accessorKey: "description",
    header: "Description"
  },
  {
    accessorKey: "receiptUrl",
    header: "Receipt"
  },
]

export function ExpenseList() {
  const { data: expenses } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      const response = await fetch("/api/expenses");
      if (response.ok) {
        return (await response.json()) as Expense[];
      }
      return null;
    },
  });
  if (!expenses || expenses === undefined) return <div>Not Expense created yet</div>

  return <DataTable columns={expenseTableColumns} data={expenses} />

}
