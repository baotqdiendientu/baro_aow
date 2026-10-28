'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { AlbionItem } from '@/types/albion';
import {
  CURRENT_PATCH_VERSION,
  UGCTip,
  WeaponMatchupEntry,
  getWeaponPlaybookForItem,
} from '@/data/schema';
import { normalizeSearchText } from '@/services/albion-db';
import { AppLanguage } from '@/i18n/translations';
import { AlbionImage } from './AlbionImage';
import { ItemSlot } from './ItemSlot';
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BookOpen,
  CheckCircle2,
  Flame,
  MessageSquarePlus,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
  Swords,
  X,
  Zap,
} from 'lucide-react';

export interface WeaponPlaybookProps {
  item: AlbionItem;
  lang?: AppLanguage;
}

export const WeaponPlaybook: React.FC<WeaponPlaybookProps> = ({
  item,
  lang = 'vi',
}) => {
  const playbook = useMemo(() => {
    const qIcon = item.spells.Q?.[0]?.spell_icon || 'Heroic Strike';
    const wIcon = item.spells.W?.[0]?.spell_icon || 'Adrenaline Boost';
    const eIcon =
      item.spells.E?.[0]?.spell_icon || `ITEM:${item.unique_name}`;
    return getWeaponPlaybookForItem(
      item.base_identifier,
      item.name_vi,
      item.name_en,
      qIcon,
      wIcon,
      eIcon
    );
  }, [item]);

  // 1. State for "Check Đối Thủ" (Matchup Quick Check)
  const [opponentQuery, setOpponentQuery] = useState('Bloodletter');

  // Mode/Activity Filter for Combos
  const [selectedActivity, setSelectedActivity] = useState<string>('ALL');

  // 2. State for Interactive Community Tips (Upvotes / Downvotes + Add Tip)
  const [tips, setTips] = useState<UGCTip[]>(playbook.communityTips);
  const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down' | null>>({});
  const [newTipAuthor, setNewTipAuthor] = useState('');
  const [newTipContent, setNewTipContent] = useState('');
  const [showAddTipForm, setShowAddTipForm] = useState(false);

  // Sync tips when item changes
  React.useEffect(() => {
    setTips(playbook.communityTips);
  }, [playbook]);

  // Matchup search filtering
  const matchedOpponents = useMemo(() => {
    const q = normalizeSearchText(opponentQuery);
    if (!q) return [];
    return playbook.matchups.allMatchups.filter((m) => {
      const haystack = normalizeSearchText(
        `${m.opponentName_en} ${m.opponentName_vi} ${m.opponentBaseId} ${m.keyEnemySkill_en} ${m.keyEnemySkill_vi}`
      );
      return haystack.includes(q);
    });
  }, [opponentQuery, playbook.matchups.allMatchups]);

  const handleVote = (tipId: string, direction: 'up' | 'down') => {
    const currentVote = userVotes[tipId] || null;
    setTips((prev) =>
      prev.map((tip) => {
        if (tip.id !== tipId) return tip;
        let up = tip.upvotes;
        let down = tip.downvotes;

        if (currentVote === direction) {
          // Undo vote
          if (direction === 'up') up -= 1;
          else down -= 1;
        } else {
          if (currentVote === 'up') up -= 1;
          if (currentVote === 'down') down -= 1;
          if (direction === 'up') up += 1;
          else down += 1;
        }
        return { ...tip, upvotes: up, downvotes: down };
      })
    );

    setUserVotes((prev) => ({
      ...prev,
      [tipId]: currentVote === direction ? null : direction,
    }));
  };

  const handleAddCommunityTip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTipContent.trim()) return;
    const created: UGCTip = {
      id: `ugc-${Date.now()}`,
      weaponIdentifier: item.base_identifier,
      author: newTipAuthor.trim() || (lang === 'vi' ? 'Chiến Binh Ẩn Danh' : 'Albion Veteran'),
      authorBadge_vi: 'Đóng góp Cộng đồng',
      authorBadge_en: 'Community Contributor',
      content_vi: newTipContent.trim(),
      content_en: newTipContent.trim(),
      upvotes: 1,
      downvotes: 0,
      patchVersion: CURRENT_PATCH_VERSION,
      isOutdated: false,
      createdAt: lang === 'vi' ? 'Vừa xong' : 'Just now',
    };
    setTips((prev) => [created, ...prev]);
    setUserVotes((prev) => ({ ...prev, [created.id]: 'up' }));
    setNewTipContent('');
    setNewTipAuthor('');
    setShowAddTipForm(false);
  };

  const activityTabs = [
    { id: 'ALL', label_vi: 'Tất cả Combo', label_en: 'All Combos' },
    { id: '1V1', label_vi: '1v1 Mists / Corrupted', label_en: '1v1 Mists / Corrupted' },
    { id: 'PVE', label_vi: 'PvE / Dungeon Burst', label_en: 'PvE Burst' },
    { id: 'BRAWL', label_vi: 'Small-Scale / Brawl', label_en: 'Small-Scale / Brawl' },
    { id: 'GANK', label_vi: 'Gank / Roam / ZvZ', label_en: 'Gank / Roam / ZvZ' },
  ];

  const filteredCombos = useMemo(() => {
    if (selectedActivity === 'ALL') return playbook.combos;
    const matches = playbook.combos.filter((c) => {
      if (
        selectedActivity === '1V1' &&
        (c.modeTag.includes('1v1') ||
          c.modeTag.includes('Corrupted') ||
          c.modeTag.includes('Mists'))
      )
        return true;
      if (selectedActivity === 'PVE' && c.modeTag.includes('PvE')) return true;
      if (
        selectedActivity === 'BRAWL' &&
        (c.modeTag.includes('Brawl') || c.modeTag.includes('Small-Scale'))
      )
        return true;
      if (
        selectedActivity === 'GANK' &&
        (c.modeTag.includes('Gank') ||
          c.modeTag.includes('Roam') ||
          c.modeTag.includes('ZvZ'))
      )
        return true;
      return false;
    });
    return matches.length > 0 ? matches : playbook.combos;
  }, [playbook.combos, selectedActivity]);

  const quickEnemyPills = [
    'Bloodletter',
    'Deathgivers',
    'Dual Swords',
    '1H Cursed',
    'Carving Sword',
    'Bow',
    'Battleaxe',
    'Battle Bracers',
    'Druidic Staff',
    '1H Fire Staff',
    'Double Bladed',
    'Great Frost',
  ];

  return (
    <div className="space-y-6">
      {/* ==================================================================== */}
      {/* HEADER BANNER: PLAYSTYLE SUMMARY & POWER SPIKES                      */}
      {/* ==================================================================== */}
      <div className="p-5 rounded-xl bg-bg-secondary border border-border-gold/50 shadow-rpg-gold space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent-primary" />
            <h3 className="font-display font-bold text-base sm:text-lg text-text-primary">
              {lang === 'vi'
                ? `Cẩm Nang Thực Chiến: ${playbook.weaponName_vi}`
                : `Tactical Weapon Playbook: ${playbook.weaponName_en}`}
            </h3>
          </div>
          <span className="px-2.5 py-0.5 text-[11px] font-mono font-bold rounded bg-accent-primary/20 text-accent-primary border border-border-gold/40">
            Patch {CURRENT_PATCH_VERSION}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          {lang === 'vi'
            ? playbook.playstyleSummary_vi
            : playbook.playstyleSummary_en}
        </p>

        {/* Skimmable Power Spikes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
          {(lang === 'vi'
            ? playbook.powerSpikes_vi
            : playbook.powerSpikes_en
          ).map((spike, index) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-bg-primary/80 border border-border-subtle flex items-start gap-2.5"
            >
              <Zap className="w-4 h-4 text-accent-primary shrink-0 mt-0.5" />
              <span className="text-xs text-text-primary leading-snug">
                {spike}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 1. COMBO SEQUENCE UI (<AlbionImage type="spell" /> + "->")           */}
      {/* ==================================================================== */}
      <div className="p-5 rounded-xl bg-bg-secondary border border-border-subtle space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-accent-primary" />
            <h4 className="font-display font-bold text-sm sm:text-base uppercase tracking-wider text-text-primary">
              {lang === 'vi'
                ? '1. Chuỗi Combo Chuẩn Meta (Combo Sequence)'
                : '1. Meta Combo Sequences'}
            </h4>
          </div>
          <span className="text-[11px] font-mono text-text-muted">
            {lang === 'vi'
              ? 'Thực hiện theo thứ tự từ trái sang phải (->)'
              : 'Execute sequence from left to right (->)'}
          </span>
        </div>

        {/* Activity Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {activityTabs.map((tab) => {
            const isActive = selectedActivity === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedActivity(tab.id)}
                className={[
                  'px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all border',
                  isActive
                    ? 'bg-accent-primary text-bg-primary border-border-gold shadow-rpg-gold'
                    : 'bg-bg-primary text-text-secondary border-border-subtle hover:text-text-primary hover:border-border-gold/40',
                ].join(' ')}
              >
                {lang === 'vi' ? tab.label_vi : tab.label_en}
              </button>
            );
          })}
        </div>

        <div className="space-y-4">
          {filteredCombos.map((combo) => (
            <div
              key={combo.id}
              className="p-4 rounded-xl bg-bg-primary/90 border border-border-gold/30 hover:border-border-gold/60 transition-all space-y-3.5"
            >
              {/* Combo Title & Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent-primary" />
                  <h5 className="font-display font-bold text-sm text-text-primary">
                    {lang === 'vi' ? combo.title_vi : combo.title_en}
                  </h5>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono font-bold">
                  <span className="px-2 py-0.5 rounded bg-accent-primary/15 text-accent-primary border border-border-gold/30">
                    {combo.modeTag}
                  </span>
                  <span
                    className={[
                      'px-2 py-0.5 rounded border',
                      combo.difficulty === 'Easy'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : combo.difficulty === 'Medium'
                          ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                          : 'bg-red-500/15 text-red-400 border-red-500/30',
                    ].join(' ')}
                  >
                    {combo.difficulty}
                  </span>
                </div>
              </div>

              {/* Visual Spell Sequence Chain with <AlbionImage type="spell" /> & "->" */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 snap-x scrollbar-none">
                {combo.steps.map((step, idx) => (
                  <React.Fragment key={`${combo.id}-step-${idx}`}>
                    <div className="snap-start shrink-0 flex flex-col items-center p-2.5 rounded-xl bg-bg-secondary border border-border-gold/40 min-w-[118px] max-w-[140px] text-center group hover:border-border-gold transition-all">
                      <div className="relative w-12 h-12 rounded-full border-2 border-border-gold bg-bg-elevated flex items-center justify-center overflow-hidden shadow-rpg-gold">
                        <AlbionImage
                          type="spell"
                          uniqueName={step.spellIcon}
                          slotBadge={step.slotLabel}
                          alt={step.spellName_en}
                          size={64}
                          className="w-full h-full object-cover"
                        />
                        <span className="z-20 absolute -bottom-0.5 inset-x-0 bg-bg-primary/90 text-[9px] font-mono font-extrabold text-accent-primary border-t border-border-gold/40 py-[1px]">
                          {step.slotLabel}
                        </span>
                      </div>

                      <span className="mt-2 font-display font-bold text-[11px] text-text-primary leading-tight line-clamp-1">
                        {lang === 'vi' ? step.spellName_vi : step.spellName_en}
                      </span>
                      {(step.note_vi || step.note_en) && (
                        <span className="mt-0.5 text-[10px] text-text-muted leading-tight line-clamp-2">
                          {lang === 'vi' ? step.note_vi : step.note_en}
                        </span>
                      )}
                    </div>

                    {idx < combo.steps.length - 1 && (
                      <div className="shrink-0 flex flex-col items-center justify-center px-0.5 text-accent-primary font-mono font-bold">
                        <ArrowRight className="w-5 h-5 animate-pulse" />
                        <span className="text-[9px] leading-none">-&gt;</span>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Skimmable Combo Explanation */}
              <p className="text-xs text-text-secondary leading-relaxed bg-bg-secondary/70 p-3 rounded-lg border border-border-subtle">
                {lang === 'vi' ? combo.description_vi : combo.description_en}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. MATCHUP QUICK CHECK ("CHECK ĐỐI THỦ" FOR MISTS / CORRUPTED)       */}
      {/* ==================================================================== */}
      <div className="p-5 rounded-xl bg-bg-secondary border border-border-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <div>
              <h4 className="font-display font-bold text-sm sm:text-base uppercase tracking-wider text-text-primary">
                {lang === 'vi'
                  ? '2. Check Đối Thủ Khẩn Cấp (Mists / Corrupted 1v1)'
                  : '2. Emergency Matchup Quick Check (Mists / Corrupted)'}
              </h4>
              <p className="text-xs text-text-secondary">
                {lang === 'vi'
                  ? 'Gõ tên vũ khí kẻ địch vừa gặp (VD: "Bloodletter", "Deathgivers", "Cursed") để xem ngay cách khắc chế!'
                  : 'Type the enemy weapon you just encountered (e.g., "Bloodletter", "Deathgivers") for instant counter-play!'}
              </p>
            </div>
          </div>
        </div>

        {/* Search Input Bar "Check Đối Thủ" */}
        <div className="space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-accent-primary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={opponentQuery}
              onChange={(e) => setOpponentQuery(e.target.value)}
              placeholder={
                lang === 'vi'
                  ? 'Check Đối Thủ: Nhập tên vũ khí địch (VD: Bloodletter, Deathgivers, Dual Swords, Bow...)'
                  : 'Check Opponent: Type enemy weapon (e.g., Bloodletter, Deathgivers, Dual Swords...)'
              }
              aria-label="Check Đối Thủ"
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-bg-primary border-2 border-border-gold/60 text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary shadow-rpg-gold"
            />
            {opponentQuery && (
              <button
                type="button"
                onClick={() => setOpponentQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Select Opponent Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-mono text-text-muted mr-1">
              {lang === 'vi' ? 'Chọn nhanh đối thủ:' : 'Quick check:'}
            </span>
            {quickEnemyPills.map((pill) => {
              const isSelected =
                opponentQuery.toLowerCase() === pill.toLowerCase();
              return (
                <button
                  key={pill}
                  type="button"
                  onClick={() => setOpponentQuery(pill)}
                  className={[
                    'px-2.5 py-1 rounded-md text-xs font-mono font-semibold transition-all border',
                    isSelected
                      ? 'bg-red-500/20 text-red-300 border-red-500/60 shadow-sm'
                      : 'bg-bg-primary text-text-secondary border-border-subtle hover:border-border-gold/40 hover:text-text-primary',
                  ].join(' ')}
                >
                  {pill}
                </button>
              );
            })}
          </div>
        </div>

        {/* Emergency Red / Orange Counter Alert Cards */}
        {matchedOpponents.length > 0 ? (
          <div className="space-y-3">
            {matchedOpponents.map((enemy) => (
              <EmergencyMatchupCard
                key={enemy.opponentUniqueName}
                enemy={enemy}
                lang={lang}
              />
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-bg-primary/60 border border-border-subtle text-center text-xs text-text-secondary">
            {lang === 'vi'
              ? 'Hãy nhập hoặc chọn một vũ khí ở trên (VD: Bloodletter) để hiển thị thẻ cảnh báo khắc chế khẩn cấp.'
              : 'Select or type an opponent weapon above (e.g., Bloodletter) to display the emergency counter card.'}
          </div>
        )}

        {/* Good Against vs Weak Against Summary Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Good Against */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-display font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {lang === 'vi'
                  ? 'Khắc Chế Tốt (Good Against)'
                  : 'Strong Against (Favorable Matchups)'}
              </span>
            </div>
            <div className="space-y-2">
              {playbook.matchups.goodAgainst.map((m) => (
                <div
                  key={`good-${m.opponentUniqueName}`}
                  onClick={() => setOpponentQuery(m.opponentName_en)}
                  className="p-2.5 rounded-lg bg-bg-primary/80 border border-emerald-500/20 hover:border-emerald-500/50 cursor-pointer flex items-center justify-between gap-2 transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ItemSlot
                      baseIdentifier={m.opponentBaseId}
                      name={m.opponentName_en}
                      tier={8}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <div className="font-display font-bold text-xs text-text-primary truncate">
                        {lang === 'vi' ? m.opponentName_vi : m.opponentName_en}
                      </div>
                      <div className="text-[11px] text-text-secondary line-clamp-1">
                        {lang === 'vi' ? m.defensiveAction_vi : m.defensiveAction_en}
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/item/${m.opponentUniqueName}`}
                    onClick={(e) => e.stopPropagation()}
                    className="px-2 py-1 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono shrink-0 hover:bg-emerald-500/25"
                  >
                    Wiki →
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Weak Against */}
          <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 space-y-3">
            <div className="flex items-center gap-2 text-red-400 font-display font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>
                {lang === 'vi'
                  ? 'Kèo Khó / Thiên Địch (Weak Against)'
                  : 'Weak Against (High Threat Counters)'}
              </span>
            </div>
            <div className="space-y-2">
              {playbook.matchups.weakAgainst.map((m) => (
                <div
                  key={`weak-${m.opponentUniqueName}`}
                  onClick={() => setOpponentQuery(m.opponentName_en)}
                  className="p-2.5 rounded-lg bg-bg-primary/80 border border-red-500/20 hover:border-red-500/50 cursor-pointer flex items-center justify-between gap-2 transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ItemSlot
                      baseIdentifier={m.opponentBaseId}
                      name={m.opponentName_en}
                      tier={8}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <div className="font-display font-bold text-xs text-text-primary truncate">
                        {lang === 'vi' ? m.opponentName_vi : m.opponentName_en}
                      </div>
                      <div className="text-[11px] text-red-300/90 line-clamp-1">
                        {lang === 'vi' ? m.keyEnemySkill_vi : m.keyEnemySkill_en}
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/item/${m.opponentUniqueName}`}
                    onClick={(e) => e.stopPropagation()}
                    className="px-2 py-1 rounded bg-red-500/15 text-red-300 border border-red-500/30 text-[10px] font-mono shrink-0 hover:bg-red-500/25"
                  >
                    Wiki →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 3. COMMUNITY TIPS BOARD (UGCTips + Upvote/Downvote + Outdated Dim)   */}
      {/* ==================================================================== */}
      <div className="p-5 rounded-xl bg-bg-secondary border border-border-subtle space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-accent-primary" />
            <div>
              <h4 className="font-display font-bold text-sm sm:text-base uppercase tracking-wider text-text-primary">
                {lang === 'vi'
                  ? '3. Bảng Mẹo Cộng Đồng (Community Tips Board)'
                  : '3. Community Tips & Tricks Board'}
              </h4>
              <p className="text-xs text-text-secondary">
                {lang === 'vi'
                  ? 'Bình chọn mẹo hữu ích nhất. Các mẹo từ phiên bản Patch cũ sẽ tự động làm mờ cảnh báo.'
                  : 'Upvote verified tips. Tips from older patches are automatically dimmed with an outdated warning.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddTipForm(!showAddTipForm)}
            className="px-3 py-1.5 rounded-lg bg-accent-primary text-bg-primary font-bold text-xs flex items-center gap-1.5 shadow-rpg-gold"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>
              {lang === 'vi' ? 'Đóng góp Mẹo mới' : 'Submit a Tip'}
            </span>
          </button>
        </div>

        {/* Add New Community Tip Form */}
        {showAddTipForm && (
          <form
            onSubmit={handleAddCommunityTip}
            className="p-4 rounded-xl bg-bg-primary border border-border-gold/50 space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={newTipAuthor}
                onChange={(e) => setNewTipAuthor(e.target.value)}
                placeholder={
                  lang === 'vi'
                    ? 'Tên nhân vật Albion của bạn...'
                    : 'Your Albion In-Game Name...'
                }
                className="px-3 py-2 rounded-lg bg-bg-secondary border border-border-subtle text-xs text-text-primary focus:outline-none focus:border-border-gold"
              />
              <div className="sm:col-span-2 flex items-center text-xs font-mono text-emerald-400">
                ✓ Áp dụng cho bản cập nhật hiện tại: {CURRENT_PATCH_VERSION}
              </div>
            </div>
            <textarea
              rows={2}
              value={newTipContent}
              onChange={(e) => setNewTipContent(e.target.value)}
              placeholder={
                lang === 'vi'
                  ? 'Chia sẻ mẹo giữ khoảng cách, canh nội tại hoặc khắc chế đối thủ...'
                  : 'Share a practical combo timing, passive trick, or matchup counter...'
              }
              className="w-full p-3 rounded-lg bg-bg-secondary border border-border-subtle text-xs text-text-primary focus:outline-none focus:border-border-gold"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddTipForm(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-text-secondary hover:text-text-primary"
              >
                {lang === 'vi' ? 'Hủy' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-accent-primary text-bg-primary font-bold text-xs"
              >
                {lang === 'vi' ? 'Đăng Mẹo' : 'Post Tip'}
              </button>
            </div>
          </form>
        )}

        {/* Tips List */}
        <div className="space-y-3">
          {tips.map((tip) => {
            const isOldPatch =
              Boolean(tip.isOutdated) ||
              tip.patchVersion !== CURRENT_PATCH_VERSION;
            const userVote = userVotes[tip.id] || null;
            const score = tip.upvotes - tip.downvotes;

            return (
              <div
                key={tip.id}
                className={[
                  'p-4 rounded-xl border transition-all flex items-start gap-3.5',
                  isOldPatch
                    ? 'bg-bg-primary/40 border-border-subtle/60 opacity-55 hover:opacity-85'
                    : 'bg-bg-primary/90 border-border-subtle hover:border-border-gold/40',
                ].join(' ')}
              >
                {/* Upvote / Downvote Column */}
                <div className="flex flex-col items-center gap-1 bg-bg-secondary px-2 py-1.5 rounded-lg border border-border-subtle shrink-0">
                  <button
                    type="button"
                    onClick={() => handleVote(tip.id, 'up')}
                    aria-label="Upvote"
                    className={[
                      'p-1 rounded transition-colors',
                      userVote === 'up'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'text-text-secondary hover:text-emerald-400',
                    ].join(' ')}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <span
                    className={[
                      'font-mono text-xs font-extrabold',
                      score > 0
                        ? 'text-emerald-400'
                        : score < 0
                          ? 'text-red-400'
                          : 'text-text-secondary',
                    ].join(' ')}
                  >
                    {score > 0 ? `+${score}` : score}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleVote(tip.id, 'down')}
                    aria-label="Downvote"
                    className={[
                      'p-1 rounded transition-colors',
                      userVote === 'down'
                        ? 'bg-red-500/20 text-red-400'
                        : 'text-text-secondary hover:text-red-400',
                    ].join(' ')}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Tip Content */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-xs text-text-primary">
                        {tip.author}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-accent-primary/15 text-accent-primary border border-border-gold/30">
                        {lang === 'vi' ? tip.authorBadge_vi : tip.authorBadge_en}
                      </span>
                      <span className="text-[10px] text-text-muted">
                        • {tip.createdAt}
                      </span>
                    </div>

                    {/* Patch Version Badge with Outdated Warning */}
                    <span
                      className={[
                        'px-2 py-0.5 text-[10px] font-mono font-bold rounded flex items-center gap-1 border',
                        isOldPatch
                          ? 'bg-amber-500/15 text-amber-400 border-amber-500/40'
                          : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
                      ].join(' ')}
                    >
                      {isOldPatch && <AlertTriangle className="w-3 h-3" />}
                      <span>{tip.patchVersion}</span>
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-text-primary leading-relaxed">
                    {lang === 'vi' ? tip.content_vi : tip.content_en}
                  </p>

                  {isOldPatch && (
                    <div className="text-[11px] font-mono text-amber-400/90 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {lang === 'vi'
                          ? 'Cảnh báo: Mẹo này từ bản cập nhật cũ, cơ chế kỹ năng có thể đã thay đổi.'
                          : 'Warning: This tip is from an older patch; spell mechanics may have changed.'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SUB-COMPONENT: EMERGENCY RED/ORANGE COUNTER ALERT CARD
// ============================================================================

const EmergencyMatchupCard: React.FC<{
  enemy: WeaponMatchupEntry;
  lang: AppLanguage;
}> = ({ enemy, lang }) => {
  const isExtreme =
    enemy.threatLevel === 'EXTREME' || enemy.threatLevel === 'HIGH';

  return (
    <div
      className={[
        'p-4 rounded-xl border-2 transition-all space-y-3 relative overflow-hidden',
        isExtreme
          ? 'bg-gradient-to-r from-red-950/55 via-orange-950/35 to-bg-primary border-red-500/70 shadow-[0_0_25px_rgba(239,68,68,0.2)]'
          : 'bg-gradient-to-r from-amber-950/45 via-bg-primary to-bg-primary border-amber-500/60',
      ].join(' ')}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ItemSlot
            baseIdentifier={enemy.opponentBaseId}
            name={enemy.opponentName_en}
            tier={8}
            enchantment={2}
            quality={4}
            size="sm"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 text-[10px] font-mono font-extrabold uppercase rounded bg-red-500 text-white flex items-center gap-1 shadow-sm">
                <AlertTriangle className="w-3 h-3" />
                {lang === 'vi'
                  ? `MỨC ĐỘ NGUY HIỂM: ${enemy.threatLevel}`
                  : `THREAT: ${enemy.threatLevel}`}
              </span>
              <span
                className={[
                  'px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded border',
                  enemy.relation === 'weakAgainst'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : enemy.relation === 'goodAgainst'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40',
                ].join(' ')}
              >
                {lang === 'vi'
                  ? enemy.relation === 'weakAgainst'
                    ? 'Kèo Khó (Thiên Địch)'
                    : enemy.relation === 'goodAgainst'
                      ? 'Kèo Dễ Thở (Khắc Chế)'
                      : 'Kèo Kỹ Năng Ngang Cơ'
                  : enemy.relation === 'weakAgainst'
                    ? 'Unfavorable'
                    : enemy.relation === 'goodAgainst'
                      ? 'Favorable'
                      : 'Skill Matchup'}
              </span>
              <h5 className="font-display font-bold text-sm sm:text-base text-text-primary">
                {lang === 'vi' ? enemy.opponentName_vi : enemy.opponentName_en}
              </h5>
            </div>

            {/* Key Enemy Skill with Spell Icon */}
            <div className="mt-1 flex items-center gap-2 text-xs text-amber-300 font-medium">
              <div className="w-5 h-5 rounded-full overflow-hidden border border-amber-400/60 shrink-0 bg-bg-primary flex items-center justify-center">
                <AlbionImage
                  type="spell"
                  uniqueName={enemy.keyEnemySpellIcon}
                  slotBadge="E"
                  alt={enemy.keyEnemySkill_en}
                  size={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <span>
                {lang === 'vi'
                  ? `Chiêu nguy hiểm nhất: ${enemy.keyEnemySkill_vi}`
                  : `Key Threat Skill: ${enemy.keyEnemySkill_en}`}
              </span>
            </div>
          </div>
        </div>

        <Link
          href={`/item/${enemy.opponentUniqueName}`}
          className="px-3 py-1.5 rounded-lg bg-bg-primary/90 hover:bg-bg-elevated text-accent-primary border border-border-gold/50 text-xs font-mono font-bold transition-all"
        >
          {lang === 'vi' ? 'Xem Chi Tiết Vũ Khí →' : 'Inspect Enemy Weapon →'}
        </Link>
      </div>

      {/* Counter Tip & Defensive Action */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed text-text-primary">
            <strong className="text-red-300 block mb-0.5 uppercase font-mono text-[10px]">
              {lang === 'vi'
                ? 'Cách Khắc Chế Ngay Lập Tức:'
                : 'Immediate Counter-Play:'}
            </strong>
            {lang === 'vi' ? enemy.counterTip_vi : enemy.counterTip_en}
          </div>
        </div>

        <div className="p-3 rounded-lg bg-sky-950/35 border border-sky-500/40 flex items-start gap-2.5">
          <Shield className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed text-text-primary">
            <strong className="text-sky-300 block mb-0.5 uppercase font-mono text-[10px]">
              {lang === 'vi'
                ? 'Trang Bị & Phản Xạ Phòng Thủ Khuyên Dùng:'
                : 'Recommended Defensive Action:'}
            </strong>
            {lang === 'vi'
              ? enemy.defensiveAction_vi
              : enemy.defensiveAction_en}
          </div>
        </div>
      </div>
    </div>
  );
};

