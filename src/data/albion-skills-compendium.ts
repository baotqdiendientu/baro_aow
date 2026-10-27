import { AlbionSpell, SpellSlotKey } from '@/types/albion';
import { RawSyncedAlbionItem } from '@/services/albion-db';
import { EXACT_SIGNATURE_SKILLS } from './albion-signature-skills';
import {
  WEAPON_FAMILY_SPELL_REGISTRY,
  resolveWeaponFamily,
} from './albion-spells';

export interface CompendiumSkillSet {
  spells: {
    Q: AlbionSpell[];
    W: AlbionSpell[];
    E: AlbionSpell[];
    PASSIVE: AlbionSpell[];
  };
  default_spells: Record<SpellSlotKey, string>;
  lore_vi?: string;
  lore_en?: string;
}

/**
 * Helper to create a complete spell object cleanly.
 */
function sp(
  id: string,
  slot: SpellSlotKey,
  spell_icon: string,
  name_en: string,
  name_vi: string,
  cooldown: number,
  energy_cost: number,
  cast_time_en: string,
  cast_time_vi: string,
  range_en: string,
  range_vi: string,
  description_vi: string,
  description_en: string
): AlbionSpell {
  return {
    id,
    slot,
    spell_icon,
    name_en,
    name_vi,
    cooldown,
    energy_cost,
    cast_time_en,
    cast_time_vi,
    range_en,
    range_vi,
    description_vi,
    description_en,
  };
}

/**
 * Builds an exact signature E/D/R/Passive spell from EXACT_SIGNATURE_SKILLS when available,
 * falling back to the provided fallback spell.
 */
function buildSignatureOrFallback(
  raw: RawSyncedAlbionItem,
  slot: SpellSlotKey,
  fallbackSpell: AlbionSpell
): AlbionSpell {
  const exact = EXACT_SIGNATURE_SKILLS[raw.base_identifier.toUpperCase()];
  if (!exact) return fallbackSpell;

  return sp(
    `sig-${slot.toLowerCase()}-${raw.id}`,
    slot,
    exact.icon || `ITEM:${raw.unique_name}`,
    exact.name_en,
    exact.name_vi,
    exact.cooldown,
    exact.energy,
    exact.cast_en,
    exact.cast_vi,
    exact.range_en,
    exact.range_vi,
    exact.desc_vi,
    exact.desc_en
  );
}

/**
 * Generates authentic, detailed Q / W / E / Passive (or Active / Passive) skills
 * for any of the 1,702 Albion Online items based on its weapon/armor/consumable family and specific item ID.
 */
export function resolveEquipmentSkillSet(
  raw: RawSyncedAlbionItem
): CompendiumSkillSet {
  // If weapon belongs to a defined WeaponLine (Axe, Sword, Crossbow, Bow, Nature, Fire, Frost, etc.),
  // inherit shared Q, W, Passive spell pool and resolve the signature E
  if (raw.slot_type === 'MainHand') {
    const familyId = resolveWeaponFamily(raw.base_identifier);
    const family = WEAPON_FAMILY_SPELL_REGISTRY[familyId];
    if (family) {
      const exact = EXACT_SIGNATURE_SKILLS[raw.base_identifier.toUpperCase()];
      const fallbackE: AlbionSpell = {
        id: `e-${raw.id}`,
        slot: 'E',
        spell_icon: exact?.icon || `ITEM:${raw.unique_name}`,
        name_en: exact?.name_en || `${raw.name_en} Signature`,
        name_vi: exact?.name_vi || `Kỹ năng tối thượng ${raw.name_vi}`,
        cooldown: exact?.cooldown ?? 20,
        energy_cost: exact?.energy ?? 15,
        cast_time_en: exact?.cast_en ?? 'Instant',
        cast_time_vi: exact?.cast_vi ?? 'Tức thì',
        range_en: exact?.range_en ?? '11m',
        range_vi: exact?.range_vi ?? '11m',
        description_vi: exact?.desc_vi ?? `Kỹ năng tối thượng đặc trưng của ${raw.name_vi}.`,
        description_en: exact?.desc_en ?? `Signature ultimate ability of ${raw.name_en}.`,
      };
      const eSpell = buildSignatureOrFallback(raw, 'E', fallbackE);

      return {
        spells: {
          Q: family.slotQ,
          W: family.slotW,
          E: [eSpell],
          PASSIVE: family.passives,
        },
        default_spells: {
          Q: family.slotQ[0]?.id || '',
          W: family.slotW[0]?.id || '',
          E: eSpell.id,
          PASSIVE: family.passives[0]?.id || '',
        },
        lore_vi: exact?.desc_vi || `Vũ khí thuộc nhánh ${family.name_vi} trong Albion Online.`,
        lore_en: exact?.desc_en || `Weapon from ${family.name_en} weapon line in Albion Online.`,
      };
    }
  }

  const baseResult = resolveBaseEquipmentSkillSet(raw);
  const exact = EXACT_SIGNATURE_SKILLS[raw.base_identifier.toUpperCase()];

  if (exact) {
    if (raw.slot_type === 'Cape' || raw.slot_type === 'OffHand') {
      const sigPassive = buildSignatureOrFallback(
        raw,
        'PASSIVE',
        baseResult.spells.PASSIVE[0]
      );
      baseResult.spells.PASSIVE = [
        sigPassive,
        ...baseResult.spells.PASSIVE.slice(1),
      ];
      baseResult.default_spells.PASSIVE = sigPassive.id;
    } else if (baseResult.spells.E.length > 0) {
      const sigE = buildSignatureOrFallback(raw, 'E', baseResult.spells.E[0]);
      baseResult.spells.E = [sigE, ...baseResult.spells.E.slice(1)];
      baseResult.default_spells.E = sigE.id;
    }
  }

  return baseResult;
}

function resolveBaseEquipmentSkillSet(
  raw: RawSyncedAlbionItem
): CompendiumSkillSet {
  const base = raw.base_identifier.toUpperCase();
  const itemIcon = `ITEM:${raw.unique_name}`;

  // ============================================================================
  // 1. WEAPON TREES (MainHand: 1H & 2H)
  // ============================================================================
  if (raw.slot_type === 'MainHand') {
    // A. CROSSBOWS
    if (base.includes('CROSSBOW')) {
      const qSpells = [
        sp(
          'cb-q1',
          'Q',
          'Explosive Bolt',
          'Explosive Bolt',
          'Tên Nổ Diện Rộng (Explosive Bolt)',
          2,
          5,
          '0.4s',
          '0.4 giây',
          '13m',
          '13m',
          'Bắn mũi tên phát nổ trên đường thẳng gây sát thương vật lý diện rộng trong bán kính 2.5m. Rất mạnh để kích nội tại Chuẩn Bị Kỹ Lưỡng (Well-Prepared).',
          'Fires an explosive bolt in a line dealing AoE physical damage within 2.5m. Ideal for proccing Well-Prepared.'
        ),
        sp(
          'cb-q2',
          'Q',
          'Auto Fire',
          'Auto Fire',
          'Liên Xạ Tốc Độ Cao (Auto Fire)',
          3.5,
          6,
          'Channel 1.9s',
          'Duy trì 1.9s',
          '11.5m',
          '11.5m',
          'Xả liên tiếp 5 loạt tên vào mục tiêu trong 1.9 giây trong khi vẫn có thể di chuyển, gây sát thương đơn mục tiêu cực lớn.',
          'Channels a barrage of 5 bolts over 1.9s while moving, dealing high single-target physical damage.'
        ),
      ];
      const wSpells = [
        sp(
          'cb-w1',
          'W',
          'CALTROPS',
          'Caltrops',
          'Bẫy Chông Sắt (Caltrops)',
          10,
          9,
          'Instant',
          'Tức thì',
          '11m',
          '11m',
          'Ném bẫy chông làm chậm 50% kẻ địch dẫm phải trong 4s và tăng 35% tốc chạy cho bản thân trong 2.5s.',
          'Deploys a caltrops trap that slows enemies by 50% for 4s and boosts your move speed by 35%.'
        ),
        sp(
          'cb-w2',
          'W',
          'Sunder Shot',
          'Sunder Shot',
          'Tên Phá Giáp (Sunder Shot)',
          7,
          8,
          '0.6s',
          '0.6 giây',
          '13m',
          '13m',
          'Bắn mũi tên xuyên phá làm giảm mạnh Giáp và Kháng Phép của mục tiêu trong 6 giây.',
          'Piercing shot that shreds target Armor and Magic Resistance for 6 seconds.'
        ),
        sp(
          'cb-w3',
          'W',
          'Noise Eraser',
          'Noise Eraser',
          'Tên Câm Lặng (Noise Eraser)',
          15,
          12,
          '0.4s',
          '0.4 giây',
          '13m',
          '13m',
          'Bắn mũi tên gây Câm Lặng (Silence) kẻ địch trong 3.7 giây và ngắt chiêu lập tức.',
          'Silences the target for 3.7s and interrupts active spellcasting.'
        ),
      ];
      const eSpell = sp(
        `cb-e-${raw.id}`,
        'E',
        base.includes('1HCROSSBOW') ? 'Exploding Shot' : itemIcon,
        `${raw.name_en} Signature (E)`,
        `Tuyệt Kỹ E: ${raw.name_vi}`,
        18,
        16,
        '0.5s',
        '0.5 giây',
        '14m',
        '14m',
        `Kỹ năng dồn sát thương chủ lực của ${raw.name_vi}: Gây sát thương vật lý xuyên giáp tầm xa cực mạnh. Kết hợp hoàn hảo với nội tại Well-Prepared và Áo Choàng Caerleon.`,
        `Signature burst ability of ${raw.name_en}: Unleashes high-impact ranged physical damage. Synergizes with Well-Prepared and Caerleon Cape.`
      );
      const passives = [
        sp(
          'cb-p1',
          'PASSIVE',
          'Well-Prepared',
          'Well-Prepared',
          'Chuẩn Bị Kỹ Lưỡng (Reset Q)',
          0,
          0,
          'Passive',
          'Nội tại',
          'Self',
          'Bản thân',
          'Mỗi khi dùng 4 kỹ năng bất kỳ, kỹ năng Q (Ô 1) sẽ được xóa hồi chiêu ngay lập tức.',
          'Every 4 spells cast, immediately resets the cooldown of your Q ability.'
        ),
      ];
      return {
        spells: { Q: qSpells, W: wSpells, E: [eSpell], PASSIVE: passives },
        default_spells: {
          Q: 'cb-q1',
          W: 'cb-w1',
          E: eSpell.id,
          PASSIVE: 'cb-p1',
        },
      };
    }

    // B. BOWS
    if (base.includes('BOW')) {
      const qSpells = [
        sp(
          'bow-q1',
          'Q',
          'Multishot',
          'Multishot',
          'Tên Chùm Đẩy Lùi (Multishot)',
          3,
          6,
          'Instant',
          'Tức thì',
          '12m Cone',
          'Hình nón 12m',
          'Bắn chùm tên hình nón gây sát thương vật lý diện rộng và đẩy lùi các mục tiêu áp sát.',
          'Fires a cone of arrows dealing AoE physical damage and knocking back close enemies.'
        ),
        sp(
          'bow-q2',
          'Q',
          'Deadly Shot',
          'Deadly Shot',
          'Mũi Tên Xuyên Tâm (Deadly Shot)',
          2.5,
          5,
          '0.3s',
          '0.3 giây',
          '16m',
          '16m',
          'Bắn mũi tên tầm xa xuyên qua kẻ địch trên đường thẳng và làm giảm kháng vật lý của mục tiêu.',
          'Long-range piercing arrow that damages enemies in a line and shreds physical resistance.'
        ),
      ];
      const wSpells = [
        sp(
          'bow-w1',
          'W',
          'Ray of Light',
          'Ray of Light',
          'Mưa Tên Ánh Sáng (Ray of Light)',
          14,
          11,
          'Instant',
          'Tức thì',
          '14m',
          '14m',
          'Bắn luồng tên ánh sáng lên trời rơi xuống vùng chỉ định, gây sát thương và trói chân (Root) mọi kẻ địch.',
          'Calls down a pillar of light arrows at target area, damaging and rooting all enemies hit.'
        ),
        sp(
          'bow-w2',
          'W',
          'Frost Shot',
          'Frost Shot',
          'Nhảy Lùi Băng Giá (Frost Shot)',
          15,
          10,
          'Instant',
          'Tức thì',
          '11m Leap',
          'Nhảy lùi 11m',
          'Bắn tên băng làm chậm 40% kẻ địch và bật nhảy lùi 11m về phía sau để thả diều.',
          'Shoots a frost arrow slowing foes by 40% while leaping 11m backwards.'
        ),
        sp(
          'bow-w3',
          'W',
          'Explosive Arrows',
          'Explosive Arrows',
          'Tên Cường Hóa Nổ (Explosive Arrows)',
          15,
          10,
          'Instant',
          'Tức thì',
          'Self',
          'Bản thân',
          'Cường hóa 6 đòn bắn tiếp theo phát nổ gây thêm sát thương phép diện rộng quanh mục tiêu.',
          'Empowers your next 6 attacks to explode on impact, dealing bonus AoE magic damage.'
        ),
      ];
      const eSpell = sp(
        `bow-e-${raw.id}`,
        'E',
        base.includes('KEEPER') ? 'Raging Storm' : itemIcon,
        `${raw.name_en} Signature (E)`,
        `Tuyệt Kỹ E: ${raw.name_vi}`,
        20,
        18,
        '0.4s',
        '0.4 giây',
        '15m',
        '15m',
        `Tuyệt kỹ tầm xa đặc trưng của ${raw.name_vi}: Phát huy sức mạnh cấu rỉa, khống chế diện rộng hoặc dồn sát thương từ cự ly an toàn.`,
        `Signature long-range ability of ${raw.name_en}: Delivers high-impact ranged burst or area denial from a safe distance.`
      );
      const passives = [
        sp(
          'bow-p1',
          'PASSIVE',
          'Energetic',
          'Energetic',
          'Tràn Trề Năng Lượng',
          0,
          0,
          'Passive',
          'Nội tại',
          'Self',
          'Bản thân',
          'Mỗi đòn bắn thường hồi lại Năng lượng (Energy) cho bản thân.',
          'Every normal attack restores Energy.'
        ),
      ];
      return {
        spells: { Q: qSpells, W: wSpells, E: [eSpell], PASSIVE: passives },
        default_spells: {
          Q: 'bow-q1',
          W: 'bow-w1',
          E: eSpell.id,
          PASSIVE: 'bow-p1',
        },
      };
    }

    // C. AXES & SCYTHES
    if (base.includes('AXE') || base.includes('SCYTHE') || base.includes('HALBERD')) {
      const qSpells = [
        sp(
          'axe-q1',
          'Q',
          'Rending Rage',
          'Rending Rage',
          'Liên Trảm Xé Xác (Rending Rage)',
          3,
          6,
          'Instant',
          'Tức thì',
          '4m',
          '4m',
          'Chuỗi 3 đòn bổ liên hoàn: lướt nhẹ về phía trước tích cộng dồn chảy máu Rending Bleed và trói chân ở đòn thứ 3.',
          '3-hit combo dashing forward, applying Rending Bleed stacks and rooting targets on the final slam.'
        ),
        sp(
          'axe-q2',
          'Q',
          'Rending Spin',
          'Rending Spin',
          'Xoay Rìu Chảy Máu (Rending Spin)',
          2.5,
          5,
          'Instant',
          'Tức thì',
          '5m AoE',
          '5m Diện rộng',
          'Xoay rìu 360 độ gây sát thương vật lý diện rộng, tích tầng chảy máu và giảm 12% hiệu lực hồi máu của địch.',
          'Swings in a 5m circle applying Rending Bleed and reducing enemy healing received by 12%.'
        ),
      ];
      const wSpells = [
        sp(
          'axe-w1',
          'W',
          'Adrenaline Boost',
          'Adrenaline Boost',
          'Bùng Nổ Adrenaline (Adrenaline Boost)',
          15,
          11,
          'Instant',
          'Tức thì',
          'Self',
          'Bản thân',
          'Tăng 45% tốc chạy, 25% sát thương và 40% tốc đánh trong 4 giây.',
          'Increases move speed by 45%, damage by 25%, and attack speed by 40% for 4s.'
        ),
        sp(
          'axe-w2',
          'W',
          'Raging Blades',
          'Raging Blades',
          'Lưỡi Đao Cuồng Loạn (Raging Blades)',
          15,
          13,
          'Instant',
          'Tức thì',
          '6m AoE',
          '6m Diện rộng',
          'Quét lưỡi rìu quanh bản thân, tăng mạnh sát thương vật lý với mỗi kẻ địch trúng đòn.',
          'Slashes all nearby enemies and boosts your physical damage per target hit.'
        ),
      ];
      const eSpell = sp(
        `axe-e-${raw.id}`,
        'E',
        base.includes('AVALON') ? 'Aftershock' : itemIcon,
        `${raw.name_en} Signature (E)`,
        `Tuyệt Kỹ E: ${raw.name_vi}`,
        20,
        18,
        '0.3s',
        '0.3 giây',
        '9m',
        '9m',
        `Tuyệt kỹ cận chiến đặc trưng của ${raw.name_vi}: Gây sát thương vật lý diện rộng lớn, xuyên kháng 50% và kích hoạt hiệu ứng vết thương sâu/giảm máu tối đa.`,
        `Signature melee cleave of ${raw.name_en}: Deals heavy AoE physical damage with 50% resilience penetration and applies deep grievous wounds.`
      );
      const passives = [
        sp(
          'axe-p1',
          'PASSIVE',
          'Deep Cuts',
          'Deep Cuts',
          'Vết Cắt Sâu (Chảy Máu)',
          0,
          0,
          'Passive',
          'Nội tại',
          'Self',
          'Bản thân',
          'Sau mỗi 4 đòn đánh thường, mục tiêu bị xuất huyết nhận thêm sát thương theo thời gian trong 3 giây.',
          'Every 4 normal attacks inflicts a bleeding wound dealing damage over 3s.'
        ),
        sp(
          'axe-p2',
          'PASSIVE',
          'Life Leech',
          'Life Leech',
          'Hút Sinh Lực (Life Leech)',
          0,
          0,
          'Passive',
          'Nội tại',
          'Self',
          'Bản thân',
          'Hồi máu bằng 10% lượng sát thương gây ra từ đòn đánh thường.',
          'Heals you for 10% of normal attack damage dealt.'
        ),
      ];
      return {
        spells: { Q: qSpells, W: wSpells, E: [eSpell], PASSIVE: passives },
        default_spells: {
          Q: 'axe-q1',
          W: 'axe-w1',
          E: eSpell.id,
          PASSIVE: 'axe-p1',
        },
      };
    }

    // D. SWORDS & CLEAVERS
    if (base.includes('SWORD') || base.includes('CLEAVER') || base.includes('CLAYMORE')) {
      const qSpells = [
        sp(
          'sw-q1',
          'Q',
          'Heroic Strike',
          'Heroic Strike',
          'Nhát Chém Anh Hùng (Heroic Strike)',
          2.5,
          5,
          'Instant',
          'Tức thì',
          '3.5m',
          '3.5m',
          'Chém mạnh vào mục tiêu và tích 1 tầng Heroic Charge (tối đa 3 tầng), mỗi tầng tăng 12% tốc chạy và tốc đánh.',
          'Strikes target and grants 1 Heroic Charge (up to 3 stacks), boosting move and attack speed by 12% per charge.'
        ),
        sp(
          'sw-q2',
          'Q',
          'Heroic Cleave',
          'Heroic Cleave',
          'Bổ Ngang Anh Hùng (Heroic Cleave)',
          3,
          6,
          'Instant',
          'Tức thì',
          '5m Cone',
          'Hình nón 5m',
          'Chém quét diện rộng phía trước và tích 1 tầng Heroic Charge khi trúng ít nhất 1 mục tiêu.',
          'Cleaves a 5m cone in front of you and grants 1 Heroic Charge on hit.'
        ),
      ];
      const wSpells = [
        sp(
          'sw-w1',
          'W',
          'Iron Will',
          'Iron Will',
          'Ý Chí Sắt Đá (Iron Will)',
          15,
          9,
          'Instant',
          'Tức thì',
          'Self',
          'Bản thân',
          'Tích ngay 1 tầng Heroic Charge, tăng phòng thủ và miễn nhiễm hiệu ứng Thanh Trừng (Purge Immune) trong 3.5 giây.',
          'Grants 1 Heroic Charge, increases defense, and makes your buffs unpurgeable for 3.5s.'
        ),
        sp(
          'sw-w2',
          'W',
          'Splitting Slash',
          'Splitting Slash',
          'Nhát Chém Chẻ Đôi (Splitting Slash)',
          14,
          11,
          '0.4s',
          '0.4 giây',
          '10m Line',
          'Đường thẳng 10m',
          'Phóng kiếm khí thẳng về phía trước gây sát thương và trói chân (Root) mọi kẻ địch trúng chiêu.',
          'Sends a shockwave in a 10m line, damaging and rooting all enemies hit.'
        ),
        sp(
          'sw-w3',
          'W',
          'Parry Strike',
          'Parry Strike',
          'Đỡ Đòn Phản Kiếm (Parry Strike)',
          16,
          10,
          'Channel 0.8s',
          'Đỡ đòn 0.8s',
          '5m AoE',
          '5m Diện rộng',
          'Giơ kiếm miễn nhiễm mọi sát thương và khống chế trong 0.8s, sau đó phản đòn làm choáng kẻ địch xung quanh.',
          'Blocks all incoming damage and CC for 0.8s, then counter-slashes and stuns nearby foes.'
        ),
      ];
      const eSpell = sp(
        `sw-e-${raw.id}`,
        'E',
        base.includes('CLEAVER_HELL') ? 'Fearless Strike' : itemIcon,
        `${raw.name_en} Signature (E)`,
        `Tuyệt Kỹ E: ${raw.name_vi}`,
        20,
        16,
        'Instant',
        'Tức thì',
        '10m',
        '10m',
        `Tuyệt kỹ kiếm pháp của ${raw.name_vi}: Tiêu thụ toàn bộ cộng dồn Heroic Charge để khuếch đại tối đa sát thương vật lý và hiệu ứng khống chế/phá giáp.`,
        `Signature sword technique of ${raw.name_en}: Consumes Heroic Charges to unleash maximum physical burst and armor shred.`
      );
      const passives = [
        sp(
          'sw-p1',
          'PASSIVE',
          'Heroic Fighting',
          'Heroic Fighting',
          'Đấu Pháp Anh Hùng',
          0,
          0,
          'Passive',
          'Nội tại',
          'Self',
          'Bản thân',
          'Mỗi 4 đòn đánh thường tự động tích thêm 1 tầng Heroic Charge.',
          'Every 4 normal attacks automatically generates 1 Heroic Charge.'
        ),
      ];
      return {
        spells: { Q: qSpells, W: wSpells, E: [eSpell], PASSIVE: passives },
        default_spells: {
          Q: 'sw-q1',
          W: 'sw-w1',
          E: eSpell.id,
          PASSIVE: 'sw-p1',
        },
      };
    }

    // E. DAGGERS & CLAWS
    if (base.includes('DAGGER') || base.includes('CLAW') || base.includes(' RAPIER')) {
      const qSpells = [
        sp(
          'dag-q1',
          'Q',
          'Assassin Spirit',
          'Assassin Spirit',
          'Tinh Thần Sát Thủ (Assassin Spirit)',
          2,
          3,
          'Instant',
          'Tức thì',
          'Self',
          'Bản thân',
          'Tích 1 cộng dồn Sát Thủ (tối đa 3 cộng dồn), mỗi cộng dồn tăng 6% sát thương gây ra.',
          'Grants an Assassin Spirit charge (up to 3 stacks), increasing all damage dealt by 6% per stack.'
        ),
      ];
      const wSpells = [
        sp(
          'dag-w1',
          'W',
          'Chain Slash',
          'Chain Slash',
          'Liên Hoàn Trảm (Chain Slash)',
          15,
          12,
          'Instant',
          'Tức thì',
          '9m',
          '9m',
          'Lướt nhanh qua các mục tiêu trong trạng thái miễn nhiễm chọn mục tiêu (Iframe), gây sát thương và làm chậm.',
          'Untargetable chain dash across nearby enemies dealing physical damage and slowing them.'
        ),
        sp(
          'dag-w2',
          'W',
          'Throwing Blades',
          'Throwing Blades',
          'Phi Tiêu Đoạt Mệnh (Throwing Blades)',
          12,
          10,
          'Instant',
          'Tức thì',
          '12m Cone',
          'Hình nón 12m',
          'Phóng phi tiêu làm chậm kẻ địch và tăng mạnh tốc chạy + sát thương cho bản thân.',
          'Throws blades in a cone, slowing enemies and boosting your move speed and damage.'
        ),
      ];
      const eSpell = sp(
        `dag-e-${raw.id}`,
        'E',
        base.includes('DAGGER_HELL') ? 'Lunging Stabs' : itemIcon,
        `${raw.name_en} Signature (E)`,
        `Tuyệt Kỹ Ám Sát E: ${raw.name_vi}`,
        22,
        16,
        'Instant',
        'Tức thì',
        '11m',
        '11m',
        `Tuyệt kỹ kết liễu của ${raw.name_vi}: Lướt áp sát hoặc dồn sát thương chí mạng cực lớn theo số tầng Assassin Spirit đang tích trữ.`,
        `Signature execution ability of ${raw.name_en}: Delivers high-mobility burst scaling with active Assassin Spirit stacks.`
      );
      const passives = [
        sp(
          'dag-p1',
          'PASSIVE',
          'Deep Cuts',
          'Deep Cuts',
          'Vết Cắt Sâu',
          0,
          0,
          'Passive',
          'Nội tại',
          'Self',
          'Bản thân',
          'Mỗi 4 đòn đánh thường gây hiệu ứng xuất huyết theo thời gian.',
          'Every 4 normal attacks inflicts a bleeding wound over time.'
        ),
      ];
      return {
        spells: { Q: qSpells, W: wSpells, E: [eSpell], PASSIVE: passives },
        default_spells: {
          Q: 'dag-q1',
          W: 'dag-w1',
          E: eSpell.id,
          PASSIVE: 'dag-p1',
        },
      };
    }

    // F1. HOLY STAFFS (Dedicated Healer / Smite DPS)
    if (base.includes('HOLYSTAFF') || base.includes('DIVINESTAFF')) {
      const qSpells = [
        sp(
          'holy-q1',
          'Q',
          'Rejuvenation',
          'Generous Heal',
          'Hồi Máu Hào Phóng (Generous Heal)',
          2,
          5,
          '0.8s',
          '0.8 giây',
          '11m',
          '11m',
          'Niệm phép hồi phục ngay lập tức một lượng máu lớn cho đồng minh hoặc bản thân.',
          'Heals a friendly target for a large immediate amount of HP.'
        ),
        sp(
          'holy-q2',
          'Q',
          'Cleanse Heal',
          'Flash Heal',
          'Tia Sáng Hồi Máu Nhanh (Flash Heal)',
          1.2,
          4,
          '0.4s',
          '0.4 giây',
          '11m',
          '11m',
          'Hồi máu tốc độ cao cho mục tiêu và tăng 6% hiệu lực nhận máu (cộng dồn tối đa 3 lần).',
          'Fast-casting heal that stacks a +6% healing received buff up to 3 times.'
        ),
        sp(
          'holy-q3',
          'Q',
          'Ray of Light',
          'Smite',
          'Thánh Phạt Trừng Giới (Smite)',
          2,
          5,
          '0.7s',
          '0.7 giây',
          '13m',
          '13m',
          'Giáng cột sáng trừng phạt gây sát thương phép lớn và giảm kháng phép của kẻ địch (dùng khi Solo PvE/Corrupted Dungeon).',
          'Calls down a pillar of holy light dealing magic damage and shredding enemy resistances.'
        ),
      ];
      const wSpells = [
        sp(
          'holy-w1',
          'W',
          'Protection of Nature',
          'Holy Blessing',
          'Phước Lành Thánh Quang (Holy Blessing)',
          12,
          10,
          'Instant',
          'Tức thì',
          '11m',
          '11m',
          'Ban phước lành tăng mạnh Giáp, Kháng Phép và tăng 30% lượng máu hồi nhận vào trong 6 giây.',
          'Blesses an ally, boosting resistances and increasing all healing received by 30% for 6s.'
        ),
        sp(
          'holy-w2',
          'W',
          'Cleanse Heal',
          'Holy Orb',
          'Quả Cầu Thánh Quang (Holy Orb)',
          10,
          11,
          'Instant',
          'Tức thì',
          '14m',
          '14m',
          'Phóng quả cầu ánh sáng phát nổ khi chạm vào đồng minh, hồi máu diện rộng cho cả đội.',
          'Fires a holy orb that explodes on touching an ally, healing all teammates in a 4m radius.'
        ),
      ];
      const eSpell = sp(
        `holy-e-${raw.id}`,
        'E',
        itemIcon,
        `${raw.name_en} Signature (E)`,
        `Tuyệt Kỹ Thánh Quang E: ${raw.name_vi}`,
        18,
        16,
        'Instant',
        'Tức thì',
        '11m',
        '11m',
        `Tuyệt kỹ cứu rỗi của ${raw.name_vi}: Hồi máu tức thời hoặc tạo khiên chắn thánh quang bảo vệ đồng đội trước sát thương dồn.`,
        `Signature holy restoration of ${raw.name_en}: Delivers instant burst healing or divine shielding.`
      );
      const passives = [
        sp(
          'holy-p1',
          'PASSIVE',
          'Energetic',
          'Adrenaline Driven Charity',
          'Lòng Bác Ái (+20% Hồi Máu)',
          0,
          0,
          'Passive',
          'Nội tại',
          'Self',
          'Bản thân',
          'Sau mỗi 4 kỹ năng kích hoạt, tăng 20% toàn bộ hiệu lực hồi máu trong 4 giây.',
          'Every 4 spells cast increases your healing output by 20% for 4 seconds.'
        ),
      ];
      return {
        spells: { Q: qSpells, W: wSpells, E: [eSpell], PASSIVE: passives },
        default_spells: {
          Q: 'holy-q1',
          W: 'holy-w1',
          E: eSpell.id,
          PASSIVE: 'holy-p1',
        },
      };
    }

    // F2. NATURE STAFFS (Healer / Solo Sustain)
    if (base.includes('NATURESTAFF') || base.includes('WILDSTAFF')) {
      const qSpells = [
        sp(
          'nat-q1',
          'Q',
          'Thorn Growth',
          'Thorn Growth',
          'Bụi Gai Độc (Thorn Growth)',
          3,
          6,
          '0.7s',
          '0.7 giây',
          '11m',
          '11m',
          'Triệu hồi thảm gai làm chậm 25% và đặt ấn Gai Độc. Đòn đánh thường kích nổ ấn gây sát thương phép diện rộng cực mạnh khi Solo PvE.',
          'Summons thorns slowing foes by 25% and applying Thorn charges consumed by auto-attacks for AoE magic damage.'
        ),
        sp(
          'nat-q2',
          'Q',
          'Rejuvenation',
          'Rejuvenation',
          'Chồi Non Hồi Phục (Rejuvenation)',
          1.5,
          4,
          'Instant',
          'Tức thì',
          '11m',
          '11m',
          'Đặt ấn hồi máu theo thời gian (HoT) tối đa 3 cộng dồn cho bản thân hoặc đồng minh.',
          'Applies a stacking Heal-over-Time effect (up to 3 stacks) on an ally.'
        ),
      ];
      const wSpells = [
        sp(
          'nat-w1',
          'W',
          'Protection of Nature',
          'Protection of Nature',
          'Sự Bảo Hộ Của Rừng (Protection of Nature)',
          15,
          12,
          'Instant',
          'Tức thì',
          '11m',
          '11m',
          'Tăng Giáp, Kháng Phép và tăng 35% toàn bộ lượng máu nhận vào trong 5 giây.',
          'Increases target Armor & Magic Resistance and boosts all healing received by 35% for 5s.'
        ),
        sp(
          'nat-w2',
          'W',
          'Cleanse Heal',
          'Cleanse Heal',
          'Thanh Tẩy Hồi Phục (Cleanse Heal)',
          14,
          11,
          'Instant',
          'Tức thì',
          '11m',
          '11m',
          'Hồi máu diện rộng và xóa bỏ mọi hiệu ứng khống chế / bất lợi trên người đồng minh.',
          'Heals allies in an area and cleanses all crowd control and debuff effects.'
        ),
      ];
      const eSpell = sp(
        `nat-e-${raw.id}`,
        'E',
        base.includes('KEEPER') ? 'Spiritual Seed' : itemIcon,
        `${raw.name_en} Signature (E)`,
        `Tuyệt Kỹ Hồi Phục E: ${raw.name_vi}`,
        20,
        16,
        'Instant',
        'Tức thì',
        '11m',
        '11m',
        `Tuyệt kỹ sinh mệnh của ${raw.name_vi}: Hồi phục lượng lớn Máu cho bản thân và đồng đội, duy trì khả năng sống sót vượt trội trong giao tranh dài hơi.`,
        `Signature restoration ability of ${raw.name_en}: Provides high-output burst or sustained healing for solo and group content.`
      );
      const passives = [
        sp(
          'nat-p1',
          'PASSIVE',
          'Energetic',
          'Energetic',
          'Tràn Trề Năng Lượng',
          0,
          0,
          'Passive',
          'Nội tại',
          'Self',
          'Bản thân',
          'Mỗi đòn đánh thường hồi lại 5 Năng lượng (Energy).',
          'Every normal attack restores 5 Energy.'
        ),
      ];
      return {
        spells: { Q: qSpells, W: wSpells, E: [eSpell], PASSIVE: passives },
        default_spells: {
          Q: 'nat-q1',
          W: 'nat-w1',
          E: eSpell.id,
          PASSIVE: 'nat-p1',
        },
      };
    }

    // G. CURSED, FIRE, FROST & ARCANE STAFFS (Mage Trees separated)
    if (
      base.includes('CURSED') ||
      base.includes('DEMONIC') ||
      base.includes('SKULLORB') ||
      base.includes('FIRE') ||
      base.includes('INFERNO') ||
      base.includes('FROST') ||
      base.includes('GLACIAL') ||
      base.includes('ICE') ||
      base.includes('ARCANE') ||
      base.includes('ENIGMATIC')
    ) {
      const isCursed =
        base.includes('CURSED') ||
        base.includes('DEMONIC') ||
        base.includes('SKULLORB');
      const isFire = base.includes('FIRE') || base.includes('INFERNO');
      const isFrost =
        base.includes('FROST') ||
        base.includes('GLACIAL') ||
        base.includes('ICE');

      const qSpells = isCursed
        ? [
            sp(
              'cursed-q1',
              'Q',
              'Bane',
              'Vile Curse',
              'Ấn Nguyền Rủa Độc Ác (Vile Curse)',
              1.5,
              4,
              'Instant',
              'Tức thì',
              '11m',
              '11m',
              'Khắc 1 tầng Nguyền Rủa Độc Ác (tối đa 4 tầng) gây sát thương bóng tối theo thời gian mỗi 2 giây.',
              'Applies a Vile Curse charge (up to 4 stacks) dealing shadow damage over time every 2s.'
            ),
            sp(
              'cursed-q2',
              'Q',
              'Spinning Blades',
              'Cursed Sickle',
              'Lưỡi Liềm Nguyền Rủa (Cursed Sickle)',
              5,
              7,
              'Instant',
              'Tức thì',
              '14m Boomerang',
              'Phóng 2 chiều 14m',
              'Phóng lưỡi liềm bóng tối bay đi và quay về, tích 2 tầng Vile Curse lên toàn bộ kẻ địch trên đường bay.',
              'Throws a cursed sickle boomerang that applies Vile Curse stacks on both the outward and return path.'
            ),
            sp(
              'cursed-q3',
              'Q',
              'Desecrate',
              'Cursed Tar',
              'Hắc Ín Nguyền Rủa (Cursed Tar)',
              3.5,
              6,
              '0.4s',
              '0.4 giây',
              '13m (4m AoE)',
              '13m (Vùng 4m)',
              'Tạo vũng hắc ín làm chậm 20% và tự động tích tầng Vile Curse mỗi giây lên mọi kẻ địch đứng trong vùng.',
              'Creates a pool of cursed tar that slows enemies by 20% and applies Vile Curse stacks every second.'
            ),
          ]
        : isFire
          ? [
              sp(
                'fire-q1',
                'Q',
                'Burn',
                'Fire Bolt',
                'Cầu Lửa Thiêu Đốt (Fire Bolt)',
                1.5,
                4,
                '0.7s',
                '0.7 giây',
                '13m',
                '13m',
                'Bắn cầu lửa gây sát thương phép và cộng dồn hiệu ứng Thiêu Đốt (tối đa 3 tầng).',
                'Fires a fireball dealing magic damage and stacking Burn over time (up to 3 stacks).'
              ),
              sp(
                'fire-q2',
                'Q',
                'Fire Wave',
                'Searing Flame',
                'Ngọn Lửa Thiêu Rụi (Searing Flame)',
                2.5,
                5,
                'Instant Skillshot',
                'Định hướng tức thì',
                '16m',
                '16m',
                'Phóng luồng lửa tầm xa 16m phát nổ gây sát thương phép diện rộng lớn.',
                'Launches a long-range searing fireball up to 16m that explodes on impact.'
              ),
            ]
          : isFrost
            ? [
                sp(
                  'frost-q1',
                  'Q',
                  'Frost Shot',
                  'Hoarfrost',
                  'Băng Giá Nổ Diện Rộng (Hoarfrost)',
                  2,
                  5,
                  '0.7s',
                  '0.7 giây',
                  '13m',
                  '13m',
                  'Phóng tinh thể băng phát nổ gây sát thương phép diện rộng và để lại vùng tuyết làm chậm 20%.',
                  'Casts an ice crystal that explodes for AoE magic damage and leaves a slowing frost patch.'
                ),
                sp(
                  'frost-q2',
                  'Q',
                  'Deadly Shot',
                  'Ice Shard',
                  'Mảnh Băng Xuyên Thấu (Ice Shard)',
                  2.2,
                  5,
                  '0.5s',
                  '0.5 giây',
                  '15m',
                  '15m',
                  'Phóng mảnh băng sắc nhọn gây sát thương phép lớn lên mục tiêu chính và văng mảnh băng ra xung quanh.',
                  'Launches a sharp ice shard dealing heavy single-target magic damage and splashing nearby foes.'
                ),
              ]
            : [
                sp(
                  'arc-q1',
                  'Q',
                  'Ray of Light',
                  'Chain Missile',
                  'Tên Lửa Bí Thuật Nảy (Chain Missile)',
                  2.5,
                  5,
                  'Instant',
                  'Tức thì',
                  '13m',
                  '13m',
                  'Bắn tên lửa bí thuật nảy qua 3 mục tiêu, gây sát thương phép và đặt ấn Arcane Charge.',
                  'Fires an arcane missile bouncing up to 3 targets and applying Arcane Charges.'
                ),
                sp(
                  'arc-q2',
                  'Q',
                  'Noise Eraser',
                  'Magic Shock',
                  'Chấn Động Câm Lặng (Magic Shock)',
                  4,
                  6,
                  '0.3s',
                  '0.3 giây',
                  '11m',
                  '11m',
                  'Đánh sập sóng bí thuật gây sát thương phép diện rộng và làm Câm Lặng (Silence) kẻ địch 0.8 giây.',
                  'Strikes target area with arcane energy, dealing magic damage and silencing enemies for 0.8s.'
                ),
              ];

      const wSpells = isCursed
        ? [
            sp(
              'cursed-w1',
              'W',
              'Desecrate',
              'Desecrate',
              'Vùng Đất Ô Uế (Trói Chân Desecrate)',
              15,
              12,
              'Instant',
              'Tức thì',
              '6m AoE',
              '6m Diện rộng',
              'Bùng nổ sóng nguyền rủa quanh bản thân: Trói chân (Root) mọi kẻ địch 2.5 giây và tích thêm 1 tầng Vile Curse.',
              'Erupts cursed energy around you, rooting all enemies for 2.5s and applying 1 Vile Curse stack.'
            ),
            sp(
              'cursed-w2',
              'W',
              'Dark Matter',
              'Dark Matter / Armor Piercer',
              'Tia Xuyên Phá Giáp (Armor Piercer)',
              12,
              10,
              '0.4s',
              '0.4 giây',
              '16m Line',
              'Đường thẳng 16m',
              'Phóng tia bóng tối xuyên qua kẻ địch, gây sát thương phép và làm giảm mạnh Giáp + Kháng Phép trong 5 giây.',
              'Fires a shadow beam piercing enemies in a 16m line and heavily shredding their Armor and Magic Resistance.'
            ),
          ]
        : [
            sp(
              'mage-w1',
              'W',
              'Wall of Flames',
              isFire
                ? 'Wall of Flames'
                : isFrost
                  ? 'Frost Nova (Blink & Freeze)'
                  : 'Enigma Blade (Blink & Shield)',
              isFire
                ? 'Tường Lửa Hoảng Sợ (Wall of Flames)'
                : isFrost
                  ? 'Dịch Chuyển Đóng Băng (Frost Nova)'
                  : 'Kiếm Bí Thuật Dịch Chuyển (Enigma Blade)',
              15,
              12,
              'Instant',
              'Tức thì',
              '11m',
              '11m',
              isFire
                ? 'Dựng bức tường lửa cháy rực làm mọi kẻ địch chạm vào bị Hoảng Sợ (Fear) bỏ chạy.'
                : isFrost
                  ? 'Dịch chuyển tức thời 11m đồng thời đóng băng/trói chân mọi kẻ địch tại vị trí cũ.'
                  : 'Cường hóa kiếm bí thuật và cho phép dịch chuyển tức thời 11m để thả diều hoặc né chiêu.',
              isFire
                ? 'Creates a blazing wall of fire that causes enemies touching it to flee in Fear.'
                : isFrost
                  ? 'Teleports 11m while rooting and damaging all enemies around your starting position.'
                  : 'Conjures an arcane blade and grants a secondary 11m blink.'
            ),
            sp(
              'mage-w2',
              'W',
              'Fire Wave',
              isFire
                ? 'Fire Wave'
                : isFrost
                  ? 'Frost Bomb'
                  : 'Empowering Beam',
              isFire
                ? 'Sóng Lửa Đẩy Lùi (Fire Wave)'
                : isFrost
                  ? 'Bom Băng Làm Chậm (Frost Bomb)'
                  : 'Tia Cường Hóa Sát Thương (Empowering Beam)',
              14,
              11,
              'Instant',
              'Tức thì',
              '12m',
              '12m',
              'Gây sát thương phép diện rộng kèm hiệu ứng đẩy lùi/làm chậm hoặc khuếch đại sát thương cho đồng minh.',
              'Delivers AoE magic control or channels a damage-amplifying beam onto an ally.'
            ),
          ];

      const eSpell = sp(
        `mage-e-${raw.id}`,
        'E',
        itemIcon,
        `${raw.name_en} Signature (E)`,
        `Tuyệt Kỹ Pháp Thuật E: ${raw.name_vi}`,
        20,
        17,
        '0.6s',
        '0.6 giây',
        '14m',
        '14m',
        `Tuyệt kỹ phép thuật tối thượng của ${raw.name_vi}: Bùng nổ năng lượng phép thuật diện rộng, gây sát thương lớn hoặc khống chế chiến thuật trong PvE & PvP.`,
        `Signature spell of ${raw.name_en}: Unleashes high-scaling magical devastation or tactical zone control.`
      );
      const passives = [
        sp(
          'mage-p1',
          'PASSIVE',
          'Energetic',
          'Energetic / Aggressive Caster',
          'Thi Pháp Tốc Độ & Hồi Năng Lượng',
          0,
          0,
          'Passive',
          'Nội tại',
          'Self',
          'Bản thân',
          'Mỗi đòn đánh thường hồi 5 Energy; sau mỗi 4 kỹ năng sẽ tăng 40% tốc độ niệm phép.',
          'Normal attacks restore 5 Energy; every 4 spells cast boosts cast speed by 40%.'
        ),
      ];
      return {
        spells: { Q: qSpells, W: wSpells, E: [eSpell], PASSIVE: passives },
        default_spells: {
          Q: qSpells[0].id,
          W: wSpells[0].id,
          E: eSpell.id,
          PASSIVE: 'mage-p1',
        },
      };
    }

    // H. SPEARS, QUARTERSTAFFS, MACES, HAMMERS, WAR GLOVES, SHAPESHIFTER STAFFS
    const isSpear =
      base.includes('SPEAR') ||
      base.includes('GLAIVE') ||
      base.includes('HARPOON') ||
      base.includes('TRIDENT');
    const isQuarterstaff =
      base.includes('QUARTERSTAFF') ||
      base.includes('DOUBLEBLADED') ||
      base.includes('IRONCLAD') ||
      base.includes('COMBATSTAFF') ||
      base.includes('TWINSCYTHE') ||
      base.includes('ROCKSTAFF');
    const isKnuckles =
      base.includes('KNUCKLES') || base.includes('IRONGAUNTLETS');
    const isShapeshifter = base.includes('SHAPESHIFTER');

    const qSpells = isSpear
      ? [
          sp(
            'spear-q1',
            'Q',
            'Lunging Stabs',
            'Lunging Strike',
            'Đâm Thương Tầm Xa (Lunging Strike)',
            2.5,
            5,
            'Instant',
            'Tức thì',
            '6.5m Cone',
            'Đâm xa 6.5m',
            'Đâm thương về phía trước gây sát thương vật lý, làm chậm 20% kẻ địch và tích 1 tầng Spirit Spear (+28% sát thương đánh thường mỗi tầng, tối đa 3 tầng).',
            'Thrusts your spear forward, slowing enemies by 20% and granting 1 Spirit Spear charge (+28% auto-attack damage per stack).'
          ),
          sp(
            'spear-q2',
            'Q',
            'Spinning Blades',
            'Spirit Spear',
            'Tinh Hồn Thương (Spirit Spear)',
            3,
            4,
            'Instant',
            'Tức thì',
            'Self',
            'Bản thân',
            'Cường hóa ngọn thương tăng mạnh tầm đánh thường và tích ngay 1 cộng dồn Spirit Spear.',
            'Empowers your spear, extending normal attack range and granting 1 Spirit Spear charge.'
          ),
        ]
      : isQuarterstaff
        ? [
            sp(
              'qs-q1',
              'Q',
              'Battle Rush',
              'Concussive Blow',
              'Đập Côn Choáng (Concussive Blow)',
              3,
              5,
              'Instant',
              'Tức thì',
              '4m',
              '4m',
              'Chuỗi 3 đòn đập côn liên hoàn gây sát thương vật lý và làm Choáng (Stun) mục tiêu ở đòn thứ 3.',
              '3-hit staff combo dealing physical damage and stunning targets on the final strike.'
            ),
            sp(
              'qs-q2',
              'Q',
              'Spinning Blades',
              'Cartwheel',
              'Nhào Lộn Quét Côn (Cartwheel)',
              4,
              6,
              'Instant',
              'Tức thì',
              '5m',
              '5m',
              'Nhào lộn 5m quét côn làm chậm kẻ địch và tăng phòng thủ cho bản thân.',
              'Cartwheels 5m, damaging and slowing foes while increasing your defense.'
            ),
          ]
        : isKnuckles
          ? [
              sp(
                'wg-q1',
                'Q',
                'Battle Rush',
                'Dragon Leap',
                'Long Phi Quyền Hất Tung (Dragon Leap)',
                3.5,
                5,
                'Instant (2 Casts)',
                '2 Cú đấm liên hoàn',
                '5m Dash',
                'Lướt đấm 5m',
                'Lần 1: Lướt đấm móc. Lần 2: Nhảy đấm Hất Tung (Knock Up) toàn bộ kẻ địch trong vùng.',
                '1st Cast: Uppercut dash. 2nd Cast: Leaping slam that knocks enemies airborne.'
              ),
              sp(
                'wg-q2',
                'Q',
                'Adrenaline Boost',
                'Create Opening',
                'Phá Thế Phòng Thủ (Create Opening)',
                2.5,
                4,
                'Instant',
                'Tức thì',
                '4m',
                '4m',
                'Tung cú đấm tốc độ cao làm giảm Giáp của mục tiêu và rút ngắn hồi chiêu khi đánh trúng.',
                'Rapid strike that shreds target armor and refunds cooldown on hit.'
              ),
            ]
          : isShapeshifter
            ? [
                sp(
                  'ss-q1',
                  'Q',
                  'Desecrate',
                  'Reality Fissure',
                  'Vết Nứt Thực Tại (Reality Fissure)',
                  3,
                  5,
                  '0.4s',
                  '0.4 giây',
                  '12m',
                  '12m',
                  'Mở vết nứt năng lượng làm chậm, gây sát thương phép và tích 1 tầng Shift Charge để duy trì dạng biến hình.',
                  'Tears a fissure dealing magic damage, slowing foes, and generating 1 Shift Charge.'
                ),
                sp(
                  'ss-q2',
                  'Q',
                  'Bane',
                  'Pulse Shock',
                  'Xung Kích Biến Hóa (Pulse Shock)',
                  2.5,
                  5,
                  'Instant',
                  'Tức thì',
                  '6m Cone',
                  'Hình nón 6m',
                  'Phóng xung lực cự ly gần làm giảm sát thương kẻ địch và tích nhanh Shift Charge.',
                  'Short-range shockwave that weakens enemies and generates Shift Charges.'
                ),
              ]
            : [
                sp(
                  'tank-q1',
                  'Q',
                  'Iron Will',
                  'Defensive Slam / Threatening Smash',
                  'Cú Đập Khiêu Khích & Tăng Giáp (Threatening Smash)',
                  3,
                  5,
                  'Instant',
                  'Tức thì',
                  '5m AoE',
                  '5m Diện rộng',
                  'Đập chùy/búa xuống đất gây sát thương diện rộng, tăng mạnh Threat (hút quái PvE) và tăng Giáp cho bản thân + đồng minh.',
                  'Slams the ground dealing AoE physical damage, generating high PvE threat, and boosting ally resistances.'
                ),
                sp(
                  'tank-q2',
                  'Q',
                  'Splitting Slash',
                  'Sacred Ground / Iron Breaker',
                  'Đập Vỡ Giáp & Câm Lặng (Iron Breaker)',
                  4,
                  6,
                  'Instant',
                  'Tức thì',
                  '5m Cone',
                  'Hình nón 5m',
                  'Giáng đòn nặng nề làm giảm mạnh Giáp của mục tiêu hoặc tạo thảm đất làm Câm Lặng kẻ địch.',
                  'Heavy frontal slam that shreds target armor or creates a silencing ground zone.'
                ),
              ];

    const wSpells = isSpear
      ? [
          sp(
            'spear-w1',
            'W',
            'Lunging Stabs',
            'Forest of Spears / Impaler',
            'Thương Mọc Trói Chân (Impaler)',
            12,
            10,
            '0.4s',
            '0.4 giây',
            '11m',
            '11m',
            'Triệu hồi mũi thương khổng lồ đâm từ dưới đất lên tại vị trí chỉ định, gây sát thương lớn và làm chậm 50% kẻ địch trong 4 giây.',
            'Erupts a giant spear from the ground at target location, dealing heavy damage and slowing enemies by 50%.'
          ),
          sp(
            'spear-w2',
            'W',
            'Parry Strike',
            'Deflecting Spin / Cripple',
            'Xoay Thương Phản Đòn / Phế Tốc Chạy (Cripple)',
            15,
            10,
            'Instant',
            'Tức thì',
            '5m',
            '5m',
            'Xoay thương chặn sát thương và phản đòn, hoặc chém vào chân kẻ địch xóa ngay kỹ năng chạy nước rút (Purge Sprint) của chúng.',
            'Spins spear to reflect incoming damage, or cripples target purging their sprint buff.'
          ),
        ]
      : [
          sp(
            `melee-w1-${raw.id}`,
            'W',
            'Battle Rush',
            isKnuckles
              ? 'Triple Kick (Mobility)'
              : isQuarterstaff
                ? 'Stun Run'
                : 'Air Compressor / Snare Charge',
            isKnuckles
              ? 'Tam Liên Cước Lướt Tới (Triple Kick)'
              : isQuarterstaff
                ? 'Chạy Nước Rút Đập Choáng (Stun Run)'
                : 'Hút Chụm / Nhảy Trói Chân Mở Giao Tranh',
            14,
            11,
            'Instant',
            'Tức thì',
            '9m',
            '9m',
            'Kỹ năng cơ động và khống chế chủ lực: Lao nhanh áp sát đồng thời làm Choáng, Hất tung hoặc Gom chụm các mục tiêu xung quanh.',
            'Core mobility and crowd control: Dashes forward to stun, knock up, or pull nearby enemies together.'
          ),
          sp(
            `melee-w2-${raw.id}`,
            'W',
            'Parry Strike',
            'Counter / Guard Rune',
            'Phản Đòn Chiến Thuật / Cổ Ngữ Bảo Hộ',
            16,
            10,
            'Instant',
            'Tức thì',
            'Self / 5m',
            'Bản thân / 5m',
            'Tăng mạnh khả năng chống chịu, miễn nhiễm khống chế hoặc phản lại đòn tấn công của đối phương.',
            'Boosts defensive resistances, grants CC immunity, or counters enemy attacks.'
          ),
        ];

    const eSpell = sp(
      `melee-e-${raw.id}`,
      'E',
      itemIcon,
      `${raw.name_en} Signature (E)`,
      `Tuyệt Kỹ Đặc Trưng E: ${raw.name_vi}`,
      20,
      17,
      'Instant',
      'Tức thì',
      '10m',
      '10m',
      `Tuyệt kỹ độc quyền của ${raw.name_vi}: Đòn đánh quyết định mang tính đột biến cao trong giao tranh, gây sát thương lớn kèm khống chế diện rộng.`,
      `Exclusive signature ability of ${raw.name_en}: High-impact combat finisher dealing heavy damage and crowd control.`
    );
    const passives = [
      sp(
        `melee-p1-${raw.id}`,
        'PASSIVE',
        'Life Leech',
        'Life Leech / Stunning Strike',
        'Hút Sinh Lực & Đòn Đánh Choáng',
        0,
        0,
        'Passive',
        'Nội tại',
        'Self',
        'Bản thân',
        'Hồi máu theo sát thương đánh thường hoặc làm choáng mục tiêu sau mỗi 5 đòn đánh.',
        'Heals on normal attacks or stuns targets every 5th normal attack.'
      ),
    ];

    return {
      spells: { Q: qSpells, W: wSpells, E: [eSpell], PASSIVE: passives },
      default_spells: {
        Q: qSpells[0].id,
        W: wSpells[0].id,
        E: eSpell.id,
        PASSIVE: passives[0].id,
      },
    };
  }

  // ============================================================================
  // 2. HEAD ARMOR (Plate Helmet / Leather Hood / Cloth Cowl)
  // ============================================================================
  if (raw.slot_type === 'Head') {
    const isPlate = base.includes('_PLATE_');
    const isLeather = base.includes('_LEATHER_');

    const activeSpells = [
      sp(
        `head-e1-${raw.id}`,
        'E',
        itemIcon,
        `${raw.name_en} Signature Skill (D)`,
        `Kỹ Năng Mũ Đặc Trưng: ${raw.name_vi}`,
        30,
        8,
        'Instant',
        'Tức thì',
        'Self / 8m',
        'Bản thân / 8m',
        isPlate
          ? `Kỹ năng phòng thủ của ${raw.name_vi}: Tạo khiên chắn giảm sát thương, hóa giải hiệu ứng bất lợi hoặc khóa chân kẻ địch xung quanh.`
          : isLeather
            ? `Kỹ năng chiến thuật của ${raw.name_vi}: Phản sát thương, làm lộ diện tàng hình, giảm hồi chiêu hoặc câm lặng kẻ địch.`
            : `Kỹ năng pháp thuật của ${raw.name_vi}: Đẩy lùi kẻ địch áp sát, tạo khiên năng lượng hoặc cung cấp miễn phí năng lượng khi xả chiêu.`,
        isPlate
          ? `Defensive helmet skill of ${raw.name_en}: Grants damage mitigation shield, cleanses CC, or disables nearby foes.`
          : isLeather
            ? `Tactical hood skill of ${raw.name_en}: Reflects incoming damage, reveals stealth, resets cooldowns, or silences enemies.`
            : `Arcane cowl skill of ${raw.name_en}: Knocks back melee attackers, restores energy, or shields against burst damage.`
      ),
      sp(
        `head-e2-${raw.id}`,
        'E',
        'Iron Will',
        isPlate
          ? 'Stone Skin (Shared Plate)'
          : isLeather
            ? 'Cleanse (Shared Leather)'
            : 'Force Field (Shared Cloth)',
        isPlate
          ? 'Da Đá Kiên Cố (Giảm Sát Thương)'
          : isLeather
            ? 'Thanh Tẩy Khống Chế (Cleanse)'
            : 'Trường Lực Đẩy Lùi (Force Field)',
        35,
        7,
        'Instant',
        'Tức thì',
        'Self',
        'Bản thân',
        isPlate
          ? 'Tăng mạnh Giáp và Kháng Phép trong 5 giây để chống dồn sát thương.'
          : isLeather
            ? 'Xóa bỏ ngay lập tức mọi hiệu ứng Choáng, Trói chân và Làm chậm trên bản thân.'
            : 'Phóng luồng xung lực đẩy lùi mọi kẻ địch đứng gần ra xa 9m.',
        isPlate
          ? 'Greatly increases Armor and Magic Resistance for 5s against burst damage.'
          : isLeather
            ? 'Immediately removes all Stun, Root, Silence, and Slow effects.'
            : 'Emits a shockwave knocking back all nearby enemies by 9m.'
      ),
    ];

    const passives = [
      sp(
        `head-p1-${raw.id}`,
        'PASSIVE',
        'Energetic',
        isPlate ? 'Toughness' : isLeather ? 'Balanced Mind' : 'Aggression',
        isPlate
          ? 'Cứng Cáp (+Phòng Thủ)'
          : isLeather
            ? 'Tâm Trí Cân Bằng (+Tốc Đánh & CDR)'
            : 'Hung Hãn (+3.5% Sát Thương & Hồi Máu)',
        0,
        0,
        'Passive',
        'Nội tại',
        'Self',
        'Bản thân',
        isPlate
          ? 'Tăng chỉ số phòng thủ và giảm thời gian chịu khống chế.'
          : isLeather
            ? 'Tăng sát thương, tốc độ đánh và giảm thời gian hồi chiêu.'
            : 'Tăng 3.5% toàn bộ sát thương và hiệu lực hồi máu.',
        isPlate
          ? 'Increases defense and crowd control resistance.'
          : isLeather
            ? 'Boosts damage, attack speed, and cooldown reduction.'
            : 'Increases all damage and healing power by 3.5%.'
      ),
    ];

    return {
      spells: { Q: [], W: [], E: activeSpells, PASSIVE: passives },
      default_spells: {
        Q: '',
        W: '',
        E: activeSpells[0].id,
        PASSIVE: passives[0].id,
      },
    };
  }

  // ============================================================================
  // 3. CHEST ARMOR (Plate Armor / Leather Jacket / Cloth Robe)
  // ============================================================================
  if (raw.slot_type === 'Armor') {
    const isPlate = base.includes('_PLATE_');
    const isLeather = base.includes('_LEATHER_');

    const activeSpells = [
      sp(
        `armor-e1-${raw.id}`,
        'E',
        itemIcon,
        `${raw.name_en} Signature Skill (R)`,
        `Kỹ Năng Áo Đặc Trưng: ${raw.name_vi}`,
        40,
        12,
        'Instant',
        'Tức thì',
        'Self / 7m',
        'Bản thân / 7m',
        isPlate
          ? `Kỹ năng chống chịu chủ lực của ${raw.name_vi}: Tạo hào quang giảm sát thương cho đồng đội, phản đòn hoặc hút khống chế trong giao tranh tổng.`
          : isLeather
            ? `Kỹ năng sinh tồn & đấu tay đôi của ${raw.name_vi}: Hút máu diện rộng, tàng hình chiến thuật, đốt lửa xung quanh hoặc tăng tốc độ đánh cực đại.`
            : `Kỹ năng khuếch đại sát thương của ${raw.name_vi}: Tạo khiên bất tử, phản phép, hoảng sợ kẻ địch hoặc tăng vọt sát thương phép/hồi máu.`,
        isPlate
          ? `Frontline tank ability of ${raw.name_en}: Provides team mitigation aura, crowd control, or damage reflection.`
          : isLeather
            ? `Brawler sustain ability of ${raw.name_en}: Grants AoE life steal, tactical stealth, burn aura, or attack speed steroid.`
            : `High-output caster ability of ${raw.name_en}: Grants invulnerability shield, spell purge, fear aura, or massive damage amplification.`
      ),
      sp(
        `armor-e2-${raw.id}`,
        'E',
        'Adrenaline Boost',
        isPlate
          ? 'Taunt / Enfeeble Blade'
          : isLeather
            ? 'Ambush / Inferno Shield'
            : 'Frost Shield',
        isPlate
          ? 'Khiêu Khích & Giảm Sát Thương Địch'
          : isLeather
            ? 'Khiên Lửa Phản Sát Thương (Inferno Shield)'
            : 'Khiên Băng Phản Đòn (Frost Shield)',
        35,
        10,
        'Instant',
        'Tức thì',
        'Self',
        'Bản thân',
        isPlate
          ? 'Tăng mạnh kháng sát thương và làm suy yếu đòn tấn công của kẻ địch xung quanh.'
          : isLeather
            ? 'Bao bọc bản thân trong khiên lửa giảm 30% sát thương nhận vào và phản lại 25% sát thương trong 6 giây.'
            : 'Tăng Giáp/Kháng Phép, làm chậm kẻ địch tấn công bạn và phản lại sát thương.',
        isPlate
          ? 'Boosts resistances and weakens nearby enemy attacks.'
          : isLeather
            ? 'Surrounds you with a flame shield reducing incoming damage by 30% and reflecting 25% damage for 6s.'
            : 'Increases resistances, slows attackers, and reflects damage.'
      ),
    ];

    const passives = [
      sp(
        `armor-p1-${raw.id}`,
        'PASSIVE',
        'Life Leech',
        isPlate ? 'Toughness' : isLeather ? 'Quick Thinker' : 'Aggression',
        isPlate
          ? 'Cứng Cáp Tối Đa (+Phòng Thủ & Kháng CC)'
          : isLeather
            ? 'Phản Xạ Nhanh Nhạy (-5% Hồi Chiêu)'
            : 'Hung Hãn Tối Đa (+8% Sát Thương & Hồi Máu)',
        0,
        0,
        'Passive',
        'Nội tại',
        'Self',
        'Bản thân',
        isPlate
          ? 'Tăng tối đa Giáp, Kháng Phép và khả năng kháng hiệu ứng khống chế.'
          : isLeather
            ? 'Giảm 5% thời gian hồi chiêu của mọi kỹ năng hoặc tăng 4% sát thương cân bằng.'
            : 'Tăng 8% toàn bộ sát thương vật lý, sát thương phép và hiệu lực hồi máu.',
        isPlate
          ? 'Maximizes Armor, Magic Resistance, and CC resistance.'
          : isLeather
            ? 'Reduces all ability cooldowns by 5% or boosts balanced damage by 4%.'
            : 'Increases all physical damage, magic damage, and healing by 8%.'
      ),
    ];

    return {
      spells: { Q: [], W: [], E: activeSpells, PASSIVE: passives },
      default_spells: {
        Q: '',
        W: '',
        E: activeSpells[0].id,
        PASSIVE: passives[0].id,
      },
    };
  }

  // ============================================================================
  // 4. FOOTWEAR / SHOES (Plate Boots / Leather Shoes / Cloth Sandals)
  // ============================================================================
  if (raw.slot_type === 'Shoes') {
    const isPlate = base.includes('_PLATE_');
    const isLeather = base.includes('_LEATHER_');

    const activeSpells = [
      sp(
        `shoes-e1-${raw.id}`,
        'E',
        itemIcon,
        isPlate
          ? 'Rejuvenating Sprint'
          : isLeather
            ? 'Refreshing Sprint'
            : 'Energetic Sprint',
        isPlate
          ? 'Chạy Nước Rút Hồi Máu (Rejuvenating Sprint)'
          : isLeather
            ? 'Chạy Nước Rút Giảm Hồi Chiêu (Refreshing Sprint)'
            : 'Chạy Nước Rút Hồi Năng Lượng (Energetic Sprint)',
        30,
        0,
        'Instant',
        'Tức thì',
        'Self',
        'Bản thân',
        isPlate
          ? 'Tăng 80% tốc độ chạy và hồi phục lượng lớn Máu liên tục trong 3 giây.'
          : isLeather
            ? 'Tăng 80% tốc độ chạy trong 3 giây đồng thời rút ngắn 33% tốc độ hồi mọi kỹ năng đang chờ.'
            : 'Tăng 80% tốc độ chạy và hồi phục lượng lớn Năng lượng (Energy) mỗi giây trong 3 giây.',
        isPlate
          ? 'Increases move speed by 80% and heals you over 3 seconds.'
          : isLeather
            ? 'Increases move speed by 80% for 3s while accelerating active cooldowns by 33%.'
            : 'Increases move speed by 80% and restores Energy every second for 3s.'
      ),
      sp(
        `shoes-e2-${raw.id}`,
        'E',
        'Speed Shot',
        `${raw.name_en} Signature Mobility (F)`,
        `Kỹ Năng Cơ Động Đặc Trưng: ${raw.name_vi}`,
        25,
        6,
        'Instant',
        'Tức thì',
        '11m',
        '11m',
        `Kỹ năng di chuyển độc quyền của ${raw.name_vi}: Lướt qua chướng ngại vật, nhảy né sát thương (Dodge/Blink) hoặc tăng tốc độ truy đuổi đường dài.`,
        `Unique mobility skill of ${raw.name_en}: Blinks, leaps, dodges incoming damage, or grants sustained pursuit speed.`
      ),
    ];

    const passives = [
      sp(
        `shoes-p1-${raw.id}`,
        'PASSIVE',
        'Energetic',
        isPlate
          ? 'Toughness (+Defense)'
          : isLeather
            ? 'Balanced Mind (+CDR & Damage)'
            : 'Aggression (+3.5% Damage)',
        isPlate
          ? 'Cứng Cáp (+Phòng Thủ)'
          : isLeather
            ? 'Tâm Trí Cân Bằng (+Giảm Hồi Chiêu)'
            : 'Hung Hãn (+3.5% Sát Thương)',
        0,
        0,
        'Passive',
        'Nội tại',
        'Self',
        'Bản thân',
        'Cộng thẳng chỉ số chiến đấu và tăng giới hạn tải trọng mang vác khi di chuyển.',
        'Grants passive combat stats and bonus carry weight capacity.'
      ),
    ];

    return {
      spells: { Q: [], W: [], E: activeSpells, PASSIVE: passives },
      default_spells: {
        Q: '',
        W: '',
        E: activeSpells[0].id,
        PASSIVE: passives[0].id,
      },
    };
  }

  // ============================================================================
  // 5. OFF-HAND EQUIPMENT (_OFF_)
  // ============================================================================
  if (raw.slot_type === 'OffHand') {
    const passive = sp(
      `off-p1-${raw.id}`,
      'PASSIVE',
      itemIcon,
      `${raw.name_en} Off-Hand Aura`,
      `Nội Tại Tay Phụ: ${raw.name_vi}`,
      0,
      0,
      'Passive',
      'Nội tại trang bị',
      'Self',
      'Bản thân',
      base.includes('HORN') || base.includes('TORCH') || base.includes('CANE')
        ? `Cầm kèm vũ khí 1 Tay (1H): Giảm mạnh thời gian hồi chiêu (Cooldown Reduction), tăng tốc độ đánh hoặc kéo dài thời gian khống chế tùy theo Item Power của ${raw.name_vi}.`
        : base.includes('SHIELD') || base.includes('TOWERSHIELD')
          ? `Cầm kèm vũ khí 1 Tay (1H): Tăng mạnh chỉ số Phòng thủ PvE/PvP, Kháng khống chế và tạo thế chủ động trong giao tranh.`
          : `Cầm kèm vũ khí 1 Tay (1H): Khuếch đại trực tiếp Sát thương kỹ năng, Hiệu lực hồi máu, Tốc độ niệm phép hoặc Máu tối đa theo Item Power của ${raw.name_vi}.`,
      base.includes('HORN') || base.includes('TORCH') || base.includes('CANE')
        ? `Pairs with 1H weapons: Passively boosts Cooldown Reduction, Attack Speed, or CC Duration scaling with ${raw.name_en}'s Item Power.`
        : base.includes('SHIELD') || base.includes('TOWERSHIELD')
          ? `Pairs with 1H weapons: Passively increases Defense vs Players/Mobs and Crowd Control Resistance.`
          : `Pairs with 1H weapons: Passively amplifies Ability Damage, Healing Cast, Cast Speed, or Max HP scaling with Item Power.`
    );

    return {
      spells: { Q: [], W: [], E: [], PASSIVE: [passive] },
      default_spells: { Q: '', W: '', E: '', PASSIVE: passive.id },
    };
  }

  // ============================================================================
  // 6. CAPES & BAGS
  // ============================================================================
  if (raw.slot_type === 'Cape') {
    const passive = sp(
      `cape-p1-${raw.id}`,
      'PASSIVE',
      itemIcon,
      `${raw.name_en} Crest Trigger`,
      `Hiệu Ứng Áo Choàng: ${raw.name_vi}`,
      20,
      0,
      'Auto-Trigger',
      'Tự động kích hoạt',
      'Self / 11m',
      'Bản thân / 11m',
      `Tăng tốc độ hồi Năng lượng cơ bản và tự động kích hoạt hiệu ứng đặc trưng của ${raw.name_vi} (Phóng sét lan, Reset kỹ năng Q, Tạo khiên chắn, Hồi năng lượng hoặc Tàng hình khi máu thấp).`,
      `Boosts base Energy Regeneration and automatically triggers ${raw.name_en}'s passive crest effect in combat.`
    );
    return {
      spells: { Q: [], W: [], E: [], PASSIVE: [passive] },
      default_spells: { Q: '', W: '', E: '', PASSIVE: passive.id },
    };
  }

  if (raw.slot_type === 'Bag') {
    const passive = sp(
      `bag-p1-${raw.id}`,
      'PASSIVE',
      itemIcon,
      'Courier Carry Capacity',
      `Tăng Sức Chứa Hành Lý: ${raw.name_vi}`,
      0,
      0,
      'Passive',
      'Nội tại trang bị',
      'Self',
      'Bản thân',
      base.includes('INSIGHT')
        ? 'Tăng lớn sức chứa cân nặng hành lý VÀ cộng thêm % điểm kinh nghiệm (Combat Fame) khi tiêu diệt quái vật.'
        : 'Tăng giới hạn cân nặng vận chuyển tối đa (Max Load kg) cho nhân vật kể cả khi xuống thú cưỡi.',
      base.includes('INSIGHT')
        ? 'Increases maximum inventory carry weight AND grants bonus Combat Fame from killing mobs.'
        : 'Passively increases your character maximum inventory carry weight (kg).'
    );
    return {
      spells: { Q: [], W: [], E: [], PASSIVE: [passive] },
      default_spells: { Q: '', W: '', E: '', PASSIVE: passive.id },
    };
  }

  // ============================================================================
  // 7. MOUNTS (_MOUNT_)
  // ============================================================================
  if (raw.slot_type === 'Mount') {
    const mountSkill = sp(
      `mount-e-${raw.id}`,
      'E',
      itemIcon,
      `Gallop & Mount Ability: ${raw.name_en}`,
      `Kỹ Năng Thú Cưỡi: ${raw.name_vi}`,
      30,
      0,
      'Instant',
      'Tức thì',
      'Self',
      'Bản thân',
      `Kỹ năng di chuyển & thoát hiểm của ${raw.name_vi}: Tăng tốc độ phi nước đại (Gallop Speed), tăng tải trọng mang vác và bảo vệ người cưỡi trước các đợt gank trong vùng Đỏ/Đen/Mists.`,
      `Mount mobility & survival skill of ${raw.name_en}: Grants high gallop speed, carry weight capacity, and anti-gank protection.`
    );
    return {
      spells: { Q: [], W: [], E: [mountSkill], PASSIVE: [] },
      default_spells: { Q: '', W: '', E: mountSkill.id, PASSIVE: '' },
    };
  }

  // ============================================================================
  // 8. CONSUMABLES (Food / Potion / Farming)
  // ============================================================================
  const consumableEffect = sp(
    `cons-e-${raw.id}`,
    'E',
    itemIcon,
    `Consumable Effect: ${raw.name_en}`,
    `Hiệu Ứng Sử Dụng: ${raw.name_vi}`,
    raw.slot_type === 'Potion' ? 60 : 0,
    0,
    'Instant',
    'Tức thì',
    'Self / Target',
    'Bản thân / Mục tiêu',
    raw.slot_type === 'Potion'
      ? `Hiệu ứng bình thuốc của ${raw.name_vi}: Kích hoạt tức thì trong giao tranh (Hồi máu, Hồi năng lượng, Khổng lồ hóa, Tăng kháng, Tàng hình hoặc Ném độc/axit phá giáp mục tiêu).`
      : `Hiệu ứng ẩm thực/nông trại của ${raw.name_vi}: Duy trì bùa lợi trong 30 phút (Tăng sát thương Stew, Giảm hồi chiêu Omelette, Tăng tải trọng & thu thập Pie, Hồi máu ngoài giao tranh Soup).`,
    raw.slot_type === 'Potion'
      ? `Combat potion effect of ${raw.name_en}: Instant tactical activation in combat (Heal, Energy, Gigantify, Resistance, Invisibility, or Poison/Acid throw).`
      : `30-minute food buff of ${raw.name_en}: Boosts combat damage (Stew), Cooldown Reduction (Omelette), Gathering Yield & Load (Pie), or HP Regen (Soup).`
  );

  return {
    spells: { Q: [], W: [], E: [consumableEffect], PASSIVE: [] },
    default_spells: { Q: '', W: '', E: consumableEffect.id, PASSIVE: '' },
  };
}

