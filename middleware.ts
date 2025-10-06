import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


const publicRoutes = ['/login', '/register', '/verify-email', '/help', '/'];


const authRoutes = ['/login', '/register'];


const protectedRoutes = ['/admin', '/student', '/supervisor'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;
  const userRole = request.cookies.get('user_role')?.value;
  const isAuthenticated = !!token;

  // If token exists but user_role is missing, clear the token
  // This can happen if the token becomes invalid but wasn't properly cleared
  if (token && !userRole) {
    const response = NextResponse.next();
    response.cookies.delete('auth_token');
    response.cookies.delete('user_role');
    return response;
  }

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Redirect authenticated users away from auth routes to their dashboard
  if (isAuthenticated && isAuthRoute) {
    if (userRole === 'admin' || userRole === 'superadmin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    } else if (userRole === 'supervisor') {
      return NextResponse.redirect(new URL('/supervisor/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/student/dashboard', request.url));
    }
  }

  // Redirect unauthenticated users to login for protected routes
  if (!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based route protection
  if (isAuthenticated && isProtectedRoute) {
    // Admin routes - admins and superadmins can access
    if (pathname.startsWith('/admin') && userRole !== 'admin' && userRole !== 'superadmin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    
    // Student routes - only students can access
    if (pathname.startsWith('/student') && userRole !== 'student') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    
    // Supervisor routes - only supervisors can access
    if (pathname.startsWith('/supervisor') && userRole !== 'supervisor') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
