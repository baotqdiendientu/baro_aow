import { AlbionEnchantment, AlbionQuality, AlbionSlotType, AlbionTier } from '@/types/albion';

// ============================================================================
// 1. WEAPON TIPS & PLAYBOOK SCHEMA (MẸO VŨ KHÍ & ĐỐI ĐẦU)
// ============================================================================

export type ComboSlotStep =
  | 'slotQ'
  | 'slotW'
  | 'slotE'
  | 'slotPassive'
  | 'slotHead'
  | 'slotArmor'
  | 'slotShoes'
  | 'slotPotion'
  | 'autoAttack';

export interface ComboStepDetail {
  slot: ComboSlotStep;
  slotLabel: string; // e.g. 'Q', 'W', 'E', 'D (Áo)', 'F (Giày)', 'AA'
  spellIcon: string; // Spell icon name for <AlbionImage type="spell" />
  spellName_vi: string;
  spellName_en: string;
  note_vi?: string;
  note_en?: string;
}

export interface WeaponCombo {
  id: string;
  title_vi: string;
  title_en: string;
  modeTag: 'PvE Burst' | '1v1 Mists / Corrupted' | 'Small-Scale Brawl' | 'ZvZ Engage';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  sequence: ComboSlotStep[]; // e.g. ['slotW', 'slotE', 'slotQ', 'slotArmor', 'slotE', 'slotQ']
  steps: ComboStepDetail[];
  description_vi: string;
  description_en: string;
}

export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';

export interface WeaponMatchupEntry {
  opponentUniqueName: string; // e.g. 'T8_MAIN_RAPIER_MORGANA' (Bloodletter)
  opponentBaseId: string; // e.g. 'MAIN_RAPIER_MORGANA'
  opponentName_vi: string;
  opponentName_en: string;
  relation: 'goodAgainst' | 'weakAgainst' | 'skillMatchup';
  threatLevel: ThreatLevel;
  keyEnemySkill_vi: string;
  keyEnemySkill_en: string;
  keyEnemySpellIcon: string;
  counterTip_vi: string;
  counterTip_en: string;
  defensiveAction_vi: string;
  defensiveAction_en: string;
}

export interface UGCTip {
  id: string;
  weaponIdentifier: string; // e.g. 'MAIN_1HCROSSBOW' or '2H_SCYTHE_CRYSTAL'
  author: string;
  authorBadge_vi: string;
  authorBadge_en: string;
  content_vi: string;
  content_en: string;
  upvotes: number;
  downvotes: number;
  patchVersion: string; // e.g. 'v1.26 (Horizon)' or 'v1.21 (Into the Fray)'
  isOutdated?: boolean;
  createdAt: string;
}

export interface WeaponTipsSchema {
  id: string;
  weaponFamily: string; // Links to 8 Base Weapons family lineId ('crossbow', 'axe', 'nature_staff', etc.)
  baseIdentifier: string; // Specific base weapon e.g. 'MAIN_1HCROSSBOW', '2H_SCYTHE_CRYSTAL'
  weaponName_vi: string;
  weaponName_en: string;
  playstyleSummary_vi: string;
  playstyleSummary_en: string;
  powerSpikes_vi: string[];
  powerSpikes_en: string[];
  combos: WeaponCombo[];
  matchups: {
    goodAgainst: WeaponMatchupEntry[];
    weakAgainst: WeaponMatchupEntry[];
    allMatchups: WeaponMatchupEntry[]; // Indexed for instant "Check Đối Thủ" search
  };
  communityTips: UGCTip[];
}

// ============================================================================
// 2. PVE GUIDES SCHEMA (CẨM NANG PVE & BOSS MECHANICS)
// ============================================================================

export type PvEActivityType = 'Avalonian' | 'GroupDungeon' | 'HCE' | 'Corrupted';

export type PvERoleType = 'Tank' | 'Healer' | 'DPS' | 'Support';

export interface PvERoleRecommendedSlot {
  slot: AlbionSlotType;
  uniqueName: string;
  name_vi: string;
  name_en: string;
  tier: AlbionTier;
  enchantment: AlbionEnchantment;
  quality: AlbionQuality;
  keySpell_vi: string;
  keySpell_en: string;
}

export interface PvERoleGuide {
  role: PvERoleType;
  roleTitle_vi: string;
  roleTitle_en: string;
  minIp: number;
  optimalIp: number;
  suggestedBuild: string; // Link to Loadout ID / preset slug e.g. '/build/light-crossbow-pve'
  dutySummary_vi: string;
  dutySummary_en: string;
  rotationTip_vi: string;
  rotationTip_en: string;
  equipment: PvERoleRecommendedSlot[];
}

export interface BossMechanicItem {
  id: string;
  skillName_vi: string;
  skillName_en: string;
  spellIcon: string;
  isWipeMechanic: boolean; // True -> Red Alert Icon ("Wipe" / Chết cả team)
  telegraph_vi: string; // Dấu hiệu nhận biết
  telegraph_en: string;
  countermeasure_vi: string; // Cách đối phó (Shield Icon)
  countermeasure_en: string;
}

export interface PvEBossGuide {
  id: string;
  bossName_vi: string;
  bossName_en: string;
  tierLabel: string;
  archetype_vi: string;
  archetype_en: string;
  difficulty: 'Medium' | 'Hard' | 'Extreme (Raid Wipe)';
  summary_vi: string;
  summary_en: string;
  mechanics: BossMechanicItem[];
}

export interface PvEGuideSchema {
  id: string;
  activityType: PvEActivityType;
  title_vi: string;
  title_en: string;
  subtitle_vi: string;
  subtitle_en: string;
  recommendedPartySize: string;
  fameMultiplierLabel: string;
  silverPerHourLabel: string;
  overview_vi: string;
  overview_en: string;
  checklist_vi: string[];
  checklist_en: string[];
  ipRequirements: {
    tierLabel: string;
    tankIp: string;
    healerIp: string;
    dpsIp: string;
    note_vi: string;
    note_en: string;
  }[];
  roles: PvERoleGuide[];
  bosses: PvEBossGuide[];
}

// ============================================================================
// 3. MOCK DATA: WEAPON PLAYBOOKS (LIGHT CROSSBOW, CRYSTAL REAPER & GLOBAL)
// ============================================================================

export const CURRENT_PATCH_VERSION = 'v1.26 (Horizon)';

/**
 * Global library of common Mists / Corrupted / Open-World opponents for "Check Đối Thủ"
 * so typing ANY popular meta weapon ("Bloodletter", "Deathgivers", "Dual Swords", "Bow", etc.)
 * immediately renders a tactical emergency counter card.
 */
export const GLOBAL_OPPONENT_COUNTER_DB: WeaponMatchupEntry[] = [
  {
    opponentUniqueName: 'T8_MAIN_RAPIER_MORGANA',
    opponentBaseId: 'MAIN_RAPIER_MORGANA',
    opponentName_vi: 'Bloodletter (Kiếm Tử Thần)',
    opponentName_en: 'Bloodletter',
    relation: 'weakAgainst',
    threatLevel: 'EXTREME',
    keyEnemySkill_vi: 'Lunging Stabs (E) - Kết liễu mục tiêu dưới 40% máu',
    keyEnemySkill_en: 'Lunging Stabs (E) - Execute below 40% HP',
    keyEnemySpellIcon: 'Lunging Strike',
    counterTip_vi:
      'CẢNH BÁO ĐỎ: Tuyệt đối KHÔNG để máu tụt xuống ngưỡng 40% khi Bloodletter còn chiêu E! Giữ ngón tay sẵn trên Cleric Robe (D) hoặc Mũ Hiệp Sĩ/Giày Blink để bấm bất tử ngay khoảnh khắc hắn lướt W (Dash) áp sát.',
    counterTip_en:
      'RED ALERT: NEVER drop below 40% HP while Bloodletter has E ready! Pre-hover Cleric Robe (D) or Dodge Roll (F) the exact split-second they W-Dash toward you.',
    defensiveAction_vi:
      'Bật khiên bất tử (Everlasting Spirit / Cleric Robe) ở mốc 45% máu hoặc dùng Knockback Shot đẩy lùi trước khi hắn kịp bấm E.',
    defensiveAction_en:
      'Pop Cleric Robe invulnerability at 45% HP or interrupt their W-Dash entry with Knockback Shot / Purge.',
  },
  {
    opponentUniqueName: 'T8_2H_DUALDAGGER_HELL',
    opponentBaseId: '2H_DUALDAGGER_HELL',
    opponentName_vi: 'Deathgivers (Song Dao Tử Thần)',
    opponentName_en: 'Deathgivers',
    relation: 'weakAgainst',
    threatLevel: 'EXTREME',
    keyEnemySkill_vi: 'Ghost Strike (E) - Chém tàng hình không hồi chiêu khi đủ 3 스택 Q',
    keyEnemySkill_en: 'Ghost Strike (E) - Stealth execute reset at 3x Q stacks',
    keyEnemySpellIcon: 'Shadow Edge',
    counterTip_vi:
      'Đếm số điểm Sunder Armor / Assassin Spirit (Q) trên người hắn! Khi hắn tích đủ 3 điểm Q, hắn sẽ dùng E chém xuyên giáp kèm tàng hình. Hãy dùng kỹ năng đẩy lùi hoặc tàng hình ngắt nhịp tích Q thứ 3.',
    counterTip_en:
      'Track their Q stacks! At 3 stacks, Ghost Strike (E) resets cooldown and grants brief invisibility. Kite or CC them before they land the 3rd Q.',
    defensiveAction_vi:
      'Dùng mũ Hunter Hood (Phản Đòn) hoặc Cleric Robe ngay khi thấy hắn tích đủ 3 cộng dồn Q trên thanh trạng thái.',
    defensiveAction_en:
      'Activate Hunter Hood (Retaliate) or Cleric Robe the moment they reach 3 Q charges.',
  },
  {
    opponentUniqueName: 'T8_2H_DUALSWORD',
    opponentBaseId: '2H_DUALSWORD',
    opponentName_vi: 'Dual Swords (Song Kiếm)',
    opponentName_en: 'Dual Swords',
    relation: 'skillMatchup',
    threatLevel: 'HIGH',
    keyEnemySkill_vi: 'Spinning Blades (E) - Nhảy bổ xoáy kiếm miễn nhiễm khống chế',
    keyEnemySkill_en: 'Spinning Blades (E) - Unstoppable AoE leap & max HP damage',
    keyEnemySpellIcon: 'Spin Attack',
    counterTip_vi:
      'Đừng xả sát thương lớn khi đối phương đang bật Parry Strike (W phản đòn 0.8s). Giữ giày chạy để lướt né cú nhảy E (Spinning Blades) nhằm không cho hắn nhận bùa tăng tốc đánh và sát thương theo % máu.',
    counterTip_en:
      'Never burst into Parry Strike (W). Save your boots mobility to dodge the Spinning Blades (E) landing zone.',
    defensiveAction_vi:
      'Mang Fiend Cowl hoặc Mage Robe để xóa sạch 3 cộng dồn Heroic Charge của hắn khiến cú E mất hoàn toàn sát thương.',
    defensiveAction_en:
      'Use Purge (Fiend Cowl / Mage Robe) to strip their 3 Heroic Charges before they press E.',
  },
  {
    opponentUniqueName: 'T8_MAIN_CURSEDSTAFF',
    opponentBaseId: 'MAIN_CURSEDSTAFF',
    opponentName_vi: '1H Cursed Staff (Gậy Nguyền Rủa 1 Tay)',
    opponentName_en: '1H Cursed Staff',
    relation: 'goodAgainst',
    threatLevel: 'HIGH',
    keyEnemySkill_vi: 'Death Curse (E) - Bom nổ tử thần sau 5 giây dựa trên số điểm Vile Curse',
    keyEnemySkill_en: 'Death Curse (E) - Delayed 5s bomb scaling with Vile Curse stacks',
    keyEnemySpellIcon: 'Vile Curse',
    counterTip_vi:
      'Quả bom Death Curse (E) mất đúng 5 giây mới phát nổ. Bạn KHÔNG cần hoảng loạn lúc mới dính E — hãy tiếp tục dồn sát thương, chờ đến giây thứ 4 (khi đầu lâu nhấp nháy đỏ nhanh) mới bấm Bất Tử (Cleric Robe / Dodge Roll) để hóa giải 100% sát thương nổ!',
    counterTip_en:
      'Death Curse (E) explodes after exactly 5 seconds. Keep trading damage and activate i-frame (Cleric Robe / Dodge Roll / Guardian Helmet) on second 4.2 to completely negate the detonation!',
    defensiveAction_vi:
      'Mũ Guardian Helmet (Tạo khiên xóa sát thương đốt) hoặc Cleric Robe/Assassin Jacket canh đúng nhịp nổ giây thứ 4.5.',
    defensiveAction_en:
      'Guardian Helmet (cleanses DoT stacks) or time Cleric Robe i-frame right as the skull icon flashes rapidly.',
  },
  {
    opponentUniqueName: 'T8_2H_CLEAVER_HELL',
    opponentBaseId: '2H_CLEAVER_HELL',
    opponentName_vi: 'Carving Sword ( Đại Đao Địa Ngục)',
    opponentName_en: 'Carving Sword',
    relation: 'skillMatchup',
    threatLevel: 'HIGH',
    keyEnemySkill_vi: 'Fearless Strike (E) - Lướt chém xuyên giảm giáp theo số điểm Heroic',
    keyEnemySkill_en: 'Fearless Strike (E) - Dash slash shredding armor per Heroic stack',
    keyEnemySpellIcon: 'Heroic Strike',
    counterTip_vi:
      'Carving Sword rất mạnh khi vừa lướt E trừ giáp vừa bật Hellion Jacket hút máu. Hãy giữ khoảng cách khi hắn có 3 điểm Q và ngắt nhịp bằng kỹ năng đẩy lùi hoặc Câm Lặng (Noise Eraser).',
    counterTip_en:
      'Carving Sword excels at E armor shred into brawl sustain. Kite out when they hit 3 Heroic stacks and silence or knockback their follow-up.',
    defensiveAction_vi:
      'Đi di chuyển chữ Z để né đường lướt thẳng của Fearless Strike (E) và dùng Mercenary/Cleric Robe khi bị trừ giáp.',
    defensiveAction_en:
      'Sidestep the linear Fearless Strike (E) dash and pop defensive cooldowns if hit by the 3-stack armor shred.',
  },
  {
    opponentUniqueName: 'T8_2H_BOW',
    opponentBaseId: '2H_BOW',
    opponentName_vi: 'Bow (Cung Thường)',
    opponentName_en: 'Regular Bow',
    relation: 'goodAgainst',
    threatLevel: 'MEDIUM',
    keyEnemySkill_vi: 'Enchanted Quiver (E) - Bắn liên hoàn tăng tốc đánh và trừ kháng',
    keyEnemySkill_en: 'Enchanted Quiver (E) - Empowered rapid arrows shredding resistance',
    keyEnemySpellIcon: 'Poisoned Arrow',
    counterTip_vi:
      'Sức mạnh của Cung Thường nằm toàn bộ ở 6 mũi tên Enchanted Quiver (E). Khi thấy hắn nạp tên sáng rực, hãy lùi ra khỏi tầm bắn 13m trong 5s hoặc dùng Purge xóa thẳng bùa E của hắn!',
    counterTip_en:
      '100% of Regular Bow DPS comes from Enchanted Quiver (E). Either Purge their E stacks immediately or reset distance for 5 seconds until their quiver expires.',
    defensiveAction_vi:
      'Dùng Fiend Cowl / Mage Robe xóa Enchanted Quiver (E) biến Bow thành vũ khí không có chiêu cuối.',
    defensiveAction_en:
      'Purge Enchanted Quiver (E) with Fiend Cowl or Mage Robe, or reflect with Hunter Hood.',
  },
  {
    opponentUniqueName: 'T8_MAIN_AXE',
    opponentBaseId: 'MAIN_AXE',
    opponentName_vi: 'Battleaxe (Rìu Chiến 1 Tay)',
    opponentName_en: 'Battleaxe',
    relation: 'goodAgainst',
    threatLevel: 'MEDIUM',
    keyEnemySkill_vi: 'Blood Bandit (E) - Ném rìu 2 lần: Lần 2 hút máu khủng khiếp nếu đủ 3 Bleed',
    keyEnemySkill_en: 'Blood Bandit (E) - Double throw: 2nd cast heals massively on 3x Bleed',
    keyEnemySpellIcon: 'Rending Rage',
    counterTip_vi:
      'Battleaxe chỉ hồi máu khi ném trúng rìu E LẦN THỨ 2 vào mục tiêu đang dính Xuất Huyết. Hãy giữ giày lướt ngang (Sidestep) ngay sau khi hắn ném rìu E lần 1!',
    counterTip_en:
      'Battleaxe only heals on the SECOND E throw against a bleeding target. Save your dash/sprint to sidestep the 2nd axe throw!',
    defensiveAction_vi:
      'Lướt né đường bay của rìu E lần 2 và dùng mũ giảm hồi máu / áo đốt sát thương dồn dập.',
    defensiveAction_en:
      'Dodge the second E skillshot and apply healing reduction or burst them during E cooldown.',
  },
];

export const WEAPON_PLAYBOOKS_DB: Record<string, WeaponTipsSchema> = {
  // ==========================================================================
  // 1. LIGHT CROSSBOW (MAIN_1HCROSSBOW)
  // ==========================================================================
  MAIN_1HCROSSBOW: {
    id: 'playbook-light-crossbow',
    weaponFamily: 'crossbow',
    baseIdentifier: 'MAIN_1HCROSSBOW',
    weaponName_vi: 'Nỏ Nhẹ 1 Tay (Light Crossbow)',
    weaponName_en: 'Light Crossbow',
    playstyleSummary_vi:
      'Vua dồn sát thương tầm trung (Mid-range Burst Caster) nhờ sự kết hợp giữa Bom Nổ (Exploding Shot - E) và nội tại Chuẩn Bị Kỹ Lưỡng (Well-Prepared: cứ mỗi 4 kỹ năng kích hoạt sẽ xóa ngay hồi chiêu Q).',
    playstyleSummary_en:
      'Premier mid-range burst weapon powered by Exploding Shot (E) and the Well-Prepared passive (every 4th spell cast instantly resets Q cooldown).',
    powerSpikes_vi: [
      'Cầm kèm Cryptcandle (Sọ Địa Ngục) hoặc Mistcaller ở tay phụ giúp tối đa hóa sát thương nổ đơn mục tiêu và giảm hồi chiêu.',
      'Mở khóa Caltrops (W3) và Noise Eraser (W4 - Câm lặng 2.5s) giúp thả diều hoàn hảo trước các đấu sĩ cận chiến trong Mists.',
      'Áo Choàng Caerleon (Caerleon Cape) cho phép bắn 2 quả Tên Nổ Q liên tiếp chỉ trong 0.8 giây!',
    ],
    powerSpikes_en: [
      'Pairs with Cryptcandle or Mistcaller off-hand for massive explosion burst and cooldown reduction.',
      'Caltrops (W3) and Noise Eraser (W4 - 2.5s Silence) enable lethal kiting against melee bruisers in Mists.',
      'Caerleon Cape allows double Explosive Bolt (Q) cast within 0.8 seconds!',
    ],
    combos: [
      {
        id: 'lcb-combo-1',
        title_vi: 'Chuỗi Nổ Kép Xóa Hồi Chiêu Q (Well-Prepared Burst)',
        title_en: 'Double Q Reset Burst (Well-Prepared Rotation)',
        modeTag: 'PvE Burst',
        difficulty: 'Medium',
        sequence: ['slotW', 'slotQ', 'slotE', 'slotQ', 'slotArmor', 'slotQ'],
        steps: [
          {
            slot: 'slotW',
            slotLabel: 'W',
            spellIcon: 'Sunder Shot',
            spellName_vi: 'Phát Bắn Xuyên Giáp',
            spellName_en: 'Sunder Shot',
            note_vi: 'Trừ 40% giáp (Đếm nhịp 1/4)',
            note_en: 'Shreds 40% armor (Cast 1/4)',
          },
          {
            slot: 'slotQ',
            slotLabel: 'Q',
            spellIcon: 'Explosive Bolt',
            spellName_vi: 'Tên Nổ (Caerleon x1)',
            spellName_en: 'Explosive Bolt (1)',
            note_vi: 'Đếm nhịp 2/4',
            note_en: 'Cast 2/4',
          },
          {
            slot: 'slotE',
            slotLabel: 'E',
            spellIcon: 'Exploding Shot',
            spellName_vi: 'Bắn Bom Hẹn Giờ',
            spellName_en: 'Exploding Shot',
            note_vi: 'Gắn bom nổ 2 lần (Nhịp 3/4)',
            note_en: 'Plants time-bomb (Cast 3/4)',
          },
          {
            slot: 'slotQ',
            slotLabel: 'Q',
            spellIcon: 'Explosive Bolt',
            spellName_vi: 'Tên Nổ (Kích Nội Tại 4/4)',
            spellName_en: 'Explosive Bolt (4/4 Reset)',
            note_vi: 'Kích hoạt Well-Prepared -> Xóa CD Q!',
            note_en: 'Procs Well-Prepared -> Instant Q reset!',
          },
          {
            slot: 'slotQ',
            slotLabel: 'Q (Free)',
            spellIcon: 'Explosive Bolt',
            spellName_vi: 'Tên Nổ Bồi Thêm',
            spellName_en: 'Reset Explosive Bolt',
            note_vi: 'Nổ cùng lúc với Bom E!',
            note_en: 'Detonates simultaneously with E bomb!',
          },
        ],
        description_vi:
          'Canh nội tại Chuẩn Bị Kỹ Lưỡng ở điểm 2/4 trước khi giao tranh. Khi mở bát bằng W (Xuyên Giáp) -> Q -> E -> Q, nội tại sẽ lập tức xóa hồi chiêu Q để bạn bồi thêm phát Q thứ 3 trùng đúng khoảnh khắc quả bom E phát nổ!',
        description_en:
          'Pre-stack Well-Prepared to 2/4 before engaging. Open with W (Sunder Shot) -> Q -> E -> Q to proc the 4th-cast passive reset and fire a 3rd Explosive Bolt right as Exploding Shot (E) detonates!',
      },
      {
        id: 'lcb-combo-2',
        title_vi: 'Thả Diều Khắc Chế Đấu Sĩ Áp Sát (Kite & Silence)',
        title_en: 'Anti-Dive Kiting & Silence Combo',
        modeTag: '1v1 Mists / Corrupted',
        difficulty: 'Easy',
        sequence: ['slotW', 'slotE', 'slotQ', 'slotShoes', 'slotQ'],
        steps: [
          {
            slot: 'slotW',
            slotLabel: 'W',
            spellIcon: 'Noise Eraser',
            spellName_vi: 'Câm Lặng / Bẫy Chông',
            spellName_en: 'Noise Eraser / Caltrops',
            note_vi: 'Khóa kỹ năng 2.5s hoặc Làm chậm 50%',
            note_en: 'Silences 2.5s or Slows 50%',
          },
          {
            slot: 'slotE',
            slotLabel: 'E',
            spellIcon: 'Exploding Shot',
            spellName_vi: 'Bắn Bom Hẹn Giờ',
            spellName_en: 'Exploding Shot',
            note_vi: 'Gắn bom tức thì không cần đứng niệm',
            note_en: 'Instant cast time-bomb',
          },
          {
            slot: 'slotQ',
            slotLabel: 'Q',
            spellIcon: 'Auto Fire',
            spellName_vi: 'Liên Xạ Di Động',
            spellName_en: 'Auto Fire',
            note_vi: 'Vừa lùi vừa xả 5 loạt tên',
            note_en: 'Channel 5 bolts while moving away',
          },
          {
            slot: 'slotShoes',
            slotLabel: 'F (Giày)',
            spellIcon: 'Refreshing Sprint',
            spellName_vi: 'Chạy Hồi Chiêu',
            spellName_en: 'Refreshing Sprint',
            note_vi: 'Giãn khoảng cách & giảm hồi chiêu E',
            note_en: 'Re-open gap & reduce E cooldown',
          },
        ],
        description_vi:
          'Khi bị đối phương dùng giày lao vào, lập tức bắn Câm Lặng (Noise Eraser) hoặc Rải Chông (Caltrops) rồi gắn Bom E và vừa đi lùi vừa xả Liên Xạ (Auto Fire).',
        description_en:
          'When a melee opponent sprints in, immediately land Noise Eraser (Silence) or Caltrops, plant Exploding Shot (E), and kite backward while channeling Auto Fire (Q2).',
      },
    ],
    matchups: {
      goodAgainst: [
        GLOBAL_OPPONENT_COUNTER_DB[3], // 1H Cursed Staff
        GLOBAL_OPPONENT_COUNTER_DB[5], // Regular Bow
        GLOBAL_OPPONENT_COUNTER_DB[6], // Battleaxe
      ],
      weakAgainst: [
        GLOBAL_OPPONENT_COUNTER_DB[0], // Bloodletter
        GLOBAL_OPPONENT_COUNTER_DB[1], // Deathgivers
        GLOBAL_OPPONENT_COUNTER_DB[2], // Dual Swords
      ],
      allMatchups: GLOBAL_OPPONENT_COUNTER_DB,
    },
    communityTips: [
      {
        id: 'tip-lcb-1',
        weaponIdentifier: 'MAIN_1HCROSSBOW',
        author: 'BaronMark_VN',
        authorBadge_vi: 'Top 50 Mists Asia',
        authorBadge_en: 'Top 50 Mists Asia',
        content_vi:
          'Mẹo sống còn khi đi Mists: Quả bom Exploding Shot (E) có 2 lần gây sát thương (lúc bắn trúng và lúc phát nổ sau 2s). Nếu thấy đối phương mặc Cleric Robe, hãy bắn E để ép hắn bật khiên bất tử ở nhịp đầu, sau đó giữ Q chờ hết bất tử mới xả combo!',
        content_en:
          'Pro Mists tip: Exploding Shot (E) deals damage twice (on impact and detonation 2s later). Against Cleric Robe users, use E impact to proc their shield, then hold your double-Q reset until their 3s invulnerability expires!',
        upvotes: 142,
        downvotes: 4,
        patchVersion: 'v1.26 (Horizon)',
        isOutdated: false,
        createdAt: '2 ngày trước',
      },
      {
        id: 'tip-lcb-2',
        weaponIdentifier: 'MAIN_1HCROSSBOW',
        author: 'CaerleonSniper',
        authorBadge_vi: 'Chuyên gia HCE 18',
        authorBadge_en: 'HCE Lv.18 Veteran',
        content_vi:
          'Khi đi HCE hoặc Avalonian Dungeon, luôn bấm W (Sunder Shot) hoặc Q vào không khí khi đang chạy giữa các bãi quái để giữ thanh nội tại Well-Prepared ở mức 3/4. Ngay khi Tank gom quái xong, phát bắn đầu tiên của bạn sẽ kích hoạt nổ kép tức thì!',
        content_en:
          'In HCE or Avalonian raids, pre-stack Well-Prepared to 3/4 between pulls so your very first Explosive Bolt on the clumped mob pack triggers an instant reset!',
        upvotes: 98,
        downvotes: 2,
        patchVersion: 'v1.26 (Horizon)',
        isOutdated: false,
        createdAt: '5 ngày trước',
      },
      {
        id: 'tip-lcb-3',
        weaponIdentifier: 'MAIN_1HCROSSBOW',
        author: 'OldMetaHunter',
        authorBadge_vi: 'Cựu Binh Corrupted',
        authorBadge_en: 'Corrupted Veteran',
        content_vi:
          '[Meta Cũ] Dùng mũ Druid Cowl đứng yên hồi năng lượng kết hợp Q1 bắn liên tục không cần giày chạy.',
        content_en:
          '[Old Meta] Stand still inside Druid Cowl circle spamming Q1 without mobility boots.',
        upvotes: 19,
        downvotes: 31,
        patchVersion: 'v1.18 (Lands Awakened - Cũ)',
        isOutdated: true,
        createdAt: '1 năm trước',
      },
    ],
  },

  // ==========================================================================
  // 2. CRYSTAL REAPER (2H_SCYTHE_CRYSTAL)
  // ==========================================================================
  '2H_SCYTHE_CRYSTAL': {
    id: 'playbook-crystal-reaper',
    weaponFamily: 'axe',
    baseIdentifier: '2H_SCYTHE_CRYSTAL',
    weaponName_vi: 'Lưỡi Hái Pha Lê (Crystal Reaper)',
    weaponName_en: 'Crystal Reaper',
    playstyleSummary_vi:
      'Vũ khí Pha Lê đỉnh cao thuộc nhánh Rìu (Axe): Cơ động cực hạn với chiêu cuối Vòng Cung Tử Thần (Reaping Arc - E) lướt cắt xuyên đội hình và giảm một nửa hồi chiêu khi quét trúng mục tiêu đang dính 3 cộng dồn Xuất Huyết!',
    playstyleSummary_en:
      'Apex Crystal Scythe in the Axe tree: Hyper-mobile bruiser whose Reaping Arc (E) crescent dash cuts through enemy lines and refunds 50% cooldown when hitting a target with 3 Bleed stacks!',
    powerSpikes_vi: [
      'Khi mục tiêu có đủ 3 cộng dồn Xuất Huyết (từ Rending Strike Q1 hoặc Rending Spin Q2), chiêu E (Reaping Arc) được giảm ngay 50% thời gian hồi chiêu (từ 20s xuống còn ~8-9s)!',
      'Kết hợp hoàn hảo với Áo Hellion Jacket + Mũ Stalker Hood tạo thành cỗ máy hút máu và kết liễu không thể ngăn cản trong Small-Scale / Brawl.',
      'Mở khóa Raging Blades (W5 ở Tier VI+) giúp tăng mạnh sát thương diện rộng và kháng khống chế giữa vòng vây.',
    ],
    powerSpikes_en: [
      'Hitting a target with 3 Bleed stacks refunds 50% of Reaping Arc (E) cooldown, letting you dash again every ~8 seconds!',
      'Synergizes with Hellion Jacket + Stalker Hood for unstoppable AoE lifesteal and armor shred in Small-Scale brawls.',
      'Unlocking Raging Blades (W5 at Tier VI+) grants massive AoE pressure and CC resistance.',
    ],
    combos: [
      {
        id: 'cr-combo-1',
        title_vi: 'Combo Tích 3 Xuất Huyết -> Lướt Hái Pha Lê Hồi Chiêu 50%',
        title_en: '3x Bleed Stack -> 50% Cooldown Refund Reaping Arc',
        modeTag: 'Small-Scale Brawl',
        difficulty: 'Medium',
        sequence: ['slotW', 'slotQ', 'slotQ', 'slotQ', 'slotHead', 'slotE'],
        steps: [
          {
            slot: 'slotW',
            slotLabel: 'W',
            spellIcon: 'Adrenaline Boost',
            spellName_vi: 'Tăng Tốc Sinh Lực',
            spellName_en: 'Adrenaline Boost',
            note_vi: '+50% tốc chạy & +25% sát thương',
            note_en: '+50% Move Speed & +25% Damage',
          },
          {
            slot: 'slotQ',
            slotLabel: 'Q (x3)',
            spellIcon: 'Spin Attack',
            spellName_vi: 'Xoay Rìu 3 Lần (3 Bleed)',
            spellName_en: '3x Rending Spin (3 Bleeds)',
            note_vi: 'Tích đủ 3 điểm Xuất Huyết lên kẻ địch',
            note_en: 'Applies maximum 3 Bleed charges',
          },
          {
            slot: 'slotHead',
            slotLabel: 'D (Mũ)',
            spellIcon: 'Mortal Agony',
            spellName_vi: 'Mũ Stalker Hood',
            spellName_en: 'Stalker Hood',
            note_vi: 'Tăng 20% sát thương & Xuyên giáp',
            note_en: '+20% Damage & Armor Pierce',
          },
          {
            slot: 'slotE',
            slotLabel: 'E (Reset 50%)',
            spellIcon: 'ITEM:T8_2H_SCYTHE_CRYSTAL',
            spellName_vi: 'Vòng Cung Tử Thần',
            spellName_en: 'Reaping Arc (E)',
            note_vi: 'Cắt xuyên + Giảm 50% hồi chiêu E!',
            note_en: 'Crescent dash + 50% CD refund!',
          },
        ],
        description_vi:
          'Không bao giờ bấm E ngay khi mới vào giao tranh! Hãy bật W (Adrenaline Boost) áp sát và chém Q đủ 3 lần để tích 3 điểm Xuất Huyết (Bleed), sau đó bật Stalker Hood rồi mới lướt E (Reaping Arc) để vừa tối đa sát thương kết liễu vừa được hồi ngay 50% thời gian chờ chiêu E!',
        description_en:
          'Never raw-cast E at the start! Pop W (Adrenaline Boost), land 3 Qs to reach 3 Bleed stacks, activate Stalker Hood, then slash through with Reaping Arc (E) for maximum burst and an instant 50% E cooldown refund!',
      },
      {
        id: 'cr-combo-2',
        title_vi: 'Càn Quét Hút Máu Giữa Đội Hình Địch (Hellion Brawl Sustain)',
        title_en: 'Hellion Lifesteal Brawl Turnaround',
        modeTag: 'ZvZ Engage',
        difficulty: 'Hard',
        sequence: ['slotArmor', 'slotW', 'slotQ', 'slotE', 'slotShoes'],
        steps: [
          {
            slot: 'slotArmor',
            slotLabel: 'R (Áo)',
            spellIcon: 'Life Steal Aura',
            spellName_vi: 'Áo Hellion Jacket',
            spellName_en: 'Hellion Jacket Aura',
            note_vi: 'Bật vòng hút máu diện rộng khi máu < 60%',
            note_en: 'Pop AoE lifesteal aura below 60% HP',
          },
          {
            slot: 'slotW',
            slotLabel: 'W (T6+)',
            spellIcon: 'Raging Blades',
            spellName_vi: 'Bão Lưỡi Rìu Cuồng Nộ',
            spellName_en: 'Raging Blades',
            note_vi: 'Xoay lốc AoE + Tăng kháng khống chế',
            note_en: 'AoE blade storm + CC resistance',
          },
          {
            slot: 'slotQ',
            slotLabel: 'Q',
            spellIcon: 'Rending Rage',
            spellName_vi: 'Cuồng Nộ Xé Rách (Choáng)',
            spellName_en: 'Rending Rage (3rd Hit Stun)',
            note_vi: 'Làm choáng mục tiêu và đạt 3 Bleed',
            note_en: 'Stuns target & caps 3 Bleeds',
          },
          {
            slot: 'slotE',
            slotLabel: 'E',
            spellIcon: 'ITEM:T8_2H_SCYTHE_CRYSTAL',
            spellName_vi: 'Vòng Cung Tử Thần',
            spellName_en: 'Reaping Arc',
            note_vi: 'Lướt xuyên qua nhiều mục tiêu nhất có thể',
            note_en: 'Slice through multiple targets',
          },
        ],
        description_vi:
          'Khi bị nhiều kẻ địch vây đánh xuống dưới 60% máu, bật Hellion Jacket kết hợp Raging Blades (W5) để vừa gây sát thương diện rộng vừa hồi đầy cây máu, sau đó lướt E cắt ngang qua cả cụm địch.',
        description_en:
          'When focused below 60% HP by multiple enemies, activate Hellion Jacket + Raging Blades (W5) to heal back to full while stacking Bleeds, then slash through the entire clump with Reaping Arc (E).',
      },
    ],
    matchups: {
      goodAgainst: [
        GLOBAL_OPPONENT_COUNTER_DB[2], // Dual Swords
        GLOBAL_OPPONENT_COUNTER_DB[4], // Carving Sword
        GLOBAL_OPPONENT_COUNTER_DB[6], // Battleaxe
      ],
      weakAgainst: [
        GLOBAL_OPPONENT_COUNTER_DB[0], // Bloodletter
        GLOBAL_OPPONENT_COUNTER_DB[3], // 1H Cursed Staff
        GLOBAL_OPPONENT_COUNTER_DB[5], // Regular Bow
      ],
      allMatchups: GLOBAL_OPPONENT_COUNTER_DB,
    },
    communityTips: [
      {
        id: 'tip-cr-1',
        weaponIdentifier: '2H_SCYTHE_CRYSTAL',
        author: 'AvalonReaper_VN',
        authorBadge_vi: 'Chỉ Huy ZvZ Crystal Rank',
        authorBadge_en: 'Crystal Rank ZvZ Shotcaller',
        content_vi:
          'Chỉ cần 1 mục tiêu bất kỳ trên đường lướt của Reaping Arc (E) đang có đủ 3 điểm Xuất Huyết là bạn đã được giảm 50% hồi chiêu E. Trong giao tranh đông người, hãy dùng Q2 (Rending Spin) quẹt trúng Tank tiền tuyến của địch đủ 3 lần rồi lướt E xuyên thẳng từ Tank vào dàn Healer/DPS phía sau!',
        content_en:
          'Only ONE enemy along your Reaping Arc (E) path needs 3 Bleed stacks to trigger the 50% cooldown refund. Stack 3x Q2 on the enemy frontline Tank, then aim E through the Tank straight onto their backline Healer/DPS!',
        upvotes: 215,
        downvotes: 6,
        patchVersion: 'v1.26 (Horizon)',
        isOutdated: false,
        createdAt: '1 ngày trước',
      },
      {
        id: 'tip-cr-2',
        weaponIdentifier: '2H_SCYTHE_CRYSTAL',
        author: 'MistsSlayer99',
        authorBadge_vi: 'Top 100 Solo Mists',
        authorBadge_en: 'Top 100 Solo Mists',
        content_vi:
          'Khi đối đầu với các hệ Cung / Nỏ thả diều căng, hãy chuyển W sang Battle Rush (W4 - Xung Trận Chiến Ý) để có thêm 1 cú lướt 12m làm chậm kèm giảm 40% hồi máu của địch.',
        content_en:
          'Against heavy kiting Bows or Crossbows, swap W to Battle Rush (W4) for an extra 12m gap-closer that slows and applies -40% healing reduction.',
        upvotes: 84,
        downvotes: 3,
        patchVersion: 'v1.26 (Horizon)',
        isOutdated: false,
        createdAt: '4 ngày trước',
      },
      {
        id: 'tip-cr-3',
        weaponIdentifier: '2H_SCYTHE_CRYSTAL',
        author: 'LegacyAxeUser',
        authorBadge_vi: 'Người chơi mùa cũ',
        authorBadge_en: 'Legacy Player',
        content_vi:
          '[Meta Cũ] E của Lưỡi Hái giảm hồi chiêu ngay cả khi chỉ có 1 điểm Bleed trên mục tiêu.',
        content_en:
          '[Old Meta] Reaping Arc refunded cooldown even with only 1 Bleed stack on the target.',
        upvotes: 12,
        downvotes: 28,
        patchVersion: 'v1.22 (Beyond the Veil - Cũ)',
        isOutdated: true,
        createdAt: '9 tháng trước',
      },
    ],
  },
};

/**
 * Helper that returns the Playbook for any AlbionItem:
 * - Returns exact Playbook for Light Crossbow or Crystal Reaper
 * - Or dynamically synthesizes an accurate Playbook from the item's actual Q/W/E spells
 *   and connects it to the global opponent matchup DB!
 */
export function getWeaponPlaybookForItem(
  baseIdentifier: string,
  name_vi: string,
  name_en: string,
  qIcon: string = 'Heroic Strike',
  wIcon: string = 'Adrenaline Boost',
  eIcon: string = 'Spin Attack'
): WeaponTipsSchema {
  const cleanBase = baseIdentifier.replace(/^T[1-8]_/, '').replace(/@[1-4]$/, '');
  if (WEAPON_PLAYBOOKS_DB[cleanBase]) {
    return WEAPON_PLAYBOOKS_DB[cleanBase];
  }
  if (cleanBase.includes('CROSSBOW')) {
    return {
      ...WEAPON_PLAYBOOKS_DB.MAIN_1HCROSSBOW,
      baseIdentifier: cleanBase,
      weaponName_vi: name_vi,
      weaponName_en: name_en,
    };
  }
  if (cleanBase.includes('AXE') || cleanBase.includes('HALBERD') || cleanBase.includes('SCYTHE')) {
    return {
      ...WEAPON_PLAYBOOKS_DB['2H_SCYTHE_CRYSTAL'],
      baseIdentifier: cleanBase,
      weaponName_vi: name_vi,
      weaponName_en: name_en,
    };
  }

  return {
    id: `playbook-${cleanBase.toLowerCase()}`,
    weaponFamily: cleanBase.toLowerCase(),
    baseIdentifier: cleanBase,
    weaponName_vi: name_vi,
    weaponName_en: name_en,
    playstyleSummary_vi: `Cẩm nang vận hành chiến thuật cho ${name_vi}: Tối ưu hóa chuỗi kết hợp Q -> W -> E để gây đột biến sát thương và giữ vị trí an toàn trước các vũ khí Sát Thủ trong Mists / Open-World.`,
    playstyleSummary_en: `Tactical playbook for ${name_en}: Optimize your Q -> W -> E spell rotation for peak burst windows while maintaining defensive cooldowns against high-mobility assassins.`,
    powerSpikes_vi: [
      'Đạt ngưỡng Tier VI (T6) mở khóa toàn bộ các kỹ năng W bậc cao của nhánh.',
      'Kết hợp áo phòng ngự (Cleric Robe / Hellion Jacket / Assassin Jacket) đúng theo chế độ chơi PvE hay PvP.',
      'Canh nhịp hồi chiêu E đồng bộ với hiệu ứng xuyên giáp hoặc tăng sát thương từ Mũ/Áo.',
    ],
    powerSpikes_en: [
      'Reaching Tier VI (T6) unlocks all high-tier W spell options for the weapon family.',
      'Pair with defensive chest armor (Cleric Robe / Hellion Jacket / Assassin Jacket) tailored to PvE or PvP.',
      'Synchronize your E cooldown with armor shred or damage buffs from Head/Chest slots.',
    ],
    combos: [
      {
        id: `${cleanBase}-combo-standard`,
        title_vi: `Chuỗi Dồn Sát Thương Tiêu Chuẩn (${name_vi})`,
        title_en: `Standard Burst Rotation (${name_en})`,
        modeTag: '1v1 Mists / Corrupted',
        difficulty: 'Medium',
        sequence: ['slotQ', 'slotW', 'slotE', 'slotQ'],
        steps: [
          {
            slot: 'slotQ',
            slotLabel: 'Q',
            spellIcon: qIcon,
            spellName_vi: 'Kỹ Năng Q (Mở nhịp)',
            spellName_en: 'Q Ability (Poke & Stack)',
            note_vi: 'Tích cộng dồn mở đầu',
            note_en: 'Build initial stacks',
          },
          {
            slot: 'slotW',
            slotLabel: 'W',
            spellIcon: wIcon,
            spellName_vi: 'Kỹ Năng W (Khống chế / Buff)',
            spellName_en: 'W Ability (CC / Buff)',
            note_vi: 'Khóa mục tiêu hoặc cường hóa',
            note_en: 'Lock target or empower self',
          },
          {
            slot: 'slotE',
            slotLabel: 'E',
            spellIcon: eIcon,
            spellName_vi: 'Tuyệt Kỹ E (Kết liễu)',
            spellName_en: 'E Signature Ultimate',
            note_vi: 'Gây sát thương đột biến tối đa',
            note_en: 'Deliver peak signature burst',
          },
          {
            slot: 'slotQ',
            slotLabel: 'Q',
            spellIcon: qIcon,
            spellName_vi: 'Kỹ Năng Q (Bồi sát thương)',
            spellName_en: 'Q Follow-up',
            note_vi: 'Hoàn tất chuỗi trao đổi chiêu thức',
            note_en: 'Complete the trade window',
          },
        ],
        description_vi:
          'Sử dụng Q để cấu rỉa và tích cộng dồn, kích hoạt W để khống chế hoặc giảm giáp mục tiêu trước khi tung Tuyệt kỹ E nhằm tối ưu hóa toàn bộ lượng sát thương đầu ra.',
        description_en:
          'Poke and stack with Q, lock down or shred armor with W, then unleash your signature E ability during the buff window.',
      },
    ],
    matchups: {
      goodAgainst: [
        GLOBAL_OPPONENT_COUNTER_DB[3],
        GLOBAL_OPPONENT_COUNTER_DB[5],
      ],
      weakAgainst: [
        GLOBAL_OPPONENT_COUNTER_DB[0],
        GLOBAL_OPPONENT_COUNTER_DB[1],
      ],
      allMatchups: GLOBAL_OPPONENT_COUNTER_DB,
    },
    communityTips: WEAPON_PLAYBOOKS_DB.MAIN_1HCROSSBOW.communityTips,
  };
}

// ============================================================================
// 4. MOCK DATA: PVE GUIDES (AVALONIAN DUNGEON, GROUP DUNGEON, HCE, CORRUPTED)
// ============================================================================

export const PVE_GUIDES_DB: Record<PvEActivityType, PvEGuideSchema> = {
  Avalonian: {
    id: 'guide-avalonian-raid',
    activityType: 'Avalonian',
    title_vi: 'Cẩm Nang Chinh Phục Hầm Ngục Avalonian (Avalonian Raid 20 Người)',
    title_en: 'Avalonian Raid Dungeon Complete Mastery Guide (20-Player)',
    subtitle_vi:
      'Hoạt động PvE Endgame danh giá nhất Albion Online: Buff +10% Fame toàn tuần, Rương Vàng T8.3 và Chế tạo Vũ Khí Avalonian.',
    subtitle_en:
      'Albion Online’s premier Endgame PvE raid: Weekly +10% Fame Buff, Golden Chests, and Avalonian Artifact crafting.',
    recommendedPartySize: '18 – 20 Players (2 Tanks, 3 Healers, 3 Supports, 12 DPS)',
    fameMultiplierLabel: '+350% Fame + 10% Weekly Avalonian Buff',
    silverPerHourLabel: '3,500,000 – 8,000,000 Silver / Raid',
    overview_vi:
      'Hầm Ngục Avalonian (T6 đến T8.3) đòi hỏi kỷ luật tuyệt đối theo lệnh Raid Leader (Shotcaller). Chỉ một thành viên đứng sai vị trí hoặc không ngắt chiêu (Interrupt) đúng lúc có thể dẫn đến Wipe (chết toàn bộ 20 người). Cẩm nang dưới đây tổng hợp đầy đủ yêu cầu IP, bộ trang bị chuẩn Meta cho từng Role và cách xử lý từng chiêu thức Boss nguy hiểm nhất.',
    overview_en:
      'Avalonian Dungeons (T6 to T8.3) demand strict coordination under a Raid Caller. A single missed interrupt or mispositioned player can trigger a full 20-man raid wipe. Below are the exact IP thresholds, meta role loadouts, and boss mechanic countermeasures.',
    checklist_vi: [
      'Luôn mang theo Áo Knight Armor / Đồ Swap biến hình tại cổng vào để Skip quái khi cần.',
      'Mang ít nhất 10 Bình Năng Lượng T6.1 (Energy Potion) + 4 Thức ăn Omelette T7.1 / Beef Stew T8.1.',
      'Tắt toàn bộ hiệu ứng tự động đánh (Auto-attack) khi Raid Leader hô "STOP DPS" trước khiên phản đòn của quái.',
      'Đội hình DPS bắt buộc đứng chụm đúng vào thảm xanh (Sacred Ground) của Healer để nhận kháng và hồi máu.',
    ],
    checklist_en: [
      'Always carry a skip set (Knight Armor / Assassin Jacket / Specter Shoes) in your inventory.',
      'Bring at least 10x T6.1 Energy Potions and 4x T7.1 Pork Omelettes or T8.1 Beef Stews.',
      'Immediately stop all damage when the Caller shouts "STOP DPS" on reflecting mobs.',
      'DPS must stack tightly inside the Healer’s Sacred Ground carpet for resistance and AoE healing.',
    ],
    ipRequirements: [
      {
        tierLabel: 'Map T6.0 – T6.2 (Cơ Bản / Tập Huấn)',
        tankIp: '1,350+ IP',
        healerIp: '1,300+ IP',
        dpsIp: '1,300+ IP',
        note_vi: 'Phù hợp người mới làm quen cơ chế gom quái và ngắt chiêu.',
        note_en: 'Ideal for learning pull setups and interrupt rotations.',
      },
      {
        tierLabel: 'Map T7.0 – T8.0 (Tiêu Chuẩn Fame/Silver)',
        tankIp: '1,500+ IP (Búa T8.2+)',
        healerIp: '1,450+ IP',
        dpsIp: '1,450+ IP (Vũ khí T8.2+)',
        note_vi: 'Tốc độ dọn phòng nhanh, yêu cầu DPS có Royal Jacket/Druid Robe chuẩn.',
        note_en: 'Fast clear speed; requires proper Royal Jacket & Druid Robe rotations.',
      },
      {
        tierLabel: 'Map T8.1 – T8.3 (High-End / Golden Chest)',
        tankIp: '1,650+ IP (T8.3 MP)',
        healerIp: '1,550+ IP',
        dpsIp: '1,600+ IP (T8.3 + Cryptcandle)',
        note_vi: 'Quái sát thương cực đại, bắt buộc Arcane Support bấm khiên chuẩn 100%.',
        note_en: 'Lethal mob scaling; requires pixel-perfect Arcane shields and caller discipline.',
      },
    ],
    roles: [
      {
        role: 'Tank',
        roleTitle_vi: 'Main Tank & Off-Tank (Gom Quái & Khống Chế)',
        roleTitle_en: 'Main Tank & Off-Tank (Clump & CC Lockdown)',
        minIp: 1450,
        optimalIp: 1650,
        suggestedBuild: '/build/crystal-reaper-brawl',
        dutySummary_vi:
          'Main Tank sử dụng Incubus Mace (Chùy Ác Mộng) thu nhỏ kích thước và giảm máu tối đa của quái kết hợp Guardian Armor giảm sát thương. Off-Tank dùng Great Arcane (Ngưng Đọng Thời Gian - Time Freeze) để khóa cứng quái cho DPS xả sát thương.',
        dutySummary_en:
          'Main Tank runs Incubus Mace to shrink mob hitboxes and max HP alongside Guardian Armor. Off-Tank runs Great Arcane (Time Freeze) to freeze the clump during DPS burst windows.',
        rotationTip_vi:
          'Bật Giày Chạy gom toàn bộ quái vào góc tường -> Bấm W (Air Compressor) hút chụm -> Đập E (Shrinking Curse) -> Bật Guardian Armor + Enfeeble Blades làm giảm sát thương quái.',
        rotationTip_en:
          'Sprint to corner -> W (Air Compressor) clump -> E (Shrinking Curse) -> Activate Guardian Armor aura during mob animations.',
        equipment: [
          {
            slot: 'MainHand',
            uniqueName: 'T8_MAIN_MACE_HELL',
            name_vi: 'Chùy Ác Mộng (Incubus Mace)',
            name_en: 'Incubus Mace',
            tier: 8,
            enchantment: 2,
            quality: 4,
            keySpell_vi: 'Shrinking Curse (E) - Giảm máu quái',
            keySpell_en: 'Shrinking Curse (E)',
          },
          {
            slot: 'OffHand',
            uniqueName: 'T8_OFF_SHIELD_AVALON',
            name_vi: 'Khiên Ánh Sáng (Astral Aegis)',
            name_en: 'Astral Aegis',
            tier: 8,
            enchantment: 2,
            quality: 4,
            keySpell_vi: 'Tăng giáp & Kháng khống chế',
            keySpell_en: 'Bonus Defense & CC Resist',
          },
          {
            slot: 'Head',
            uniqueName: 'T8_HEAD_PLATE_SET2',
            name_vi: 'Mũ Hiệp Sĩ (Knight Helmet)',
            name_en: 'Knight Helmet',
            tier: 8,
            enchantment: 2,
            quality: 4,
            keySpell_vi: 'Displacement Immunity (Chống đẩy lùi)',
            keySpell_en: 'Displacement Immunity',
          },
          {
            slot: 'Armor',
            uniqueName: 'T8_ARMOR_PLATE_SET3',
            name_vi: 'Giáp Hộ Vệ (Guardian Armor)',
            name_en: 'Guardian Armor',
            tier: 8,
            enchantment: 2,
            quality: 4,
            keySpell_vi: 'Enfeeble Aura (Giảm 60% sát thương quái)',
            keySpell_en: 'Enfeeble Aura (-60% Mob Damage)',
          },
        ],
      },
      {
        role: 'Healer',
        roleTitle_vi: 'Main Healer & Party Healer (Holy & Nature)',
        roleTitle_en: 'Main Healer & Party Healer (Holy & Nature)',
        minIp: 1400,
        optimalIp: 1550,
        suggestedBuild: '/build/druidic-avalon',
        dutySummary_vi:
          'Main Healer cầm Gậy Thánh 1 Tay (1H Holy / Hallowfall) tập trung giữ mạng tuyệt đối cho Main Tank. Party Healer cầm Gậy Tự Nhiên (Druidic Staff / Blight Staff) kết hợp Áo Hoàng Gia (Royal Jacket) vừa duy trì máu toàn đội vừa giảm hồi chiêu.',
        dutySummary_en:
          'Main Healer uses 1H Holy / Hallowfall dedicated to keeping Main Tank alive. Party Healer uses Druidic Staff with Royal Jacket to sustain the DPS stack and provide cooldown reduction.',
        rotationTip_vi:
          'Trải thảm W (Sacred Ground) cố định dưới chân Tank, nhấp Q1 liên tục và giữ sẵn E (Desperate Prayer) khi máu Tank tụt dưới 50%.',
        rotationTip_en:
          'Place Sacred Ground (W) under the Tank, spam Q1, and hold E (Desperate Prayer) for sub-50% HP spikes.',
        equipment: [
          {
            slot: 'MainHand',
            uniqueName: 'T8_MAIN_NATURESTAFF_KEEPER',
            name_vi: 'Gậy Tự Nhiên Druidic (Druidic Staff)',
            name_en: 'Druidic Staff',
            tier: 8,
            enchantment: 2,
            quality: 4,
            keySpell_vi: 'Spiritual Seed (E) - Hạt giống hồi máu bùng nổ',
            keySpell_en: 'Spiritual Seed (E)',
          },
          {
            slot: 'OffHand',
            uniqueName: 'T8_OFF_HORN_KEEPER',
            name_vi: 'Tù Và Sương Mù (Mistcaller)',
            name_en: 'Mistcaller',
            tier: 8,
            enchantment: 2,
            quality: 4,
            keySpell_vi: 'Giảm 13% thời gian hồi chiêu',
            keySpell_en: '-13% Cooldown Reduction',
          },
          {
            slot: 'Head',
            uniqueName: 'T8_HEAD_LEATHER_ROYAL',
            name_vi: 'Mũ Da Hoàng Gia (Royal Hood)',
            name_en: 'Royal Hood',
            tier: 8,
            enchantment: 2,
            quality: 4,
            keySpell_vi: 'Tăng sát thương cho cả đội',
            keySpell_en: 'Party Damage Boost',
          },
          {
            slot: 'Armor',
            uniqueName: 'T8_ARMOR_LEATHER_ROYAL',
            name_vi: 'Áo Da Hoàng Gia (Royal Jacket)',
            name_en: 'Royal Jacket',
            tier: 8,
            enchantment: 2,
            quality: 4,
            keySpell_vi: 'Banner (Giảm 40% hồi chiêu cho đồng minh)',
            keySpell_en: 'Royal Banner (-40% Cooldown Aura)',
          },
        ],
      },
      {
        role: 'DPS',
        roleTitle_vi: 'Core DPS (Light Crossbow / Shadowcaller / Frost)',
        roleTitle_en: 'Core Burst DPS (Light Crossbow / Shadowcaller)',
        minIp: 1450,
        optimalIp: 1650,
        suggestedBuild: '/build/light-crossbow-pve',
        dutySummary_vi:
          'Vũ khí DPS chủ lực số 1 trong Avalonian & HCE là Light Crossbow cầm kèm Cryptcandle và mặc Druid Robe (+48% sát thương kỹ năng). Nhiệm vụ là chờ đúng khẩu lệnh "DPS IN 3-2-1" sau khi Tank đã gom quái và Shadowcaller đã thả vùng trừ giáp.',
        dutySummary_en:
          'Light Crossbow + Cryptcandle + Druid Robe is the #1 burst DPS setup in Avalonian raids. Wait for the Tank clump and Shadowcaller armor shred before unleashing your double-Q + E explosion.',
        rotationTip_vi:
          'Bật R (Druid Robe) -> Bấm W (Sunder Shot) + Q + E + Q (tích đủ 6 cộng dồn áo vải + kích hoạt nội tại xóa hồi chiêu Q) -> Xả tiếp Q bồi liên hoàn!',
        rotationTip_en:
          'Activate Druid Robe (R) -> W + Q + E + Q (reaches 6x obsessive burst stacks & resets Q) -> Unload reset Q!',
        equipment: [
          {
            slot: 'MainHand',
            uniqueName: 'T8_MAIN_1HCROSSBOW',
            name_vi: 'Nỏ Nhẹ 1 Tay (Light Crossbow)',
            name_en: 'Light Crossbow',
            tier: 8,
            enchantment: 3,
            quality: 4,
            keySpell_vi: 'Exploding Shot (E) + Explosive Bolt (Q)',
            keySpell_en: 'Exploding Shot (E) + Explosive Bolt (Q)',
          },
          {
            slot: 'OffHand',
            uniqueName: 'T8_OFF_DEMONSKULL_HELL',
            name_vi: 'Sọ Địa Ngục (Cryptcandle)',
            name_en: 'Cryptcandle',
            tier: 8,
            enchantment: 3,
            quality: 4,
            keySpell_vi: '+25% Sát thương kỹ năng toàn diện',
            keySpell_en: '+25% Ability Damage Bonus',
          },
          {
            slot: 'Head',
            uniqueName: 'T8_HEAD_CLOTH_ROYAL',
            name_vi: 'Mũ Vải Hoàng Gia (Royal Cowl)',
            name_en: 'Royal Cowl',
            tier: 8,
            enchantment: 2,
            quality: 4,
            keySpell_vi: 'Perpetual Energy (Không tốn năng lượng 15s)',
            keySpell_en: 'Perpetual Energy (0 Energy Cost for 15s)',
          },
          {
            slot: 'Armor',
            uniqueName: 'T8_ARMOR_CLOTH_KEEPER',
            name_vi: 'Áo Vải Tu Sĩ (Druid Robe)',
            name_en: 'Druid Robe',
            tier: 8,
            enchantment: 2,
            quality: 4,
            keySpell_vi: 'Obsessive Burst (Tăng tới +48% sát thương)',
            keySpell_en: 'Obsessive Burst (Up to +48% Damage)',
          },
        ],
      },
    ],
    bosses: [
      {
        id: 'boss-ava-archmage',
        bossName_vi: 'Đại Pháp Sư Avalonian (Avalonian Archmage)',
        bossName_en: 'Avalonian Archmage',
        tierLabel: 'Mid-Boss • Cánh Phép Thuật',
        archetype_vi: 'Pháp Sư Tia Năng Lượng & Vòng Xoáy Thiên Thạch',
        archetype_en: 'Arcane Beam & Meteor Vortex Caster',
        difficulty: 'Hard',
        summary_vi:
          'Boss kiểm tra khả năng di chuyển đồng đội và phản xạ bật khiên chống đẩy lùi. Tuyệt đối không đứng trước mặt Boss cùng hướng với Main Tank.',
        summary_en:
          'Tests raid movement synchronization and displacement immunity timing. Never stand in front of the Boss alongside the Main Tank.',
        mechanics: [
          {
            id: 'mech-archmage-1',
            skillName_vi: 'Bão Thiên Thạch Hủy Diệt (Purging Meteor Storm)',
            skillName_en: 'Purging Meteor Storm',
            spellIcon: 'Fire Artillery',
            isWipeMechanic: true,
            telegraph_vi:
              'CẢNH BÁO WIPE: Boss bay lên trung tâm phòng, mặt đất xuất hiện các vòng tròn vàng kim lan rộng liên tục kèm tia laser xoay vòng 360 độ.',
            telegraph_en:
              'WIPE ALERT: Boss levitates to the center of the room while golden runes expand across the floor and a rotating laser sweeps 360 degrees.',
            countermeasure_vi:
              'Toàn bộ 20 người ngừng đánh, di chuyển theo chiều kim đồng hồ sát mép ngoài phòng để né tia laser. Tuyệt đối KHÔNG bật Cleric Robe/Druid Robe vì tia laser sẽ xóa sạch mọi bùa lợi (Purge) trước khi gây sát thương!',
            countermeasure_en:
              'Full stop DPS and rotate clockwise along the outer ring ahead of the rotating laser. Do NOT rely on Cleric Robe buffs—the beam purges all buffs on contact!',
          },
          {
            id: 'mech-archmage-2',
            skillName_vi: 'Sóng Xung Kích Đẩy Lùi (Arcane Shockwave)',
            skillName_en: 'Arcane Shockwave',
            spellIcon: 'Arcane Orb',
            isWipeMechanic: false,
            telegraph_vi:
              'Boss thu gậy về sau trong 1.5s và tạo vòng tròn xanh dương dưới chân.',
            telegraph_en:
              'Boss pulls staff back for 1.5s, charging a blue circle underneath.',
            countermeasure_vi:
              'Support bấm Mũ Hiệp Sĩ (Knight Helmet - Displacement Immunity) cho cả đội đứng nguyên vị trí và tiếp tục xả DPS mà không bị hất văng vào tường lửa.',
            countermeasure_en:
              'Support pops Knight Helmet (Displacement Immunity) on the DPS stack to prevent knockback into the outer fire wall.',
          },
        ],
      },
      {
        id: 'boss-ava-knight-captain',
        bossName_vi: 'Thống Soái Hiệp Sĩ (Avalonian Knight Captain)',
        bossName_en: 'Avalonian Knight Captain',
        tierLabel: 'Sub-Boss • Cánh Chiến Binh',
        archetype_vi: 'Đấu Sĩ Khiên Phản Đòn & Chém Xoay Kiếm',
        archetype_en: 'Reflecting Shield & Whirlwind Commander',
        difficulty: 'Hard',
        summary_vi:
          'Sát thủ số 1 đối với những DPS không chú ý hiệu ứng khiên của Boss. Chỉ cần 1 quả bom Light Crossbow nổ trúng lúc Boss dựng khiên là DPS tự sát ngay lập tức!',
        summary_en:
          'The #1 killer of greedy DPS players. A single Exploding Shot detonating into the Captain’s reflect shield will instantly one-shot the caster!',
        mechanics: [
          {
            id: 'mech-knight-1',
            skillName_vi: 'Khiên Phản Pháo Ánh Sáng (Aegis Reflect Stance)',
            skillName_en: 'Aegis Reflect Stance',
            spellIcon: 'Iron Breaker',
            isWipeMechanic: true,
            telegraph_vi:
              'CẢNH BÁO WIPE: Boss cắm kiếm xuống đất, dựng khiên phát sáng màu vàng trắng trước ngực trong 4 giây.',
            telegraph_en:
              'WIPE ALERT: Boss plants his sword and raises a glowing white-gold shield for 4 seconds.',
            countermeasure_vi:
              'Dừng toàn bộ sát thương (Ấn phím S để ngắt đánh thường) hoặc chỉ định Arcane Support dùng Purge (Fiend Cowl / 1H Arcane) xóa ngay lớp khiên vàng của Boss.',
            countermeasure_en:
              'Press "S" to halt all attacks immediately, OR have your Arcane Support purge the shield with 1H Arcane / Fiend Cowl.',
          },
          {
            id: 'mech-knight-2',
            skillName_vi: 'Cú Nhảy Chém Chấn Động (Crushing Leap)',
            skillName_en: 'Crushing Leap',
            spellIcon: 'Heavy Smash',
            isWipeMechanic: false,
            telegraph_vi:
              'Boss khóa mục tiêu vào người đứng xa nhất và hiện vòng tròn đỏ lớn dưới chân người đó.',
            telegraph_en:
              'Boss targets the farthest player, placing a large red impact circle under their feet.',
            countermeasure_vi:
              'Tất cả DPS và Healer đứng chụm sát cách lưng Boss 5m để Boss không nhảy lung tung, dùng giày lướt nhẹ sang bên khi thấy vòng đỏ.',
            countermeasure_en:
              'Stack tightly 5m behind the Boss so leaps remain predictable, and sidestep the red indicator.',
          },
        ],
      },
      {
        id: 'boss-ava-high-general',
        bossName_vi: 'Đại Tướng Quân Sir Bedivere (Final Boss Avalonian)',
        bossName_en: 'High General Sir Bedivere (Final Raid Boss)',
        tierLabel: 'Final Boss • Phòng Ngai Vàng',
        archetype_vi: 'Trùm Cuối Hầm Ngục Avalonian (3 Giai Đoạn)',
        archetype_en: '3-Phase Avalonian Raid Final Boss',
        difficulty: 'Extreme (Raid Wipe)',
        summary_vi:
          'Trùm cuối trấn giữ Rương Vàng Avalonian và bùa lợi +10% Fame. Gồm 3 giai đoạn biến đổi liên tục đòi hỏi phối hợp nhịp nhàng giữa Tank, Arcane Support và dàn DPS.',
        summary_en:
          'Guardian of the Avalonian Golden Chests and the +10% Weekly Fame Shrine. Features 3 distinct phases requiring synchronized Tank swaps and Arcane shields.',
        mechanics: [
          {
            id: 'mech-bedivere-1',
            skillName_vi: 'Phán Quyết Thánh Quang (Divine Execution Slash - Phase 3)',
            skillName_en: 'Divine Execution Slash (Phase 3)',
            spellIcon: 'Deadly Chop',
            isWipeMechanic: true,
            telegraph_vi:
              'CẢNH BÁO WIPE: Khi máu dưới 35%, Boss triệu hồi các thanh đại kiếm ánh sáng rơi theo đường chéo khắp sàn đấu đồng thời gồng chiêu chém toàn bản đồ.',
            telegraph_en:
              'WIPE ALERT: Below 35% HP, Boss summons diagonal lines of falling light swords across the arena while channeling a room-wide execution slash.',
            countermeasure_vi:
              'Tìm ô vuông an toàn (Safe Pocket) nơi 2 đường chéo không giao nhau, đồng thời Enigmatic Staff (Arcane) bấm Khiên Bảo Hộ diện rộng kết hợp Mũ Judicator Helmet làm choáng ngắt nhịp gồng cuối!',
            countermeasure_en:
              'Move into the safe triangle pocket between diagonal sword lines while Enigmatic Staff channels AoE Protection Beam.',
          },
          {
            id: 'mech-bedivere-2',
            skillName_vi: 'Dấu Ấn Trừng Phạt (Chain Lightning Brand)',
            skillName_en: 'Chain Lightning Brand',
            spellIcon: 'Empowering Beam',
            isWipeMechanic: false,
            telegraph_vi:
              '3 người chơi ngẫu nhiên bị gắn vòng điện màu tím trên đầu, sau 3s sẽ phóng sét sang những ai đứng gần.',
            telegraph_en:
              '3 random players are marked with a purple electric ring that arcs lethal lightning to nearby allies after 3s.',
            countermeasure_vi:
              'Chỉ 3 người bị gắn dấu tím bước lùi 6m ra khỏi đám đông cho đến khi tia sét nổ xong rồi mới quay lại thảm máu của Healer.',
            countermeasure_en:
              'Marked players step 6m outside the main stack until the lightning discharges, then return to the healing carpet.',
          },
        ],
      },
    ],
  },

  GroupDungeon: {
    id: 'guide-group-dungeon',
    activityType: 'GroupDungeon',
    title_vi: 'Cẩm Nang Hầm Ngục Nhóm & Static Dungeon (5–7 Người)',
    title_en: 'Group & Static Dungeon Fast-Clear Guide (5–7 Players)',
    subtitle_vi:
      'Tối ưu hóa tốc độ kéo bầy quái (Pulls) và dồn sát thương diện rộng cho tổ đội 5–7 thành viên.',
    subtitle_en:
      'Optimize large multi-pack pulls and AoE burst rotations for 5–7 player parties.',
    recommendedPartySize: '5 – 7 Players (1 Tank, 1 Healer, 3–5 AoE DPS)',
    fameMultiplierLabel: '+220% Group Fame Bonus',
    silverPerHourLabel: '1,500,000 – 3,000,000 Silver / Hour',
    overview_vi:
      'Static Dungeon và Map Nhóm T8 tập trung vào tốc độ gom 3–4 bãi quái cùng lúc và dọn sạch chỉ trong 1 lượt hồi chiêu E nhờ sự kết hợp giữa Incubus Mace + Blazing Staff / Shadowcaller + Light Crossbow.',
    overview_en:
      'Static and T8 Group Dungeons revolve around pulling 3–4 mob packs together and wiping them in a single cooldown cycle using Incubus Mace + Shadowcaller + Light Crossbow.',
    checklist_vi: [
      'Mang theo Cải Bắp (Cabbage Soup) để đổi sang hồi máu nhanh ngoài giao tranh khi cần.',
      'DPS luôn chờ Tank dùng Air Compressor (W) gom chụm quái xong mới tung chiêu diện rộng.',
      'Trong vùng Đỏ/Đen, cử 1 người kiểm tra số lượng người trong bản đồ hoặc nghe tiếng bước chân ở cổng.',
    ],
    checklist_en: [
      'Wait for the Tank’s Air Compressor (W) clump before dropping ground AoE spells.',
      'Stagger Royal Jacket banners if running two leather support builds.',
      'Keep an escape mount (Gallant Horse / Spectral Boar) equipped in lethal zones.',
    ],
    ipRequirements: [
      {
        tierLabel: 'Static T6 (Vùng Vàng / Đỏ)',
        tankIp: '1,250+ IP',
        healerIp: '1,200+ IP',
        dpsIp: '1,200+ IP',
        note_vi: 'An toàn, tốc độ luyện Fame vũ khí rất nhanh.',
        note_en: 'Safe and consistent weapon spec farming.',
      },
      {
        tierLabel: 'Map Nhóm T8.1 – T8.3 (Vùng Đen)',
        tankIp: '1,400+ IP',
        healerIp: '1,350+ IP',
        dpsIp: '1,350+ IP',
        note_vi: 'Thưởng Fame và Rương Tím/Vàng cực lớn.',
        note_en: 'Massive Fame and high-value Purple/Gold chest rewards.',
      },
    ],
    roles: [],
    bosses: [],
  },

  HCE: {
    id: 'guide-hce-expedition',
    activityType: 'HCE',
    title_vi: 'Cẩm Nang Viễn Chinh Cấp Độ Cao (HCE Level 15–18)',
    title_en: 'Hardcore Expeditions (HCE Lv. 15–18) Master Guide',
    subtitle_vi:
      'Hoạt động kiếm Bạc (Silver) và Fame đỉnh cao ngay trong Thành Phố An Toàn không sợ rơi đồ.',
    subtitle_en:
      'Zero-risk endgame PvE inside Royal Cities requiring T8.3/T8.4 Masterpiece gear and pixel-perfect pulls.',
    recommendedPartySize: '5 Players (1 Tank, 1 Healer, 1 Shadowcaller, 1 Frost, 1 Light Crossbow)',
    fameMultiplierLabel: 'Safe-Zone Elite Fame + Map Drop Chain',
    silverPerHourLabel: '2,500,000 – 4,500,000 Raw Silver / Hour',
    overview_vi:
      'HCE cấp 15–18 là bài kiểm tra kỹ năng cá nhân khắc nghiệt nhất cho nhóm 5 người: Quái thường chỉ cần đánh trúng 1 đòn là DPS bốc hơi. Đội hình bắt buộc gồm Tank Chùy, Healer Holy, Shadowcaller trừ giáp, Chillhowl băng giữ chân và Light Crossbow xả sát thương.',
    overview_en:
      'HCE Lv. 15–18 demands precision 5-man synergy: a single auto-attack from an enraged mob will one-shot any DPS. Standard meta composition is 1H Mace Tank, Hallowfall Healer, Shadowcaller Support, Chillhowl Frost, and Light Crossbow DPS.',
    checklist_vi: [
      'Luôn chuẩn bị 2 bộ đồ (Main Set + Skip Set Giày Bóng Ma / Áo Hiệp Sĩ) để chạy qua các bãi quái không cần thiết.',
      'Light Crossbow luôn giữ nội tại Well-Prepared ở mức 3/4 trước mỗi pha kéo quái.',
    ],
    checklist_en: [
      'Maintain a dedicated Skip Set (Specter Shoes + Knight Armor) on quick-equip.',
      'Pre-stack Light Crossbow Well-Prepared passive to 3/4 before every pull.',
    ],
    ipRequirements: [
      {
        tierLabel: 'HCE Lv. 10 – 14',
        tankIp: '1,600+ IP',
        healerIp: '1,550+ IP',
        dpsIp: '1,600+ IP',
        note_vi: 'Yêu cầu trang bị T8.2 – T8.3 Excellent.',
        note_en: 'Requires T8.2 – T8.3 Excellent gear.',
      },
      {
        tierLabel: 'HCE Lv. 15 – 18 (Tối Thượng)',
        tankIp: '1,800+ IP (T8.3/8.4 MP)',
        healerIp: '1,750+ IP',
        dpsIp: '1,850+ IP (T8.3/8.4 MP)',
        note_vi: 'Yêu cầu thuộc lòng từng vị trí đứng trên 10 bản đồ HCE.',
        note_en: 'Requires T8.3/8.4 Masterpiece gear and exact pull memorization.',
      },
    ],
    roles: [],
    bosses: [],
  },

  Corrupted: {
    id: 'guide-corrupted-dungeon',
    activityType: 'Corrupted',
    title_vi: 'Cẩm Nang Hầm Ngục Tha Hóa (Corrupted Dungeons 1v1)',
    title_en: 'Corrupted Dungeons (1v1 Stalker & Slayer) Guide',
    subtitle_vi:
      'Kết hợp dọn quái tốc độ cao lấy Infamy và sẵn sàng nghênh chiến 1v1 công bằng không sợ bị hội đồng.',
    subtitle_en:
      'Fast solo PvE clearing combined with fair IP-capped 1v1 PvP invasions.',
    recommendedPartySize: 'Solo (1v1 IP-Capped)',
    fameMultiplierLabel: 'Infamy Scaling Fame & Loot Bonus',
    silverPerHourLabel: '1,200,000 – 5,000,000 Silver / Hour',
    overview_vi:
      'Corrupted Dungeon chia làm 3 bậc: Hunter (Không rớt đồ), Stalker (Giới hạn 1,000 IP - Rớt đồ) và Slayer (Giới hạn 1,300 IP - Rớt đồ cao cấp). Sử dụng công cụ "Check Đối Thủ" trong trang Vũ Khí để tra cứu ngay cách khắc chế vũ khí của kẻ xâm lược!',
    overview_en:
      'Corrupted Dungeons feature Hunter (non-lethal), Stalker (1,000 IP cap), and Slayer (1,300 IP cap). Use our Matchup Quick Check tool the moment you inspect your invader!',
    checklist_vi: [
      'Luôn dọn sạch đường lùi xung quanh 3 Tinh Thể (Shards) để có không gian thả diều hoặc đập vỡ tinh thể khi gặp kèo khắc chế.',
      'Kiểm tra trang bị đối thủ (Ấn phím Y) ngay khi vừa nhìn thấy tên để đổi kỹ năng W cho phù hợp trước khi vào giao tranh.',
    ],
    checklist_en: [
      'Clear mob paths around the 3 Demonic Shards so you have kiting room during invasions.',
      'Inspect your opponent (Hotkey Y) immediately at max screen range and swap your W spell before combat locks.',
    ],
    ipRequirements: [
      {
        tierLabel: 'Stalker (Kẻ Săn Đuổi)',
        tankIp: '1,000 IP (Softcap 80%)',
        healerIp: '1,000 IP',
        dpsIp: '1,050 – 1,150 IP (Đồ T4.1 / T6.0)',
        note_vi: 'Chi phí bộ đồ chỉ 60k–120k Bạc, cực kỳ lời để luyện kỹ năng PvP 1v1.',
        note_en: 'Low 80k Silver loadout cost; best arena to master 1v1 mechanics.',
      },
      {
        tierLabel: 'Slayer (Kẻ Đồ Sát)',
        tankIp: '1,300 IP (Softcap 50%)',
        healerIp: '1,300 IP',
        dpsIp: '1,350 – 1,500 IP (Đồ T8.0 / T6.2)',
        note_vi: 'Phần thưởng rương trùm và đồ PvP giá trị rất cao.',
        note_en: 'High-stakes 1v1 with lucrative demon chest loot.',
      },
    ],
    roles: [],
    bosses: [],
  },
};

// Populate fallback roles & bosses for GroupDungeon, HCE, Corrupted from Avalonian so switching tabs always shows rich content
PVE_GUIDES_DB.GroupDungeon.roles = PVE_GUIDES_DB.Avalonian.roles;
PVE_GUIDES_DB.GroupDungeon.bosses = PVE_GUIDES_DB.Avalonian.bosses.slice(0, 2);
PVE_GUIDES_DB.HCE.roles = PVE_GUIDES_DB.Avalonian.roles;
PVE_GUIDES_DB.HCE.bosses = PVE_GUIDES_DB.Avalonian.bosses.slice(0, 2);
PVE_GUIDES_DB.Corrupted.roles = [PVE_GUIDES_DB.Avalonian.roles[2]];
PVE_GUIDES_DB.Corrupted.bosses = [PVE_GUIDES_DB.Avalonian.bosses[1]];
