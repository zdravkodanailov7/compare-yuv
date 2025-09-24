import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next({ request: req });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // @ts-expect-error: req.cookies.get returns a Cookie object, not a string, but Supabase expects a string value
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: { path?: string; domain?: string; maxAge?: number; expires?: Date; httpOnly?: boolean; secure?: boolean; sameSite?: 'strict' | 'lax' | 'none' } = {}) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: { path?: string; domain?: string; httpOnly?: boolean; secure?: boolean; sameSite?: 'strict' | 'lax' | 'none' } = {}) {
          res.cookies.set({ name, value: '', ...options, maxAge: 0 });
        },
      },
    }
  );

  // Refresh session (no need for separate updateSession if simple)
  await supabase.auth.getUser();  // This refreshes if expired

  // Optional: Redirect if not authenticated (customize paths)
  // Allow public home page, auth page, and share pages for non-authenticated users
  if (
    !['/auth', '/'].some(path => req.nextUrl.pathname.startsWith(path)) &&
    !req.nextUrl.pathname.startsWith('/share') &&
    !(await supabase.auth.getUser()).data.user
  ) {
    return NextResponse.redirect(new URL('/auth', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};