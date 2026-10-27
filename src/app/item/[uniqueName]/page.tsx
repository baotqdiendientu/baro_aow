import type { Metadata } from 'next';
import { FULL_ALBION_DB } from '@/services/albion-db';
import { getItemImageUrl } from '@/lib/albion-image';
import { ItemDetailClientView } from '@/components/albion/ItemDetailClientView';

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
    description: `${item.lore_vi} Tra cứu chỉ số Item Power, kỹ năng Q/W/E, chuỗi Combo và khắc chế ${item.name_en} trên Albion Codex.`,
    openGraph: {
      title: `${item.name_vi} (${item.name_en}) — Albion Online Wiki & Playbook`,
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

  return <ItemDetailClientView item={item} />;
}
