import Image from "next/image";
import Link from "next/link";

import { MainLayoutMenu } from "./main-layout-menu";
import { MainLayoutNotifications } from "./main-layout-notifications";

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
            <MainLayoutMenu />
          </div>
        </div>
      </header>
      <main className="py-5">{children}</main>
    </>
  );
};
