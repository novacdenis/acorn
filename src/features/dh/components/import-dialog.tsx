"use client";

import type {
  ExtractedTransaction,
  ExtractedTransactionBase,
  ExtractedTransactionStatus,
} from "../types";

import React from "react";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks";

import { ProgressStep } from "./progress-step";
import { UploadStep } from "./upload-step";

export const enum Step {
  Upload = "upload",
  Progress = "progress",
  Review = "review",
}

export interface ImportProgress {
  status: "idle" | "loading" | "pause" | "done";
  total: number;
  imported: number;
  failed: number;
}

export interface ImportDialogStore {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useImportDialogStore = create<ImportDialogStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));

export interface ImportDialogContextValue {
  isMobile: boolean;
  transactions: ExtractedTransaction[];
  progress: ImportProgress;
  updateTransaction: (uid: string, status: ExtractedTransactionStatus) => void;
  removeTransaction: (uid: string) => void;
  onStartImport: (files: ExtractedTransaction[]) => Promise<void>;
  onCancelImport: () => void;
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

const mockImport = async () => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.05) {
        reject();
      } else {
        resolve();
      }
    }, Math.random() * 300);
  });
};

export const ImportDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useImportDialogStore(
    useShallow((state) => [state.isOpen, state.setIsOpen])
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

  const removeTransaction = React.useCallback((uid: string) => {
    setTransactions((prev) => prev.filter((t) => t.uid !== uid));
  }, []);

  const onStartImport = React.useCallback(
    async (transactions: ExtractedTransaction[]) => {
      setTransactions(transactions);
      setStep(Step.Progress);

      const controller = new AbortController();
      abortController.current = controller;

      setProgress((prev) => ({
        ...prev,
        status: "loading",
        total: transactions.length,
      }));

      for (const transaction of transactions) {
        if (controller.signal.aborted) {
          setProgress((prev) => ({
            ...prev,
            status: "pause",
          }));
          break;
        }

        try {
          updateTransaction(transaction.uid, { status: "loading" });

          await mockImport();

          setProgress((prev) => ({
            ...prev,
            imported: prev.imported + 1,
          }));
          updateTransaction(transaction.uid, { status: "done" });
        } catch {
          setProgress((prev) => ({
            ...prev,
            failed: prev.failed + 1,
          }));
          updateTransaction(transaction.uid, { status: "error" });
        }
      }

      setProgress((prev) => ({
        ...prev,
        status: "done",
      }));
    },
    [updateTransaction]
  );

  const onCancelImport = React.useCallback(() => {
    abortController.current?.abort();
  }, []);

  const Root = isMobile ? Drawer : Dialog;
  const Content = isMobile ? DrawerContent : DialogContent;

  const value = React.useMemo(
    () => ({
      isMobile,
      transactions,
      progress,
      updateTransaction,
      removeTransaction,
      onStartImport,
      onCancelImport,
    }),
    [
      isMobile,
      transactions,
      progress,
      updateTransaction,
      removeTransaction,
      onStartImport,
      onCancelImport,
    ]
  );

  return (
    <ImportDialogContext.Provider value={value}>
      <Root open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <Root open={isOpen} onOpenChange={setIsOpen}>
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
          </Content>
        </Root>
      </Root>
    </ImportDialogContext.Provider>
  );
};
