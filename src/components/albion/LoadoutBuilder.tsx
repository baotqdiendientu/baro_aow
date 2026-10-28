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
import { calculateDynamicItemStats } from '@/services/ao-api';
import { AppLanguage } from '@/i18n/translations';
import { SpellSelector } from './SpellSelector';
import { ItemTooltip } from './ItemTooltip';
import { ItemConfigPopover } from './ItemConfigPopover';
import { MobileBottomSheet } from './MobileBottomSheet';
import { PaperdollGrid } from './loadout/PaperdollGrid';
import {
  PresetAndShareModal,
  PresetLoadout,
} from './loadout/PresetAndShareModal';
import { SlotEquipmentPicker } from './loadout/SlotEquipmentPicker';
import { Shield } from 'lucide-react';

export interface EquippedSlotState {
  uniqueName: string;
  tier: AlbionTier;
  enchantment: AlbionEnchantment;
  quality: AlbionQuality;
  spells: Record<SpellSlotKey, string>;
}

export type LoadoutMap = Partial<Record<AlbionSlotType, EquippedSlotState | null>>;

interface FullPresetLoadout extends PresetLoadout {
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

const META_PRESETS: FullPresetLoadout[] = [
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

  const buildLoadoutFromPreset = (preset: FullPresetLoadout): LoadoutMap => {
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

    const mhUnique = result.MainHand?.uniqueName;
    const mhItem = mhUnique ? itemByUniqueMap.get(mhUnique.toUpperCase()) : undefined;
    if (mhItem && (mhItem.handedness === '2H' || mhItem.isTwoHanded)) {
      result.OffHand = null;
    }

    return result;
  };

  const [activePresetId, setActivePresetId] = useState<string>(META_PRESETS[0].id);
  const [loadout, setLoadout] = useState<LoadoutMap>(() =>
    buildLoadoutFromPreset(META_PRESETS[0])
  );
  const [focusedSlot, setFocusedSlot] = useState<AlbionSlotType>('MainHand');
  const [copiedType, setCopiedType] = useState<'url' | 'json' | null>(null);
  const [popoverItem, setPopoverItem] = useState<AlbionItem | null>(null);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerTierFilter, setPickerTierFilter] = useState<'ALL' | AlbionTier>('ALL');
  const [pickerPage, setPickerPage] = useState(1);

  // Check URL query param for shared build
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const buildParam = params.get('build');
    if (buildParam) {
      try {
        const decoded = JSON.parse(atob(buildParam));
        if (decoded && decoded.MainHand) {
          const mhUnique = decoded.MainHand?.uniqueName;
          const mhItem = mhUnique ? itemByUniqueMap.get(mhUnique.toUpperCase()) : undefined;
          if (mhItem && (mhItem.handedness === '2H' || ('isTwoHanded' in mhItem && Boolean((mhItem as any).isTwoHanded)))) {
            decoded.OffHand = null;
          }
          setLoadout(decoded);
          setActivePresetId('');
        }
      } catch {
        // Ignored
      }
    }
  }, [itemByUniqueMap]);

  // MainHand Item and 2H Lock status
  const mainHandState = loadout.MainHand;
  const mainHandItem = mainHandState
    ? itemByUniqueMap.get(mainHandState.uniqueName.toUpperCase())
    : undefined;
  const isTwoHandedEquipped = Boolean(
    mainHandItem?.handedness === '2H' ||
      (mainHandItem && 'isTwoHanded' in mainHandItem && Boolean((mainHandItem as any).isTwoHanded))
  );

  useEffect(() => {
    if (isTwoHandedEquipped && focusedSlot === 'OffHand') {
      setFocusedSlot('MainHand');
    }
  }, [isTwoHandedEquipped, focusedSlot]);

  // Aggregate IP and Silver calculation
  const loadoutSummary = useMemo(() => {
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
      const it = itemByUniqueMap.get(st.uniqueName.toUpperCase());
      if (!it) return;

      const dyn = calculateDynamicItemStats(it, st.tier, st.enchantment, st.quality);
      totalSilver += dyn.estimatedSilver;
      if (['Head', 'Armor', 'Shoes', 'Cape', 'MainHand', 'OffHand'].includes(slotKey)) {
        ipSum += dyn.totalIp;
        ipCount += 1;
      }
    });

    return {
      averageIp: ipCount > 0 ? Math.round(ipSum / ipCount) : 0,
      totalSilver,
    };
  }, [loadout, isTwoHandedEquipped, mainHandItem, mainHandState, itemByUniqueMap]);

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

  // Candidate Base items for currently focused slot
  const candidateItemsForFocusedSlot = useMemo(() => {
    const qNorm = normalizeSearchText(pickerSearch);
    return BASE_ALBION_ITEMS.filter((item) => {
      if (item.slot_type !== focusedSlot) return false;
      if (pickerTierFilter !== 'ALL' && item.tier !== pickerTierFilter) return false;
      if (qNorm && !item.search_text.includes(qNorm)) return false;
      return true;
    });
  }, [focusedSlot, pickerSearch, pickerTierFilter]);

  const totalPickerPages = Math.max(
    1,
    Math.ceil(candidateItemsForFocusedSlot.length / PICKER_PAGE_SIZE)
  );
  const safePickerPage = Math.min(pickerPage, totalPickerPages);
  const paginatedCandidates = useMemo(() => {
    const start = (safePickerPage - 1) * PICKER_PAGE_SIZE;
    return candidateItemsForFocusedSlot.slice(start, start + PICKER_PAGE_SIZE);
  }, [candidateItemsForFocusedSlot, safePickerPage]);

  // Handlers
  const handleApplyPreset = (presetId: string) => {
    const preset = META_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setActivePresetId(preset.id);
    const built = buildLoadoutFromPreset(preset);
    setLoadout(built);
    setFocusedSlot('MainHand');
  };

  const handleEquipItemInSlot = (slot: AlbionSlotType, newItem: AlbionItem) => {
    setLoadout((prev) => {
      const isTwoHanded =
        slot === 'MainHand' &&
        (newItem.handedness === '2H' || ('isTwoHanded' in newItem && Boolean((newItem as any).isTwoHanded)));

      const next = {
        ...prev,
        [slot]: {
          uniqueName: newItem.unique_name,
          tier: newItem.tier,
          enchantment: newItem.enchantment ?? 0,
          quality: newItem.quality ?? 1,
          spells: { ...newItem.default_spells },
        },
      };

      if (isTwoHanded) {
        next.OffHand = null;
      }
      return next;
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
    const cleanLoadout: LoadoutMap = { ...loadout };
    if (isTwoHandedEquipped) {
      delete cleanLoadout.OffHand;
    }
    const encoded = btoa(JSON.stringify(cleanLoadout));
    const url = `${window.location.origin}${window.location.pathname}?build=${encodeURIComponent(encoded)}`;
    navigator.clipboard.writeText(url);
    setCopiedType('url');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleCopyJson = () => {
    const cleanLoadout: LoadoutMap = { ...loadout };
    if (isTwoHandedEquipped) {
      delete cleanLoadout.OffHand;
    }
    const json = JSON.stringify(cleanLoadout, null, 2);
    navigator.clipboard.writeText(json);
    setCopiedType('json');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleImportJson = (jsonText: string) => {
    try {
      const parsed = JSON.parse(jsonText);
      if (parsed && parsed.MainHand) {
        const mhUnique = parsed.MainHand?.uniqueName;
        const mhItem = mhUnique ? itemByUniqueMap.get(mhUnique.toUpperCase()) : undefined;
        const is2H = Boolean(
          mhItem &&
            (mhItem.handedness === '2H' || ('isTwoHanded' in mhItem && Boolean((mhItem as any).isTwoHanded)))
        );
        if (is2H) {
          parsed.OffHand = null;
        }
        setLoadout((prev) => {
          const merged = { ...prev, ...parsed };
          if (is2H) {
            merged.OffHand = null;
          }
          return merged;
        });
      }
    } catch {
      alert(lang === 'vi' ? 'Mã JSON không hợp lệ!' : 'Invalid JSON code!');
    }
  };

  const handleSlotSelect = (slotKey: AlbionSlotType) => {
    setFocusedSlot(slotKey);
    setPickerPage(1);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      const state = loadout[slotKey];
      const item = state ? itemByUniqueMap.get(state.uniqueName.toUpperCase()) : undefined;
      if (state && item) {
        setMobileSheetOpen(true);
      }
    }
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      {/* 1. PRESET BAR & SHARING */}
      <PresetAndShareModal
        presets={META_PRESETS}
        activePresetId={activePresetId}
        onApplyPreset={handleApplyPreset}
        onCopyShareUrl={handleCopyShareUrl}
        onCopyJson={handleCopyJson}
        onImportJson={handleImportJson}
        copiedType={copiedType}
        lang={lang}
      />

      {/* 2. MAIN WORKSPACE: 10-SLOT PAPERDOLL (LEFT) + PAGINATED SLOT PICKER & SPELL INSPECTOR (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT (5 cols): 10-SLOT ALBION PAPERDOLL */}
        <div className="lg:col-span-5 p-3 md:p-6 rounded-xl bg-bg-secondary border border-border-subtle space-y-4">
          <PaperdollGrid
            loadout={loadout}
            focusedSlot={focusedSlot}
            onSelectSlot={handleSlotSelect}
            isTwoHandedEquipped={isTwoHandedEquipped}
            mainHandItem={mainHandItem}
            mainHandState={mainHandState ?? undefined}
            itemByUniqueMap={itemByUniqueMap}
            averageIp={loadoutSummary.averageIp}
            totalSilver={loadoutSummary.totalSilver}
            lang={lang}
          />

          {/* 1H vs 2H Status Explanation Banner */}
          <div
            className={[
              'p-3 rounded-lg border text-xs flex items-center gap-2.5',
              isTwoHandedEquipped
                ? 'bg-accent-crimson/15 border-accent-crimson/50 text-red-600 dark:text-red-200'
                : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-200',
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

        {/* RIGHT (7 cols): PAGINATED SLOT EQUIPMENT PICKER + SPELL SELECTOR + TOOLTIP */}
        <div className="lg:col-span-7 space-y-5">
          <SlotEquipmentPicker
            focusedSlot={focusedSlot}
            focusedSlotLabel={SLOT_LABELS[focusedSlot]}
            focusedSlotState={focusedSlotState ?? undefined}
            focusedItem={focusedItem}
            paginatedCandidates={paginatedCandidates}
            totalCandidatesCount={candidateItemsForFocusedSlot.length}
            totalPickerPages={totalPickerPages}
            safePickerPage={safePickerPage}
            pickerSearch={pickerSearch}
            pickerTierFilter={pickerTierFilter}
            onSearchChange={(search) => {
              setPickerSearch(search);
              setPickerPage(1);
            }}
            onTierFilterChange={(tier) => {
              setPickerTierFilter(tier);
              setPickerPage(1);
            }}
            onPageChange={setPickerPage}
            onSelectCandidate={(cand) => setPopoverItem(cand)}
            onUpdateSlotMeta={handleUpdateSlotMeta}
            onOpenConfigureModal={(item) => setPopoverItem(item)}
            lang={lang}
          />

          {/* Spell Selector when focused slot item has configurable spells */}
          {focusedItem && Object.keys(focusedItem.spells).length > 0 && (
            <SpellSelector
              item={focusedItem}
              selectedSpells={focusedSlotState?.spells || focusedItem.default_spells}
              onChangeSpell={(slotKey, spellId) => {
                setLoadout((prev) => {
                  const curr = prev[focusedSlot];
                  if (!curr) return prev;
                  return {
                    ...prev,
                    [focusedSlot]: {
                      ...curr,
                      spells: {
                        ...curr.spells,
                        [slotKey]: spellId,
                      },
                    },
                  };
                });
              }}
              lang={lang}
            />
          )}

          {/* Live Item Tooltip for Focused Item */}
          {focusedItem && focusedSlotState && (
            <ItemTooltip
              item={focusedItem}
              tier={focusedSlotState.tier}
              enchantment={focusedSlotState.enchantment}
              quality={focusedSlotState.quality}
              lang={lang}
            />
          )}
        </div>
      </div>

      {/* Item Configuration Popover Modal */}
      {popoverItem && (
        <ItemConfigPopover
          isOpen={Boolean(popoverItem)}
          item={popoverItem}
          onClose={() => setPopoverItem(null)}
          onConfirm={(configured) => {
            handleEquipItemInSlot(focusedSlot, configured);
            setPopoverItem(null);
          }}
          onInspect={(configured) => {
            handleEquipItemInSlot(focusedSlot, configured);
            setPopoverItem(null);
          }}
          initialTier={focusedSlotState?.tier ?? popoverItem.tier}
          initialEnchantment={focusedSlotState?.enchantment ?? 0}
          initialQuality={focusedSlotState?.quality ?? 1}
          lang={lang}
          mode="equip"
        />
      )}

      {/* Mobile Bottom Sheet (< 768px) */}
      <MobileBottomSheet
        isOpen={mobileSheetOpen}
        onClose={() => setMobileSheetOpen(false)}
        title={
          focusedItem
            ? lang === 'vi'
              ? focusedItem.name_vi
              : focusedItem.name_en
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
              lang={lang}
            />
          </div>
        )}
      </MobileBottomSheet>
    </div>
  );
};
