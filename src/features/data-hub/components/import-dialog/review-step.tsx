import type { CreateTransactionBody, ExtractedTransaction } from "../../types";

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
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn, getApiErrorMessage, getPercentageFromTotal } from "@/utils";

import { useImportDialog } from "./import-dialog";
import { createTransaction, getAllCategories } from "../../actions";
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

interface ReviewFormProps {
  transaction: ExtractedTransaction;
  onComplete: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ transaction, onComplete }) => {
  const [isCategoryFormOpen, setIsCategoryFormOpen] = React.useState(false);
  const [selectedCategoryAlias, setSelectedCategoryAlias] = React.useState<string | null>(null);

  const { isMobile, resetState, updateTransaction } = useImportDialog();
  const { data: categories, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await getAllCategories(),
  });

  const form = useForm<FormValues>({
    defaultValues: {
      description: transaction.data.description,
      amount: transaction.data.amount,
      date: transaction.data.timestamp,
      time: format(transaction.data.timestamp, "HH:mm"),
    },
    resolver: valibotResolver(scheme),
  });

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
      const response = await createTransaction(data);

      updateTransaction(transaction.uid, { status: "done", response });
      onComplete();
    } catch (error) {
      form.setError("root", { type: "manual", message: getApiErrorMessage(error) });
    }
  };

  React.useEffect(() => {
    if (transaction.status === "error") {
      form.setError("root", { type: "manual", message: transaction.error });
    }
  }, [transaction, form]);

  const Footer = isMobile ? DrawerFooter : DialogFooter;

  return (
    <>
      {form.formState.errors.root && (
        <Alert variant="destructive">
          <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form
          className="space-y-4 rounded-2xl border border-primary/10 bg-primary/5 p-2.5 shadow dark:shadow-black"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
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
                    value={field.value?.toString()}
                    onValueChange={(value) => {
                      if (value) {
                        field.onChange(Number(value));
                      }
                    }}
                    disabled={form.formState.isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger className="col-span-2">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
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

      <Footer className="justify-between">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="secondary">Cancel</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                If you cancel the review, all changes will be lost. Are you sure you want to cancel?
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Go back</AlertDialogCancel>
              <AlertDialogAction onClick={resetState}>Yes, cancel</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="flex items-center gap-2">
          <Button variant="secondary" disabled={form.formState.isSubmitting} onClick={onComplete}>
            Skip
          </Button>
          <Button disabled={form.formState.isSubmitting} onClick={form.handleSubmit(onSubmit)}>
            Submit
          </Button>
        </div>
      </Footer>

      <CategoryForm
        key={selectedCategoryAlias}
        open={isCategoryFormOpen}
        onClose={() => {
          setIsCategoryFormOpen(false);
          setSelectedCategoryAlias(null);
        }}
        onSubmitSuccess={async (category) => {
          await refetch();
          form.setValue("category_id", category.id);
        }}
        defaultValues={{
          aliases: selectedCategoryAlias ? [selectedCategoryAlias] : [""],
        }}
      />
    </>
  );
};

export const ReviewStep: React.FC = () => {
  const { isMobile, transactions, resetState } = useImportDialog();

  const [transactionsToReview] = React.useState([
    ...transactions.filter((t) => t.status === "error"),
  ]);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const onTransactionReviewComplete = React.useCallback(() => {
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const Header = isMobile ? DrawerHeader : DialogHeader;
  const Title = isMobile ? DrawerTitle : DialogTitle;
  const Description = isMobile ? DrawerDescription : DialogDescription;
  const Footer = isMobile ? DrawerFooter : DialogFooter;

  const currentTransaction = transactionsToReview[currentIndex];
  const percentage = getPercentageFromTotal(currentIndex, transactionsToReview.length);

  return (
    <>
      <Header>
        <Title>Review transactions</Title>
        <Description>Review, skip, or update transactions that require attention.</Description>
      </Header>

      <div className="overflow-hidden">
        <Progress value={percentage} />
        <p className="mt-1 flex items-center justify-between px-0.5 text-xs font-medium text-muted-foreground">
          <span className="truncate">
            Reviewed {currentIndex} of {transactionsToReview.length} transactions
          </span>
          <span className="ml-2">{percentage}%</span>
        </p>
      </div>

      {currentTransaction ? (
        <ReviewForm
          key={currentTransaction.uid}
          transaction={currentTransaction}
          onComplete={onTransactionReviewComplete}
        />
      ) : (
        <>
          <div className="flex flex-col gap-1.5 rounded-2xl border border-primary/10 bg-primary/5 p-4 shadow dark:shadow-black">
            <h3 className="font-semibold leading-none tracking-tight">Review completed</h3>
            <p className="text-sm text-muted-foreground">
              All transactions have been successfully processed. No further action is needed from
              your end.
            </p>
          </div>

          <Footer>
            <Button onClick={resetState}>Close</Button>
          </Footer>
        </>
      )}
    </>
  );
};
