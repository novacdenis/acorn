import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoginForm } from "@/features/auth/components";

export default function LoginPage({
  searchParams,
}: {
  searchParams: {
    callback_error?: string;
  };
}) {
  return (
    <>
      <p>NEXT_PUBLIC_SITE_URL: {process.env.NEXT_PUBLIC_SITE_URL}</p>
      <p>NEXT_PUBLIC_VERCEL_URL:{process.env.NEXT_PUBLIC_VERCEL_URL}</p>

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
