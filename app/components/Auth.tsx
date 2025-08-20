'use client'; // This is necessary because we're using event handlers

import { supabase } from '@/lib/supabase/client';

export default function Auth() {
  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  };

  return (
    <div>
      <button onClick={handleSignIn} className="bg-blue-500 text-white p-2 rounded">
        Sign in with Google
      </button>
    </div>
  );
}