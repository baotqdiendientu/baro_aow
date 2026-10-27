import { AlbionSpell, WeaponLineSpellPool } from '@/types/albion';

/**
 * Helper to construct an AlbionSpell cleanly.
 */
function s(
  id: string,
  slot: 'Q' | 'W' | 'PASSIVE',
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
  description_en: string,
  unlockTier?: number
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
    unlockTier,
  };
}

// ============================================================================
// PART 3.1: NHÁNH RÌU (AXE WEAPON LINE)
// ============================================================================
export const AXE_SPELL_POOL: WeaponLineSpellPool = {
  lineId: 'axe',
  sharedQSpells: [
    s(
      'axe-q1',
      'Q',
      'Heroic Strike',
      'Rending Strike',
      'Đòn Chém Xé Rách (Rending Strike)',
      2.5,
      4,
      'Instant',
      'Tức thì',
      '3.5m',
      '3.5m',
      'Tung đòn bổ chém vào mục tiêu gây sát thương vật lý và tích 1 tầng Chảy Máu Rending Bleed (tối đa 3 tầng) trong 4 giây.',
      'Strikes target dealing physical damage and applying a Rending Bleed charge (up to 3 stacks) for 4s.'
    ),
    s(
      'axe-q2',
      'Q',
      'Rending Spin',
      'Rending Spin',
      'Xoay Rìu Quét Máu (Rending Spin)',
      2.5,
      5,
      'Instant',
      'Tức thì',
      '5m AoE',
      '5m Diện rộng',
      'Xoay rìu 360 độ gây sát thương vật lý diện rộng, tích tầng chảy máu và giảm 12% hiệu lực hồi máu của kẻ địch.',
      'Swings in a 5m circle applying Rending Bleed and reducing enemy healing received by 12%.'
    ),
    s(
      'axe-q3',
      'Q',
      'Rending Rage',
      'Rending Rage',
      'Liên Trảm Cuồng Nộ (Rending Rage)',
      3,
      6,
      'Instant',
      'Tức thì',
      '4m',
      '4m',
      'Chuỗi 3 đòn bổ liên hoàn: lướt nhẹ về phía trước tích cộng dồn chảy máu Rending Bleed và Trói Chân (Root) đối thủ ở đòn thứ 3.',
      '3-hit combo dashing forward, applying Rending Bleed stacks and rooting targets on the final slam.'
    ),
  ],
  sharedWSpells: [
    s(
      'axe-w1',
      'W',
      'Adrenaline Boost',
      'Adrenaline Boost',
      'Bùng Nổ Adrenaline (Adrenaline Boost)',
      15,
      10,
      'Instant',
      'Tức thì',
      'Self',
      'Bản thân',
      'Tăng 45% tốc chạy, 25% sát thương và 40% tốc độ đánh thường trong 4 giây.',
      'Increases move speed by 45%, damage by 25%, and attack speed by 40% for 4s.'
    ),
    s(
      'axe-w2',
      'W',
      'Sunder Shot',
      'Deadly Chop',
      'Nhát Chém Bổ Đầu (Deadly Chop)',
      10,
      8,
      '0.4s',
      '0.4 giây',
      '3.5m',
      '3.5m',
      'Bổ mạnh vào đầu kẻ địch gây sát thương vật lý lớn và giảm 35% Giáp cùng Kháng Phép của mục tiêu trong 5 giây.',
      'Delivers a heavy chop that deals physical damage and shreds target resistances by 35% for 5s.'
    ),
    s(
      'axe-w3',
      'W',
      'Deep Cuts',
      'Internal Bleeding',
      'Xuất Huyết Nội Khí (Internal Bleeding)',
      15,
      10,
      'Instant',
      'Tức thì',
      '5m AoE',
      '5m Diện rộng',
      'Chém quét diện rộng gây sát thương vật lý; bất kỳ kẻ địch nào di chuyển sau khi trúng chiêu sẽ nhận thêm sát thương chuẩn.',
      'Cleaves all nearby enemies, causing targets that move to suffer ongoing true damage.'
    ),
    s(
      'axe-w4',
      'W',
      'Battle Rush',
      'Battle Rush',
      'Xung Phong Phá Kháng (Battle Rush)',
      14,
      10,
      'Instant Dash',
      'Lướt tức thì',
      '11m',
      '11m',
      'Lao nhanh 11m tới vị trí chỉ định, tăng 25% hiệu lực hồi máu nhận vào và giảm hồi máu của kẻ địch trúng đòn.',
      'Dashes 11m to target location, boosting your healing received by 25% and debuffing enemy healing.'
    ),
    s(
      'axe-w5',
      'W',
      'Raging Blades',
      'Raging Blades',
      'Lưỡi Đao Cuồng Loạn (Raging Blades)',
      15,
      12,
      'Instant',
      'Tức thì',
      '6m AoE',
      '6m Diện rộng',
      'Quét lưỡi rìu quanh bản thân phóng luồng năng lượng xoay tròn, tăng mạnh sát thương vật lý cho bản thân với mỗi mục tiêu trúng đòn (tối đa +40% sát thương!).',
      'Spins blades around you, dealing AoE physical damage and stacking a damage buff up to +40% based on enemies hit.',
      6 // Tier-Gated: Requires Tier VI+
    ),
  ],
  sharedPassives: [
    s(
      'axe-p1',
      'PASSIVE',
      'Deep Cuts',
      'Deep Cuts',
      'Vết Cắt Sâu (Deep Cuts)',
      0,
      0,
      'Passive',
      'Nội tại',
      'Self',
      'Bản thân',
      'Mỗi 4 đòn đánh thường, mục tiêu bị xuất huyết nhận thêm sát thương vật lý theo thời gian trong 3 giây.',
      'Every 4 normal attacks inflicts a bleeding wound dealing damage over 3s.'
    ),
    s(
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
      'Hồi máu bằng 12% lượng sát thương gây ra từ các đòn đánh thường.',
      'Heals you for 12% of normal attack damage dealt.'
    ),
    s(
      'axe-p3',
      'PASSIVE',
      'Aggressive Rush',
      'Aggressive Rush',
      'Xung Kích Hiếu Chiến (Aggressive Rush)',
      0,
      0,
      'Passive',
      'Nội tại',
      'Self',
      'Bản thân',
      'Sau mỗi 4 đòn đánh thường, tăng 8% toàn bộ sát thương gây ra trong 3 giây.',
      'Every 4 normal attacks grants +8% damage dealt for 3s.'
    ),
    s(
      'axe-p4',
      'PASSIVE',
      'Armor Piercer',
      'Armor Piercer',
      'Xuyên Thủng Giáp Trụ (Armor Piercer)',
      0,
      0,
      'Passive',
      'Nội tại',
      'Self',
      'Bản thân',
      'Mỗi đòn đánh thường làm giảm nhẹ Giáp và Kháng Phép của đối phương (cộng dồn tối đa 5 lần).',
      'Normal attacks shred target resistances slightly, stacking up to 5 times.'
    ),
  ],
};

// ============================================================================
// PART 3.2: NHÁNH NỎ (CROSSBOW WEAPON LINE)
// ============================================================================
export const CROSSBOW_SPELL_POOL: WeaponLineSpellPool = {
  lineId: 'crossbow',
  sharedQSpells: [
    s(
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
      'Bắn mũi tên phát nổ trên đường thẳng gây sát thương vật lý diện rộng trong bán kính 2.5m. Tối ưu kích nội tại Well-Prepared.',
      'Fires an explosive bolt in a line dealing AoE physical damage within 2.5m. Ideal for proccing Well-Prepared.'
    ),
    s(
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
    s(
      'cb-q3',
      'Q',
      'Multishot',
      'Knockback Shot',
      'Tên Đẩy Lùi Phòng Ngự (Knockback Shot)',
      3,
      5,
      '0.3s',
      '0.3 giây',
      '12m',
      '12m',
      'Bắn mũi tên cản phá đẩy lùi kẻ địch ra xa 6m và ngắt các kỹ năng đang niệm của đối phương.',
      'Fires a heavy bolt that knocks the target back 6m and interrupts spellcasting.'
    ),
  ],
  sharedWSpells: [
    s(
      'cb-w1',
      'W',
      'CALTROPS',
      'Caltrops',
      'Bẫy Chông Sắt (Caltrops)',
      10,
      8,
      'Instant',
      'Tức thì',
      '11m',
      '11m',
      'Ném bẫy chông làm chậm 50% kẻ địch dẫm phải trong 4s và tăng 35% tốc chạy cho bản thân trong 2.5s.',
      'Deploys a caltrops trap that slows enemies by 50% for 4s and boosts your move speed by 35%.'
    ),
    s(
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
    s(
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
    s(
      'cb-w4',
      'W',
      'Deflecting Spin',
      'Deflecting Spin / Bẫy Nổ',
      'Xoay Nỏ Đỡ Đòn (Deflecting Spin)',
      14,
      10,
      'Instant',
      'Tức thì',
      'Self',
      'Bản thân',
      'Xoay nỏ phản đòn sát thương nhận vào và tăng mạnh tốc độ di chuyển trong 2 giây.',
      'Reflects incoming damage while boosting your move speed for 2 seconds.'
    ),
    s(
      'cb-w5',
      'W',
      'Sniper Shot',
      'Sniper Shot',
      'Phát Bắn Tỉa Tầm Xa (Sniper Shot)',
      18,
      14,
      '1.5s Channel',
      'Ngắm bắn 1.5s',
      '18m',
      '18m',
      'Ngắm bắn chuẩn xác từ cự ly 18m và xả phát đạn xuyên giáp gây lượng sát thương vật lý khổng lồ một mục tiêu.',
      'Charges up an 18m sniper shot dealing extreme single-target physical damage.',
      6 // Tier-Gated: Requires Tier VI+
    ),
  ],
  sharedPassives: [
    s(
      'cb-p1',
      'PASSIVE',
      'Well-Prepared',
      'Well-Prepared',
      'Chuẩn Bị Kỹ Lưỡng (Well-Prepared)',
      0,
      0,
      'Passive',
      'Nội tại',
      'Self',
      'Bản thân',
      'Mỗi khi dùng 4 kỹ năng bất kỳ, kỹ năng Q (Ô 1) sẽ được XÓA HỒI CHIÊU ngay lập tức!',
      'Every 4 spells cast, immediately resets the cooldown of your Q ability.'
    ),
    s(
      'cb-p2',
      'PASSIVE',
      'Piercing Arrows',
      'Piercing Arrows',
      'Mũi Tên Xuyên Phá (Piercing Arrows)',
      0,
      0,
      'Passive',
      'Nội tại',
      'Self',
      'Bản thân',
      'Các đòn đánh thường xuyên qua mục tiêu và giảm kháng vật lý của nạn nhân.',
      'Normal attacks pierce targets and reduce physical resistance.'
    ),
    s(
      'cb-p3',
      'PASSIVE',
      'Aggressive Caster',
      'Aggressive Caster',
      'Thi Pháp Cuồng Bạo (Aggressive Caster)',
      0,
      0,
      'Passive',
      'Nội tại',
      'Self',
      'Bản thân',
      'Sau mỗi 4 kỹ năng tung ra, tăng 40% tốc độ niệm phép trong 3 giây.',
      'Every 4 spells cast boosts your cast speed by 40% for 3s.'
    ),
    s(
      'cb-p4',
      'PASSIVE',
      'Energetic',
      'Energetic',
      'Tràn Trề Năng Lượng (Energetic)',
      0,
      0,
      'Passive',
      'Nội tại',
      'Self',
      'Bản thân',
      'Mỗi đòn đánh thường hồi lại 5 Năng lượng (Energy) cho bản thân.',
      'Every normal attack restores 5 Energy.'
    ),
  ],
};

// ============================================================================
// PART 3.3: NHÁNH GẬY TỰ NHIÊN (NATURE STAFF LINE)
// ============================================================================
export const NATURE_SPELL_POOL: WeaponLineSpellPool = {
  lineId: 'nature_staff',
  sharedQSpells: [
    s(
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
    s(
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
    s(
      'nat-q3',
      'Q',
      'Rejuvenating Flower',
      'Rejuvenating Flower',
      'Hoa Nở Hồi Sinh (Rejuvenating Flower)',
      2,
      5,
      'Instant',
      'Tức thì',
      '13m',
      '13m',
      'Ném đóa hoa rừng xuống đất: đồng minh bước qua sẽ nhận ngay 3 cộng dồn hồi máu Rejuvenation.',
      'Throws a flower blooming on the ground that instantly grants 3 Rejuvenation stacks to allies touching it.'
    ),
  ],
  sharedWSpells: [
    s(
      'nat-w1',
      'W',
      'Bramble Seed',
      'Brambleseed',
      'Hạt Mầm Bụi Gai (Brambleseed)',
      12,
      10,
      'Instant',
      'Tức thì',
      '12m',
      '12m',
      'Bắn hạt giống phát nổ hất tung kẻ địch trong bán kính 4m và gây sát thương phép diện rộng.',
      'Shoots a bramble seed that knocks airborne and damages all enemies in a 4m radius.'
    ),
    s(
      'nat-w2',
      'W',
      'Revitalize',
      'Revitalize',
      'Hồi Sinh Năng Lượng (Revitalize)',
      15,
      12,
      'Channel 2.5s',
      'Duy trì 2.5s',
      '11m',
      '11m',
      'Duy trì dòng năng lượng thiên nhiên hồi phục lượng Máu lớn và Năng lượng liên tục mỗi giây.',
      'Channels a restorative stream that heals large amounts of HP and restores Energy every second.'
    ),
    s(
      'nat-w3',
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
    s(
      'nat-w4',
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
    s(
      'nat-w5',
      'W',
      'Breeze',
      'Breeze',
      'Cơn Gió Lành Rừng Xanh (Breeze)',
      16,
      12,
      'Instant',
      'Tức thì',
      '11m (6m AoE)',
      '11m (Vùng 6m)',
      'Phóng cơn gió lan truyền toàn bộ cộng dồn Rejuvenation sang tối đa 5 đồng minh xung quanh và tăng 20% tốc chạy.',
      'Releases a forest breeze that spreads all active Rejuvenation stacks to up to 5 allies and grants +20% move speed.',
      6 // Tier-Gated: Requires Tier VI+
    ),
  ],
  sharedPassives: [
    s(
      'nat-p1',
      'PASSIVE',
      'Energetic',
      'Energetic',
      'Tràn Trề Năng Lượng (Energetic)',
      0,
      0,
      'Passive',
      'Nội tại',
      'Self',
      'Bản thân',
      'Mỗi đòn đánh thường hồi lại 5 Năng lượng (Energy).',
      'Every normal attack restores 5 Energy.'
    ),
    s(
      'nat-p2',
      'PASSIVE',
      'Adrenaline Driven Charity',
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
    s(
      'nat-p3',
      'PASSIVE',
      'Calm',
      'Calm',
      'Tâm Trí Tĩnh Lặng (Calm)',
      0,
      0,
      'Passive',
      'Nội tại',
      'Self',
      'Bản thân',
      'Sau mỗi 5 đòn đánh thường, tăng mạnh chỉ số phòng thủ trong 3 giây.',
      'Every 5 normal attacks boosts your defensive resistances for 3s.'
    ),
    s(
      'nat-p4',
      'PASSIVE',
      'Life Leech',
      'Life Leech / Spirit',
      'Hút Sinh Lực Thiên Nhiên',
      0,
      0,
      'Passive',
      'Nội tại',
      'Self',
      'Bản thân',
      'Hồi máu bằng 10% lượng sát thương gây ra từ các đòn đánh thường.',
      'Heals you for 10% of normal attack damage dealt.'
    ),
  ],
};

// ============================================================================
// PART 3.4: REGISTRY OF ALL WEAPON LINE SPELL POOLS
// ============================================================================
export const WEAPON_LINE_POOLS: Record<string, WeaponLineSpellPool> = {
  axe: AXE_SPELL_POOL,
  crossbow: CROSSBOW_SPELL_POOL,
  nature_staff: NATURE_SPELL_POOL,
};

/**
 * Resolves the WeaponLine identifier from a raw base_identifier string.
 */
export function getWeaponLineId(baseIdentifier: string): string {
  const b = baseIdentifier.toUpperCase();
  if (b.includes('AXE') || b.includes('SCYTHE') || b.includes('HALBERD')) return 'axe';
  if (b.includes('CROSSBOW')) return 'crossbow';
  if (b.includes('NATURESTAFF') || b.includes('WILDSTAFF')) return 'nature_staff';
  if (b.includes('SWORD') || b.includes('CLAYMORE') || b.includes('CLEAVER')) return 'sword';
  if (b.includes('DAGGER') || b.includes('CLAW') || b.includes('RAPIER')) return 'dagger';
  if (b.includes('BOW')) return 'bow';
  if (b.includes('SPEAR') || b.includes('GLAIVE') || b.includes('HARPOON') || b.includes('TRIDENT')) return 'spear';
  if (b.includes('HOLYSTAFF') || b.includes('DIVINESTAFF')) return 'holy_staff';
  if (b.includes('FIRESTAFF') || b.includes('INFERNOSTAFF')) return 'fire_staff';
  if (b.includes('FROSTSTAFF') || b.includes('GLACIALSTAFF') || b.includes('ICE')) return 'frost_staff';
  if (b.includes('CURSEDSTAFF') || b.includes('DEMONIC') || b.includes('SKULLORB')) return 'cursed_staff';
  if (b.includes('ARCANESTAFF') || b.includes('ENIGMATIC')) return 'arcane_staff';
  if (b.includes('QUARTERSTAFF') || b.includes('DOUBLEBLADED') || b.includes('IRONCLAD')) return 'quarterstaff';
  if (b.includes('MACE') || b.includes('FLAIL')) return 'mace';
  if (b.includes('HAMMER') || b.includes('POLEHAMMER') || b.includes('RAM')) return 'hammer';
  if (b.includes('KNUCKLES') || b.includes('IRONGAUNTLETS')) return 'war_gloves';
  if (b.includes('SHAPESHIFTER')) return 'shapeshifter';
  return 'general';
}
