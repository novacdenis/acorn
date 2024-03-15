"use client";

import {
  ArrowLeftStartOnRectangleIcon,
  ArrowUpTrayIcon,
  Cog6ToothIcon,
  UserCircleIcon,
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
import { signOut } from "@/features/auth";

export const MainLayoutMenu: React.FC = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-9 w-9 cursor-pointer">
          <AvatarImage src="https://github.com/novacdenis.png" alt="@novacdenis" />
          <AvatarFallback>ND</AvatarFallback>
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
            <span className="ml-2">Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DropdownMenuShortcut>
              <Cog6ToothIcon className="h-4 w-4" />
            </DropdownMenuShortcut>
            <span className="ml-2">Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DropdownMenuShortcut>
              <ArrowUpTrayIcon className="h-4 w-4" />
            </DropdownMenuShortcut>
            <span className="ml-2">Import</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            signOut();
          }}
        >
          <DropdownMenuShortcut>
            <ArrowLeftStartOnRectangleIcon className="h-4 w-4" />
          </DropdownMenuShortcut>
          <span className="ml-2">Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
