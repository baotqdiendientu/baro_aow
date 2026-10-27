'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { AppLanguage } from '@/i18n/translations';

export interface ThemeToggleProps {
  lang?: AppLanguage;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  lang = 'vi',
  className = '',
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={
        theme === 'dark'
          ? lang === 'vi'
            ? 'Chuyển sang chế độ Sáng (Giấy da trung cổ)'
            : 'Switch to Light Mode (Medieval Parchment)'
          : lang === 'vi'
            ? 'Chuyển sang chế độ Tối (Dark Tactical RPG)'
            : 'Switch to Dark Mode (Tactical RPG)'
      }
      aria-label="Toggle theme"
      className={[
        'p-2 rounded-xl border transition-all duration-200 flex items-center justify-center',
        'bg-bg-secondary hover:bg-bg-elevated border-border-gold/40 hover:border-border-gold text-accent-primary shadow-sm',
        className,
      ].join(' ')}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
};

