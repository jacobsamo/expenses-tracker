import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "../ui/dialog";
import ExpenseForm from "../create-expense-form";
import { buttonVariants } from "../ui/button";
import { PlusIcon } from "lucide-react";

interface CreateExpenseModalProps {
  triggerType?: "button" | "circle";
}

const CreateExpenseModal = ({
  triggerType = "button",
}: CreateExpenseModalProps) => {
  return (
    <Dialog>
      <DialogTrigger
        className={buttonVariants({
          size: triggerType == "button" ? "default" : "iconRounded",
        })}
      >
        {triggerType == "button" ? "Create Expense" : <PlusIcon />}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Create Expense</DialogTitle>
        <ExpenseForm />
      </DialogContent>
    </Dialog>
  );
};

export default CreateExpenseModal;
