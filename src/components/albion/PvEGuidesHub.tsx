'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  PVE_GUIDES_DB,
  PvEActivityType,
  PvEBossGuide,
  PvERoleGuide,
  PvERoleType,
} from '@/data/schema';
import { AppLanguage } from '@/i18n/translations';
import { ItemSlot } from './ItemSlot';
import { AlbionImage } from './AlbionImage';
import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Coins,
  Compass,
  ExternalLink,
  Flame,
  HeartPulse,
  Shield,
  ShieldAlert,
  Sparkles,
  Swords,
  Users,
} from 'lucide-react';

export type PvETabKey =
  | 'intro'
  | 'ip'
  | 'tank'
  | 'healer'
  | 'dps'
  | 'bosses';

export interface PvEGuidesHubProps {
  lang?: AppLanguage;
}

export const PvEGuidesHub: React.FC<PvEGuidesHubProps> = ({ lang = 'vi' }) => {
  const [activity, setActivity] = useState<PvEActivityType>('Avalonian');
  const [activeTab, setActiveTab] = useState<PvETabKey>('intro');
  const [openBossIds, setOpenBossIds] = useState<Record<string, boolean>>({
    'boss-ava-archmage': true,
    'boss-ava-knight-captain': true,
    'boss-ava-high-general': true,
  });

  const guide = PVE_GUIDES_DB[activity];

  const activitySelector: {
    id: PvEActivityType;
    label_vi: string;
    label_en: string;
    badge: string;
  }[] = [
    {
      id: 'Avalonian',
      label_vi: 'Hầm Ngục Avalonian (20 Người)',
      label_en: 'Avalonian Raid (20-Man)',
      badge: 'ENDGAME RAID',
    },
    {
      id: 'HCE',
      label_vi: 'Viễn Chinh HCE (Lv.15–18)',
      label_en: 'Hardcore Expeditions (HCE)',
      badge: 'SAFE-ZONE ELITE',
    },
    {
      id: 'GroupDungeon',
      label_vi: 'Static & Hầm Ngục Nhóm',
      label_en: 'Group & Static Dungeons',
      badge: '5–7 PLAYERS',
    },
    {
      id: 'Corrupted',
      label_vi: 'Hầm Ngục Tha Hóa (1v1)',
      label_en: 'Corrupted Dungeons (1v1)',
      badge: 'SOLO PVPVE',
    },
  ];

  const horizontalTabs: {
    id: PvETabKey;
    label_vi: string;
    label_en: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'intro',
      label_vi: 'Giới thiệu',
      label_en: 'Introduction',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: 'ip',
      label_vi: 'Yêu cầu IP',
      label_en: 'IP Requirements',
      icon: <Award className="w-4 h-4" />,
    },
    {
      id: 'tank',
      label_vi: 'Build Tank',
      label_en: 'Tank Build',
      icon: <Shield className="w-4 h-4" />,
    },
    {
      id: 'healer',
      label_vi: 'Build Healer',
      label_en: 'Healer Build',
      icon: <HeartPulse className="w-4 h-4" />,
    },
    {
      id: 'dps',
      label_vi: 'Build DPS',
      label_en: 'DPS Build',
      icon: <Swords className="w-4 h-4" />,
    },
    {
      id: 'bosses',
      label_vi: 'Boss Mechanics',
      label_en: 'Boss Mechanics',
      icon: <Flame className="w-4 h-4 text-red-400" />,
    },
  ];

  const toggleBossAccordion = (bossId: string) => {
    setOpenBossIds((prev) => ({
      ...prev,
      [bossId]: !prev[bossId],
    }));
  };

  const getRoleData = (roleType: PvERoleType): PvERoleGuide | undefined => {
    return (
      guide.roles.find((r) => r.role === roleType) || guide.roles[0]
    );
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* ==================================================================== */}
      {/* ACTIVITY TYPE SWITCHER (Avalonian | HCE | GroupDungeon | Corrupted)  */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {activitySelector.map((act) => {
          const isCurrent = activity === act.id;
          return (
            <button
              key={act.id}
              type="button"
              onClick={() => setActivity(act.id)}
              className={[
                'p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-2',
                isCurrent
                  ? 'bg-bg-elevated border-border-gold shadow-rpg-gold ring-1 ring-border-gold/50'
                  : 'bg-bg-secondary border-border-subtle hover:border-border-gold/40',
              ].join(' ')}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-accent-primary/20 text-accent-primary border border-border-gold/30">
                  {act.badge}
                </span>
                <Compass
                  className={[
                    'w-4 h-4',
                    isCurrent ? 'text-accent-primary' : 'text-text-muted',
                  ].join(' ')}
                />
              </div>
              <span className="font-display font-bold text-xs sm:text-sm text-text-primary">
                {lang === 'vi' ? act.label_vi : act.label_en}
              </span>
            </button>
          );
        })}
      </div>

      {/* ==================================================================== */}
      {/* HERO BANNER                                                          */}
      {/* ==================================================================== */}
      <div className="p-5 sm:p-6 rounded-xl bg-bg-secondary border border-border-gold/50 shadow-rpg-gold space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-accent-primary text-bg-primary">
              ALBION PVE KNOWLEDGE HUB • {guide.activityType.toUpperCase()}
            </span>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-text-primary">
              {lang === 'vi' ? guide.title_vi : guide.title_en}
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary">
              {lang === 'vi' ? guide.subtitle_vi : guide.subtitle_en}
            </p>
          </div>

          {/* Quick KPI Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 shrink-0 font-mono text-xs">
            <div className="p-2.5 rounded-lg bg-bg-primary border border-border-subtle">
              <div className="text-[10px] text-text-muted flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-accent-primary" />
                <span>{lang === 'vi' ? 'Quy mô Đội' : 'Party Size'}</span>
              </div>
              <div className="font-bold text-text-primary mt-0.5 text-[11px]">
                {guide.recommendedPartySize}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-bg-primary border border-border-subtle">
              <div className="text-[10px] text-text-muted flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'vi' ? 'Thưởng Fame' : 'Fame Bonus'}</span>
              </div>
              <div className="font-bold text-amber-400 mt-0.5 text-[11px]">
                {guide.fameMultiplierLabel}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-bg-primary border border-border-subtle">
              <div className="text-[10px] text-text-muted flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'vi' ? 'Thu nhập Bạc' : 'Est. Silver'}</span>
              </div>
              <div className="font-bold text-emerald-400 mt-0.5 text-[11px]">
                {guide.silverPerHourLabel}
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================== */}
        {/* 1. HORIZONTAL TABS NAVIGATION (6 TABS)                             */}
        {/* ================================================================== */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 border-t border-border-subtle snap-x scrollbar-none">
          {horizontalTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={[
                  'snap-start shrink-0 px-3.5 py-2.5 rounded-lg font-display font-bold text-xs sm:text-sm flex items-center gap-2 transition-all border',
                  isActive
                    ? 'bg-accent-primary text-bg-primary border-border-gold shadow-rpg-gold'
                    : 'bg-bg-primary/80 text-text-secondary border-border-subtle hover:text-text-primary hover:border-border-gold/40',
                ].join(' ')}
              >
                {tab.icon}
                <span>{lang === 'vi' ? tab.label_vi : tab.label_en}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: GIỚI THIỆU (INTRODUCTION & RAID CHECKLIST)                    */}
      {/* ==================================================================== */}
      {activeTab === 'intro' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 p-5 rounded-xl bg-bg-secondary border border-border-subtle space-y-4">
            <h2 className="font-display font-bold text-base sm:text-lg text-accent-primary flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span>
                {lang === 'vi'
                  ? 'Tổng Quan Hoạt Động & Nguyên Tắc Sống Còn'
                  : 'Activity Overview & Golden Rules'}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-text-primary leading-relaxed">
              {lang === 'vi' ? guide.overview_vi : guide.overview_en}
            </p>

            <div className="pt-2 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => setActiveTab('bosses')}
                className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/50 font-display font-bold text-xs flex items-center gap-2 transition-all"
              >
                <Flame className="w-4 h-4 text-red-400" />
                <span>
                  {lang === 'vi'
                    ? 'Xem Ngay Cơ Chế Boss (Boss Mechanics) →'
                    : 'Jump to Boss Mechanics →'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('dps')}
                className="px-4 py-2 rounded-lg bg-accent-primary/20 hover:bg-accent-primary/30 text-accent-primary border border-border-gold/50 font-display font-bold text-xs flex items-center gap-2 transition-all"
              >
                <Swords className="w-4 h-4" />
                <span>
                  {lang === 'vi'
                    ? 'Xem Cấu Hình DPS Chuẩn Meta →'
                    : 'View Meta DPS Loadout →'}
                </span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 p-5 rounded-xl bg-bg-secondary border border-border-subtle space-y-3">
            <h3 className="font-display font-bold text-sm sm:text-base text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {lang === 'vi'
                  ? 'Checklist Bắt Buộc Trước Khi Vào Cổng'
                  : 'Mandatory Pre-Raid Checklist'}
              </span>
            </h3>
            <div className="space-y-2.5">
              {(lang === 'vi' ? guide.checklist_vi : guide.checklist_en).map(
                (itemText, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-bg-primary/80 border border-border-subtle flex items-start gap-2.5 text-xs text-text-primary"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{itemText}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: YÊU CẦU IP (IP REQUIREMENTS TABLE)                            */}
      {/* ==================================================================== */}
      {activeTab === 'ip' && (
        <div className="p-5 rounded-xl bg-bg-secondary border border-border-subtle space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-accent-primary" />
            <h2 className="font-display font-bold text-base sm:text-lg text-text-primary">
              {lang === 'vi'
                ? 'Bảng Yêu Cầu Item Power (IP) Theo Cấp Độ Bản Đồ'
                : 'Minimum & Optimal Item Power (IP) Thresholds'}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border-gold/40 text-accent-primary font-mono uppercase text-[11px]">
                  <th className="py-3 px-4">
                    {lang === 'vi' ? 'Cấp Độ Map' : 'Map Tier'}
                  </th>
                  <th className="py-3 px-4">Tank IP</th>
                  <th className="py-3 px-4">Healer IP</th>
                  <th className="py-3 px-4">DPS IP</th>
                  <th className="py-3 px-4">
                    {lang === 'vi' ? 'Ghi chú Chiến thuật' : 'Tactical Note'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {guide.ipRequirements.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-bg-primary/60 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-display font-bold text-text-primary">
                      {row.tierLabel}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-sky-400">
                      {row.tankIp}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      {row.healerIp}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                      {row.dpsIp}
                    </td>
                    <td className="py-3.5 px-4 text-text-secondary">
                      {lang === 'vi' ? row.note_vi : row.note_en}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TABS 3, 4, 5: BUILD TANK | BUILD HEALER | BUILD DPS                  */}
      {/* ==================================================================== */}
      {(activeTab === 'tank' ||
        activeTab === 'healer' ||
        activeTab === 'dps') && (
        <RoleBuildShowcase
          roleGuide={getRoleData(
            activeTab === 'tank'
              ? 'Tank'
              : activeTab === 'healer'
                ? 'Healer'
                : 'DPS'
          )}
          lang={lang}
        />
      )}

      {/* ==================================================================== */}
      {/* TAB 6: BOSS MECHANICS ACCORDION (ALERT RED WIPE & SHIELD COUNTER)    */}
      {/* ==================================================================== */}
      {activeTab === 'bosses' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-bg-secondary border border-border-subtle flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              <div>
                <h2 className="font-display font-bold text-base sm:text-lg text-text-primary">
                  {lang === 'vi'
                    ? 'Cẩm Nang Đối Phó Chiêu Thức Boss (Boss Mechanics Accordion)'
                    : 'Interactive Boss Mechanics & Wipe Countermeasures'}
                </h2>
                <p className="text-xs text-text-secondary">
                  {lang === 'vi'
                    ? 'Bấm vào từng Boss để đóng/mở chi tiết. Chú ý biểu tượng Cảnh Báo Đỏ (Wipe cả đội) và biểu tượng Khiên (Cách phòng thủ).'
                    : 'Click any Boss card to expand/collapse mechanics. Watch for Red Alert icons (Raid Wipe) and Shield icons (Countermeasure).'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3.5">
            {guide.bosses.map((boss) => (
              <BossMechanicAccordionCard
                key={boss.id}
                boss={boss}
                isOpen={Boolean(openBossIds[boss.id])}
                onToggle={() => toggleBossAccordion(boss.id)}
                lang={lang}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SUB-COMPONENT: ROLE BUILD SHOWCASE (TANK / HEALER / DPS)
// ============================================================================

const RoleBuildShowcase: React.FC<{
  roleGuide?: PvERoleGuide;
  lang: AppLanguage;
}> = ({ roleGuide, lang }) => {
  if (!roleGuide) return null;

  return (
    <div className="p-5 rounded-xl bg-bg-secondary border border-border-gold/50 shadow-rpg-gold space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border-subtle">
        <div>
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-accent-primary/20 text-accent-primary border border-border-gold/40">
            ROLE: {roleGuide.role.toUpperCase()} • MIN {roleGuide.minIp} IP / OPTIMAL{' '}
            {roleGuide.optimalIp} IP
          </span>
          <h2 className="mt-1.5 font-display font-bold text-lg sm:text-xl text-text-primary">
            {lang === 'vi' ? roleGuide.roleTitle_vi : roleGuide.roleTitle_en}
          </h2>
        </div>

        <Link
          href={roleGuide.suggestedBuild}
          className="px-4 py-2 rounded-lg bg-accent-primary text-bg-primary font-display font-bold text-xs flex items-center gap-2 shadow-rpg-gold hover:opacity-95 transition-all"
        >
          <span>
            {lang === 'vi'
              ? 'Mở Trong Công Cụ Lắp Build 10 Ô'
              : 'Open in 10-Slot Loadout Builder'}
          </span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Duty Summary & Rotation Tip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-bg-primary/80 border border-border-subtle space-y-1.5">
          <div className="text-xs font-mono font-bold uppercase text-accent-primary">
            {lang === 'vi' ? 'Nhiệm vụ Trọng tâm:' : 'Core Role Duty:'}
          </div>
          <p className="text-xs sm:text-sm text-text-primary leading-relaxed">
            {lang === 'vi'
              ? roleGuide.dutySummary_vi
              : roleGuide.dutySummary_en}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-bg-primary/80 border border-border-gold/30 space-y-1.5">
          <div className="text-xs font-mono font-bold uppercase text-emerald-400">
            {lang === 'vi'
              ? 'Chuỗi Kỹ Năng (Rotation Chuẩn):'
              : 'Optimal Spell Rotation:'}
          </div>
          <p className="text-xs sm:text-sm text-text-primary leading-relaxed">
            {lang === 'vi'
              ? roleGuide.rotationTip_vi
              : roleGuide.rotationTip_en}
          </p>
        </div>
      </div>

      {/* Recommended Core Equipment Grid */}
      <div>
        <h3 className="text-xs font-mono uppercase tracking-wider text-text-secondary mb-3">
          {lang === 'vi'
            ? 'Trang Bị Cốt Lõi Khuyên Dùng (Click để xem chi tiết & Mẹo khắc chế):'
            : 'Recommended Core Gear Slots (Click to inspect):'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {roleGuide.equipment.map((eq) => (
            <Link
              key={eq.slot}
              href={`/item/${eq.uniqueName}`}
              className="p-3 rounded-xl bg-bg-primary/90 border border-border-subtle hover:border-border-gold transition-all flex items-center gap-3 group"
            >
              <ItemSlot
                baseIdentifier={eq.uniqueName}
                name={eq.name_en}
                tier={eq.tier}
                enchantment={eq.enchantment}
                quality={eq.quality}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-mono uppercase text-accent-primary">
                  {eq.slot} • T{eq.tier}.{eq.enchantment}
                </span>
                <div className="font-display font-bold text-xs text-text-primary truncate group-hover:text-accent-primary transition-colors">
                  {lang === 'vi' ? eq.name_vi : eq.name_en}
                </div>
                <div className="text-[11px] text-text-secondary truncate mt-0.5">
                  {lang === 'vi' ? eq.keySpell_vi : eq.keySpell_en}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SUB-COMPONENT: BOSS MECHANIC ACCORDION CARD
// ============================================================================

const BossMechanicAccordionCard: React.FC<{
  boss: PvEBossGuide;
  isOpen: boolean;
  onToggle: () => void;
  lang: AppLanguage;
}> = ({ boss, isOpen, onToggle, lang }) => {
  const hasWipe = boss.mechanics.some((m) => m.isWipeMechanic);

  return (
    <div className="rounded-xl bg-bg-secondary border border-border-gold/40 overflow-hidden shadow-rpg-gold transition-all">
      {/* Accordion Header */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-bg-elevated/60 transition-colors"
      >
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-accent-primary/20 text-accent-primary border border-border-gold/30">
              {boss.tierLabel}
            </span>
            {hasWipe && (
              <span className="px-2 py-0.5 text-[10px] font-mono font-extrabold uppercase rounded bg-red-500/20 text-red-400 border border-red-500/40 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>
                  {lang === 'vi'
                    ? 'CÓ CHIÊU WIPE CẢ ĐỘI'
                    : 'CONTAINS RAID WIPE MECHANIC'}
                </span>
              </span>
            )}
          </div>

          <h3 className="font-display font-bold text-base sm:text-lg text-text-primary">
            {lang === 'vi' ? boss.bossName_vi : boss.bossName_en}
          </h3>
          <p className="text-xs text-text-secondary">
            {lang === 'vi' ? boss.archetype_vi : boss.archetype_en}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-mono text-accent-primary hidden sm:inline">
            {isOpen
              ? lang === 'vi'
                ? 'Thu gọn'
                : 'Collapse'
              : lang === 'vi'
                ? 'Xem chiêu thức'
                : 'Expand Mechanics'}
          </span>
          <div className="w-8 h-8 rounded-full bg-bg-primary border border-border-gold/40 flex items-center justify-center text-accent-primary">
            {isOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </div>
      </button>

      {/* Accordion Body */}
      {isOpen && (
        <div className="p-4 sm:p-5 pt-0 border-t border-border-subtle/60 space-y-4">
          <p className="pt-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
            {lang === 'vi' ? boss.summary_vi : boss.summary_en}
          </p>

          <div className="space-y-3">
            {boss.mechanics.map((mech) => (
              <div
                key={mech.id}
                className={[
                  'p-4 rounded-xl border space-y-3',
                  mech.isWipeMechanic
                    ? 'bg-red-950/25 border-red-500/50'
                    : 'bg-bg-primary/80 border-border-subtle',
                ].join(' ')}
              >
                {/* Skill Header */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full border border-border-gold bg-bg-elevated overflow-hidden flex items-center justify-center shrink-0">
                      <AlbionImage
                        type="spell"
                        uniqueName={mech.spellIcon}
                        slotBadge="!"
                        alt={mech.skillName_en}
                        size={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-display font-bold text-sm text-text-primary">
                      {lang === 'vi' ? mech.skillName_vi : mech.skillName_en}
                    </h4>
                  </div>

                  {mech.isWipeMechanic && (
                    <span className="px-2.5 py-1 rounded-md bg-red-500 text-white font-mono font-extrabold text-[10px] uppercase flex items-center gap-1 shadow-sm">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>
                        {lang === 'vi'
                          ? 'CẢNH BÁO ĐỎ: WIPE (CHẾT CẢ TEAM)'
                          : 'RED ALERT: FULL RAID WIPE'}
                      </span>
                    </span>
                  )}
                </div>

                {/* Telegraph (Alert Icon) & Countermeasure (Shield Icon) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Dấu hiệu nhận biết - Red Alert Icon */}
                  <div className="p-3 rounded-lg bg-red-950/35 border border-red-500/40 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div className="text-xs leading-relaxed text-text-primary">
                      <strong className="text-red-300 block mb-0.5 uppercase font-mono text-[10px]">
                        {lang === 'vi'
                          ? 'Dấu Hiệu Nhận Biết (Telegraph):'
                          : 'Visual Telegraph & Warning:'}
                      </strong>
                      {lang === 'vi' ? mech.telegraph_vi : mech.telegraph_en}
                    </div>
                  </div>

                  {/* Cách phòng thủ / Đối phó - Shield Icon */}
                  <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/40 flex items-start gap-2.5">
                    <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs leading-relaxed text-text-primary">
                      <strong className="text-emerald-300 block mb-0.5 uppercase font-mono text-[10px]">
                        {lang === 'vi'
                          ? 'Cách Phòng Thủ & Hóa Giải (Countermeasure):'
                          : 'Defensive Countermeasure:'}
                      </strong>
                      {lang === 'vi'
                        ? mech.countermeasure_vi
                        : mech.countermeasure_en}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

