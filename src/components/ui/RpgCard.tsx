'use client';

import React from 'react';

export interface RpgCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  interactive?: boolean;
}

export const RpgCard: React.FC<RpgCardProps> = ({
  glow = false,
  interactive = false,
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      {...props}
      className={[
        'rounded-xl border transition-all duration-200 bg-bg-secondary border-border-subtle p-3 md:p-6',
        glow ? 'border-border-gold shadow-rpg-gold ring-1 ring-accent-primary/40' : '',
        interactive
          ? 'cursor-pointer hover:border-border-gold/60 hover:bg-bg-elevated/70 hover:shadow-rpg-gold active:scale-[0.99]'
          : '',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
};

