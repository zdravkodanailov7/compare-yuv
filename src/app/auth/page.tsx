'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@/lib/supabase';  // Your supabase client from Phase 2
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';

export default function AuthPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase.auth]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-background border border-border rounded-lg shadow-md">
        {/* Header with theme toggle */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">CompareYUV</h1>
          <AnimatedThemeToggler />
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            style: {
              button: {
                background: 'var(--primary)',
                color: 'var(--primary-foreground)',
                borderRadius: 'var(--radius-sm)',
              },
              input: {
                background: 'var(--background)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
              },
              label: {
                color: 'var(--foreground)',
              },
              message: {
                color: 'var(--foreground)',
              },
              anchor: {
                color: 'var(--primary)',
              },
              divider: {
                background: 'var(--border)',
              },
            },
          }}
          providers={[]}  // No external providers, just email/password
          view="sign_in"  // Default to sign-in; UI allows switching to sign-up
        />
      </div>
    </div>
  );
}