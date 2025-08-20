// components/ui/Button.tsx
'use client';
import React from 'react';
import clsx from 'clsx';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary'|'neutral'|'danger'|'ghost';
  size?: 'sm'|'md';
};

export default function Button({ variant='primary', size='md', className, children, ...rest }: Props) {
  const base = 'rounded-xl-2 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-1 transition';
  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-sm'
  };
  const variants = {
    primary: 'bg-brand-500 hover:bg-brand-700 text-white shadow-soft',
    neutral: 'bg-white/6 hover:bg-white/8 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'bg-transparent text-white/80 hover:text-white'
  };

  return (
    <button className={clsx(base, sizes[size], variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}
