'use client';

import React, { useMemo, useState } from 'react';
import {
  DESTINY_TREES,
  DestinyFamily,
  DestinyMainTreeId,
} from '@/data/destiny-board-data';
import {
  BASE_ALBION_ITEMS,
  HydratedAlbionItem,
  getBaseItem,
} from '@/services/albion-db';
import { AppLanguage } from '@/i18n/translations';
import { ItemSlot } from './ItemSlot';
import { EXACT_SIGNATURE_SKILLS } from '@/data/albion-signature-skills';
import {
  Check,
  ChevronRight,
  Compass,
  Crosshair,
  Flame,
  Layers,
  Shield,
  Sliders,
  Sparkles,
  Swords,
  Wand2,
  Zap,
} from 'lucide-react';

export interface DestinyBoardNavigatorProps {
  lang: AppLanguage;
  onSelectItem: (item: HydratedAlbionItem) => void;
  selectedBaseId?: string;
}

export const DestinyBoardNavigator: React.FC<DestinyBoardNavigatorProps> = ({
  lang,
  onSelectItem,
  selectedBaseId,
}) => {
  const [activeMainTree, setActiveMainTree] =
    useState<DestinyMainTreeId>('warrior');
  const [activeFamilyId, setActiveFamilyId] = useState<string>('axe');

  const currentTree = DESTINY_TREES[activeMainTree];

  // Families belonging to current main tree
  const families = currentTree.families;

  // Active family
  const currentFamily: DestinyFamily = useMemo(() => {
    return (
      families.find((f) => f.id === activeFamilyId) ||
      families[0] || {
        id: 'axe',
        name_en: 'Axe',
        name_vi: 'Nhánh Rìu',
        iconItem: 'T8_MAIN_AXE',
        category: 'weapons',
        baseIds: [],
      }
    );
  }, [families, activeFamilyId]);

  // When switching main tree, default to first family
  const handleSelectTree = (treeId: DestinyMainTreeId) => {
    setActiveMainTree(treeId);
    const newFamilies = DESTINY_TREES[treeId].families;
    if (newFamilies[0]) {
      setActiveFamilyId(newFamilies[0].id);
    }
  };

  // Resolve representative items (8 Base Weapons) for current family
  // Always use Tier 8 sprite preview for sharp, authentic Albion artwork
  const familyBaseItems = useMemo(() => {
    const list: HydratedAlbionItem[] = [];
    for (const baseId of currentFamily.baseIds) {
      const found = getBaseItem(baseId);
      if (found) {
        list.push(found);
      }
    }
    return list;
  }, [currentFamily]);

  const treeIcons: Record<DestinyMainTreeId, React.ReactNode> = {
    warrior: <Swords className="w-4 h-4 text-red-400" />,
    hunter: <Crosshair className="w-4 h-4 text-emerald-400" />,
    mage: <Wand2 className="w-4 h-4 text-sky-400" />,
    plate: <Shield className="w-4 h-4 text-slate-300" />,
    leather: <Layers className="w-4 h-4 text-amber-500" />,
    cloth: <Sparkles className="w-4 h-4 text-purple-400" />,
    accessory: <Compass className="w-4 h-4 text-yellow-400" />,
  };

  return (
    <div className="rounded-2xl bg-bg-surface border-2 border-border-gold/50 shadow-rpg-gold overflow-hidden">
      {/* CẤP 1: DESTINY BOARD MAIN TREE TABS (WARRIOR, HUNTER, MAGE, ARMORS) */}
      <div className="p-3.5 bg-gradient-to-r from-bg-elevated via-bg-secondary to-bg-elevated border-b border-border-gold/40">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-accent-primary animate-spin-slow" />
            <span className="font-display font-bold text-xs uppercase tracking-wider text-accent-primary">
              {lang === 'vi'
                ? 'Cấp 1 • Phân Nhánh Destiny Board (Bảng Định Mệnh)'
                : 'Level 1 • Destiny Board Main Trees'}
            </span>
          </div>
          <span className="text-[11px] font-mono text-text-muted hidden sm:inline-block">
            {lang === 'vi'
              ? 'Chuẩn 3 Cấp Destiny Board Albion Online'
              : 'Albion Online 3-Tier Hierarchy'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
          {(Object.keys(DESTINY_TREES) as DestinyMainTreeId[]).map((treeId) => {
            const tree = DESTINY_TREES[treeId];
            const isSelected = activeMainTree === treeId;
            return (
              <button
                key={treeId}
                type="button"
                onClick={() => handleSelectTree(treeId)}
                className={[
                  'py-2 px-2 rounded-xl text-xs font-display font-bold transition-all flex items-center justify-center gap-1.5 border',
                  isSelected
                    ? `${tree.badgeClass} ring-2 ring-accent-primary/60 shadow-rpg-gold scale-102`
                    : 'bg-bg-primary/70 text-text-secondary border-border-subtle hover:text-text-primary hover:border-border-gold/40',
                ].join(' ')}
              >
                {treeIcons[treeId]}
                <span className="truncate">
                  {lang === 'vi' ? tree.name_vi.split(' ')[0] : tree.name_en.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CẤP 2: WEAPON FAMILY / NODE SELECTOR (AXE, SWORD, CROSSBOW, BOW, ETC.) */}
      <div className="px-4 py-3 bg-bg-secondary/70 border-b border-border-subtle flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono font-bold text-text-muted mr-1 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-accent-primary" />
          {lang === 'vi' ? 'Dòng Vũ Khí / Giáp:' : 'Family Node:'}
        </span>

        {families.map((fam) => {
          const isSelected = activeFamilyId === fam.id;
          return (
            <button
              key={fam.id}
              type="button"
              onClick={() => setActiveFamilyId(fam.id)}
              className={[
                'px-3 py-1.5 rounded-lg text-xs font-display font-bold transition-all flex items-center gap-1.5 border',
                isSelected
                  ? 'bg-accent-primary text-bg-primary border-border-gold shadow-rpg-gold scale-105'
                  : 'bg-bg-primary/80 text-text-secondary border-border-subtle hover:border-border-gold/50 hover:text-text-primary',
              ].join(' ')}
            >
              <span>{lang === 'vi' ? fam.name_vi : fam.name_en}</span>
              <span
                className={[
                  'px-1.5 py-0.2 rounded text-[10px] font-mono',
                  isSelected ? 'bg-bg-primary/30 text-bg-primary' : 'bg-bg-secondary text-text-muted',
                ].join(' ')}
              >
                {fam.baseIds.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* CẤP 3: GRID 8 VŨ KHÍ ĐẠI DIỆN (BASE WEAPONS) - ẢNH TIER 8 THỜI THƯỢNG */}
      <div className="p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border-subtle text-xs">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{ backgroundColor: currentTree.color }}
            />
            <h3 className="font-display font-bold text-sm sm:text-base text-text-primary">
              {lang === 'vi'
                ? `Danh Sách 8 Vũ Khí Đại Diện: ${currentFamily.name_vi}`
                : `8 Base Weapons: ${currentFamily.name_en}`}
            </h3>
          </div>
          <span className="text-text-muted font-mono text-[11px]">
            {lang === 'vi'
              ? 'Ảnh hiển thị mặc định: Cấp Tier VIII (T8) • Click để Tùy Chỉnh Tier/Enchant'
              : 'Default Preview: Tier VIII (T8) • Click to Configure Tier/Enchant'}
          </span>
        </div>

        {/* 8 Base Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {familyBaseItems.map((baseItem, idx) => {
            const isSelected = selectedBaseId === baseItem.base_identifier;
            const sig = EXACT_SIGNATURE_SKILLS[baseItem.base_identifier.toUpperCase()];

            return (
              <div
                key={baseItem.id}
                onClick={() => onSelectItem(baseItem)}
                className={[
                  'group relative p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between overflow-hidden',
                  isSelected
                    ? 'bg-bg-elevated border-border-gold shadow-rpg-gold ring-2 ring-accent-primary/50'
                    : 'bg-bg-primary/80 border-border-subtle hover:border-border-gold/60 hover:bg-bg-elevated/70 hover:shadow-rpg-gold',
                ].join(' ')}
              >
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {baseItem.handedness !== 'NONE' ? baseItem.handedness : 'BASE'}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-accent-primary">
                    {baseItem.stats.base_ip} IP
                  </span>
                </div>

                {/* Central Tier 8 Icon Preview */}
                <div className="flex items-center justify-center py-2 group-hover:scale-105 transition-transform">
                  <ItemSlot
                    baseIdentifier={baseItem.base_identifier}
                    name={baseItem.name_en}
                    tier={8}
                    defaultTier={8}
                    enchantment={0}
                    quality={1}
                    size="lg"
                    priority={idx < 4}
                    showHandednessBadge={false}
                  />
                </div>

                {/* Item Details */}
                <div className="mt-2 space-y-1 text-center">
                  <h4 className="font-display font-bold text-xs sm:text-sm text-text-primary group-hover:text-accent-primary transition-colors line-clamp-1">
                    {lang === 'vi' ? baseItem.name_vi : baseItem.name_en}
                  </h4>
                  <p className="text-[10px] text-text-muted font-mono truncate">
                    {lang === 'vi' ? baseItem.name_en : baseItem.base_identifier}
                  </p>

                  {/* Signature Skill Pill */}
                  {sig && (
                    <div className="pt-1.5 flex items-center justify-center">
                      <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-bg-secondary text-accent-light border border-border-subtle group-hover:border-border-gold/40 flex items-center gap-1 truncate max-w-full">
                        <Zap className="w-2.5 h-2.5 text-accent-primary shrink-0" />
                        <span className="truncate">E: {lang === 'vi' ? sig.name_vi : sig.name_en}</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Configure Button Overlay Hint */}
                <div className="mt-3 pt-2 border-t border-border-subtle flex items-center justify-between text-[11px] text-text-secondary group-hover:text-text-primary">
                  <span className="flex items-center gap-1 font-mono text-[10px]">
                    <Sliders className="w-3 h-3 text-accent-primary" />
                    T4–T8
                  </span>
                  <span className="font-display font-bold text-[10px] uppercase text-accent-primary flex items-center gap-0.5 group-hover:underline">
                    {lang === 'vi' ? 'Tùy Chỉnh' : 'Configure'}
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

