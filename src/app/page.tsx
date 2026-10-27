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
    phase: string;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'demo',
      phase: `${FULL_ALBION_DB.length} Items`,
      label: t.navItemTooltipEngine,
      icon: <Shield className="w-4 h-4" />,
    },
    {
      id: 'loadout',
      phase: 'Phase 3',
      label: t.navLoadoutBuilder,
      icon: <Layers className="w-4 h-4" />,
    },
    {
      id: 'market',
      phase: 'Phase 4',
      label: t.navMarketTracker,
      icon: <Compass className="w-4 h-4" />,
    },
    {
      id: 'tokens',
      phase: 'Phase 1',
      label: t.navDesignTokens,
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
      {/* TOP MODULE SWITCHER BAR (P1 - P4) */}
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
                {tab.phase}
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
