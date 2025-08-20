"use client";

import Auth from './components/Auth';
import { supabase } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export default function HomePage() {
  // State to hold the user object
  const [user, setUser] = useState<User | null>(null);

  // Effect to check for an active session when the page loads
  useEffect(() => {
    // Check for an existing active session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getSession();

    // Listen for auth changes (sign in, sign out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Cleanup function to remove the listener when the component unmounts
    return () => subscription.unsubscribe();
  }, []); // Empty dependency array means this runs once on mount

  // Function to handle signing out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to Wager</h1>
      
      {/* If the user is NOT logged in, show the Auth component */}
      {!user ? (
        <div className="text-center">
          <p className="mb-4">The best app for betting with friends.</p>
          <Auth />
        </div>
      ) : (
        /* If the user IS logged in, show a welcome message and their data */
        <div className="text-center">
          <p className="mb-2">Hey, you're logged in!</p>
          <p className="mb-4 text-gray-600">{user.email}</p>
          
          {/* This is where you'll eventually show the user's coin balance */}
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <h2 className="font-semibold">Your Mock Coin Balance</h2>
            <p className="text-2xl">1,000</p> 
            {/* We'll make this dynamic later by fetching from the `profiles` table */}
          </div>

          {/* Placeholder for the main app content */}
          <div className="border border-dashed border-gray-300 p-8 rounded-lg mb-6">
            <p className="text-gray-500">Your bet dashboard will go here.</p>
            <p className="text-sm text-gray-400">(Create, Join, Active Bets)</p>
          </div>

          <button 
            onClick={handleSignOut}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign Out
          </button>
        </div>
      )}
    </main>
  );
}