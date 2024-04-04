"use client";

import type { Transaction, TransactionsQuery } from "../../types";

import React from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyIcon, EmptyTitle } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/utils";

import { Pagination } from "./pagination";
import { Row } from "./row";
import { Toolbar } from "./toolbar";
import { getAllTransactions } from "../../actions";
import { TRANSACTIONS_DEFAULT_QUERY } from "../../constants";
import { useImportDialogStore } from "../import-dialog";
import { TransactionForm } from "../transaction-form";

interface TransactionsTableContextValue {
  query: TransactionsQuery;
  onChangeQuery: (options: Partial<TransactionsQuery>) => void;
  onOpenForm: () => void;
}

const TransactionsTableContext = React.createContext<TransactionsTableContextValue | null>(null);

export const useTransactionsTable = () => {
  const context = React.useContext(TransactionsTableContext);

  if (!context) {
    throw new Error("useTransactionsTable must be used within a TransactionsTableContextProvider");
  }
  return context;
};

export const TransactionsTable: React.FC = () => {
  const [setIsImportOpen] = useImportDialogStore((store) => [store.onOpenChange]);
  const [query, setQuery] = React.useState<TransactionsQuery>(TRANSACTIONS_DEFAULT_QUERY);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction>();

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["transactions", query],
    queryFn: async () => await getAllTransactions(query),
    placeholderData: keepPreviousData,
  });

  const loading = isLoading || isFetching;

  return (
    <TransactionsTableContext.Provider
      value={{
        query,
        onChangeQuery: setQuery,
        onOpenForm: () => setIsFormOpen(true),
      }}
    >
      <Toolbar />

      <div className="relative mt-5 overflow-hidden rounded-2xl border border-primary/10">
        <ul role="table" className="list-none divide-y divide-primary/10 overflow-hidden">
          {data?.data.map((transaction) => (
            <Row
              key={transaction.id}
              data={transaction}
              onClick={(transaction) => {
                setSelectedTransaction(transaction);
                setIsFormOpen(true);
              }}
            />
          ))}
        </ul>

        {!data?.data.length && (
          <Empty className={cn({ "opacity-0": loading })}>
            <EmptyIcon />
            <EmptyTitle>No transactions found</EmptyTitle>
            <EmptyDescription>Try changing the filters or importing transactions.</EmptyDescription>
            <div className="mt-5 flex items-center gap-2">
              <Button
                className="aspect-square px-0 sm:aspect-auto sm:px-3"
                onClick={() => setIsFormOpen(true)}
              >
                <PlusIcon className="h-5 w-5" />
                <span className="ml-2 hidden sm:block">Create</span>
              </Button>
              <Button
                className="aspect-square px-0 sm:aspect-auto sm:px-3"
                onClick={() => setIsImportOpen(true)}
              >
                <CloudArrowUpIcon className="h-5 w-5" />
                <span className="ml-2 hidden sm:block">Import</span>
              </Button>
            </div>
          </Empty>
        )}

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Spinner isLoading className="h-10 w-10" />
          </div>
        )}
      </div>

      <Pagination
        page={data?.meta.page ?? 1}
        total={data?.meta.total ?? 0}
        take={data?.meta.take ?? 10}
      />

      <TransactionForm
        key={selectedTransaction?.id}
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmitSuccess={() => {
          refetch();
        }}
        onDeleteSuccess={() => {
          refetch();
        }}
        defaultValues={selectedTransaction}
      />
    </TransactionsTableContext.Provider>
  );
};
