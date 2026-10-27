import rawDb from '@/data/albion-items.json';
import { SAMPLE_ALBION_ITEMS } from '@/data/sample-items';
import { resolveEquipmentSkillSet } from '@/data/albion-skills-compendium';
import {
  AlbionEnchantment,
  AlbionHandedness,
  AlbionItem,
  AlbionQuality,
  AlbionSlotType,
  AlbionTier,
  ArmoryFilterCategory,
} from '@/types/albion';

export interface RawSyncedAlbionItem {
  id: string;
  unique_name: string;
  base_identifier: string;
  name_en: string;
  name_vi: string;
  desc_en: string;
  tier: number;
  enchantment: number;
  availableEnchantments: number[];
  quality: number;
  category: 'weapons' | 'armors' | 'mounts' | 'consumables';
  filter_group: Exclude<ArmoryFilterCategory, 'ALL'>;
  slot_type: AlbionSlotType;
  handedness: AlbionHandedness;
  isTwoHanded: boolean;
  sub_category_en: string;
  sub_category_vi: string;
  is_artifact: boolean;
  artifact_type?: 'Rune' | 'Soul' | 'Relic' | 'Avalonian' | 'Crystal';
  avg_market_silver: number;
  best_city: string;
  base_ip: number;
  search_text: string;
}

/**
 * Strips Vietnamese diacritics for instant accent-insensitive search.
 */
export function normalizeSearchText(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

// Curated detailed items indexed by base_identifier and unique_name
const CURATED_BY_UNIQUE = new Map<string, AlbionItem>();
const CURATED_BY_BASE = new Map<string, AlbionItem>();

for (const item of SAMPLE_ALBION_ITEMS) {
  CURATED_BY_UNIQUE.set(item.unique_name.toUpperCase(), item);
  CURATED_BY_BASE.set(item.base_identifier.toUpperCase(), item);
}

/**
 * Converts a raw synced entry from `albion-items.json` into a full `AlbionItem` object
 * with complete Q / W / E / Passive (or Active / Passive / Consumable) skill sets.
 */
export function hydrateAlbionItem(raw: RawSyncedAlbionItem): AlbionItem & {
  search_text: string;
  availableEnchantments: number[];
  isTwoHanded: boolean;
} {
  const curatedExact = CURATED_BY_UNIQUE.get(raw.unique_name.toUpperCase());
  const curatedFamily = CURATED_BY_BASE.get(raw.base_identifier.toUpperCase());
  const ref = curatedExact || curatedFamily;

  const tier = (Math.max(1, Math.min(8, raw.tier)) as AlbionTier) || 4;
  const compendiumSkills = resolveEquipmentSkillSet(raw);

  // Always provide the full multi-choice Q / W / E / Passive skill set from the Compendium
  // (which includes exact signature skills from EXACT_SIGNATURE_SKILLS for all weapons, armors, capes & consumables)
  const resolvedSpells = compendiumSkills.spells;
  const resolvedDefaultSpells = compendiumSkills.default_spells;

  const isWeapon = raw.category === 'weapons' && raw.slot_type === 'MainHand';
  const baseDps = isWeapon
    ? Math.round(65 * Math.pow(1.0918, (raw.base_ip - 700) / 100))
    : undefined;

  return {
    id: raw.id,
    unique_name: raw.unique_name,
    base_identifier: raw.base_identifier,
    name_en: raw.name_en,
    name_vi: curatedExact ? curatedExact.name_vi : raw.name_vi,
    tier,
    enchantment: (curatedExact?.enchantment ?? 0) as AlbionEnchantment,
    quality: (curatedExact?.quality ?? 1) as AlbionQuality,
    category: raw.category,
    filter_group: raw.filter_group,
    sub_category_en: raw.sub_category_en,
    sub_category_vi: raw.sub_category_vi,
    slot_type: raw.slot_type,
    handedness: raw.handedness,
    is_artifact: raw.is_artifact,
    artifact_type: raw.artifact_type,
    recommended_zones: ref?.recommended_zones ?? [
      'SAFE',
      'YELLOW',
      'LETHAL',
      'AVALON',
    ],
    avg_market_silver: curatedExact?.avg_market_silver ?? raw.avg_market_silver,
    best_city: ref?.best_city ?? raw.best_city,
    lore_vi:
      ref?.lore_vi ??
      `${raw.name_vi} (${raw.unique_name}) thuộc phân nhánh ${raw.sub_category_vi}. Sở hữu bộ kỹ năng chuyên biệt có thể tùy biến trực tiếp ở bảng kỹ năng bên dưới.`,
    lore_en: ref?.lore_en ?? raw.desc_en,
    stats: {
      base_ip: raw.base_ip,
      damage_per_second: baseDps,
      auto_attack_damage: baseDps ? Math.round(baseDps * 0.8) : undefined,
      attack_speed: isWeapon ? (raw.isTwoHanded ? 1.2 : 1.3) : undefined,
      attack_range_en:
        ref?.stats.attack_range_en ??
        (raw.filter_group === 'RANGED' || raw.filter_group === 'MAGIC_NATURE'
          ? '11.5m (Ranged)'
          : isWeapon
            ? '3.5m (Melee)'
            : `${raw.slot_type} Slot`),
      attack_range_vi:
        ref?.stats.attack_range_vi ??
        (raw.filter_group === 'RANGED' || raw.filter_group === 'MAGIC_NATURE'
          ? '11.5m (Đánh Xa)'
          : isWeapon
            ? '3.5m (Cận Chiến)'
            : `Ô ${raw.slot_type}`),
      resilience_penetration:
        ref?.stats.resilience_penetration ?? (raw.isTwoHanded ? '25%' : '10%'),
      ability_bonus_en:
        ref?.stats.ability_bonus_en ??
        (raw.isTwoHanded
          ? '+20% Two-Handed Power'
          : '+15% Equipment Power Bonus'),
      ability_bonus_vi:
        ref?.stats.ability_bonus_vi ??
        (raw.isTwoHanded
          ? '+20% Sức mạnh vũ khí 2 tay'
          : '+15% Hiệu lực trang bị'),
      max_energy: isWeapon ? 135 : undefined,
      energy_regen: isWeapon ? 1.7 : undefined,
      weight:
        ref?.stats.weight ??
        (raw.slot_type === 'Mount'
          ? '12.5 kg'
          : raw.isTwoHanded
            ? '3.4 kg'
            : '1.8 kg'),
    },
    spells: resolvedSpells,
    default_spells: resolvedDefaultSpells,
    search_text: normalizeSearchText(
      `${raw.search_text} ${curatedExact?.name_vi || ''}`
    ),
    availableEnchantments: raw.availableEnchantments || [0, 1, 2, 3, 4],
    isTwoHanded: raw.isTwoHanded,
  };
}

export type HydratedAlbionItem = ReturnType<typeof hydrateAlbionItem>;

const RAW_ITEMS = rawDb as RawSyncedAlbionItem[];

// Map of baseIdentifier -> Array of available tiers sorted ascending
const TIERS_BY_BASE = new Map<string, AlbionTier[]>();
// Map of `${baseIdentifier}_T${tier}` -> RawSyncedAlbionItem
const RAW_BY_BASE_TIER = new Map<string, RawSyncedAlbionItem>();

for (const raw of RAW_ITEMS) {
  const t = (Math.max(1, Math.min(8, raw.tier)) as AlbionTier) || 4;
  const list = TIERS_BY_BASE.get(raw.base_identifier) || [];
  if (!list.includes(t)) {
    list.push(t);
    list.sort((a, b) => a - b);
    TIERS_BY_BASE.set(raw.base_identifier, list);
  }
  RAW_BY_BASE_TIER.set(`${raw.base_identifier}_T${t}`, raw);
}

export function getAvailableTiersForBase(baseIdentifier: string): AlbionTier[] {
  const tiers = TIERS_BY_BASE.get(baseIdentifier);
  if (tiers && tiers.length > 0) return tiers;
  return [4, 5, 6, 7, 8];
}

/**
 * Deduplicated list of distinct Base Items (~433 items total)
 * Grouped by base_identifier with Tier 8 (or highest available tier) as default representative
 * for the sharpest, highest-quality Destiny Board icon preview.
 */
export const BASE_ALBION_ITEMS: HydratedAlbionItem[] = (() => {
  const representativeMap = new Map<string, RawSyncedAlbionItem>();
  for (const raw of RAW_ITEMS) {
    const existing = representativeMap.get(raw.base_identifier);
    if (!existing || raw.tier > existing.tier) {
      representativeMap.set(raw.base_identifier, raw);
    }
  }
  return Array.from(representativeMap.values()).map(hydrateAlbionItem);
})();

export function getBaseItem(baseIdentifier: string): HydratedAlbionItem | undefined {
  return BASE_ALBION_ITEMS.find((b) => b.base_identifier === baseIdentifier);
}

/**
 * Retrieves a hydrated AlbionItem configured for a specific tier, enchantment, and quality.
 */
export function getHydratedVariant(
  baseIdentifier: string,
  tier: AlbionTier,
  enchantment: AlbionEnchantment = 0,
  quality: AlbionQuality = 1
): HydratedAlbionItem {
  const key = `${baseIdentifier}_T${tier}`;
  let raw = RAW_BY_BASE_TIER.get(key);
  if (!raw) {
    const tiers = getAvailableTiersForBase(baseIdentifier);
    const closestTier = tiers[0] || 4;
    raw = RAW_BY_BASE_TIER.get(`${baseIdentifier}_T${closestTier}`);
  }

  if (!raw) {
    const base = BASE_ALBION_ITEMS.find((b) => b.base_identifier === baseIdentifier);
    if (base) {
      return {
        ...base,
        tier,
        enchantment,
        quality,
      };
    }
    raw = RAW_ITEMS[0];
  }

  const hydrated = hydrateAlbionItem(raw);
  return {
    ...hydrated,
    tier,
    enchantment,
    quality,
  };
}

// Singleton hydrated database (1,702 items)
export const FULL_ALBION_DB: HydratedAlbionItem[] = RAW_ITEMS.map(hydrateAlbionItem);
