import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../ui/dialog'
import ExpenseForm from '../create-expense-form'

const CreateExpenseModal = () => {
  return (
    <Dialog>
        <DialogTrigger>
            Create Expense
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                Create Expense
            </DialogHeader>
            <ExpenseForm />
        </DialogContent>
    </Dialog>
  )
}

export default CreateExpenseModal