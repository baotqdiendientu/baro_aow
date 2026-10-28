'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  AlbionEnchantment,
  AlbionItem,
  AlbionQuality,
  AlbionSlotType,
  AlbionTier,
  SpellSlotKey,
} from '@/types/albion';
import {
  BASE_ALBION_ITEMS,
  FULL_ALBION_DB,
  HydratedAlbionItem,
  getHydratedVariant,
  normalizeSearchText,
} from '@/services/albion-db';
import {
  calculateDynamicItemStats,
  getTierRoman,
} from '@/services/ao-api';
import { AppLanguage } from '@/i18n/translations';
import { ItemSlot } from './ItemSlot';
import { SpellSelector } from './SpellSelector';
import { ItemTooltip } from './ItemTooltip';
import { ItemConfigPopover } from './ItemConfigPopover';
import { MobileBottomSheet } from './MobileBottomSheet';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Coins,
  Copy,
  Eye,
  Lock,
  Search,
  Share2,
  Shield,
  Sliders,
  Sparkles,
  Swords,
  Upload,
  X,
} from 'lucide-react';

export interface EquippedSlotState {
  uniqueName: string; // e.g., T4_MAIN_1HCROSSBOW
  tier: AlbionTier;
  enchantment: AlbionEnchantment;
  quality: AlbionQuality;
  spells: Record<SpellSlotKey, string>;
}

export type LoadoutMap = Record<AlbionSlotType, EquippedSlotState | null>;

interface PresetLoadout {
  id: string;
  name_vi: string;
  name_en: string;
  tag_vi: string;
  tag_en: string;
  slots: Record<
    AlbionSlotType,
    {
      uniqueName: string;
      tier: AlbionTier;
      enchant: AlbionEnchantment;
      quality: AlbionQuality;
    } | null
  >;
}

const META_PRESETS: PresetLoadout[] = [
  {
    id: 'preset-light-crossbow-pve',
    name_vi: 'Light Crossbow + Cryptcandle (Dồn Sát Thương PvE / Mists)',
    name_en: 'Light Crossbow + Cryptcandle (Burst PvE / Mists)',
    tag_vi: '1H + Off-Hand Mở',
    tag_en: '1H + Off-Hand Active',
    slots: {
      Bag: { uniqueName: 'T6_BAG', tier: 6, enchant: 1, quality: 3 },
      Head: { uniqueName: 'T6_HEAD_CLOTH_ROYAL', tier: 6, enchant: 2, quality: 4 },
      Cape: { uniqueName: 'T6_CAPEITEM_FW_CAERLEON', tier: 6, enchant: 2, quality: 4 },
      MainHand: { uniqueName: 'T4_MAIN_1HCROSSBOW', tier: 6, enchant: 2, quality: 4 },
      Armor: { uniqueName: 'T6_ARMOR_CLOTH_SET2', tier: 6, enchant: 2, quality: 4 },
      OffHand: { uniqueName: 'T6_OFF_DEMONSKULL_HELL', tier: 6, enchant: 2, quality: 4 },
      Potion: { uniqueName: 'T6_POTION_HEAL', tier: 6, enchant: 1, quality: 1 },
      Shoes: { uniqueName: 'T6_SHOES_CLOTH_SET1', tier: 6, enchant: 2, quality: 4 },
      Food: { uniqueName: 'T8_MEAL_STEW', tier: 8, enchant: 1, quality: 1 },
      Mount: { uniqueName: 'T8_MOUNT_OWL_FW_BRECILIEN_ELITE', tier: 8, enchant: 0, quality: 4 },
    },
  },
  {
    id: 'preset-crystal-reaper-brawl',
    name_vi: 'Crystal Reaper 2H + Hellion Jacket (Small-Scale Brawl)',
    name_en: 'Crystal Reaper 2H + Hellion Jacket (Small-Scale Brawl)',
    tag_vi: '2H • Khóa Off-Hand',
    tag_en: '2H • Locks Off-Hand',
    slots: {
      Bag: { uniqueName: 'T6_BAG', tier: 6, enchant: 1, quality: 3 },
      Head: { uniqueName: 'T6_HEAD_LEATHER_MORGANA', tier: 7, enchant: 2, quality: 4 },
      Cape: { uniqueName: 'T6_CAPEITEM_FW_THETFORD', tier: 7, enchant: 2, quality: 4 },
      MainHand: { uniqueName: 'T6_2H_SCYTHE_CRYSTAL', tier: 7, enchant: 2, quality: 4 },
      Armor: { uniqueName: 'T6_ARMOR_LEATHER_HELL', tier: 7, enchant: 2, quality: 4 },
      OffHand: { uniqueName: 'T6_OFF_HORN_KEEPER', tier: 6, enchant: 1, quality: 3 },
      Potion: { uniqueName: 'T7_POTION_REVIVE', tier: 7, enchant: 1, quality: 1 },
      Shoes: { uniqueName: 'T6_SHOES_PLATE_SET2', tier: 7, enchant: 2, quality: 4 },
      Food: { uniqueName: 'T8_MEAL_STEW', tier: 8, enchant: 1, quality: 1 },
      Mount: { uniqueName: 'T8_MOUNT_OWL_FW_BRECILIEN_ELITE', tier: 8, enchant: 0, quality: 4 },
    },
  },
  {
    id: 'preset-druidic-avalon',
    name_vi: 'Druidic Staff 1H + Torch (Solo Boss Đường Cổ Đại Avalon)',
    name_en: 'Druidic Staff 1H + Torch (Solo Roads of Avalon)',
    tag_vi: '1H + Off-Hand Mở',
    tag_en: '1H + Off-Hand Active',
    slots: {
      Bag: { uniqueName: 'T6_BAG', tier: 6, enchant: 1, quality: 3 },
      Head: { uniqueName: 'T6_HEAD_LEATHER_MORGANA', tier: 6, enchant: 1, quality: 3 },
      Cape: { uniqueName: 'T6_CAPEITEM_FW_THETFORD', tier: 6, enchant: 1, quality: 3 },
      MainHand: { uniqueName: 'T5_MAIN_NATURESTAFF_KEEPER', tier: 6, enchant: 2, quality: 4 },
      Armor: { uniqueName: 'T6_ARMOR_LEATHER_SET3', tier: 6, enchant: 2, quality: 4 },
      OffHand: { uniqueName: 'T6_OFF_TORCH', tier: 6, enchant: 2, quality: 4 },
      Potion: { uniqueName: 'T6_POTION_HEAL', tier: 6, enchant: 1, quality: 1 },
      Shoes: { uniqueName: 'T6_SHOES_PLATE_SET2', tier: 6, enchant: 2, quality: 4 },
      Food: { uniqueName: 'T7_MEAL_OMELETTE', tier: 7, enchant: 1, quality: 1 },
      Mount: { uniqueName: 'T8_MOUNT_OWL_FW_BRECILIEN_ELITE', tier: 8, enchant: 0, quality: 4 },
    },
  },
  {
    id: 'preset-shadowcaller-static',
    name_vi: 'Shadowcaller 1H + Mistcaller (Solo Group & Static Dungeon)',
    name_en: 'Shadowcaller 1H + Mistcaller (Solo Group & Static PvE)',
    tag_vi: '1H + Off-Hand Mở',
    tag_en: '1H + Off-Hand Active',
    slots: {
      Bag: { uniqueName: 'T6_BAG', tier: 7, enchant: 1, quality: 4 },
      Head: { uniqueName: 'T6_HEAD_CLOTH_ROYAL', tier: 7, enchant: 3, quality: 4 },
      Cape: { uniqueName: 'T6_CAPEITEM_FW_THETFORD', tier: 7, enchant: 3, quality: 4 },
      MainHand: { uniqueName: 'T6_MAIN_CURSEDSTAFF_AVALON', tier: 7, enchant: 3, quality: 4 },
      Armor: { uniqueName: 'T6_ARMOR_LEATHER_HELL', tier: 7, enchant: 3, quality: 4 },
      OffHand: { uniqueName: 'T6_OFF_HORN_KEEPER', tier: 7, enchant: 3, quality: 4 },
      Potion: { uniqueName: 'T6_POTION_HEAL', tier: 6, enchant: 1, quality: 1 },
      Shoes: { uniqueName: 'T6_SHOES_CLOTH_SET1', tier: 7, enchant: 3, quality: 4 },
      Food: { uniqueName: 'T8_MEAL_STEW', tier: 8, enchant: 2, quality: 1 },
      Mount: { uniqueName: 'T8_MOUNT_OWL_FW_BRECILIEN_ELITE', tier: 8, enchant: 0, quality: 4 },
    },
  },
];

const SLOT_LABELS: Record<
  AlbionSlotType,
  { vi: string; en: string; short: string }
> = {
  Bag: { vi: 'Túi Đồ (Bag)', en: 'Bag', short: 'BAG' },
  Head: { vi: 'Mũ / Nón (Head)', en: 'Head', short: 'HEAD' },
  Cape: { vi: 'Áo Choàng (Cape)', en: 'Cape', short: 'CAPE' },
  MainHand: { vi: 'Vũ Khí Chính (MainHand)', en: 'Main-Hand', short: 'MAIN' },
  Armor: { vi: 'Áo Giáp (Armor)', en: 'Armor', short: 'ARMOR' },
  OffHand: { vi: 'Tay Phụ (OffHand)', en: 'Off-Hand', short: 'OFF' },
  Potion: { vi: 'Bình Thuốc (Potion)', en: 'Potion', short: 'POT' },
  Shoes: { vi: 'Giày (Shoes)', en: 'Shoes', short: 'SHOES' },
  Food: { vi: 'Thức Ăn (Food)', en: 'Food', short: 'FOOD' },
  Mount: { vi: 'Thú Cưỡi (Mount)', en: 'Mount', short: 'MOUNT' },
};

const PICKER_PAGE_SIZE = 12;

export interface LoadoutBuilderProps {
  lang: AppLanguage;
}

export const LoadoutBuilder: React.FC<LoadoutBuilderProps> = ({ lang }) => {
  const itemByUniqueMap = useMemo(() => {
    const map = new Map<string, HydratedAlbionItem>();
    for (const item of FULL_ALBION_DB) {
      map.set(item.unique_name.toUpperCase(), item);
    }
    return map;
  }, []);

  const buildLoadoutFromPreset = (preset: PresetLoadout): LoadoutMap => {
    const result = {} as LoadoutMap;
    (Object.keys(preset.slots) as AlbionSlotType[]).forEach((slotKey) => {
      const entry = preset.slots[slotKey];
      if (!entry) {
        result[slotKey] = null;
        return;
      }
      const found =
        itemByUniqueMap.get(entry.uniqueName.toUpperCase()) ||
        FULL_ALBION_DB.find((i) => i.slot_type === slotKey);
      if (!found) {
        result[slotKey] = null;
        return;
      }
      result[slotKey] = {
        uniqueName: found.unique_name,
        tier: entry.tier,
        enchantment: entry.enchant,
        quality: entry.quality,
        spells: { ...found.default_spells },
      };
    });
    return result;
  };

  const [activePresetId, setActivePresetId] = useState<string>(
    META_PRESETS[0].id
  );
  const [loadout, setLoadout] = useState<LoadoutMap>(() =>
    buildLoadoutFromPreset(META_PRESETS[0])
  );
  const [focusedSlot, setFocusedSlot] = useState<AlbionSlotType>('MainHand');
  const [copiedType, setCopiedType] = useState<'url' | 'json' | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [popoverItem, setPopoverItem] = useState<AlbionItem | null>(null);

  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  // Paginated Slot Equipment Picker states
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerTierFilter, setPickerTierFilter] = useState<'ALL' | AlbionTier>(
    6
  );
  const [pickerPage, setPickerPage] = useState(1);

  useEffect(() => {
    setPickerPage(1);
  }, [focusedSlot, pickerSearch, pickerTierFilter]);

  // Load build from URL query ?build=... if present on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const encodedBuild = params.get('build');
    if (encodedBuild) {
      try {
        const decoded = JSON.parse(atob(encodedBuild));
        if (decoded && decoded.MainHand) {
          setLoadout((prev) => ({ ...prev, ...decoded }));
        }
      } catch {
        // Ignore invalid query param
      }
    }
  }, []);

  // Determine if MainHand is a 2-Handed weapon (which locks OffHand)
  const mainHandState = loadout.MainHand;
  const mainHandItem = mainHandState
    ? itemByUniqueMap.get(mainHandState.uniqueName.toUpperCase())
    : undefined;
  const isTwoHandedEquipped =
    mainHandItem?.isTwoHanded || mainHandItem?.handedness === '2H';

  useEffect(() => {
    if (isTwoHandedEquipped && focusedSlot === 'OffHand') {
      setFocusedSlot('MainHand');
    }
  }, [isTwoHandedEquipped, focusedSlot]);

  // Calculate aggregate Average IP & Total Silver Cost
  const loadoutSummary = useMemo(() => {
    const combatSlots: AlbionSlotType[] = [
      'Head',
      'Armor',
      'Shoes',
      'Cape',
      'MainHand',
      'OffHand',
    ];
    let ipSum = 0;
    let ipCount = 0;
    let totalSilver = 0;

    (Object.keys(loadout) as AlbionSlotType[]).forEach((slotKey) => {
      if (slotKey === 'OffHand' && isTwoHandedEquipped) {
        if (mainHandItem && mainHandState) {
          const mhStats = calculateDynamicItemStats(
            mainHandItem,
            mainHandState.tier,
            mainHandState.enchantment,
            mainHandState.quality
          );
          ipSum += mhStats.totalIp;
          ipCount += 1;
        }
        return;
      }

      const st = loadout[slotKey];
      if (!st) return;
      const item = itemByUniqueMap.get(st.uniqueName.toUpperCase());
      if (!item) return;

      const dyn = calculateDynamicItemStats(
        item,
        st.tier,
        st.enchantment,
        st.quality
      );
      totalSilver += dyn.estimatedSilver;

      if (combatSlots.includes(slotKey)) {
        ipSum += dyn.totalIp;
        ipCount += 1;
      }
    });

    return {
      averageIp: ipCount > 0 ? Math.round(ipSum / ipCount) : 0,
      totalSilver,
    };
  }, [
    loadout,
    isTwoHandedEquipped,
    mainHandItem,
    mainHandState,
    itemByUniqueMap,
  ]);

  const focusedSlotState = loadout[focusedSlot];
  const rawFocusedItem = focusedSlotState
    ? itemByUniqueMap.get(focusedSlotState.uniqueName.toUpperCase())
    : undefined;

  const focusedItem = useMemo(() => {
    if (!rawFocusedItem || !focusedSlotState) return undefined;
    return getHydratedVariant(
      rawFocusedItem.base_identifier,
      focusedSlotState.tier,
      focusedSlotState.enchantment,
      focusedSlotState.quality
    );
  }, [rawFocusedItem, focusedSlotState]);

  // Filter candidate base items (~433 base items) for the focused slot
  const candidateItemsForFocusedSlot = useMemo(() => {
    const qNorm = normalizeSearchText(pickerSearch);
    return BASE_ALBION_ITEMS.filter((item) => {
      if (item.slot_type !== focusedSlot) return false;
      if (qNorm && !item.search_text.includes(qNorm)) return false;
      return true;
    });
  }, [focusedSlot, pickerSearch]);

  const totalPickerPages = Math.max(
    1,
    Math.ceil(candidateItemsForFocusedSlot.length / PICKER_PAGE_SIZE)
  );
  const safePickerPage = Math.min(pickerPage, totalPickerPages);
  const paginatedCandidates = useMemo(() => {
    const start = (safePickerPage - 1) * PICKER_PAGE_SIZE;
    return candidateItemsForFocusedSlot.slice(start, start + PICKER_PAGE_SIZE);
  }, [candidateItemsForFocusedSlot, safePickerPage]);

  const handleApplyPreset = (preset: PresetLoadout) => {
    setActivePresetId(preset.id);
    setLoadout(buildLoadoutFromPreset(preset));
    setFocusedSlot('MainHand');
  };

  const handleEquipItemInSlot = (slot: AlbionSlotType, newItem: AlbionItem) => {
    setLoadout((prev) => {
      return {
        ...prev,
        [slot]: {
          uniqueName: newItem.unique_name,
          tier: newItem.tier,
          enchantment: newItem.enchantment ?? 0,
          quality: newItem.quality ?? 1,
          spells: { ...newItem.default_spells },
        },
      };
    });
  };

  const handleUpdateSlotMeta = (
    slot: AlbionSlotType,
    patch: Partial<EquippedSlotState>
  ) => {
    setLoadout((prev) => {
      const current = prev[slot];
      if (!current) return prev;
      return {
        ...prev,
        [slot]: { ...current, ...patch },
      };
    });
  };

  const handleCopyShareUrl = () => {
    if (typeof window === 'undefined') return;
    const encoded = btoa(JSON.stringify(loadout));
    const url = `${window.location.origin}${window.location.pathname}?build=${encodeURIComponent(encoded)}`;
    navigator.clipboard.writeText(url);
    setCopiedType('url');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleCopyJson = () => {
    const json = JSON.stringify(loadout, null, 2);
    navigator.clipboard.writeText(json);
    setCopiedType('json');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      if (parsed && parsed.MainHand) {
        setLoadout((prev) => ({ ...prev, ...parsed }));
        setImportModalOpen(false);
        setImportJsonText('');
      }
    } catch {
      // Invalid JSON
    }
  };

  // Render a single paperdoll slot cell
  const renderPaperdollCell = (slotKey: AlbionSlotType) => {
    const isOffHandLocked = slotKey === 'OffHand' && isTwoHandedEquipped;
    const state = loadout[slotKey];
    const item = state
      ? itemByUniqueMap.get(state.uniqueName.toUpperCase())
      : undefined;
    const isFocused = focusedSlot === slotKey;
    const labelInfo = SLOT_LABELS[slotKey];

    const handleClick = () => {
      setFocusedSlot(slotKey);
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        if (state && item) {
          setMobileSheetOpen(true);
        }
      }
    };

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
          <span className="text-[9px] sm:text-[10px] font-mono uppercase text-red-400 flex items-center gap-0.5 sm:gap-1">
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
            disabled
          />
          <span className="text-[9px] sm:text-[10px] text-text-muted truncate max-w-[80px] sm:max-w-[96px] text-center">
            {lang === 'vi' ? 'Chiếm 2 tay' : '2H Occupied'}
          </span>
        </div>
      );
    }

    return (
      <div
        key={slotKey}
        onClick={handleClick}
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
    <div className="space-y-6 pb-24 lg:pb-6">
      {/* HEADER + PRESET BAR */}
      <div className="p-3 md:p-6 rounded-xl bg-bg-secondary border border-border-subtle space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-accent-primary/20 text-accent-primary border border-border-gold/40">
              PHASE 3 • 10-SLOT BUILDER ({FULL_ALBION_DB.length.toLocaleString('en-US')} ITEMS CONNECTED)
            </span>
            <h2 className="mt-2 font-display text-xl sm:text-2xl font-bold text-text-primary">
              {lang === 'vi'
                ? 'Công Cụ Lắp Build 10 Ô Chuẩn Albion Online'
                : 'Albion 10-Slot Tactical Loadout Builder'}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-text-secondary">
              {lang === 'vi'
                ? 'Kết nối trực tiếp 1,702 vật phẩm gốc từ ao-bin-dumps. Tự động nhận diện vũ khí 2 Tay (isTwoHanded: true → khóa ô Off-Hand) và 1 Tay (1H → mở ô Off-Hand).'
                : 'Connected to all 1,702 synced ao-bin-dumps items. Automatically enforces 2-Handed (locks Off-Hand) vs 1-Handed (unlocks Off-Hand) rules.'}
            </p>
          </div>

          {/* Share / Export Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyShareUrl}
              className="px-3 py-2 rounded-lg bg-accent-primary hover:bg-accent-primary/90 text-bg-primary font-sans font-bold text-xs flex items-center gap-1.5 transition-all shadow-rpg-gold"
            >
              {copiedType === 'url' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>
                    {lang === 'vi' ? 'Đã sao chép Link!' : 'Link Copied!'}
                  </span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>
                    {lang === 'vi' ? 'Chia sẻ Link Build' : 'Share Build URL'}
                  </span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCopyJson}
              className="px-3 py-2 rounded-lg bg-bg-primary hover:bg-bg-elevated text-text-primary border border-border-gold/50 text-xs font-mono flex items-center gap-1.5 transition-all"
            >
              {copiedType === 'json' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'vi' ? 'Đã chép JSON' : 'Copied JSON'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-accent-primary" />
                  <span>{lang === 'vi' ? 'Xuất JSON' : 'Export JSON'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setImportModalOpen(!importModalOpen)}
              className="px-3 py-2 rounded-lg bg-bg-primary hover:bg-bg-elevated text-text-secondary hover:text-text-primary border border-border-subtle text-xs font-mono flex items-center gap-1.5 transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'Nhập JSON' : 'Import JSON'}</span>
            </button>
          </div>
        </div>

        {/* Optional Import JSON Drawer */}
        {importModalOpen && (
          <div className="p-4 rounded-lg bg-bg-primary border border-border-gold/50 space-y-2">
            <label className="block text-xs font-mono text-text-secondary">
              {lang === 'vi'
                ? 'Dán mã JSON Build vào bên dưới:'
                : 'Paste Loadout JSON below:'}
            </label>
            <textarea
              rows={3}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder='{"MainHand": {"uniqueName": "T4_MAIN_1HCROSSBOW", ...}}'
              className="w-full p-2.5 rounded bg-bg-secondary border border-border-subtle text-xs font-mono text-text-primary focus:outline-none focus:border-border-gold"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setImportModalOpen(false)}
                className="px-3 py-1 rounded text-xs text-text-secondary hover:text-text-primary"
              >
                {lang === 'vi' ? 'Đóng' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleImportJson}
                className="px-3 py-1 rounded bg-accent-primary text-bg-primary text-xs font-bold"
              >
                {lang === 'vi' ? 'Áp dụng Build' : 'Apply Build'}
              </button>
            </div>
          </div>
        )}

        {/* Meta Preset Selector Pills */}
        <div className="pt-3 border-t border-border-subtle">
          <div className="text-xs font-medium text-text-secondary mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-accent-primary" />
            <span>
              {lang === 'vi'
                ? 'Chọn nhanh Cấu Hình Mẫu Chuẩn Meta (Preset Builds):'
                : 'Quick-Load Meta Preset Builds:'}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {META_PRESETS.map((preset) => {
              const isCurrent = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className={[
                    'p-3 rounded-lg border text-left transition-all flex flex-col justify-between gap-1.5',
                    isCurrent
                      ? 'bg-bg-elevated border-border-gold shadow-rpg-gold'
                      : 'bg-bg-primary/70 border-border-subtle hover:border-border-gold/40',
                  ].join(' ')}
                >
                  <span className="font-display font-bold text-xs text-text-primary leading-snug">
                    {lang === 'vi' ? preset.name_vi : preset.name_en}
                  </span>
                  <span className="inline-block self-start px-1.5 py-0.5 text-[10px] font-mono rounded bg-accent-primary/15 text-accent-primary border border-border-gold/30">
                    {lang === 'vi' ? preset.tag_vi : preset.tag_en}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN BUILDER WORKSPACE: 10-SLOT PAPERDOLL (LEFT) + PAGINATED SLOT PICKER & SPELL SELECTOR (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT (5 cols): 10-SLOT ALBION PAPERDOLL */}
        <div className="lg:col-span-5 p-3 md:p-6 rounded-xl bg-bg-secondary border border-border-subtle space-y-5">
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
                {loadoutSummary.averageIp}{' '}
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
              <div className="mt-0.5 font-mono text-lg sm:text-xl font-extrabold text-emerald-400">
                {loadoutSummary.totalSilver.toLocaleString('en-US')}
              </div>
            </div>
          </div>

          {/* 10-SLOT PAPERDOLL GRID (3 Centered Columns on Mobile) */}
          <div className="space-y-2.5 sm:space-y-3 max-w-[300px] sm:max-w-none mx-auto">
            {/* Row 1: Bag - Head - Cape */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {renderPaperdollCell('Bag')}
              {renderPaperdollCell('Head')}
              {renderPaperdollCell('Cape')}
            </div>

            {/* Row 2: MainHand - Armor - OffHand */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {renderPaperdollCell('MainHand')}
              {renderPaperdollCell('Armor')}
              {renderPaperdollCell('OffHand')}
            </div>

            {/* Row 3: Potion - Shoes - Food */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {renderPaperdollCell('Potion')}
              {renderPaperdollCell('Shoes')}
              {renderPaperdollCell('Food')}
            </div>

            {/* Row 4: Centered Mount Slot */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div />
              {renderPaperdollCell('Mount')}
              <div />
            </div>
          </div>

          {/* 1H vs 2H Status Explanation Banner */}
          <div
            className={[
              'p-3 rounded-lg border text-xs flex items-center gap-2.5',
              isTwoHandedEquipped
                ? 'bg-accent-crimson/15 border-accent-crimson/50 text-red-200'
                : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200',
            ].join(' ')}
          >
            <Shield className="w-4 h-4 shrink-0" />
            <span>
              {isTwoHandedEquipped
                ? lang === 'vi'
                  ? `Đang cầm vũ khí 2 Tay (${mainHandItem?.name_vi}): Ô Tay Phụ (Off-Hand) tự động bị khóa và nhận 100% IP từ vũ khí chính.`
                  : `2-Handed weapon equipped (${mainHandItem?.name_en}): Off-Hand slot is automatically locked and mirrors Main-Hand IP.`
                : lang === 'vi'
                  ? `Đang cầm vũ khí 1 Tay (${mainHandItem?.name_vi}): Cho phép lắp kèm Tay Phụ (Mistcaller, Cryptcandle, Torch) ở ô Off-Hand.`
                  : `1-Handed weapon equipped (${mainHandItem?.name_en}): Off-Hand slot is unlocked for Mistcaller, Cryptcandle, or Torch.`}
            </span>
          </div>
        </div>

        {/* RIGHT (7 cols): PAGINATED SLOT EQUIPMENT PICKER + <SpellSelector /> + <ItemTooltip /> */}
        <div className="lg:col-span-7 space-y-5">
          {/* Paginated Slot Item Swapper & Tier/Enchant/Quality Controls */}
          <div className="p-3 md:p-6 rounded-xl bg-bg-secondary border border-border-subtle space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-accent-primary" />
                <h3 className="font-display font-bold text-sm sm:text-base text-text-primary">
                  {lang === 'vi'
                    ? `Đang chỉnh ô: ${SLOT_LABELS[focusedSlot].vi}`
                    : `Editing Slot: ${SLOT_LABELS[focusedSlot].en}`}
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
                        onClick={() =>
                          handleUpdateSlotMeta(focusedSlot, { tier: tNum })
                        }
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
                          handleUpdateSlotMeta(focusedSlot, {
                            enchantment: enc,
                          })
                        }
                        className={[
                          'px-2 py-0.5 rounded text-xs font-mono font-bold transition-all',
                          focusedSlotState.enchantment === enc
                            ? 'bg-emerald-500 text-bg-primary'
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
                      onClick={() => setPopoverItem(focusedItem)}
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
                  onChange={(e) => setPickerSearch(e.target.value)}
                  placeholder={
                    lang === 'vi'
                      ? `Tìm trong ${candidateItemsForFocusedSlot.length} món ô ${SLOT_LABELS[focusedSlot].short}...`
                      : `Search ${candidateItemsForFocusedSlot.length} items for ${SLOT_LABELS[focusedSlot].short}...`
                  }
                  className="w-full bg-transparent text-xs text-text-primary placeholder:text-text-muted focus:outline-none"
                />
                {pickerSearch && (
                  <button
                    type="button"
                    onClick={() => setPickerSearch('')}
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
                  onClick={() => setPickerTierFilter('ALL')}
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
                    onClick={() => setPickerTierFilter(tNum)}
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
                    onClick={() => setPopoverItem(cand)}
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
                          {lang === 'vi' ? cand.sub_category_vi : cand.sub_category_en}
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-bg-secondary text-text-muted border border-border-subtle text-[9px] group-hover:text-accent-primary group-hover:border-border-gold/40 shrink-0">
                          T4–T8
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Picker Pagination Controls */}
            {totalPickerPages > 1 && (
              <div className="flex items-center justify-between pt-2 border-t border-border-subtle text-xs font-mono">
                <span className="text-text-muted">
                  {lang === 'vi'
                    ? `Trang ${safePickerPage}/${totalPickerPages} (${candidateItemsForFocusedSlot.length} món)`
                    : `Page ${safePickerPage}/${totalPickerPages} (${candidateItemsForFocusedSlot.length} items)`}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={safePickerPage <= 1}
                    onClick={() => setPickerPage((p) => Math.max(1, p - 1))}
                    className="p-1 rounded bg-bg-primary border border-border-subtle text-text-secondary hover:text-text-primary disabled:opacity-35"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={safePickerPage >= totalPickerPages}
                    onClick={() =>
                      setPickerPage((p) => Math.min(totalPickerPages, p + 1))
                    }
                    className="p-1 rounded bg-bg-primary border border-border-subtle text-text-secondary hover:text-text-primary disabled:opacity-35"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* <SpellSelector /> for Focused Item */}
          {focusedItem && focusedSlotState && (
            <SpellSelector
              item={focusedItem}
              selectedSpells={focusedSlotState.spells}
              onChangeSpell={(slotKey, spellId) => {
                handleUpdateSlotMeta(focusedSlot, {
                  spells: {
                    ...focusedSlotState.spells,
                    [slotKey]: spellId,
                  },
                });
              }}
              lang={lang}
            />
          )}

          {/* Full <ItemTooltip /> for Focused Item */}
          {focusedItem && focusedSlotState && (
            <ItemTooltip
              item={focusedItem}
              tier={focusedSlotState.tier}
              enchantment={focusedSlotState.enchantment}
              quality={focusedSlotState.quality}
              compact
              lang={lang}
            />
          )}
        </div>
      </div>

      {/* Item Configuration Popover Modal */}
      <ItemConfigPopover
        isOpen={Boolean(popoverItem)}
        item={popoverItem || BASE_ALBION_ITEMS[0]}
        onClose={() => setPopoverItem(null)}
        onConfirm={(configured) => {
          handleEquipItemInSlot(focusedSlot, configured);
          setPopoverItem(null);
        }}
        initialTier={focusedSlotState?.tier ?? 6}
        initialEnchantment={focusedSlotState?.enchantment ?? 0}
        initialQuality={focusedSlotState?.quality ?? 1}
        lang={lang}
        mode="equip"
      />

      {/* Mobile Bottom Sheet for Equiped Item Details on Mobile (< 768px) */}
      <MobileBottomSheet
        isOpen={mobileSheetOpen}
        onClose={() => setMobileSheetOpen(false)}
        title={
          focusedItem
            ? lang === 'vi'
              ? `${SLOT_LABELS[focusedSlot].vi}: ${focusedItem.name_vi}`
              : `${SLOT_LABELS[focusedSlot].en}: ${focusedItem.name_en}`
            : undefined
        }
      >
        {focusedItem && focusedSlotState && (
          <div className="space-y-4">
            <ItemTooltip
              item={focusedItem}
              tier={focusedSlotState.tier}
              enchantment={focusedSlotState.enchantment}
              quality={focusedSlotState.quality}
              compact
              lang={lang}
            />
            <SpellSelector
              item={focusedItem}
              selectedSpells={focusedSlotState.spells}
              onChangeSpell={(slotKey, spellId) => {
                handleUpdateSlotMeta(focusedSlot, {
                  spells: {
                    ...focusedSlotState.spells,
                    [slotKey]: spellId,
                  },
                });
              }}
              lang={lang}
            />
            <button
              type="button"
              onClick={() => {
                setMobileSheetOpen(false);
                setPopoverItem(focusedItem);
              }}
              className="w-full py-2.5 rounded-lg bg-accent-primary text-bg-primary font-bold text-xs flex items-center justify-center gap-1.5 shadow-rpg-gold"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>
                {lang === 'vi'
                  ? 'Tùy Chỉnh Tier / Enchant / Quality'
                  : 'Configure Tier / Enchant / Quality'}
              </span>
            </button>
          </div>
        )}
      </MobileBottomSheet>
    </div>
  );
};
