"use client";

import type {
  CategoryMapping,
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

import { MappingStep } from "./mapping-step";
import { ProgressStep } from "./progress-step";
import { ReviewStep } from "./review-step";
import { SelectStep } from "./select-step";
import { createTransaction } from "../../actions";

export const enum Step {
  Select = "select",
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
  transactions: ExtractedTransaction[];
  mappings: CategoryMapping[];
  progress: ImportProgress;
  resetState: () => void;
  updateMapping: (alias: string, id?: number) => void;
  updateTransaction: (uid: string, status: ExtractedTransactionStatus) => void;
  startMapping: (transactions: ExtractedTransaction[]) => Promise<void>;
  startImport: () => Promise<void>;
  abortImport: () => void;
  startReview: () => void;
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
  const [mappings, setMappings] = React.useState<CategoryMapping[]>([]);
  const [transactions, setTransactions] = React.useState<ExtractedTransaction[]>([]);
  const [progress, setProgress] = React.useState<ImportProgress>({
    status: "idle",
    total: 0,
    imported: 0,
    failed: 0,
  });

  const isMobile = useMediaQuery("(max-width: 640px)");
  const abortController = React.useRef<AbortController | null>(null);

  const resetState = React.useCallback(() => {
    onOpenChange(false);
    setTimeout(() => {
      setStep(Step.Select);
      setMappings([]);
      setTransactions([]);
      setProgress({ status: "idle", total: 0, imported: 0, failed: 0 });
    }, 200);
  }, [onOpenChange]);

  const updateMapping = React.useCallback((alias: string, id?: number) => {
    setMappings((prev) =>
      prev.map((mapping) => {
        if (mapping.alias === alias) {
          return { ...mapping, id };
        }

        return mapping;
      })
    );
  }, []);

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

  const startMapping = React.useCallback(async (transactions: ExtractedTransaction[]) => {
    const supabase = createClient();
    const aliases = Array.from(new Set(transactions.map((t) => t.data.category)));
    const mappings: CategoryMapping[] = [];

    const response = await supabase.from("categories").select("*").containedBy("aliases", aliases);

    if (response.data) {
      for (const alias of aliases) {
        const category = response.data.find((c) => c.aliases.includes(alias));
        mappings.push({ alias, id: category?.id });
      }
    }

    setStep(Step.Mapping);
    setMappings(mappings);
    setTransactions(transactions);
  }, []);

  const startImport = React.useCallback(async () => {
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
        const category = mappings.find(
          (mapping) => mapping.alias === transaction.data.category
        )?.id;

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
  }, [mappings, transactions, updateTransaction]);

  const abortImport = React.useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
    }
  }, []);

  const startReview = React.useCallback(() => {
    setStep(Step.Review);
  }, []);

  const Root = isMobile ? Drawer : Dialog;
  const Content = isMobile ? DrawerContent : DialogContent;

  const value = React.useMemo(
    () => ({
      isMobile,
      mappings,
      transactions,
      progress,
      resetState,
      updateMapping,
      updateTransaction,
      startMapping,
      startImport,
      abortImport,
      startReview,
    }),
    [
      isMobile,
      mappings,
      transactions,
      progress,
      resetState,
      updateMapping,
      updateTransaction,
      startMapping,
      startImport,
      abortImport,
      startReview,
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
          {step === Step.Review && <ReviewStep />}
        </Content>
      </Root>
    </ImportDialogContext.Provider>
  );
};
