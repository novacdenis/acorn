"use client";

import type { ExtractedTransaction } from "../../types";

import React from "react";
import { CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import * as v from "valibot";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMediaQuery } from "@/hooks";
import { cn } from "@/utils";

import { useImportDialogStore } from "./import-dialog";

const scheme = v.object({
  description: v.string([v.minLength(1, "Description is required")]),
  categoryId: v.number(),
  amount: v.string([v.minLength(1, "Amount is required")]),
  date: v.string([v.minLength(1, "Date is required")]),
  time: v.string([v.minLength(1, "Time is required")]),
});

v.date();

type FormInput = v.Input<typeof scheme>;

interface ReviewTransactionProps {
  transaction: ExtractedTransaction;
  onSkipAll: () => void;
  onSkip: () => void;
  onNext: () => void;
}

const ReviewTransaction: React.FC<ReviewTransactionProps> = ({
  transaction,
  onSkipAll,
  onSkip,
  onNext,
}) => {
  const form = useForm<FormInput>({
    mode: "onChange",
    defaultValues: {
      description: "",
      categoryId: undefined,
      amount: "",
      date: "",
      time: "",
    },
    resolver: valibotResolver(scheme),
  });
  const isMobile = useMediaQuery("(max-width: 640px)");

  const onSubmit = (values: FormInput) => {
    console.log(values);
  };

  React.useEffect(() => {
    form.setError("description", { type: "required", message: "Description is required" });
  }, [form]);

  const Footer = isMobile ? DrawerFooter : DialogFooter;

  return (
    <>
      <Form {...form}>
        <form
          className="space-y-4 rounded-2xl border border-primary/10 bg-primary/5 p-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter a description" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  name={field.name}
                  value={field.value?.toString()}
                  onValueChange={(v) => field.onChange(v)}
                >
                  <FormControl>
                    <SelectTrigger
                      ref={field.ref}
                      className={cn("bg-background text-base", {
                        "text-muted-foreground": !field.value,
                      })}
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="m@example.com">m@example.com</SelectItem>
                    <SelectItem value="m@google.com">m@google.com</SelectItem>
                    <SelectItem value="m@support.com">m@support.com</SelectItem>
                  </SelectContent>
                </Select>
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
                  <Input {...field} placeholder="Enter an amount" />
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
                  <FormControl>
                    <fieldset className="relative">
                      <Input
                        {...field}
                        className="pr-10"
                        type="date"
                        pattern="\d{2}\/\d{2}\/\d{4}"
                        max={new Date().toISOString().split("T")[0]}
                        onFocus={(e) => {
                          if (e.isTrusted) {
                            e.currentTarget.showPicker();
                          }
                        }}
                      />
                      <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    </fieldset>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <fieldset className="relative">
                      <Input
                        {...field}
                        type="time"
                        className="pr-10"
                        onFocus={(e) => {
                          if (e.isTrusted) {
                            e.currentTarget.showPicker();
                          }
                        }}
                      />
                      <ClockIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    </fieldset>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>

      <Footer className="justify-between">
        <Button variant="ghost">Skip all</Button>
        <div className="flex items-center gap-2">
          <Button variant="ghost">Skip</Button>
          <Button onClick={form.handleSubmit(onSubmit)}>Continue</Button>
        </div>
      </Footer>
    </>
  );
};

export const ReviewStep: React.FC = () => {
  const { setIsOpen } = useImportDialogStore((store) => ({ setIsOpen: store.setIsOpen }));

  const isMobile = useMediaQuery("(max-width: 640px)");

  const Header = isMobile ? DrawerHeader : DialogHeader;
  const Title = isMobile ? DrawerTitle : DialogTitle;
  const Description = isMobile ? DrawerDescription : DialogDescription;

  return (
    <>
      <Header>
        <Title>Review data</Title>
        <Description>Review the imported data before saving it.</Description>
      </Header>

      <div className="overflow-hidden">
        <Progress value={50} />
        <p className="mt-1 flex items-center justify-between text-sm font-medium text-muted-foreground">
          Reviewed 1 of 2
        </p>
      </div>

      <ReviewTransaction />
    </>
  );
};
