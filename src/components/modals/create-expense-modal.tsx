import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import ExpenseForm from "../create-expense-form";
import { buttonVariants } from "../ui/button";

const CreateExpenseModal = () => {
  return (
    <Dialog>
      <DialogTrigger className={buttonVariants()}>Create Expense</DialogTrigger>
      <DialogContent>
        <DialogHeader>Create Expense</DialogHeader>
        <ExpenseForm />
      </DialogContent>
    </Dialog>
  );
};

export default CreateExpenseModal;
