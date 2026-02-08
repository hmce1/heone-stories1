import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const isOnAdminPage = req.nextUrl.pathname.startsWith("/admin");
  
  // Allow access to /admin for login page
  if (isOnAdminPage && req.nextUrl.pathname === "/admin") {
    return NextResponse.next();
  }

  // Check for NextAuth session cookie (NextAuth v5 uses these cookie names)
  const sessionToken = 
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value ||
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("__Secure-next-auth.session-token")?.value;

  // Protect admin routes - redirect to login if not authenticated
  if (isOnAdminPage && !sessionToken) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
