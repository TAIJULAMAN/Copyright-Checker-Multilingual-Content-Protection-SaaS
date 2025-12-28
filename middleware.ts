import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value
  const { pathname } = request.nextUrl
  
  // Define protected routes
  const protectedRoutes = ['/scan', '/results', '/mysubscription', '/payment']
  
  // Check if the requested path starts with any of the protected routes
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  if (isProtectedRoute && !token) {
    // Redirect to login page with return URL
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // Also redirect logged-in users away from auth pages
  const authRoutes = ['/login', '/signup']
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
  
  if (isAuthRoute && token) {
     return NextResponse.redirect(new URL('/scan', request.url))
  }
  
  return NextResponse.next()
}
 
export const config = {
  matcher: [
    '/scan/:path*',
    '/results/:path*',
    '/mysubscription/:path*',
    '/payment/:path*',
    '/login',
    '/signup'
  ],
}
