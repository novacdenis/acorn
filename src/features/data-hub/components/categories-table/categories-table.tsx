"use client";

import type { CategoriesQuery, Category } from "../../types";

import React from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyIcon, EmptyTitle } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { cn, queryMather } from "@/utils";

import { Pagination } from "./pagination";
import { Row } from "./row";
import { Toolbar } from "./toolbar";
import { getAllCategories } from "../../actions";
import { CATEGORIES_DEFAULT_QUERY } from "../../constants";
import { CategoryForm } from "../category-form";

interface CategoriesTableContextValue {
  query: CategoriesQuery;
  onChangeQuery: (options: Partial<CategoriesQuery>) => void;
  onOpenForm: () => void;
}

const CategoriesTableContext = React.createContext<CategoriesTableContextValue | null>(null);

export const useCategoriesTable = () => {
  const context = React.useContext(CategoriesTableContext);

  if (!context) {
    throw new Error("useCategoriesTable must be used within a CategoriesTableContextProvider");
  }
  return context;
};

export const CategoriesTable: React.FC = () => {
  const [query, setQuery] = React.useState<CategoriesQuery>(CATEGORIES_DEFAULT_QUERY);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<Category>();

  const queryClient = useQueryClient();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["categories", query],
    queryFn: async () => await getAllCategories(query),
    placeholderData: keepPreviousData,
  });

  const loading = isLoading || isFetching;

  return (
    <CategoriesTableContext.Provider
      value={{
        query,
        onChangeQuery: setQuery,
        onOpenForm: () => setIsFormOpen(true),
      }}
    >
      <Toolbar />

      <div className="relative mt-5 overflow-hidden rounded-2xl border border-primary/10">
        <ul role="table" className="list-none divide-y divide-primary/10 overflow-hidden">
          {data?.data.map((category) => (
            <Row
              key={category.id}
              data={category}
              onClick={(category) => {
                setSelectedCategory(category);
                setIsFormOpen(true);
              }}
            />
          ))}
        </ul>

        {!data?.data.length && (
          <Empty className={cn({ "opacity-0": loading })}>
            <EmptyIcon />
            <EmptyTitle>No categories found</EmptyTitle>
            <EmptyDescription>
              Try changing the filters or creating a new category.
            </EmptyDescription>
            <Button className="mt-5" onClick={() => setIsFormOpen(true)}>
              <PlusIcon className="h-5 w-5" />
              <span className="ml-2">Create category</span>
            </Button>
          </Empty>
        )}

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Spinner isLoading className="h-10 w-10" />
          </div>
        )}
      </div>

      <Pagination
        page={data?.meta.page ?? 1}
        total={data?.meta.total ?? 0}
        take={data?.meta.take ?? 10}
      />

      <CategoryForm
        key={selectedCategory?.id}
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmitSuccess={() => {
          queryClient.refetchQueries({ predicate: queryMather(["transactions", "categories"]) });
        }}
        onDeleteSuccess={() => {
          queryClient.refetchQueries({ predicate: queryMather(["transactions", "categories"]) });
        }}
        defaultValues={selectedCategory}
      />
    </CategoriesTableContext.Provider>
  );
};
