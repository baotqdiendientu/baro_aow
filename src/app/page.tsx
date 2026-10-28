'use client';

import React, { useState } from 'react';
import { FULL_ALBION_DB, HydratedAlbionItem } from '@/services/albion-db';
import {
  AlbionEnchantment,
  AlbionItem,
  AlbionTier,
} from '@/types/albion';
import { AppLanguage, UI_TRANSLATIONS } from '@/i18n/translations';
import { ActiveAppSection, AppShell } from '@/components/layout/AppShell';
import { AlbionDatabaseExplorer } from '@/components/albion/AlbionDatabaseExplorer';
import { DesignTokensShowcase } from '@/components/albion/DesignTokensShowcase';
import { LoadoutBuilder } from '@/components/albion/LoadoutBuilder';
import { MarketAndCraftingHub } from '@/components/albion/MarketAndCraftingHub';
import {
  Compass,
  Layers,
  Palette,
  Shield,
} from 'lucide-react';

export default function HomePage() {
  const [lang, setLang] = useState<AppLanguage>('vi');
  const [activeSection, setActiveSection] =
    useState<ActiveAppSection>('demo');
  const [compactMode, setCompactMode] = useState(false);

  const [externalSelectedItem, setExternalSelectedItem] =
    useState<HydratedAlbionItem | null>(null);
  const [externalTier, setExternalTier] = useState<AlbionTier | undefined>();
  const [externalEnchant, setExternalEnchant] = useState<
    AlbionEnchantment | undefined
  >();

  const t = UI_TRANSLATIONS[lang];

  const handleSelectSearchResult = (
    item: AlbionItem,
    customTier?: AlbionTier,
    customEnchant?: AlbionEnchantment
  ) => {
    const found =
      FULL_ALBION_DB.find((i) => i.unique_name === item.unique_name) ||
      (item as HydratedAlbionItem);
    setExternalSelectedItem(found);
    setExternalTier(customTier);
    setExternalEnchant(customEnchant);
    setActiveSection('demo');
  };

  const topPhaseTabs: {
    id: ActiveAppSection;
    label: string;
    subLabel: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'demo',
      subLabel: `${FULL_ALBION_DB.length} Vật phẩm`,
      label: lang === 'vi' ? 'Bảng Định Mệnh & Vũ Khí' : 'Destiny Board & Armory',
      icon: <Shield className="w-4 h-4" />,
    },
    {
      id: 'loadout',
      subLabel: 'Mô Phỏng Trang Bị',
      label: lang === 'vi' ? 'Khung Lắp Đồ (Builder)' : 'Loadout Builder',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      id: 'market',
      subLabel: 'Tra Cứu Giá Real-time',
      label: lang === 'vi' ? 'Giá Chợ & Chế Tạo' : 'Market & Crafting Hub',
      icon: <Compass className="w-4 h-4" />,
    },
    {
      id: 'tokens',
      subLabel: 'Design System',
      label: lang === 'vi' ? 'Bảng Thiết Kế RPG' : 'RPG Design Tokens',
      icon: <Palette className="w-4 h-4" />,
    },
  ];

  return (
    <AppShell
      items={FULL_ALBION_DB}
      onSelectSearchResult={handleSelectSearchResult}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      compactMode={compactMode}
      setCompactMode={setCompactMode}
      lang={lang}
      setLang={setLang}
    >
      {/* QUICK GAMEPLAY MODULE NAVIGATION */}
      <div className="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {topPhaseTabs.map((tab) => {
          const isCurrent = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSection(tab.id)}
              className={[
                'p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-2',
                isCurrent
                  ? 'bg-bg-elevated border-border-gold text-accent-primary shadow-rpg-gold'
                  : 'bg-bg-secondary border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-gold/40',
              ].join(' ')}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-accent-primary shrink-0">{tab.icon}</span>
                <span className="font-display font-bold text-xs sm:text-sm truncate">
                  {tab.label}
                </span>
              </div>
              <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-bg-primary text-accent-primary border border-border-gold/30 shrink-0">
                {tab.subLabel}
              </span>
            </button>
          );
        })}
      </div>

      {activeSection === 'tokens' ? (
        <DesignTokensShowcase
          lang={lang}
          onBackToArmory={() => setActiveSection('demo')}
        />
      ) : activeSection === 'loadout' ? (
        <LoadoutBuilder lang={lang} />
      ) : activeSection === 'market' ? (
        <MarketAndCraftingHub lang={lang} />
      ) : (
        <AlbionDatabaseExplorer
          lang={lang}
          externalSelectedItem={externalSelectedItem}
          externalTier={externalTier}
          externalEnchant={externalEnchant}
        />
      )}
    </AppShell>
  );
}
