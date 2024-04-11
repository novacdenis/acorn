import React from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { queryMather } from "@/utils";

import { useImportDialogContext } from "./import-dialog";
import { getAllCategories } from "../../actions";
import { CategoryForm } from "../category-form";

export const MappingStep: React.FC = () => {
  const [isCategoryFormOpen, setIsCategoryFormOpen] = React.useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = React.useState<string | null>(null);

  const { isMobile, mapping, onCancelMapping, onStartImport } = useImportDialogContext();
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await getAllCategories(),
  });

  const queryClient = useQueryClient();
  const form = useForm<Record<string, number | undefined>>({
    defaultValues: {
      ...mapping,
    },
  });

  const Header = isMobile ? DrawerHeader : DialogHeader;
  const Title = isMobile ? DrawerTitle : DialogTitle;
  const Description = isMobile ? DrawerDescription : DialogDescription;
  const Footer = isMobile ? DrawerFooter : DialogFooter;

  return (
    <>
      <Header>
        <Title>Map categories</Title>
        <Description>
          Map categories extracted from your transactions to existing categories in your account.
        </Description>
      </Header>

      <Form {...form}>
        <form
          className="space-y-4 rounded-2xl border border-primary/10 bg-primary/5 p-2.5"
          onSubmit={form.handleSubmit(onStartImport)}
        >
          {Object.keys(mapping).map((name) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{name}</FormLabel>
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
                        setSelectedCategoryName(name);
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
          ))}
        </form>
      </Form>

      <Footer>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="secondary">Cancel</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                If you cancel now, all your progress will be lost. Are you sure you want to cancel?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Go back</AlertDialogCancel>
              <AlertDialogAction onClick={onCancelMapping}>Yes, cancel</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button>Confirm mapping</Button>
      </Footer>

      <CategoryForm
        key={selectedCategoryName}
        open={isCategoryFormOpen}
        onClose={() => {
          setIsCategoryFormOpen(false);
          setSelectedCategoryName(null);
        }}
        onSubmitSuccess={async (category) => {
          await queryClient.refetchQueries({ predicate: queryMather(["categories"]) });
          if (selectedCategoryName) {
            form.setValue(selectedCategoryName, category.id);
          }
        }}
        defaultValues={{
          aliases: selectedCategoryName ? [selectedCategoryName] : [""],
        }}
      />
    </>
  );
};
