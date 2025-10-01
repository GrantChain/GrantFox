import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  console.log("🔥 MIDDLEWARE EXECUTING for:", request.nextUrl.pathname);
  const { pathname, search } = request.nextUrl;
  const redirectTo = `${pathname}${search}`;

  // Skip middleware for auth routes, API routes, and static files
  if (
    pathname.startsWith("/(auth)") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  // Only protect dashboard routes
  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  // For public profile routes, allow access without authentication
  if (pathname.startsWith("/dashboard/public-profile")) {
    return NextResponse.next();
  }

  // Create response for cookie handling
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create Supabase client for middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  try {
    // Check for valid user (more secure than getSession)
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      // No valid user - redirect to login
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectTo", redirectTo);
      return NextResponse.redirect(loginUrl);
    }

    // Valid user found - allow access
    return response;
  } catch (error) {
    console.error("Middleware auth error:", error);
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", redirectTo);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api (API routes)
     * - auth routes (login, sign-up, etc.)
     */
    "/dashboard/:path*",
  ],
};
