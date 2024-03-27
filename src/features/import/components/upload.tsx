"use client";

import type { Bank, ExtractedTransaction } from "../types";

import React from "react";
import { ArrowUpIcon } from "@heroicons/react/20/solid";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { validateFile } from "@/utils";

import { BANK_OPTIONS } from "../constants";
import { VBHtmlParser } from "../utils";

export const Upload: React.FC = () => {
  const [bank, setBank] = React.useState<Bank>();
  const [error, setError] = React.useState<string>(
    "An error occurred while parsing the file. Please try again later."
  );

  const inputRef = React.useRef<HTMLInputElement>(null);
  const constraints = bank && BANK_OPTIONS[bank];

  // const onUpload = async (file: File) => {
  //   // const error = validateFile(file, {
  //   //   size: constraints?.size,
  //   //   extensions: constraints?.extensions,
  //   // });
  //   // if (error) {
  //   //   return toast.error(error);
  //   // }
  //   // try {
  //   //   // const html = await file.text();
  //   //   // const parser = new VBHtmlParser(html);
  //   //   // const transactions = parser.parse();
  //   // } catch (error) {
  //   //   console.error(error);
  //   // }
  // };

  const extractTransactions = async (bank: Bank, file: File) => {
    const error = validateFile(file, {
      size: constraints?.size,
      extensions: constraints?.extensions,
    });

    if (error) {
      return toast.error(error);
    }

    try {
      const html = await file.text();
      let transactions: ExtractedTransaction[] = [];

      if (bank === "vb") {
        const parser = new VBHtmlParser(html);
        transactions = parser.parse();
      }

      if (!transactions.length) {
        throw new Error("No transactions found in the file.");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred while parsing the file. Please try again later.");
      }
    }
  };

  const onBankChange = (value: string) => {
    setBank(value as Bank);
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (bank && event.target.files?.length) {
      extractTransactions(bank, event.target.files[0]);
    }
    event.target.value = "";
  };

  return (
    <>
      <div className="mx-auto flex max-w-72 flex-col items-center rounded-2xl py-16 md:py-24">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-md">
            <ArrowUpIcon className="h-8 w-8 text-background" />
          </div>
        </div>

        <h3 className="mt-4 text-lg text-primary">Import operations</h3>
        <p className="mt-px text-center text-sm leading-normal text-muted-foreground">
          Choose your bank and drag/drop or click <span className="underline">Select a file</span>{" "}
          to upload your transactions.
        </p>
        <Select value={bank} onValueChange={onBankChange}>
          <SelectTrigger className="mt-5">
            <SelectValue placeholder="Select a bank" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(BANK_OPTIONS).map((option) => (
              <SelectItem
                key={option.id}
                value={option.id}
                textValue={option.label}
                disabled={option.disabled}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className="mt-4 w-full" disabled={!bank} onClick={() => inputRef.current?.click()}>
          <CloudArrowUpIcon className="h-5 w-5" />
          <span className="ml-2">Select a file</span>
        </Button>
        {error && <p className="mt-2 text-center text-sm text-red-500">{error}</p>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={constraints?.extensions.join(",")}
        className="hidden"
        onChange={onInputChange}
      />
    </>
  );
};
