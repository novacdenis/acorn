import type { Metadata } from "next";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoginForm } from "@/features/auth/components";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: {
    callback_error?: string;
  };
}) {
  return (
    <>
      {searchParams.callback_error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{searchParams.callback_error}</AlertDescription>
        </Alert>
      )}

      <LoginForm />
    </>
  );
}
