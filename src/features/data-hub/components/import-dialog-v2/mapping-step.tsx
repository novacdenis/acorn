import type { Category, ExtractedTransaction } from "../../types";

import React from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
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
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/lib/supabase/client";
import { formatNumber, getApiErrorMessage, getPercentageFromTotal, queryMather } from "@/utils";

import { useImportDialog } from "./import-dialog";
import { createTransaction, getAllCategories } from "../../actions";
import { getSimilarTransactions } from "../../utils";
import { CategoryForm } from "../category-form";

const scheme = v.object({
  category_id: v.number("Category is required"),
  assign_alias: v.boolean(),
  import_similar: v.boolean(),
});

type FormValues = v.Input<typeof scheme>;

interface MapFormProps {
  transaction: ExtractedTransaction;
  similar: ExtractedTransaction[];
  category: Category | null;
  onSkip: () => Promise<void>;
  onMap: (values: FormValues) => Promise<void>;
}

const MapForm: React.FC<MapFormProps> = ({ transaction, similar, category, onSkip, onMap }) => {
  const [isCategoryFormOpen, setIsCategoryFormOpen] = React.useState(false);
  const [isSkipping, setIsSkipping] = React.useState(false);

  const { isMobile, resetState } = useImportDialog();
  const { data: categories, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await getAllCategories(),
  });

  const form = useForm<FormValues>({
    defaultValues: {
      assign_alias: false,
      import_similar: similar.length > 0,
    },
    resolver: valibotResolver(scheme),
  });
  const importSimilar = form.watch("import_similar");

  const onSkipHandler = async () => {
    setIsSkipping(true);

    try {
      await onSkip();
    } catch (error) {
      form.setError("root", { type: "manual", message: getApiErrorMessage(error) });
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      await onMap(values);
    } catch (error) {
      form.setError("root", { type: "manual", message: getApiErrorMessage(error) });
    }
  };

  const Footer = isMobile ? DrawerFooter : DialogFooter;

  const isFormDisabled = form.formState.isSubmitting || isSkipping;

  return (
    <>
      {form.formState.errors.root && (
        <Alert variant="destructive">
          <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form
          className="space-y-2.5 rounded-2xl border border-primary/10 bg-primary/5 p-2.5 shadow dark:shadow-black"
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
                <fieldset className="grid grid-cols-3 gap-2">
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(value) => {
                      if (value) {
                        field.onChange(Number(value));
                      }
                    }}
                    disabled={isFormDisabled}
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
                    disabled={isFormDisabled}
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
            name="assign_alias"
            render={({ field }) => (
              <FormItem className="space-y-2 rounded-lg border bg-background p-3">
                <div className="flex items-center justify-between gap-2">
                  <FormLabel className="flex-1">Assign alias</FormLabel>
                  <FormControl>
                    <Switch
                      disabled={isFormDisabled}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
                <FormDescription>
                  If enabled, the <span className="text-primary">{transaction.data.category}</span>{" "}
                  category will be added to the list of aliases for the selected category.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {!!similar.length && (
            <FormField
              control={form.control}
              name="import_similar"
              render={({ field }) => (
                <FormItem className="space-y-2 rounded-lg border bg-background p-3">
                  <div className="flex items-center justify-between gap-2">
                    <FormLabel className="flex-1">Map similar transactions</FormLabel>
                    <FormControl>
                      <Switch
                        disabled={isFormDisabled}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </div>
                  <FormDescription>
                    Found <span className="text-primary">{formatNumber(similar.length)}</span>{" "}
                    similar transactions. If enabled, they will be mapped to the selected category.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
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
                By cancelling, all changes will be lost. Are you sure you want to cancel?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Go back</AlertDialogCancel>
              <AlertDialogAction onClick={resetState}>Yes, cancel</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="flex items-center gap-2">
          <Button variant="secondary" disabled={isFormDisabled} onClick={onSkipHandler}>
            Skip
          </Button>
          <Button type="submit" disabled={isFormDisabled} onClick={form.handleSubmit(onSubmit)}>
            Import {importSimilar ? formatNumber(similar.length + 1, { notation: "compact" }) : ""}{" "}
            transaction{importSimilar ? "s" : ""}
          </Button>
        </div>
      </Footer>

      <CategoryForm
        key={transaction.uid}
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

export const MappingStep: React.FC = () => {
  const { isMobile, transactions, updateTransaction, startImport, resetState } = useImportDialog();

  const [current, setCurrent] = React.useState(transactions.find((t) => t.status === "idle"));
  const [similar, setSimilar] = React.useState(getSimilarTransactions(transactions, current));
  const [category, setCategory] = React.useState<Category | null>(null);

  const queryClient = useQueryClient();

  const setNextTransaction = React.useCallback(async () => {
    const next = transactions.find((t) => t.status === "idle" && t.uid !== current?.uid);
    const similar = getSimilarTransactions(transactions, next);

    if (next) {
      const supabase = createClient();
      const response = await supabase
        .from("categories")
        .select()
        .overlaps("aliases", [next.data.category.trim()])
        .single();

      setCategory(response.data);
    }

    setCurrent(next);
    setSimilar(similar);
  }, [current, transactions]);

  const onSkipTransaction = React.useCallback(async () => {
    if (!current) {
      throw new Error("Something went wrong. Please try again.");
    }

    updateTransaction(current.uid, { status: "skip" });

    for (const transaction of similar) {
      updateTransaction(transaction.uid, { status: "skip" });
    }

    await setNextTransaction();
  }, [current, setNextTransaction, similar, updateTransaction]);

  const onMapTransaction = React.useCallback(
    async (values: FormValues) => {
      if (!current) {
        throw new Error("Something went wrong. Please try again.");
      }

      if (values.import_similar) {
        startImport([current, ...similar], values.category_id);
      } else {
        const response = await createTransaction({
          description: current.data.description,
          category_id: values.category_id,
          amount: current.data.amount,
          timestamp: current.data.timestamp,
        });

        if (response) {
          updateTransaction(current.uid, { status: "done", response });
        }
      }

      await setNextTransaction();
    },
    [current, setNextTransaction, similar, startImport, updateTransaction]
  );

  const onClose = () => {
    queryClient.refetchQueries({ predicate: queryMather(["transactions", "categories"]) });
    resetState();
  };

  const Header = isMobile ? DrawerHeader : DialogHeader;
  const Title = isMobile ? DrawerTitle : DialogTitle;
  const Description = isMobile ? DrawerDescription : DialogDescription;
  const Footer = isMobile ? DrawerFooter : DialogFooter;

  const meta = React.useMemo(() => {
    const total = transactions.length;
    const completed = transactions.filter((t) => ["skip", "done"].includes(t.status)).length;
    const percentage = getPercentageFromTotal(completed, total);

    return { total, completed, percentage };
  }, [transactions]);

  return (
    <>
      <Header>
        <Title>Map transactions</Title>
        <Description>
          Map transactions to the correct categories before importing them into your account.
        </Description>
      </Header>

      <div className="overflow-hidden">
        <Progress value={meta.percentage} />
        <p className="mt-1 flex items-center justify-between px-0.5 text-xs font-medium text-muted-foreground">
          <span className="truncate">
            Mapped {meta.completed} of {meta.total} transactions
          </span>
          <span className="ml-2">{meta.percentage}%</span>
        </p>
      </div>

      {current ? (
        <MapForm
          key={current.uid}
          transaction={current}
          similar={similar}
          category={category}
          onSkip={onSkipTransaction}
          onMap={onMapTransaction}
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
            <Button onClick={onClose}>Close</Button>
          </Footer>
        </>
      )}
    </>
  );
};
