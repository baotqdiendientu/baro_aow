import {
  AlbionEnchantment,
  AlbionItem,
  AlbionQuality,
  AlbionTier,
  AlbionZoneType,
} from '@/types/albion';

const RENDER_BASE_URL = 'https://render.albiononline.com/v1';

/**
 * Alias map for common Albion community/spec item identifiers to their exact ao-bin-dumps Render API IDs.
 */
const RENDER_IDENTIFIER_ALIASES: Record<string, string> = {
  MAIN_NATURESTAFF_DRUID: 'MAIN_NATURESTAFF_KEEPER',
  '2H_BOW_BADON': '2H_BOW_KEEPER',
};

/**
 * Resolves a base identifier to its verified Albion Render API identifier.
 */
export function resolveRenderBaseIdentifier(baseIdentifier: string): string {
  const cleanBase = baseIdentifier.replace(/^T[1-8]_/, '').replace(/@[0-4]$/, '');
  return RENDER_IDENTIFIER_ALIASES[cleanBase] || cleanBase;
}

/**
 * Builds the official Albion Online Unique Name with Tier and Enchantment suffix.
 * Example: buildUniqueName("MAIN_1HCROSSBOW", 6, 2) -> "T6_MAIN_1HCROSSBOW@2"
 */
export function buildUniqueName(
  baseIdentifier: string,
  tier: AlbionTier,
  enchantment: AlbionEnchantment = 0,
  forRenderApi: boolean = false
): string {
  const cleanBase = forRenderApi
    ? resolveRenderBaseIdentifier(baseIdentifier)
    : baseIdentifier.replace(/^T[1-8]_/, '').replace(/@[0-4]$/, '');
  const enchantSuffix = enchantment > 0 ? `@${enchantment}` : '';
  return `T${tier}_${cleanBase}${enchantSuffix}`;
}

/**
 * Generates the official Albion Online Render API URL for an item icon.
 * Format: https://render.albiononline.com/v1/item/{UNIQUE_NAME}.png?quality={QUALITY}&size={SIZE}
 */
export function getItemRenderUrl(
  uniqueNameOrBase: string,
  options?: {
    tier?: AlbionTier;
    enchantment?: AlbionEnchantment;
    quality?: AlbionQuality;
    size?: number;
  }
): string {
  const quality = options?.quality ?? 1;
  const size = options?.size ?? 128;

  let resolvedIdentifier = uniqueNameOrBase;
  if (options?.tier) {
    resolvedIdentifier = buildUniqueName(
      uniqueNameOrBase,
      options.tier,
      options.enchantment ?? 0,
      true
    );
  } else {
    const tierMatch = uniqueNameOrBase.match(/^T([1-8])_(.+)$/);
    if (tierMatch) {
      const t = Number(tierMatch[1]) as AlbionTier;
      resolvedIdentifier = buildUniqueName(
        tierMatch[2],
        t,
        options?.enchantment ?? 0,
        true
      );
    }
  }

  return `${RENDER_BASE_URL}/item/${encodeURIComponent(resolvedIdentifier)}.png?quality=${quality}&size=${size}`;
}

import { APP_BASE_PATH } from '@/lib/albion-image';

/**
 * Generates the official Albion Online Render API URL for a spell icon.
 * Serves from local pre-cached `/albion-icons/spells/...` or `/albion-icons/items/...` (<2ms latency).
 */
export function getSpellRenderUrl(spellName: string, size: number = 64): string {
  if (spellName.startsWith('ITEM:')) {
    const itemCode = spellName.replace('ITEM:', '').replace(/@[0-4]$/, '');
    return `${APP_BASE_PATH}/albion-icons/items/${itemCode}.png`;
  }
  const safeFile = `${spellName.replace(/[^a-zA-Z0-9_-]/g, '_')}.png`;
  return `${APP_BASE_PATH}/albion-icons/spells/${safeFile}`;
}

/**
 * Converts numeric Tier (1-8) to Albion Roman Numeral (I - VIII).
 */
export function getTierRoman(tier: AlbionTier): string {
  const map: Record<AlbionTier, string> = {
    1: 'I',
    2: 'II',
    3: 'III',
    4: 'IV',
    5: 'V',
    6: 'VI',
    7: 'VII',
    8: 'VIII',
  };
  return map[tier] || 'IV';
}

/**
 * Returns localized Tier prefix name (Beginner's -> Elder's / Tân Thủ -> Trưởng Lão).
 */
export function getTierTitle(tier: AlbionTier): { en: string; vi: string } {
  const titles: Record<AlbionTier, { en: string; vi: string }> = {
    1: { en: "Beginner's", vi: 'Tân Thủ' },
    2: { en: "Novice's", vi: 'Nhập Môn' },
    3: { en: "Journeyman's", vi: 'Học Việc' },
    4: { en: "Adept's", vi: 'Thông Thạo' },
    5: { en: "Expert's", vi: 'Chuyên Gia' },
    6: { en: "Master's", vi: 'Bậc Thầy' },
    7: { en: "Grandmaster's", vi: 'Đại Sư' },
    8: { en: "Elder's", vi: 'Trưởng Lão' },
  };
  return titles[tier];
}

/**
 * Quality metadata (Colors, Names, and Item Power Bonus).
 */
export const QUALITY_METADATA: Record<
  AlbionQuality,
  {
    name_en: string;
    name_vi: string;
    ip_bonus: number;
    hex: string;
    borderClass: string;
    textClass: string;
  }
> = {
  1: {
    name_en: 'Normal',
    name_vi: 'Thường',
    ip_bonus: 0,
    hex: '#555555',
    borderClass: 'border-quality-1-normal',
    textClass: 'text-text-secondary',
  },
  2: {
    name_en: 'Good',
    name_vi: 'Tốt',
    ip_bonus: 20,
    hex: '#8A9BA8',
    borderClass: 'border-quality-2-good',
    textClass: 'text-quality-2-good',
  },
  3: {
    name_en: 'Outstanding',
    name_vi: 'Xuất Sắc',
    ip_bonus: 40,
    hex: '#CD7F32',
    borderClass: 'border-quality-3-outstanding',
    textClass: 'text-quality-3-outstanding',
  },
  4: {
    name_en: 'Excellent',
    name_vi: 'Tuyệt Hảo',
    ip_bonus: 60,
    hex: '#E2E8F0',
    borderClass: 'border-quality-4-excellent',
    textClass: 'text-quality-4-excellent',
  },
  5: {
    name_en: 'Masterpiece',
    name_vi: 'Tuyệt Tác',
    ip_bonus: 100,
    hex: '#FFD700',
    borderClass: 'border-quality-5-masterpiece',
    textClass: 'text-quality-5-masterpiece',
  },
};

/**
 * Enchantment metadata (.0 to .4).
 */
export const ENCHANTMENT_METADATA: Record<
  AlbionEnchantment,
  {
    name_en: string;
    name_vi: string;
    ip_bonus: number;
    hex: string;
  }
> = {
  0: {
    name_en: 'Unenchanted (.0)',
    name_vi: 'Chưa Cường Hóa (.0)',
    ip_bonus: 0,
    hex: 'transparent',
  },
  1: {
    name_en: 'Uncommon (.1)',
    name_vi: 'Lục Bảo (.1)',
    ip_bonus: 100,
    hex: '#2ECC71',
  },
  2: {
    name_en: 'Rare (.2)',
    name_vi: 'Lam Hiếm (.2)',
    ip_bonus: 200,
    hex: '#3498DB',
  },
  3: {
    name_en: 'Exceptional (.3)',
    name_vi: 'Tím Thạch Anh (.3)',
    ip_bonus: 300,
    hex: '#9B59B6',
  },
  4: {
    name_en: 'Pristine (.4)',
    name_vi: 'Hoàng Kim (.4)',
    ip_bonus: 400,
    hex: '#F1C40F',
  },
};

/**
 * Tier color mapping matching tailwind.config.js tokens.
 */
export const TIER_HEX_MAP: Record<AlbionTier, string> = {
  1: '#6D6D6D',
  2: '#8C7853',
  3: '#4A7A4C',
  4: '#3B7898',
  5: '#8E2822',
  6: '#D06B27',
  7: '#D9B834',
  8: '#EBEBEB',
};

/**
 * Zone Safety Tag metadata.
 */
export const ZONE_METADATA: Record<
  AlbionZoneType,
  { label_vi: string; label_en: string; hex: string; badgeClass: string }
> = {
  SAFE: {
    label_vi: 'Vùng Xanh (An Toàn)',
    label_en: 'Safe / Blue Zone',
    hex: '#2563EB',
    badgeClass: 'bg-zone-safe/20 text-blue-400 border-zone-safe/50',
  },
  YELLOW: {
    label_vi: 'Vùng Vàng (PvP Không Rơi Đồ)',
    label_en: 'Yellow Zone (Non-lethal)',
    hex: '#D97706',
    badgeClass: 'bg-zone-yellow/20 text-amber-400 border-zone-yellow/50',
  },
  LETHAL: {
    label_vi: 'Vùng Đỏ / Đen / Mists (Rơi Toàn Bộ Đồ)',
    label_en: 'Lethal PvP (Red / Black / Mists)',
    hex: '#DC2626',
    badgeClass: 'bg-zone-lethal/20 text-red-400 border-zone-lethal/50',
  },
  AVALON: {
    label_vi: 'Đường Cổ Đại Avalon',
    label_en: 'Roads of Avalon',
    hex: '#0D9488',
    badgeClass: 'bg-zone-avalon/20 text-teal-300 border-zone-avalon/50',
  },
};

/**
 * Calculates dynamic Item Power (IP) and scaled stats when changing Tier, Enchantment, or Quality.
 */
export function calculateDynamicItemStats(
  item: AlbionItem,
  targetTier: AlbionTier,
  targetEnchant: AlbionEnchantment,
  targetQuality: AlbionQuality
) {
  const tierDelta = (targetTier - item.tier) * 100;
  const enchantBonus = ENCHANTMENT_METADATA[targetEnchant].ip_bonus;
  const qualityBonus = QUALITY_METADATA[targetQuality].ip_bonus;

  const totalIp = Math.max(
    100,
    item.stats.base_ip + tierDelta + enchantBonus + qualityBonus
  );

  // In Albion Online, weapon damage scales by ~9.18% per 100 IP
  const ipDifference = totalIp - item.stats.base_ip;
  const scaleFactor = Math.pow(1.0918, ipDifference / 100);

  const scaledDps = item.stats.damage_per_second
    ? Math.round(item.stats.damage_per_second * scaleFactor)
    : undefined;
  const scaledAutoAttack = item.stats.auto_attack_damage
    ? Math.round(item.stats.auto_attack_damage * scaleFactor)
    : undefined;

  // Estimate market silver scaling across Tiers & Enchantments
  const tierPriceMultiplier = Math.pow(1.85, Math.max(0, targetTier - item.tier));
  const enchantPriceMultiplier = Math.pow(2.4, targetEnchant);
  const qualityPriceMultiplier =
    targetQuality === 5 ? 3.2 : targetQuality === 4 ? 1.45 : 1 + (targetQuality - 1) * 0.1;

  const estimatedSilver = Math.round(
    item.avg_market_silver *
      tierPriceMultiplier *
      enchantPriceMultiplier *
      qualityPriceMultiplier
  );

  return {
    totalIp,
    baseIpForTier: item.stats.base_ip + tierDelta,
    enchantBonus,
    qualityBonus,
    scaledDps,
    scaledAutoAttack,
    estimatedSilver,
  };
}

/**
 * Parses Albion gamer shorthand queries like:
 * - "light crossbow 6.2" -> { cleanQuery: "light crossbow", tier: 6, enchantment: 2 }
 * - "cung ánh sáng t6"   -> { cleanQuery: "cung ánh sáng", tier: 6, enchantment: undefined }
 * - "crystal reaper 8.3" -> { cleanQuery: "crystal reaper", tier: 8, enchantment: 3 }
 */
export interface ParsedAlbionQuery {
  raw: string;
  textQuery: string;
  tier?: AlbionTier;
  enchantment?: AlbionEnchantment;
}

export function parseAlbionSearchQuery(rawQuery: string): ParsedAlbionQuery {
  let working = rawQuery.trim().toLowerCase();
  let detectedTier: AlbionTier | undefined;
  let detectedEnchant: AlbionEnchantment | undefined;

  // Match pattern like "6.2", "t6.2", "8.4", "4.1"
  const tierEnchantMatch = working.match(/\b(?:t)?([1-8])\.([0-4])\b/i);
  if (tierEnchantMatch) {
    detectedTier = Number(tierEnchantMatch[1]) as AlbionTier;
    detectedEnchant = Number(tierEnchantMatch[2]) as AlbionEnchantment;
    working = working.replace(tierEnchantMatch[0], ' ');
  } else {
    // Match standalone tier like "t4", "t6", "t8"
    const tierOnlyMatch = working.match(/\bt([1-8])\b/i);
    if (tierOnlyMatch) {
      detectedTier = Number(tierOnlyMatch[1]) as AlbionTier;
      working = working.replace(tierOnlyMatch[0], ' ');
    }
    // Match standalone enchantment like ".2", ".3"
    const enchantOnlyMatch = working.match(/(?:^|\s)\.([0-4])\b/);
    if (enchantOnlyMatch) {
      detectedEnchant = Number(enchantOnlyMatch[1]) as AlbionEnchantment;
      working = working.replace(enchantOnlyMatch[0], ' ');
    }
  }

  return {
    raw: rawQuery,
    textQuery: working.replace(/\s+/g, ' ').trim(),
    tier: detectedTier,
    enchantment: detectedEnchant,
  };
}
