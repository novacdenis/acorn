"use client";

import type {
  ExtractedTransaction,
  ExtractedTransactionBase,
  ExtractedTransactionStatus,
} from "../../types";

import React from "react";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks";
import { getApiErrorMessage } from "@/utils";

import { MappingStep } from "./mapping-step";
import { ProgressStep } from "./progress-step";
import { SelectStep } from "./select-step";
import { createTransaction } from "../../actions";

export const enum Step {
  Select = "select",
  Mapping = "mapping",
  Progress = "progress",
}

export interface ImportProgress {
  status: "idle" | "loading" | "cancelled" | "done";
  total: number;
  imported: number;
  failed: number;
}

export interface ImportProgress {
  status: "idle" | "loading" | "cancelled" | "done";
  total: number;
  imported: number;
  failed: number;
}

export interface ImportDialogStore {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

export const useImportDialogStore = create<ImportDialogStore>((set) => ({
  open: false,
  onOpenChange: (value) => set({ open: value }),
}));

export interface ImportDialogContextValue {
  isMobile: boolean;
  transactions: ExtractedTransaction[];
  progress: ImportProgress;
  updateTransaction: (uid: string, status: ExtractedTransactionStatus) => void;
  startMapping: (transactions: ExtractedTransaction[]) => void;
  startImport: (transactions: ExtractedTransaction[], category_id: number) => void;
  abortImport: () => void;
  resetState: () => void;
}

export const ImportDialogContext = React.createContext<ImportDialogContextValue | undefined>(
  undefined
);

export const useImportDialog = () => {
  const context = React.useContext(ImportDialogContext);

  if (!context) {
    throw new Error("useImportDialog must be used within a ImportProvider");
  }
  return context;
};

export const ImportDialog: React.FC = () => {
  const [open, onOpenChange] = useImportDialogStore(
    useShallow((state) => [state.open, state.onOpenChange])
  );
  const [step, setStep] = React.useState(Step.Select);
  const [transactions, setTransactions] = React.useState<ExtractedTransaction[]>([]);
  const [progress, setProgress] = React.useState<ImportProgress>({
    status: "idle",
    total: 0,
    imported: 0,
    failed: 0,
  });

  const isMobile = useMediaQuery("(max-width: 640px)");
  const abortController = React.useRef<AbortController>();

  const updateTransaction = React.useCallback((uid: string, status: ExtractedTransactionStatus) => {
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.uid === uid) {
          const base: ExtractedTransactionBase = {
            uid: t.uid,
            data: t.data,
          };

          return { ...base, ...status };
        }

        return t;
      })
    );
  }, []);

  const startMapping = React.useCallback((transactions: ExtractedTransaction[]) => {
    setTransactions(transactions);
    setStep(Step.Mapping);
  }, []);

  const startImport = React.useCallback(
    async (transactions: ExtractedTransaction[], category_id: number) => {
      setStep(Step.Progress);
      setProgress({ status: "loading", total: transactions.length, imported: 0, failed: 0 });

      abortController.current = new AbortController();

      for (const transaction of transactions) {
        if (abortController.current.signal.aborted) {
          break;
        }
        if (transaction.status !== "idle") {
          continue;
        }

        updateTransaction(transaction.uid, { status: "loading" });

        try {
          const response = await createTransaction({
            description: transaction.data.description,
            category_id,
            amount: transaction.data.amount,
            timestamp: transaction.data.timestamp,
          });

          setProgress((prev) => ({
            ...prev,
            imported: prev.imported + 1,
          }));
          updateTransaction(transaction.uid, {
            status: "done",
            response,
          });
        } catch (error) {
          setProgress((prev) => ({
            ...prev,
            failed: prev.failed + 1,
          }));
          updateTransaction(transaction.uid, {
            status: "error",
            error: getApiErrorMessage(error, "An error occurred while importing transaction."),
          });
        }
      }

      setStep(Step.Mapping);
      setProgress((prev) => ({
        ...prev,
        status: abortController.current?.signal.aborted ? "cancelled" : "done",
      }));
    },
    [updateTransaction]
  );

  const abortImport = React.useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
    }
  }, []);

  const resetState = React.useCallback(() => {
    onOpenChange(false);
    setTimeout(() => {
      setStep(Step.Select);
      setTransactions([]);
    }, 200);
  }, [onOpenChange]);

  const Root = isMobile ? Drawer : Dialog;
  const Content = isMobile ? DrawerContent : DialogContent;

  const value = React.useMemo(
    () => ({
      isMobile,
      transactions,
      progress,
      updateTransaction,
      startMapping,
      startImport,
      abortImport,
      resetState,
    }),
    [
      isMobile,
      transactions,
      progress,
      updateTransaction,
      startMapping,
      startImport,
      abortImport,
      resetState,
    ]
  );

  return (
    <ImportDialogContext.Provider value={value}>
      <Root open={open} onOpenChange={onOpenChange}>
        <Content
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {step === Step.Select && <SelectStep />}
          {step === Step.Mapping && <MappingStep />}
          {step === Step.Progress && <ProgressStep />}
        </Content>
      </Root>
    </ImportDialogContext.Provider>
  );
};
