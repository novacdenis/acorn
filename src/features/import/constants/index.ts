import type { Bank } from "../types";

import { sizeToBytes } from "@/utils/files";

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
  maib: {
    id: "maib",
    label: "MAIB (coming soon)",
    extensions: [".csv"],
    size: sizeToBytes(5, "MB"),
    disabled: true,
  },
};
