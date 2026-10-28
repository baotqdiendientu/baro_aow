'use client';

import React from 'react';
import {
  AlbionEnchantment,
  AlbionItem,
  AlbionQuality,
  AlbionSlotType,
  AlbionTier,
  EquippedSlotState,
} from '@/types/albion';
import { HydratedAlbionItem } from '@/services/albion-db';
import { getTierRoman } from '@/services/ao-api';
import { AppLanguage } from '@/i18n/translations';
import { ItemSlot } from '../ItemSlot';
import { Search, Sliders, X } from 'lucide-react';

export interface SlotEquipmentPickerProps {
  focusedSlot: AlbionSlotType;
  focusedSlotLabel: { vi: string; en: string; short: string };
  focusedSlotState?: EquippedSlotState;
  focusedItem?: HydratedAlbionItem;
  paginatedCandidates: HydratedAlbionItem[];
  totalCandidatesCount: number;
  totalPickerPages: number;
  safePickerPage: number;
  pickerSearch: string;
  pickerTierFilter: 'ALL' | AlbionTier;
  onSearchChange: (search: string) => void;
  onTierFilterChange: (tier: 'ALL' | AlbionTier) => void;
  onPageChange: (page: number) => void;
  onSelectCandidate: (candidate: HydratedAlbionItem) => void;
  onUpdateSlotMeta: (slot: AlbionSlotType, patch: Partial<EquippedSlotState>) => void;
  onOpenConfigureModal: (item: HydratedAlbionItem) => void;
  lang: AppLanguage;
}

export const SlotEquipmentPicker: React.FC<SlotEquipmentPickerProps> = ({
  focusedSlot,
  focusedSlotLabel,
  focusedSlotState,
  focusedItem,
  paginatedCandidates,
  totalCandidatesCount,
  totalPickerPages,
  safePickerPage,
  pickerSearch,
  pickerTierFilter,
  onSearchChange,
  onTierFilterChange,
  onPageChange,
  onSelectCandidate,
  onUpdateSlotMeta,
  onOpenConfigureModal,
  lang,
}) => {
  return (
    <div className="p-3 md:p-6 rounded-xl bg-bg-secondary border border-border-subtle space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-accent-primary" />
          <h3 className="font-display font-bold text-sm sm:text-base text-text-primary">
            {lang === 'vi'
              ? `Đang chỉnh ô: ${focusedSlotLabel.vi}`
              : `Editing Slot: ${focusedSlotLabel.en}`}
          </h3>
        </div>

        {/* Tier & Enchantment Quick Pills for Equipped Item in Focused Slot */}
        {focusedSlotState && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-bg-primary p-1 rounded-lg border border-border-subtle">
              {([4, 5, 6, 7, 8] as AlbionTier[]).map((tNum) => (
                <button
                  key={tNum}
                  type="button"
                  onClick={() => onUpdateSlotMeta(focusedSlot, { tier: tNum })}
                  className={[
                    'px-2 py-0.5 rounded text-xs font-mono font-bold transition-all',
                    focusedSlotState.tier === tNum
                      ? 'bg-accent-primary text-bg-primary'
                      : 'text-text-secondary hover:text-text-primary',
                  ].join(' ')}
                >
                  {getTierRoman(tNum)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-bg-primary p-1 rounded-lg border border-border-subtle">
              {([0, 1, 2, 3, 4] as AlbionEnchantment[]).map((enc) => (
                <button
                  key={enc}
                  type="button"
                  onClick={() =>
                    onUpdateSlotMeta(focusedSlot, {
                      enchantment: enc,
                    })
                  }
                  className={[
                    'px-2 py-0.5 rounded text-xs font-mono font-bold transition-all',
                    focusedSlotState.enchantment === enc
                      ? 'bg-emerald-600 dark:bg-emerald-500 text-bg-primary'
                      : 'text-text-secondary hover:text-text-primary',
                  ].join(' ')}
                >
                  .{enc}
                </button>
              ))}
            </div>

            {focusedItem && (
              <button
                type="button"
                onClick={() => onOpenConfigureModal(focusedItem)}
                className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-accent-primary/20 hover:bg-accent-primary/30 text-accent-primary border border-border-gold/40 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Sliders className="w-3.5 h-3.5" />
                {lang === 'vi' ? 'Tùy Chỉnh' : 'Configure'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Search & Tier Filter inside the Slot Picker */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="relative flex-1 min-w-[200px] flex items-center bg-bg-primary border border-border-subtle focus-within:border-border-gold rounded-lg px-3 py-1.5">
          <Search className="w-3.5 h-3.5 text-accent-primary mr-2 shrink-0" />
          <input
            type="text"
            value={pickerSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              lang === 'vi'
                ? `Tìm trong ${totalCandidatesCount} món ô ${focusedSlotLabel.short}...`
                : `Search ${totalCandidatesCount} items for ${focusedSlotLabel.short}...`
            }
            className="w-full bg-transparent text-xs text-text-primary placeholder:text-text-muted focus:outline-none"
          />
          {pickerSearch && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="text-text-muted hover:text-text-primary"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Picker List by Tier */}
        <div className="flex items-center gap-1 bg-bg-primary p-1 rounded-lg border border-border-subtle font-mono text-xs">
          <button
            type="button"
            onClick={() => onTierFilterChange('ALL')}
            className={[
              'px-2 py-0.5 rounded font-bold',
              pickerTierFilter === 'ALL'
                ? 'bg-accent-primary text-bg-primary'
                : 'text-text-secondary hover:text-text-primary',
            ].join(' ')}
          >
            ALL
          </button>
          {([4, 5, 6, 7, 8] as AlbionTier[]).map((tNum) => (
            <button
              key={tNum}
              type="button"
              onClick={() => onTierFilterChange(tNum)}
              className={[
                'px-2 py-0.5 rounded font-bold',
                pickerTierFilter === tNum
                  ? 'bg-accent-primary/20 text-accent-primary border border-border-gold/40'
                  : 'text-text-secondary hover:text-text-primary',
              ].join(' ')}
            >
              T{tNum}
            </button>
          ))}
        </div>
      </div>

      {/* Paginated Candidate Items Grid (12 items/page) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {paginatedCandidates.map((cand) => {
          const isEquipped =
            focusedSlotState?.uniqueName.toUpperCase().includes(cand.base_identifier.toUpperCase());
          return (
            <button
              key={cand.id}
              type="button"
              onClick={() => onSelectCandidate(cand)}
              className={[
                'p-2 rounded-lg border text-left transition-all flex items-center gap-2.5 group',
                isEquipped
                  ? 'bg-bg-elevated border-border-gold shadow-rpg-gold'
                  : 'bg-bg-primary/70 border-border-subtle hover:border-border-gold/40 hover:bg-bg-elevated/40',
              ].join(' ')}
            >
              <ItemSlot
                baseIdentifier={cand.base_identifier}
                name={cand.name_en}
                tier={
                  isEquipped && focusedSlotState
                    ? focusedSlotState.tier
                    : cand.tier
                }
                defaultTier={cand.tier}
                enchantment={
                  isEquipped && focusedSlotState
                    ? focusedSlotState.enchantment
                    : 0
                }
                quality={
                  isEquipped && focusedSlotState
                    ? focusedSlotState.quality
                    : 1
                }
                size="sm"
                selected={isEquipped}
              />
              <div className="min-w-0 flex-1">
                <div className="font-display font-bold text-xs text-text-primary truncate group-hover:text-accent-primary transition-colors">
                  {lang === 'vi' ? cand.name_vi : cand.name_en}
                </div>
                <div className="flex items-center justify-between gap-1 text-[10px] font-mono text-accent-primary mt-0.5">
                  <span className="truncate">
                    {cand.handedness !== 'NONE'
                      ? `${cand.handedness} • `
                      : ''}
                    {cand.sub_category_en}
                  </span>
                  <span className="shrink-0">{cand.stats.base_ip} IP</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPickerPages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-border-subtle font-mono text-xs">
          <span className="text-text-muted">
            {lang === 'vi' ? 'Trang' : 'Page'} {safePickerPage} / {totalPickerPages}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={safePickerPage <= 1}
              onClick={() => onPageChange(Math.max(1, safePickerPage - 1))}
              className="px-2.5 py-1 rounded bg-bg-primary border border-border-subtle text-text-secondary hover:text-text-primary disabled:opacity-30"
            >
              ‹
            </button>
            <span className="px-2 py-0.5 rounded bg-bg-elevated border border-border-gold text-accent-primary font-bold">
              {safePickerPage}
            </span>
            <button
              type="button"
              disabled={safePickerPage >= totalPickerPages}
              onClick={() => onPageChange(Math.min(totalPickerPages, safePickerPage + 1))}
              className="px-2.5 py-1 rounded bg-bg-primary border border-border-subtle text-text-secondary hover:text-text-primary disabled:opacity-30"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
