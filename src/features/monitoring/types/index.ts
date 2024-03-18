export type Category = "household" | "transport" | "food" | "utilities" | "other";

export interface Trend {
  timestamp: number;
  amount: number;
}

export interface Expense extends Record<Category, number> {
  timestamp: number;
  total: number;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  timestamp: number;
}
