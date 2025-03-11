import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// This exports the default NextAuth middleware behavior
export { default } from 'next-auth/middleware';

// The custom middleware logic
export async function middleware(request: NextRequest) {
  // Retrieve the token from the request using next-auth
  const token = await getToken({ req: request });

  // Get the requested URL
  const url = request.nextUrl;

  // If the user is already authenticated (has a token) and is trying to access 
  // routes like sign-in, sign-up, or verify, redirect them away from those pages
  if (token && (
    url.pathname.startsWith('/sign-in') ||
    url.pathname.startsWith('/sign-up') ||
    url.pathname.startsWith('/verify')
  )) {
    // Redirect to the homepage or dashboard (or any other page you wish)
    return NextResponse.redirect(new URL('/dashboard', request.url));  // Example: Redirect to /dashboard
  }

  // If no token is found (user not logged in), nothing needs to be done, 
  // as the request will continue its normal flow for sign-in, sign-up, etc.
  return NextResponse.next();
}
