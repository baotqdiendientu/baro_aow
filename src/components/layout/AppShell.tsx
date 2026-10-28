'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  AlbionEnchantment,
  AlbionItem,
  AlbionQuality,
  AlbionTier,
} from '@/types/albion';
import {
  calculateDynamicItemStats,
  getTierRoman,
  parseAlbionSearchQuery,
} from '@/services/ao-api';
import { normalizeSearchText } from '@/services/albion-db';
import { AppLanguage, UI_TRANSLATIONS } from '@/i18n/translations';
import { ItemSlot } from '@/components/albion/ItemSlot';
import { ThemeToggle } from '@/components/albion/ThemeToggle';
import { MobileBottomNav } from '@/components/albion/MobileBottomNav';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Command,
  Compass,
  Coins,
  ExternalLink,
  Globe,
  Layers,
  Minimize2,
  Maximize2,
  Palette,
  Search,
  Shield,
  Sparkles,
  Swords,
  X,
} from 'lucide-react';

export type ActiveAppSection = 'demo' | 'loadout' | 'market' | 'tokens';

interface AppShellProps {
  items: AlbionItem[];
  onSelectSearchResult: (
    item: AlbionItem,
    tier?: AlbionTier,
    enchantment?: AlbionEnchantment
  ) => void;
  activeSection: ActiveAppSection;
  setActiveSection: (section: ActiveAppSection) => void;
  compactMode: boolean;
  setCompactMode: (compact: boolean) => void;
  lang: AppLanguage;
  setLang: (lang: AppLanguage) => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  items,
  onSelectSearchResult,
  activeSection,
  setActiveSection,
  compactMode,
  setCompactMode,
  lang,
  setLang,
  children,
}) => {
  const t = UI_TRANSLATIONS[lang];
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Global Cmd/Ctrl + K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 20);
      } else if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const parsedQuery = useMemo(
    () => parseAlbionSearchQuery(searchQuery),
    [searchQuery]
  );

  const filteredResults = useMemo(() => {
    const qNorm = normalizeSearchText(parsedQuery.textQuery);
    const list = !qNorm
      ? items
      : items.filter((item) => {
          const itemSearch =
            (item as AlbionItem & { search_text?: string }).search_text ||
            normalizeSearchText(
              `${item.unique_name} ${item.name_en} ${item.name_vi} ${item.sub_category_vi}`
            );
          const tokens = qNorm.split(/\s+/).filter(Boolean);
          return tokens.every((tk) => itemSearch.includes(tk));
        });

    if (parsedQuery.tier) {
      const tierFiltered = list.filter((i) => i.tier === parsedQuery.tier);
      if (tierFiltered.length > 0) return tierFiltered.slice(0, 25);
    }
    return list.slice(0, 25);
  }, [items, parsedQuery.textQuery, parsedQuery.tier]);

  const quickSearchExamples =
    lang === 'vi'
      ? [
          'nỏ ánh sáng 6.2',
          'crystal reaper 8.3',
          'bloodletter 7.2',
          'hellion jacket 6.3',
          'shadowcaller 8.4',
        ]
      : [
          'light crossbow 6.2',
          'crystal reaper 8.3',
          'bloodletter 7.2',
          'hellion jacket 6.3',
          'shadowcaller 8.4',
        ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col">
      {/* TOP STICKY COMMAND BAR (Header) */}
      <header className="sticky top-0 z-40 h-16 bg-bg-secondary/95 backdrop-blur-md border-b border-border-subtle px-4 flex items-center justify-between gap-3">
        {/* Brand Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-primary/30 to-bg-elevated border border-border-gold flex items-center justify-center shadow-rpg-gold">
            <Swords className="w-5 h-5 text-accent-primary" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm md:text-base tracking-wider text-text-primary">
                ALBION CODEX
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Full 4-Phase Suite
              </span>
            </div>
            <p className="text-[11px] text-text-muted leading-none mt-0.5">
              {t.brandSubtitle}
            </p>
          </div>
        </div>

        {/* CENTER: Global Command Search (Cmd + K / Ctrl + K) */}
        <div ref={dropdownRef} className="relative flex-1 max-w-xl mx-auto">
          <div
            className={[
              'flex items-center gap-2 bg-bg-primary/90 border rounded-lg px-3 py-2 transition-all',
              searchOpen
                ? 'border-border-gold ring-2 ring-accent-primary/25 shadow-rpg-gold'
                : 'border-border-subtle hover:border-border-gold/50',
            ].join(' ')}
          >
            <Search className="w-4 h-4 text-accent-primary shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onFocus={() => setSearchOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              placeholder={t.searchPlaceholder}
              className="w-full bg-transparent text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-text-muted hover:text-text-primary"
                aria-label={t.clearSearch}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-text-secondary bg-bg-elevated border border-border-subtle rounded shrink-0">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          </div>

          {/* Instant Search Dropdown (<50ms client-side filter + shorthand parser) */}
          {searchOpen && (
            <div className="absolute left-0 right-0 mt-2 rounded-xl bg-bg-elevated border border-border-gold/60 shadow-2xl overflow-hidden z-50">
              {/* Shorthand Parser Status Bar */}
              <div className="px-3.5 py-2 bg-bg-secondary border-b border-border-subtle flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Sparkles className="w-3.5 h-3.5 text-accent-primary" />
                  <span>{t.smartSyntaxLabel}</span>
                  {parsedQuery.tier ? (
                    <span className="px-1.5 py-0.5 font-mono font-bold rounded bg-accent-primary/20 text-accent-primary border border-border-gold/40">
                      Tier {getTierRoman(parsedQuery.tier)} (T{parsedQuery.tier})
                    </span>
                  ) : (
                    <span className="text-text-muted font-mono">
                      {t.defaultBaseTier}
                    </span>
                  )}
                  {parsedQuery.enchantment !== undefined && (
                    <span className="px-1.5 py-0.5 font-mono font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {t.enchantPrefix} .{parsedQuery.enchantment}
                    </span>
                  )}
                </div>
                <span className="font-mono text-[10px] text-emerald-400">
                  {t.instantIndexLabel}
                </span>
              </div>

              {/* Quick Shorthand Pills */}
              <div className="px-3.5 py-2 bg-bg-primary/60 border-b border-border-subtle flex items-center gap-1.5 overflow-x-auto">
                <span className="text-[10px] text-text-muted shrink-0">
                  {t.tryTypingLabel}
                </span>
                {quickSearchExamples.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => setSearchQuery(ex)}
                    className="px-2 py-0.5 text-[11px] font-mono rounded bg-bg-elevated hover:bg-border-gold/20 text-text-secondary hover:text-accent-primary border border-border-subtle transition-colors shrink-0"
                  >
                    {ex}
                  </button>
                ))}
              </div>

              {/* Results List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-border-subtle/60">
                {filteredResults.length > 0 ? (
                  filteredResults.map((item) => {
                    const previewTier = parsedQuery.tier ?? item.tier;
                    const previewEnchant =
                      parsedQuery.enchantment ?? item.enchantment;
                    const stats = calculateDynamicItemStats(
                      item,
                      previewTier,
                      previewEnchant,
                      item.quality as AlbionQuality
                    );
                    const primaryTitle =
                      lang === 'vi' ? item.name_vi : item.name_en;
                    const secondaryTitle =
                      lang === 'vi' ? item.name_en : item.name_vi;

                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          onSelectSearchResult(
                            item,
                            parsedQuery.tier,
                            parsedQuery.enchantment
                          );
                          setSearchOpen(false);
                        }}
                        className="p-3 hover:bg-bg-secondary/90 cursor-pointer flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <ItemSlot
                            baseIdentifier={item.base_identifier}
                            name={item.name_en}
                            tier={previewTier}
                            defaultTier={item.tier}
                            enchantment={previewEnchant}
                            quality={item.quality}
                            size="sm"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-display font-bold text-sm text-text-primary truncate">
                                {primaryTitle}
                              </span>
                              <span className="text-xs text-text-secondary truncate hidden sm:inline">
                                ({secondaryTitle})
                              </span>
                              <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-bg-primary text-accent-primary border border-border-gold/30 shrink-0">
                                T{previewTier}.{previewEnchant}
                              </span>
                            </div>
                            <div className="text-xs text-text-secondary flex items-center gap-2 mt-0.5">
                              <span className="truncate">
                                {lang === 'vi'
                                  ? item.sub_category_vi
                                  : item.sub_category_en}
                              </span>
                              <span>•</span>
                              <span className="font-mono text-text-muted shrink-0">
                                {stats.totalIp} IP
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0 font-mono">
                          <div className="text-xs font-bold text-accent-primary flex items-center justify-end gap-1">
                            <Coins className="w-3 h-3" />
                            {stats.estimatedSilver.toLocaleString('en-US')}
                          </div>
                          <div className="text-[10px] text-text-muted">
                            {item.best_city}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 text-center text-xs text-text-secondary">
                    {t.noItemFoundPrefix} &ldquo;{searchQuery}&rdquo;.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Bilingual Switcher (VI / EN) + Theme Toggle + Compact Mode Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Light / Dark Mode Medieval RPG Theme Toggle */}
          <ThemeToggle />

          {/* VI / EN Segmented Switcher */}
          <div
            className="flex items-center bg-bg-primary p-0.5 rounded-lg border border-border-gold/50 shadow-rpg-gold"
            role="group"
            aria-label="Language Switcher"
          >
            <Globe className="w-3.5 h-3.5 text-accent-primary ml-1.5 mr-1 hidden sm:block" />
            <button
              type="button"
              onClick={() => setLang('vi')}
              className={[
                'px-2.5 py-1 rounded-md text-xs font-mono font-bold transition-all',
                lang === 'vi'
                  ? 'bg-accent-primary text-bg-primary shadow'
                  : 'text-text-secondary hover:text-text-primary',
              ].join(' ')}
            >
              VI
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={[
                'px-2.5 py-1 rounded-md text-xs font-mono font-bold transition-all',
                lang === 'en'
                  ? 'bg-accent-primary text-bg-primary shadow'
                  : 'text-text-secondary hover:text-text-primary',
              ].join(' ')}
            >
              EN
            </button>
          </div>

          <button
            type="button"
            onClick={() => setCompactMode(!compactMode)}
            title={t.compactModeTooltip}
            className={[
              'px-2.5 py-1.5 rounded-lg border text-xs font-sans font-medium flex items-center gap-1.5 transition-all',
              compactMode
                ? 'bg-accent-primary/20 border-border-gold text-accent-primary shadow-rpg-gold'
                : 'bg-bg-elevated border-border-subtle text-text-secondary hover:text-text-primary',
            ].join(' ')}
          >
            {compactMode ? (
              <Maximize2 className="w-3.5 h-3.5" />
            ) : (
              <Minimize2 className="w-3.5 h-3.5" />
            )}
            <span className="hidden md:inline">
              {compactMode ? t.compactModeOn : t.compactModeOff}
            </span>
          </button>
        </div>
      </header>

      {/* BODY: Collapsible Left Sidebar + Main Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* COLLAPSIBLE LEFT SIDEBAR (Hidden on mobile & tablet < 1024px in favor of 100% width + BottomNav) */}
        <aside
          className={[
            'bg-bg-secondary border-r border-border-subtle hidden lg:flex flex-col justify-between transition-all duration-200 shrink-0 select-none',
            sidebarCollapsed ? 'w-16' : 'w-64',
          ].join(' ')}
        >
          <div className="p-3 space-y-6">
            {/* Navigation Group: All 4 Active Modules */}
            <div>
              {!sidebarCollapsed && (
                <div className="px-2.5 mb-2 text-[10px] font-mono uppercase tracking-wider text-text-muted">
                  {t.sidebarPhaseGroup}
                </div>
              )}
              <nav className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => setActiveSection('demo')}
                  className={[
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all',
                    activeSection === 'demo'
                      ? 'bg-bg-elevated text-accent-primary border border-border-gold/50 shadow-rpg-gold'
                      : 'text-text-secondary hover:bg-bg-elevated/60 hover:text-text-primary',
                  ].join(' ')}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Shield className="w-4 h-4 shrink-0 text-accent-primary" />
                    {!sidebarCollapsed && (
                      <span className="truncate">{t.navItemTooltipEngine}</span>
                    )}
                  </div>
                  {!sidebarCollapsed && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent-primary/20 text-accent-primary">
                      P2
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSection('loadout')}
                  className={[
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all',
                    activeSection === 'loadout'
                      ? 'bg-bg-elevated text-accent-primary border border-border-gold/50 shadow-rpg-gold'
                      : 'text-text-secondary hover:bg-bg-elevated/60 hover:text-text-primary',
                  ].join(' ')}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Layers className="w-4 h-4 shrink-0 text-accent-primary" />
                    {!sidebarCollapsed && (
                      <span className="truncate">{t.navLoadoutBuilder}</span>
                    )}
                  </div>
                  {!sidebarCollapsed && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent-primary/20 text-accent-primary">
                      P3
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSection('market')}
                  className={[
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all',
                    activeSection === 'market'
                      ? 'bg-bg-elevated text-accent-primary border border-border-gold/50 shadow-rpg-gold'
                      : 'text-text-secondary hover:bg-bg-elevated/60 hover:text-text-primary',
                  ].join(' ')}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Compass className="w-4 h-4 shrink-0 text-accent-primary" />
                    {!sidebarCollapsed && (
                      <span className="truncate">{t.navMarketTracker}</span>
                    )}
                  </div>
                  {!sidebarCollapsed && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent-primary/20 text-accent-primary">
                      P4
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSection('tokens')}
                  className={[
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all',
                    activeSection === 'tokens'
                      ? 'bg-bg-elevated text-accent-primary border border-border-gold/50 shadow-rpg-gold'
                      : 'text-text-secondary hover:bg-bg-elevated/60 hover:text-text-primary',
                  ].join(' ')}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Palette className="w-4 h-4 shrink-0 text-accent-primary" />
                    {!sidebarCollapsed && (
                      <span className="truncate">{t.navDesignTokens}</span>
                    )}
                  </div>
                  {!sidebarCollapsed && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent-primary/20 text-accent-primary">
                      P1
                    </span>
                  )}
                </button>
              </nav>
            </div>

            {/* Knowledge Hub & Programmatic SEO Routes */}
            {!sidebarCollapsed && (
              <div>
                <div className="px-2.5 mb-2 text-[10px] font-mono uppercase tracking-wider text-text-muted">
                  Knowledge Hub & Playbooks
                </div>
                <div className="space-y-1.5">
                  <Link
                    href="/guides/pve"
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-accent-primary font-bold bg-accent-primary/10 hover:bg-accent-primary/20 border border-border-gold/40 transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <BookOpen className="w-3.5 h-3.5 shrink-0 text-accent-primary" />
                      <span className="truncate">
                        {lang === 'vi'
                          ? 'Cẩm Nang PvE (/guides/pve)'
                          : 'PvE Guides (/guides/pve)'}
                      </span>
                    </div>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </Link>

                  <Link
                    href="/item/T4_MAIN_1HCROSSBOW"
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-text-secondary hover:text-accent-primary bg-bg-primary/50 hover:bg-bg-elevated border border-border-subtle transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Swords className="w-3.5 h-3.5 shrink-0 text-accent-primary" />
                      <span className="truncate font-mono text-[11px]">
                        Playbook: Light Crossbow
                      </span>
                    </div>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </Link>

                  <Link
                    href="/item/T8_2H_SCYTHE_CRYSTAL"
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-text-secondary hover:text-accent-primary bg-bg-primary/50 hover:bg-bg-elevated border border-border-subtle transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Swords className="w-3.5 h-3.5 shrink-0 text-accent-primary" />
                      <span className="truncate font-mono text-[11px]">
                        Playbook: Crystal Reaper
                      </span>
                    </div>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Collapse Sidebar Button */}
          <div className="p-3 border-t border-border-subtle">
            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? t.expandSidebar : t.collapseSidebar}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-bg-primary hover:bg-bg-elevated text-xs text-text-secondary hover:text-text-primary border border-border-subtle transition-colors"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4" />
                  <span>{t.collapseSidebar}</span>
                </>
              )}
            </button>
          </div>
        </aside>

        {/* MAIN VIEWPORT */}
        <main className="flex-1 overflow-y-auto p-3 md:p-6 lg:p-8 pb-24 lg:pb-8">
          <div
            className={[
              'mx-auto transition-all duration-300',
              compactMode
                ? 'max-w-4xl border-x border-dashed border-border-gold/40 px-3 md:px-4'
                : 'max-w-7xl',
            ].join(' ')}
          >
            {children}
          </div>
        </main>
      </div>

      {/* Sticky Mobile Bottom Navigation (< 1024px) */}
      <MobileBottomNav
        activeTab={
          activeSection === 'loadout'
            ? 'build'
            : activeSection === 'market'
              ? 'market'
              : 'home'
        }
        onSelectTab={(tab) => {
          if (tab === 'home') {
            setActiveSection('demo');
            if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (tab === 'items') {
            setActiveSection('demo');
          } else if (tab === 'build') {
            setActiveSection('loadout');
          } else if (tab === 'market') {
            setActiveSection('market');
          }
        }}
        lang={lang}
      />
    </div>
  );
};
