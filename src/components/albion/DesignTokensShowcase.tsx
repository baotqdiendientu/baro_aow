'use client';

import React from 'react';
import {
  AlbionEnchantment,
  AlbionQuality,
  AlbionTier,
  AlbionZoneType,
} from '@/types/albion';
import {
  ENCHANTMENT_METADATA,
  QUALITY_METADATA,
  TIER_HEX_MAP,
  ZONE_METADATA,
  getTierRoman,
  getTierTitle,
} from '@/services/ao-api';
import { AppLanguage, UI_TRANSLATIONS } from '@/i18n/translations';
import { ItemSlot } from './ItemSlot';

const BASE_UI_TOKENS = [
  {
    name: 'bg-primary',
    hex: '#0B0E14',
    role_vi: 'Nền chính sâu thẳm (Main Viewport)',
    role_en: 'Deep primary viewport background',
  },
  {
    name: 'bg-secondary',
    hex: '#131822',
    role_vi: 'Nền Sidebar, Header, Card mặc định',
    role_en: 'Sidebar, Header & default Card surface',
  },
  {
    name: 'bg-elevated',
    hex: '#1C2433',
    role_vi: 'Nền Tooltip, Modal, Dropdown, Hover',
    role_en: 'Tooltip, Modal, Dropdown & Hover surface',
  },
  {
    name: 'border-subtle',
    hex: '#263042',
    role_vi: 'Viền chia tách các khu vực dữ liệu',
    role_en: 'Subtle divider & card border',
  },
  {
    name: 'border-gold',
    hex: '#C59B27',
    role_vi: 'Viền Active / Highlight mang chất RPG',
    role_en: 'Active RPG metallic gold border',
  },
  {
    name: 'text-primary',
    hex: '#F3F4F6',
    role_vi: 'Chữ chính (Trắng xám dịu mắt)',
    role_en: 'Eye-friendly primary off-white text',
  },
  {
    name: 'text-secondary',
    hex: '#9CA3AF',
    role_vi: 'Chữ phụ, mô tả kỹ năng',
    role_en: 'Secondary text & ability descriptions',
  },
  {
    name: 'text-muted',
    hex: '#6B7280',
    role_vi: 'Chú thích, mã định danh vật phẩm',
    role_en: 'Muted captions & item identifiers',
  },
  {
    name: 'accent-primary',
    hex: '#E5A93C',
    role_vi: 'Vàng Albion (Nút hành động chính, Tab)',
    role_en: 'Albion Gold (Primary CTA & Active Tab)',
  },
  {
    name: 'accent-crimson',
    hex: '#C83E31',
    role_vi: 'Đỏ Albion (Cảnh báo, Vùng PvP Rơi Đồ)',
    role_en: 'Albion Crimson (Alerts & Lethal PvP)',
  },
];

interface DesignTokensShowcaseProps {
  lang: AppLanguage;
  onBackToArmory: () => void;
}

export const DesignTokensShowcase: React.FC<DesignTokensShowcaseProps> = ({
  lang,
  onBackToArmory,
}) => {
  const t = UI_TRANSLATIONS[lang];

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="p-5 rounded-xl bg-bg-secondary border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2 py-0.5 text-[10px] font-mono uppercase rounded bg-accent-primary/20 text-accent-primary border border-border-gold/40">
            {t.tokensHeaderBadge}
          </span>
          <h2 className="mt-2 font-display text-xl sm:text-2xl font-bold text-text-primary">
            {t.tokensHeaderTitle}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-text-secondary">
            {t.tokensHeaderDesc}
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToArmory}
          className="px-3.5 py-2 rounded-lg bg-bg-primary hover:bg-bg-elevated text-xs font-medium text-accent-primary border border-border-gold/50 transition-all shrink-0"
        >
          {t.tokensBackToDemo}
        </button>
      </div>

      {/* 1. Tier Colors (T1 - T8) */}
      <section className="p-5 rounded-xl bg-bg-secondary border border-border-subtle space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-accent-primary">
            {t.tokensSectionTier}
          </h3>
          <span className="text-xs font-mono text-text-muted">
            tier-1 → tier-8
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {([1, 2, 3, 4, 5, 6, 7, 8] as AlbionTier[]).map((tierNum) => {
            const hex = TIER_HEX_MAP[tierNum];
            const title = getTierTitle(tierNum);
            return (
              <div
                key={tierNum}
                className="p-3 rounded-lg bg-bg-primary border border-border-subtle flex flex-col items-center text-center gap-2"
              >
                <div
                  className="w-12 h-12 rounded-md border border-white/20 flex items-center justify-center font-display font-bold text-sm shadow-inner"
                  style={{
                    backgroundColor: hex,
                    color: tierNum === 8 ? '#0B0E14' : '#FFFFFF',
                  }}
                >
                  {getTierRoman(tierNum)}
                </div>
                <div>
                  <div className="font-display font-bold text-xs text-text-primary">
                    Tier {tierNum} ({getTierRoman(tierNum)})
                  </div>
                  <div className="text-[11px] text-text-secondary">
                    {lang === 'vi' ? title.vi : title.en}
                  </div>
                  <code className="mt-1 inline-block font-mono text-[10px] text-accent-primary bg-bg-elevated px-1.5 py-0.5 rounded">
                    {hex}
                  </code>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Enchantment (.0 - .4) & Quality (1 - 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enchantment Glows */}
        <section className="p-5 rounded-xl bg-bg-secondary border border-border-subtle space-y-4">
          <h3 className="font-display text-base font-bold text-accent-primary">
            {t.tokensSectionEnchant}
          </h3>
          <div className="space-y-2.5">
            {([0, 1, 2, 3, 4] as AlbionEnchantment[]).map((enc) => {
              const meta = ENCHANTMENT_METADATA[enc];
              return (
                <div
                  key={enc}
                  className="p-3 rounded-lg bg-bg-primary border border-border-subtle flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <ItemSlot
                      baseIdentifier="MAIN_1HCROSSBOW"
                      name="Light Crossbow"
                      tier={6}
                      enchantment={enc}
                      quality={3}
                      size="sm"
                    />
                    <div>
                      <div className="font-sans font-semibold text-xs sm:text-sm text-text-primary">
                        {lang === 'vi' ? meta.name_vi : meta.name_en}
                      </div>
                      <div className="text-[11px] text-text-secondary font-mono">
                        +{meta.ip_bonus} Item Power
                      </div>
                    </div>
                  </div>
                  <code className="font-mono text-xs px-2 py-1 rounded bg-bg-elevated border border-border-subtle text-text-primary">
                    {meta.hex}
                  </code>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quality Borders */}
        <section className="p-5 rounded-xl bg-bg-secondary border border-border-subtle space-y-4">
          <h3 className="font-display text-base font-bold text-accent-primary">
            {t.tokensSectionQuality}
          </h3>
          <div className="space-y-2.5">
            {([1, 2, 3, 4, 5] as AlbionQuality[]).map((q) => {
              const meta = QUALITY_METADATA[q];
              return (
                <div
                  key={q}
                  className="p-3 rounded-lg bg-bg-primary border border-border-subtle flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <ItemSlot
                      baseIdentifier="MAIN_NATURESTAFF_KEEPER"
                      name="Druidic Staff"
                      tier={5}
                      defaultTier={5}
                      enchantment={0}
                      quality={q}
                      size="sm"
                    />
                    <div>
                      <div
                        className="font-sans font-semibold text-xs sm:text-sm"
                        style={{ color: meta.hex }}
                      >
                        {q}. {lang === 'vi' ? meta.name_vi : meta.name_en}
                      </div>
                      <div className="text-[11px] text-text-secondary font-mono">
                        +{meta.ip_bonus} Item Power
                      </div>
                    </div>
                  </div>
                  <code className="font-mono text-xs px-2 py-1 rounded bg-bg-elevated border border-border-subtle text-text-primary">
                    {meta.hex}
                  </code>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* 3. Base UI Tokens & Zone Safety Badges */}
      <section className="p-5 rounded-xl bg-bg-secondary border border-border-subtle space-y-4">
        <h3 className="font-display text-base font-bold text-accent-primary">
          {t.tokensSectionBaseAndZone}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {BASE_UI_TOKENS.map((token) => (
            <div
              key={token.name}
              className="p-3 rounded-lg bg-bg-primary border border-border-subtle space-y-2"
            >
              <div
                className="h-8 w-full rounded border border-white/15"
                style={{ backgroundColor: token.hex }}
              />
              <div className="font-mono text-xs font-bold text-text-primary">
                {token.name}
              </div>
              <div className="font-mono text-[11px] text-accent-primary">
                {token.hex}
              </div>
              <div className="text-[11px] text-text-secondary leading-snug">
                {lang === 'vi' ? token.role_vi : token.role_en}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-border-subtle flex flex-wrap items-center gap-3">
          <span className="text-xs font-mono text-text-secondary">
            {t.zoneSafetyTagsLabel}
          </span>
          {(['SAFE', 'YELLOW', 'LETHAL', 'AVALON'] as AlbionZoneType[]).map(
            (zKey) => {
              const z = ZONE_METADATA[zKey];
              return (
                <span
                  key={zKey}
                  className={`px-3 py-1 text-xs font-medium rounded-md border ${z.badgeClass}`}
                >
                  {lang === 'vi' ? z.label_vi : z.label_en} ({z.hex})
                </span>
              );
            }
          )}
        </div>
      </section>
    </div>
  );
};
