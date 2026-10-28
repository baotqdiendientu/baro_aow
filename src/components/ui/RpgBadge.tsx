'use client';

import React from 'react';

export interface RpgBadgeProps {
  variant?: 'gold' | 'emerald' | 'amber' | 'crimson' | 'sky' | 'subtle';
  size?: 'xs' | 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

const VARIANT_STYLES: Record<NonNullable<RpgBadgeProps['variant']>, string> = {
  gold: 'bg-accent-primary/15 text-accent-primary border-border-gold/40',
  emerald: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40',
  amber: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40',
  crimson: 'bg-accent-crimson/15 text-red-600 dark:text-red-300 border-accent-crimson/40',
  sky: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/40',
  subtle: 'bg-bg-primary/80 text-text-secondary border-border-subtle',
};

const SIZE_STYLES: Record<NonNullable<RpgBadgeProps['size']>, string> = {
  xs: 'px-1.5 py-0.5 text-[9px] font-mono font-bold leading-none',
  sm: 'px-2 py-0.5 text-[10px] font-mono font-bold leading-tight',
  md: 'px-2.5 py-1 text-xs font-mono font-bold',
};

export const RpgBadge: React.FC<RpgBadgeProps> = ({
  variant = 'gold',
  size = 'sm',
  children,
  className = '',
}) => {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 rounded border transition-colors select-none',
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
};
