"use client";
import type { CreateNewExpenseSchema } from "@/lib/zod-schemas";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Pencil, Receipt } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import ExpenseForm from "./expense-form";
import ImageForm from "./image-form";

type TCreateNewExpenseSchema = z.infer<typeof CreateNewExpenseSchema>;

const CreateExpenseForm = () => {
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
    mutationKey: ["createRecipe"],
    mutationFn: async (data: TCreateNewExpenseSchema) => {
      const req = await fetch("/api/expenses", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!req.ok) {
        throw Error(await req.json());
      }

      const res = await req.json();

      return res;
    },
    onSuccess: (data) => {
      toast.success(data.message, {
        description: "Created Expense!",
      });
      clearForm();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: z.infer<typeof CreateNewExpenseSchema>) =>
    createExpense.mutate(data);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {!formType && (
            <>
              <Button
                type="button"
                onClick={() => handleTypeChange("expense")}
                size="lg"
                variant="secondary"
              >
                <Pencil />
                Manual
              </Button>
              <Button
                type="button"
                onClick={() => handleTypeChange("receipt")}
                size="lg"
                variant="secondary"
              >
                <Receipt />
                Receipt
              </Button>
            </>
          )}

          {formType && (
            <>
              <Button type="button" onClick={() => handleTypeChange(null)}>
                <ArrowLeft /> Back
              </Button>

              {formType === "receipt" && <ImageForm />}

              {formType === "expense" && <ExpenseForm />}

              <Button type="submit">Add Expense</Button>
            </>
          )}
        </form>
      </Form>
    </div>
  );
};

export default CreateExpenseForm;
