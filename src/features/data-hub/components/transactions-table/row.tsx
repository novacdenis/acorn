"use client";

import type { Transaction } from "../../types";

import React from "react";
import { format } from "date-fns";
import { cn, formatNumber } from "@/utils";

import styles from "./row.module.css";

export interface RowProps {
  data: Transaction;
  onClick: (data: Transaction) => void;
}

export const Row: React.FC<RowProps> = ({ data, onClick }) => {
  return (
    <li
      role="row"
      tabIndex={0}
      className={cn(
        "grid cursor-pointer gap-x-2.5 gap-y-1 overflow-hidden p-2.5 transition-colors active:bg-primary/10",
        "first:rounded-t-2xl last:rounded-b-2xl md:gap-x-4 md:p-4 md:hover:bg-primary/10",
        styles.area
      )}
      onClick={() => onClick(data)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onClick(data);
        }
      }}
    >
      <p
        title={data.description}
        className="truncate text-sm md:text-base"
        style={{ gridArea: "description" }}
      >
        {data.description || "Uncategorized"}
      </p>
      <p
        title={formatNumber(data.amount, { decimals: 2 })}
        className="justify-self-end text-sm md:justify-self-start md:text-base"
        style={{ gridArea: "amount" }}
      >
        {formatNumber(data.amount, { decimals: 2 })} MDL
      </p>
      <p
        title={data.category?.name || "Uncategorized"}
        className="flex items-center overflow-hidden text-muted-foreground md:text-primary"
        style={{ gridArea: "category" }}
      >
        <span
          className="block h-2.5 w-2.5 shrink-0 rounded-full md:h-3 md:w-3"
          style={{
            backgroundColor: data.category?.color,
          }}
        />
        <span className="ml-1.5 truncate text-sm md:ml-2 md:text-base">
          {data.category?.name || "Uncategorized"}
        </span>
      </p>
      <time
        dateTime={data.timestamp}
        className="justify-self-end truncate text-sm text-muted-foreground md:justify-self-start md:text-base md:text-primary"
        style={{ gridArea: "timestamp" }}
      >
        {format(data.timestamp, "MMM d, yyyy, HH:mm")}
      </time>
    </li>
  );
};
