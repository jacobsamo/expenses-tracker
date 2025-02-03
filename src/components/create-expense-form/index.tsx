"use client"
import React from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expensesSchema } from "@/lib/zod-schemas";
import { z } from "zod";
import { DateTimePicker } from "../ui/date-time-picker";
import ImageForm from "./image-form";

const ExpenseForm = () => {
  const form = useForm<z.infer<typeof expensesSchema>>({
    resolver: zodResolver(expensesSchema),
  });
  const { control, handleSubmit, setValue, getValues } = form;

  const onSubmit = async (data: z.infer<typeof expensesSchema>) => {
    console.log(data);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField
            control={control}
            name="category"
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select {...field}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fuel">Fuel</SelectItem>
                      <SelectItem value="lodging">Lodging</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="activities">Activities</SelectItem>
                      <SelectItem value="accommodation">
                        Accommodation
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="business"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Business Name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Description"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="amount"
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    inputMode="numeric"
                    placeholder="Amount"
                    value={field.value ? Number(field.value) : undefined}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="date"
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <DateTimePicker
                    date={field.value ? new Date(field.value) : new Date()}
                    setDate={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <ImageForm
            setUploadedImageUrl={(url) => setValue("receiptUrl", url)}
            uploadedImageUrl={getValues("receiptUrl") ?? null}
          />

          <Button type="submit">Add Expense</Button>
        </form>
      </Form>
    </div>
  );
};

export default ExpenseForm;
