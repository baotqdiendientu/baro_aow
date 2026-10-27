import { AlbionSpell, SpellSlotKey } from '@/types/albion';

export interface SharedFamilySpells {
  lineId: string;
  name_en: string;
  name_vi: string;
  slotQ: AlbionSpell[];
  slotW: AlbionSpell[];
  passives: AlbionSpell[];
}

export type UniqueWeaponSpellE = AlbionSpell;

/**
 * Clean constructor for an authentic Albion spell.
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
// 1. WARRIOR TREE (CHIẾN BINH)
// ============================================================================

// 1.1. AXE (NHÁNH RÌU)
export const AXE_SHARED_SPELLS: SharedFamilySpells = {
  lineId: 'axe',
  name_en: 'Axe',
  name_vi: 'Nhánh Rìu',
  slotQ: [
    sp(
      'axe-q1',
      'Q',
      'Heroic Strike',
      'Rending Strike',
      'Chém Xé Rách (Rending Strike)',
      3,
      3,
      'Instant',
      'Tức thì',
      'Melee (3m)',
      'Cận chiến (3m)',
      'Chém mạnh gây sát thương vật lý trực tiếp và tích 1 cộng dồn Xuất Huyết (Bleeding) gây sát thương theo thời gian trong 4s (tối đa 3 cộng dồn).',
      'Strikes an enemy, dealing physical damage and applying 1 Bleed charge that deals damage over time for 4s (stacks up to 3 times).'
    ),
    sp(
      'axe-q2',
      'Q',
      'Spin Attack',
      'Rending Spin',
      'Xoay Rìu Xé Rách (Rending Spin)',
      4,
      5,
      'Instant',
      'Tức thì',
      'Self (5m AoE)',
      'Bản thân (5m AoE)',
      'Vung rìu xoay 360 độ xung quanh bản thân, gây sát thương vật lý diện rộng cho tất cả kẻ địch và tích 1 cộng dồn Xuất Huyết.',
      'Spins in a 360 circle dealing physical damage to all nearby enemies within 5m and applying 1 Bleed charge.'
    ),
    sp(
      'axe-q3',
      'Q',
      'Rending Rage',
      'Rending Rage',
      'Cuồng Nộ Xé Rách (Rending Rage)',
      2,
      4,
      'Instant',
      'Tức thì',
      'Melee (3m)',
      'Cận chiến (3m)',
      'Chuỗi combo 3 đòn: Đòn 1 & 2 gây sát thương và tích Xuất Huyết; đòn thứ 3 nhảy chém tới mục tiêu làm choáng kẻ địch trong 1 giây.',
      'A 3-hit attack chain: Hits 1 & 2 deal damage and apply Bleed; hit 3 leaps to the target, stunning them for 1s.'
    ),
  ],
  slotW: [
    sp(
      'axe-w1',
      'W',
      'Adrenaline Boost',
      'Adrenaline Boost',
      'Tăng Tốc Sinh Lực (Adrenaline Boost)',
      15,
      9,
      'Instant',
      'Tức thì',
      'Self',
      'Bản thân',
      'Kích hoạt tăng 50% tốc độ di chuyển và +25% sát thương toàn bộ trong 7 giây. Đòn đánh thường trúng đích làm mới bùa lợi.',
      'Increases your move speed by 50% and all damage by 25% for 7s. Auto-attacks refresh the buff duration.'
    ),
    sp(
      'axe-w2',
      'W',
      'Deadly Chop',
      'Deadly Chop',
      'Nhát Chém Tử Thần (Deadly Chop)',
      10,
      12,
      '0.4s',
      '0.4 giây',
      'Melee (3m)',
      'Cận chiến (3m)',
      'Bổ mạnh một nhát chí mạng gây sát thương vật lý cực lớn và giảm giáp đối phương đi 30% trong 5 giây.',
      'Delivers a heavy overhead blow dealing massive physical damage and reducing the target armor by 30% for 5s.'
    ),
    sp(
      'axe-w3',
      'W',
      'Internal Bleeding',
      'Internal Bleeding',
      'Xuất Huyết Nội Khí (Internal Bleeding)',
      12,
      10,
      'Instant',
      'Tức thì',
      'Self (6m Cone)',
      'Hình nón 6m',
      'Quét lưỡi rìu theo hình nón phía trước, làm chậm kẻ địch 35% và khiến chúng chịu thêm sát thương vật lý mỗi khi bước đi.',
      'Swings your axe in a frontal cone, slowing enemies by 35% and inflicting internal bleeding that deals damage whenever they move.'
    ),
    sp(
      'axe-w4',
      'W',
      'Battle Rush',
      'Battle Rush',
      'Xung Trận Chiến Ý (Battle Rush)',
      18,
      14,
      'Instant',
      'Tức thì',
      '12m Dash',
      'Lướt 12m',
      'Lao thẳng tới vị trí chỉ định. Nếu trúng đồng minh sẽ tăng tốc cho cả hai; nếu trúng kẻ địch sẽ làm chậm và giảm 40% hồi máu của mục tiêu trong 5s.',
      'Dashes towards a target location. Allies hit gain movement speed; enemies hit are slowed and suffer -40% healing received for 5s.'
    ),
    sp(
      'axe-w5',
      'W',
      'Raging Blades',
      'Raging Blades',
      'Bão Lưỡi Rìu Cuồng Nộ (Raging Blades)',
      18,
      18,
      'Channel 2.5s',
      'Vận công 2.5s',
      'Self (5.5m AoE)',
      'Bản thân (5.5m AoE)',
      'Vận công xoay lưỡi rìu liên tục tạo thành cơn lốc tử thần xung quanh, tăng dần sát thương theo thời gian và tăng kháng khống chế. [Yêu cầu Tier VI+]',
      'Channels an expanding blade tempest dealing continuous AoE physical damage and increasing CC resistance. [Requires Tier VI+]',
      6
    ),
  ],
  passives: [
    sp(
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
      'Mỗi 4 đòn đánh thường, đòn đánh tiếp theo gây thêm hiệu ứng xuất huyết rút máu trong 3 giây.',
      'Every 4 auto-attacks, your next attack inflicts an extra bleed dealing damage over 3s.'
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
      'Hồi lại lượng máu tương đương 15% tổng sát thương từ đòn đánh thường của bạn.',
      'Restores health equal to 15% of the damage dealt by your auto-attacks.'
    ),
    sp(
      'axe-p3',
      'PASSIVE',
      'Aggressive Rush',
      'Aggressive Rush',
      'Xung Lực Công Kích (Aggressive Rush)',
      0,
      0,
      'Passive',
      'Nội tại',
      'Self',
      'Bản thân',
      'Mỗi 5 đòn đánh thường, bạn nhận được bùa lợi tăng 10% toàn bộ sát thương trong 4 giây.',
      'Every 5 normal attacks, gain +10% increased damage for 4s.'
    ),
    sp(
      'axe-p4',
      'PASSIVE',
      'Armor Piercer',
      'Armor Piercer',
      'Xuyên Phá Giáp (Armor Piercer)',
      0,
      0,
      'Passive',
      'Nội tại',
      'Self',
      'Bản thân',
      'Mỗi đòn đánh thường giảm nhẹ phòng thủ vật lý và phép của mục tiêu trong 3 giây (cộng dồn 5 lần).',
      'Each auto-attack reduces the target armor and magic resistance for 3s (stacks up to 5 times).'
    ),
  ],
};

// 1.2. SWORD (NHÁNH KIẾM)
export const SWORD_SHARED_SPELLS: SharedFamilySpells = {
  lineId: 'sword',
  name_en: 'Sword',
  name_vi: 'Nhánh Kiếm',
  slotQ: [
    sp(
      'sword-q1',
      'Q',
      'Heroic Strike',
      'Heroic Strike',
      'Nhát Chém Anh Hùng (Heroic Strike)',
      2,
      3,
      'Instant',
      'Tức thì',
      'Melee (3m)',
      'Cận chiến (3m)',
      'Chém kẻ địch gây sát thương vật lý và cho bạn 1 Điểm Anh Hùng (Heroic Charge), tăng 9% tốc độ di chuyển và 12% tốc độ đánh trong 6s (cộng dồn 3 lần).',
      'Deals physical damage and grants 1 Heroic Charge, increasing movement speed by 9% and attack speed by 12% for 6s (stacks up to 3 times).'
    ),
    sp(
      'sword-q2',
      'Q',
      'Iron Will',
      'Heroic Cleave',
      'Trảm Anh Hùng Diện Rộng (Heroic Cleave)',
      3,
      4,
      'Instant',
      'Tức thì',
      'Self (5m AoE)',
      'Bản thân (5m AoE)',
      'Chém một vòng tròn xung quanh, gây sát thương diện rộng. Nếu trúng ít nhất một kẻ địch sẽ nhận 1 Điểm Anh Hùng.',
      'Cleaves around you dealing physical damage to all nearby enemies. Grants 1 Heroic Charge if at least one enemy is struck.'
    ),
  ],
  slotW: [
    sp(
      'sword-w1',
      'W',
      'Hamstring',
      'Hamstring',
      'Chặt Gân Chân (Hamstring)',
      10,
      8,
      'Instant',
      'Tức thì',
      'Melee (3m)',
      'Cận chiến (3m)',
      'Chém vào chân mục tiêu, làm chậm kẻ địch 40% trong 4 giây và tăng nhẹ tốc độ chạy của bạn.',
      'Strikes target leg, slowing them by 40% for 4s and increasing your own speed.'
    ),
    sp(
      'sword-w2',
      'W',
      'Iron Will',
      'Iron Will',
      'Ý Chí Sắt Đá (Iron Will)',
      15,
      10,
      'Instant',
      'Tức thì',
      'Self',
      'Bản thân',
      'Tăng 20% tốc độ di chuyển, giải trừ và miễn nhiễm với các hiệu ứng thanh trừng (Purge) trong 4 giây, đồng thời nhận 1 Điểm Anh Hùng.',
      'Grants +20% movement speed, cleanses and grants purge immunity for 4s, and immediately adds 1 Heroic Charge.'
    ),
    sp(
      'sword-w3',
      'W',
      'Splitting Slash',
      'Splitting Slash',
      'Trảm Kích Chẻ Đôi (Splitting Slash)',
      12,
      14,
      '0.4s',
      '0.4 giây',
      '12m Line',
      'Đường thẳng 12m',
      'Phóng ra luồng khí kiếm trên đường thẳng 12m, gây sát thương vật lý và trói chân (Root) tất cả kẻ địch trúng phải trong 1.8s. [Yêu cầu Tier VI+]',
      'Sends a blade wave in a 12m line, dealing damage and rooting all enemies hit for 1.8s. [Requires Tier VI+]',
      6
    ),
  ],
  passives: [
    sp('sword-p1', 'PASSIVE', 'Heroic Fighting', 'Heroic Fighting', 'Chiến Khí Anh Hùng', 0, 0, 'Passive', 'Nội tại', 'Self', 'Bản thân', 'Mỗi 5 đòn đánh thường cho bạn 1 Điểm Anh Hùng.', 'Every 5 normal attacks grants 1 Heroic Charge.'),
    sp('sword-p2', 'PASSIVE', 'Deep Cuts', 'Deep Cuts', 'Vết Cắt Sâu', 0, 0, 'Passive', 'Nội tại', 'Self', 'Bản thân', 'Đòn đánh thường có xác suất gây xuất huyết.', 'Auto attacks have a chance to bleed.'),
    sp('sword-p3', 'PASSIVE', 'Life Leech', 'Life Leech', 'Hút Sinh Lực', 0, 0, 'Passive', 'Nội tại', 'Self', 'Bản thân', 'Hồi phục máu theo đòn đánh thường.', 'Heals for a portion of auto-attack damage.'),
    sp('sword-p4', 'PASSIVE', 'Increased Defense', 'Increased Defense', 'Cương Thể Phòng Ngự', 0, 0, 'Passive', 'Nội tại', 'Self', 'Bản thân', 'Tăng giáp và kháng phép cơ bản.', 'Increases base armor and magic resistance.'),
  ],
};

// 1.3. CROSSBOW (NHÁNH NỎ)
export const CROSSBOW_SHARED_SPELLS: SharedFamilySpells = {
  lineId: 'crossbow',
  name_en: 'Crossbow',
  name_vi: 'Nhánh Nỏ',
  slotQ: [
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
      'Bắn mũi tên nổ gây sát thương vật lý diện rộng trong bán kính 2.5m. Rất mạnh để kích hoạt nội tại Chuẩn Bị Kỹ Lưỡng.',
      'Fires an explosive bolt dealing AoE physical damage in a 2.5m radius.'
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
      'Channels a rapid barrage of 5 bolts over 1.9s while mobile, dealing high single-target damage.'
    ),
  ],
  slotW: [
    sp(
      'cb-w1',
      'W',
      'Knockback Shot',
      'Knockback Shot',
      'Phát Bắn Đẩy Lùi (Knockback Shot)',
      12,
      9,
      'Instant',
      'Tức thì',
      '11.5m',
      '11.5m',
      'Bắn một mũi tên nặng đẩy lùi mục tiêu ra xa 8 mét và làm gián đoạn các kỹ năng đang niệm của đối phương.',
      'Fires a heavy bolt that knocks the enemy back 8m and interrupts spellcasting.'
    ),
    sp(
      'cb-w2',
      'W',
      'Sunder Shot',
      'Sunder Shot',
      'Phát Bắn Xuyên Giáp (Sunder Shot)',
      10,
      8,
      '0.4s',
      '0.4 giây',
      '12m',
      '12m',
      'Bắn mũi tên xé giáp, giảm 40% giáp và kháng phép của mục tiêu trong 5 giây.',
      'Fires an armor-shredding bolt reducing the target defense by 40% for 5s.'
    ),
    sp(
      'cb-w3',
      'W',
      'Caltrops',
      'Caltrops',
      'Rải Bẫy Chông (Caltrops)',
      8,
      7,
      'Instant',
      'Tức thì',
      '12m Ground',
      '12m Mặt đất',
      'Rải bẫy gai trên mặt đất; kẻ địch dẫm phải chịu sát thương và bị làm chậm 50% trong 3 giây.',
      'Throws spiked traps that slow enemies by 50% for 3s and deal physical damage.'
    ),
    sp(
      'cb-w4',
      'W',
      'Noise Eraser',
      'Noise Eraser',
      'Câm Lặng Tầm Xa (Noise Eraser)',
      15,
      12,
      '0.6s',
      '0.6 giây',
      '13m',
      '13m',
      'Bắn mũi tên triệt tiêu âm thanh, làm Câm Lặng (Silence) mục tiêu trong 2.5 giây.',
      'Fires a sonic disrupting bolt that silences the target for 2.5s.'
    ),
    sp(
      'cb-w5',
      'W',
      'Sniper Shot',
      'Sniper Shot',
      'Phát Bắn Tỉa Hủy Diệt (Sniper Shot)',
      18,
      18,
      'Channel 2s',
      'Vận công 2s',
      '18m',
      '18m',
      'Đứng yên ngắm bắn tầm cực xa (18m), găm một mũi tên xuyên giáp hủy diệt đối thủ. [Yêu cầu Tier VI+]',
      'Aim down sights over 2s to deliver a devastating ultra long-range sniper shot. [Requires Tier VI+]',
      6
    ),
  ],
  passives: [
    sp('cb-p1', 'PASSIVE', 'Well-Prepared', 'Well-Prepared', 'Chuẩn Bị Kỹ Lưỡng', 0, 0, 'Passive', 'Nội tại', 'Self', 'Bản thân', 'Mỗi 4 lần sử dụng kỹ năng, kỹ năng Q tiếp theo được hồi chiêu ngay lập tức.', 'Every 4 spell casts, your next Q spell cooldown is immediately reset.'),
    sp('cb-p2', 'PASSIVE', 'Aggressive Rush', 'Aggressive Rush', 'Xung Lực Công Kích', 0, 0, 'Passive', 'Nội tại', 'Self', 'Bản thân', 'Đòn đánh thường tăng sát thương phép và vật lý.', 'Normal attacks buff overall damage output.'),
    sp('cb-p3', 'PASSIVE', 'Energetic', 'Energetic', 'Hồi Năng Lượng Nhanh', 0, 0, 'Passive', 'Nội tại', 'Self', 'Bản thân', 'Mỗi đòn đánh thường hồi phục một lượng năng lượng.', 'Restores energy on hit.'),
    sp('cb-p4', 'PASSIVE', 'Armor Piercer', 'Armor Piercer', 'Xuyên Phá Giáp', 0, 0, 'Passive', 'Nội tại', 'Self', 'Bản thân', 'Tăng chỉ số xuyên giáp cho toàn bộ phát bắn.', 'Provides passive armor penetration.'),
  ],
};

// 1.4. MACE (NHÁNH CHÙY)
export const MACE_SHARED_SPELLS: SharedFamilySpells = {
  lineId: 'mace',
  name_en: 'Mace',
  name_vi: 'Nhánh Chùy',
  slotQ: [
    sp('mace-q1', 'Q', 'Defensive Slam', 'Defensive Slam', 'Đập Khiên Phòng Ngự', 3, 4, 'Instant', 'Tức thì', 'Melee', 'Cận chiến', 'Đập chùy gây sát thương và tăng giáp cho bản thân trong 4s.', 'Slams enemy dealing damage and boosting your armor for 4s.'),
    sp('mace-q2', 'Q', 'Threatening Strike', 'Threatening Strike', 'Cú Đánh Khiêu Khích', 2.5, 3, 'Instant', 'Tức thì', 'Melee', 'Cận chiến', 'Gây sát thương và tạo lượng đe dọa (Threat) cực lớn với quái vật.', 'Strikes target generating massive threat against mobs.'),
  ],
  slotW: [
    sp('mace-w1', 'W', 'Heavy Smash', 'Heavy Smash', 'Cú Bổ Ngàn Cân', 10, 8, '0.4s', '0.4s', 'Melee', 'Cận chiến', 'Bổ chùy gây sát thương lớn và làm chậm 40%.', 'Heavy slam dealing damage and slowing by 40%.'),
    sp('mace-w2', 'W', 'Snare Charge', 'Snare Charge', 'Lướt Trói Chân (Snare Charge)', 15, 12, 'Instant', 'Tức thì', '12m', '12m', 'Lao tới vị trí chỉ định và trói chân kẻ địch trong 2.2 giây. [Yêu cầu Tier VI+]', 'Charges to target location, rooting enemies for 2.2s. [Requires Tier VI+]', 6),
  ],
  passives: [
    sp('mace-p1', 'PASSIVE', 'Stun Chance', 'Stun Chance', 'Cú Đánh Làm Choáng', 0, 0, 'Passive', 'Nội tại', 'Self', 'Bản thân', 'Đòn đánh thường có cơ hội làm choáng mục tiêu ngắn hạn.', 'Chance on hit to stun target briefly.'),
    sp('mace-p2', 'PASSIVE', 'Toughness', 'Toughness', 'Kiên Cường Phòng Thủ', 0, 0, 'Passive', 'Nội tại', 'Self', 'Bản thân', 'Giảm sát thương phải nhận.', 'Reduces damage received.'),
  ],
};

// 1.5. HAMMER (NHÁNH BÚA)
export const HAMMER_SHARED_SPELLS: SharedFamilySpells = {
  lineId: 'hammer',
  name_en: 'Hammer',
  name_vi: 'Nhánh Búa',
  slotQ: [
    sp('hammer-q1', 'Q', 'Threatening Smash', 'Threatening Smash', 'Bổ Đe Dọa', 3, 4, 'Instant', 'Tức thì', 'Melee', 'Cận chiến', 'Bổ búa gây sát thương và khiêu khích quái.', 'Strikes generating high threat.'),
    sp('hammer-q2', 'Q', 'Iron Breaker', 'Iron Breaker', 'Búa Phá Giáp', 3.5, 5, 'Instant', 'Tức thì', 'Melee', 'Cận chiến', 'Bổ mạnh phá giáp mục tiêu.', 'Reduces enemy resistances.'),
  ],
  slotW: [
    sp('hammer-w1', 'W', 'Heavy Cleave', 'Heavy Cleave', 'Chém Nặng Nề', 10, 9, '0.5s', '0.5s', 'Melee', 'Cận chiến', 'Vung búa gây sát thương diện rộng.', 'Swings hammer dealing AoE damage.'),
    sp('hammer-w2', 'W', 'Geyser', 'Geyser', 'Mạch Nước Phun (Geyser)', 16, 14, 'Instant', 'Tức thì', 'Self AoE', 'Diện rộng', 'Đập búa xuống đất hất tung kẻ địch trong 1.5 giây. [Yêu cầu Tier VI+]', 'Slams the ground knocking enemies airborne for 1.5s. [Requires Tier VI+]', 6),
  ],
  passives: [
    sp('hammer-p1', 'PASSIVE', 'Stun Chance', 'Stun Chance', 'Tỉ Lệ Choáng', 0, 0, 'Passive', 'Nội tại', 'Self', 'Bản thân', 'Đòn đánh có tỉ lệ làm choáng.', 'Attacks have a chance to stun.'),
    sp('hammer-p2', 'PASSIVE', 'Increased CC Duration', 'Increased CC Duration', 'Gia Tăng Khống Chế', 0, 0, 'Passive', 'Nội tại', 'Self', 'Bản thân', 'Tăng thời gian hiệu lực của các chiêu khống chế.', 'Increases crowd control duration.'),
  ],
};

// 1.6. WAR GLOVES (GĂNG CHIẾN)
export const WAR_GLOVES_SHARED_SPELLS: SharedFamilySpells = {
  lineId: 'war_gloves',
  name_en: 'War Gloves',
  name_vi: 'Găng Chiến',
  slotQ: [
    sp('wg-q1', 'Q', 'Dragon Leap', 'Dragon Leap', 'Long Quyền Nhảy Vọt', 3, 4, 'Instant', 'Tức thì', '8m Dash', '8m Lướt', 'Nhảy đấm lao vào mục tiêu gây sát thương và hất nhẹ đối phương.', 'Leaps and punches target dealing physical damage and knockback.'),
    sp('wg-q2', 'Q', 'Cross Counter', 'Cross Counter', 'Quyền Phản Đòn', 3, 4, 'Instant', 'Tức thì', 'Melee', 'Cận chiến', 'Thế đấm phản đòn đỡ đòn tấn công và phản lại sát thương cực lớn.', 'Counters enemy attack dealing heavy retaliation damage.'),
  ],
  slotW: [
    sp('wg-w1', 'W', 'Triple Kick', 'Triple Kick', 'Tam Tiước Liên Hoàn', 12, 10, 'Instant', 'Tức thì', '6m', '6m', 'Tung 3 cú đá liên tiếp đẩy lùi đối thủ.', 'Kicks 3 times chaining knockback and damage.'),
    sp('wg-w2', 'W', 'Fleetfoot', 'Fleetfoot', 'Bộ Pháp Thần Tốc (Fleetfoot)', 15, 12, 'Instant', 'Tức thì', 'Self', 'Bản thân', 'Lướt nhanh né đòn và tăng 50% tốc độ di chuyển trong 3s. [Yêu cầu Tier VI+]', 'Dashes forward dodging damage and granting 50% move speed. [Requires Tier VI+]', 6),
  ],
  passives: [
    sp('wg-p1', 'PASSIVE', 'Aggressive Rush', 'Aggressive Rush', 'Xung Kích', 0, 0, 'Passive', 'Nội tại', 'Self', 'Bản thân', 'Tăng sát thương mỗi chuỗi combo đấm.', 'Increases combo damage output.'),
    sp('wg-p2', 'PASSIVE', 'Energetic', 'Energetic', 'Năng Động', 0, 0, 'Passive', 'Nội tại', 'Self', 'Bản thân', 'Đòn đánh hồi phục năng lượng.', 'Restores energy on auto attacks.'),
  ],
};

// ============================================================================
// 2. HUNTER TREE (THỢ SĂN)
// ============================================================================

// 2.1. NATURE STAFF (GẬY TỰ NHIÊN)
export const NATURE_SHARED_SPELLS: SharedFamilySpells = {
  lineId: 'nature_staff',
  name_en: 'Nature Staff',
  name_vi: 'Gậy Tự Nhiên',
  slotQ: [
    sp(
      'nat-q1',
      'Q',
      'Rejuvenation',
      'Rejuvenation',
      'Tái Sinh Thảo Mộc (Rejuvenation)',
      1,
      2,
      'Instant',
      'Tức thì',
      '11m Target',
      '11m Mục tiêu',
      'Cấy hạt mầm hoa cỏ lên đồng minh, hồi máu liên tục mỗi giây trong 8 giây (cộng dồn tối đa 3 lần).',
      'Places a nature seed on an ally, healing over 8s (stacks up to 3 times).'
    ),
    sp(
      'nat-q2',
      'Q',
      'Rejuvenating Flower',
      'Rejuvenating Flower',
      'Đóa Hoa Tái Sinh (Rejuvenating Flower)',
      2.5,
      4,
      'Instant',
      'Tức thì',
      '13m Ground',
      '13m Mặt đất',
      'Thả một đóa hoa trên mặt đất; đồng minh bước qua sẽ nhận ngay 1 cộng dồn hồi máu Rejuvenation.',
      'Plants a mystical flower on the ground that grants 1 Rejuvenation stack to allies passing over it.'
    ),
    sp(
      'nat-q3',
      'Q',
      'Thorns',
      'Thorns',
      'Gai Nhọn Tự Nhiên (Thorns)',
      3,
      5,
      'Instant',
      'Tức thì',
      'Self',
      'Bản thân',
      'Tạo 3 lớp giáp gai xung quanh bản thân; đòn đánh thường kế tiếp của bạn chuyển thành đánh xa gây sát thương phép và tạo vũng gai làm chậm kẻ địch.',
      'Surrounds yourself with 3 thorny vines, converting auto-attacks into ranged magic strikes.'
    ),
  ],
  slotW: [
    sp(
      'nat-w1',
      'W',
      'Bramble Seed',
      'Bramble Seed',
      'Hạt Gai Nổ Chậm (Bramble Seed)',
      12,
      8,
      'Instant',
      'Tức thì',
      '12m Ground',
      '12m Mặt đất',
      'Ném hạt giống nảy mầm gây sát thương; sau 1 giây hạt giống phát nổ hất tung toàn bộ kẻ địch trong vùng ảnh hưởng.',
      'Throws an explosive bramble seed that knocks airborne and damages enemies after 1s.'
    ),
    sp(
      'nat-w2',
      'W',
      'Revitalize',
      'Revitalize',
      'Dưỡng Khí Phục Sinh (Revitalize)',
      10,
      12,
      'Channel 3s',
      'Duy trì 3s',
      '11m Target',
      '11m Mục tiêu',
      'Duy trì dòng năng lượng thiên nhiên hồi lượng máu và năng lượng cực lớn cho đồng minh mục tiêu.',
      'Channels life energy restoring massive health and energy to target ally over 3s.'
    ),
    sp(
      'nat-w3',
      'W',
      'Cleanse Heal',
      'Cleanse Heal',
      'Thanh Tẩy & Cứu Thương (Cleanse Heal)',
      15,
      14,
      'Instant',
      'Tức thì',
      '11m Target',
      '11m Mục tiêu',
      'Giải trừ toàn bộ hiệu ứng khống chế và bất lợi cho đồng minh, đồng thời hồi một lượng máu lớn.',
      'Cleanses all crowd control and debuffs from an ally while restoring health.'
    ),
    sp(
      'nat-w4',
      'W',
      'Protection of Nature',
      'Protection of Nature',
      'Bảo Hộ Thiên Nhiên (Protection of Nature)',
      18,
      14,
      'Instant',
      'Tức thì',
      '11m Target',
      '11m Mục tiêu',
      'Bao bọc đồng minh tăng 40% kháng toàn diện và +35% lượng máu nhận được từ mọi nguồn trong 6 giây.',
      'Envelops an ally, granting +40% defenses and +35% incoming healing for 6s.'
    ),
    sp(
      'nat-w5',
      'W',
      'Breeze',
      'Breeze',
      'Gió Thoảng Rừng Sâu (Breeze)',
      18,
      16,
      'Instant',
      'Tức thì',
      '11m AoE',
      '11m Diện rộng',
      'Thổi một làn gió mát lan tỏa toàn bộ các cộng dồn Tái Sinh sang cho tất cả đồng minh lân cận và tăng tốc chạy. [Yêu cầu Tier VI+]',
      'Sends a refreshing breeze that spreads active Rejuvenation stacks to all nearby allies and increases speed. [Requires Tier VI+]',
      6
    ),
  ],
  passives: [
    sp('nat-p1', 'PASSIVE', 'Adrenaline Driven', 'Adrenaline Driven', 'Hưng Phấn Sinh Lực', 0, 0, 'Passive', 'Nội tại', 'Self', 'Bản thân', 'Mỗi 4 lần tung chiêu tăng tốc độ chạy và tốc độ niệm phép trong 3 giây.', 'Every 4 spell casts, gain +20% move speed and cast speed for 3s.'),
    sp('nat-p2', 'PASSIVE', 'Energetic', 'Energetic', 'Hồi Phục Năng Lượng', 0, 0, 'Passive', 'Nội tại', 'Self', 'Bản thân', 'Đòn đánh thường hồi phục năng lượng cho người chơi.', 'Normal attacks restore energy.'),
    sp('nat-p3', 'PASSIVE', 'Calmness', 'Calmness', 'Tâm An Định', 0, 0, 'Passive', 'Nội tại', 'Self', 'Bản thân', 'Mỗi 5 đòn đánh tăng 15% phòng thủ trong 4 giây.', 'Every 5 attacks boosts defenses by 15% for 4s.'),
    sp('nat-p4', 'PASSIVE', 'Hit and Run', 'Hit and Run', 'Đánh & Rút Lui', 0, 0, 'Passive', 'Nội tại', 'Self', 'Bản thân', 'Bất cứ khi nào tung chiêu trúng kẻ địch, tăng tốc chạy trong 2 giây.', 'Hitting an enemy grants a quick burst of movement speed.'),
  ],
};

// 2.2. BOW (NHÁNH CUNG)
export const BOW_SHARED_SPELLS: SharedFamilySpells = {
  lineId: 'bow',
  name_en: 'Bow',
  name_vi: 'Nhánh Cung',
  slotQ: [
    sp('bow-q1', 'Q', 'Deadly Shot', 'Deadly Shot', 'Phát Bắn Chuẩn Xác (Deadly Shot)', 2, 4, '0.5s', '0.5s', '13m', '13m', 'Bắn một mũi tên tầm xa gây sát thương và giảm phòng thủ đối phương.', 'Fires a sniper arrow reducing enemy resistances.'),
    sp('bow-q2', 'Q', 'Multishot', 'Multishot', 'Bắn Loạt Đa Hướng (Multishot)', 3, 5, 'Instant', 'Tức thì', '11m Cone', 'Hình nón 11m', 'Bắn một chùm tên hình nón đẩy lùi kẻ địch và gây sát thương.', 'Fires a volley in a cone knocking back enemies.'),
    sp('bow-q3', 'Q', 'Poisoned Arrow', 'Poisoned Arrow', 'Mũi Tên Tẩm Độc (Poisoned Arrow)', 2, 4, 'Instant', 'Tức thì', '12m', '12m', 'Bắn mũi tên độc găm vào đối phương gây sát thương theo thời gian.', 'Fires a venomous arrow that deals poison damage over time.'),
  ],
  slotW: [
    sp('bow-w1', 'W', 'Frost Shot', 'Frost Shot', 'Tên Băng Nhảy Lùi (Frost Shot)', 12, 8, 'Instant', 'Tức thì', '12m', '12m', 'Nhảy lùi ra sau 8m đồng thời bắn một mũi tên băng làm chậm kẻ địch 60%.', 'Leaps backward 8m and fires a frost arrow slowing target by 60%.'),
    sp('bow-w2', 'W', 'Speed Shot', 'Speed Shot', 'Phát Bắn Thần Tốc', 10, 8, 'Instant', 'Tức thì', '12m', '12m', 'Bắn mũi tên tăng mạnh tốc độ di chuyển của bạn trong 4 giây.', 'Fires an arrow granting a large movement speed boost for 4s.'),
    sp('bow-w3', 'W', 'Ray of Light', 'Ray of Light', 'Tia Sáng Trói Chân (Ray of Light)', 15, 14, '0.4s', '0.4s', '14m Line', 'Đường thẳng 14m', 'Bắn một mũi tên ánh sáng trói chân toàn bộ kẻ địch trúng phải trong 2.5 giây. [Yêu cầu Tier VI+]', 'Fires a beam of light rooting all enemies hit for 2.5s. [Requires Tier VI+]', 6),
  ],
  passives: [
    sp('bow-p1', 'PASSIVE', 'Piercing Arrows', 'Piercing Arrows', 'Tên Xuyên Phá', 0, 0, 'Passive', 'Nội tại', 'Self', 'Bản thân', 'Mỗi 4 đòn đánh thường giảm phòng thủ mục tiêu.', 'Every 4 auto-attacks reduces enemy armor.'),
    sp('bow-p2', 'PASSIVE', 'Aggressive Rush', 'Aggressive Rush', 'Xung Kích Tấn Công', 0, 0, 'Passive', 'Nội tại', 'Self', 'Bản thân', 'Đòn đánh tăng sát thương tích lũy.', 'Boosts total damage on attack.'),
    sp('bow-p3', 'PASSIVE', 'Slow Poison', 'Slow Poison', 'Độc Làm Chậm', 0, 0, 'Passive', 'Nội tại', 'Self', 'Bản thân', 'Đòn đánh thường làm chậm tốc độ chạy đối thủ.', 'Auto-attacks lightly slow the target.'),
    sp('bow-p4', 'PASSIVE', 'Energetic', 'Energetic', 'Hồi Năng Lượng', 0, 0, 'Passive', 'Nội tại', 'Self', 'Bản thân', 'Mỗi đòn đánh hồi năng lượng.', 'Restores energy per auto-attack.'),
  ],
};

// 2.3. DAGGER (NHÁNH DAO GĂM)
export const DAGGER_SHARED_SPELLS: SharedFamilySpells = {
  lineId: 'dagger',
  name_en: 'Dagger',
  name_vi: 'Nhánh Dao Găm',
  slotQ: [
    sp('dag-q1', 'Q', 'Sunder Armor', 'Sunder Armor', 'Đâm Phá Giáp (Sunder Armor)', 2, 3, 'Instant', 'Tức thì', 'Melee', 'Cận chiến', 'Đâm dao gây sát thương và tích 1 điểm Sát Thủ (Assassin Spirit) tăng sát thương.', 'Deals physical damage and grants 1 Assassin Spirit charge.'),
    sp('dag-q2', 'Q', 'Deadly Swipe', 'Deadly Swipe', 'Quét Đao Tử Thần (Deadly Swipe)', 2.5, 4, 'Instant', 'Tức thì', '4m Dash', 'Lướt 4m', 'Lướt tới vung dao chém diện rộng và tích 1 điểm Sát Thủ.', 'Dashes 4m and sweeps daggers, granting 1 Assassin Spirit charge.'),
  ],
  slotW: [
    sp('dag-w1', 'W', 'Throwing Blades', 'Throwing Blades', 'Phi Phi Đao', 10, 8, 'Instant', 'Tức thì', '11m', '11m', 'Ném dao làm chậm và tăng tốc chạy cho bản thân.', 'Throws blades slowing target and speeding you up.'),
    sp('dag-w2', 'W', 'Dash', 'Dash', 'Lướt Ám Sát (Dash)', 10, 6, 'Instant', 'Tức thì', '10m', '10m', 'Lướt nhanh 10 mét tới vị trí chỉ định.', 'Dashes 10m towards target location.'),
    sp('dag-w3', 'W', 'Shadow Edge', 'Shadow Edge', 'Lưỡi Dao Bóng Đêm (Shadow Edge)', 15, 12, 'Instant', 'Tức thì', '14m Line', '14m', 'Phóng ra một bóng kiếm; nếu trúng kẻ địch sẽ kéo bạn tới và làm choáng kẻ địch 1.5s. [Yêu cầu Tier VI+]', 'Fires a shadow blade that pulls you to the target and stuns them for 1.5s. [Requires Tier VI+]', 6),
  ],
  passives: [
    sp('dag-p1', 'PASSIVE', 'Deep Cuts', 'Deep Cuts', 'Vết Cắt Sâu', 0, 0, 'Passive', 'Nội tại', 'Self', 'Bản thân', 'Đòn đánh thường gây xuất huyết.', 'Auto attacks inflict bleed.'),
    sp('dag-p2', 'PASSIVE', 'Life Leech', 'Life Leech', 'Hút Sinh Lực', 0, 0, 'Passive', 'Nội tại', 'Self', 'Bản thân', 'Hút máu từ đòn đánh.', 'Lifesteal on auto-attacks.'),
    sp('dag-p3', 'PASSIVE', 'Aggressive Rush', 'Aggressive Rush', 'Cuồng Nộ', 0, 0, 'Passive', 'Nội tại', 'Self', 'Bản thân', 'Tăng sát thương công kích.', 'Increases damage on hit.'),
    sp('dag-p4', 'PASSIVE', 'Attack Speed', 'Quick Reflexes', 'Phản Xạ Nhanh', 0, 0, 'Passive', 'Nội tại', 'Self', 'Bản thân', 'Tăng vĩnh viễn tốc độ đánh.', 'Increases auto attack speed.'),
  ],
};

// 2.4. SPEAR (NHÁNH THƯƠNG)
export const SPEAR_SHARED_SPELLS: SharedFamilySpells = {
  lineId: 'spear',
  name_en: 'Spear',
  name_vi: 'Nhánh Thương',
  slotQ: [
    sp('spear-q1', 'Q', 'Lunging Strike', 'Lunging Strike', 'Đâm Tới (Lunging Strike)', 2.5, 3, 'Instant', 'Tức thì', '5m', '5m', 'Đâm giáo tầm xa 5m gây sát thương và tích 1 Điểm Tinh Thần Thương (Spirit Spear Charge).', 'Stabs with spear granting 1 Spirit Spear Charge.'),
  ],
  slotW: [
    sp('spear-w1', 'W', 'Forest of Spears', 'Forest of Spears', 'Rừng Mác Liên Hoàn', 12, 10, 'Channel 2s', 'Duy trì 2s', '6m Cone', 'Hình nón 6m', 'Đâm liên tục hàng chục mũi giáo gây sát thương diện rộng.', 'Channels a flurry of spear thrusts in a cone.'),
    sp('spear-w2', 'W', 'Crippling Mire', 'Crippling Mire', 'Đầm Lầy Tàn Phế', 14, 12, 'Instant', 'Tức thì', 'Self AoE', 'Diện rộng', 'Làm chậm kẻ địch xung quanh và giải trừ tốc độ chạy của đối phương.', 'Slows nearby enemies and purges enemy movement buffs.'),
    sp('spear-w3', 'W', 'Harpoon', 'Harpoon', 'Lao Móc Đoạt Mệnh (Harpoon)', 16, 14, '0.4s', '0.4s', '14m', '14m', 'Phóng cây lao kéo mục tiêu từ xa lại gần bạn. [Yêu cầu Tier VI+]', 'Launches a harpoon that drags target back to your position. [Requires Tier VI+]', 6),
  ],
  passives: [
    sp('spear-p1', 'PASSIVE', 'Life Leech', 'Life Leech', 'Hút Máu', 0, 0, 'Passive', 'Nội tại', 'Self', 'Bản thân', 'Hồi máu từ đòn đánh thường.', 'Heals from normal attacks.'),
    sp('spear-p2', 'PASSIVE', 'Aggressive Rush', 'Aggressive Rush', 'Xung Kích', 0, 0, 'Passive', 'Nội tại', 'Self', 'Bản thân', 'Tăng sát thương công kích.', 'Increases attack damage.'),
  ],
};

// 2.5. QUARTERSTAFF (GẬY CÔN)
export const QUARTERSTAFF_SHARED_SPELLS: SharedFamilySpells = {
  lineId: 'quarterstaff',
  name_en: 'Quarterstaff',
  name_vi: 'Gậy Côn',
  slotQ: [
    sp('qs-q1', 'Q', 'Concussive Blow', 'Concussive Blow', 'Đòn Đập Chấn Động', 2, 3, 'Instant', 'Tức thì', 'Melee', 'Cận chiến', 'Đập côn gây sát thương và làm chậm mục tiêu, tích điểm choáng.', 'Strikes target slowing them and building towards a stun.'),
  ],
  slotW: [
    sp('qs-w1', 'W', 'Empowered Slam', 'Empowered Slam', 'Cú Bổ Tăng Cường', 10, 8, 'Instant', 'Tức thì', 'Melee', 'Cận chiến', 'Tung đòn đập mạnh đẩy lùi mục tiêu.', 'Slams enemy pushing them backward.'),
    sp('qs-w2', 'W', 'Forceful Swing', 'Forceful Swing', 'Vung Côn Bạt Gió (Forceful Swing)', 15, 12, 'Instant', 'Tức thì', 'Self AoE', 'Diện rộng', 'Xoay tròn côn hất tung và đẩy văng toàn bộ kẻ địch xung quanh. [Yêu cầu Tier VI+]', 'Spins staff knocking back and disrupting all nearby enemies. [Requires Tier VI+]', 6),
  ],
  passives: [
    sp('qs-p1', 'PASSIVE', 'Stun Chance', 'Stun Chance', 'Tỉ Lệ Choáng', 0, 0, 'Passive', 'Nội tại', 'Self', 'Bản thân', 'Đòn đánh có xác suất làm choáng.', 'Attacks have a chance to stun.'),
  ],
};

// 2.6. SHAPESHIFTER (GẬY BIẾN HÌNH)
export const SHAPESHIFTER_SHARED_SPELLS: SharedFamilySpells = {
  lineId: 'shapeshifter',
  name_en: 'Shapeshifter',
  name_vi: 'Gậy Biến Hình',
  slotQ: [
    sp('ss-q1', 'Q', 'Shift Blast', 'Shift Blast', 'Phóng Ma Lực', 2.5, 4, '0.4s', '0.4s', '12m', '12m', 'Bắn luồng ma pháp tích lũy Năng Lượng Biến Hình (Shift Charges).', 'Fires a magical blast that generates Shift Charges.'),
  ],
  slotW: [
    sp('ss-w1', 'W', 'Polymorph Surge', 'Polymorph Surge', 'Làn Sóng Biến Thân', 12, 10, 'Instant', 'Tức thì', 'Self', 'Bản thân', 'Hồi phục năng lượng và chuẩn bị hóa thân linh thú.', 'Restores shifting energy and grants burst speed.'),
  ],
  passives: [
    sp('ss-p1', 'PASSIVE', 'Primal Affinity', 'Primal Affinity', 'Huyết Thống Nguyên Thủy', 0, 0, 'Passive', 'Nội tại', 'Self', 'Bản thân', 'Tăng sức mạnh khi ở dạng linh thú.', 'Increases form damage and survivability.'),
  ],
};

// ============================================================================
// 3. MAGE TREE (PHÁP SƯ)
// ============================================================================

// 3.1. FIRE STAFF (GẬY LỬA)
export const FIRE_SHARED_SPELLS: SharedFamilySpells = {
  lineId: 'fire_staff',
  name_en: 'Fire Staff',
  name_vi: 'Nhánh Gậy Lửa',
  slotQ: [
    sp('fire-q1', 'Q', 'Fire Bolt', 'Fire Bolt', 'Cầu Lửa (Fire Bolt)', 1.5, 4, '0.8s', '0.8s', '12m', '12m', 'Bắn quả cầu lửa gây sát thương thiêu đốt liên tục.', 'Launches a fire bolt inflicting burning.'),
    sp('fire-q2', 'Q', 'Burning Field', 'Burning Field', 'Vùng Lửa Rực Cháy', 3, 5, 'Instant', 'Tức thì', '12m Ground', '12m Mặt đất', 'Đốt cháy một vùng đất gây sát thương phép liên tục cho ai bước vào.', 'Ignites ground dealing burning damage to anyone inside.'),
  ],
  slotW: [
    sp('fire-w1', 'W', 'Fire Ball', 'Fire Ball', 'Hỏa Cầu Diện Rộng', 10, 10, '0.6s', '0.6s', '13m', '13m', 'Phóng đại cầu lửa phát nổ gây sát thương diện rộng và để lại vệt cháy.', 'Launches an exploding fireball dealing AoE damage.'),
    sp('fire-w2', 'W', 'Wall of Flames', 'Wall of Flames', 'Tường Lửa Chặn Địch (Wall of Flames)', 18, 16, 'Instant', 'Tức thì', '11m Line', 'Đường 11m', 'Dựng một bức tường lửa thiêu đốt và đẩy lùi bất kỳ kẻ địch nào dám chạm vào. [Yêu cầu Tier VI+]', 'Creates a fiery barrier that fears and repels enemies attempting to cross. [Requires Tier VI+]', 6),
  ],
  passives: [
    sp('fire-p1', 'PASSIVE', 'Burn', 'Burn', 'Thiêu Đốt', 0, 0, 'Passive', 'Nội tại', 'Self', 'Bản thân', 'Đòn đánh và kỹ năng gây hiệu ứng cháy rút máu.', 'Attacks cause target to burn.'),
    sp('fire-p2', 'PASSIVE', 'Aggressive Caster', 'Aggressive Caster', 'Pháp Tốc Công Kích', 0, 0, 'Passive', 'Nội tại', 'Self', 'Bản thân', 'Tăng tốc độ niệm phép sau mỗi vài đòn đánh.', 'Increases casting speed after spells.'),
  ],
};

// 3.2. FROST STAFF (GẬY BĂNG)
export const FROST_SHARED_SPELLS: SharedFamilySpells = {
  lineId: 'frost_staff',
  name_en: 'Frost Staff',
  name_vi: 'Nhánh Gậy Băng',
  slotQ: [
    sp('frost-q1', 'Q', 'Frostbolt', 'Frostbolt', 'Tia Băng Giá', 1.5, 4, '0.8s', '0.8s', '12m', '12m', 'Bắn tia băng gây sát thương và làm chậm đối phương.', 'Fires a frostbolt slowing target.'),
    sp('frost-q2', 'Q', 'Ice Shard', 'Ice Shard', 'Mảnh Băng Sắc Nhọn', 2, 4, 'Instant', 'Tức thì', '12m Ground', '12m Mặt đất', 'Tạo mảnh băng nổ tức thì trên mặt đất.', 'Detonates an ice shard on the ground.'),
  ],
  slotW: [
    sp('frost-w1', 'W', 'Frost Beam', 'Frost Beam', 'Tia Băng Hủy Diệt', 12, 12, 'Channel 3s', 'Duy trì 3s', '11m', '11m', 'Chiếu tia băng liên tục làm chậm cực đại và gây sát thương tăng dần.', 'Channels a continuous freezing beam.'),
    sp('frost-w2', 'W', 'Frost Nova', 'Frost Nova', 'Vòng Băng Đóng Băng (Frost Nova)', 16, 14, 'Instant', 'Tức thì', 'Self AoE', 'Diện rộng', 'Phát nổ vòng tròn băng xung quanh, đóng băng và trói chân toàn bộ kẻ địch trong 2s. [Yêu cầu Tier VI+]', 'Freezes and roots all nearby enemies for 2s. [Requires Tier VI+]', 6),
  ],
  passives: [
    sp('frost-p1', 'PASSIVE', 'Frost', 'Frost', 'Băng Giá Làm Chậm', 0, 0, 'Passive', 'Nội tại', 'Self', 'Bản thân', 'Đòn đánh làm chậm mục tiêu.', 'Attacks slow enemies.'),
  ],
};

// 3.3. HOLY STAFF (GẬY THÁNH)
export const HOLY_SHARED_SPELLS: SharedFamilySpells = {
  lineId: 'holy_staff',
  name_en: 'Holy Staff',
  name_vi: 'Nhánh Gậy Thánh',
  slotQ: [
    sp('holy-q1', 'Q', 'Generous Heal', 'Generous Heal', 'Hồi Máu Quảng Đại', 1.5, 4, '1s', '1s', '11m', '11m', 'Niệm ánh sáng thánh hồi lượng máu đơn mục tiêu cực lớn.', 'Heals a single ally for a large amount.'),
    sp('holy-q2', 'Q', 'Flash Heal', 'Flash Heal', 'Ánh Chớp Cứu Sinh', 1, 3, '0.4s', '0.4s', '11m', '11m', 'Niệm nhanh hồi máu tức thời.', 'Rapidly heals ally.'),
  ],
  slotW: [
    sp('holy-w1', 'W', 'Sacred Pulse', 'Sacred Pulse', 'Xung Lực Thánh Quang', 12, 10, 'Instant', 'Tức thì', '11m AoE', '11m Diện rộng', 'Tạo xung lực đẩy lùi kẻ địch xung quanh đồng minh và hồi máu.', 'Knocks back enemies around target ally and heals.'),
    sp('holy-w2', 'W', 'Celestial Sphere', 'Celestial Sphere', 'Thiên Cầu Thánh Bảo (Celestial Sphere)', 16, 14, 'Instant', 'Tức thì', '11m', '11m', 'Thả một quả cầu ánh sáng nảy qua lại giữa các đồng minh hồi máu liên tục. [Yêu cầu Tier VI+]', 'Spawns a bouncing orb that heals multiple allies. [Requires Tier VI+]', 6),
  ],
  passives: [
    sp('holy-p1', 'PASSIVE', 'Energetic', 'Energetic', 'Hồi Năng Lượng', 0, 0, 'Passive', 'Nội tại', 'Self', 'Bản thân', 'Đòn đánh hồi phục mana.', 'Restores mana on hit.'),
  ],
};

// 3.4. ARCANE STAFF (GẬY THẦN BÍ)
export const ARCANE_SHARED_SPELLS: SharedFamilySpells = {
  lineId: 'arcane_staff',
  name_en: 'Arcane Staff',
  name_vi: 'Nhánh Gậy Thần Bí',
  slotQ: [
    sp('arc-q1', 'Q', 'Arcane Protection', 'Arcane Protection', 'Khiên Ma Pháp Bí Thuật', 2.5, 4, 'Instant', 'Tức thì', '11m', '11m', 'Bọc một lớp khiên ma pháp hấp thụ sát thương cho đồng minh.', 'Shields an ally absorbing damage.'),
  ],
  slotW: [
    sp('arc-w1', 'W', 'Empowering Beam', 'Empowering Beam', 'Tia Cường Hóa Ma Lực', 12, 10, 'Channel 3s', 'Duy trì 3s', '11m', '11m', 'Chiếu tia năng lượng tăng 40% sát thương cho đồng minh mục tiêu.', 'Increases target ally damage output by 40%.'),
    sp('arc-w2', 'W', 'Time Corridor', 'Time Corridor', 'Hành Lang Thời Gian (Time Corridor)', 18, 16, 'Instant', 'Tức thì', '12m Line', 'Đường 12m', 'Tạo hành lang ma thuật tăng 60% tốc độ cho đồng minh và làm chậm 60% kẻ địch. [Yêu cầu Tier VI+]', 'Creates a temporal corridor speeding allies and heavily slowing enemies. [Requires Tier VI+]', 6),
  ],
  passives: [
    sp('arc-p1', 'PASSIVE', 'Adrenaline Driven', 'Adrenaline Driven', 'Tăng Tốc Biến Hóa', 0, 0, 'Passive', 'Nội tại', 'Self', 'Bản thân', 'Tăng tốc niệm phép.', 'Boosts cast speed.'),
  ],
};

// 3.5. CURSED STAFF (GẬY NGUYỀN RỦA)
export const CURSED_SHARED_SPELLS: SharedFamilySpells = {
  lineId: 'cursed_staff',
  name_en: 'Cursed Staff',
  name_vi: 'Nhánh Gậy Nguyền Rủa',
  slotQ: [
    sp('curse-q1', 'Q', 'Vile Curse', 'Vile Curse', 'Lời Nguyền Độc Địa (Vile Curse)', 1.5, 3, 'Instant', 'Tức thì', '11m', '11m', 'Nguyền rủa mục tiêu gây sát thương theo thời gian (cộng dồn 4 lần).', 'Inflicts Vile Curse dealing damage over time (stacks up to 4 times).'),
    sp('curse-q2', 'Q', 'Cursed Sickle', 'Cursed Sickle', 'Lưỡi Liềm Hắc Ám', 2.5, 4, 'Instant', 'Tức thì', '12m Line', 'Đường 12m', 'Phóng lưỡi liềm bay đi rồi quay lại găm nguyền rủa lên tất cả kẻ địch trúng phải.', 'Boomerangs a sickle applying curse stacks to all hit.'),
  ],
  slotW: [
    sp('curse-w1', 'W', 'Armor Piercer', 'Armor Piercer', 'Tia Hắc Ám Xuyên Giáp', 10, 8, '0.4s', '0.4s', '12m', '12m', 'Bắn tia ma thuật hắc ám giảm giáp đối phương.', 'Pierces target resistances.'),
    sp('curse-w2', 'W', 'Cursed Beam', 'Cursed Beam', 'Chùm Tia Nguyền Rủa (Cursed Beam)', 16, 14, 'Channel 3s', 'Duy trì 3s', '11m', '11m', 'Bắn luồng hắc khí rút cạn sinh lực kẻ địch và liên tục tăng cộng dồn nguyền rủa. [Yêu cầu Tier VI+]', 'Channels a devastating dark beam rapidly stacking curses on target. [Requires Tier VI+]', 6),
  ],
  passives: [
    sp('curse-p1', 'PASSIVE', 'Bane', 'Bane', 'Hắc Lực', 0, 0, 'Passive', 'Nội tại', 'Self', 'Bản thân', 'Mỗi đòn đánh thường có xác suất tích nguyền.', 'Chance on attack to apply curse stack.'),
  ],
};

// ============================================================================
// 4. REGISTRY OF ALL WEAPON FAMILIES
// ============================================================================
export const WEAPON_FAMILY_SPELL_REGISTRY: Record<string, SharedFamilySpells> = {
  axe: AXE_SHARED_SPELLS,
  sword: SWORD_SHARED_SPELLS,
  crossbow: CROSSBOW_SHARED_SPELLS,
  mace: MACE_SHARED_SPELLS,
  hammer: HAMMER_SHARED_SPELLS,
  war_gloves: WAR_GLOVES_SHARED_SPELLS,
  nature_staff: NATURE_SHARED_SPELLS,
  bow: BOW_SHARED_SPELLS,
  dagger: DAGGER_SHARED_SPELLS,
  spear: SPEAR_SHARED_SPELLS,
  quarterstaff: QUARTERSTAFF_SHARED_SPELLS,
  shapeshifter: SHAPESHIFTER_SHARED_SPELLS,
  fire_staff: FIRE_SHARED_SPELLS,
  frost_staff: FROST_SHARED_SPELLS,
  holy_staff: HOLY_SHARED_SPELLS,
  arcane_staff: ARCANE_SHARED_SPELLS,
  cursed_staff: CURSED_SHARED_SPELLS,
};

/**
 * Resolves the WeaponFamily identifier from a raw base_identifier string.
 */
export function resolveWeaponFamily(baseIdentifier: string): string {
  const b = baseIdentifier.toUpperCase();
  if (b.includes('AXE') || b.includes('SCYTHE') || b.includes('HALBERD')) return 'axe';
  if (b.includes('CROSSBOW')) return 'crossbow';
  if (b.includes('NATURESTAFF') || b.includes('WILDSTAFF')) return 'nature_staff';
  if (b.includes('SWORD') || b.includes('CLAYMORE') || b.includes('CLEAVER')) return 'sword';
  if (b.includes('DAGGER') || b.includes('CLAW') || b.includes('RAPIER') || b.includes('SICKLE') || b.includes('KATAR')) return 'dagger';
  if (b.includes('BOW')) return 'bow';
  if (b.includes('SPEAR') || b.includes('GLAIVE') || b.includes('HARPOON') || b.includes('TRIDENT')) return 'spear';
  if (b.includes('HOLYSTAFF') || b.includes('DIVINESTAFF')) return 'holy_staff';
  if (b.includes('FIRESTAFF') || b.includes('INFERNOSTAFF') || b.includes('FIRE_RING')) return 'fire_staff';
  if (b.includes('FROSTSTAFF') || b.includes('GLACIALSTAFF') || b.includes('ICE')) return 'frost_staff';
  if (b.includes('CURSEDSTAFF') || b.includes('DEMONIC') || b.includes('SKULLORB')) return 'cursed_staff';
  if (b.includes('ARCANESTAFF') || b.includes('ENIGMATIC') || b.includes('ARCANE_RING')) return 'arcane_staff';
  if (b.includes('QUARTERSTAFF') || b.includes('DOUBLEBLADED') || b.includes('IRONCLAD') || b.includes('COMBATSTAFF')) return 'quarterstaff';
  if (b.includes('MACE') || b.includes('FLAIL')) return 'mace';
  if (b.includes('HAMMER') || b.includes('POLEHAMMER') || b.includes('RAM')) return 'hammer';
  if (b.includes('KNUCKLES')) return 'war_gloves';
  if (b.includes('SHAPESHIFTER')) return 'shapeshifter';
  if (b.includes('SHIELD')) return 'shield';
  if (b.includes('TORCH') || b.includes('HORN') || b.includes('LAMP') || b.includes('JESTERCANE')) return 'torch';
  if (b.includes('BOOK') || b.includes('TOME') || b.includes('ORB') || b.includes('DEMONSKULL') || b.includes('CENSER')) return 'tome';
  return 'general';
}

/**
 * Gets the shared family spells for a weapon family.
 */
export function getFamilySpellPool(lineId: string): SharedFamilySpells | undefined {
  return WEAPON_FAMILY_SPELL_REGISTRY[lineId];
}
