import type { PageQuery } from "@/types";

export interface Category {
  id: number;
  name: string;
  color: string;
  aliases: string[];
  user_id: string;
  transactions_count: number | null;
  transactions_sum: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryBody {
  name: string;
  color: string;
  aliases: string[];
}

export interface CategoriesQuery extends PageQuery {}

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  timestamp: string;
  category_id: number;
  category?: Category | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTransactionBody {
  description: string;
  amount: number;
  timestamp: string;
  category_id: number;
}

export interface TransactionsQuery extends PageQuery {}

export type Bank = "vb";

export interface CategoryMapping {
  alias: string;
  category_id?: number;
}

export interface ExtractedTransactionBase {
  uid: string;
  data: {
    description: string;
    amount: number;
    timestamp: string;
    category_alias: string;
  };
}

export type ExtractedTransactionStatus =
  | { status: "pending" }
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "skipped" }
  | { status: "done" };

export type ExtractedTransaction = ExtractedTransactionBase & ExtractedTransactionStatus;
