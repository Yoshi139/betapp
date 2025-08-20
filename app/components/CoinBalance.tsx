// components/CoinBalance.tsx
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { getGuestId } from '@/lib/guest';

export default function CoinBalance({ userId }: { userId?: string | null }) {
  const [coins, setCoins] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (userId) {
        const { data } = await supabase.from('profiles').select('mock_coins').eq('id', userId).single();
        if (mounted) setCoins(data?.mock_coins ?? null);
      } else {
        const guestId = getGuestId();
        if (guestId) {
          const { data } = await supabase.from('guests').select('mock_coins').eq('id', guestId).single();
          if (mounted) setCoins(data?.mock_coins ?? null);
        }
      }
    }
    load();
    return () => { mounted = false; };
  }, [userId]);

  if (coins === null) return <div>Loading...</div>;
  return <div className="bg-gray-100 p-2 rounded"><strong>{coins}</strong> coins</div>;
}
