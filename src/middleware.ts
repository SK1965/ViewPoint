import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define your protected routes here
const protectedRoutes = [
  '/settings',
  // Add other protected routes
];

export async function middleware(request: NextRequest) {
  // Retrieve the token from the request using next-auth
  const token = await getToken({ req: request });
  
  // Get the requested URL
  const { pathname } = request.nextUrl;
  
  // Check if the route is protected and user is not authenticated
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  if (isProtectedRoute && !token) {
    // Create the sign-in URL with the return URL parameter
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }
  
  // If user is already authenticated and trying to access auth pages, redirect to dashboard
  if (token && (
    pathname.startsWith('/sign-in') ||
    pathname.startsWith('/sign-up') ||
    pathname.startsWith('/verify')
  )) {
    // Check if there's a returnUrl in the query parameters
    const url = request.nextUrl.clone();
    const returnUrl = url.searchParams.get('returnUrl');
    
    // If there's a valid return URL, redirect to it
    if (returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//')) {
      return NextResponse.redirect(new URL(returnUrl, request.url));
    }
    
    // Otherwise, redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Specify which paths this middleware should run on
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
};