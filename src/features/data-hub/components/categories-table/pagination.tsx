import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/utils";

import { useCategoriesTable } from "./categories-table";

export interface PaginationProps {
  page: number;
  total: number;
  take: number;
}

export const Pagination: React.FC<PaginationProps> = ({ page, total, take }) => {
  const { onChangeQuery } = useCategoriesTable();

  const totalPages = Math.ceil(total / take);
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;
  const from = total === 0 ? 0 : page * take - take + 1;
  const to = Math.min(page * take, total);

  return (
    <nav className="mt-5 flex items-center justify-end gap-4" aria-label="Pagination">
      <p className="text-sm text-muted-foreground md:text-base">
        {from} - {to} of {formatNumber(total)}
      </p>
      <ul className="flex gap-2">
        <li>
          <Button
            variant="ghost"
            size="icon"
            disabled={!hasPrevious}
            onClick={() => onChangeQuery({ page: page - 1 })}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Button>
        </li>
        <li>
          <Button
            variant="ghost"
            size="icon"
            disabled={!hasNext}
            onClick={() => onChangeQuery({ page: page + 1 })}
          >
            <ChevronRightIcon className="h-5 w-5" />
          </Button>
        </li>
      </ul>
    </nav>
  );
};
