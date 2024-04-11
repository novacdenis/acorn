"use client";

import type {
  ExtractedTransaction,
  ExtractedTransactionBase,
  ExtractedTransactionStatus,
} from "../../types";

import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks";
import { createClient } from "@/lib/supabase/client";
import { getApiErrorMessage, queryMather } from "@/utils";

import { MappingStep } from "./mapping-step";
import { ProgressStep } from "./progress-step";
import { ReviewStep } from "./review-step";
import { UploadStep } from "./upload-step";
import { createTransaction } from "../../actions";

export const enum Step {
  Upload = "upload",
  Mapping = "mapping",
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
  mapping: Record<string, number | undefined>;
  transactions: ExtractedTransaction[];
  progress: ImportProgress;
  onStartMapping: (transactions: ExtractedTransaction[]) => Promise<void>;
  onCancelMapping: () => void;
  onStartImport: () => Promise<void>;
  onAbortImport: () => void;
  onDismissImport: () => void;
  onStartImportReview: () => void;
  onDismissImportReview: () => void;
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
  const [mapping, setMapping] = React.useState<Record<string, number | undefined>>({});
  const [transactions, setTransactions] = React.useState<ExtractedTransaction[]>([]);
  const [progress, setProgress] = React.useState<ImportProgress>({
    status: "idle",
    total: 0,
    imported: 0,
    failed: 0,
  });

  const queryClient = useQueryClient();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const abortController = React.useRef<AbortController | null>(null);

  const resetImportState = React.useCallback(() => {
    onOpenChange(false);
    setTimeout(() => {
      setStep(Step.Upload);
      setMapping({});
      setTransactions([]);
      setProgress({ status: "idle", total: 0, imported: 0, failed: 0 });
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

  const onStartMapping = React.useCallback(async (transactions: ExtractedTransaction[]) => {
    const supabase = createClient();
    const categories = Array.from(new Set(transactions.map((t) => t.data.category)));

    for (const category of categories) {
      const response = await supabase
        .from("categories")
        .select("id")
        .contains("aliases", [category])
        .single();

      setMapping((prev) => ({
        ...prev,
        [category]: response.data?.id,
      }));
    }

    setStep(Step.Mapping);
    setTransactions(transactions);
  }, []);

  const onCancelMapping = React.useCallback(() => {
    resetImportState();
  }, [resetImportState]);

  const onStartImport = React.useCallback(async () => {
    setStep(Step.Progress);
    setProgress({
      status: "loading",
      total: transactions.length,
      imported: 0,
      failed: 0,
    });

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
        const category = mapping[transaction.data.category];

        if (!category) {
          throw new Error("Category not found.");
        }

        const response = await createTransaction({
          description: transaction.data.description,
          category_id: category,
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
  }, [mapping, transactions, updateTransaction]);

  const onAbortImport = React.useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
    }
  }, []);

  const onDismissImport = React.useCallback(() => {
    queryClient.refetchQueries({ predicate: queryMather(["transactions", "categories"]) });
    resetImportState();
  }, [queryClient, resetImportState]);

  const onStartImportReview = React.useCallback(() => {
    setStep(Step.Review);
  }, []);

  const onDismissImportReview = React.useCallback(() => {
    queryClient.refetchQueries({ predicate: queryMather(["transactions", "categories"]) });
    resetImportState();
  }, [queryClient, resetImportState]);

  const Root = isMobile ? Drawer : Dialog;
  const Content = isMobile ? DrawerContent : DialogContent;

  const value = React.useMemo(
    () => ({
      isMobile,
      mapping,
      transactions,
      progress,
      onStartMapping,
      onCancelMapping,
      onStartImport,
      onAbortImport,
      onDismissImport,
      onStartImportReview,
      onDismissImportReview,
    }),
    [
      isMobile,
      mapping,
      transactions,
      progress,
      onStartMapping,
      onCancelMapping,
      onStartImport,
      onAbortImport,
      onDismissImport,
      onStartImportReview,
      onDismissImportReview,
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
          {step === Step.Mapping && <MappingStep />}
          {step === Step.Progress && <ProgressStep />}
          {step === Step.Review && <ReviewStep />}
        </Content>
      </Root>
    </ImportDialogContext.Provider>
  );
};
