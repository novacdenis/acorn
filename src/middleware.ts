import { type NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

function assignPathname(request: NextRequest) {
  request.headers.set("x-pathname", request.nextUrl.pathname);
}

export async function middleware(request: NextRequest) {
  assignPathname(request);
  return await updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
