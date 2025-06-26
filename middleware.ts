import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type Role = 'GRANTEE' | 'GRANT_PROVIDER' | 'ADMIN' | 'EMPTY';

const PROTECTED_ROUTES = {
  '/dashboard': {
    requiresAuth: true,
    allowedRoles: ['ADMIN', 'GRANTEE', 'GRANT_PROVIDER'],
  },
  // GRANTEE can only access Opportunities
  '/dashboard/opportunities': {
    requiresAuth: true,
    allowedRoles: ['ADMIN', 'GRANTEE'],
  },
  '/dashboard/opportunities/*': {
    requiresAuth: true,
    allowedRoles: ['ADMIN', 'GRANTEE'],
  },
  // GRANT_PROVIDER can only access Payout
  '/dashboard/payout': {
    requiresAuth: true,
    allowedRoles: ['ADMIN', 'GRANT_PROVIDER'],
  },
  '/dashboard/payout/*': {
    requiresAuth: true,
    allowedRoles: ['ADMIN', 'GRANT_PROVIDER'],
  },
};

const getProtectedRouteConfig = (pathname: string) => {
  if (PROTECTED_ROUTES[pathname as keyof typeof PROTECTED_ROUTES]) {
    return PROTECTED_ROUTES[pathname as keyof typeof PROTECTED_ROUTES];
  }

  // Check if pathname starts with any protected route
  for (const [route, config] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname.startsWith(route)) {
      return config;
    }
  }

  return null;
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is a protected route
  const routeConfig = getProtectedRouteConfig(pathname);

  if (!routeConfig) {
    return NextResponse.next();
  }

  const supabase = createMiddlewareClient({ req: request, res: NextResponse.next() });

  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Session error:', sessionError);
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (!session?.user) {
      console.log('No session found, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Get user role from the User table
    const { data: userData, error: userError } = await supabase
      .from('user')
      .select('role')
      .eq('user_id', session.user.id)
      .single();

    if (userError) {
      console.error('Error fetching user role:', userError);
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    const userRole = (userData?.role || 'EMPTY') as Role;

    if (!userRole || !['ADMIN', 'GRANTEE', 'GRANT_PROVIDER'].includes(userRole)) {
      console.log('Invalid user role:', userRole);
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Check if user has access to this route
    if (!routeConfig.allowedRoles.includes(userRole)) {
      console.log(`User with role ${userRole} denied access to ${pathname}`);
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // User is authenticated and has proper role, allow access
    console.log(`User with role ${userRole} granted access to ${pathname}`);
    return NextResponse.next();

  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
