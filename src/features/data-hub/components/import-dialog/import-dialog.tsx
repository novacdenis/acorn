"use client";

import type {
  CategoryMapping,
  ExtractedTransaction,
  ExtractedTransactionStatus,
} from "../../types";

import React from "react";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks";
import { getApiErrorMessage } from "@/utils";

import { MappingStep } from "./mapping-step";
import { ProgressStep } from "./progress-step";
import { ReviewStep } from "./review-step";
import { SelectStep } from "./select-step";
import { createTransaction } from "../../actions";
import { useImportDialogStore } from "../../store";

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

interface TransactionsStore {
  transactions: ExtractedTransaction[];
  setTransactions: (transactions: ExtractedTransaction[]) => void;
  mappings: CategoryMapping[];
  setMappings: (mappings: CategoryMapping[]) => void;
}

const useTransactionsStore = create<TransactionsStore>((set) => ({
  transactions: [],
  setTransactions: (transactions) => set({ transactions }),
  mappings: [],
  setMappings: (mappings) => set({ mappings }),
}));

interface ImportDialogContextValue {
  isMobile: boolean;
  transactions: ExtractedTransaction[];
  mappings: CategoryMapping[];
  progress: ImportProgress;
  updateTransaction: (uid: string, status: ExtractedTransactionStatus) => void;
  abortImport: () => void;
  onSelectComplete: (transactions: ExtractedTransaction[], mappings: CategoryMapping[]) => void;
  onMappingComplete: (mappings: CategoryMapping[]) => void;
  onProgressComplete: () => void;
  onCloseImport: () => void;
}

const ImportDialogContext = React.createContext<ImportDialogContextValue | undefined>(undefined);

export const useImportDialog = () => {
  const context = React.useContext(ImportDialogContext);

  if (!context) {
    throw new Error("useImportDialog must be used within a ImportProvider");
  }
  return context;
};

export const ImportDialog: React.FC = () => {
  const [open, setOpen] = useImportDialogStore(useShallow((store) => [store.open, store.setOpen]));
  const [isCloseAlertOpen, setIsCloseAlertOpen] = React.useState(false);
  const [step, setStep] = React.useState<Step>(Step.Select);
  const [transactions, setTransactions] = useTransactionsStore(
    useShallow((store) => [store.transactions, store.setTransactions])
  );
  const [mappings, setMappings] = useTransactionsStore(
    useShallow((store) => [store.mappings, store.setMappings])
  );
  const [progress, setProgress] = React.useState<ImportProgress>({
    status: "idle",
    total: 0,
    imported: 0,
    failed: 0,
  });

  const isMobile = useMediaQuery("(max-width: 640px)");
  const abortController = React.useRef<AbortController | null>(null);

  const updateTransaction = React.useCallback(
    (uid: string, status: ExtractedTransactionStatus) => {
      const transaction = useTransactionsStore.getState().transactions;

      for (let i = 0; i < transaction.length; i++) {
        if (transaction[i].uid === uid) {
          transaction[i] = { ...transaction[i], ...status };
          break;
        }
      }

      setTransactions(transaction);
    },
    [setTransactions]
  );

  const onImportTransactions = React.useCallback(async () => {
    const transactions = useTransactionsStore.getState().transactions;
    const mappings = useTransactionsStore.getState().mappings;

    setProgress({
      status: "loading",
      total: transactions.length,
      imported: 0,
      failed: 0,
    });
    abortController.current = new AbortController();

    for (const transaction of transactions) {
      if (abortController.current.signal.aborted) {
        updateTransaction(transaction.uid, {
          status: "error",
          error: "Transaction was skipped. Due to import cancellation.",
        });
        setProgress((prev) => ({
          ...prev,
          failed: prev.failed + 1,
        }));
        continue;
      }
      if (transaction.status !== "pending") {
        continue;
      }

      updateTransaction(transaction.uid, { status: "loading" });

      try {
        const mapping = mappings.find((m) => m.alias === transaction.data.category_alias);

        if (mapping?.category_id) {
          await createTransaction({
            description: transaction.data.description,
            amount: transaction.data.amount,
            timestamp: transaction.data.timestamp,
            category_id: mapping.category_id,
          });
          updateTransaction(transaction.uid, { status: "done" });
        } else {
          updateTransaction(transaction.uid, { status: "skipped" });
        }

        setProgress((prev) => ({
          ...prev,
          imported: prev.imported + 1,
        }));
      } catch (error) {
        updateTransaction(transaction.uid, {
          status: "error",
          error: getApiErrorMessage(error, "An error occurred while importing transaction."),
        });
        setProgress((prev) => ({
          ...prev,
          failed: prev.failed + 1,
        }));
      }
    }

    setProgress((prev) => ({
      ...prev,
      status: abortController.current?.signal.aborted ? "cancelled" : "done",
    }));
  }, [updateTransaction]);

  const abortImport = React.useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
    }
  }, []);

  const onSelectComplete = React.useCallback(
    (transactions: ExtractedTransaction[], mappings: CategoryMapping[]) => {
      setTransactions(transactions);
      setMappings(mappings);

      if (mappings.some((m) => !m.category_id)) {
        setStep(Step.Mapping);
      } else {
        setStep(Step.Progress);
        onImportTransactions();
      }
    },
    [setTransactions, setMappings, onImportTransactions]
  );

  const onMappingComplete = React.useCallback(
    (mappings: CategoryMapping[]) => {
      setStep(Step.Progress);
      setMappings(mappings);
      onImportTransactions();
    },
    [setMappings, onImportTransactions]
  );

  const onProgressComplete = React.useCallback(() => {
    setStep(Step.Review);
  }, []);

  const onResetState = React.useCallback(() => {
    setOpen(false);
    setTimeout(() => {
      setStep(Step.Select);
      setTransactions([]);
      setMappings([]);
    }, 200);
  }, [setOpen, setTransactions, setMappings]);

  const onCloseImport = React.useCallback(() => {
    if (step !== Step.Select) {
      onResetState();
    } else {
      setIsCloseAlertOpen(true);
    }
  }, [step, onResetState]);

  const Root = isMobile ? Drawer : Dialog;
  const Content = isMobile ? DrawerContent : DialogContent;

  const value = React.useMemo(
    () => ({
      isMobile,
      transactions,
      mappings,
      progress,
      updateTransaction,
      abortImport,
      onSelectComplete,
      onMappingComplete,
      onProgressComplete,
      onCloseImport,
    }),
    [
      isMobile,
      transactions,
      mappings,
      progress,
      updateTransaction,
      abortImport,
      onSelectComplete,
      onMappingComplete,
      onProgressComplete,
      onCloseImport,
    ]
  );

  return (
    <ImportDialogContext.Provider value={value}>
      <Root
        open={open}
        onOpenChange={(value) => {
          if (value === false) {
            onCloseImport();
          }
        }}
      >
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

          <AlertDialog open={isCloseAlertOpen} onOpenChange={setIsCloseAlertOpen}>
            <AlertDialogOverlay className="absolute rounded-2xl">
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Discard changes?</AlertDialogTitle>
                  <AlertDialogDescription>
                    There are unsaved changes. Are you sure you want to close the panel? Your
                    changes will be lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onResetState}>Discard</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </Content>
      </Root>
    </ImportDialogContext.Provider>
  );
};
