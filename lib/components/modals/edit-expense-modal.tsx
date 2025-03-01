import { Button } from "@/lib/components/ui/button";
import { Form } from "@/lib/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { expensesSchema } from "../../zod-schemas";
import ExpenseForm from "../create-expense-form/expense-form";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";

const schema = z.object({
  content: z.object({
    expense: expensesSchema.extend({
      userId: z.string().optional(),
    }),
  }),
});

interface EditExpenseFormProps {
  expense: z.infer<typeof expensesSchema>;
}

const EditExpenseModal = ({ expense }: EditExpenseFormProps) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      content: {
        expense: expense,
      },
    },
  });
  const {
    handleSubmit,
    getValues,
    formState: { errors },
  } = form;

  useEffect(() => {
    console.log("errors", {
      errors: errors,
      values: getValues(),
    });
  }, [errors]);

  const editExpense = useMutation({
    mutationKey: ["editExpense", "expenses"],
    mutationFn: async (data: z.infer<typeof schema>) => {
      setLoading(true);

      const req = await fetch(`/api/expenses/${expense.expenseId}`, {
        method: "PUT",
        body: JSON.stringify(data.content),
      });

      if (!req.ok) {
        throw Error(await req.json());
      }

      const res = await req.json();

      return res;
    },
    onSuccess: () => {
      toast.success("Updated Expense");
      setLoading(false);
      setOpen(false);
    },
    onError: (error) => {
      setLoading(false);
      toast.error(error.message);
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    editExpense.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
        Edit Expense
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Update Expense</DialogTitle>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ExpenseForm />
            <Button type="submit" className="mt-4" disabled={loading}>
              {loading ? (
                <>
                  Updating Expense
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "Update Expense"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditExpenseModal;
