import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  if (process.env.NODE_ENV !== "production") {
    console.debug("middleware:", request.nextUrl.pathname);
  }

  const { pathname, search } = request.nextUrl;
  const redirectTo = `${pathname}${search}`;

  // Paths are already constrained by config.matcher → only /dashboard/* reaches here.

  // Create response for cookie handling
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Validate Supabase environment variables
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("Supabase env missing: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY");
    return NextResponse.error();
  }

  // Create Supabase client for middleware
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
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
  });

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
  // Run only on protected dashboard routes, excluding public profiles
  matcher: ["/dashboard/((?!public-profile).*)"],
};
