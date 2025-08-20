// types/index.ts
export interface Room {
  id: string;
  name?: string;
  created_by?: string | null;
  created_at?: string;
}

export interface UserProfile {
  id: string;
  username?: string;
  avatar_url?: string | null;
  mock_coins?: number;
}

export interface Guest {
  id: string;
  nickname: string;
  mock_coins?: number;
  created_at?: string;
}

export interface RoomMember {
  id: string;
  room_id: string;
  user_id?: string | null;
  guest_id?: string | null;
  coins: number;
  joined_at?: string;
  user?: UserProfile | null;
  guest?: Guest | null;
}

export type BetStatus = 'pending' | 'active' | 'settled';

export interface Bet {
  id: string;
  room_id: string;
  created_by_user?: string | null;
  created_by_guest?: string | null;
  description: string;
  status: BetStatus;
  created_at?: string;
}
