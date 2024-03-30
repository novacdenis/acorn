"use client";

import { CloudArrowUpIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useImportDialogStore } from "../import-dialog";

export interface ToolbarProps {}

export const Toolbar: React.FC<ToolbarProps> = () => {
  const onOpenChange = useImportDialogStore((store) => store.onOpenChange);

  return (
    <div className="flex items-center justify-between gap-2">
      <fieldset className="relative flex-1">
        <Label
          htmlFor="search"
          className="absolute inset-y-0 left-0 flex items-center justify-center px-3"
        >
          <MagnifyingGlassIcon className="h-5 w-5 opacity-50" />
        </Label>
        <Input
          id="search"
          inputMode="search"
          autoComplete="off"
          placeholder="Search for a file..."
          className="pl-10 sm:max-w-sm"
        />
      </fieldset>
      <Button
        className="aspect-square px-0 sm:aspect-auto sm:px-3"
        onClick={() => onOpenChange(true)}
      >
        <CloudArrowUpIcon className="h-6 w-6 sm:h-5 sm:w-5" />
        <span className="ml-2 hidden sm:block">Import transactions</span>
      </Button>
    </div>
  );
};
