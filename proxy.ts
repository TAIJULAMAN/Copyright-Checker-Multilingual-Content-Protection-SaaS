import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Run next-intl middleware to handle text-formatting/redirects
  // This will return a response with appropriate headers/rewrite/redirect
  const response = intlMiddleware(request);

  // 2. Auth Logic
  const token = request.cookies.get('accessToken')?.value;

  // Remove the locale prefix to check against protected routes
  // Matches /en, /de, /en/..., /de/...
  const pathnameWithoutLocale = pathname.replace(/^\/(en|de)/, '');
  const pathToCheck = pathnameWithoutLocale === '' ? '/' : pathnameWithoutLocale;

  // Define protected routes
  const protectedRoutes = ['/scan', '/results', '/mysubscription', '/payment'];
  
  // Check if the requested path starts with any of the protected routes
  const isProtectedRoute = protectedRoutes.some(route => pathToCheck.startsWith(route));
  
  if (isProtectedRoute && !token) {
    // Redirect to login page
    // We need to preserve the locale if present, or default to it.
    // However, since we are inside middleware, constructing the URL with NextURL
    // works best.
    
    // Check if path already starts with a locale
    const hasLocale = /^\/(en|de)/.test(pathname);
    const locale = hasLocale ? pathname.split('/')[1] : 'en';

    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set('callbackUrl', pathToCheck); // Keep path without locale as callback
    return NextResponse.redirect(loginUrl);
  }
  
  // Also redirect logged-in users away from auth pages
  const authRoutes = ['/login', '/signup'];
  const isAuthRoute = authRoutes.some(route => pathToCheck.startsWith(route));
  
  if (isAuthRoute && token) {
     const hasLocale = /^\/(en|de)/.test(pathname);
     const locale = hasLocale ? pathname.split('/')[1] : 'en';
     return NextResponse.redirect(new URL(`/${locale}/scan`, request.url));
  }
  
  return response;
}
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(de|en)/:path*']
};
