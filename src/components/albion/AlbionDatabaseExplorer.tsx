'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  BASE_ALBION_ITEMS,
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
  DESTINY_TREES,
  DestinyFamily,
  DestinyMainTreeId,
} from '@/data/destiny-board-data';
import { EXACT_SIGNATURE_SKILLS } from '@/data/albion-signature-skills';
import {
  QUALITY_METADATA,
  buildUniqueName,
  calculateDynamicItemStats,
  getTierRoman,
} from '@/services/ao-api';
import { AppLanguage } from '@/i18n/translations';
import { ItemSlot } from './ItemSlot';
import { ItemTooltip } from './ItemTooltip';
import { ItemConfigPopover } from './ItemConfigPopover';
import { MobileBottomSheet } from './MobileBottomSheet';
import { WeaponPlaybook } from './WeaponPlaybook';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Compass,
  Crosshair,
  Database,
  Layers,
  RotateCcw,
  Search,
  Shield,
  Sliders,
  Sparkles,
  Swords,
  Wand2,
  X,
  Zap,
} from 'lucide-react';

const ITEMS_PER_PAGE = 48;

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
  const [previewTier, setPreviewTier] = useState<AlbionTier>(
    externalTier || defaultItem.tier
  );
  const [previewEnchant, setPreviewEnchant] = useState<AlbionEnchantment>(
    externalEnchant !== undefined ? externalEnchant : 0
  );
  const [previewQuality, setPreviewQuality] = useState<AlbionQuality>(3);

  // Unified Destiny Board Navigation States (Consolidated 1 Table)
  const [activeMainTree, setActiveMainTree] = useState<
    'ALL' | DestinyMainTreeId
  >('warrior');
  const [activeFamilyId, setActiveFamilyId] = useState<string>('axe');

  // Multi-Filter & Search States
  const [searchInput, setSearchInput] = useState('');
  const [slotFilter, setSlotFilter] = useState<'ALL' | AlbionSlotType>('ALL');
  const [tierFilter, setTierFilter] = useState<'ALL' | AlbionTier>('ALL');
  const [handFilter, setHandFilter] = useState<'ALL' | '1H' | '2H'>('ALL');
  const [groupByBase, setGroupByBase] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Inspector / Popover States
  const [popoverItem, setPopoverItem] = useState<HydratedAlbionItem | null>(null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [inspectorTab, setInspectorTab] = useState<'stats' | 'playbook'>('stats');

  // Sync when global search bar selects an item
  useEffect(() => {
    if (externalSelectedItem) {
      setSelectedItem(externalSelectedItem);
      setPreviewTier(externalTier || externalSelectedItem.tier);
      if (externalEnchant !== undefined) {
        setPreviewEnchant(externalEnchant);
      }
    }
  }, [externalSelectedItem, externalTier, externalEnchant]);

  // When switching tree, set default family
  const handleSelectTree = (treeId: 'ALL' | DestinyMainTreeId) => {
    setActiveMainTree(treeId);
    if (treeId === 'ALL') {
      setActiveFamilyId('ALL');
    } else {
      const fams = DESTINY_TREES[treeId].families;
      setActiveFamilyId(fams[0]?.id || 'ALL');
    }
    setSearchInput('');
    setCurrentPage(1);
  };

  // Reset pagination to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchInput,
    activeMainTree,
    activeFamilyId,
    slotFilter,
    tierFilter,
    handFilter,
    groupByBase,
  ]);

  // Unified Filter + Destiny Board Hierarchy + Search Logic
  const filteredItems = useMemo(() => {
    const qNorm = normalizeSearchText(searchInput);
    const source = groupByBase ? BASE_ALBION_ITEMS : FULL_ALBION_DB;

    // Resolve allowed base IDs from Destiny Board selection
    let allowedBaseIds: Set<string> | null = null;
    if (activeMainTree !== 'ALL') {
      const tree = DESTINY_TREES[activeMainTree];
      if (activeFamilyId !== 'ALL') {
        const fam = tree.families.find((f) => f.id === activeFamilyId);
        if (fam) {
          allowedBaseIds = new Set(fam.baseIds.map((id) => id.toUpperCase()));
        }
      } else {
        const allIds: string[] = [];
        tree.families.forEach((f) => allIds.push(...f.baseIds));
        allowedBaseIds = new Set(allIds.map((id) => id.toUpperCase()));
      }
    }

    return source.filter((item) => {
      // 1. If text search is active, match search tokens across entire DB or current tree
      if (qNorm) {
        const tokens = qNorm.split(/\s+/).filter(Boolean);
        for (const tk of tokens) {
          if (!groupByBase && /^t[1-8]$/.test(tk)) {
            const tNum = Number(tk.slice(1));
            if (item.tier !== tNum) return false;
            continue;
          }
          if (!item.search_text.includes(tk)) return false;
        }
        return true;
      }

      // 2. Destiny Board branch matching
      if (allowedBaseIds && !allowedBaseIds.has(item.base_identifier.toUpperCase())) {
        return false;
      }

      // 3. Slot Filter (when activeMainTree is ALL or general browsing)
      if (slotFilter !== 'ALL' && item.slot_type !== slotFilter) return false;
      if (!groupByBase && tierFilter !== 'ALL' && item.tier !== tierFilter) return false;
      if (handFilter !== 'ALL' && item.handedness !== handFilter) return false;

      return true;
    });
  }, [
    searchInput,
    activeMainTree,
    activeFamilyId,
    slotFilter,
    tierFilter,
    handFilter,
    groupByBase,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, safePage]);

  // Current Tree & Family Meta
  const currentTreeMeta = activeMainTree !== 'ALL' ? DESTINY_TREES[activeMainTree] : null;
  const currentFamilies: DestinyFamily[] = currentTreeMeta ? currentTreeMeta.families : [];
  const currentFamilyMeta = currentFamilies.find((f) => f.id === activeFamilyId);

  const treeIcons: Record<DestinyMainTreeId, React.ReactNode> = {
    warrior: <Swords className="w-4 h-4 text-red-400" />,
    hunter: <Crosshair className="w-4 h-4 text-emerald-400" />,
    mage: <Wand2 className="w-4 h-4 text-sky-400" />,
    plate: <Shield className="w-4 h-4 text-slate-300" />,
    leather: <Layers className="w-4 h-4 text-amber-500" />,
    cloth: <Sparkles className="w-4 h-4 text-purple-400" />,
    accessory: <Compass className="w-4 h-4 text-yellow-400" />,
  };

  const handleResetFilters = () => {
    setActiveMainTree('warrior');
    setActiveFamilyId('axe');
    setSearchInput('');
    setSlotFilter('ALL');
    setTierFilter('ALL');
    setHandFilter('ALL');
    setGroupByBase(true);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* DATABASE HEADER & SUMMARY BANNER */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-bg-secondary via-bg-elevated to-bg-secondary border-2 border-border-gold/50 shadow-rpg-gold flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-accent-primary/20 text-accent-primary border border-border-gold/40 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" />
              DESTINY BOARD MASTER ARMORY
            </span>
            <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              {BASE_ALBION_ITEMS.length} Base Weapons & Gear ({FULL_ALBION_DB.length.toLocaleString('en-US')} Variants)
            </span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-text-primary">
            {lang === 'vi'
              ? 'Bảng Định Mệnh & Kho Dữ Liệu Vũ Khí Albion Online'
              : 'Destiny Board Master Encyclopedia & Armory'}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-text-secondary">
            {lang === 'vi'
              ? 'Toàn bộ vật phẩm đã được quy hoạch thành 1 Bảng Duy Nhất theo 3 cấp Destiny Board. Chọn nhánh để xem 8 vũ khí đại diện, click bất kỳ món nào để xem thông số và mẹo khắc chế mà không bị lỗi popup.'
              : 'Unified into a single master board matching Albion’s Destiny Board hierarchy. Click any weapon to inspect live stats and counterplay without popup interruptions.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 font-mono text-xs bg-bg-primary/90 px-4 py-3 rounded-xl border border-border-gold/40">
          <div>
            <div className="text-[10px] text-text-muted uppercase">
              {lang === 'vi' ? 'Số lượng hiển thị' : 'Matching Items'}
            </div>
            <div className="text-xl font-extrabold text-accent-primary">
              {filteredItems.length.toLocaleString('en-US')}{' '}
              <span className="text-xs font-normal text-text-secondary">
                / {BASE_ALBION_ITEMS.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* UNIFIED DESTINY BOARD NAVIGATOR: CẤP 1 (TREES) & CẤP 2 (FAMILIES)    */}
      {/* ==================================================================== */}
      <div className="rounded-2xl bg-bg-surface border-2 border-border-gold/50 shadow-rpg-gold overflow-hidden">
        {/* CẤP 1: MAIN TREE TABS (WARRIOR, HUNTER, MAGE, ARMORS, ALL) */}
        <div className="p-3.5 bg-gradient-to-r from-bg-elevated via-bg-secondary to-bg-elevated border-b border-border-gold/40">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-accent-primary" />
              <span className="font-display font-bold text-xs uppercase tracking-wider text-accent-primary">
                {lang === 'vi'
                  ? 'Cấp 1 • Phân Nhánh Destiny Board (Bảng Định Mệnh)'
                  : 'Level 1 • Destiny Board Main Trees'}
              </span>
            </div>
            <span className="text-[11px] font-mono text-text-muted hidden sm:inline-block">
              {lang === 'vi'
                ? 'Hệ thống vũ khí 3 cấp chuẩn Albion Online'
                : 'Official Albion 3-Level Hierarchy'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5">
            {/* All Items Tab */}
            <button
              type="button"
              onClick={() => handleSelectTree('ALL')}
              className={[
                'py-2 px-2 rounded-xl text-xs font-display font-bold transition-all flex items-center justify-center gap-1.5 border',
                activeMainTree === 'ALL'
                  ? 'bg-accent-primary text-bg-primary border-border-gold shadow-rpg-gold'
                  : 'bg-bg-primary/70 text-text-secondary border-border-subtle hover:text-text-primary hover:border-border-gold/40',
              ].join(' ')}
            >
              <Database className="w-4 h-4" />
              <span>{lang === 'vi' ? 'Tất Cả' : 'All Items'}</span>
            </button>

            {/* Tree Tabs */}
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
        {currentFamilies.length > 0 && (
          <div className="px-4 py-3 bg-bg-secondary/70 border-b border-border-subtle flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold text-text-muted mr-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-accent-primary" />
              {lang === 'vi' ? 'Dòng Vũ Khí / Giáp:' : 'Family Node:'}
            </span>

            {/* All in Tree Option */}
            <button
              type="button"
              onClick={() => setActiveFamilyId('ALL')}
              className={[
                'px-3 py-1.5 rounded-lg text-xs font-display font-bold transition-all flex items-center gap-1.5 border',
                activeFamilyId === 'ALL'
                  ? 'bg-accent-primary text-bg-primary border-border-gold shadow-rpg-gold'
                  : 'bg-bg-primary/80 text-text-secondary border-border-subtle hover:border-border-gold/50 hover:text-text-primary',
              ].join(' ')}
            >
              <span>{lang === 'vi' ? 'Tất cả dòng' : 'All Families'}</span>
            </button>

            {currentFamilies.map((fam) => {
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
        )}

        {/* INTEGRATED INSTANT SEARCH & QUICK FILTER ROW */}
        <div className="p-4 bg-bg-primary/60 border-b border-border-subtle grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          {/* Diacritic-free Search Input */}
          <div className="lg:col-span-5 relative flex items-center bg-bg-secondary border border-border-subtle focus-within:border-border-gold rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-accent-primary shrink-0 mr-2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={
                lang === 'vi'
                  ? 'Tìm nhanh không dấu: "crossbow", "luoi hai", "reaper", "owl", "hellion"...'
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

          {/* Tier Filter Pills */}
          <div className="lg:col-span-3 flex items-center gap-1 bg-bg-secondary p-1 rounded-lg border border-border-subtle font-mono text-xs overflow-x-auto">
            <span className="text-[10px] text-text-muted px-1">Tier:</span>
            {(['ALL', 4, 5, 6, 7, 8] as ('ALL' | AlbionTier)[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTierFilter(t)}
                className={[
                  'px-2 py-0.5 rounded font-bold transition-all',
                  tierFilter === t
                    ? 'bg-accent-primary text-bg-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary',
                ].join(' ')}
              >
                {t === 'ALL' ? 'ALL' : `T${t}`}
              </button>
            ))}
          </div>

          {/* 1H / 2H Handedness Filter */}
          <div className="lg:col-span-2 flex items-center gap-1 bg-bg-secondary p-1 rounded-lg border border-border-subtle font-mono text-xs">
            {(['ALL', '1H', '2H'] as const).map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setHandFilter(h)}
                className={[
                  'flex-1 py-1 rounded text-center font-bold transition-all',
                  handFilter === h
                    ? 'bg-accent-primary text-bg-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary',
                ].join(' ')}
              >
                {h}
              </button>
            ))}
          </div>

          {/* Group Base vs All Tiers Toggle */}
          <div className="lg:col-span-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setGroupByBase(!groupByBase)}
              className={[
                'w-full py-1.5 px-3 rounded-lg border text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all',
                groupByBase
                  ? 'bg-accent-primary/20 text-accent-primary border-border-gold/50 shadow-sm'
                  : 'bg-bg-secondary text-text-secondary border-border-subtle hover:text-text-primary',
              ].join(' ')}
            >
              <span>{groupByBase ? 'Gom Base (8 Vũ Khí)' : 'Tất cả Tier'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* MAIN SINGLE UNIFIED WORKSPACE: ITEM GRID (LEFT) + INSPECTOR (RIGHT) */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT (7 cols): UNIFIED ITEM GRID */}
        <div className="xl:col-span-7 space-y-4">
          {/* Active Branch Header */}
          <div className="p-3.5 rounded-xl bg-bg-secondary border border-border-subtle flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{
                  backgroundColor: currentTreeMeta ? currentTreeMeta.color : '#C8AA6E',
                }}
              />
              <h3 className="font-display font-bold text-sm sm:text-base text-text-primary">
                {currentTreeMeta
                  ? `${lang === 'vi' ? currentTreeMeta.name_vi : currentTreeMeta.name_en} > ${
                      currentFamilyMeta
                        ? lang === 'vi'
                          ? currentFamilyMeta.name_vi
                          : currentFamilyMeta.name_en
                        : lang === 'vi'
                          ? 'Tất cả dòng'
                          : 'All Families'
                    }`
                  : lang === 'vi'
                    ? 'Toàn bộ kho vũ khí & trang bị'
                    : 'All Weapons & Equipment'}
              </h3>
              <span className="text-xs font-mono text-accent-primary font-bold">
                ({filteredItems.length} {groupByBase ? 'Base Items' : 'Items'})
              </span>
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              title={lang === 'vi' ? 'Đặt lại bộ lọc' : 'Reset filters'}
              className="text-xs font-mono text-text-muted hover:text-accent-primary flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'Đặt lại' : 'Reset'}</span>
            </button>
          </div>

          {/* Unified Cards Grid */}
          {paginatedItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {paginatedItems.map((item, idx) => {
                const isSelected =
                  selectedItem.base_identifier.toUpperCase() ===
                  item.base_identifier.toUpperCase();
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
                const sig =
                  EXACT_SIGNATURE_SKILLS[item.base_identifier.toUpperCase()];

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedItem(item);
                      setPreviewTier(item.tier);
                      // On mobile/tablet, open bottom sheet immediately without popup error
                      if (typeof window !== 'undefined' && window.innerWidth < 1280) {
                        setMobileDetailOpen(true);
                      }
                    }}
                    className={[
                      'group relative p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between overflow-hidden',
                      isSelected
                        ? 'bg-bg-elevated border-border-gold shadow-rpg-gold ring-2 ring-accent-primary/60 scale-[1.02]'
                        : 'bg-bg-primary/80 border-border-subtle hover:border-border-gold/60 hover:bg-bg-elevated/70 hover:shadow-rpg-gold',
                    ].join(' ')}
                  >
                    {/* Top Badge Row */}
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {item.handedness !== 'NONE' ? item.handedness : 'GEAR'}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-accent-primary">
                        {dyn.totalIp} IP
                      </span>
                    </div>

                    {/* Central Icon Preview with authentic ItemSlot */}
                    <div className="flex items-center justify-center py-2 group-hover:scale-105 transition-transform">
                      <ItemSlot
                        baseIdentifier={item.base_identifier}
                        name={item.name_en}
                        tier={item.tier}
                        defaultTier={item.tier}
                        enchantment={previewEnchant}
                        quality={previewQuality}
                        handedness={item.handedness}
                        size="md"
                        priority={idx < 8}
                        selected={isSelected}
                      />
                    </div>

                    {/* Item Details */}
                    <div className="mt-1 space-y-1 text-center">
                      <h4 className="font-display font-bold text-xs sm:text-sm text-text-primary group-hover:text-accent-primary transition-colors line-clamp-1">
                        {lang === 'vi' ? item.name_vi : item.name_en}
                      </h4>
                      <p className="text-[10px] text-text-muted font-mono truncate">
                        {lang === 'vi' ? item.sub_category_vi : item.sub_category_en}
                      </p>

                      {/* Signature Skill Pill */}
                      {sig && (
                        <div className="pt-1 flex items-center justify-center">
                          <span className="px-2 py-0.5 text-[9px] font-mono font-semibold rounded bg-bg-secondary text-accent-light border border-border-subtle group-hover:border-border-gold/40 flex items-center gap-1 truncate max-w-full">
                            <Zap className="w-2.5 h-2.5 text-accent-primary shrink-0" />
                            <span className="truncate">
                              E: {lang === 'vi' ? sig.name_vi : sig.name_en}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-2.5 pt-2 border-t border-border-subtle flex items-center justify-between text-[11px] text-text-secondary">
                      <span className="font-mono text-[10px] text-text-muted truncate max-w-[85px]">
                        {resolvedCode}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPopoverItem(item);
                        }}
                        title={lang === 'vi' ? 'Tùy chỉnh Cấp/Phẩm chất' : 'Configure Tier/Quality'}
                        className="px-1.5 py-0.5 rounded bg-bg-secondary hover:bg-accent-primary/20 hover:text-accent-primary border border-border-subtle text-[10px] font-mono flex items-center gap-1 transition-colors"
                      >
                        <Sliders className="w-2.5 h-2.5 text-accent-primary" />
                        <span>T4-T8</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-10 rounded-2xl bg-bg-secondary border border-border-subtle text-center space-y-3">
              <p className="text-sm text-text-secondary">
                {lang === 'vi'
                  ? `Không tìm thấy vật phẩm nào khớp với bộ lọc "${searchInput || activeMainTree}".`
                  : `No items found matching filter "${searchInput || activeMainTree}".`}
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-accent-primary text-bg-primary text-xs font-bold shadow-rpg-gold"
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
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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

        {/* RIGHT (5 cols): STICKY LIVE INSPECTOR PANEL (NO POPUP REQUIRED) */}
        <div className="xl:col-span-5 xl:sticky xl:top-20 space-y-4">
          {/* Quick Modifier Card: Enchantment (.0-.4) & Quality (Q1-Q5) */}
          <div className="p-4 rounded-xl bg-bg-secondary border border-border-subtle space-y-3 shadow-rpg-gold">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xs uppercase tracking-wider text-accent-primary flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                {lang === 'vi'
                  ? 'Chỉnh Cường Hóa & Phẩm Chất'
                  : 'Enchantment & Quality'}
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

            {/* Quick Action Links: Tùy Chỉnh Nâng Cao & Trang Chi Tiết */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setPopoverItem(selectedItem)}
                className="py-2 px-3 rounded-lg text-xs font-display font-bold uppercase tracking-wider bg-accent-primary/20 hover:bg-accent-primary/30 text-accent-primary border border-border-gold/50 flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'vi' ? 'Tùy Chỉnh Sâu' : 'Deep Config'}</span>
              </button>
              <Link
                href={`/item/${selectedItem.unique_name}`}
                className="py-2 px-3 rounded-lg text-xs font-display font-bold uppercase tracking-wider bg-bg-primary hover:bg-bg-elevated text-text-primary border border-border-subtle hover:border-border-gold/50 flex items-center justify-center gap-1.5 transition-all"
              >
                <BookOpen className="w-3.5 h-3.5 text-accent-primary" />
                <span>{lang === 'vi' ? 'Trang Chi Tiết' : 'Full Page'}</span>
              </Link>
            </div>
          </div>

          {/* Inspector Sub-Tabs: Stats & Spells vs Weapon Playbook */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-bg-secondary border border-border-subtle">
            <button
              type="button"
              onClick={() => setInspectorTab('stats')}
              className={[
                'flex-1 py-2 px-3 rounded-lg font-display font-bold text-xs flex items-center justify-center gap-1.5 transition-all',
                inspectorTab === 'stats'
                  ? 'bg-accent-primary text-bg-primary shadow-rpg-gold'
                  : 'text-text-secondary hover:text-text-primary',
              ].join(' ')}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'Chỉ Số & Kỹ Năng' : 'Stats & Spells'}</span>
            </button>
            <button
              type="button"
              onClick={() => setInspectorTab('playbook')}
              className={[
                'flex-1 py-2 px-3 rounded-lg font-display font-bold text-xs flex items-center justify-center gap-1.5 transition-all',
                inspectorTab === 'playbook'
                  ? 'bg-accent-primary text-bg-primary shadow-rpg-gold'
                  : 'text-text-secondary hover:text-text-primary',
              ].join(' ')}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'Mẹo & Khắc Chế' : 'Playbook & Tips'}</span>
            </button>
          </div>

          {/* Inspector Body */}
          {inspectorTab === 'stats' ? (
            <ItemTooltip
              item={selectedItem}
              tier={previewTier}
              enchantment={previewEnchant}
              quality={previewQuality}
              lang={lang}
            />
          ) : (
            <WeaponPlaybook item={selectedItem} lang={lang} />
          )}
        </div>
      </div>

      {/* Optional Item Configuration Popover Modal (Only opens when user explicitly clicks "Tùy Chỉnh") */}
      <ItemConfigPopover
        isOpen={Boolean(popoverItem)}
        item={popoverItem || selectedItem}
        onClose={() => setPopoverItem(null)}
        onInspect={(configured) => {
          setSelectedItem(configured);
          setPreviewTier(configured.tier);
          setPreviewEnchant(configured.enchantment);
          setPreviewQuality(configured.quality);
        }}
        initialTier={previewTier}
        initialEnchantment={previewEnchant}
        initialQuality={previewQuality}
        lang={lang}
        mode="inspect"
      />

      {/* Mobile Bottom Sheet (< 1280px) for Item Details (Swipeable, No Popup Error) */}
      <MobileBottomSheet
        isOpen={mobileDetailOpen}
        onClose={() => setMobileDetailOpen(false)}
        title={lang === 'vi' ? selectedItem.name_vi : selectedItem.name_en}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-bg-secondary border border-border-subtle">
            <button
              type="button"
              onClick={() => setInspectorTab('stats')}
              className={[
                'flex-1 py-1.5 px-2 rounded-lg font-display font-bold text-xs',
                inspectorTab === 'stats'
                  ? 'bg-accent-primary text-bg-primary'
                  : 'text-text-secondary',
              ].join(' ')}
            >
              {lang === 'vi' ? 'Chỉ Số & Kỹ Năng' : 'Stats & Spells'}
            </button>
            <button
              type="button"
              onClick={() => setInspectorTab('playbook')}
              className={[
                'flex-1 py-1.5 px-2 rounded-lg font-display font-bold text-xs',
                inspectorTab === 'playbook'
                  ? 'bg-accent-primary text-bg-primary'
                  : 'text-text-secondary',
              ].join(' ')}
            >
              {lang === 'vi' ? 'Mẹo & Khắc Chế' : 'Playbook & Tips'}
            </button>
          </div>

          {inspectorTab === 'stats' ? (
            <ItemTooltip
              item={selectedItem}
              tier={previewTier}
              enchantment={previewEnchant}
              quality={previewQuality}
              lang={lang}
            />
          ) : (
            <WeaponPlaybook item={selectedItem} lang={lang} />
          )}

          <button
            type="button"
            onClick={() => {
              setMobileDetailOpen(false);
              setPopoverItem(selectedItem);
            }}
            className="w-full py-2.5 rounded-lg bg-accent-primary text-bg-primary font-bold text-xs flex items-center justify-center gap-1.5 shadow-rpg-gold"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>
              {lang === 'vi'
                ? 'Tùy Chỉnh Tier / Phù Phép / Phẩm Chất'
                : 'Configure Tier / Enchant / Quality'}
            </span>
          </button>
        </div>
      </MobileBottomSheet>
    </div>
  );
};
