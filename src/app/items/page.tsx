'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AlbionDatabaseExplorer } from '@/components/albion/AlbionDatabaseExplorer';
import { ThemeToggle } from '@/components/albion/ThemeToggle';
import { MobileBottomNav } from '@/components/albion/MobileBottomNav';
import { AppLanguage } from '@/i18n/translations';
import { ArrowLeft, Globe, Layers } from 'lucide-react';

export default function ItemsDatabasePage() {
  const [lang, setLang] = useState<AppLanguage>('vi');

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-bg-secondary hover:bg-bg-elevated text-xs font-medium text-accent-primary border border-border-gold/50 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/builds/create"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-accent-primary text-bg-primary text-xs font-bold transition-all shadow-rpg-gold"
            >
              <Layers className="w-4 h-4" />
              <span>
                {lang === 'vi'
                  ? 'Lắp Build 10 Ô'
                  : 'Create Loadout'}
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <div className="flex items-center bg-bg-secondary p-0.5 rounded-lg border border-border-gold/50">
              <Globe className="w-3.5 h-3.5 text-accent-primary ml-1.5 mr-1" />
              <button
                type="button"
                onClick={() => setLang('vi')}
                className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold ${
                  lang === 'vi'
                    ? 'bg-accent-primary text-bg-primary'
                    : 'text-text-secondary'
                }`}
              >
                VI
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold ${
                  lang === 'en'
                    ? 'bg-accent-primary text-bg-primary'
                    : 'text-text-secondary'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        <AlbionDatabaseExplorer lang={lang} />
      </div>

      <MobileBottomNav activeTab="items" lang={lang} />
    </div>
  );
}

