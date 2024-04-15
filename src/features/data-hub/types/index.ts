import type { PageQuery } from "@/types";

export interface Category {
  id: number;
  name: string;
  color: string;
  aliases: string[];
  transactions?: {
    count: number;
    sum: number;
  };
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryBody {
  name: string;
  color: string;
  aliases: string[];
}

export interface CategoriesQuery extends PageQuery {}

export interface CreateTransactionBody {
  description: string;
  amount: number;
  timestamp: Date;
  category_id: number;
}

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  timestamp: string;
  category_id: number;
  category: Category | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionsQuery extends PageQuery {}

export type Bank = "vb";

export interface CategoryMapping {
  alias: string;
  id?: number;
}

interface ExtractedTransactionIdleStatus {
  status: "idle";
}

interface ExtractedTransactionSkipStatus {
  status: "skip";
}

interface ExtractedTransactionLoadingStatus {
  status: "loading";
}

interface ExtractedTransactionErrorStatus {
  status: "error";
  error: string;
}

interface ExtractedTransactionDoneStatus {
  status: "done";
  response: Transaction;
}

export interface ExtractedTransactionBase {
  uid: string;
  data: {
    category: string;
    description: string;
    amount: number;
    timestamp: Date;
  };
}
export type ExtractedTransactionStatus =
  | ExtractedTransactionIdleStatus
  | ExtractedTransactionSkipStatus
  | ExtractedTransactionLoadingStatus
  | ExtractedTransactionErrorStatus
  | ExtractedTransactionDoneStatus;

export type ExtractedTransaction = ExtractedTransactionBase & ExtractedTransactionStatus;
