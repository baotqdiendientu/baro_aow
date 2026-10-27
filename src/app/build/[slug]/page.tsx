import type { Metadata } from 'next';
import Link from 'next/link';
import { SAMPLE_ALBION_ITEMS } from '@/data/sample-items';
import { getItemRenderUrl } from '@/services/ao-api';
import { LoadoutBuilder } from '@/components/albion/LoadoutBuilder';
import { ArrowLeft } from 'lucide-react';

interface BuildPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    { slug: 'light-crossbow-pve' },
    { slug: 'crystal-reaper-brawl' },
    { slug: 'druidic-avalon' },
    { slug: 'shadowcaller-static' },
    { slug: 'light-crossbow-cryptcandle-mists' },
  ];
}

export async function generateMetadata({
  params,
}: BuildPageProps): Promise<Metadata> {
  const { slug } = await params;
  const formattedTitle = slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const mainWeapon =
    SAMPLE_ALBION_ITEMS.find((i) =>
      slug.toLowerCase().includes(i.name_en.toLowerCase().split(' ')[0])
    ) || SAMPLE_ALBION_ITEMS[0];

  const ogImageUrl = getItemRenderUrl(mainWeapon.base_identifier, {
    tier: mainWeapon.tier,
    enchantment: mainWeapon.enchantment,
    quality: mainWeapon.quality,
    size: 217,
  });

  return {
    title: `${formattedTitle} Build Guide — Albion Online Loadout | Albion Codex`,
    description: `Hướng dẫn lắp Build ${formattedTitle} chuẩn Meta trong Albion Online: 10 ô trang bị, kỹ năng Q/W/E/Passive, Item Power và chi phí bạc.`,
    openGraph: {
      title: `${formattedTitle} — Albion Online Meta Loadout`,
      description: mainWeapon.lore_vi,
      images: [
        { url: ogImageUrl, width: 217, height: 217, alt: mainWeapon.name_en },
      ],
    },
  };
}

export default async function BuildDetailPage({ params }: BuildPageProps) {
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-bg-secondary hover:bg-bg-elevated text-xs font-medium text-accent-primary border border-border-gold/50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Albion Codex Dashboard</span>
          </Link>
          <span className="text-xs font-mono text-text-muted">
            Programmatic SEO Route: /build/{slug}
          </span>
        </div>

        <LoadoutBuilder lang="vi" />
      </div>
    </div>
  );
}

