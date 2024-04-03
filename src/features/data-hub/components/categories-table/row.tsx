"use client";

import type { Category } from "../../types";

import React from "react";
import { format } from "date-fns";
import { cn } from "@/utils";

import styles from "./row.module.css";

export interface RowProps {
  data: Category;
  onClick: (data: Category) => void;
}

export const Row: React.FC<RowProps> = ({ data, onClick }) => {
  const aliases = data.aliases.filter(Boolean);

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
        title={data.name}
        className="flex items-center overflow-hidden"
        style={{ gridArea: "name" }}
      >
        <span
          className="block h-2.5 w-2.5 shrink-0 rounded-full md:h-3 md:w-3"
          style={{
            backgroundColor: data.color,
          }}
        />
        <span className="ml-1.5 truncate text-sm font-medium md:ml-2 md:text-base">
          {data.name}
        </span>
      </p>
      <time
        dateTime={data.created_at}
        className="truncate text-sm text-muted-foreground md:text-base md:text-primary"
        style={{ gridArea: "created_at" }}
      >
        {format(data.created_at, "MMM d, yyyy, HH:mm")}
      </time>
      <p
        title={aliases.join(", ")}
        className={cn(
          "flex max-h-11 flex-wrap items-center justify-end gap-1 overflow-hidden md:max-h-6 md:justify-start",
          { "self-center": !aliases.length }
        )}
        style={{
          gridArea: "aliases",
        }}
      >
        {aliases.length ? (
          aliases.map((alias) => (
            <span
              key={alias}
              className="inline-block truncate rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium md:text-sm"
            >
              {alias}
            </span>
          ))
        ) : (
          <span className="px-2 py-0.5 text-lg">---</span>
        )}
      </p>
    </li>
  );
};
