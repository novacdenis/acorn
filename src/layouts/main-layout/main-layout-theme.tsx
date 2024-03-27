"use client";

import React from "react";
import { SunIcon } from "@heroicons/react/16/solid";
import { DropdownMenuItem, DropdownMenuShortcut } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/providers";

export const MainLayoutTheme: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={toggleTheme}>
      <DropdownMenuShortcut>
        <SunIcon className="h-4 w-4" />
      </DropdownMenuShortcut>
      <span className="ml-2">Light mode</span>
      <Switch checked={theme === "light"} className="ml-auto" />
    </DropdownMenuItem>
  );
};
