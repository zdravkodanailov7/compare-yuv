import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();  // Await here to fix Promise type error
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: { path?: string; domain?: string; maxAge?: number; expires?: Date; httpOnly?: boolean; secure?: boolean; sameSite?: 'strict' | 'lax' | 'none' } = {}) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: { path?: string; domain?: string; httpOnly?: boolean; secure?: boolean; sameSite?: 'strict' | 'lax' | 'none' } = {}) {
          cookieStore.set({ name, value: '', ...options, maxAge: 0 });
        },
      },
    }
  );
}