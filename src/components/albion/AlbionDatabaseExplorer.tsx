'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  FULL_ALBION_DB,
  HydratedAlbionItem,
  normalizeSearchText,
} from '@/services/albion-db';
import {
  AlbionEnchantment,
  AlbionQuality,
  AlbionSlotType,
  AlbionTier,
} from '@/types/albion';
import {
  ENCHANTMENT_METADATA,
  QUALITY_METADATA,
  buildUniqueName,
  calculateDynamicItemStats,
  getTierRoman,
} from '@/services/ao-api';
import { AppLanguage } from '@/i18n/translations';
import { ItemSlot } from './ItemSlot';
import { ItemTooltip } from './ItemTooltip';
import {
  ChevronLeft,
  ChevronRight,
  Database,
  Filter,
  RotateCcw,
  Search,
  Sliders,
  Sparkles,
  X,
} from 'lucide-react';

const ITEMS_PER_PAGE = 48;

const SLOT_FILTER_OPTIONS: {
  id: 'ALL' | AlbionSlotType;
  label_vi: string;
  label_en: string;
}[] = [
  { id: 'ALL', label_vi: 'Tất Cả Ô', label_en: 'All Slots' },
  { id: 'MainHand', label_vi: 'Vũ Khí Chính (Main-Hand)', label_en: 'Main-Hand' },
  { id: 'OffHand', label_vi: 'Tay Phụ (Off-Hand)', label_en: 'Off-Hand' },
  { id: 'Head', label_vi: 'Mũ / Nón (Head)', label_en: 'Head' },
  { id: 'Armor', label_vi: 'Áo Giáp (Armor)', label_en: 'Armor' },
  { id: 'Shoes', label_vi: 'Giày (Shoes)', label_en: 'Shoes' },
  { id: 'Cape', label_vi: 'Áo Choàng (Cape)', label_en: 'Cape' },
  { id: 'Bag', label_vi: 'Túi Đồ (Bag)', label_en: 'Bag' },
  { id: 'Mount', label_vi: 'Thú Cưỡi (Mount)', label_en: 'Mount' },
  { id: 'Food', label_vi: 'Thức Ăn & Hạt Giống', label_en: 'Food & Farming' },
  { id: 'Potion', label_vi: 'Bình Thuốc (Potion)', label_en: 'Potion' },
];

export interface AlbionDatabaseExplorerProps {
  lang: AppLanguage;
  externalSelectedItem?: HydratedAlbionItem | null;
  externalTier?: AlbionTier;
  externalEnchant?: AlbionEnchantment;
}

export const AlbionDatabaseExplorer: React.FC<AlbionDatabaseExplorerProps> = ({
  lang,
  externalSelectedItem,
  externalTier,
  externalEnchant,
}) => {
  // Default to Light Crossbow (T4_MAIN_1HCROSSBOW)
  const defaultItem = useMemo(
    () =>
      FULL_ALBION_DB.find((i) => i.unique_name === 'T4_MAIN_1HCROSSBOW') ||
      FULL_ALBION_DB[0],
    []
  );

  const [selectedItem, setSelectedItem] =
    useState<HydratedAlbionItem>(defaultItem);
  const [previewEnchant, setPreviewEnchant] = useState<AlbionEnchantment>(0);
  const [previewQuality, setPreviewQuality] = useState<AlbionQuality>(3);

  // Instant Multi-Filter States
  const [searchInput, setSearchInput] = useState('');
  const [slotFilter, setSlotFilter] = useState<'ALL' | AlbionSlotType>('ALL');
  const [tierFilter, setTierFilter] = useState<'ALL' | AlbionTier>('ALL');
  const [handFilter, setHandFilter] = useState<'ALL' | '1H' | '2H'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  // Sync when global search bar selects an item
  useEffect(() => {
    if (externalSelectedItem) {
      setSelectedItem(externalSelectedItem);
      if (externalEnchant !== undefined) {
        setPreviewEnchant(externalEnchant);
      }
    }
  }, [externalSelectedItem, externalTier, externalEnchant]);

  // Reset pagination to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchInput, slotFilter, tierFilter, handFilter]);

  // Instant Multi-Filter + Diacritic-insensitive search (<5ms over 1,702 base items)
  const filteredItems = useMemo(() => {
    const qNorm = normalizeSearchText(searchInput);

    return FULL_ALBION_DB.filter((item) => {
      if (slotFilter !== 'ALL' && item.slot_type !== slotFilter) return false;
      if (tierFilter !== 'ALL' && item.tier !== tierFilter) return false;
      if (handFilter !== 'ALL' && item.handedness !== handFilter) return false;

      if (qNorm) {
        // Support multi-word accent-free matching (e.g. "luoi hai", "cung t6", "cu owl")
        const tokens = qNorm.split(/\s+/).filter(Boolean);
        for (const tk of tokens) {
          if (/^t[1-8]$/.test(tk)) {
            const tNum = Number(tk.slice(1));
            if (item.tier !== tNum) return false;
            continue;
          }
          if (!item.search_text.includes(tk)) return false;
        }
      }

      return true;
    });
  }, [searchInput, slotFilter, tierFilter, handFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / ITEMS_PER_PAGE)
  );
  const safePage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, safePage]);

  const quickSearchTags = [
    { label: 'Light Crossbow', query: 'light crossbow' },
    { label: 'Lưỡi Hái (Scythe)', query: 'luoi hai' },
    { label: 'Druidic Staff', query: 'druidic' },
    { label: 'Cung (Bow)', query: 'cung' },
    { label: 'Cú Thần (Owl)', query: 'owl' },
    { label: 'Hellion Jacket', query: 'hellion' },
    { label: 'Mistcaller', query: 'mistcaller' },
  ];

  const handleResetFilters = () => {
    setSearchInput('');
    setSlotFilter('ALL');
    setTierFilter('ALL');
    setHandFilter('ALL');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* DATABASE HEADER & STATS BANNER */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-bg-secondary via-bg-elevated to-bg-secondary border border-border-subtle flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-accent-primary/20 text-accent-primary border border-border-gold/40 flex items-center gap-1">
              <Database className="w-3 h-3" />
              AO-BIN-DUMPS SYNCED DATABASE
            </span>
            <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              {FULL_ALBION_DB.length.toLocaleString('en-US')} Base Items (8,500+
              Variants)
            </span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-text-primary">
            {lang === 'vi'
              ? 'Kho Dữ Liệu Toàn Bộ Vật Phẩm Albion Online'
              : 'Complete Albion Online Item Database & Tooltip Inspector'}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-text-secondary">
            {lang === 'vi'
              ? 'Đã gom nhóm biến thể .0 → .4 và lọc sạch rác hệ thống từ 12,237 dòng dữ liệu gốc. Hỗ trợ tìm kiếm tiếng Việt không dấu ("cung", "luoi hai", "cu") và phân trang 48 món/trang.'
              : 'Cleaned and grouped (.0 → .4 enchantments) from 12,237 raw ao-bin-dumps entries. Supports instant multi-filtering, diacritic-free search, and 48-item client-side pagination.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 font-mono text-xs bg-bg-primary/90 px-4 py-2.5 rounded-xl border border-border-gold/40">
          <div>
            <div className="text-[10px] text-text-muted uppercase">
              {lang === 'vi' ? 'Kết quả lọc' : 'Filtered Matches'}
            </div>
            <div className="text-lg font-extrabold text-accent-primary">
              {filteredItems.length.toLocaleString('en-US')}{' '}
              <span className="text-xs font-normal text-text-secondary">
                / {FULL_ALBION_DB.length.toLocaleString('en-US')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* STEP 3.2: INSTANT MULTI-FILTER BAR */}
      <div className="p-4 sm:p-5 rounded-xl bg-bg-secondary border border-border-subtle space-y-4">
        {/* Row 1: Diacritic-Free Search Input + Handedness + Enchantment Global Switcher */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-6 relative flex items-center bg-bg-primary border border-border-subtle focus-within:border-border-gold rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-accent-primary shrink-0 mr-2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={
                lang === 'vi'
                  ? 'Gõ không dấu hoặc tiếng Anh: "cung", "crossbow", "luoi hai", "reaper", "owl"...'
                  : 'Search by name or ID: "crossbow", "reaper", "owl", "hellion", "T6_MAIN"...'
              }
              className="w-full bg-transparent text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="text-text-muted hover:text-text-primary ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* 1H / 2H Filter */}
          <div className="lg:col-span-3 flex items-center gap-1 bg-bg-primary p-1 rounded-lg border border-border-subtle">
            {(
              [
                { id: 'ALL', label: lang === 'vi' ? 'Mọi Loại Tay' : 'All Hands' },
                { id: '1H', label: '1H (1 Tay)' },
                { id: '2H', label: '2H (2 Tay)' },
              ] as const
            ).map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => setHandFilter(h.id)}
                className={[
                  'flex-1 py-1.5 rounded text-xs font-mono font-bold transition-all',
                  handFilter === h.id
                    ? 'bg-accent-primary text-bg-primary'
                    : 'text-text-secondary hover:text-text-primary',
                ].join(' ')}
              >
                {h.label}
              </button>
            ))}
          </div>

          {/* Global Enchantment Switcher (.0 -> .4) */}
          <div className="lg:col-span-3 flex items-center justify-between gap-1 bg-bg-primary p-1 rounded-lg border border-border-subtle">
            <span className="text-[10px] font-mono text-text-muted pl-2">
              Enchant:
            </span>
            {([0, 1, 2, 3, 4] as AlbionEnchantment[]).map((enc) => (
              <button
                key={enc}
                type="button"
                onClick={() => setPreviewEnchant(enc)}
                className={[
                  'px-2.5 py-1 rounded text-xs font-mono font-bold transition-all',
                  previewEnchant === enc
                    ? 'bg-emerald-500 text-bg-primary shadow'
                    : 'text-text-secondary hover:text-text-primary',
                ].join(' ')}
              >
                .{enc}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Search Chips */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-text-muted font-mono">
              {lang === 'vi' ? 'Gợi ý tra nhanh:' : 'Quick filters:'}
            </span>
            {quickSearchTags.map((tag) => (
              <button
                key={tag.query}
                type="button"
                onClick={() => setSearchInput(tag.query)}
                className="px-2 py-0.5 text-[11px] font-mono rounded bg-bg-primary hover:bg-border-gold/20 text-text-secondary hover:text-accent-primary border border-border-subtle transition-colors"
              >
                {tag.label}
              </button>
            ))}
          </div>

          {(searchInput ||
            slotFilter !== 'ALL' ||
            tierFilter !== 'ALL' ||
            handFilter !== 'ALL') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-xs font-mono text-accent-primary hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              {lang === 'vi' ? 'Xóa toàn bộ bộ lọc' : 'Reset all filters'}
            </button>
          )}
        </div>

        {/* Row 2: Slot Filter Pills */}
        <div className="pt-2 border-t border-border-subtle flex flex-wrap items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-accent-primary mr-1" />
          {SLOT_FILTER_OPTIONS.map((slotOpt) => {
            const active = slotFilter === slotOpt.id;
            return (
              <button
                key={slotOpt.id}
                type="button"
                onClick={() => setSlotFilter(slotOpt.id)}
                className={[
                  'px-2.5 py-1 rounded-lg text-xs font-medium border transition-all',
                  active
                    ? 'bg-accent-primary/20 border-border-gold text-accent-primary shadow-rpg-gold'
                    : 'bg-bg-primary border-border-subtle text-text-secondary hover:text-text-primary',
                ].join(' ')}
              >
                {lang === 'vi' ? slotOpt.label_vi : slotOpt.label_en}
              </button>
            );
          })}
        </div>

        {/* Row 3: Tier Filter Pills (T1 - T8) */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono text-text-muted mr-1">
            Tier (T1–T8):
          </span>
          <button
            type="button"
            onClick={() => setTierFilter('ALL')}
            className={[
              'px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all',
              tierFilter === 'ALL'
                ? 'bg-accent-primary text-bg-primary border-border-gold'
                : 'bg-bg-primary border-border-subtle text-text-secondary hover:text-text-primary',
            ].join(' ')}
          >
            ALL
          </button>
          {([1, 2, 3, 4, 5, 6, 7, 8] as AlbionTier[]).map((tNum) => (
            <button
              key={tNum}
              type="button"
              onClick={() => setTierFilter(tNum)}
              className={[
                'px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all',
                tierFilter === tNum
                  ? 'bg-accent-primary/20 border-border-gold text-accent-primary shadow-rpg-gold'
                  : 'bg-bg-primary border-border-subtle text-text-secondary hover:text-text-primary',
              ].join(' ')}
            >
              {getTierRoman(tNum)} (T{tNum})
            </button>
          ))}
        </div>
      </div>

      {/* MAIN WORKSPACE: PAGINATED 48-ITEM GRID (LEFT 7 COLS) + STICKY <ItemTooltip /> INSPECTOR (RIGHT 5 COLS) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT (7 cols): Paginated Grid (48 items/page) */}
        <div className="xl:col-span-7 space-y-4">
          {/* Top Pagination Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-bg-secondary border border-border-subtle text-xs">
            <span className="text-text-secondary font-mono">
              {lang === 'vi'
                ? `Trang ${safePage} / ${totalPages} (Hiển thị ${paginatedItems.length} / ${filteredItems.length} vật phẩm)`
                : `Page ${safePage} of ${totalPages} (Showing ${paginatedItems.length} of ${filteredItems.length} items)`}
            </span>

            <div className="flex items-center gap-1.5 font-mono">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded bg-bg-primary border border-border-subtle text-text-secondary hover:text-text-primary disabled:opacity-35"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2.5 py-1 rounded bg-bg-primary border border-border-gold/40 text-accent-primary font-bold">
                {safePage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className="p-1.5 rounded bg-bg-primary border border-border-subtle text-text-secondary hover:text-text-primary disabled:opacity-35"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 48-Item Paginated Grid */}
          {paginatedItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {paginatedItems.map((item, idx) => {
                const isSelected = selectedItem.id === item.id;
                const dyn = calculateDynamicItemStats(
                  item,
                  item.tier,
                  previewEnchant,
                  previewQuality
                );
                const resolvedCode = buildUniqueName(
                  item.unique_name,
                  item.tier,
                  previewEnchant
                );

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={[
                      'group p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3',
                      isSelected
                        ? 'bg-bg-elevated border-border-gold shadow-rpg-gold'
                        : 'bg-bg-secondary/90 border-border-subtle hover:border-border-gold/50 hover:bg-bg-elevated/60',
                    ].join(' ')}
                  >
                    <ItemSlot
                      baseIdentifier={item.base_identifier}
                      name={item.name_en}
                      tier={item.tier}
                      defaultTier={item.tier}
                      enchantment={previewEnchant}
                      quality={previewQuality}
                      handedness={item.handedness}
                      size="sm"
                      priority={idx < 12}
                      selected={isSelected}
                      showHandednessBadge
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[9px] font-mono text-text-muted truncate">
                          {resolvedCode}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-accent-primary shrink-0">
                          {dyn.totalIp} IP
                        </span>
                      </div>

                      <div className="font-display font-bold text-xs text-text-primary truncate group-hover:text-accent-primary transition-colors mt-0.5">
                        {lang === 'vi' ? item.name_vi : item.name_en}
                      </div>

                      <div className="text-[10px] text-text-secondary truncate">
                        {lang === 'vi' ? item.name_en : item.sub_category_en}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-10 rounded-xl bg-bg-secondary border border-border-subtle text-center space-y-2">
              <p className="text-sm text-text-secondary">
                {lang === 'vi'
                  ? `Không tìm thấy vật phẩm nào khớp với "${searchInput}".`
                  : `No items found matching "${searchInput}".`}
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-1.5 rounded-lg bg-accent-primary text-bg-primary text-xs font-bold"
              >
                {lang === 'vi' ? 'Đặt lại bộ lọc' : 'Reset Filters'}
              </button>
            </div>
          )}

          {/* Bottom Pagination Bar */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2 font-mono text-xs">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage(1)}
                className="px-2.5 py-1.5 rounded bg-bg-secondary border border-border-subtle text-text-secondary hover:text-text-primary disabled:opacity-35"
              >
                « First
              </button>
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded bg-bg-secondary border border-border-subtle text-text-secondary hover:text-text-primary disabled:opacity-35"
              >
                ‹ Prev
              </button>
              <span className="px-3.5 py-1.5 rounded bg-bg-elevated border border-border-gold text-accent-primary font-bold">
                {safePage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className="px-3 py-1.5 rounded bg-bg-secondary border border-border-subtle text-text-secondary hover:text-text-primary disabled:opacity-35"
              >
                Next ›
              </button>
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="px-2.5 py-1.5 rounded bg-bg-secondary border border-border-subtle text-text-secondary hover:text-text-primary disabled:opacity-35"
              >
                Last »
              </button>
            </div>
          )}
        </div>

        {/* RIGHT (5 cols): Sticky <ItemTooltip /> + Enchantment & Quality Matrix */}
        <div className="xl:col-span-5 xl:sticky xl:top-20 space-y-4">
          {/* Quick Enchantment (.0-.4) & Quality (1-5) Bar for Selected Item */}
          <div className="p-4 rounded-xl bg-bg-secondary border border-border-subtle space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xs uppercase tracking-wider text-accent-primary flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                {lang === 'vi'
                  ? 'Chỉnh Cường Hóa & Phẩm Chất'
                  : 'Enchantment & Quality Controls'}
              </span>
              <span className="text-[11px] font-mono text-text-muted">
                {selectedItem.unique_name}
              </span>
            </div>

            {/* Enchantment Matrix Row (.0 -> .4) */}
            <div className="flex items-center justify-between gap-2">
              {([0, 1, 2, 3, 4] as AlbionEnchantment[]).map((enc) => (
                <div key={enc} className="flex flex-col items-center gap-1">
                  <ItemSlot
                    baseIdentifier={selectedItem.base_identifier}
                    name={selectedItem.name_en}
                    tier={selectedItem.tier}
                    defaultTier={selectedItem.tier}
                    enchantment={enc}
                    quality={previewQuality}
                    size="sm"
                    selected={previewEnchant === enc}
                    onClick={() => setPreviewEnchant(enc)}
                  />
                  <span className="font-mono text-[10px] text-text-secondary">
                    .{enc}
                  </span>
                </div>
              ))}
            </div>

            {/* Quality Row (1 -> 5) */}
            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {([1, 2, 3, 4, 5] as AlbionQuality[]).map((q) => {
                const qMeta = QUALITY_METADATA[q];
                return (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setPreviewQuality(q)}
                    className={[
                      'py-1.5 rounded text-[11px] font-mono font-bold border transition-all',
                      previewQuality === q
                        ? 'bg-bg-elevated border-border-gold text-accent-primary shadow-rpg-gold'
                        : 'bg-bg-primary border-border-subtle text-text-secondary hover:text-text-primary',
                    ].join(' ')}
                  >
                    Q{q} (+{qMeta.ip_bonus})
                  </button>
                );
              })}
            </div>
          </div>

          <ItemTooltip
            item={selectedItem}
            tier={selectedItem.tier}
            enchantment={previewEnchant}
            quality={previewQuality}
            lang={lang}
          />
        </div>
      </div>
    </div>
  );
};

