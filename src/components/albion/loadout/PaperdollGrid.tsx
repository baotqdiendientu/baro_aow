'use client';

import React from 'react';
import {
  AlbionItem,
  AlbionSlotType,
  EquippedSlotState,
  LoadoutMap,
} from '@/types/albion';
import { AppLanguage } from '@/i18n/translations';
import { ItemSlot } from '../ItemSlot';
import { Coins, Lock, Swords } from 'lucide-react';

export interface PaperdollGridProps {
  loadout: LoadoutMap;
  focusedSlot: AlbionSlotType;
  onSelectSlot: (slot: AlbionSlotType) => void;
  isTwoHandedEquipped: boolean;
  mainHandItem?: AlbionItem;
  mainHandState?: EquippedSlotState;
  itemByUniqueMap: Map<string, AlbionItem>;
  averageIp: number;
  totalSilver: number;
  lang: AppLanguage;
}

const SLOT_LABELS: Record<
  AlbionSlotType,
  { short: string; vi: string; en: string }
> = {
  Bag: { short: 'TÚI', vi: 'Túi Đồ (Bag)', en: 'Bag Slot' },
  Head: { short: 'MŨ', vi: 'Mũ (Head/Helmet)', en: 'Head Slot' },
  Cape: { short: 'CHOÀNG', vi: 'Áo Choàng (Cape)', en: 'Cape Slot' },
  MainHand: { short: 'VŨ KHÍ', vi: 'Vũ Khí Chính (Main-Hand)', en: 'Main-Hand Weapon' },
  Armor: { short: 'GIÁP', vi: 'Áo Giáp (Chest Armor)', en: 'Chest Armor' },
  OffHand: { short: 'TAY PHỤ', vi: 'Tay Phụ (Off-Hand)', en: 'Off-Hand Equipment' },
  Potion: { short: 'THUỐC', vi: 'Bình Thuốc (Potion)', en: 'Potion Consumable' },
  Shoes: { short: 'GIÀY', vi: 'Giày (Shoes/Boots)', en: 'Boots / Shoes' },
  Food: { short: 'ĂN', vi: 'Thức Ăn (Food)', en: 'Food Buff' },
  Mount: { short: 'THÚ', vi: 'Thú Cưỡi (Mount)', en: 'Mount' },
};

export const PaperdollGrid: React.FC<PaperdollGridProps> = ({
  loadout,
  focusedSlot,
  onSelectSlot,
  isTwoHandedEquipped,
  mainHandItem,
  mainHandState,
  itemByUniqueMap,
  averageIp,
  totalSilver,
  lang,
}) => {
  const renderCell = (slotKey: AlbionSlotType) => {
    const isOffHandLocked = slotKey === 'OffHand' && isTwoHandedEquipped;
    const state = loadout[slotKey];
    const item = state
      ? itemByUniqueMap.get(state.uniqueName.toUpperCase())
      : undefined;
    const isFocused = focusedSlot === slotKey;
    const labelInfo = SLOT_LABELS[slotKey];

    if (isOffHandLocked && mainHandItem && mainHandState) {
      return (
        <div
          key={slotKey}
          title={
            lang === 'vi'
              ? `Ô Tay Phụ bị khóa do ${mainHandItem.name_vi} là vũ khí 2 Tay (2H)`
              : `Off-Hand slot is locked because ${mainHandItem.name_en} is a 2-Handed (2H) weapon`
          }
          className="relative p-1.5 sm:p-2.5 rounded-xl bg-bg-primary/60 border border-dashed border-accent-crimson/50 flex flex-col items-center justify-center gap-1 sm:gap-1.5 select-none"
        >
          <span className="text-[9px] sm:text-[10px] font-mono uppercase text-red-600 dark:text-red-400 flex items-center gap-0.5 sm:gap-1">
            <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            {lang === 'vi' ? 'Khóa (2H)' : 'Locked'}
          </span>
          <ItemSlot
            baseIdentifier={mainHandItem.base_identifier}
            name={mainHandItem.name_en}
            tier={mainHandState.tier}
            defaultTier={mainHandItem.tier}
            enchantment={mainHandState.enchantment}
            quality={mainHandState.quality}
            handedness="2H"
            disabled
            size="responsive"
          />
          <span className="text-[9px] sm:text-[10px] font-mono text-text-muted truncate max-w-[80px] sm:max-w-[105px]">
            {lang === 'vi' ? 'Tay Phụ Khóa' : 'Off-Hand 2H'}
          </span>
        </div>
      );
    }

    return (
      <div
        key={slotKey}
        onClick={() => onSelectSlot(slotKey)}
        className={[
          'p-1.5 sm:p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 sm:gap-1.5 relative group',
          isFocused
            ? 'bg-bg-elevated border-border-gold shadow-rpg-gold'
            : 'bg-bg-primary/80 border-border-subtle hover:border-border-gold/50',
        ].join(' ')}
      >
        <span className="text-[9px] sm:text-[10px] font-mono uppercase text-text-secondary">
          {labelInfo.short}
        </span>

        {item && state ? (
          <>
            <ItemSlot
              baseIdentifier={item.base_identifier}
              name={item.name_en}
              tier={state.tier}
              defaultTier={item.tier}
              enchantment={state.enchantment}
              quality={state.quality}
              handedness={item.handedness}
              selected={isFocused}
              showHandednessBadge={slotKey === 'MainHand'}
            />
            <span className="text-[10px] sm:text-[11px] font-medium text-text-primary truncate max-w-[80px] sm:max-w-[105px] text-center">
              {lang === 'vi' ? item.name_vi : item.name_en}
            </span>
          </>
        ) : (
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-md border border-dashed border-border-subtle flex items-center justify-center text-xs text-text-muted">
            +
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Stats Summary: Average IP & Total Build Cost */}
      <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-bg-primary border border-border-gold/40 shadow-rpg-gold">
        <div>
          <div className="text-[10px] font-mono uppercase text-text-secondary flex items-center gap-1">
            <Swords className="w-3 h-3 text-accent-primary" />
            <span>
              {lang === 'vi' ? 'IP Trung Bình Build' : 'Average Build IP'}
            </span>
          </div>
          <div className="mt-0.5 font-mono text-2xl font-extrabold text-accent-primary">
            {averageIp.toLocaleString('en-US')}{' '}
            <span className="text-xs font-normal text-text-muted">IP</span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] font-mono uppercase text-text-secondary flex items-center justify-end gap-1">
            <Coins className="w-3 h-3 text-accent-primary" />
            <span>
              {lang === 'vi' ? 'Tổng Chi Phí Bộ Đồ' : 'Estimated Build Cost'}
            </span>
          </div>
          <div className="mt-0.5 font-mono text-lg sm:text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {totalSilver.toLocaleString('en-US')}{' '}
            <span className="text-xs font-normal text-text-secondary">Ag</span>
          </div>
        </div>
      </div>

      {/* 3x4 ALBION INVENTORY GRID */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-bg-surface/70 p-2 sm:p-3.5 rounded-xl border border-border-subtle">
        {/* ROW 1: [Bag] [Head] [Cape] */}
        {renderCell('Bag')}
        {renderCell('Head')}
        {renderCell('Cape')}

        {/* ROW 2: [MainHand] [Armor] [OffHand] */}
        {renderCell('MainHand')}
        {renderCell('Armor')}
        {renderCell('OffHand')}

        {/* ROW 3: [Potion] [Shoes] [Food] */}
        {renderCell('Potion')}
        {renderCell('Shoes')}
        {renderCell('Food')}

        {/* ROW 4: [Empty] [Mount] [Empty] */}
        <div className="hidden sm:block" />
        {renderCell('Mount')}
        <div className="hidden sm:block" />
      </div>
    </div>
  );
};
