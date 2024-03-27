import Image from "next/image";
import Link from "next/link";
import { Cog6ToothIcon, UserCircleIcon } from "@heroicons/react/16/solid";
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

import { MainLayoutImport } from "./main-layout-import";
import { MainLayoutLogout } from "./main-layout-logout";
import { MainLayoutNotifications } from "./main-layout-notifications";
import { MainLayoutTheme } from "./main-layout-theme";

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <header className="sticky top-0 z-40 h-14 border-b border-b-primary/5 bg-background/80 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/images/logo.svg" alt="Acorn" width={24} height={24} className="h-6 w-6" />
            <span className="ml-2 translate-y-px font-medium">Acorn</span>
          </Link>

          <div className="flex items-center gap-4">
            <MainLayoutNotifications />
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
                    <span className="ml-2">Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <DropdownMenuShortcut>
                      <Cog6ToothIcon className="h-4 w-4" />
                    </DropdownMenuShortcut>
                    <span className="ml-2">Settings</span>
                  </DropdownMenuItem>
                  <MainLayoutImport />
                  <MainLayoutTheme />
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <MainLayoutLogout />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="py-5">{children}</main>
    </>
  );
};
