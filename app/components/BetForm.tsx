// components/BetForm.tsx
'use client';
import { useState } from 'react';
import { createBet } from '@/lib/api';

export default function BetForm({ roomId, onCreated }: { roomId: string; onCreated?: (bet: any) => void }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      const bet = await createBet({ roomId, description: text });
      setText('');
      onCreated?.(bet);
    } catch (err) {
      console.error(err);
      alert('Failed to create bet');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Describe the bet…" className="border p-2 rounded flex-1" />
      <button disabled={loading} className="bg-green-600 text-white px-3 py-1 rounded">
        {loading ? 'Creating…' : 'Create'}
      </button>
    </form>
  );
}
