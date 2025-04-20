import { PlusIcon } from "lucide-react";
import ExpenseForm from "../create-expense-form";
import { buttonVariants } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from "../ui/dialog";

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
