"use client";

import type { Bank, ExtractedTransaction } from "../../types";

import React from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/16/solid";
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
import { Spinner } from "@/components/ui/spinner";
import { bytesToSize, cn, formatNumber, validateFile } from "@/utils";

import { useImportDialog } from "./import-dialog";
import { BANK_OPTIONS } from "../../constants";
import { VBHtmlParser } from "../../utils";

interface ProcessedFilePendingStatus {
  status: "pending";
}

interface ProcessedFileDoneStatus {
  status: "done";
  transactions: ExtractedTransaction[];
}

interface ProcessedFileErrorStatus {
  status: "error";
  error: string;
}

interface ProcessedFileBase {
  uid: string;
  name: string;
  extension: string;
  size: number;
  originalFile: File;
  bank: Bank;
}

type ProcessedFileStatus =
  | ProcessedFilePendingStatus
  | ProcessedFileDoneStatus
  | ProcessedFileErrorStatus;

type ProcessedFile = ProcessedFileBase & ProcessedFileStatus;

const processFiles = (files: File[], config: { bank: Bank }) => {
  const processedFiles: ProcessedFile[] = [];

  for (const file of files) {
    const constraints = BANK_OPTIONS[config.bank];
    const error = validateFile(file, {
      extensions: constraints?.extensions,
      size: constraints?.size,
    });

    processedFiles.push({
      uid: Math.random().toString(36).substring(2, 9),
      name: file.name.split(".").slice(0, -1).join("."),
      extension: file.name.split(".").pop() || "",
      size: file.size,
      originalFile: file,
      bank: config.bank,
      ...(error ? { status: "error", error } : { status: "pending" }),
    });
  }

  return processedFiles;
};

const extractTransactions = async (file: ProcessedFile) => {
  try {
    const text = await file.originalFile.text();
    const parser = { vb: new VBHtmlParser(text) }[file.bank];
    const transactions = parser.parse();

    if (transactions.length === 0) {
      throw new Error("No transactions found in the file.");
    }

    return { data: transactions, error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { data: null, error: error.message };
    }

    return { data: null, error: "Something went wrong while reading the file." };
  }
};

interface UploadStepFileStatusProps {
  file: ProcessedFile;
}

const UploadStepFileStatus: React.FC<UploadStepFileStatusProps> = ({ file }) => {
  if (file.status === "error") {
    return <p className="text-sm text-red-500">{file.error}</p>;
  }

  return (
    <p className="text-sm font-medium text-muted-foreground">
      <span>{bytesToSize(file.size)}</span>
      <span className="mx-1 inline-block">•</span>
      <span>
        {file.status === "done"
          ? `${formatNumber(file.transactions.length, { notation: "compact" })} transactions`
          : "Processing file..."}
      </span>
    </p>
  );
};

interface FileProps {
  file: ProcessedFile;
  onRemove: () => void;
}

const File: React.FC<FileProps> = ({ file, onRemove }) => {
  return (
    <li
      className={cn("rounded-xl bg-primary/5 p-3", {
        "animate-pulse": file.status === "pending",
      })}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center">
            {file.status === "pending" && <Spinner isLoading className="h-4 w-4" />}
            {file.status === "done" && <CheckCircleIcon className="h-4 w-4" />}
            {file.status === "error" && <XCircleIcon className="h-4 w-4" />}

            <h3 className="ml-1.5 truncate">{file.name}</h3>
            <h4 className="">.{file.extension}</h4>
          </div>
          <UploadStepFileStatus file={file} />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="ml-3"
          disabled={file.status === "pending"}
          onClick={onRemove}
        >
          <TrashIcon className="h-5 w-5" />
        </Button>
      </div>
    </li>
  );
};

export const SelectStep: React.FC = () => {
  const { isMobile, startMapping, resetState } = useImportDialog();

  const [bank, setBank] = React.useState<Bank>();
  const [files, setFiles] = React.useState<ProcessedFile[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isFinishing, setIsFinishing] = React.useState(false);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const constraints = bank && BANK_OPTIONS[bank];

  const updateFile = (uid: string, status: ProcessedFileStatus) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.uid === uid) {
          const base: ProcessedFileBase = {
            uid: f.uid,
            name: f.name,
            extension: f.extension,
            size: f.size,
            originalFile: f.originalFile,
            bank: f.bank,
          };

          return { ...base, ...status };
        }

        return f;
      })
    );
  };

  const removeFile = (uid: string) => {
    setFiles((prev) => prev.filter((f) => f.uid !== uid));
  };

  const extractNewFilesTransactions = async (newFiles: ProcessedFile[]) => {
    for (const newFile of newFiles) {
      extractTransactions(newFile).then((result) => {
        if (result.data) {
          updateFile(newFile.uid, { status: "done", transactions: result.data });
        } else {
          updateFile(newFile.uid, { status: "error", error: result.error });
        }
      });
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (bank && e.target.files?.length) {
      const newProcessedFiles = processFiles(Array.from(e.target.files), { bank });
      setFiles([...newProcessedFiles, ...files]);
      extractNewFilesTransactions(newProcessedFiles.filter((f) => f.status === "pending"));
    }
    e.target.value = "";
  };

  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    if (bank && e.dataTransfer.files?.length) {
      const newProcessedFiles = processFiles(Array.from(e.dataTransfer.files), { bank });
      setFiles([...newProcessedFiles, ...files]);
      extractNewFilesTransactions(newProcessedFiles.filter((f) => f.status === "pending"));
    }
  };

  const onContinue = async () => {
    setIsFinishing(true);
    await startMapping(files.flatMap((file) => (file.status === "done" ? file.transactions : [])));
  };

  const Header = isMobile ? DrawerHeader : DialogHeader;
  const Title = isMobile ? DrawerTitle : DialogTitle;
  const Description = isMobile ? DrawerDescription : DialogDescription;
  const Footer = isMobile ? DrawerFooter : DialogFooter;

  const areFilesInPendingState = files.some((f) => f.status === "pending");
  const areSomeFilesDone = files.some((f) => f.status === "done");

  const isUploadEnabled = !!bank && !areFilesInPendingState && !isFinishing;
  const isCancelEnabled = !areFilesInPendingState && !isFinishing;
  const isContinueEnabled = !areFilesInPendingState && areSomeFilesDone && !isFinishing;

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
        tabIndex={isUploadEnabled ? 0 : -1}
        className={cn(
          "rounded-2xl border-2 border-dashed border-primary/10 py-5 transition-colors",
          {
            "cursor-not-allowed opacity-75": !isUploadEnabled,
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
          if (isUploadEnabled) {
            setIsDragging(true);
          }
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (isUploadEnabled) {
            setIsDragging(false);
          }
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (isUploadEnabled) {
            setIsDragging(false);
            onDrop(e);
          } else {
            toast.error("Please select a bank first");
          }
        }}
        onClick={() => {
          if (isUploadEnabled) {
            inputRef.current?.click();
          } else {
            toast.error("Please select a bank first");
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (isUploadEnabled) {
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
            <File key={file.uid} file={file} onRemove={() => removeFile(file.uid)} />
          ))}
        </ul>
      )}

      <Footer>
        <Button variant="secondary" disabled={!isCancelEnabled} onClick={resetState}>
          Cancel
        </Button>
        <Button disabled={!isContinueEnabled} isLoading={isFinishing} onClick={onContinue}>
          Continue
        </Button>
      </Footer>

      <input
        ref={inputRef}
        multiple
        type="file"
        accept={constraints?.extensions.join(",")}
        className="hidden"
        onChange={onInputChange}
      />
    </>
  );
};
