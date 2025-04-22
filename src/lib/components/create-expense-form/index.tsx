import type { CreateNewExpenseSchema } from "@/lib/zod-schemas";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Pencil, Receipt } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import ExpenseForm from "./expense-form";
import ImageForm from "./image-form";
import type { Expense } from "@/lib/types";

type TCreateNewExpenseSchema = z.infer<typeof CreateNewExpenseSchema>;

const CreateExpenseForm = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm<TCreateNewExpenseSchema>();
  const {
    handleSubmit,
    getValues,
    formState: { errors },
  } = form;
  const formType = form.watch("type");

  useEffect(() => {
    console.log("errors", {
      errors: errors,
      values: getValues(),
    });
  }, [errors]);

  const clearForm = () => {
    form.reset();
  };

  const handleTypeChange = (type: TCreateNewExpenseSchema["type"]) => {
    form.reset();
    form.setValue("type", type);

    if (type == "expense") form.setValue("content.expense.date", new Date());
  };

  const createExpense = useMutation({
    mutationKey: ["createExpense", "expenses"],
    mutationFn: async (data: TCreateNewExpenseSchema) => {
      setLoading(true);
      const formData = new FormData();

      if (!data.type) {
        toast.error("Please select a type");
        return;
      }

      formData.append("type", data.type);

      if (data.type === "receipt") {
        formData.append("receiptFile", data.content.receiptFile);
      } else {
        formData.append("content", JSON.stringify(data.content));
      }

      const req = await fetch("/api/expenses", {
        method: "POST",
        body: formData,
      });

      if (!req.ok) {
        throw Error(await req.json());
      }

      const res = await req.json();

      return res as Expense;
    },
    onSuccess: (data) => {
      toast.success("Successfully created expense", {
        description: "Created Expense!",
      });
      setLoading(false);
      clearForm();
    },
    onError: (error) => {
      setLoading(false);
      toast.error(error.message);
    },
  });

  const onSubmit = (data: z.infer<typeof CreateNewExpenseSchema>) => {
    console.log("Data submitted", {
      data,
      typeOfContent:
        data.type === "receipt" ? typeof data.content.receiptFile : "expense",
    });
    createExpense.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 p-2 w-full">
        {!formType && (
          <div className="inline-flex gap-2 items-center justify-center">
            <Button
              type="button"
              onClick={() => handleTypeChange("expense")}
              size="lg"
              variant="secondary"
              className="size-52"
            >
              <Pencil />
              Manual
            </Button>
            <Button
              type="button"
              onClick={() => handleTypeChange("receipt")}
              size="lg"
              variant="secondary"
              className="size-52"
            >
              <Receipt />
              Receipt
            </Button>
          </div>
        )}

        {formType && (
          <>
            <Button type="button" onClick={() => handleTypeChange(null)} size="sm">
              <ArrowLeft /> Back
            </Button>

            {formType === "receipt" && <ImageForm />}

            {formType === "expense" && <ExpenseForm />}

            <Button type="submit" className="mt-4" disabled={loading}>
              {loading ? (
                <>
                  Creating Expense
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "Create Expense"
              )}
            </Button>
          </>
        )}
      </form>
    </Form>
  );
};

export default CreateExpenseForm;
