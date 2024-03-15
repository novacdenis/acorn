"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SITE_URL } from "@/config";
import { createClient } from "@/lib/supabase/server";

export async function signInWithGithub() {
  const supabase = createClient();
  const response = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${SITE_URL}/auth/callback`,
    },
  });

  if (response.error) {
    return response.error;
  }

  return redirect(response.data.url);
}

export async function signInWithGoogle() {
  const supabase = createClient();
  const response = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${SITE_URL}/auth/callback`,
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

  redirect("/auth/login");
}
