"use client";

import type { Transaction, CreateTransactionBody } from "../../types";

import React from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useQuery } from "@tanstack/react-query";
import { add, format } from "date-fns";
import { useForm } from "react-hook-form";
import * as v from "valibot";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMediaQuery } from "@/hooks";
import { cn, getApiErrorMessage } from "@/utils";

import {
  createTransaction,
  deleteTransaction,
  getAllCategories,
  updateTransaction,
} from "../../actions";
import { CategoryForm } from "../category-form";

const scheme = v.object({
  description: v.string([v.minLength(1, "Description is required")]),
  category_id: v.number("Category is required"),
  amount: v.coerce(
    v.number("Amount is required", [v.minValue(0, "Amount must be greater than 0")]),
    (value) => (value === "" ? undefined : Number(value))
  ),
  date: v.date("Date is required"),
  time: v.string([v.minLength(1, "Time is required")]),
});

type FormValues = v.Input<typeof scheme>;

export interface TransactionFormProps {
  open: boolean;
  onClose: () => void;
  onSubmitSuccess?: (transaction: Transaction) => void;
  onDeleteSuccess?: (transaction: Transaction) => void;
  defaultValues?: Transaction;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  open,
  onClose,
  onSubmitSuccess,
  onDeleteSuccess,
  defaultValues,
}) => {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = React.useState(false);

  const { data: categories, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await getAllCategories(),
  });

  const isMobile = useMediaQuery("(max-width: 640px)");
  const form = useForm<FormValues>({
    defaultValues: {
      description: defaultValues?.description ?? "",
      category_id: defaultValues?.category_id,
      amount: defaultValues?.amount,
      date: defaultValues?.timestamp ? new Date(defaultValues.timestamp) : undefined,
      time: defaultValues?.timestamp ? format(new Date(defaultValues.timestamp), "HH:mm") : "",
    },
    resolver: valibotResolver(scheme),
  });

  const onCloseHandler = () => {
    form.reset();
    onClose();
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const data: CreateTransactionBody = {
        description: values.description,
        category_id: values.category_id,
        amount: values.amount,
        timestamp: add(values.date, {
          hours: Number(values.time.split(":")[0]) ?? 0,
          minutes: Number(values.time.split(":")[1]) ?? 0,
        }),
      };

      let response: Transaction | undefined = undefined;

      if (defaultValues?.id) {
        response = await updateTransaction(defaultValues.id, data);
      } else {
        response = await createTransaction(data);
      }

      if (onSubmitSuccess) {
        onSubmitSuccess(response);
      }
      onCloseHandler();
    } catch (error) {
      form.setError("root", { type: "manual", message: getApiErrorMessage(error) });
    }
  };

  const onDelete = async () => {
    if (!defaultValues?.id) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteTransaction(defaultValues.id);

      if (onDeleteSuccess) {
        onDeleteSuccess(defaultValues);
      }
      onCloseHandler();
    } catch (error) {
      form.setError("root", { type: "manual", message: getApiErrorMessage(error) });
    } finally {
      setIsDeleting(false);
    }
  };

  const Root = isMobile ? Drawer : Dialog;
  const Content = isMobile ? DrawerContent : DialogContent;
  const Header = isMobile ? DrawerHeader : DialogHeader;
  const Title = isMobile ? DrawerTitle : DialogTitle;
  const Description = isMobile ? DrawerDescription : DialogDescription;
  const Footer = isMobile ? DrawerFooter : DialogFooter;

  return (
    <>
      <Root
        open={open}
        onOpenChange={(value) => {
          if (value === false) {
            onCloseHandler();
          }
        }}
      >
        <Content>
          <Header>
            <Title>{defaultValues?.id ? "Edit" : "Create"} transaction</Title>
            <Description>Transaction represents a single financial operation.</Description>
          </Header>

          {form.formState.errors.root && (
            <Alert variant="destructive">
              <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        minRows={1}
                        placeholder="Enter a description"
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <fieldset className="grid grid-cols-3 gap-2">
                      <Select
                        defaultValue={field.value?.toString()}
                        onValueChange={(v) => field.onChange(Number(v))}
                        disabled={form.formState.isSubmitting}
                      >
                        <SelectTrigger className="col-span-2">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.data.length ? (
                            categories.data.map((category) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem disabled value="null">
                              No categories found
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        className="col-span-1 border border-dashed bg-background"
                        disabled={form.formState.isSubmitting}
                        onClick={() => setIsCategoryFormOpen(true)}
                      >
                        <PlusIcon className="h-5 w-5" />
                        <span className="ml-2">Create</span>
                      </Button>
                    </fieldset>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <fieldset className="relative">
                        <Input
                          {...field}
                          type="number"
                          inputMode="decimal"
                          placeholder="Enter an amount"
                          className="pr-14"
                          value={field.value ?? ""}
                          disabled={form.formState.isSubmitting}
                        />
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex w-14 items-center px-3 text-sm font-semibold text-muted-foreground">
                          MDL
                        </span>
                      </fieldset>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-5 gap-2">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full px-3 text-left text-base font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                              disabled={form.formState.isSubmitting}
                            >
                              {field.value ? (
                                format(field.value, "MMM d, yyyy")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-5 w-5 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            toYear={new Date().getFullYear()}
                            toMonth={new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Time</FormLabel>
                      <fieldset className="relative">
                        <Input
                          {...field}
                          type="time"
                          className="pr-11"
                          disabled={form.formState.isSubmitting}
                        />
                        <button
                          className="absolute inset-y-0 right-0 flex items-center justify-center rounded-xl px-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          onClick={(event) => {
                            const input = event.currentTarget.previousSibling;
                            if (input && input instanceof HTMLInputElement) {
                              input.showPicker();
                            }
                          }}
                        >
                          <ClockIcon className="h-5 w-5 opacity-50" />
                        </button>
                      </fieldset>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>

          <Footer className={cn("border-t pt-4 sm:pt-5", { "justify-between": defaultValues })}>
            {!!defaultValues && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    isLoading={isDeleting}
                    disabled={form.formState.isSubmitting}
                  >
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Deleting this transaction is irreversible. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete}>Yes, delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                disabled={form.formState.isSubmitting}
                onClick={onCloseHandler}
              >
                Cancel
              </Button>
              <Button
                isLoading={form.formState.isSubmitting}
                disabled={form.formState.isSubmitting}
                onClick={form.handleSubmit(onSubmit)}
              >
                Submit
              </Button>
            </div>
          </Footer>
        </Content>
      </Root>

      <CategoryForm
        open={isCategoryFormOpen}
        onClose={() => setIsCategoryFormOpen(false)}
        onSubmitSuccess={(category) => {
          refetch();
          form.setValue("category_id", category.id);
        }}
      />
    </>
  );
};
