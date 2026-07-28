import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 301 Redirect map for migrating legacy WordPress URLs to the new unified structure
const REDIRECT_MAP: Record<string, string> = {
  '/portfolio/tori-sayeban': '/products/tori-sayeban',
  '/product/tori-sayeban-3x5-green': '/products/tori-sayeban',
  '/product/tori-sayeban-4x6-green': '/products/tori-sayeban',
  '/portfolio/tori-hesari': '/products/tori-hesari',
  // Add other legacy variant or portfolio URLs here
};

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Simple Admin Auth Check
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const authCookie = request.cookies.get('admin_auth_session');
    if (!authCookie || authCookie.value !== 'true') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Check if the exact pathname exists in our redirect map
  const targetPath = REDIRECT_MAP[pathname];

  if (targetPath) {
    // Preserve search params if needed, or just redirect to the clean target
    const url = new URL(targetPath, request.url);
    if (search) {
      url.search = search;
    }
    return NextResponse.redirect(url, 301); // 301 Permanent Redirect for SEO
  }

  // Fallback pattern matching for common WordPress product variant URLs
  // If they follow a specific pattern, we can dynamically redirect them
  if (pathname.startsWith('/product/') && pathname.includes('tori-sayeban')) {
    return NextResponse.redirect(new URL('/products/tori-sayeban', request.url), 301);
  }

  return NextResponse.next();
}

export const config = {
  // Only run the middleware on relevant paths to keep performance high
  matcher: [
    '/portfolio/:path*',
    '/product/:path*',
    '/admin/:path*'
  ],
};
