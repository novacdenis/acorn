"use client";

import React from "react";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks";
import { createClient } from "@/lib/supabase/client";

import { ProgressStep } from "./progress-step";
import { ReviewStep } from "./review-step";
import { SelectStep } from "./select-step";
import { Step, type ExtractedTransaction } from "../../types";

export interface ImportDialogStore {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useImportDialogStore = create<ImportDialogStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));

export interface ImportDialogContextValue {
  step: Step;
  transactions: ExtractedTransaction[];
  setStep: React.Dispatch<React.SetStateAction<Step>>;
  setTransactions: React.Dispatch<React.SetStateAction<ExtractedTransaction[]>>;
  updateTransaction: (uid: string, fields: Partial<ExtractedTransaction>) => void;
  importTransactions: (transactions: ExtractedTransaction[]) => Promise<void>;
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
  const [isOpen, setIsOpen] = useImportDialogStore(
    useShallow((state) => [state.isOpen, state.setIsOpen])
  );
  const [step, setStep] = React.useState(Step.Select);
  const [transactions, setTransactions] = React.useState<ExtractedTransaction[]>([]);

  const supabase = createClient();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const updateTransaction = React.useCallback(
    (uid: string, fields: Partial<ExtractedTransaction>) => {
      setTransactions((prevFiles) =>
        prevFiles.map((file) => {
          if (file.uid === uid) {
            return { ...file, ...fields };
          }
          return file;
        })
      );
    },
    []
  );

  const importTransactions = React.useCallback(
    async (transactions: ExtractedTransaction[]) => {
      for (const transaction of transactions) {
        updateTransaction(transaction.uid, { status: "uploading" });

        const category = await supabase
          .from("categories")
          .select()
          .contains("aliases", [transaction.data.category])
          .single();

        if (category.error) {
          updateTransaction(transaction.uid, {
            status: "error",
            errors: { category: "Category not found" },
          });
          continue;
        }

        const response = await supabase.from("transactions").insert({
          category_id: category.data.id,
          description: transaction.data.description,
          amount: transaction.data.amount,
          timestamp: transaction.data.timestamp,
        });

        if (response.error) {
          updateTransaction(transaction.uid, {
            status: "error",
            errors: { general: response.error.message },
          });
          continue;
        }

        updateTransaction(transaction.uid, { status: "done" });
      }
    },
    [supabase, updateTransaction]
  );

  const Root = isMobile ? Drawer : Dialog;
  const Content = isMobile ? DrawerContent : DialogContent;

  return (
    <ImportDialogContext.Provider
      value={{
        step,
        transactions,
        setStep,
        setTransactions,
        updateTransaction,
        importTransactions,
      }}
    >
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
          {step === Step.Select && <SelectStep />}
          {step === Step.Progress && <ProgressStep />}
          {step === Step.Review && <ReviewStep />}
        </Content>
      </Root>
    </ImportDialogContext.Provider>
  );
};
