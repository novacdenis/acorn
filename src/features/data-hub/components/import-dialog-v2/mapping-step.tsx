"use client";

import type { CategoryMapping } from "../../types";

import React from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPercentageFromTotal, queryMather } from "@/utils";

import { useImportDialog } from "./import-dialog";
import { getAllCategories } from "../../actions";
import { CategoryForm } from "../category-form";

const scheme = v.object({
  mapping: v.object({
    alias: v.string(),
    id: v.number("Category is required"),
  }),
});

type FormValues = v.Input<typeof scheme>;

interface MappingFormProps {
  mapping: CategoryMapping;
  onComplete: () => void;
}

const MappingForm: React.FC<MappingFormProps> = ({ mapping, onComplete }) => {
  const [isCategoryFormOpen, setIsCategoryFormOpen] = React.useState(false);
  const [selectedCategoryAlias, setSelectedCategoryAlias] = React.useState<string | null>(null);

  const { isMobile, resetState, updateMapping } = useImportDialog();
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await getAllCategories(),
  });

  const queryClient = useQueryClient();
  const form = useForm<FormValues>({
    defaultValues: {
      mapping,
    },
    resolver: valibotResolver(scheme),
  });

  const onSkip = () => {
    updateMapping(mapping.alias, undefined);
    onComplete();
  };

  const onSubmit = (values: FormValues) => {
    updateMapping(values.mapping.alias, values.mapping.id);
    onComplete();
  };

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
          className="space-y-4 rounded-2xl border border-primary/10 bg-primary/5 p-2.5"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="mapping.id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{mapping.alias}</FormLabel>
                <fieldset className="grid grid-cols-3 gap-2">
                  <Select
                    value={field.value?.toString()}
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
                    onClick={() => {
                      setIsCategoryFormOpen(true);
                      setSelectedCategoryAlias(mapping.alias);
                    }}
                  >
                    <PlusIcon className="h-5 w-5" />
                    <span className="ml-2">Create</span>
                  </Button>
                </fieldset>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="secondary" disabled={form.formState.isSubmitting}>
                Skip
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  By skipping, the category will be left unmapped. You&apos;ll have to assign a
                  category to each transaction manually.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Go back</AlertDialogCancel>
                <AlertDialogAction onClick={onSkip}>Yes, skip</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button disabled={form.formState.isSubmitting} onClick={form.handleSubmit(onSubmit)}>
            Confirm mapping
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
          await queryClient.refetchQueries({ predicate: queryMather(["categories"]) });
          form.setValue("mapping.id", category.id);
        }}
        defaultValues={{
          aliases: selectedCategoryAlias ? [selectedCategoryAlias] : [""],
        }}
      />
    </>
  );
};

export const MappingStep: React.FC = () => {
  const { isMobile, mappings, resetState, startImport } = useImportDialog();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const onMappingComplete = React.useCallback(() => {
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const Header = isMobile ? DrawerHeader : DialogHeader;
  const Title = isMobile ? DrawerTitle : DialogTitle;
  const Description = isMobile ? DrawerDescription : DialogDescription;
  const Footer = isMobile ? DrawerFooter : DialogFooter;

  const currentMapping = mappings[currentIndex];
  const percentage = getPercentageFromTotal(currentIndex, mappings.length);

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
            Reviewed {currentIndex} of {mappings.length} categories
          </span>
          <span className="ml-2">{percentage}%</span>
        </p>
      </div>

      {currentMapping ? (
        <MappingForm
          key={currentMapping.alias}
          mapping={currentMapping}
          onComplete={onMappingComplete}
        />
      ) : (
        <>
          <div className="flex flex-col gap-1.5 rounded-2xl border border-primary/10 bg-primary/5 p-2.5">
            <h3 className="font-semibold leading-none tracking-tight">Mapping complete</h3>
            <p className="text-sm text-muted-foreground">
              All categories have been reviewed. You can continue to import your transactions.
            </p>
          </div>

          <Footer>
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
            <Button onClick={startImport}>Continue</Button>
          </Footer>
        </>
      )}
    </>
  );
};
