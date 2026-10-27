'use client';

import React, { useEffect, useState } from 'react';
import {
  AlbionEnchantment,
  AlbionItem,
  AlbionQuality,
  AlbionSpell,
  AlbionTier,
  SpellSlotKey,
} from '@/types/albion';
import {
  ENCHANTMENT_METADATA,
  QUALITY_METADATA,
  TIER_HEX_MAP,
  ZONE_METADATA,
  buildUniqueName,
  calculateDynamicItemStats,
  getSpellRenderUrl,
  getTierRoman,
  getTierTitle,
} from '@/services/ao-api';
import { AppLanguage, UI_TRANSLATIONS } from '@/i18n/translations';
import { ItemSlot } from './ItemSlot';
import {
  Clock,
  Coins,
  Crosshair,
  Flame,
  Layers,
  MapPin,
  Shield,
  Sparkles,
  Swords,
  Weight,
  Zap,
} from 'lucide-react';

export interface ItemTooltipProps {
  item: AlbionItem;
  tier?: AlbionTier;
  enchantment?: AlbionEnchantment;
  quality?: AlbionQuality;
  compact?: boolean;
  lang: AppLanguage;
}

export const ItemTooltip: React.FC<ItemTooltipProps> = ({
  item,
  tier: overrideTier,
  enchantment: overrideEnchant,
  quality: overrideQuality,
  compact = false,
  lang,
}) => {
  const t = UI_TRANSLATIONS[lang];
  const activeTier = overrideTier ?? item.tier;
  const activeEnchant = overrideEnchant ?? item.enchantment;
  const activeQuality = overrideQuality ?? item.quality;

  const [selectedSpells, setSelectedSpells] = useState<
    Record<SpellSlotKey, string>
  >(item.default_spells);

  // Pick initial active spell tab (first slot that has spells, preferring E)
  const getInitialSpellTab = (targetItem: AlbionItem): SpellSlotKey => {
    if (targetItem.spells.E.length > 0) return 'E';
    if (targetItem.spells.PASSIVE.length > 0) return 'PASSIVE';
    if (targetItem.spells.Q.length > 0) return 'Q';
    return 'W';
  };

  const [activeSpellTab, setActiveSpellTab] = useState<SpellSlotKey>(() =>
    getInitialSpellTab(item)
  );

  useEffect(() => {
    setSelectedSpells(item.default_spells);
    setActiveSpellTab(getInitialSpellTab(item));
  }, [item]);

  const uniqueName = buildUniqueName(
    item.base_identifier,
    activeTier,
    activeEnchant
  );
  const tierTitle = getTierTitle(activeTier);
  const qualityMeta = QUALITY_METADATA[activeQuality];
  const enchantMeta = ENCHANTMENT_METADATA[activeEnchant];
  const tierHex = TIER_HEX_MAP[activeTier];

  const dynamicStats = calculateDynamicItemStats(
    item,
    activeTier,
    activeEnchant,
    activeQuality
  );

  const spellSlotsConfig: {
    key: SpellSlotKey;
    label: string;
    badge: string;
  }[] = [
    { key: 'Q', label: t.slotQ, badge: 'Q' },
    { key: 'W', label: t.slotW, badge: 'W' },
    { key: 'E', label: t.slotE, badge: 'E' },
    { key: 'PASSIVE', label: t.slotPassive, badge: 'P' },
  ];

  // Get currently focused spell details for the inspector box
  const spellsForActiveTab = item.spells[activeSpellTab] || [];
  const activeSpellId = selectedSpells[activeSpellTab];
  const focusedSpell: AlbionSpell | undefined =
    spellsForActiveTab.find((s) => s.id === activeSpellId) ||
    spellsForActiveTab[0];

  const primaryName = lang === 'vi' ? item.name_vi : item.name_en;
  const secondaryName = lang === 'vi' ? item.name_en : item.name_vi;
  const subCategoryText =
    lang === 'vi' ? item.sub_category_vi : item.sub_category_en;
  const loreText = lang === 'vi' ? item.lore_vi : item.lore_en;
  const qualityName =
    lang === 'vi' ? qualityMeta.name_vi : qualityMeta.name_en;
  const tierPrefix = lang === 'vi' ? tierTitle.vi : tierTitle.en;

  const handednessBadgeLabel =
    item.handedness === '2H'
      ? t.twoHandedBadge
      : item.handedness === '1H'
        ? t.oneHandedBadge
        : item.handedness === 'OFFHAND'
          ? t.offHandBadge
          : t.mountBadge;

  return (
    <div
      className="relative w-full rounded-xl bg-bg-elevated border border-border-subtle shadow-2xl overflow-hidden text-text-primary transition-all"
      style={{
        boxShadow:
          activeEnchant > 0
            ? `0 20px 50px rgba(0,0,0,0.85), 0 0 24px ${enchantMeta.hex}22`
            : '0 20px 50px rgba(0,0,0,0.85)',
      }}
    >
      {/* Top Tier & Enchantment Accent Bar */}
      <div
        className="h-1.5 w-full"
        style={{
          background:
            activeEnchant > 0
              ? `linear-gradient(90deg, ${tierHex} 0%, ${enchantMeta.hex} 50%, ${qualityMeta.hex} 100%)`
              : `linear-gradient(90deg, ${tierHex} 0%, ${qualityMeta.hex} 100%)`,
        }}
      />

      {/* HEADER: Item Icon + Name + Tier/Quality/Handedness Badges */}
      <div className="p-4 sm:p-5 bg-gradient-to-b from-bg-secondary/90 to-bg-elevated border-b border-border-subtle">
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            <ItemSlot
              baseIdentifier={item.base_identifier}
              name={item.name_en}
              tier={activeTier}
              defaultTier={item.tier}
              enchantment={activeEnchant}
              quality={activeQuality}
              handedness={item.handedness}
              size="lg"
              showHandednessBadge
              selected
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              <span
                className="px-2 py-0.5 text-[11px] font-mono font-bold uppercase rounded border"
                style={{
                  backgroundColor: `${tierHex}25`,
                  borderColor: `${tierHex}80`,
                  color: activeTier === 8 ? '#EBEBEB' : '#F3F4F6',
                }}
              >
                Tier {getTierRoman(activeTier)}.{activeEnchant} ({tierPrefix})
              </span>

              <span
                className="px-2 py-0.5 text-[11px] font-sans font-semibold rounded border bg-bg-primary/70"
                style={{
                  borderColor: `${qualityMeta.hex}88`,
                  color: qualityMeta.hex,
                }}
              >
                ★ {qualityName}
              </span>

              <span
                className={[
                  'px-2 py-0.5 text-[11px] font-mono font-semibold rounded border',
                  item.handedness === '2H'
                    ? 'bg-accent-crimson/15 text-red-300 border-accent-crimson/50'
                    : item.handedness === '1H'
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                      : 'bg-sky-500/15 text-sky-300 border-sky-500/40',
                ].join(' ')}
              >
                {handednessBadgeLabel}
              </span>

              {item.is_artifact && item.artifact_type && (
                <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-border-gold/15 text-accent-primary border border-border-gold/40">
                  ✦ {item.artifact_type} {t.artifactBadgeSuffix}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-baseline gap-2">
              <h3 className="font-display text-lg sm:text-xl font-bold text-text-primary tracking-wide leading-snug">
                {primaryName}
              </h3>
              {primaryName !== secondaryName && (
                <span className="text-xs sm:text-sm font-sans text-text-secondary">
                  ({secondaryName})
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-text-secondary">
              <span>{subCategoryText}</span>
              <span className="text-text-muted">•</span>
              <code className="font-mono text-[11px] text-text-muted bg-bg-primary/80 px-1.5 py-0.5 rounded border border-border-subtle">
                {uniqueName}
              </code>
            </div>
          </div>

          {/* ITEM POWER (IP) CALLOUT BOX */}
          <div className="hidden sm:flex flex-col items-end justify-center shrink-0 bg-bg-primary/85 border border-border-gold/40 rounded-lg px-3.5 py-2 shadow-rpg-gold">
            <span className="text-[10px] font-sans uppercase tracking-wider text-text-secondary">
              {t.itemPowerLabel}
            </span>
            <span className="font-mono text-2xl font-extrabold text-accent-primary leading-tight">
              {dynamicStats.totalIp}
            </span>
            <span className="font-mono text-[10px] text-text-muted">
              {dynamicStats.baseIpForTier}
              {dynamicStats.enchantBonus > 0
                ? ` +${dynamicStats.enchantBonus}`
                : ''}
              {dynamicStats.qualityBonus > 0
                ? ` +${dynamicStats.qualityBonus}`
                : ''}{' '}
              IP
            </span>
          </div>
        </div>

        {/* Mobile IP bar */}
        <div className="mt-3 flex sm:hidden items-center justify-between bg-bg-primary/80 border border-border-gold/40 rounded-lg px-3 py-2">
          <span className="text-xs font-sans uppercase tracking-wider text-text-secondary">
            {t.itemPowerLabel}
          </span>
          <div className="text-right">
            <span className="font-mono text-lg font-extrabold text-accent-primary">
              {dynamicStats.totalIp} IP
            </span>
            <span className="ml-2 font-mono text-[11px] text-text-muted">
              ({dynamicStats.baseIpForTier} + {dynamicStats.enchantBonus} +{' '}
              {dynamicStats.qualityBonus})
            </span>
          </div>
        </div>

        {/* Tactical Summary / Lore */}
        {!compact && (
          <p className="mt-3 text-xs sm:text-sm text-text-secondary leading-relaxed bg-bg-primary/45 p-2.5 rounded-lg border border-border-subtle/70">
            {loreText}
          </p>
        )}
      </div>

      {/* CORE COMBAT STATS GRID (Strict JetBrains Mono for numbers) */}
      <div className="p-4 sm:p-5 border-b border-border-subtle bg-bg-elevated/60">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <h4 className="text-xs font-display uppercase tracking-wider text-accent-primary flex items-center gap-1.5">
            <Swords className="w-3.5 h-3.5" />
            {t.combatAndMarketMetricsTitle}
          </h4>
          <span className="text-[11px] font-mono text-text-muted">
            {t.autoCalculatedFor} T{activeTier}.{activeEnchant} • {qualityName}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {dynamicStats.scaledDps !== undefined && (
            <div className="bg-bg-primary/70 border border-border-subtle rounded-lg p-2.5">
              <div className="flex items-center gap-1.5 text-[11px] text-text-secondary">
                <Flame className="w-3.5 h-3.5 text-accent-crimson" />
                <span>{t.dpsLabel}</span>
              </div>
              <div className="mt-1 font-mono text-base font-bold text-text-primary">
                {dynamicStats.scaledDps}{' '}
                <span className="text-xs font-normal text-text-muted">DPS</span>
              </div>
              <div className="font-mono text-[10px] text-text-muted">
                {t.autoAttackPrefix} {dynamicStats.scaledAutoAttack} dmg
              </div>
            </div>
          )}

          <div className="bg-bg-primary/70 border border-border-subtle rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 text-[11px] text-text-secondary">
              <Crosshair className="w-3.5 h-3.5 text-sky-400" />
              <span>{t.rangeAndSpeedLabel}</span>
            </div>
            <div className="mt-1 font-mono text-sm sm:text-base font-bold text-text-primary truncate">
              {lang === 'vi'
                ? item.stats.attack_range_vi
                : item.stats.attack_range_en}
            </div>
            {item.stats.attack_speed !== undefined && (
              <div className="font-mono text-[10px] text-text-muted">
                {item.stats.attack_speed.toFixed(2)} {t.attacksPerSecUnit}
              </div>
            )}
          </div>

          <div className="bg-bg-primary/70 border border-border-subtle rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 text-[11px] text-text-secondary">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.penetrationAndBonusLabel}</span>
            </div>
            <div className="mt-1 font-mono text-base font-bold text-emerald-300">
              {item.stats.resilience_penetration ??
                item.stats.bonus_defense_vs_players ??
                '0%'}
            </div>
            <div className="font-mono text-[10px] text-text-muted truncate">
              {t.bonusPrefix}{' '}
              {(lang === 'vi'
                ? item.stats.ability_bonus_vi
                : item.stats.ability_bonus_en) ?? t.standardEquipmentBonus}
            </div>
          </div>

          <div className="bg-bg-primary/70 border border-border-subtle rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 text-[11px] text-text-secondary">
              <Coins className="w-3.5 h-3.5 text-accent-primary" />
              <span>{t.estimatedMarketPriceLabel}</span>
            </div>
            <div className="mt-1 font-mono text-base font-bold text-accent-primary">
              {dynamicStats.estimatedSilver.toLocaleString('en-US')}{' '}
              <span className="text-[11px] font-normal text-text-secondary">
                {t.silverUnit}
              </span>
            </div>
            <div className="font-mono text-[10px] text-text-muted flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 text-accent-primary" />
              {item.best_city}
            </div>
          </div>
        </div>

        {/* Secondary stats bar */}
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 rounded bg-bg-secondary/80 border border-border-subtle/60 text-[11px] text-text-secondary">
          <div className="flex items-center gap-4">
            {item.stats.max_energy && (
              <span className="flex items-center gap-1 font-mono">
                <Zap className="w-3 h-3 text-sky-400" />
                {t.maxEnergyLabel}{' '}
                <strong className="text-text-primary">
                  {item.stats.max_energy}
                </strong>{' '}
                (+{item.stats.energy_regen}/s)
              </span>
            )}
            <span className="flex items-center gap-1 font-mono">
              <Weight className="w-3 h-3 text-text-muted" />
              {t.weightLabel}{' '}
              <strong className="text-text-primary">{item.stats.weight}</strong>
            </span>
          </div>

          {/* Zone Safety Tags */}
          <div className="flex flex-wrap items-center gap-1.5">
            {item.recommended_zones.map((zoneKey) => {
              const z = ZONE_METADATA[zoneKey];
              return (
                <span
                  key={zoneKey}
                  className={`px-2 py-0.5 text-[10px] font-medium rounded border ${z.badgeClass}`}
                >
                  {lang === 'vi' ? z.label_vi : z.label_en}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* SPELL SELECTOR & ABILITY INSPECTOR (Q / W / E / PASSIVE) */}
      <div className="p-4 sm:p-5 bg-bg-secondary/40">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h4 className="text-xs font-display uppercase tracking-wider text-accent-primary flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {t.weaponSkillsTitle}
          </h4>
          <span className="text-[11px] text-text-secondary">
            {t.weaponSkillsHint}
          </span>
        </div>

        {/* Horizontal row of Q / W / E / Passive slot groups */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          {spellSlotsConfig.map(({ key, label, badge }) => {
            const slotSpells = item.spells[key] || [];
            if (slotSpells.length === 0) return null;

            const currentSelectedId = selectedSpells[key] || slotSpells[0]?.id;
            const isTabFocused = activeSpellTab === key;

            return (
              <div
                key={key}
                onClick={() => setActiveSpellTab(key)}
                className={[
                  'p-2.5 rounded-lg border transition-all cursor-pointer',
                  isTabFocused
                    ? 'bg-bg-elevated border-border-gold/80 shadow-rpg-gold'
                    : 'bg-bg-primary/60 border-border-subtle hover:border-border-gold/40',
                ].join(' ')}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-text-secondary">
                    {label}
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded bg-border-gold/20 text-accent-primary border border-border-gold/40">
                    {badge}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {slotSpells.map((spell) => {
                    const isSelected = spell.id === currentSelectedId;
                    return (
                      <SpellCircleButton
                        key={spell.id}
                        spell={spell}
                        lang={lang}
                        selected={isSelected}
                        onSelect={() => {
                          setSelectedSpells((prev) => ({
                            ...prev,
                            [key]: spell.id,
                          }));
                          setActiveSpellTab(key);
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Focused Spell Detail Card */}
        {focusedSpell && (
          <div className="rounded-lg bg-bg-primary/90 border border-border-gold/40 p-3.5 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-border-subtle">
              <div className="flex items-center gap-3">
                <SpellCircleButton
                  spell={focusedSpell}
                  lang={lang}
                  selected
                  onSelect={() => {}}
                  size="lg"
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-accent-primary text-bg-primary">
                      {focusedSpell.slot}
                    </span>
                    <h5 className="font-display font-bold text-sm sm:text-base text-text-primary">
                      {lang === 'vi'
                        ? focusedSpell.name_vi
                        : focusedSpell.name_en}
                    </h5>
                    <span className="text-xs text-text-secondary font-sans">
                      (
                      {lang === 'vi'
                        ? focusedSpell.name_en
                        : focusedSpell.name_vi}
                      )
                    </span>
                  </div>
                  <p className="text-xs text-text-muted font-mono mt-0.5">
                    {t.spellIdLabel} {focusedSpell.name_en}
                  </p>
                </div>
              </div>

              {/* Monospace Spell Metrics (Cooldown, Energy, Cast Time, Range) */}
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <span className="flex items-center gap-1 px-2 py-1 rounded bg-bg-elevated border border-border-subtle text-sky-300">
                  <Clock className="w-3 h-3" />
                  {t.cooldownLabel}: <strong>{focusedSpell.cooldown}s</strong>
                </span>
                <span className="flex items-center gap-1 px-2 py-1 rounded bg-bg-elevated border border-border-subtle text-blue-300">
                  <Zap className="w-3 h-3" />
                  {t.energyCostLabel}:{' '}
                  <strong>{focusedSpell.energy_cost}</strong>
                </span>
                <span className="flex items-center gap-1 px-2 py-1 rounded bg-bg-elevated border border-border-subtle text-amber-300">
                  <Layers className="w-3 h-3" />
                  {t.castTimeLabel}:{' '}
                  <strong>
                    {lang === 'vi'
                      ? focusedSpell.cast_time_vi
                      : focusedSpell.cast_time_en}
                  </strong>
                </span>
                <span className="flex items-center gap-1 px-2 py-1 rounded bg-bg-elevated border border-border-subtle text-emerald-300">
                  <Crosshair className="w-3 h-3" />
                  {t.rangeLabel}:{' '}
                  <strong>
                    {lang === 'vi'
                      ? focusedSpell.range_vi
                      : focusedSpell.range_en}
                  </strong>
                </span>
              </div>
            </div>

            <div className="mt-2.5 space-y-1">
              <p className="text-xs sm:text-sm text-text-primary leading-relaxed font-sans">
                {lang === 'vi'
                  ? focusedSpell.description_vi
                  : focusedSpell.description_en}
              </p>
              <p className="text-xs text-text-muted italic font-sans">
                {lang === 'vi' ? 'EN:' : 'VI:'} &ldquo;
                {lang === 'vi'
                  ? focusedSpell.description_en
                  : focusedSpell.description_vi}
                &rdquo;
              </p>
            </div>
          </div>
        )}

        {/* Complete Active Skill Loadout Overview (Q / W / E / Passive all visible at once) */}
        <div className="mt-3 space-y-2">
          <div className="text-[11px] font-display font-semibold uppercase tracking-wider text-text-secondary">
            {lang === 'vi'
              ? 'Tổng hợp toàn bộ kỹ năng đang chọn trên trang bị:'
              : 'All Active Selected Equipment Skills:'}
          </div>
          <div className="grid grid-cols-1 gap-2">
            {spellSlotsConfig.map(({ key, badge }) => {
              const slotSpells = item.spells[key] || [];
              if (slotSpells.length === 0) return null;
              const chosen =
                slotSpells.find((s) => s.id === selectedSpells[key]) ||
                slotSpells[0];
              if (!chosen) return null;

              return (
                <div
                  key={key}
                  onClick={() => setActiveSpellTab(key)}
                  className={[
                    'p-2.5 rounded-lg border transition-all cursor-pointer flex items-start gap-2.5',
                    activeSpellTab === key
                      ? 'bg-bg-elevated border-border-gold/60'
                      : 'bg-bg-primary/60 border-border-subtle hover:border-border-gold/40',
                  ].join(' ')}
                >
                  <SpellCircleButton
                    spell={chosen}
                    lang={lang}
                    selected={activeSpellTab === key}
                    onSelect={() => setActiveSpellTab(key)}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-border-gold/20 text-accent-primary border border-border-gold/40">
                          {badge}
                        </span>
                        <span className="font-display font-bold text-xs sm:text-sm text-text-primary">
                          {lang === 'vi' ? chosen.name_vi : chosen.name_en}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-text-muted">
                        CD: {chosen.cooldown}s • Mana: {chosen.energy_cost} •{' '}
                        {lang === 'vi' ? chosen.range_vi : chosen.range_en}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-text-secondary leading-relaxed">
                      {lang === 'vi'
                        ? chosen.description_vi
                        : chosen.description_en}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

interface SpellCircleButtonProps {
  spell: AlbionSpell;
  lang: AppLanguage;
  selected: boolean;
  onSelect: () => void;
  size?: 'md' | 'lg';
}

const SpellCircleButton: React.FC<SpellCircleButtonProps> = ({
  spell,
  lang,
  selected,
  onSelect,
  size = 'md',
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [spell.spell_icon]);

  const spellUrl = getSpellRenderUrl(spell.spell_icon, 64);
  const label = lang === 'vi' ? spell.name_vi : spell.name_en;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      title={`${label} (${spell.cooldown}s)`}
      className={[
        'relative rounded-full flex items-center justify-center overflow-hidden transition-all duration-150 shrink-0',
        size === 'lg' ? 'w-11 h-11' : 'w-9 h-9',
        selected
          ? 'border-2 border-border-gold ring-2 ring-accent-primary/40 scale-105 shadow-rpg-gold bg-bg-elevated'
          : 'border border-border-gold/40 opacity-75 hover:opacity-100 hover:border-border-gold bg-bg-primary',
      ].join(' ')}
    >
      {!imgFailed ? (
        <img
          src={spellUrl}
          alt={spell.name_en}
          loading="lazy"
          onError={() => setImgFailed(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="font-display font-bold text-xs text-accent-primary">
          {spell.slot === 'PASSIVE' ? 'P' : spell.slot}
        </span>
      )}
    </button>
  );
};
