"use client";

import type { Category, CreateCategoryBody } from "../../types";

import React from "react";
import { PlusIcon } from "@heroicons/react/16/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useFieldArray, useForm } from "react-hook-form";
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
import { useMediaQuery } from "@/hooks";
import { cn, generateRandomHex, getApiErrorMessage } from "@/utils";

import { createCategory, deleteCategory, updateCategory } from "../../actions";

const scheme = v.object({
  name: v.string([
    v.minLength(1, "Name is required"),
    v.maxLength(100, "Name is too long, max 100 characters"),
  ]),
  color: v.string([v.hexColor("Color is not a valid hex color")]),
  aliases: v.array(v.object({ value: v.string([]) })),
});

type FormValues = v.Input<typeof scheme>;

export interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  onSubmitSuccess?: (category: Category) => Promise<void> | void;
  onDeleteSuccess?: (category: Category) => Promise<void> | void;
  defaultValues?: Category;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  open,
  onClose,
  onSubmitSuccess,
  onDeleteSuccess,
  defaultValues,
}) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const isMobile = useMediaQuery("(max-width: 640px)");
  const form = useForm<FormValues>({
    defaultValues: {
      name: defaultValues?.name ?? "",
      color: defaultValues?.color ?? "#000000",
      aliases: (defaultValues?.aliases ?? [""]).map((alias) => ({ value: alias })),
    },
    resolver: valibotResolver(scheme),
  });
  const aliases = useFieldArray({
    control: form.control,
    name: "aliases",
  });
  const aliasesValues = form.watch("aliases");

  const onCloseHandler = () => {
    form.reset();
    onClose();
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const data: CreateCategoryBody = {
        name: values.name,
        color: values.color,
        aliases: values.aliases.map((alias) => alias.value),
      };

      let response: Category | undefined = undefined;

      if (defaultValues?.id) {
        response = await updateCategory(defaultValues.id, data);
      } else {
        response = await createCategory(data);
      }

      if (onSubmitSuccess) {
        await onSubmitSuccess(response);
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
      await deleteCategory(defaultValues.id);

      if (onDeleteSuccess) {
        await onDeleteSuccess(defaultValues);
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
          <Title>{defaultValues ? "Edit" : "Create"} category</Title>
          <Description>
            Category is a way to group your transactions. You can assign a color and aliases to
            easily identify them.
          </Description>
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      autoComplete="off"
                      placeholder="Enter a name"
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <fieldset className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center justify-center px-1">
                        <input
                          type="color"
                          className="h-9 w-9 border"
                          value={field.value}
                          onChange={(e) => form.setValue("color", e.target.value)}
                        />
                      </span>
                      <Input
                        {...field}
                        placeholder="Enter a color"
                        className="pl-11 pr-20"
                        disabled={form.formState.isSubmitting}
                      />
                      <span className="absolute inset-y-0 right-0 flex items-center justify-center px-1">
                        <Button
                          size="sm"
                          onClick={() => form.setValue("color", generateRandomHex())}
                        >
                          Generate
                        </Button>
                      </span>
                    </fieldset>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Aliases (optional)</FormLabel>
              <div className="mt-1 space-y-2">
                {aliases.fields.map((alias, index) => (
                  <FormField
                    key={alias.id}
                    control={form.control}
                    name={`aliases.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <fieldset className="flex items-center">
                          <FormControl>
                            <Input
                              {...field}
                              autoComplete="off"
                              placeholder="Enter an alias"
                              disabled={form.formState.isSubmitting}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && e.currentTarget.value) {
                                  aliases.append({ value: "" });
                                }
                              }}
                            />
                          </FormControl>
                          {index !== 0 && (
                            <Button
                              variant="secondary"
                              size="icon"
                              className="ml-2 shrink-0"
                              onClick={() => aliases.remove(index)}
                              disabled={form.formState.isSubmitting}
                            >
                              <TrashIcon className="h-5 w-5" />
                            </Button>
                          )}
                        </fieldset>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => aliases.append({ value: "" })}
                disabled={
                  form.formState.isSubmitting || !aliasesValues[aliasesValues.length - 1].value
                }
              >
                <PlusIcon className="h-4 w-4" />
                <span className="ml-1.5">Add an alias</span>
              </Button>
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
                    Deleting this category will also delete all transactions associated with it.
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
  );
};
