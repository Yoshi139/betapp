// components/RoomLobby.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { getGuestId, ensureGuestId, getGuestNick, setGuestNick } from '@/lib/guest';
import { createGuest, joinRoomAsGuest, joinRoomAsUser, getRoomMembers } from '@/lib/api';
import type { RoomMember } from '../types';
import CoinBalance from './CoinBalance';
import BetForm from './BetForm';
import BetCard from './BetCard';

export default function RoomLobby({ roomId, userId }: { roomId: string; userId?: string | null }) {
  const [members, setMembers] = useState<RoomMember[]>([]);
  const [nickname, setNickname] = useState<string>(getGuestNick() ?? '');
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const rows = await getRoomMembers(roomId);
        if (mounted) setMembers(rows);
      } catch (err) {
        console.error(err);
      }
    }
    load();

    // Subscribe to live changes on room_members
    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'room_members', filter: `room_id=eq.${roomId}` },
        (payload) => {
          // quick-and-dirty re-fetch; for a production app do a more careful merge
          getRoomMembers(roomId).then((rows) => mounted && setMembers(rows)).catch(console.error);
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      channel.unsubscribe();
    };
  }, [roomId]);

  // join logic: prefer signed in user; otherwise create guest & join
  async function joinRoom() {
    try {
      if (userId) {
        await joinRoomAsUser({ roomId, userId });
      } else {
        const id = ensureGuestId();
        if (!nickname) {
          alert('Pick a nickname first');
          return;
        }
        setGuestNick(nickname);
        await createGuest({ id, nickname });
        await joinRoomAsGuest({ roomId, guestId: id });
      }
      // reload members (subscription will also update)
      const rows = await getRoomMembers(roomId);
      setMembers(rows);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to join room');
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
        <div>
            <div className="text-subtle text-sm">Room</div>
            <h1 className="text-2xl font-bold">Room {roomId.slice(0,6)}</h1>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-sm text-subtle">Your Balance</div>
            <div className="bg-white/6 px-3 py-2 rounded-lg text-sm font-medium">{/* CoinBalance component */}<CoinBalance userId={userId ?? undefined} /></div>
        </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* left: members & join */}
        <div className="card-glass card-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-subtle">Members</div>
            <div className="text-sm text-subtle">{members.length}</div>
            </div>
            <div className="space-y-3">
            {members.map((m) => (
                <div key={m.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/2 transition">
                <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center font-semibold text-white">{(m.user?.username ?? m.guest?.nickname ?? 'U').slice(0,2).toUpperCase()}</div>
                <div className="flex-1">
                    <div className="font-medium">{m.user?.username ?? m.guest?.nickname ?? 'unknown'}</div>
                    <div className="text-sm text-subtle">{m.coins} coins</div>
                </div>
                </div>
            ))}
            </div>

            <div className="mt-4">
            {!userId && (
                <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Pick a nickname" className="w-full rounded-xl p-2 bg-transparent border border-white/6 mb-2" />
            )}
            <button onClick={joinRoom} className="w-full bg-brand-500 hover:bg-brand-700 text-white rounded-xl py-2">Join Room</button>
            </div>
        </div>

        {/* middle: bets */}
        <div className="md:col-span-2 space-y-4">
            <div className="card-glass card-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
                <div className="font-semibold">Create a bet</div>
                <div className="text-sm text-subtle">No money — just points</div>
            </div>
            <BetForm roomId={roomId} onCreated={() => {}} />
            </div>

            <div className="space-y-3">
            {/** Map your bets to BetCard; BetCard is also styled below */}
            </div>
        </div>
        </div>
    </div>
    );
}

// small internal client component to list bets
function RoomBets({ roomId }: { roomId: string }) {
  const [bets, setBets] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const { data, error } = await supabase.from('bets').select('*').eq('room_id', roomId).order('created_at', { ascending: false });
      if (error) {
        console.error(error);
        return;
      }
      if (mounted) setBets(data ?? []);
    }
    load();

    const ch = supabase
      .channel(`bets-${roomId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bets', filter: `room_id=eq.${roomId}` }, () => load())
      .subscribe();
    return () => {
      mounted = false;
      ch.unsubscribe();
    };
  }, [roomId]);

  return <div>{bets.map((b) => <BetCard key={b.id} bet={b} />)}</div>;
}
