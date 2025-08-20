// app/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Auth from './components/Auth';
import Button from './components/ui/Button';
import { createRoom } from '@/lib/api';
import { supabase } from '@/lib/supabase/client';

export default function HomePage() {
  const [roomName, setRoomName] = useState('');
  const router = useRouter();

  async function handleCreateRoom() {
    try {
      const { data } = await supabase.auth.getSession();
      const userId = data.session?.user?.id;
      const room = await createRoom({ name: roomName || undefined, created_by: userId });
      router.push(`/room/${room.id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to create room');
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-3xl card-glass card-border rounded-2xl p-10 shadow-lift">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold leading-tight">Wager</h1>
            <p className="text-subtle mt-1">Friendly, private bets — points only.</p>
          </div>
          <div><Auth /></div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 md:col-span-1">
            <label className="text-sm text-subtle">Optional room name</label>
            <input value={roomName} onChange={(e) => setRoomName(e.target.value)} className="mt-2 block w-full bg-transparent border border-white/6 rounded-xl p-3 placeholder:text-subtle focus:ring-2 focus:ring-brand-300" placeholder="e.g. Super Bowl office pool" />
            <div className="mt-4 flex gap-3">
              <Button onClick={handleCreateRoom} variant="primary">Create room</Button>
              <Button onClick={() => {
                const id = prompt('Paste /room/<id> or ID');
                if (id) router.push(`/room/${id.includes('/room/') ? id.split('/room/').pop() : id}`);
              }} variant="neutral">Join by ID</Button>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <div className="bg-white/3 rounded-xl p-4 h-full card-border">
              <h3 className="font-semibold">Why Wager</h3>
              <p className="text-sm text-subtle mt-2">No money. Low friction. Create rooms, invite friends, and keep score — sign in only when you care about persistence.</p>
              <div className="mt-4 text-sm text-subtle">Tip: share the room link directly to invite friends.</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
