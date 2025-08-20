// lib/guest.ts
// Client-only helper to manage guest identity in localStorage.

const GUEST_ID_KEY = 'wager_guest_id';
const GUEST_NICK_KEY = 'wager_guest_nick';

export function getGuestId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(GUEST_ID_KEY);
}

export function setGuestId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GUEST_ID_KEY, id);
}

export function ensureGuestId(): string {
  const existing = getGuestId();
  if (existing) return existing;

  // use crypto.randomUUID if available (modern browsers)
  const newId =
    typeof crypto !== 'undefined' && typeof (crypto as any).randomUUID === 'function'
      ? (crypto as any).randomUUID()
      : 'guest-' + Math.random().toString(36).slice(2, 9);

  setGuestId(newId);
  return newId;
}

export function getGuestNick(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(GUEST_NICK_KEY);
}

export function setGuestNick(nick: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GUEST_NICK_KEY, nick);
}