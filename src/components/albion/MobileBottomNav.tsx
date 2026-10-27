'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Coins, Database, Search, Swords } from 'lucide-react';
import { AppLanguage } from '@/i18n/translations';

export interface MobileBottomNavProps {
  activeTab?: 'search' | 'items' | 'build' | 'market';
  onSelectTab?: (tab: 'search' | 'items' | 'build' | 'market') => void;
  lang?: AppLanguage;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  lang = 'vi',
}) => {
  const pathname = usePathname();
  const router = useRouter();

  // Determine current active tab based on pathname if not explicitly passed
  const currentTab =
    activeTab ||
    (pathname === '/builds/create' || pathname?.startsWith('/build')
      ? 'build'
      : pathname === '/items'
        ? 'items'
        : 'items');

  const tabs: {
    id: 'search' | 'items' | 'build' | 'market';
    label_vi: string;
    label_en: string;
    icon: React.ReactNode;
    href: string;
  }[] = [
    {
      id: 'search',
      label_vi: 'Tìm kiếm',
      label_en: 'Search',
      icon: <Search className="w-5 h-5" />,
      href: '/items?focus=search',
    },
    {
      id: 'items',
      label_vi: 'Vật phẩm',
      label_en: 'Items',
      icon: <Database className="w-5 h-5" />,
      href: '/items',
    },
    {
      id: 'build',
      label_vi: 'Lắp Build',
      label_en: 'Builds',
      icon: <Swords className="w-5 h-5" />,
      href: '/builds/create',
    },
    {
      id: 'market',
      label_vi: 'Giá Chợ',
      label_en: 'Market',
      icon: <Coins className="w-5 h-5" />,
      href: '/#market',
    },
  ];

  const handleTabClick = (
    e: React.MouseEvent,
    tab: (typeof tabs)[0]
  ) => {
    if (onSelectTab) {
      e.preventDefault();
      onSelectTab(tab.id);
    }
  };

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-bg-surface/95 backdrop-blur-lg border-t border-border-gold/30 shadow-[0_-4px_20px_rgba(0,0,0,0.35)] pb-safe"
    >
      <div className="grid grid-cols-4 h-14 items-center">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              onClick={(e) => handleTabClick(e, tab)}
              className={[
                'flex flex-col items-center justify-center h-full gap-0.5 transition-colors select-none relative',
                isActive
                  ? 'text-accent-primary font-bold'
                  : 'text-text-secondary hover:text-text-primary',
              ].join(' ')}
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 bg-accent-primary rounded-full shadow-[0_0_8px_var(--accent-primary)]" />
              )}
              <div className={isActive ? 'scale-105 transition-transform' : ''}>
                {tab.icon}
              </div>
              <span className="text-[10px] tracking-tight leading-none">
                {lang === 'vi' ? tab.label_vi : tab.label_en}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

