import type { ExtractedTransaction } from "../../types";

import React from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import * as v from "valibot";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatNumber, getApiErrorMessage, getPercentageFromTotal } from "@/utils";

import { useImportDialog } from "./import-dialog";
import { createTransaction, getAllCategories } from "../../actions";
import { CategoryForm } from "../category-form";

const scheme = v.object({
  category_id: v.number("Category is required"),
});

type FormValues = v.Input<typeof scheme>;

interface ReviewFormProps {
  transaction: ExtractedTransaction;
  onResolve: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ transaction, onResolve }) => {
  const [isCategoryFormOpen, setIsCategoryFormOpen] = React.useState(false);

  const { isMobile, onCloseImport } = useImportDialog();
  const { data: categories, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await getAllCategories(),
  });

  const form = useForm<FormValues>({
    resolver: valibotResolver(scheme),
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await createTransaction({
        description: transaction.data.description,
        amount: transaction.data.amount,
        timestamp: transaction.data.timestamp,
        category_id: values.category_id,
      });
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
          <div className="p-1.5">
            <h3 className="text-sm font-medium leading-none">Extracted description</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{transaction.data.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-1.5">
              <h3 className="text-sm font-medium leading-none">Extracted amount</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {formatNumber(transaction.data.amount)} MDL
              </p>
            </div>
            <div className="p-1.5">
              <h3 className="text-sm font-medium leading-none">Extracted date</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {format(transaction.data.timestamp, "MMM d, yyyy, HH:mm")}
              </p>
            </div>
          </div>

          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <fieldset
                  className="grid grid-cols-2 gap-2"
                  style={{ gridTemplateColumns: "1fr auto" }}
                >
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
                      <SelectTrigger>
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
                    className="border border-dashed bg-background"
                    disabled={form.formState.isSubmitting}
                    onClick={() => setIsCategoryFormOpen(true)}
                  >
                    <PlusIcon className="h-5 w-5" />
                    <span className="ml-2">Create</span>
                  </Button>
                </fieldset>
                <FormDescription>
                  Transaction alias, <span className="font-medium">required</span>, will be used to
                  categorize the transaction.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <Footer className="justify-between">
        <Button variant="secondary" onClick={onCloseImport}>
          Cancel
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="secondary" disabled={form.formState.isSubmitting} onClick={onResolve}>
            Skip
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            onClick={form.handleSubmit(onSubmit)}
          >
            Import
          </Button>
        </div>
      </Footer>

      <CategoryForm
        open={isCategoryFormOpen}
        onClose={() => {
          setIsCategoryFormOpen(false);
        }}
        onSubmitSuccess={async (category) => {
          await refetch();
          form.setValue("category_id", category.id);
        }}
      />
    </>
  );
};

export const ReviewStep: React.FC = () => {
  const { isMobile, transactions, onCloseImport } = useImportDialog();

  const [transactionsToReview] = React.useState([
    ...transactions.filter((t) => t.status === "error"),
  ]);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const setNextIndex = React.useCallback(() => {
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
        <ReviewForm transaction={currentTransaction} onResolve={setNextIndex} />
      ) : (
        <>
          <div className="flex flex-col gap-1.5 rounded-2xl border border-primary/10 bg-primary/5 p-4 shadow dark:shadow-black">
            <h3 className="font-semibold leading-none tracking-tight">Review completed</h3>
            <p className="text-sm text-muted-foreground">
              All transactions have been successfully reviewed. No further action is needed from
              your end.
            </p>
          </div>

          <Footer>
            <Button onClick={onCloseImport}>Close</Button>
          </Footer>
        </>
      )}
    </>
  );
};
