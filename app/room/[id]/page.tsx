// app/room/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import RoomLobby from '../../components/RoomLobby';
import { supabase } from '@/lib/supabase/client';

export default function RoomPage() {
  const params = useParams();
  const roomId = params?.id as string;
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUserId(data.session?.user?.id ?? null);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!roomId) return <div>Room not found</div>;
  return (
    <main className="p-6">
      <RoomLobby roomId={roomId} userId={userId} />
    </main>
  );
}
