// components/BetCard.tsx
'use client';
import type { Bet } from '../types';
import Button from './ui/Button';

export default function BetCard({ bet }: { bet: Bet }) {
  return (
    <div className="card-glass card-border rounded-xl p-4 shadow-soft hover:shadow-lift transition">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-subtle">{new Date(bet.created_at ?? Date.now()).toLocaleString()}</div>
          <div className="font-semibold text-lg mt-1">{bet.description}</div>
          <div className="text-sm text-subtle mt-2">Status: <span className="font-medium text-white">{bet.status}</span></div>
        </div>
        <div className="flex flex-col gap-2">
          <Button size="sm" variant="neutral" onClick={() => { /* view */ }}>View</Button>
          <Button size="sm" variant="ghost" onClick={() => { /* join */ }}>Join</Button>
        </div>
      </div>
    </div>
  );
}
