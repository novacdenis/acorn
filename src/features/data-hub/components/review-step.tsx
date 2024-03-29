import type { ExtractedTransaction } from "../types";

import React from "react";
import { PlusCircleIcon } from "@heroicons/react/16/solid";
import { CalendarIcon, CheckIcon, ChevronUpDownIcon, ClockIcon } from "@heroicons/react/24/outline";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import * as v from "valibot";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
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
import { Textarea } from "@/components/ui/textarea";
import { cn, getApiErrorMessage, getPercentageFromTotal } from "@/utils";

import { useImportDialogContext } from "./import-dialog";
import { createTransaction } from "../actions";

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

type FormInput = v.Input<typeof scheme>;

interface ReviewFormProps {
  transaction: ExtractedTransaction;
  onComplete: () => void;
}

const languages = [
  { label: "English", value: 1 },
  { label: "French", value: 2 },
  { label: "German", value: 3 },
  { label: "Spanish", value: 4 },
  { label: "Portuguese", value: 5 },
  { label: "Russian", value: 6 },
  { label: "Japanese", value: 7 },
  { label: "Korean", value: 8 },
  { label: "Chinese", value: 9 },
];

const ReviewForm: React.FC<ReviewFormProps> = ({ transaction, onComplete }) => {
  const { isMobile } = useImportDialogContext();

  const form = useForm<FormInput>({
    defaultValues: {
      description: transaction.data.description,
      amount: transaction.data.amount,
      date: transaction.data.timestamp,
      time: format(transaction.data.timestamp, "HH:mm"),
    },
    resolver: valibotResolver(scheme),
  });

  const onSubmit = async (values: FormInput) => {
    try {
      await createTransaction({
        description: values.description,
        category_id: values.category_id,
        amount: values.amount,
        timestamp: values.date,
      });
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
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} minRows={1} placeholder="Enter a description" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-2 place-self-stretch">
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Language</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full px-3 text-left text-base font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? languages.find((language) => language.value === field.value)?.label
                            : "Select language"}
                          <ChevronUpDownIcon className="ml-auto h-5 w-5 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                      <Command className="relative">
                        <CommandInput placeholder="Search framework..." className="h-9" />
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup title="Languages">
                          {languages.map((language) => (
                            <CommandItem
                              value={language.label}
                              key={language.value}
                              onSelect={() => {
                                form.setValue("category_id", language.value);
                              }}
                            >
                              {language.label}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  language.value === field.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-1 flex items-center justify-center">
              <Button variant="ghost" className="mt-1 w-full border border-dashed bg-background">
                <PlusCircleIcon className="h-4 w-4" />
                <span className="ml-2">Create</span>
              </Button>
            </div>
          </div>

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type="number"
                      inputMode="decimal"
                      placeholder="Enter an amount"
                      className="pr-14"
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-sm font-semibold text-muted-foreground">
                      MDL
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-2">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="col-span-2">
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
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <div className="relative">
                    <Input {...field} type="time" className="pr-10" />
                    <button
                      className="absolute inset-y-0 right-0 flex items-center justify-center pr-3"
                      onClick={(event) => {
                        const input = event.currentTarget.previousSibling;
                        if (input && input instanceof HTMLInputElement) {
                          input.showPicker();
                        }
                      }}
                    >
                      <ClockIcon className="h-5 w-5 opacity-50" />
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>

      <Footer>
        <Button variant="secondary" onClick={onComplete}>
          Skip
        </Button>
        <Button onClick={form.handleSubmit(onSubmit)}>Submit</Button>
      </Footer>
    </>
  );
};

export const ReviewStep: React.FC = () => {
  const { isMobile, transactions, onFinishImportReview } = useImportDialogContext();

  const [transactionsToReview] = React.useState([
    ...transactions.filter((t) => t.status === "error"),
  ]);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const onReviewComplete = React.useCallback(() => {
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

      <div className="grid gap-4 rounded-2xl border border-primary/10 bg-primary/5 p-2">
        {currentTransaction ? (
          <ReviewForm
            key={currentTransaction.uid}
            transaction={currentTransaction}
            onComplete={onReviewComplete}
          />
        ) : (
          <div className="flex flex-col gap-1.5 p-2">
            <h3 className="font-semibold leading-none tracking-tight">Review completed</h3>
            <p className="text-sm text-muted-foreground">
              All transactions have been successfully processed. No further action is needed from
              your end.
            </p>
          </div>
        )}
      </div>

      <Footer>
        <Button variant="secondary" onClick={onFinishImportReview}>
          Dismiss
        </Button>
      </Footer>
    </>
  );
};
