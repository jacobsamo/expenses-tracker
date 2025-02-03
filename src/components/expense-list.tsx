"use client";
import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Expense {
  id: string
  category: string
  amount: number
  date: string
  description: string
}

export function ExpenseList() {
  const [expenses, setExpenses] = useState<Expense[]>([])

  useEffect(() => {
    const fetchExpenses = async () => {
      const response = await fetch("/api/expenses")
      if (response.ok) {
        const data = await response.json()
        setExpenses(data)
      }
    }
    fetchExpenses()
  }, [])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map((expense) => (
          <TableRow key={expense.id}>
            <TableCell>{expense.category}</TableCell>
            <TableCell>${expense.amount.toFixed(2)}</TableCell>
            <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
            <TableCell>{expense.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

