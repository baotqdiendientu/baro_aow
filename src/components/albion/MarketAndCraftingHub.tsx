'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  AlbionEnchantment,
  AlbionItem,
  AlbionTier,
} from '@/types/albion';
import { FULL_ALBION_DB } from '@/services/albion-db';
import {
  buildUniqueName,
  calculateDynamicItemStats,
  getTierRoman,
} from '@/services/ao-api';
import { AppLanguage } from '@/i18n/translations';
import { ItemSlot } from './ItemSlot';
import {
  ArrowUpRight,
  Calculator,
  Coins,
  Flame,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import {
  AlbionServerRegion,
  useAlbionMarket,
} from '@/hooks/useAlbionMarket';

export interface MarketAndCraftingHubProps {
  lang: AppLanguage;
}

export const MarketAndCraftingHub: React.FC<MarketAndCraftingHubProps> = ({
  lang,
}) => {
  const [serverRegion, setServerRegion] = useState<AlbionServerRegion>('east');
  const [selectedItem, setSelectedItem] = useState<AlbionItem>(
    () =>
      FULL_ALBION_DB.find((i) => i.unique_name === 'T4_MAIN_1HCROSSBOW') ||
      FULL_ALBION_DB[0]
  );
  const [tier, setTier] = useState<AlbionTier>(6);
  const [enchantment, setEnchantment] = useState<AlbionEnchantment>(2);

  // Crafting & Farming Profit Calculator State
  const [craftQuantity, setCraftQuantity] = useState<number>(10);
  const [useFocus, setUseFocus] = useState<boolean>(true);
  const [hasPremium, setHasPremium] = useState<boolean>(true);
  const [inBonusCity, setInBonusCity] = useState<boolean>(true);
  const [focusCostPerItem, setFocusCostPerItem] = useState<number>(285);

  const dynamicStats = useMemo(
    () => calculateDynamicItemStats(selectedItem, tier, enchantment, 3),
    [selectedItem, tier, enchantment]
  );

  const apiItemCode = useMemo(
    () => buildUniqueName(selectedItem.base_identifier, tier, enchantment, true),
    [selectedItem.base_identifier, tier, enchantment]
  );

  // Robust hook with in-memory + localStorage 5-minute persistent cache
  const {
    rows: marketRows,
    loading: loadingMarket,
    isLive: isLiveMarket,
    refresh: refreshMarket,
  } = useAlbionMarket(apiItemCode, dynamicStats.estimatedSilver, serverRegion);

  // Identify Best Buy (Lowest Sell Order) and Best Sell (Highest Sell/Buy Order)
  const marketArbitrage = useMemo(() => {
    if (marketRows.length === 0) return null;
    const sortedByCheapestSell = [...marketRows].sort(
      (a, b) => a.sellPriceMin - b.sellPriceMin
    );
    const sortedByHighestSell = [...marketRows].sort(
      (a, b) => b.sellPriceMin - a.sellPriceMin
    );
    const cheapest = sortedByCheapestSell[0];
    const highest = sortedByHighestSell[0];
    const taxRate = hasPremium ? 0.065 : 0.105; // 4%/8% tax + 2.5% setup fee
    const netSell = Math.round(highest.sellPriceMin * (1 - taxRate));
    const netFlipProfit = netSell - cheapest.sellPriceMin;
    const roiPercent =
      cheapest.sellPriceMin > 0
        ? ((netFlipProfit / cheapest.sellPriceMin) * 100).toFixed(1)
        : '0.0';

    return {
      cheapest,
      highest,
      netFlipProfit,
      roiPercent,
    };
  }, [marketRows, hasPremium]);

  // Crafting Profit Calculations (Phase 4 Spec)
  const craftingMetrics = useMemo(() => {
    // Resource Return Rate (RRR) in Albion Online:
    // Royal City Bonus + Focus = 47.9% | Royal City Bonus No Focus = 24.8%
    // Normal Royal City + Focus = 43.5% | Normal Royal City No Focus = 15.2%
    const rrrPercent = inBonusCity
      ? useFocus
        ? 47.9
        : 24.8
      : useFocus
        ? 43.5
        : 15.2;

    const rawMaterialCostPerItem = Math.round(dynamicStats.estimatedSilver * 1.18);
    const returnedMaterialValuePerItem = Math.round(
      rawMaterialCostPerItem * (rrrPercent / 100)
    );
    const stationNutritionFeePerItem = Math.round(
      dynamicStats.estimatedSilver * 0.035
    );
    const netProductionCostPerItem =
      rawMaterialCostPerItem -
      returnedMaterialValuePerItem +
      stationNutritionFeePerItem;

    // Selling price in best Royal City / Black Market
    const targetSellPricePerItem =
      marketArbitrage?.highest.sellPriceMin ??
      Math.round(dynamicStats.estimatedSilver * 1.12);

    // Market Tax: Premium = 4% Tax + 2.5% Setup (6.5%), Non-Premium = 8% Tax + 2.5% Setup (10.5%)
    const totalTaxRate = hasPremium ? 0.065 : 0.105;
    const marketTaxPerItem = Math.round(targetSellPricePerItem * totalTaxRate);

    const netProfitPerItem =
      targetSellPricePerItem - netProductionCostPerItem - marketTaxPerItem;
    const totalBatchProfit = netProfitPerItem * craftQuantity;
    const totalFocusUsed = useFocus ? focusCostPerItem * craftQuantity : 0;
    const silverPerFocus =
      useFocus && focusCostPerItem > 0
        ? Math.round(netProfitPerItem / focusCostPerItem)
        : 0;
    const profitMarginPercent =
      netProductionCostPerItem > 0
        ? ((netProfitPerItem / netProductionCostPerItem) * 100).toFixed(1)
        : '0.0';

    return {
      rrrPercent,
      rawMaterialCostPerItem,
      returnedMaterialValuePerItem,
      netProductionCostPerItem,
      targetSellPricePerItem,
      totalTaxRatePercent: (totalTaxRate * 100).toFixed(1),
      marketTaxPerItem,
      netProfitPerItem,
      totalBatchProfit,
      totalFocusUsed,
      silverPerFocus,
      profitMarginPercent,
    };
  }, [
    dynamicStats.estimatedSilver,
    inBonusCity,
    useFocus,
    hasPremium,
    craftQuantity,
    focusCostPerItem,
    marketArbitrage,
  ]);

  return (
    <div className="space-y-6">
      {/* HEADER + ITEM & SERVER SELECTOR */}
      <div className="p-5 rounded-xl bg-bg-secondary border border-border-subtle space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-accent-primary/20 text-accent-primary border border-border-gold/40">
              PHASE 4 • REAL-TIME MARKET &amp; CRAFTING CALCULATOR
            </span>
            <h2 className="mt-2 font-display text-xl sm:text-2xl font-bold text-text-primary">
              {lang === 'vi'
                ? 'Bảng Giá Chợ 8 Thành Phố & Máy Tính Lợi Nhuận Chế Tạo'
                : '8-City Market Tracker & Crafting Profit Calculator'}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-text-secondary">
              {lang === 'vi'
                ? 'So sánh giá Mua/Bán giữa 8 khu vực chính (kèm Chợ Đen Caerleon) với bộ nhớ đệm 5 phút, tự động tính tỷ lệ hoàn trả tài nguyên (RRR), điểm Focus và Thuế Premium.'
                : 'Compare Sell & Buy Orders across all 8 Albion markets (including Black Market) with 5-minute SWR caching, Resource Return Rate (RRR), Focus efficiency, and Premium Tax.'}
            </p>
          </div>

          {/* Server Region Switcher */}
          <div className="flex items-center gap-1.5 bg-bg-primary p-1 rounded-lg border border-border-gold/50 shrink-0 self-start">
            {(
              [
                { id: 'east', label: 'Asia (East)' },
                { id: 'west', label: 'Americas (West)' },
                { id: 'europe', label: 'Europe' },
              ] as const
            ).map((srv) => (
              <button
                key={srv.id}
                type="button"
                onClick={() => setServerRegion(srv.id)}
                className={[
                  'px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all',
                  serverRegion === srv.id
                    ? 'bg-accent-primary text-bg-primary shadow'
                    : 'text-text-secondary hover:text-text-primary',
                ].join(' ')}
              >
                {srv.label}
              </button>
            ))}
          </div>
        </div>

        {/* Item + Tier + Enchantment Selector Bar */}
        <div className="pt-3 border-t border-border-subtle flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <ItemSlot
              baseIdentifier={selectedItem.base_identifier}
              name={selectedItem.name_en}
              tier={tier}
              defaultTier={selectedItem.tier}
              enchantment={enchantment}
              quality={3}
              size="sm"
              selected
            />
            <div>
              <label className="block text-[10px] font-mono uppercase text-text-muted">
                {lang === 'vi' ? 'Chọn vật phẩm tra cứu giá:' : 'Select Item:'}
              </label>
              <select
                value={selectedItem.id}
                onChange={(e) => {
                  const found = FULL_ALBION_DB.find(
                    (i) => i.id === e.target.value
                  );
                  if (found) setSelectedItem(found);
                }}
                className="mt-0.5 max-w-[320px] bg-bg-primary border border-border-gold/50 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-display font-bold text-text-primary focus:outline-none"
              >
                {FULL_ALBION_DB.map((item) => (
                  <option key={item.id} value={item.id}>
                    {lang === 'vi' ? item.name_vi : item.name_en} (
                    {item.unique_name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Tier Pills */}
            <div className="flex items-center gap-1 bg-bg-primary p-1 rounded-lg border border-border-subtle">
              {([4, 5, 6, 7, 8] as AlbionTier[]).map((tNum) => (
                <button
                  key={tNum}
                  type="button"
                  onClick={() => setTier(tNum)}
                  className={[
                    'px-2.5 py-1 rounded text-xs font-mono font-bold transition-all',
                    tier === tNum
                      ? 'bg-accent-primary text-bg-primary'
                      : 'text-text-secondary hover:text-text-primary',
                  ].join(' ')}
                >
                  {getTierRoman(tNum)}
                </button>
              ))}
            </div>

            {/* Enchantment Pills */}
            <div className="flex items-center gap-1 bg-bg-primary p-1 rounded-lg border border-border-subtle">
              {([0, 1, 2, 3, 4] as AlbionEnchantment[]).map((enc) => (
                <button
                  key={enc}
                  type="button"
                  onClick={() => setEnchantment(enc)}
                  className={[
                    'px-2.5 py-1 rounded text-xs font-mono font-bold transition-all',
                    enchantment === enc
                      ? 'bg-emerald-500 text-bg-primary'
                      : 'text-text-secondary hover:text-text-primary',
                  ].join(' ')}
                >
                  .{enc}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN GRID: 8-CITY MARKET COMPARISON (LEFT 7 COLS) + CRAFTING/FOCUS CALCULATOR (RIGHT 5 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT (7 cols): 8-CITY MARKET TRACKER */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-bg-secondary border border-border-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-accent-primary flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>
                {lang === 'vi'
                  ? 'So Sánh Giá Mua / Bán Tại 8 Thành Phố Chính'
                  : '8-City Sell Order & Buy Order Comparison'}
              </span>
            </h3>
            <button
              type="button"
              onClick={() => refreshMarket()}
              title={lang === 'vi' ? 'Làm mới giá chợ trực tiếp' : 'Refresh live prices'}
              className="flex items-center gap-1.5 px-2 py-1 rounded bg-bg-primary hover:bg-bg-elevated border border-border-subtle hover:border-border-gold/50 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 transition-all cursor-pointer"
            >
              <RefreshCw
                className={`w-3 h-3 ${loadingMarket ? 'animate-spin' : ''}`}
              />
              <span>{isLiveMarket ? 'AODP Live' : 'SWR Cache 5m'}</span>
            </button>
          </div>

          {/* Arbitrage Callout Banner */}
          {marketArbitrage && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-bg-primary border border-border-gold/40">
              <div>
                <span className="text-[10px] font-mono uppercase text-text-secondary">
                  {lang === 'vi'
                    ? 'Mua Rẻ Nhất (Lowest Sell)'
                    : 'Cheapest City to Buy'}
                </span>
                <div className="mt-0.5 font-display font-bold text-sm text-emerald-400">
                  {marketArbitrage.cheapest.city}
                </div>
                <div className="font-mono text-xs text-text-primary">
                  {marketArbitrage.cheapest.sellPriceMin.toLocaleString('en-US')}{' '}
                  Ag
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-text-secondary">
                  {lang === 'vi'
                    ? 'Bán Cao Nhất (Highest Sell)'
                    : 'Highest Market to Sell'}
                </span>
                <div className="mt-0.5 font-display font-bold text-sm text-accent-primary">
                  {marketArbitrage.highest.city}
                </div>
                <div className="font-mono text-xs text-text-primary">
                  {marketArbitrage.highest.sellPriceMin.toLocaleString('en-US')}{' '}
                  Ag
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-text-secondary">
                  {lang === 'vi'
                    ? 'Lãi Buôn Hàng (Sau Thuế)'
                    : 'Net Flipping Profit'}
                </span>
                <div className="mt-0.5 font-mono font-extrabold text-sm text-emerald-400 flex items-center gap-1">
                  +{marketArbitrage.netFlipProfit.toLocaleString('en-US')} Ag
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
                <div className="font-mono text-[11px] text-accent-primary">
                  ROI: +{marketArbitrage.roiPercent}%
                </div>
              </div>
            </div>
          )}

          {/* 8-City Price Table */}
          <div className="overflow-x-auto rounded-xl border border-border-subtle">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-primary text-[11px] font-mono uppercase text-text-secondary border-b border-border-subtle">
                  <th className="py-2.5 px-3">
                    {lang === 'vi' ? 'Thành Phố / Khu Vực' : 'City / Market'}
                  </th>
                  <th className="py-2.5 px-3 text-right">
                    {lang === 'vi'
                      ? 'Giá Bán Thấp Nhất (Sell Min)'
                      : 'Sell Order (Min)'}
                  </th>
                  <th className="py-2.5 px-3 text-right">
                    {lang === 'vi'
                      ? 'Giá Thu Mua Cao Nhất (Buy Max)'
                      : 'Buy Order (Max)'}
                  </th>
                  <th className="py-2.5 px-3 text-right">
                    {lang === 'vi' ? 'Chênh Lệch' : 'Spread'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/60 text-xs">
                {marketRows.map((row) => {
                  const isCheapest =
                    marketArbitrage?.cheapest.city === row.city;
                  const isHighest = marketArbitrage?.highest.city === row.city;
                  const spreadPercent =
                    row.buyPriceMax > 0
                      ? (
                          ((row.sellPriceMin - row.buyPriceMax) /
                            row.buyPriceMax) *
                          100
                        ).toFixed(1)
                      : '0.0';

                  return (
                    <tr
                      key={row.city}
                      className="bg-bg-elevated/40 hover:bg-bg-elevated transition-colors"
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: row.color }}
                          />
                          <div>
                            <div className="font-display font-bold text-text-primary flex items-center gap-1.5">
                              <span>{row.city}</span>
                              {isCheapest && (
                                <span className="px-1.5 py-0.2 text-[9px] font-mono rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                  {lang === 'vi' ? 'MUA RẺ' : 'BEST BUY'}
                                </span>
                              )}
                              {isHighest && (
                                <span className="px-1.5 py-0.2 text-[9px] font-mono rounded bg-accent-primary/20 text-accent-primary border border-border-gold/40">
                                  {lang === 'vi' ? 'GIÁ ĐỈNH' : 'BEST SELL'}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-text-muted">
                              {lang === 'vi' ? row.bonus_vi : row.bonus_en}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-bold text-text-primary">
                        {row.sellPriceMin.toLocaleString('en-US')}{' '}
                        <span className="text-[10px] font-normal text-text-muted">
                          Ag
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right font-mono text-text-secondary">
                        {row.buyPriceMax.toLocaleString('en-US')}{' '}
                        <span className="text-[10px] font-normal text-text-muted">
                          Ag
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right font-mono text-xs text-accent-primary">
                        +{spreadPercent}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT (5 cols): CRAFTING / REFINING PROFIT & FOCUS CALCULATOR */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-bg-secondary border border-border-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-accent-primary" />
              <h3 className="font-display font-bold text-base text-accent-primary">
                {lang === 'vi'
                  ? 'Máy Tính Lợi Nhuận Chế Tạo & Focus'
                  : 'Crafting & Focus Profit Calculator'}
              </h3>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-bg-primary text-accent-primary border border-border-gold/40">
              RRR: {craftingMetrics.rrrPercent}%
            </span>
          </div>

          {/* Interactive Toggles: Focus + Premium Tax + Bonus City */}
          <div className="space-y-2.5">
            {/* Toggle 1: Focus */}
            <button
              type="button"
              onClick={() => setUseFocus(!useFocus)}
              className={[
                'w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between',
                useFocus
                  ? 'bg-bg-elevated border-border-gold shadow-rpg-gold'
                  : 'bg-bg-primary border-border-subtle',
              ].join(' ')}
            >
              <div className="flex items-center gap-2.5">
                <Flame
                  className={`w-4 h-4 ${
                    useFocus ? 'text-accent-primary' : 'text-text-muted'
                  }`}
                />
                <div>
                  <div className="font-sans font-bold text-xs text-text-primary">
                    {lang === 'vi'
                      ? 'Sử dụng Điểm Tập Trung (Focus Crafting)'
                      : 'Use Crafting Focus (Focus Toggle)'}
                  </div>
                  <div className="text-[11px] text-text-secondary">
                    {lang === 'vi'
                      ? 'Tăng mạnh tỷ lệ hoàn trả nguyên liệu (RRR lên tới 47.9%)'
                      : 'Boosts Resource Return Rate (RRR up to 47.9%)'}
                  </div>
                </div>
              </div>
              <span
                className={[
                  'px-2.5 py-1 rounded text-xs font-mono font-bold',
                  useFocus
                    ? 'bg-accent-primary text-bg-primary'
                    : 'bg-bg-secondary text-text-muted',
                ].join(' ')}
              >
                {useFocus ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Toggle 2: Premium Tax */}
            <button
              type="button"
              onClick={() => setHasPremium(!hasPremium)}
              className={[
                'w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between',
                hasPremium
                  ? 'bg-bg-elevated border-emerald-500/60'
                  : 'bg-bg-primary border-border-subtle',
              ].join(' ')}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck
                  className={`w-4 h-4 ${
                    hasPremium ? 'text-emerald-400' : 'text-text-muted'
                  }`}
                />
                <div>
                  <div className="font-sans font-bold text-xs text-text-primary">
                    {lang === 'vi'
                      ? 'Tài Khoản Có Premium (Giảm 50% Thuế Chợ)'
                      : 'Active Premium Status (50% Lower Market Tax)'}
                  </div>
                  <div className="text-[11px] text-text-secondary font-mono">
                    {hasPremium
                      ? lang === 'vi'
                        ? 'Thuế 4% + Phí đặt lệnh 2.5% (Tổng 6.5%)'
                        : '4% Sales Tax + 2.5% Setup Fee (6.5% Total)'
                      : lang === 'vi'
                        ? 'Thuế 8% + Phí đặt lệnh 2.5% (Tổng 10.5%)'
                        : '8% Sales Tax + 2.5% Setup Fee (10.5% Total)'}
                  </div>
                </div>
              </div>
              <span
                className={[
                  'px-2.5 py-1 rounded text-xs font-mono font-bold',
                  hasPremium
                    ? 'bg-emerald-500 text-bg-primary'
                    : 'bg-accent-crimson text-white',
                ].join(' ')}
              >
                {hasPremium ? '6.5%' : '10.5%'}
              </span>
            </button>

            {/* Toggle 3: Royal Bonus City */}
            <button
              type="button"
              onClick={() => setInBonusCity(!inBonusCity)}
              className={[
                'w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between',
                inBonusCity
                  ? 'bg-bg-elevated border-sky-500/50'
                  : 'bg-bg-primary border-border-subtle',
              ].join(' ')}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles
                  className={`w-4 h-4 ${
                    inBonusCity ? 'text-sky-400' : 'text-text-muted'
                  }`}
                />
                <div>
                  <div className="font-sans font-bold text-xs text-text-primary">
                    {lang === 'vi'
                      ? 'Chế tạo đúng Thành Phố Thưởng (Bonus City)'
                      : 'Craft in Royal Bonus Production City'}
                  </div>
                  <div className="text-[11px] text-text-secondary">
                    {lang === 'vi'
                      ? `Thành phố tối ưu: ${selectedItem.best_city}`
                      : `Recommended Bonus City: ${selectedItem.best_city}`}
                  </div>
                </div>
              </div>
              <span
                className={[
                  'px-2.5 py-1 rounded text-xs font-mono font-bold',
                  inBonusCity
                    ? 'bg-sky-400 text-bg-primary'
                    : 'bg-bg-secondary text-text-muted',
                ].join(' ')}
              >
                {inBonusCity ? 'BONUS' : 'STD'}
              </span>
            </button>
          </div>

          {/* Quantity & Focus per Item Sliders */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[11px] text-text-secondary mb-1">
                {lang === 'vi' ? 'Số lượng chế tạo:' : 'Batch Quantity:'}
              </label>
              <input
                type="number"
                min={1}
                max={999}
                value={craftQuantity}
                onChange={(e) =>
                  setCraftQuantity(Math.max(1, Number(e.target.value) || 1))
                }
                className="w-full px-3 py-1.5 rounded-lg bg-bg-primary border border-border-subtle font-mono text-sm text-text-primary focus:outline-none focus:border-border-gold"
              />
            </div>

            <div>
              <label className="block text-[11px] text-text-secondary mb-1">
                {lang === 'vi' ? 'Điểm Focus / món:' : 'Focus Cost / Item:'}
              </label>
              <input
                type="number"
                min={50}
                max={2000}
                value={focusCostPerItem}
                onChange={(e) =>
                  setFocusCostPerItem(Math.max(50, Number(e.target.value) || 50))
                }
                className="w-full px-3 py-1.5 rounded-lg bg-bg-primary border border-border-subtle font-mono text-sm text-text-primary focus:outline-none focus:border-border-gold"
              />
            </div>
          </div>

          {/* Financial Breakdown Box (Strict JetBrains Mono) */}
          <div className="p-4 rounded-xl bg-bg-primary border border-border-gold/40 space-y-2.5 font-mono text-xs">
            <div className="flex justify-between text-text-secondary">
              <span>
                {lang === 'vi'
                  ? 'Chi phí phôi gốc / món:'
                  : 'Gross Material Cost / item:'}
              </span>
              <span className="text-text-primary">
                {craftingMetrics.rawMaterialCostPerItem.toLocaleString('en-US')}{' '}
                Ag
              </span>
            </div>

            <div className="flex justify-between text-emerald-400">
              <span>
                {lang === 'vi'
                  ? `Hoàn trả nguyên liệu (${craftingMetrics.rrrPercent}%):`
                  : `Returned Materials (${craftingMetrics.rrrPercent}%):`}
              </span>
              <span>
                -
                {craftingMetrics.returnedMaterialValuePerItem.toLocaleString(
                  'en-US'
                )}{' '}
                Ag
              </span>
            </div>

            <div className="flex justify-between text-text-secondary">
              <span>
                {lang === 'vi'
                  ? 'Giá vốn thực tế / món:'
                  : 'Net Production Cost / item:'}
              </span>
              <span className="font-bold text-text-primary">
                {craftingMetrics.netProductionCostPerItem.toLocaleString(
                  'en-US'
                )}{' '}
                Ag
              </span>
            </div>

            <div className="flex justify-between text-red-300">
              <span>
                {lang === 'vi'
                  ? `Thuế chợ (${craftingMetrics.totalTaxRatePercent}%):`
                  : `Market Tax & Fee (${craftingMetrics.totalTaxRatePercent}%):`}
              </span>
              <span>
                -{craftingMetrics.marketTaxPerItem.toLocaleString('en-US')} Ag
              </span>
            </div>

            <div className="pt-2.5 border-t border-border-subtle flex items-center justify-between">
              <span className="font-sans font-bold text-text-primary">
                {lang === 'vi'
                  ? `Tổng Lãi Ròng (${craftQuantity} món):`
                  : `Net Batch Profit (${craftQuantity}x):`}
              </span>
              <span className="text-base sm:text-lg font-extrabold text-accent-primary flex items-center gap-1">
                <Coins className="w-4 h-4" />
                {craftingMetrics.totalBatchProfit >= 0 ? '+' : ''}
                {craftingMetrics.totalBatchProfit.toLocaleString('en-US')} Ag
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-text-secondary pt-1">
              <span>
                {lang === 'vi' ? 'Biên lợi nhuận:' : 'Profit Margin:'}{' '}
                <strong className="text-emerald-400">
                  +{craftingMetrics.profitMarginPercent}%
                </strong>
              </span>
              {useFocus && (
                <span>
                  {lang === 'vi' ? 'Hiệu suất Focus:' : 'Silver / Focus:'}{' '}
                  <strong className="text-accent-primary">
                    {craftingMetrics.silverPerFocus.toLocaleString('en-US')} Ag /
                    Focus
                  </strong>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

