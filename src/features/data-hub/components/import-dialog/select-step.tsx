"use client";

import React from "react";
import { ArrowUpIcon } from "@heroicons/react/20/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMediaQuery } from "@/hooks";
import { bytesToSize, cn } from "@/utils";

import { useImportDialogContext, useImportDialogStore } from "./import-dialog";
import { BANK_OPTIONS } from "../../constants";
import { Step, type Bank, type ProcessedFile } from "../../types";
import { extractTransactions, processFiles } from "../../utils";

export const SelectStep: React.FC = () => {
  const { setIsOpen } = useImportDialogStore((store) => ({ setIsOpen: store.setIsOpen }));
  const { setStep, setTransactions, importTransactions } = useImportDialogContext();

  const [bank, setBank] = React.useState<Bank>();
  const [files, setFiles] = React.useState<ProcessedFile[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);

  const isMobile = useMediaQuery("(max-width: 640px)");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const constraints = bank && BANK_OPTIONS[bank];

  const extractProcessedFiles = async (files: ProcessedFile[]) => {
    for (const file of files) {
      const result = await extractTransactions(file);

      if (result.error) {
        setFiles((prev) =>
          prev.map((f) =>
            f.uid === file.uid ? { ...f, status: "error", error: result.error[file.uid] } : f
          )
        );
      } else {
        setFiles((prev) =>
          prev.map((f) =>
            f.uid === file.uid ? { ...f, status: "done", transactions: result.data } : f
          )
        );
      }
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (bank && e.target.files?.length) {
      const processedFiles = processFiles(Array.from(e.target.files), {
        bank,
        extensions: constraints?.extensions,
        size: constraints?.size,
      });
      setFiles([...processedFiles, ...files]);
      extractProcessedFiles(processedFiles);
    }
    e.target.value = "";
  };

  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    if (bank && e.dataTransfer.files?.length) {
      const processedFiles = processFiles(Array.from(e.dataTransfer.files), {
        bank,
        extensions: constraints?.extensions,
        size: constraints?.size,
      });
      setFiles([...processedFiles, ...files]);
      extractProcessedFiles(processedFiles);
    }
  };

  const onDeleteFile = (uid: string) => {
    setFiles((prev) => prev.filter((file) => file.uid !== uid));
  };

  const onContinue = async () => {
    const transactions = files.flatMap((file) => (file.status === "done" ? file.transactions : []));

    setTransactions(transactions);
    importTransactions(transactions);
    setStep(Step.Progress);
  };

  const Header = isMobile ? DrawerHeader : DialogHeader;
  const Title = isMobile ? DrawerTitle : DialogTitle;
  const Description = isMobile ? DrawerDescription : DialogDescription;
  const Footer = isMobile ? DrawerFooter : DialogFooter;

  const isDropzoneDisabled = !bank;
  const isCancelDisabled = files.some((f) => f.status === "extracting");
  const isContinueDisabled = !files.length || files.some((f) => f.status === "extracting");

  return (
    <>
      <Header>
        <Title>Import transactions</Title>
        <Description>
          Choose your bank and drag/drop or click to upload your transactions.
        </Description>
      </Header>

      <Select value={bank} onValueChange={(v) => setBank(v as Bank)}>
        <SelectTrigger>
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

      <div
        role="button"
        tabIndex={isDropzoneDisabled ? -1 : 0}
        className={cn(
          "rounded-2xl border-2 border-dashed border-primary/10 py-5 transition-colors",
          {
            "cursor-not-allowed opacity-75": isDropzoneDisabled,
            "border-primary/15 bg-primary/5": isDragging,
          }
        )}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!isDropzoneDisabled) {
            setIsDragging(true);
          }
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!isDropzoneDisabled) {
            setIsDragging(false);
          }
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!isDropzoneDisabled) {
            setIsDragging(false);
            onDrop(e);
          } else {
            toast.error("Please select a bank first");
          }
        }}
        onClick={() => {
          if (!isDropzoneDisabled) {
            inputRef.current?.click();
          } else {
            toast.error("Please select a bank first");
          }
        }}
        onKeyDown={(e) => {
          if (!isDropzoneDisabled && e.key === "Enter") {
            if (e.key === "Enter") {
              inputRef.current?.click();
            } else {
              toast.error("Please select a bank first");
            }
          }
        }}
      >
        <div className="pointer-events-none flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary shadow-md">
              <ArrowUpIcon className="h-8 w-8 text-background" />
            </div>
          </div>
          <h3 className="mt-2 text-center text-sm">
            <span className="underline">Click to upload</span> or drag and drop
          </h3>
          <p className="mt-0.5 text-center text-xs">
            <span className="text-primary">Max file size:</span>
            <span className="ml-1 text-muted-foreground">
              {bytesToSize(constraints?.size || 0)}
            </span>
          </p>
        </div>
      </div>

      {!!files.length && (
        <ul className="space-y-2">
          {files.map((file) => (
            <li
              key={file.uid}
              className={cn("rounded-xl bg-primary/5 p-3 transition-opacity", {
                "opacity-75": file.status === "extracting",
              })}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center">
                    <h3 className="truncate text-sm">{file.name}</h3>
                    <h4 className="text-sm">.{file.extension}</h4>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    <span>{bytesToSize(file.size)}</span>
                    <span className="mx-1 inline-block">•</span>
                    <span>
                      {file.status === "done" ? file.transactions.length : "0"} transactions
                    </span>
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-3"
                  disabled={file.status === "extracting"}
                  onClick={() => onDeleteFile(file.uid)}
                >
                  <TrashIcon className="h-5 w-5" />
                </Button>
              </div>

              {file.status === "error" && <p className="mt-1 text-sm text-red-500">{file.error}</p>}
            </li>
          ))}
        </ul>
      )}

      <Footer>
        <Button variant="ghost" disabled={isCancelDisabled} onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button disabled={isContinueDisabled} onClick={onContinue}>
          Continue
        </Button>
      </Footer>

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
