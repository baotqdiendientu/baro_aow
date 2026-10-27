import { AlbionEnchantment, AlbionQuality, AlbionTier } from '@/types/albion';

const RENDER_SERVICE_BASE = 'https://render.albiononline.com/v1';

/**
 * Alias map for community shorthand names to official ao-bin-dumps UniqueName identifiers.
 */
const UNIQUE_NAME_ALIASES: Record<string, string> = {
  MAIN_NATURESTAFF_DRUID: 'MAIN_NATURESTAFF_KEEPER',
  '2H_BOW_BADON': '2H_BOW_KEEPER',
};

/**
 * Strips any existing @1..@4 or _LEVEL1.._LEVEL4 enchantment suffixes from a UniqueName
 * so we never generate broken URLs like `T4_MAIN_1HCROSSBOW@1@1.png`.
 */
export function normalizeBaseUniqueName(
  uniqueNameOrBase: string,
  overrideTier?: AlbionTier
): string {
  let clean = uniqueNameOrBase
    .trim()
    .replace(/@[0-4]$/g, '')
    .replace(/@[0-4]$/g, '') // double pass in case of @1@1
    .replace(/_LEVEL[1-4]$/g, '');

  const tierMatch = clean.match(/^T([1-8])_(.+)$/);
  let tier = overrideTier ?? 4;
  let basePart = clean;

  if (tierMatch) {
    tier = overrideTier ?? (Number(tierMatch[1]) as AlbionTier);
    basePart = tierMatch[2];
  }

  if (UNIQUE_NAME_ALIASES[basePart]) {
    basePart = UNIQUE_NAME_ALIASES[basePart];
  }

  return `T${tier}_${basePart}`;
}

export interface GetItemImageUrlOptions {
  tier?: AlbionTier;
  enchantment?: AlbionEnchantment | number;
  quality?: AlbionQuality | number;
  size?: number;
  preferRemote?: boolean;
}

/**
 * Checks whether an item UniqueName supports @1..@4 enchantment sprites on
 * Albion Online's official Render CDN. Mounts, potions, and farmables do not
 * have @1..@4 sprite files on the server and requesting them causes slow 404s.
 */
export function supportsEnchantedSprite(cleanUniqueName: string): boolean {
  const upper = cleanUniqueName.toUpperCase();
  if (
    upper.includes('_MOUNT_') ||
    upper.includes('_FARM_') ||
    upper.includes('_POTION_') ||
    upper.includes('_SEED')
  ) {
    return false;
  }
  return true;
}

export const APP_BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH ??
  (process.env.NODE_ENV === 'production' ? '/baro_aow' : '');

/**
 * Returns the instant local static icon path (`/albion-icons/items/${cleanUniqueName}.png`)
 * pre-cached by `scripts/cache-albion-icons.mjs`.
 */
export function getLocalItemImageUrl(
  uniqueName: string,
  tier?: AlbionTier
): string {
  const cleanUniqueName = normalizeBaseUniqueName(uniqueName, tier);
  return `${APP_BASE_PATH}/albion-icons/items/${cleanUniqueName}.png`;
}

/**
 * Step 2.1: Official Albion Online Item Image URL generator.
 * Uses local pre-cached static icon (`/albion-icons/items/...`) for `.0` items
 * when `preferRemote` is not set, and falls back to `https://render.albiononline.com/v1/item/...`
 * for enchanted variants or OpenGraph metadata.
 */
export function getItemImageUrl(
  uniqueName: string,
  options?: GetItemImageUrlOptions
): string {
  const rawEnchantment = Math.max(0, Math.min(4, options?.enchantment ?? 0));
  const quality = Math.max(1, Math.min(5, options?.quality ?? 1));
  const size = options?.size ?? 96;

  const cleanUniqueName = normalizeBaseUniqueName(uniqueName, options?.tier);
  const effectiveEnchant = supportsEnchantedSprite(cleanUniqueName)
    ? rawEnchantment
    : 0;

  // Serve directly from local pre-cached icon directory (<2ms) for base .0 icons
  if (effectiveEnchant === 0 && !options?.preferRemote && size <= 128) {
    return `${APP_BASE_PATH}/albion-icons/items/${cleanUniqueName}.png`;
  }

  const enchantSuffix = effectiveEnchant > 0 ? `@${effectiveEnchant}` : '';

  return `${RENDER_SERVICE_BASE}/item/${encodeURIComponent(
    `${cleanUniqueName}${enchantSuffix}`
  )}.png?quality=${quality}&size=${size}`;
}

/**
 * Step 2.2: Official Albion Online Spell Image URL generator.
 * Serves from local pre-cached `/albion-icons/spells/...` (<2ms) or falls back to Render CDN.
 */
export function getSpellImageUrl(
  spellUniqueName: string,
  size: number = 64
): string {
  if (spellUniqueName.startsWith('ITEM:')) {
    const itemCode = spellUniqueName.replace('ITEM:', '');
    return getLocalItemImageUrl(itemCode);
  }
  const safeFile = `${spellUniqueName.replace(/[^a-zA-Z0-9_-]/g, '_')}.png`;
  return `${APP_BASE_PATH}/albion-icons/spells/${safeFile}`;
}

export function getRemoteSpellImageUrl(
  spellUniqueName: string,
  size: number = 64
): string {
  if (spellUniqueName.startsWith('ITEM:')) {
    const itemCode = spellUniqueName.replace('ITEM:', '');
    return getItemImageUrl(itemCode, {
      enchantment: 0,
      quality: 1,
      size,
      preferRemote: true,
    });
  }
  return `${RENDER_SERVICE_BASE}/spell/${encodeURIComponent(
    spellUniqueName
  )}.png?size=${size}`;
}

