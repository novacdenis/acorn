import React from "react";
import {
  ArrowsUpDownIcon,
  CloudArrowUpIcon,
  PlusIcon as PlusIcon16,
  TagIcon,
} from "@heroicons/react/16/solid";
import { PlusIcon } from "@heroicons/react/20/solid";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebouncedCallback } from "@/hooks";

import { useTransactionsTable } from "./transactions-table";
import { useImportDialogStore } from "../import-dialog-v2";

export const Toolbar: React.FC = () => {
  const { query, onChangeQuery, onOpenForm } = useTransactionsTable();

  const [setIsImportOpen] = useImportDialogStore((store) => [store.onOpenChange]);
  const [filter, setFilter] = React.useState(query?.filter ?? "");

  const debouncedSetQueryFilter = useDebouncedCallback(
    (value: string) => onChangeQuery({ filter: value }),
    300
  );

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-1 items-center gap-2">
        <fieldset className="relative w-full sm:max-w-sm">
          <Label
            htmlFor="transactions-search"
            className="absolute inset-y-0 left-0 flex items-center justify-center px-3"
          >
            <MagnifyingGlassIcon className="h-5 w-5 opacity-50" />
          </Label>
          <Input
            id="transactions-search"
            inputMode="search"
            autoComplete="off"
            placeholder="Search by description..."
            className="pl-10"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              debouncedSetQueryFilter(e.target.value);
            }}
          />
        </fieldset>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="aspect-square px-0 sm:aspect-auto sm:px-3">
              <FunnelIcon className="h-5 w-5" />
              <span className="ml-2 hidden sm:block">Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <DropdownMenuShortcut>
                  <ArrowsUpDownIcon className="h-4 w-4" />
                </DropdownMenuShortcut>
                <span className="ml-3">Sort by</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={`${query?.orderBy}|${query?.orderDirection}`}
                  onValueChange={(value) => {
                    const [orderBy, orderDirection] = value.split("|") as [string, "asc" | "desc"];
                    onChangeQuery({ orderBy, orderDirection });
                  }}
                >
                  <DropdownMenuRadioItem value="amount|asc">
                    Amount: Low to High
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="amount|desc">
                    Amount: High to Low
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="timestamp|asc">Date: Oldest</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="timestamp|desc">Date: Newest</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <DropdownMenuShortcut>
                  <TagIcon className="h-4 w-4" />
                </DropdownMenuShortcut>
                <span className="ml-3">Categories</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={`${query?.orderBy}|${query?.orderDirection}`}
                  onValueChange={(value) => {
                    const [orderBy, orderDirection] = value.split("|") as [string, "asc" | "desc"];
                    onChangeQuery({ orderBy, orderDirection });
                  }}
                >
                  <DropdownMenuRadioItem value="amount|asc">
                    Amount: Low to High
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="amount|desc">
                    Amount: High to Low
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="aspect-square px-0 sm:aspect-auto sm:px-3">
            <PlusIcon className="h-5 w-5" />
            <span className="ml-2 hidden sm:block">Add transactions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onOpenForm}>
            <DropdownMenuShortcut>
              <PlusIcon16 className="h-4 w-4" />
            </DropdownMenuShortcut>
            <span className="ml-3">Create transaction</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsImportOpen(true)}>
            <DropdownMenuShortcut>
              <CloudArrowUpIcon className="h-4 w-4" />
            </DropdownMenuShortcut>
            <span className="ml-3">Import transactions</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
