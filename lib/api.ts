// lib/api.ts
import { supabase } from './supabase/client';
import type { Room, RoomMember, Bet } from '../app/types';

export async function createRoom({ name, created_by }: { name?: string; created_by?: string }) {
  const { data, error } = await supabase
    .from('rooms')
    .insert({ name, created_by })
    .select('*')
    .limit(1)
    .single();
  if (error) throw error;
  return data as Room;
}

export async function getRoom(roomId: string) {
  const { data, error } = await supabase.from('rooms').select('*').eq('id', roomId).single();
  if (error) throw error;
  return data;
}

export async function createGuest({ id, nickname }: { id: string; nickname: string }) {
  const { data, error } = await supabase.from('guests').insert({ id, nickname }).select('*').single();
  if (error) {
    // If guest already exists, just return it
    if ((error as any).code === '23505') {
      const { data: existing } = await supabase.from('guests').select('*').eq('id', id).single();
      return existing;
    }
    throw error;
  }
  return data;
}

export async function joinRoomAsGuest({ roomId, guestId }: { roomId: string; guestId: string }) {
  // ensure guest row exists in guests table (caller should call createGuest)
  const { data, error } = await supabase
    .from('room_members')
    .insert({ room_id: roomId, guest_id: guestId, coins: 1000 })
    .select('*')
    .limit(1)
    .single();
  if (error) throw error;
  return data as RoomMember;
}

export async function joinRoomAsUser({ roomId, userId }: { roomId: string; userId: string }) {
  const { data, error } = await supabase
    .from('room_members')
    .insert({ room_id: roomId, user_id: userId, coins: 1000 })
    .select('*')
    .limit(1)
    .single();
  if (error) throw error;
  return data as RoomMember;
}

export async function getRoomMembers(roomId: string): Promise<RoomMember[]> {
  const { data, error } = await supabase
    .from('room_members')
    .select(`
      id,
      room_id,
      user_id,
      guest_id,
      coins,
      joined_at,
      user:user_id ( id, username, avatar_url ),
      guest:guest_id ( id, nickname )
    `)
    .eq('room_id', roomId);

  if (error) throw error;

  const rows = (data ?? []) as any[];

  const normalized = rows.map((r) => ({
    id: r.id,
    room_id: r.room_id,
    user_id: r.user_id,
    guest_id: r.guest_id,
    coins: r.coins,
    joined_at: r.joined_at,
    // Supabase returns the joined relation as an array for select(...) joins.
    // Normalize to a single object or null so it matches RoomMember type.
    user: Array.isArray(r.user) ? (r.user[0] ?? null) : (r.user ?? null),
    guest: Array.isArray(r.guest) ? (r.guest[0] ?? null) : (r.guest ?? null),
  })) as RoomMember[];

  return normalized;
}

export async function createBet({ roomId, createdByUser, createdByGuest, description }: {
  roomId: string;
  createdByUser?: string;
  createdByGuest?: string;
  description: string;
}) {
  const { data, error } = await supabase
    .from('bets')
    .insert({ room_id: roomId, created_by_user: createdByUser ?? null, created_by_guest: createdByGuest ?? null, description })
    .select('*')
    .limit(1)
    .single();
  if (error) throw error;
  return data as Bet;
}
