"use client";

import type { Bank } from "../types";

import React from "react";
import { validateFile } from "@/utils";
import { ArrowUpIcon } from "@heroicons/react/16/solid";
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

import { BANK_OPTIONS } from "../constants";
import { VBHtmlParser } from "../utils";

export const Upload: React.FC = () => {
  const [bank, setBank] = React.useState<Bank | null>(null);
  const [constraints, setConstraints] = React.useState<{
    size: number;
    extensions: string[];
  } | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const onUpload = async (bank: Bank, file: File) => {
    const error = validateFile(file, {
      size: constraints?.size,
      extensions: constraints?.extensions,
    });

    if (error) {
      return toast.error(error);
    }

    try {
      // const html = await file.text();
      // const parser = new VBHtmlParser(html);
      // const transactions = parser.parse();
    } catch (error) {
      console.error(error);
    }
  };

  const onChangeBank = (value: string) => {
    const bank = value as Bank;
    setBank(bank);
    setConstraints(BANK_OPTIONS.find((option) => option.value === bank) ?? null);
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (bank && event.target.files?.length) {
      onUpload(bank, event.target.files[0]);
    }
    event.target.value = "";
  };

  return (
    <>
      <div className="flex items-center justify-center rounded-2xl bg-background py-16 md:py-24">
        <div className="flex w-full max-w-80 flex-col items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary">
              <ArrowUpIcon className="h-8 w-8 text-background" />
            </div>
          </div>

          <h3 className="mt-6 text-lg text-primary">Import operations</h3>
          <p className="mt-0.5 text-center text-sm leading-normal text-muted-foreground">
            Select your bank and then click <span className="underline">Select a file</span> to
            choose a file containing your transactions.
          </p>

          <Select onValueChange={onChangeBank}>
            <SelectTrigger className="mt-6">
              <SelectValue placeholder="Select a bank" />
            </SelectTrigger>
            <SelectContent>
              {BANK_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  textValue={option.label}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            className="mt-4 w-full"
            disabled={!bank}
            onClick={() => inputRef.current?.click()}
          >
            <CloudArrowUpIcon className="h-5 w-5" />
            <span className="ml-2">Select a file</span>
          </Button>
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        </div>
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
