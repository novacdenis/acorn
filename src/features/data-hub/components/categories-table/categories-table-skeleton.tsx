import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/utils";

import styles from "./row.module.css";

export interface CategoriesTableSkeletonProps {
  /** The number of rows to render. */
  length?: number;
}

export const CategoriesTableSkeleton: React.FC<CategoriesTableSkeletonProps> = ({
  length = 10,
}) => {
  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-1 items-center gap-2">
          <Skeleton className="h-10 w-full sm:max-w-sm" />
          <Skeleton className="h-10 w-10 shrink-0 sm:w-20" />
        </div>
        <Skeleton className="h-10 w-10 shrink-0 sm:w-44" />
      </div>
      <div className="relative mt-5 divide-y divide-primary/10 overflow-hidden rounded-2xl border border-primary/10">
        {Array.from({ length }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "grid cursor-pointer gap-x-2.5 gap-y-1 overflow-hidden p-2.5",
              "first:rounded-t-2xl last:rounded-b-2xl md:gap-x-4 md:p-4",
              styles.area
            )}
          >
            <div
              className="flex h-5 items-center overflow-hidden md:h-6"
              style={{ gridArea: "name" }}
            >
              <Skeleton className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" />
              <Skeleton
                className="ml-1.5 h-3.5 md:ml-2 md:h-4"
                style={{
                  width: `${Math.floor(Math.random() * 100) + 125}px`,
                }}
              />
            </div>
            <div className="flex h-5 items-center md:h-6" style={{ gridArea: "transactions" }}>
              <Skeleton
                className="h-3.5 md:h-4"
                style={{
                  width: `${Math.floor(Math.random() * 28) + 100}px`,
                }}
              />
            </div>
            <div
              className="flex max-h-11 flex-wrap items-center justify-end gap-1 overflow-hidden md:max-h-6 md:justify-start"
              style={{ gridArea: "aliases" }}
            >
              {Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map((_, index) => (
                <div key={index} className="flex h-5 items-center">
                  <Skeleton
                    className="h-3.5"
                    style={{
                      width: `${Math.floor(Math.random() * 50) + 25}px`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-end gap-4" aria-label="Pagination">
        <div className="flex h-6 items-center">
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex gap-2">
          <div className="flex h-10 w-10 items-center justify-center">
            <ChevronLeftIcon className="h-5 w-5 animate-pulse text-primary/20" />
          </div>
          <div className="flex h-10 w-10 items-center justify-center">
            <ChevronRightIcon className="h-5 w-5 animate-pulse text-primary/20" />
          </div>
        </div>
      </div>
    </>
  );
};
