import { redirect } from "next/navigation";
import { AuthLayout } from "@/layouts";
import { createClient } from "@/lib/supabase/server";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const user = await supabase.auth.getUser();

  if (!user.error && user.data) {
    redirect("/");
  }

  return <AuthLayout>{children}</AuthLayout>;
}
