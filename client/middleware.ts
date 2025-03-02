import { NextResponse } from 'next/server';
import { auth } from './auth';

export default auth(() => {
  // const isLoggedIn = !!req.auth;
  // const isOnLoginPage = req.nextUrl.pathname.startsWith('/login');
  // const isOnRegisterPage = req.nextUrl.pathname.startsWith('/register');
  // const isOnPasswordResetPage =
  //   req.nextUrl.pathname.startsWith('/password-reset');

  // if (req.nextUrl.pathname === '/') {
  //   if (isLoggedIn) {
  //     return NextResponse.redirect(new URL('/dashboard', req.url));
  //   } else {
  //     return NextResponse.next();
  //   }
  // }

  // if (isOnLoginPage || isOnRegisterPage || isOnPasswordResetPage) {
  //   if (isLoggedIn) {
  //     return NextResponse.redirect(new URL('/dashboard', req.url));
  //   }
  // } else {
  //   if (!isLoggedIn) {
  //     return NextResponse.redirect(new URL('/', req.url));
  //   }
  // }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets).*)'],
};