// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

// Define protected routes
const protectedRoutes = ["/chat"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await auth.api.getSession(
  {
      headers: await headers()
  }
  )
// console.log(pathname)
// console.log(req.url,"urllllll")
  if(session && pathname==="/auth"){
     return NextResponse.redirect(new URL("/",req.url));
  }
  

  // Check if route is protected
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!session) {
      // Redirect to login if not authenticated
      const loginUrl = new URL("/auth", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Allow request to continue
  return NextResponse.next();
}

// Specify which routes the middleware runs on
export const config = {
    //  runtime: "nodejs",
  matcher: ["/chat/:path*", "/auth"], // you can add more
};
