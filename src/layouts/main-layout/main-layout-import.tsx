"use client";

import React from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/16/solid";
import { DropdownMenuItem, DropdownMenuShortcut } from "@/components/ui/dropdown-menu";
import { useImportDialogStore } from "@/features/dh";

export const MainLayoutImport: React.FC = () => {
  const setIsOpen = useImportDialogStore((store) => store.setIsOpen);

  return (
    <DropdownMenuItem onClick={() => setIsOpen(true)}>
      <DropdownMenuShortcut>
        <ArrowUpTrayIcon className="h-4 w-4" />
      </DropdownMenuShortcut>
      <span className="ml-2">Import</span>
    </DropdownMenuItem>
  );
};
