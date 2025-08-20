// app/room/[id]/bet/[betId]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function BetPage() {
  const params = useParams();
  const roomId = params?.id;
  const betId = params?.betId;
  const [bet, setBet] = useState<any | null>(null);

  useEffect(() => {
    if (!betId) return;
    let mounted = true;

    (async () => {
      try {
        const { data, error } = await supabase
          .from('bets')
          .select('*')
          .eq('id', betId)
          .single();

        if (error) throw error;

        if (mounted) setBet(data);
      } catch (err) {
        console.error(err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [betId]);

  if (!bet) return <div>Loading bet…</div>;
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-2">{bet.description}</h2>
      <div className="text-sm text-gray-600 mb-4">Status: {bet.status}</div>
      <div>
        <pre>{JSON.stringify(bet, null, 2)}</pre>
      </div>
    </div>
  );
}
