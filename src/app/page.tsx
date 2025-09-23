'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import LandingPage from '@/components/LandingPage';
import Dashboard from '@/components/Dashboard';
import AuthPage from '@/components/AuthPage';
import { PageLoadingSkeleton } from '@/components/ui/skeleton';

const HomeComponent = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      setLoading(false);
    };

    getUser();
  }, [supabase.auth]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, [supabase.auth]);

  const handleSignIn = useCallback(() => {
    router.push('/auth');
  }, [router]);

  if (loading) {
    return <PageLoadingSkeleton />;
  }

  // Show authentication page if no user
  if (!user) {
    return <LandingPage onSignIn={handleSignIn} />;
  }

  // Show dashboard for authenticated users
  return <Dashboard user={user} onLogout={handleLogout} />;
};

export default React.memo(HomeComponent);