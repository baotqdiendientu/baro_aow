'use client';

import React from 'react';
import {
  AlbionEnchantment,
  AlbionHandedness,
  AlbionQuality,
  AlbionTier,
} from '@/types/albion';
import {
  ENCHANTMENT_METADATA,
  QUALITY_METADATA,
  TIER_HEX_MAP,
  buildUniqueName,
  getTierRoman,
} from '@/services/ao-api';
import { AlbionImage } from './AlbionImage';

export interface ItemSlotProps {
  baseIdentifier: string; // e.g., MAIN_1HCROSSBOW or T4_MAIN_1HCROSSBOW
  name: string;
  tier: AlbionTier;
  defaultTier?: AlbionTier;
  enchantment?: AlbionEnchantment;
  quality?: AlbionQuality;
  handedness?: AlbionHandedness;
  selected?: boolean;
  disabled?: boolean;
  size?: 'responsive' | 'sm' | 'md' | 'lg';
  priority?: boolean;
  showHandednessBadge?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const SIZE_CLASSES: Record<NonNullable<ItemSlotProps['size']>, string> = {
  // Mobile 40x40px to 48x48px (w-10 h-10 to sm:w-12 sm:h-12) / Desktop 64x64px (md:w-16 md:h-16)
  responsive: 'w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16',
  sm: 'w-10 h-10 sm:w-12 sm:h-12',
  md: 'w-12 h-12 sm:w-16 sm:h-16',
  lg: 'w-16 h-16 sm:w-20 sm:h-20',
};

const ENCHANT_GLOW_SHADOW: Record<AlbionEnchantment, string> = {
  0: '',
  1: 'shadow-enchant-1',
  2: 'shadow-enchant-2',
  3: 'shadow-enchant-3',
  4: 'shadow-enchant-4',
};

export const ItemSlot: React.FC<ItemSlotProps> = ({
  baseIdentifier,
  name,
  tier,
  defaultTier = 4,
  enchantment = 0,
  quality = 1,
  handedness,
  selected = false,
  disabled = false,
  size = 'responsive',
  priority = false,
  showHandednessBadge = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const uniqueName = buildUniqueName(baseIdentifier, tier, enchantment);
  const tierHex = TIER_HEX_MAP[tier];
  const enchantMeta = ENCHANTMENT_METADATA[enchantment];
  const qualityMeta = QUALITY_METADATA[quality];
  const romanTier = getTierRoman(tier);

  const handedBadgeText =
    handedness === 'OFFHAND'
      ? 'OFF'
      : handedness && handedness !== 'NONE'
        ? handedness
        : null;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      title={`${name} (${uniqueName} • ${qualityMeta.name_en})`}
      aria-label={`${name} Tier ${tier}.${enchantment}`}
      className={[
        'group relative select-none rounded-md transition-all duration-200 flex items-center justify-center overflow-hidden shrink-0',
        SIZE_CLASSES[size],
        ENCHANT_GLOW_SHADOW[enchantment],
        disabled
          ? 'opacity-35 grayscale cursor-not-allowed'
          : 'cursor-pointer hover:scale-105 active:scale-95',
        selected
          ? 'ring-2 ring-border-gold ring-offset-2 ring-offset-bg-primary'
          : 'hover:ring-1 hover:ring-border-gold/70',
      ].join(' ')}
      style={{
        background: `radial-gradient(circle at 50% 45%, ${tierHex}E6 0%, ${tierHex}99 58%, #0B0E14 100%)`,
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor:
          enchantment > 0
            ? enchantMeta.hex
            : quality > 1
              ? qualityMeta.hex
              : '#364156',
      }}
    >
      {/* Inner RPG corner metallic frame */}
      <span
        className="pointer-events-none absolute inset-[1px] rounded-[4px] border border-white/10"
        style={{
          boxShadow:
            quality >= 4
              ? `inset 0 0 8px ${qualityMeta.hex}55`
              : 'inset 0 1px 2px rgba(255,255,255,0.15)',
        }}
      />

      {/* Top-Left: Roman Numeral Tier Badge (I - VIII) */}
      <span
        className={[
          'z-20 absolute top-0.5 left-1 font-display font-bold leading-none tracking-tighter drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]',
          size === 'lg' ? 'text-[11px]' : 'text-[9px] sm:text-[10px]',
          tier === 8
            ? 'text-bg-primary bg-white/85 px-0.5 rounded-[2px]'
            : 'text-white',
        ].join(' ')}
      >
        {romanTier}
      </span>

      {/* Optional Top-Right: Handedness indicator */}
      {showHandednessBadge && handedBadgeText && (
        <span className="z-20 absolute top-0.5 right-0.5 px-1 py-[1px] text-[8px] font-mono font-bold uppercase rounded bg-bg-primary/85 text-accent-primary border border-border-gold/40 leading-none">
          {handedBadgeText}
        </span>
      )}

      {/* Step 2.3: <AlbionImage /> with Skeleton Shimmer, CDN Hot-Cache & 404 Fallback */}
      <AlbionImage
        uniqueName={baseIdentifier}
        alt={name}
        tier={tier}
        defaultTier={defaultTier}
        enchantment={enchantment}
        quality={1}
        size={size === 'lg' ? 128 : 96}
        priority={priority}
        className="w-[86%] h-[86%] object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] transition-transform duration-200 group-hover:scale-105"
      />

      {/* Bottom Edge: 4 Enchantment Diamonds (.1 to .4) */}
      <div
        className="z-20 absolute bottom-1 inset-x-0 flex items-center justify-center gap-1 pointer-events-none"
        aria-label={`Enchantment level ${enchantment}`}
      >
        {([1, 2, 3, 4] as const).map((level) => {
          const isActive = enchantment >= level;
          const activeColor = ENCHANTMENT_METADATA[enchantment].hex;
          return (
            <span
              key={level}
              className="w-1.5 h-1.5 sm:w-[7px] sm:h-[7px] rotate-45 transition-all duration-200 border"
              style={{
                backgroundColor: isActive
                  ? activeColor
                  : 'rgba(11, 14, 20, 0.78)',
                borderColor: isActive
                  ? '#FFFFFFCC'
                  : 'rgba(156, 163, 175, 0.35)',
                boxShadow: isActive ? `0 0 6px ${activeColor}` : 'none',
              }}
            />
          );
        })}
      </div>
    </button>
  );
};
