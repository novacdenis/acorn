import type { Bank } from "../types";

import { sizeToBytes } from "@/utils/files";

export const BANK_OPTIONS: {
  value: Bank;
  label: string;
  /** The max file size in Bytes. */
  size: number;
  extensions: string[];
  disabled: boolean;
}[] = [
  {
    value: "vb",
    label: "Victoriabank",
    extensions: [".html"],
    size: sizeToBytes(5, "MB"),
    disabled: false,
  },
  {
    value: "maib",
    label: "MAIB (coming soon)",
    extensions: [".csv"],
    size: sizeToBytes(5, "MB"),
    disabled: true,
  },
];
