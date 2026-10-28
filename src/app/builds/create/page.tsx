'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LoadoutBuilder } from '@/components/albion/LoadoutBuilder';
import { ThemeToggle } from '@/components/albion/ThemeToggle';
import { MobileBottomNav } from '@/components/albion/MobileBottomNav';
import { AppLanguage } from '@/i18n/translations';
import { ArrowLeft, Database, Globe } from 'lucide-react';

export default function CreateBuildPage() {
  const [lang, setLang] = useState<AppLanguage>('vi');

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary p-3 md:p-6 lg:p-8 pb-24 lg:pb-8">
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
              href="/items"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-bg-secondary hover:bg-bg-elevated text-xs font-medium text-text-primary border border-border-subtle transition-all"
            >
              <Database className="w-4 h-4 text-accent-primary" />
              <span>
                {lang === 'vi'
                  ? 'Kho Vật Phẩm'
                  : 'Item Database'}
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

        <LoadoutBuilder lang={lang} />
      </div>

      <MobileBottomNav activeTab="build" lang={lang} />
    </div>
  );
}

