'use client';

import React from 'react';

export interface RpgButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

const VARIANT_STYLES: Record<NonNullable<RpgButtonProps['variant']>, string> = {
  primary:
    'bg-accent-primary text-bg-primary font-bold shadow-rpg-gold hover:opacity-90 active:scale-95',
  secondary:
    'bg-bg-secondary hover:bg-bg-elevated text-text-primary border border-border-subtle hover:border-border-gold/50 active:scale-95',
  outline:
    'bg-bg-primary/80 hover:bg-bg-elevated text-accent-primary border border-border-gold/50 shadow-sm active:scale-95',
  danger:
    'bg-accent-crimson text-white hover:opacity-90 active:scale-95 shadow-sm',
  ghost:
    'bg-transparent hover:bg-bg-elevated/60 text-text-secondary hover:text-text-primary',
};

const SIZE_STYLES: Record<NonNullable<RpgButtonProps['size']>, string> = {
  sm: 'px-2.5 py-1 text-xs rounded-lg gap-1.5',
  md: 'px-3.5 py-2 text-xs font-medium rounded-lg gap-2',
  lg: 'px-4 py-2.5 text-sm font-semibold rounded-xl gap-2',
};

export const RpgButton: React.FC<RpgButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center transition-all duration-150 select-none font-display',
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
        className,
      ].join(' ')}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
