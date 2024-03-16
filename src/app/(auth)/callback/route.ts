import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = createClient();
    const response = await supabase.auth.exchangeCodeForSession(code);

    if (!response.error) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    return NextResponse.redirect(
      `${origin}/login?callback_error=${encodeURIComponent(response.error.message)}`
    );
  }

  return NextResponse.redirect(
    `${origin}/login?callback_error=${encodeURIComponent("Something went wrong. Please try again.")}`
  );
}
