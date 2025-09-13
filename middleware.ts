import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextRequest, NextResponse } from "next/server";

export default NextAuth(authConfig).auth;

/* export function middleware(request: NextRequest) {
  // Exclure certaines routes (ex: API publique)
  const dada = !request.nextUrl.pathname.startsWith("/admin");
  console.log({ dada });
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    console.log("soso");
    return NextResponse.next();
  }

  // Sinon, vérifie l'authentification
  const session = request.cookies.get("next-auth.session-token");
  if (!session && !request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect("/");
  }
  return NextResponse.next();
} */

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
