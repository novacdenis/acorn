import Image from "next/image";
import Link from "next/link";
import { ArrowUpTrayIcon, Cog6ToothIcon, UserCircleIcon } from "@heroicons/react/16/solid";
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
import { MainLayoutLogout } from "./main-layout-logout";
import { MainLayoutNotifications } from "./main-layout-notifications";

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-b-primary/5 bg-black/30 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/images/logo.svg" alt="Acorn" width={24} height={24} className="h-6 w-6" />
            <span className="ml-2 translate-y-px font-medium">Acorn</span>
          </Link>

          <div className="flex items-center space-x-3">
            <MainLayoutNotifications />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
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
                  <DropdownMenuItem asChild>
                    <Link href="/import">
                      <DropdownMenuShortcut>
                        <ArrowUpTrayIcon className="h-4 w-4" />
                      </DropdownMenuShortcut>
                      <span className="ml-2">Import</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <MainLayoutLogout />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="py-6">{children}</main>
    </>
  );
};
