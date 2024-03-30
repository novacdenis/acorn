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
import { createClient } from "@/lib/supabase/client";
import { getApiErrorMessage } from "@/utils";

import { ProgressStep } from "./progress-step";
import { ReviewStep } from "./review-step";
import { UploadStep } from "./upload-step";
import { createTransaction } from "../../actions";

export const enum Step {
  Upload = "upload",
  Progress = "progress",
  Review = "review",
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
  onStartImport: (files: ExtractedTransaction[]) => Promise<void>;
  onCancelImport: () => void;
  onFinishImport: () => void;
  onStartImportReview: () => void;
  onFinishImportReview: () => void;
}

export const ImportDialogContext = React.createContext<ImportDialogContextValue | undefined>(
  undefined
);

export const useImportDialogContext = () => {
  const context = React.useContext(ImportDialogContext);

  if (!context) {
    throw new Error("useImportContext must be used within a ImportProvider");
  }
  return context;
};

export const ImportDialog: React.FC = () => {
  const [open, onOpenChange] = useImportDialogStore(
    useShallow((state) => [state.open, state.onOpenChange])
  );
  const [step, setStep] = React.useState(Step.Upload);
  const [transactions, setTransactions] = React.useState<ExtractedTransaction[]>([]);
  const [progress, setProgress] = React.useState<ImportProgress>({
    status: "idle",
    total: 0,
    imported: 0,
    failed: 0,
  });

  const isMobile = useMediaQuery("(max-width: 640px)");
  const abortController = React.useRef<AbortController | null>(null);

  const resetImportState = React.useCallback(() => {
    onOpenChange(false);
    setTimeout(() => {
      setTransactions([]);
      setProgress({ status: "idle", total: 0, imported: 0, failed: 0 });
      setStep(Step.Upload);
    });
  }, [onOpenChange]);

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

  const onStartImport = React.useCallback(
    async (transactions: ExtractedTransaction[]) => {
      setTransactions(transactions);
      setStep(Step.Progress);
      setProgress((prev) => ({
        ...prev,
        status: "loading",
        total: transactions.length,
      }));

      const supabase = createClient();
      abortController.current = new AbortController();

      for (const transaction of transactions) {
        if (abortController.current.signal.aborted) {
          break;
        }

        updateTransaction(transaction.uid, { status: "loading" });

        try {
          const REMOVE_AFTER_TEST = true;
          if (REMOVE_AFTER_TEST) {
            throw new Error("Test error");
          }

          const category = await supabase
            .from("categories")
            .select("id")
            .contains("aliases", [transaction.data.category])
            .single();

          if (category.error) {
            throw new Error(category.error.message);
          }

          const response = await createTransaction({
            description: transaction.data.description,
            category_id: category.data.id,
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

      setProgress((prev) => ({
        ...prev,
        status: abortController.current?.signal.aborted ? "cancelled" : "done",
      }));
    },
    [updateTransaction]
  );

  const onCancelImport = React.useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
    }
  }, []);

  const onFinishImport = React.useCallback(() => {
    resetImportState();
  }, [resetImportState]);

  const onStartImportReview = React.useCallback(() => {
    setStep(Step.Review);
  }, []);

  const onFinishImportReview = React.useCallback(() => {
    resetImportState();
  }, [resetImportState]);

  const Root = isMobile ? Drawer : Dialog;
  const Content = isMobile ? DrawerContent : DialogContent;

  const value = React.useMemo(
    () => ({
      isMobile,
      transactions,
      progress,
      onStartImport,
      onCancelImport,
      onFinishImport,
      onStartImportReview,
      onFinishImportReview,
    }),
    [
      isMobile,
      transactions,
      progress,
      onStartImport,
      onCancelImport,
      onFinishImport,
      onStartImportReview,
      onFinishImportReview,
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
          {step === Step.Upload && <UploadStep />}
          {step === Step.Progress && <ProgressStep />}
          {step === Step.Review && <ReviewStep />}
        </Content>
      </Root>
    </ImportDialogContext.Provider>
  );
};
