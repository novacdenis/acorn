"use client";

import React from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { ArrowsUpDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebouncedCallback } from "@/hooks";

import { useCategoriesTable } from "./categories-table";

export const Toolbar: React.FC = () => {
  const { query, onChangeQuery, onOpenForm } = useCategoriesTable();

  const [filter, setFilter] = React.useState(query?.filter ?? "");

  const debouncedSetQueryFilter = useDebouncedCallback(
    (value: string) => onChangeQuery({ filter: value, page: 1 }),
    300
  );

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-1 items-center gap-2">
        <fieldset className="relative w-full sm:max-w-sm">
          <Label
            htmlFor="categories-search"
            className="absolute inset-y-0 left-0 flex items-center justify-center px-3"
          >
            <MagnifyingGlassIcon className="h-5 w-5 opacity-50" />
          </Label>
          <Input
            id="categories-search"
            inputMode="search"
            autoComplete="off"
            placeholder="Search by name..."
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
              <ArrowsUpDownIcon className="h-5 w-5" />
              <span className="ml-2 hidden sm:block">Sort by</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup
              value={`${query?.orderBy}|${query?.orderDirection}`}
              onValueChange={(value) => {
                const [orderBy, orderDirection] = value.split("|") as [string, "asc" | "desc"];
                onChangeQuery({ orderBy, orderDirection });
              }}
            >
              <DropdownMenuRadioItem value="transactions_sum|desc">
                Total: High to Low
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="transactions_count|desc">
                Transactions: High to Low
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="created_at|desc">Date: Newest</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Button className="aspect-square px-0 sm:aspect-auto sm:px-3" onClick={onOpenForm}>
        <PlusIcon className="h-5 w-5" />
        <span className="ml-2 hidden sm:block">Create category</span>
      </Button>
    </div>
  );
};
