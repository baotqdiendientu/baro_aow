'use client';

import React, { useState } from 'react';
import { AlbionItem, AlbionSpell, SpellSlotKey } from '@/types/albion';
import { getSpellRenderUrl } from '@/services/ao-api';
import { AppLanguage, UI_TRANSLATIONS } from '@/i18n/translations';
import { Clock, Crosshair, Layers, Lock, Sparkles, Zap } from 'lucide-react';

export interface SpellSelectorProps {
  item: AlbionItem;
  selectedSpells: Record<SpellSlotKey, string>;
  onChangeSpell: (slot: SpellSlotKey, spellId: string) => void;
  lang: AppLanguage;
}

export const SpellSelector: React.FC<SpellSelectorProps> = ({
  item,
  selectedSpells,
  onChangeSpell,
  lang,
}) => {
  const t = UI_TRANSLATIONS[lang];
  const [focusedSlot, setFocusedSlot] = useState<SpellSlotKey>('E');

  const slotGroups: { key: SpellSlotKey; label: string; badge: string }[] = [
    { key: 'Q', label: t.slotQ, badge: 'Q' },
    { key: 'W', label: t.slotW, badge: 'W' },
    { key: 'E', label: t.slotE, badge: 'E' },
    { key: 'PASSIVE', label: t.slotPassive, badge: 'P' },
  ];

  const availableGroups = slotGroups.filter(
    (g) => (item.spells[g.key] || []).length > 0
  );

  if (availableGroups.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-bg-secondary border border-border-subtle text-xs text-text-secondary">
        {lang === 'vi'
          ? 'Trang bị này cung cấp chỉ số cộng thẳng tự động, không có ô kỹ năng kích hoạt cần chọn.'
          : 'This equipment provides passive stat bonuses automatically with no selectable active spell slots.'}
      </div>
    );
  }

  const activeGroupKey = availableGroups.some((g) => g.key === focusedSlot)
    ? focusedSlot
    : availableGroups[0].key;

  const activeSpellId =
    selectedSpells[activeGroupKey] || item.spells[activeGroupKey]?.[0]?.id;
  const focusedSpell: AlbionSpell | undefined =
    item.spells[activeGroupKey]?.find((s) => s.id === activeSpellId) ||
    item.spells[activeGroupKey]?.[0];

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-bg-elevated border border-border-gold/50 shadow-rpg-gold space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent-primary" />
          <h4 className="font-display font-bold text-xs sm:text-sm uppercase tracking-wider text-accent-primary">
            {lang === 'vi'
              ? `Bộ Kỹ Năng: ${item.name_vi}`
              : `Spell Selector: ${item.name_en}`}
          </h4>
        </div>
        <span className="text-[11px] text-text-secondary">
          {t.weaponSkillsHint}
        </span>
      </div>

      {/* Horizontal Brass-Rimmed Spell Row (Scrollable with snap on mobile) */}
      <div className="flex overflow-x-auto snap-x pb-2 gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible scrollbar-none">
        {availableGroups.map(({ key, label, badge }) => {
          const spells = item.spells[key] || [];
          const currentId = selectedSpells[key] || spells[0]?.id;
          const isGroupFocused = activeGroupKey === key;

          return (
            <div
              key={key}
              onClick={() => setFocusedSlot(key)}
              className={[
                'snap-start min-w-[200px] sm:min-w-0 flex-1 p-2.5 rounded-lg border transition-all cursor-pointer',
                isGroupFocused
                  ? 'bg-bg-secondary border-border-gold shadow-rpg-gold'
                  : 'bg-bg-primary/70 border-border-subtle hover:border-border-gold/40',
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
                {spells.map((sp) => {
                  const isChosen = sp.id === currentId;
                  return (
                    <BrassSpellOrb
                      key={sp.id}
                      spell={sp}
                      lang={lang}
                      selected={isChosen}
                      itemTier={item.tier}
                      onSelect={() => {
                        onChangeSpell(key, sp.id);
                        setFocusedSlot(key);
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Spell Quick Summary */}
      {focusedSpell && (
        <div className="p-3 rounded-lg bg-bg-primary/90 border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-accent-primary text-bg-primary">
                {focusedSpell.slot}
              </span>
              <span className="font-display font-bold text-sm text-text-primary">
                {lang === 'vi' ? focusedSpell.name_vi : focusedSpell.name_en}
              </span>
              {focusedSpell.unlockTier && item.tier < focusedSpell.unlockTier && (
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  {lang === 'vi' ? 'Yêu cầu Tier VI+' : 'Requires Tier VI+'}
                </span>
              )}
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              {lang === 'vi'
                ? focusedSpell.description_vi
                : focusedSpell.description_en}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] shrink-0">
            <span className="flex items-center gap-1 px-2 py-1 rounded bg-bg-elevated border border-border-subtle text-sky-300">
              <Clock className="w-3 h-3" />
              {focusedSpell.cooldown}s
            </span>
            <span className="flex items-center gap-1 px-2 py-1 rounded bg-bg-elevated border border-border-subtle text-blue-300">
              <Zap className="w-3 h-3" />
              {focusedSpell.energy_cost}
            </span>
            <span className="flex items-center gap-1 px-2 py-1 rounded bg-bg-elevated border border-border-subtle text-amber-300">
              <Layers className="w-3 h-3" />
              {lang === 'vi'
                ? focusedSpell.cast_time_vi
                : focusedSpell.cast_time_en}
            </span>
            <span className="flex items-center gap-1 px-2 py-1 rounded bg-bg-elevated border border-border-subtle text-emerald-300">
              <Crosshair className="w-3 h-3" />
              {lang === 'vi' ? focusedSpell.range_vi : focusedSpell.range_en}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

interface BrassSpellOrbProps {
  spell: AlbionSpell;
  lang: AppLanguage;
  selected: boolean;
  itemTier: number;
  onSelect: () => void;
}

const BrassSpellOrb: React.FC<BrassSpellOrbProps> = ({
  spell,
  lang,
  selected,
  itemTier,
  onSelect,
}) => {
  const [imgSrc, setImgSrc] = useState(() => getSpellRenderUrl(spell.spell_icon, 64));
  const [triedCdn, setTriedCdn] = useState(false);
  const [failed, setFailed] = useState(false);

  React.useEffect(() => {
    setImgSrc(getSpellRenderUrl(spell.spell_icon, 64));
    setTriedCdn(false);
    setFailed(false);
  }, [spell.spell_icon]);

  const handleImageError = () => {
    if (!triedCdn) {
      setTriedCdn(true);
      // Fallback directly to official render API
      setImgSrc(`https://render.albiononline.com/v1/spell/${encodeURIComponent(spell.spell_icon)}.png?size=64`);
    } else {
      setFailed(true);
    }
  };

  const isLocked = Boolean(spell.unlockTier && itemTier < spell.unlockTier);

  const title = isLocked
    ? `${lang === 'vi' ? spell.name_vi : spell.name_en} (${lang === 'vi' ? 'Khóa: Yêu cầu Tier VI+' : 'Locked: Requires Tier VI+'})`
    : (lang === 'vi' ? spell.name_vi : spell.name_en);

  return (
    <button
      type="button"
      disabled={isLocked}
      onClick={(e) => {
        e.stopPropagation();
        if (!isLocked) onSelect();
      }}
      title={title}
      className={[
        'relative w-10 h-10 rounded-full flex items-center justify-center overflow-hidden transition-all',
        isLocked
          ? 'opacity-40 grayscale cursor-not-allowed border border-border-subtle bg-bg-primary'
          : selected
            ? 'border-2 border-border-gold ring-2 ring-accent-primary/40 scale-105 shadow-rpg-gold bg-bg-elevated'
            : 'border border-border-gold/40 opacity-70 hover:opacity-100 hover:border-border-gold bg-bg-primary',
      ].join(' ')}
    >
      {!failed ? (
        <img
          src={imgSrc}
          alt={spell.name_en}
          loading="lazy"
          onError={handleImageError}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="font-display font-bold text-xs text-accent-primary">
          {spell.slot === 'PASSIVE' ? 'P' : spell.slot}
        </span>
      )}

      {isLocked && (
        <div className="absolute inset-0 bg-bg-primary/70 flex items-center justify-center">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
        </div>
      )}
    </button>
  );
};

