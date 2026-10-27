import type { Metadata } from 'next';
import Link from 'next/link';
import { FULL_ALBION_DB } from '@/services/albion-db';
import { getItemImageUrl } from '@/lib/albion-image';
import { ItemTooltip } from '@/components/albion/ItemTooltip';
import { ArrowLeft } from 'lucide-react';

interface ItemPageProps {
  params: Promise<{ uniqueName: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return FULL_ALBION_DB.map((item) => ({
    uniqueName: item.unique_name,
  }));
}

export async function generateMetadata({
  params,
}: ItemPageProps): Promise<Metadata> {
  const { uniqueName } = await params;
  const decoded = decodeURIComponent(uniqueName).toUpperCase();
  const item =
    FULL_ALBION_DB.find(
      (i) =>
        i.unique_name.toUpperCase() === decoded ||
        i.base_identifier.toUpperCase() === decoded
    ) || FULL_ALBION_DB[0];

  const ogImageUrl = getItemImageUrl(item.unique_name, {
    enchantment: item.enchantment,
    quality: item.quality,
    size: 217,
  });

  return {
    title: `${item.name_vi} (${item.name_en} - ${item.unique_name}) | Albion Codex Wiki`,
    description: `${item.lore_vi} Tra cứu chỉ số Item Power, kỹ năng Q/W/E và giá chợ ${item.name_en} trên Albion Codex.`,
    openGraph: {
      title: `${item.name_vi} (${item.name_en}) — Albion Online Wiki`,
      description: item.lore_vi,
      images: [{ url: ogImageUrl, width: 217, height: 217, alt: item.name_en }],
    },
  };
}

export default async function ItemDetailPage({ params }: ItemPageProps) {
  const { uniqueName } = await params;
  const decoded = decodeURIComponent(uniqueName).toUpperCase();
  const item =
    FULL_ALBION_DB.find(
      (i) =>
        i.unique_name.toUpperCase() === decoded ||
        i.base_identifier.toUpperCase() === decoded
    ) || FULL_ALBION_DB[0];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/items"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-bg-secondary hover:bg-bg-elevated text-xs font-medium text-accent-primary border border-border-gold/50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Kho Vật Phẩm (/items)</span>
          </Link>
          <span className="text-xs font-mono text-text-muted">
            Programmatic SEO Route: /item/{item.unique_name}
          </span>
        </div>

        <ItemTooltip item={item} lang="vi" />
      </div>
    </div>
  );
}
