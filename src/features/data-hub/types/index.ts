export interface DataHubFile {
  id: number;
  name: string;
  imported_transactions: number;
  user_id: string;
  created_at: string;
}

export interface CreateDataHubFileBody {
  name: string;
  imported_transactions: number;
}

export interface Category {
  id: number;
  name: string;
  color: string;
  aliases: string[];
  user_id: string;
}

export interface CreateCategoryBody {
  name: string;
  color: string;
  aliases: string[];
}

export interface CreateTransactionBody {
  description: string;
  category_id: number;
  amount: number;
  timestamp: Date;
}

export interface Transaction {
  id: number;
  description: string;
  category_id: number;
  user_id: string;
  amount: number;
  timestamp: string;
}

export type Bank = "vb";

interface ExtractedTransactionIdleStatus {
  status: "idle";
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
  | ExtractedTransactionLoadingStatus
  | ExtractedTransactionErrorStatus
  | ExtractedTransactionDoneStatus;

export type ExtractedTransaction = ExtractedTransactionBase & ExtractedTransactionStatus;
