import Image from "next/image";
import LayoutChart from "./auth-layout-chart";

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-dvh flex-col items-center justify-center">
      <div className="bg-grid pointer-events-none fixed inset-0" aria-hidden="true">
        <LayoutChart />
      </div>
      <header className="flex flex-col items-center px-8">
        <Image
          priority
          src="/images/logo.svg"
          alt="Acorn"
          width={96}
          height={96}
          className="h-24 w-24 md:h-28 md:w-28"
        />
        <h1 className="mt-8 text-2xl font-medium md:text-3xl">Acorn</h1>
        <h2 className="mt-1 text-muted-foreground md:text-lg">
          Please select an option to sign in
        </h2>
      </header>
      <main className="mt-10 px-8">{children}</main>
    </div>
  );
};
