"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function getURL() {
  let url = "http://localhost:3000";

  if (process?.env?.NEXT_PUBLIC_SITE_URL) {
    url = `https://${process.env.NEXT_PUBLIC_SITE_URL}`;
  }
  if (process?.env?.NEXT_PUBLIC_VERCEL_URL) {
    url = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

  return url;
}

export async function signInWithGithub(searchParams: string) {
  const supabase = createClient();
  const response = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${getURL()}/callback?${searchParams}`,
    },
  });

  if (response.error) {
    return response.error;
  }

  return redirect(response.data.url);
}

export async function signInWithGoogle(searchParams: string) {
  const supabase = createClient();
  const response = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${getURL()}/callback?${searchParams}`,
    },
  });

  if (response.error) {
    return response.error;
  }

  return redirect(response.data.url);
}

export async function signOut() {
  const response = await createClient().auth.signOut();

  if (response.error) {
    cookies().delete("user_session");
  }

  redirect("/login");
}
