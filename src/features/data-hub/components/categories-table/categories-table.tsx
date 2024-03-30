"use client";

import type { DataHubFile } from "../../types";

import React from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

import { Row } from "./row";
import { Toolbar } from "./toolbar";
import { getAllCategories } from "../../actions";
import { CategoryForm } from "../category-form";

export interface CategoriesTableProps {
  files: DataHubFile[];
}

export const CategoriesTable: React.FC<CategoriesTableProps> = ({ files }) => {
  const { data: categories, refetch: refetchCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await getAllCategories(),
  });

  const [isCategoryFormOpen, setIsCategoryFormOpen] = React.useState(false);

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <Toolbar />
        <Button
          className="aspect-square px-0 sm:aspect-auto sm:px-3"
          onClick={() => setIsCategoryFormOpen(true)}
        >
          <PlusCircleIcon className="h-6 w-6 sm:h-5 sm:w-5" />
          <span className="ml-2 hidden sm:block">Create category</span>
        </Button>
        <button onClick={() => refetchCategories()} className="text-primary">
          refresh
        </button>
      </div>
      <div className="mt-5 overflow-hidden rounded-2xl border border-primary/10">
        <ul role="table" className="relative list-none [&>li:not(:first-child)]:border-t">
          {files.map((file) => (
            <Row key={file.id} file={file} />
          ))}
          {categories?.map((category) => <p key={category.id}>{category.name}</p>)}
        </ul>
      </div>
      {/* <CategoryForm
        open={isCategoryFormOpen}
        onClose={() => {
          setIsCategoryFormOpen(false);
          // getAllCategories().then(console.log);
          refetchCategories();
        }}
      /> */}
    </>
  );
};
