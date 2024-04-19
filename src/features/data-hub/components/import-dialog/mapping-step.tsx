import type { CategoryMapping } from "../../types";

import React from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import * as v from "valibot";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
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
import { formatNumber, getPercentageFromTotal } from "@/utils";

import { useImportDialog } from "./import-dialog";
import { getAllCategories, updateCategory } from "../../actions";
import { CategoryForm } from "../category-form";

const scheme = v.object({
  mapping: v.object({
    alias: v.string(),
    id: v.number("Category is required"),
  }),
  assign_alias: v.boolean(),
});

type FormValues = v.Input<typeof scheme>;

interface MappingFormProps {
  mapping: CategoryMapping;
  onSkip: () => void;
  onMap: (alias: string, category_id: number) => void;
}

const MappingForm: React.FC<MappingFormProps> = ({ mapping, onSkip, onMap }) => {
  const { isMobile, transactions, onCloseImport } = useImportDialog();
  const { data: categories, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await getAllCategories(),
  });

  const [isCategoryFormOpen, setIsCategoryFormOpen] = React.useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      mapping,
      assign_alias: false,
    },
    resolver: valibotResolver(scheme),
  });

  const onSubmit = async (values: FormValues) => {
    if (values.assign_alias) {
      const category = categories?.data.find((category) => category.id === values.mapping.id);

      if (category) {
        await updateCategory(values.mapping.id, {
          aliases: [...(category?.aliases ?? []), mapping.alias],
        });
        await refetch();
      }
    }

    onMap(mapping.alias, values.mapping.id);
  };

  const Footer = isMobile ? DrawerFooter : DialogFooter;
  const aliasTransactions = transactions.filter(
    (transaction) => transaction.data.category_alias === mapping.alias
  );

  return (
    <>
      <Form {...form}>
        <form
          className="space-y-4 rounded-2xl border border-primary/10 bg-primary/5 p-2.5 shadow dark:shadow-black"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="mapping.id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <fieldset
                  className="grid grid-cols-2 gap-2"
                  style={{
                    gridTemplateColumns: "1fr auto",
                  }}
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
                    onClick={() => {
                      setIsCategoryFormOpen(true);
                    }}
                  >
                    <PlusIcon className="h-5 w-5" />
                    <span className="ml-2">Create</span>
                  </Button>
                </fieldset>
                <FormDescription>
                  Select a category to map the <span className="text-primary">{mapping.alias}</span>{" "}
                  alias.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <h3 className="pl-1.5 text-sm font-medium leading-none">Transactions</h3>
            <div className="mt-2 overflow-hidden rounded-lg border bg-background">
              <ul className="max-h-56 divide-y divide-primary/10 overflow-y-auto">
                {aliasTransactions.slice(0, 10).map((transaction) => (
                  <li key={transaction.uid} className="p-3">
                    <h3 className="text-sm">{transaction.data.description}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      <span>{format(transaction.data.timestamp, "MMM d, yyyy, HH:mm")}</span>
                      <span className="mx-1 inline-block">•</span>
                      <span>{formatNumber(transaction.data.amount, { decimals: 2 })} MDL</span>
                    </p>
                  </li>
                ))}
                {aliasTransactions.length > 10 && (
                  <li>
                    <p className="p-2 text-center text-sm text-primary">
                      + {formatNumber(aliasTransactions.length - 10)} more
                    </p>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <FormField
            control={form.control}
            name="assign_alias"
            render={({ field }) => (
              <FormItem className="space-y-2 rounded-lg border bg-background p-3">
                <div className="flex items-center justify-between gap-2">
                  <FormLabel className="flex-1">Assign alias</FormLabel>
                  <FormControl>
                    <Switch
                      disabled={form.formState.isSubmitting}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
                <FormDescription>
                  If enabled, the <span className="text-primary">{mapping.alias}</span> alias will
                  be added to the selected category for future reference.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <Footer className="justify-between">
        <Button variant="secondary" disabled={form.formState.isSubmitting} onClick={onCloseImport}>
          Cancel
        </Button>

        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="secondary" disabled={form.formState.isSubmitting}>
                Skip
              </Button>
            </AlertDialogTrigger>
            <AlertDialogOverlay className="absolute rounded-2xl">
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Transactions with the <span className="text-primary">{mapping.alias}</span>{" "}
                    alias will be skipped during the import. Are you sure you want to skip this
                    alias?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>No, continue</AlertDialogCancel>
                  <AlertDialogAction onClick={onSkip}>Yes, skip</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
          <Button disabled={form.formState.isSubmitting} onClick={form.handleSubmit(onSubmit)}>
            Confirm
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
          form.setValue("mapping.id", category.id);
        }}
      />
    </>
  );
};

export const MappingStep: React.FC = () => {
  const { isMobile, mappings, onMappingComplete, onCloseImport } = useImportDialog();

  const [aliasesToMap, setAliasesToMap] = React.useState<CategoryMapping[]>(
    [...mappings].filter((mapping) => !mapping.category_id)
  );
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const setNextIndex = React.useCallback(() => {
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const onMap = React.useCallback(
    (alias: string, category_id: number) => {
      setAliasesToMap((prev) =>
        prev.map((mapping) => (mapping.alias === alias ? { ...mapping, category_id } : mapping))
      );
      setNextIndex();
    },
    [setNextIndex]
  );

  const onContinue = () => {
    onMappingComplete(
      mappings.map((mapping) => {
        const alias = aliasesToMap.find((a) => a.alias === mapping.alias);
        return {
          ...mapping,
          category_id: alias?.category_id,
        };
      })
    );
  };

  const Header = isMobile ? DrawerHeader : DialogHeader;
  const Title = isMobile ? DrawerTitle : DialogTitle;
  const Description = isMobile ? DrawerDescription : DialogDescription;
  const Footer = isMobile ? DrawerFooter : DialogFooter;

  const currentMapping = aliasesToMap[currentIndex];
  const percentage = getPercentageFromTotal(currentIndex, aliasesToMap.length);

  return (
    <>
      <Header>
        <Title>Map categories</Title>
        <Description>
          Map categories extracted from your transactions to existing categories in your account.
        </Description>
      </Header>

      <div className="overflow-hidden">
        <Progress value={percentage} />
        <p className="mt-1 flex items-center justify-between px-0.5 text-xs font-medium text-muted-foreground">
          <span className="truncate">
            Mapped {currentIndex} of {aliasesToMap.length} categories
          </span>
          <span className="ml-2">{percentage}%</span>
        </p>
      </div>

      {currentMapping ? (
        <MappingForm
          key={currentMapping.alias}
          mapping={currentMapping}
          onSkip={setNextIndex}
          onMap={onMap}
        />
      ) : (
        <>
          <div className="flex flex-col gap-1.5 rounded-2xl border border-primary/10 bg-primary/5 p-4 shadow dark:shadow-black">
            <h3 className="font-semibold leading-none tracking-tight">Mapping complete</h3>
            <p className="text-sm text-muted-foreground">
              All categories have been mapped. You can continue with importing your transactions.
            </p>
          </div>

          <Footer>
            <Button variant="secondary" onClick={onCloseImport}>
              Cancel
            </Button>
            <Button onClick={onContinue}>Continue</Button>
          </Footer>
        </>
      )}
    </>
  );
};
