"use client";

import React from "react";
import {
  ArrowUpTrayIcon,
  Cog6ToothIcon,
  SunIcon,
  TagIcon,
  UserCircleIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/16/solid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { signOut } from "@/features/auth";
import { useImportDialogStore } from "@/features/dh";
import { useTheme } from "@/providers";

export const MainLayoutMenu: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { setIsOpen } = useImportDialogStore((store) => ({ setIsOpen: store.setIsOpen }));

  const [isPending, startTransition] = React.useTransition();

  const signOutHandler = () => {
    startTransition(() => {
      signOut();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer" tabIndex={0}>
          <AvatarImage src="https://github.com/novacdenis.png" alt="@novacdenis" />
          <AvatarFallback className="text-xs">ND</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <DropdownMenuShortcut>
              <UserCircleIcon className="h-4 w-4" />
            </DropdownMenuShortcut>
            <span className="ml-3">Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DropdownMenuShortcut>
              <Cog6ToothIcon className="h-4 w-4" />
            </DropdownMenuShortcut>
            <span className="ml-3">Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={toggleTheme}>
            <DropdownMenuShortcut>
              <SunIcon className="h-4 w-4" />
            </DropdownMenuShortcut>
            <span className="ml-3">Light mode</span>
            <Switch checked={theme === "light"} className="ml-auto" />
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <DropdownMenuShortcut>
              <TagIcon className="h-4 w-4" />
            </DropdownMenuShortcut>
            <span className="ml-3">Categories</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsOpen(true)}>
            <DropdownMenuShortcut>
              <ArrowUpTrayIcon className="h-4 w-4" />
            </DropdownMenuShortcut>
            <span className="ml-3">Import</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={isPending}
          onClick={signOutHandler}
          onSelect={(e) => e.preventDefault()}
        >
          <DropdownMenuShortcut>
            <Spinner isLoading={isPending} className="h-4 w-4">
              <ArrowLeftStartOnRectangleIcon className="h-4 w-4" />
            </Spinner>
          </DropdownMenuShortcut>
          <span className="ml-3">Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
