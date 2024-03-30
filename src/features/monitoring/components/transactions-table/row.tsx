"use client";

import type { Transaction } from "../../types";

import Image from "next/image";
import { format } from "date-fns";
import { cn, formatNumber } from "@/utils";

import styles from "./row.module.css";

export interface RowProps {
  transaction: Transaction;
  onClick: (id: string) => void;
}

export const Row: React.FC<RowProps> = ({ transaction, onClick }) => {
  return (
    <li
      role="row"
      className={cn(
        "grid h-14 cursor-pointer gap-x-2 p-2 transition-colors active:bg-primary/10",
        "md:p.2.5 md:h-11 md:gap-x-2.5 md:hover:bg-primary/10",
        styles.area
      )}
      onClick={() => onClick(transaction.id)}
      onKeyDown={() => onClick(transaction.id)}
    >
      <div
        aria-hidden="true"
        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/10 bg-primary/5 md:h-6 md:w-6 md:rounded-sm"
        style={{ gridArea: "icon" }}
      >
        <Image
          src="/images/light-bulb.svg"
          alt="Bulb"
          width={12}
          height={12}
          sizes="(max-width: 768px) 12px, 16px"
          className="h-4 w-4 md:h-3 md:w-3"
        />
      </div>

      <h3 className="flex items-center overflow-hidden text-sm" style={{ gridArea: "description" }}>
        <span
          className="block h-2.5 w-2.5 shrink-0 rounded-full bg-neutral-500"
          style={{ backgroundColor: "ThreeDFace" }}
        />
        <span className="ml-1 block truncate">{transaction.description}</span>
      </h3>
      <p className="justify-self-end text-sm md:justify-self-start" style={{ gridArea: "amount" }}>
        {formatNumber(transaction.amount, { decimals: 2 })} MDL
      </p>
      <p
        className="truncate text-sm text-muted-foreground md:text-primary"
        style={{ gridArea: "category" }}
      >
        {transaction.category}
      </p>
      <time
        className="justify-self-end text-sm text-muted-foreground md:justify-self-start md:text-primary"
        style={{ gridArea: "timestamp" }}
        dateTime={new Date(transaction.timestamp).toString()}
      >
        {format(transaction.timestamp, "MMM d, yyyy, HH:mm")}
      </time>
    </li>
  );
};
