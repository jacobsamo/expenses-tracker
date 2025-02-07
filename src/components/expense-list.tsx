"use client";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import type { Expense } from "@/types";

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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Business Name</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Receipt</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses &&
          expenses.map((expense) => (
            <TableRow key={expense.expenseId}>
              <TableCell>{expense.category}</TableCell>
              <TableCell>${expense.amount.toFixed(2)}</TableCell>
              <TableCell>{expense.business}</TableCell>
              <TableCell>{new Date(expense.date).toDateString()}</TableCell>
              <TableCell>{expense.description}</TableCell>
              <TableCell>{expense.receiptUrl}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
