import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ImportDialog } from "@/features/data-hub";
import { MainLayout } from "@/layouts";
import { createClient } from "@/lib/supabase/server";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const user = await supabase.auth.getUser();

  if (user.error || !user.data) {
    redirect(`/login?next=${encodeURIComponent(headers().get("x-pathname") || "/")}`);
  }

  return (
    <MainLayout>
      {children}
      <ImportDialog />
    </MainLayout>
  );
}
