'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { AlbionEnchantment, AlbionQuality, AlbionTier } from '@/types/albion';
import { getItemImageUrl, getLocalItemImageUrl } from '@/lib/albion-image';
import { ShieldAlert } from 'lucide-react';

const FAILED_IMAGE_CACHE = new Set<string>();

export interface AlbionImageProps {
  uniqueName: string;
  alt: string;
  tier?: AlbionTier;
  defaultTier?: AlbionTier;
  enchantment?: AlbionEnchantment | number;
  quality?: AlbionQuality | number;
  size?: number;
  priority?: boolean;
  className?: string;
}

/**
 * Step 2.3: <AlbionImage /> with instant (<2ms) local static icon rendering
 * and automatic multi-stage fallback to remote Render CDN when needed.
 */
export const AlbionImage: React.FC<AlbionImageProps> = ({
  uniqueName,
  alt,
  tier,
  defaultTier = 4,
  enchantment = 0,
  quality = 1,
  size = 96,
  className = 'w-[86%] h-[86%] object-contain',
}) => {
  const candidateUrls = useMemo(() => {
    // 1. Instant local pre-cached icon for target tier (or defaultTier if target tier doesn't exist locally)
    const localTargetTier = getLocalItemImageUrl(uniqueName, tier);
    const localDefaultTier = getLocalItemImageUrl(uniqueName, defaultTier);

    // 2. Remote Render CDN URLs (for enchanted sprites or fallback)
    const remoteRequested = getItemImageUrl(uniqueName, {
      tier,
      enchantment,
      quality,
      size,
      preferRemote: true,
    });
    const remoteBaseTier = getItemImageUrl(uniqueName, {
      tier,
      enchantment: 0,
      quality: 1,
      size,
      preferRemote: true,
    });
    const remoteDefaultTier = getItemImageUrl(uniqueName, {
      tier: defaultTier,
      enchantment: 0,
      quality: 1,
      size,
      preferRemote: true,
    });

    // Always prioritize local cached icon first when enchantment === 0 (or as instant fallback)
    const ordered =
      enchantment === 0
        ? [
            localTargetTier,
            localDefaultTier,
            remoteBaseTier,
            remoteDefaultTier,
          ]
        : [
            localTargetTier,
            localDefaultTier,
            remoteRequested,
            remoteBaseTier,
            remoteDefaultTier,
          ];

    const unique = Array.from(new Set(ordered)).filter(
      (url) => !FAILED_IMAGE_CACHE.has(url)
    );
    return unique.length > 0 ? unique : [remoteDefaultTier];
  }, [uniqueName, tier, defaultTier, enchantment, quality, size]);

  const [candidateIndex, setCandidateIndex] = useState(0);
  const [allFailed, setAllFailed] = useState(false);

  useEffect(() => {
    setCandidateIndex(0);
    setAllFailed(false);
  }, [candidateUrls]);

  const activeUrl = candidateUrls[candidateIndex] ?? candidateUrls[0];

  if (allFailed) {
    return (
      <div className="z-10 flex flex-col items-center justify-center text-text-primary/80">
        <ShieldAlert className="w-5 h-5 text-accent-primary" />
        <span className="text-[8px] font-mono">T{tier ?? defaultTier}</span>
      </div>
    );
  }

  return (
    <img
      src={activeUrl}
      alt={alt}
      decoding="async"
      onError={() => {
        FAILED_IMAGE_CACHE.add(activeUrl);
        if (candidateIndex + 1 < candidateUrls.length) {
          setCandidateIndex(candidateIndex + 1);
        } else {
          setAllFailed(true);
        }
      }}
      className={['z-10', className].join(' ')}
    />
  );
};

