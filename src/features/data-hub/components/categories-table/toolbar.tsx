"use client";

import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface ToolbarProps {}

export const Toolbar: React.FC<ToolbarProps> = () => {
  return (
    <>
      <div className="flex flex-1 items-center gap-2">
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
            placeholder="Search for a category..."
            className="pl-10 sm:max-w-sm"
          />
        </fieldset>
      </div>
    </>
  );
};
