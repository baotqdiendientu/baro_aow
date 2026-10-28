'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AlbionItem } from '@/types/albion';
import { AppLanguage } from '@/i18n/translations';
import { ItemTooltip } from './ItemTooltip';
import { WeaponPlaybook } from './WeaponPlaybook';
import { ThemeToggle } from './ThemeToggle';
import { MobileBottomNav } from './MobileBottomNav';
import { ArrowLeft, BookOpen, Compass, Globe, Shield, Swords } from 'lucide-react';

export interface ItemDetailClientViewProps {
  item: AlbionItem;
}

export const ItemDetailClientView: React.FC<ItemDetailClientViewProps> = ({
  item,
}) => {
  const [lang, setLang] = useState<AppLanguage>('vi');
  const [activeTab, setActiveTab] = useState<'stats' | 'playbook'>('playbook');

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary p-3 md:p-6 pb-24 lg:pb-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/items"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-bg-secondary hover:bg-bg-elevated text-xs font-medium text-accent-primary border border-border-gold/50 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>
                {lang === 'vi'
                  ? 'Kho Vật Phẩm (/items)'
                  : 'Item Database (/items)'}
              </span>
            </Link>

            <Link
              href="/guides/pve"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-bg-secondary hover:bg-bg-elevated text-xs font-medium text-text-primary border border-border-subtle hover:border-border-gold/50 transition-all"
            >
              <Compass className="w-4 h-4 text-accent-primary" />
              <span>
                {lang === 'vi'
                  ? 'Cẩm Nang PvE (/guides/pve)'
                  : 'PvE Guides (/guides/pve)'}
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* VI / EN Switcher */}
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

        {/* Horizontal Tab Bar: Thông Số & Kỹ Năng vs Mẹo & Khắc Chế */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-bg-secondary border border-border-subtle">
          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={[
              'flex-1 py-2.5 px-4 rounded-lg font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all',
              activeTab === 'stats'
                ? 'bg-accent-primary text-bg-primary shadow-rpg-gold'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-primary/60',
            ].join(' ')}
          >
            <Shield className="w-4 h-4" />
            <span>
              {lang === 'vi'
                ? 'Chỉ Số & Kỹ Năng (Stats & Spells)'
                : 'Item Stats & Spell Pool'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('playbook')}
            className={[
              'flex-1 py-2.5 px-4 rounded-lg font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all',
              activeTab === 'playbook'
                ? 'bg-accent-primary text-bg-primary shadow-rpg-gold'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-primary/60',
            ].join(' ')}
          >
            <Swords className="w-4 h-4" />
            <span>
              {lang === 'vi'
                ? 'Mẹo & Khắc Chế (Combo & Matchups)'
                : 'Weapon Playbook (Combos & Counter-Play)'}
            </span>
            <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase rounded bg-red-500 text-white">
              NEW
            </span>
          </button>
        </div>

        {/* Active Tab Viewport */}
        {activeTab === 'stats' ? (
          <ItemTooltip item={item} lang={lang} />
        ) : (
          <div className="space-y-6">
            <WeaponPlaybook item={item} lang={lang} />
            <div className="pt-2">
              <div className="mb-3 flex items-center gap-2 text-xs font-mono uppercase text-text-muted">
                <BookOpen className="w-3.5 h-3.5 text-accent-primary" />
                <span>
                  {lang === 'vi'
                    ? 'Bảng Chỉ Số Gốc & Kỹ Năng Đính Kèm:'
                    : 'Base Item Tooltip & Spell Reference:'}
                </span>
              </div>
              <ItemTooltip item={item} lang={lang} compact />
            </div>
          </div>
        )}
      </div>

      <MobileBottomNav activeTab="items" lang={lang} />
    </div>
  );
};

