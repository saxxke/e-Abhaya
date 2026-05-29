import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const role = token.role;

    // Enforce dashboard route segregation based on roles
    if (path.startsWith('/dashboard/citizen') && role !== 'CITIZEN') {
      // Redirect to correct dashboard if logged in but on wrong path
      if (role === 'OFFICER') {
        return NextResponse.redirect(new URL('/dashboard/officer', req.url));
      }
      return NextResponse.redirect(new URL('/login', req.url));
    }

    if (path.startsWith('/dashboard/officer') && role !== 'OFFICER') {
      if (role === 'CITIZEN') {
        return NextResponse.redirect(new URL('/dashboard/citizen', req.url));
      }
      return NextResponse.redirect(new URL('/login', req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
);

export const config = {
  matcher: ['/dashboard/:path*']
};
