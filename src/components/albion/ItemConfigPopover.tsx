'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlbionEnchantment,
  AlbionItem,
  AlbionQuality,
  AlbionTier,
  SpellSlotKey,
} from '@/types/albion';
import {
  ENCHANTMENT_METADATA,
  QUALITY_METADATA,
  TIER_HEX_MAP,
  calculateDynamicItemStats,
  getTierRoman,
  getTierTitle,
} from '@/services/ao-api';
import {
  HydratedAlbionItem,
  getAvailableTiersForBase,
  getHydratedVariant,
} from '@/services/albion-db';
import { AppLanguage, UI_TRANSLATIONS } from '@/i18n/translations';
import { ItemSlot } from './ItemSlot';
import { SpellSelector } from './SpellSelector';
import { Check, ExternalLink, Sparkles, X, Zap } from 'lucide-react';

export interface ItemConfigPopoverProps {
  item: AlbionItem;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (configuredItem: HydratedAlbionItem) => void;
  onInspect?: (configuredItem: HydratedAlbionItem) => void;
  initialTier?: AlbionTier;
  initialEnchantment?: AlbionEnchantment;
  initialQuality?: AlbionQuality;
  lang: AppLanguage;
  mode?: 'equip' | 'inspect' | 'both';
}

export const ItemConfigPopover: React.FC<ItemConfigPopoverProps> = ({
  item,
  isOpen,
  onClose,
  onConfirm,
  onInspect,
  initialTier,
  initialEnchantment = 0,
  initialQuality = 1,
  lang,
  mode = 'both',
}) => {
  const t = UI_TRANSLATIONS[lang];

  const availableTiers = useMemo(() => {
    return getAvailableTiersForBase(item.base_identifier);
  }, [item.base_identifier]);

  const defaultTier = useMemo(() => {
    if (initialTier && availableTiers.includes(initialTier)) return initialTier;
    if (availableTiers.includes(4)) return 4 as AlbionTier;
    return (availableTiers[0] || 4) as AlbionTier;
  }, [availableTiers, initialTier]);

  const [selectedTier, setSelectedTier] = useState<AlbionTier>(defaultTier);
  const [selectedEnchant, setSelectedEnchant] = useState<AlbionEnchantment>(
    initialEnchantment as AlbionEnchantment
  );
  const [selectedQuality, setSelectedQuality] = useState<AlbionQuality>(
    initialQuality as AlbionQuality
  );
  const [selectedSpells, setSelectedSpells] = useState<
    Record<SpellSlotKey, string>
  >(() => item.default_spells || {});

  // Touch drag state for Mobile Bottom Sheet (< 768px)
  const [startY, setStartY] = useState<number | null>(null);
  const [currentY, setCurrentY] = useState<number>(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Prevent background scroll on mobile
  useEffect(() => {
    const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;
    if (isOpen && isMobile()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setCurrentY(0);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // If item changed, sync default tier & spells
  useEffect(() => {
    setSelectedTier(defaultTier);
    setSelectedEnchant(initialEnchantment as AlbionEnchantment);
    setSelectedQuality(initialQuality as AlbionQuality);
    setSelectedSpells(item.default_spells || {});
  }, [item.id, defaultTier, initialEnchantment, initialQuality]);

  if (!isOpen) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) return;
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY === null || (typeof window !== 'undefined' && window.innerWidth >= 768)) return;
    const diff = e.touches[0].clientY - startY;
    if (diff > 0) {
      setCurrentY(diff);
    }
  };

  const handleTouchEnd = () => {
    if (currentY > 80) {
      onClose();
    }
    setStartY(null);
    setCurrentY(0);
  };

  const configuredItem = getHydratedVariant(
    item.base_identifier,
    selectedTier,
    selectedEnchant,
    selectedQuality
  );

  const configuredWithSpells: HydratedAlbionItem = {
    ...configuredItem,
    default_spells: {
      ...configuredItem.default_spells,
      ...selectedSpells,
    },
  };

  const dynamicStats = calculateDynamicItemStats(
    item,
    selectedTier,
    selectedEnchant,
    selectedQuality
  );

  const tierTitle = getTierTitle(selectedTier);
  const qualityMeta = QUALITY_METADATA[selectedQuality];
  const enchantMeta = ENCHANTMENT_METADATA[selectedEnchant];
  const tierHex = TIER_HEX_MAP[selectedTier];

  const enchantLevels: AlbionEnchantment[] = [0, 1, 2, 3, 4];
  const qualities: AlbionQuality[] = [1, 2, 3, 4, 5];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center p-0 md:p-4 bg-bg-primary/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        ref={sheetRef}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={
          currentY > 0
            ? {
                transform: `translateY(${currentY}px)`,
                transition: startY === null ? 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
              }
            : undefined
        }
        className="relative w-full md:max-w-2xl h-[82vh] md:h-auto max-h-[85vh] md:max-h-[90vh] rounded-t-2xl md:rounded-2xl bg-bg-surface border-t-2 md:border-2 border-border-gold/60 shadow-2xl md:shadow-rpg-gold overflow-hidden flex flex-col pb-safe"
      >
        {/* Mobile Drag Handle Bar */}
        <div className="md:hidden pt-2.5 pb-1 flex flex-col items-center cursor-grab active:cursor-grabbing border-b border-border-subtle/40 shrink-0">
          <div className="w-12 h-1.5 rounded-full bg-border-subtle hover:bg-border-gold/60 transition-colors" />
        </div>

        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-3.5 bg-gradient-to-r from-bg-elevated via-bg-secondary to-bg-elevated border-b border-border-gold/40 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent-primary animate-pulse" />
            <span className="font-display font-bold text-xs uppercase tracking-wider text-accent-primary">
              {lang === 'vi' ? 'Tùy Chỉnh Cấp Độ & Phẩm Chất' : 'Configure Tier & Quality'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={lang === 'vi' ? 'Đóng cửa sổ' : 'Close modal'}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-primary/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Preview Card */}
        <div className="p-4 sm:p-5 border-b border-border-subtle bg-bg-secondary/40 flex items-center gap-4">
          <div className="shrink-0 scale-110">
            <ItemSlot
              baseIdentifier={configuredItem.base_identifier}
              name={configuredItem.name_en}
              tier={selectedTier}
              defaultTier={configuredItem.tier}
              enchantment={selectedEnchant}
              quality={selectedQuality}
              handedness={configuredItem.handedness}
              size="lg"
            />
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className="px-2 py-0.5 text-xs font-mono font-bold rounded text-white shadow-sm"
                style={{ backgroundColor: tierHex }}
              >
                {getTierRoman(selectedTier)}.{selectedEnchant}
              </span>
              <span
                className="px-2 py-0.5 text-xs font-mono font-semibold rounded border"
                style={{
                  color: qualityMeta.hex,
                  borderColor: `${qualityMeta.hex}60`,
                  backgroundColor: `${qualityMeta.hex}15`,
                }}
              >
                {lang === 'vi' ? qualityMeta.name_vi : qualityMeta.name_en}
              </span>
              <span className="text-[11px] text-text-muted font-sans truncate">
                {lang === 'vi' ? tierTitle.vi : tierTitle.en}
              </span>
            </div>

            <h3 className="font-display font-bold text-base sm:text-lg text-text-primary truncate">
              {lang === 'vi' ? item.name_vi : item.name_en}
            </h3>

            <div className="flex flex-wrap items-center gap-3 pt-0.5 font-mono text-xs">
              <span className="flex items-center gap-1 text-accent-primary font-bold">
                <Zap className="w-3.5 h-3.5 fill-accent-primary/20" />
                {dynamicStats.totalIp} IP
              </span>
              {dynamicStats.scaledDps && (
                <span className="text-text-secondary">
                  DPS: <strong className="text-text-primary">{dynamicStats.scaledDps}</strong>
                </span>
              )}
              <span className="text-text-muted text-[11px]">
                {lang === 'vi' ? item.sub_category_vi : item.sub_category_en}
              </span>
            </div>
          </div>
        </div>

        {/* 3-Row Interactive Selectors */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
          {/* Row 1: Tier Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-display font-bold uppercase tracking-wider text-text-secondary">
                {lang === 'vi' ? '1. Chọn Cấp Bậc (Tier)' : '1. Select Tier'}
              </label>
              <span className="text-[11px] font-mono text-text-muted">
                {lang === 'vi' ? `Tier ${selectedTier} (${getTierRoman(selectedTier)})` : `Tier ${selectedTier}`}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {availableTiers.map((t) => {
                const isSelected = selectedTier === t;
                const hex = TIER_HEX_MAP[t];
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTier(t)}
                    className={[
                      'py-2 px-1 rounded-xl font-mono font-bold text-xs sm:text-sm flex flex-col items-center justify-center transition-all duration-150 border',
                      isSelected
                        ? 'ring-2 ring-accent-primary shadow-lg scale-102 border-transparent text-white'
                        : 'bg-bg-primary/80 border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-gold/50',
                    ].join(' ')}
                    style={{
                      backgroundColor: isSelected ? hex : undefined,
                    }}
                  >
                    <span>{getTierRoman(t)}</span>
                    <span className="text-[10px] opacity-80">T{t}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 2: Enchantment Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-display font-bold uppercase tracking-wider text-text-secondary">
                {lang === 'vi' ? '2. Phù Phép (Enchantment)' : '2. Enchantment'}
              </label>
              <span className="text-[11px] font-mono" style={{ color: enchantMeta.hex }}>
                {lang === 'vi' ? enchantMeta.name_vi : enchantMeta.name_en} (+{enchantMeta.ip_bonus} IP)
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {enchantLevels.map((ench) => {
                const isSelected = selectedEnchant === ench;
                const meta = ENCHANTMENT_METADATA[ench];
                return (
                  <button
                    key={ench}
                    type="button"
                    onClick={() => setSelectedEnchant(ench)}
                    className={[
                      'py-2 px-1 rounded-xl font-mono font-bold text-xs sm:text-sm flex flex-col items-center justify-center transition-all duration-150 border',
                      isSelected
                        ? 'border-transparent text-white ring-2 ring-accent-primary shadow-lg scale-102'
                        : 'bg-bg-primary/80 border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-gold/50',
                    ].join(' ')}
                    style={{
                      backgroundColor: isSelected ? meta.hex : undefined,
                      color: !isSelected && ench > 0 ? meta.hex : undefined,
                    }}
                  >
                    <span>.{ench}</span>
                    <span className="text-[10px] opacity-75">
                      {ench === 0 ? 'Base' : `+${ench * 100} IP`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 3: Quality Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-display font-bold uppercase tracking-wider text-text-secondary">
                {lang === 'vi' ? '3. Phẩm Chất (Quality)' : '3. Quality'}
              </label>
              <span className="text-[11px] font-mono" style={{ color: qualityMeta.hex }}>
                {lang === 'vi' ? qualityMeta.name_vi : qualityMeta.name_en} (+{qualityMeta.ip_bonus} IP)
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {qualities.map((q) => {
                const isSelected = selectedQuality === q;
                const qMeta = QUALITY_METADATA[q];
                return (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setSelectedQuality(q)}
                    className={[
                      'py-2 px-1 rounded-xl font-mono font-bold text-xs flex flex-col items-center justify-center transition-all duration-150 border',
                      isSelected
                        ? 'border-transparent text-bg-primary ring-2 ring-accent-primary shadow-lg scale-102'
                        : 'bg-bg-primary/80 border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-gold/50',
                    ].join(' ')}
                    style={{
                      backgroundColor: isSelected ? qMeta.hex : undefined,
                      color: !isSelected ? qMeta.hex : undefined,
                    }}
                  >
                    <span className="truncate w-full text-center px-1">
                      {lang === 'vi' ? qMeta.name_vi : qMeta.name_en}
                    </span>
                    <span className="text-[10px] opacity-75">
                      +{qMeta.ip_bonus} IP
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 4: Real-time Spell Selection & Tier-Gating */}
          {configuredItem.spells && (
            <div className="pt-3 border-t border-border-subtle/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-display font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-accent-primary" />
                  {lang === 'vi'
                    ? '4. Kỹ Năng Kế Thừa Theo Nhánh & Tuyệt Kỹ E'
                    : '4. Shared Weapon Line Spells & Signature E'}
                </label>
                <span className="text-[11px] font-mono text-text-muted">
                  {selectedTier < 6
                    ? (lang === 'vi' ? 'Tier < VI: Skill W cao cấp bị khóa mờ' : 'Tier < VI: Advanced W skills gated')
                    : (lang === 'vi' ? 'Tier VI+: Đã mở khóa toàn bộ kỹ năng' : 'Tier VI+: All skills unlocked')}
                </span>
              </div>

              <SpellSelector
                item={configuredWithSpells}
                selectedSpells={selectedSpells}
                onChangeSpell={(slot, spellId) =>
                  setSelectedSpells((prev) => ({ ...prev, [slot]: spellId }))
                }
                lang={lang}
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-4 sm:px-5 py-3 sm:py-3.5 bg-bg-elevated border-t border-border-subtle flex items-center justify-between gap-2 shrink-0">
          <div className="font-mono text-[11px] sm:text-xs text-text-secondary">
            <span className="hidden xs:inline">{lang === 'vi' ? 'Tổng:' : 'Total:'}{' '}</span>
            <strong className="text-accent-primary font-bold font-mono">
              {dynamicStats.totalIp.toLocaleString('en-US')} IP
            </strong>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-bg-primary/60 transition-colors"
            >
              {lang === 'vi' ? 'Hủy' : 'Cancel'}
            </button>

            {mode !== 'equip' && onInspect && (
              <button
                type="button"
                onClick={() => {
                  onInspect(configuredWithSpells);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-bg-secondary hover:bg-bg-elevated border border-border-gold/50 text-accent-primary flex items-center gap-1.5 transition-all shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {lang === 'vi' ? 'Xem Chi Tiết' : 'Inspect'}
              </button>
            )}

            {mode !== 'inspect' && onConfirm && (
              <button
                type="button"
                onClick={() => {
                  onConfirm(configuredWithSpells);
                  onClose();
                }}
                className="px-5 py-2 rounded-xl text-xs font-display font-bold uppercase tracking-wider bg-accent-primary hover:bg-accent-light text-bg-primary flex items-center gap-1.5 transition-all shadow-rpg-gold"
              >
                <Check className="w-4 h-4" />
                {lang === 'vi' ? 'Trang Bị Vào Ô' : 'Equip Item'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
