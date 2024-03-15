import Image from "next/image";
import Link from "next/link";

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-b-primary/5 bg-black/30 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/images/logo.svg" alt="Acorn" width={24} height={24} className="h-6 w-6" />
            <span className="ml-2 translate-y-px font-medium">Acorn</span>
          </Link>
        </div>
      </header>
      <main className="py-6">{children}</main>
    </>
  );
};
