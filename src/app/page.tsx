'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import LandingPage from '@/components/LandingPage';
import Dashboard from '@/components/Dashboard';
import AuthPage from '@/components/AuthPage';

export default function Home() {
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleSignIn = () => {
    router.push('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Show authentication page if no user
  if (!user) {
    return <LandingPage onSignIn={handleSignIn} />;
  }

  // Show dashboard for authenticated users
  return <Dashboard user={user} onLogout={handleLogout} />;
}