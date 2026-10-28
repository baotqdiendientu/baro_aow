'use client';

import { useCallback, useEffect, useState } from 'react';

export const ALBION_CITIES = [
  { id: 'Bridgewatch', color: '#D97706', bonus_vi: 'Nỏ, Dao Găm, Trượng Nguyền', bonus_en: 'Crossbow, Dagger, Cursed' },
  { id: 'Martlock', color: '#3B82F6', bonus_vi: 'Rìu, Giày Sắt, Tay Phụ', bonus_en: 'Axe, Plate Boots, Off-Hand' },
  { id: 'Thetford', color: '#9333EA', bonus_vi: 'Trượng Tự Nhiên, Trượng Lửa, Áo Da', bonus_en: 'Nature, Fire Staff, Leather Armor' },
  { id: 'Lymhurst', color: '#16A34A', bonus_vi: 'Cung, Kiếm, Mũ Da', bonus_en: 'Bow, Sword, Leather Hood' },
  { id: 'Fort Sterling', color: '#E2E8F0', bonus_vi: 'Búa, Thương, Áo Vải', bonus_en: 'Hammer, Spear, Cloth Robe' },
  { id: 'Caerleon', color: '#DC2626', bonus_vi: 'Đồ Chiến Đấu, Thức Ăn, Thuốc', bonus_en: 'War Gloves, Food, Potions' },
  { id: 'Brecilien', color: '#0D9488', bonus_vi: 'Đồ Sương Mù, Thú Cưỡi Cú', bonus_en: 'Mists Gear, Mystic Owl' },
  { id: 'Black Market', color: '#E5A93C', bonus_vi: 'Chợ Đen Caerleon (Hệ thống thu mua)', bonus_en: 'Caerleon NPC Loot Buyer' },
] as const;

export type AlbionServerRegion = 'east' | 'west' | 'europe';

export interface CityMarketRow {
  city: string;
  color: string;
  bonus_vi: string;
  bonus_en: string;
  sellPriceMin: number;
  buyPriceMax: number;
  updatedMinutesAgo: number;
  isLiveApi: boolean;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 Minutes Stale-While-Revalidate

interface CachedPayload {
  timestamp: number;
  rows: CityMarketRow[];
}

const memoryCache = new Map<string, CachedPayload>();

function getStorageCache(key: string): CachedPayload | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`aow_market:${key}`);
    if (!raw) return null;
    const parsed: CachedPayload = JSON.parse(raw);
    if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
      return parsed;
    }
    localStorage.removeItem(`aow_market:${key}`);
  } catch {
    // Ignore storage parse errors
  }
  return null;
}

function setStorageCache(key: string, payload: CachedPayload) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`aow_market:${key}`, JSON.stringify(payload));
  } catch {
    // LocalStorage full or private mode
  }
}

export function useAlbionMarket(
  itemCode: string,
  baseEstimatedSilver: number,
  serverRegion: AlbionServerRegion = 'east'
) {
  const [rows, setRows] = useState<CityMarketRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);

  const cityMultipliers: Record<string, { sell: number; buy: number; mins: number }> = {
    Bridgewatch: { sell: 0.96, buy: 0.84, mins: 4 },
    Martlock: { sell: 0.98, buy: 0.85, mins: 7 },
    Thetford: { sell: 0.94, buy: 0.82, mins: 3 },
    Lymhurst: { sell: 1.01, buy: 0.87, mins: 6 },
    'Fort Sterling': { sell: 1.03, buy: 0.88, mins: 9 },
    Caerleon: { sell: 1.09, buy: 0.95, mins: 2 },
    Brecilien: { sell: 1.12, buy: 0.96, mins: 5 },
    'Black Market': { sell: 1.19, buy: 1.14, mins: 1 },
  };

  const getFallbackRows = useCallback((): CityMarketRow[] => {
    return ALBION_CITIES.map((c) => {
      const m = cityMultipliers[c.id] || { sell: 1, buy: 0.85, mins: 5 };
      return {
        city: c.id,
        color: c.color,
        bonus_vi: c.bonus_vi,
        bonus_en: c.bonus_en,
        sellPriceMin: Math.round(baseEstimatedSilver * m.sell),
        buyPriceMax: Math.round(baseEstimatedSilver * m.buy),
        updatedMinutesAgo: m.mins,
        isLiveApi: false,
      };
    });
  }, [baseEstimatedSilver]);

  const fetchPrices = useCallback(
    async (forceRefresh = false) => {
      if (!itemCode) return;
      const cacheKey = `${serverRegion}:${itemCode}`;

      // 1. In-memory check
      const memHit = memoryCache.get(cacheKey);
      if (!forceRefresh && memHit && Date.now() - memHit.timestamp < CACHE_TTL_MS) {
        setRows(memHit.rows);
        setIsLive(memHit.rows.some((r) => r.isLiveApi));
        return;
      }

      // 2. Persistent localStorage check
      const storageHit = !forceRefresh ? getStorageCache(cacheKey) : null;
      if (storageHit) {
        memoryCache.set(cacheKey, storageHit);
        setRows(storageHit.rows);
        setIsLive(storageHit.rows.some((r) => r.isLiveApi));
        return;
      }

      setLoading(true);
      const fallback = getFallbackRows();

      const locationsParam = encodeURIComponent(ALBION_CITIES.map((c) => c.id).join(','));
      const apiUrl = `https://${serverRegion}.albion-online-data.com/api/v2/stats/prices/${encodeURIComponent(
        itemCode
      )}.json?locations=${locationsParam}`;

      try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Array<{ city: string; sell_price_min: number; buy_price_max: number }> =
          await res.json();

        let liveFound = false;
        const merged = fallback.map((row) => {
          const match = data.find(
            (d) =>
              d.city.toLowerCase() === row.city.toLowerCase() &&
              (d.sell_price_min > 0 || d.buy_price_max > 0)
          );
          if (!match) return row;
          liveFound = true;
          return {
            ...row,
            sellPriceMin: match.sell_price_min > 0 ? match.sell_price_min : row.sellPriceMin,
            buyPriceMax: match.buy_price_max > 0 ? match.buy_price_max : row.buyPriceMax,
            updatedMinutesAgo: 1,
            isLiveApi: true,
          };
        });

        const payload: CachedPayload = { timestamp: Date.now(), rows: merged };
        memoryCache.set(cacheKey, payload);
        setStorageCache(cacheKey, payload);
        setRows(merged);
        setIsLive(liveFound);
      } catch {
        // Fallback to calculated rows on network error
        setRows(fallback);
        setIsLive(false);
      } finally {
        setLoading(false);
      }
    },
    [itemCode, serverRegion, getFallbackRows]
  );

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  return {
    rows,
    loading,
    isLive,
    refresh: () => fetchPrices(true),
  };
}
