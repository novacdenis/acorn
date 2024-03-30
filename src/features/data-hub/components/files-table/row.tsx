"use client";

import type { DataHubFile } from "../../types";

import { cn } from "@/utils";

export interface RowProps {
  file: DataHubFile;
}

export const Row: React.FC<RowProps> = () => {
  return (
    <li
      role="row"
      className={cn(
        "grid h-14 cursor-pointer gap-x-2 p-2 transition-colors active:bg-primary/10",
        "md:p.2.5 md:h-11 md:gap-x-2.5 md:hover:bg-primary/10"
      )}
    ></li>
  );
};
