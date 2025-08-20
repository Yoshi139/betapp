// components/Auth.tsx
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import Button from './ui/Button';
import type { User } from '@supabase/supabase-js';

export default function Auth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => mounted && setUser(data.session?.user ?? null));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (!user) {
    return <Button variant="primary" onClick={handleSignIn}>Sign in with Google</Button>;
  }

  return (
    <div className="flex items-center gap-3">
      <div className="px-3 py-1 bg-white/6 rounded-full text-sm">{user.email}</div>
      <Button variant="ghost" onClick={handleSignOut}>Sign out</Button>
    </div>
  );
}
