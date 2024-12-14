import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Define public routes that don't require authentication
const publicRoutes = ["/sign-in", "/forget-password", "/reset-password"];

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public/).*)",
  ],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.includes(pathname);

  // Redirect authenticated users trying to access sign-in page
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users trying to access protected routes
  if (!token && !isPublicRoute) {
    const signInUrl = new URL("/sign-in", request.url);
    // Preserve the original URL as a redirect parameter
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}