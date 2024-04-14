import type { Bank, CategoriesQuery, TransactionsQuery } from "../types";

import { sizeToBytes } from "@/utils";

export const BANK_OPTIONS: Record<
  Bank,
  {
    id: Bank;
    label: string;
    extensions: string[];
    size: number;
    disabled: boolean;
  }
> = {
  vb: {
    id: "vb",
    label: "Victoriabank",
    extensions: [".html"],
    size: sizeToBytes(5, "MB"),
    disabled: false,
  },
};

export const CATEGORIES_DEFAULT_QUERY = {
  page: 1,
  take: 10,
  orderBy: "transactions_sum",
  orderDirection: "desc",
} satisfies CategoriesQuery;

export const TRANSACTIONS_DEFAULT_QUERY = {
  page: 1,
  take: 10,
  orderBy: "timestamp",
  orderDirection: "desc",
} satisfies TransactionsQuery;
