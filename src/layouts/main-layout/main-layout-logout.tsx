"use client";

import React from "react";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/16/solid";
import { DropdownMenuItem, DropdownMenuShortcut } from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { signOut } from "@/features/auth";

export const MainLayoutLogout: React.FC = () => {
  const [isPending, startTransition] = React.useTransition();

  const signOutHandler = () => {
    startTransition(() => {
      signOut();
    });
  };

  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={signOutHandler}
      onSelect={(e) => e.preventDefault()}
    >
      <DropdownMenuShortcut>
        {isPending ? (
          <Spinner className="h-4 w-4" />
        ) : (
          <ArrowLeftStartOnRectangleIcon className="h-4 w-4" />
        )}
      </DropdownMenuShortcut>
      <span className="ml-2">Sign out</span>
    </DropdownMenuItem>
  );
};
