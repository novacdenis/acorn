"use client";

import type { Transaction } from "../../types";

import { Row } from "./row";

export interface TransactionTableProps {
  transactions: Transaction[];
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-primary/10">
      <ul role="table" className="relative list-none [&>li:not(:first-child)]:border-t">
        {transactions.map((transaction) => (
          <Row key={transaction.id} transaction={transaction} onClick={() => {}} />
        ))}
      </ul>
    </div>
  );
};
