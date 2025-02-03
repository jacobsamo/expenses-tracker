"use client";
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Expense {
  id: string
  category: string
  amount: number
  date: string
}

export function Dashboard() {
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

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const expensesByCategory = expenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const chartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    category,
    amount,
  }))

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">${totalExpenses.toFixed(2)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

