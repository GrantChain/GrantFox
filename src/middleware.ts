import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type Role = 'ADMIN' | 'GRANTEE' | 'GRANT_PROVIDER' | 'EMPTY';

// protected routes and their required roles
const PROTECTED_ROUTES = {
  '/dashboard': ['ADMIN', 'GRANTEE', 'GRANT_PROVIDER'] as Role[],
  '/dashboard/grants/opportunities': ['ADMIN', 'GRANTEE'] as Role[],
  '/dashboard/payout': ['ADMIN', 'GRANT_PROVIDER'] as Role[],
} as const;

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  await supabase.auth.getSession();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const path = request.nextUrl.pathname;

  // if the path is a protected route
  const isProtectedRoute = Object.keys(PROTECTED_ROUTES).some((route) =>
    path.startsWith(route),
  );

  if (isProtectedRoute) {
    // If no session, redirect to login
    if (!session) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirectTo', path);
      return NextResponse.redirect(redirectUrl);
    }

    // getting user role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single();

    const userRole = (roleData?.role || 'EMPTY') as Role;

    // checking if user has access to the route
    const hasAccess = Object.entries(PROTECTED_ROUTES).some(
      ([route, allowedRoles]) => {
        if (path.startsWith(route)) {
          return allowedRoles.includes(userRole);
        }
        return false;
      },
    );

    // If user doesn't have access, redirect to unauthorized page
    if (!hasAccess) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return res;
}

// Configure which routes to run middleware on
export const config = {
  matcher: ['/dashboard/:path*'],
};
