"use client";

import type { Category } from "../../types";

import React from "react";
import { PlusIcon } from "@heroicons/react/16/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useFieldArray, useForm } from "react-hook-form";
import * as v from "valibot";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { generateRandomHex, getApiErrorMessage } from "@/utils";

import { createCategory } from "../..";

const schema = v.object({
  name: v.string([
    v.minLength(1, "Name is required"),
    v.maxLength(100, "Name is too long, max 100 characters"),
  ]),
  color: v.string([v.hexColor("Color is not a valid hex color")]),
  aliases: v.array(v.object({ value: v.string([]) })),
});

type FormValues = v.Input<typeof schema>;

export interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (category: Category) => void;
  defaultValues?: Category;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  open,
  onClose,
  onSuccess,
  defaultValues,
}) => {
  const form = useForm<FormValues>({
    defaultValues: {
      name: defaultValues?.name ?? "",
      color: defaultValues?.color ?? "#000000",
      aliases: (defaultValues?.aliases ?? [""]).map((alias) => ({ value: alias })),
    },
    resolver: valibotResolver(schema),
  });
  const aliases = useFieldArray({
    control: form.control,
    name: "aliases",
  });
  const aliasesValues = form.watch("aliases");

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await createCategory({
        name: values.name,
        color: values.color,
        aliases: values.aliases.map((alias) => alias.value),
      });
      form.reset();
      onSuccess(response);
    } catch (error) {
      form.setError("root", { type: "manual", message: getApiErrorMessage(error) });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (value === false) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create category</DialogTitle>
          <DialogDescription>Create a new category to group your transactions</DialogDescription>
        </DialogHeader>

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
              <FormLabel>Aliases</FormLabel>

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

        <DialogFooter>
          <Button
            variant="secondary"
            disabled={form.formState.isSubmitting}
            onClick={() => {
              form.reset();
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button disabled={form.formState.isSubmitting} onClick={form.handleSubmit(onSubmit)}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
