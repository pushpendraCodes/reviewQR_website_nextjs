import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;

  // ─── Dashboard: require auth ───
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      const loginUrl = new URL('/auth/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    // Add X-Robots-Tag to prevent indexing of dashboard pages
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  // ─── Auth pages: redirect logged-in users to dashboard ───
  if (request.nextUrl.pathname.startsWith('/auth/')) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // Add X-Robots-Tag to prevent indexing of auth pages
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};
