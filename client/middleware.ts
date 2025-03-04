import { NextResponse } from 'next/server';
import { auth } from './auth';

const unAuthenticatedPaths = [
  '/login',
  '/register',
  '/forgot-password',
  '/verify-email',
];

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnUnAuthenticatedPage = unAuthenticatedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (req.nextUrl.pathname === '/') {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    } else {
      return NextResponse.next();
    }
  }

  if (isOnUnAuthenticatedPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  } else {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets).*)'],
};
