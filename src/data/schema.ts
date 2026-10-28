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
  modeTag:
    | 'PvE Burst'
    | '1v1 Mists / Corrupted'
    | 'Small-Scale Brawl'
    | 'ZvZ Engage'
    | 'Solo Gank'
    | 'Open-World Roam';
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
  {
    opponentUniqueName: 'T8_2H_GLOVES_SET1',
    opponentBaseId: '2H_GLOVES_SET1',
    opponentName_vi: 'Battle Bracers (Bao Tay Chiến Binh)',
    opponentName_en: 'Battle Bracers',
    relation: 'weakAgainst',
    threatLevel: 'EXTREME',
    keyEnemySkill_vi: 'Falcon Smash (E) - Nhảy vọt lên trời không thể cản phá và nện choáng',
    keyEnemySkill_en: 'Falcon Smash (E) - Unstoppable aerial leap & massive shockwave slam',
    keyEnemySpellIcon: 'Falcon Smash',
    counterTip_vi:
      'Falcon Smash (E) bay trên không miễn nhiễm khống chế. Khi thấy hắn nhảy lên trời hướng về phía mình, lập tức bật bình Resistance Potion hoặc Gigantify Potion, hoặc bấm giày lướt nhanh ra khỏi vòng đỏ trên đất trước khi hắn đáp xuống!',
    counterTip_en:
      'Falcon Smash is completely immune while airborne. Pop Resistance or Gigantify Potion the second they jump into the sky, or dash roll out of the red landing marker!',
    defensiveAction_vi:
      'Bình Resistance Potion hoặc Cleric Robe bật đón đầu lúc hắn sắp chạm đất để vô hiệu hóa toàn bộ cú nện E.',
    defensiveAction_en:
      'Pop Resistance Potion or pre-activate Cleric Robe right before impact to absorb the shockwave burst.',
  },
  {
    opponentUniqueName: 'T8_MAIN_NATURESTAFF_KEEPER',
    opponentBaseId: 'MAIN_NATURESTAFF_KEEPER',
    opponentName_vi: 'Druidic Staff (Gậy Rừng Tự Nhiên)',
    opponentName_en: 'Druidic Staff',
    relation: 'weakAgainst',
    threatLevel: 'HIGH',
    keyEnemySkill_vi: 'Spiritual Seed (E) + Rejuvenation (Q) - HoT liên tục và hồi máu khổng lồ sau 3 giây',
    keyEnemySkill_en: 'Spiritual Seed (E) + Rejuvenation (Q) - Rolling HoTs into massive 3s burst heal',
    keyEnemySpellIcon: 'Rejuvenation',
    counterTip_vi:
      'Đừng đánh cù cưa kéo dài nếu không có kỹ năng trừ máu! Druidic Staff sẽ hồi đầy máu sau mỗi 15 giây nhờ E. Phải dùng Purge (Mage Cowl / Fiend Cowl) xóa sạch bùa Q HoT hoặc dùng Vết Thương Sâu giảm 40-50% hồi phục.',
    counterTip_en:
      'Never play long wars of attrition against Druidic without anti-heal! Use Purge to wipe their 3x Q HoT charges or apply heavy healing reduction (Demon Cloak / Carrioncaller) before bursting.',
    defensiveAction_vi:
      'Dùng Purge xóa bùa hồi máu hoặc dồn sát thương một combo kết liễu trước khi hạt mầm E nở sau 3s.',
    defensiveAction_en:
      'Purge rolling HoT stacks or execute within 3 seconds before the Spiritual Seed blooms.',
  },
  {
    opponentUniqueName: 'T8_MAIN_FIRESTAFF',
    opponentBaseId: 'MAIN_FIRESTAFF',
    opponentName_vi: '1H Fire Staff (Gậy Lửa 1 Tay)',
    opponentName_en: '1H Fire Staff',
    relation: 'skillMatchup',
    threatLevel: 'EXTREME',
    keyEnemySkill_vi: 'Pyroblast (E) - Bắn cầu lửa hạt nhân nổ 1000+ sát thương và Đốt cháy',
    keyEnemySkill_en: 'Pyroblast (E) - Nuclear fireball projectile dealing 1000+ burst & burn',
    keyEnemySpellIcon: 'Pyroblast',
    counterTip_vi:
      'Chiêu Pyroblast (E) bay với tốc độ vừa phải. Khi thấy quả cầu lửa đỏ rực bay tới, BẮT BUỘC bấm Hunter Hood (Phản Đòn 70%) hoặc Cleric Robe! Hắn sẽ tự mất hơn 60% cây máu vì chính sát thương nổ của mình!',
    counterTip_en:
      'Pyroblast (E) travels with a visible travel time. When the nuclear fireball flies toward you, press Hunter Hood (Retaliate) or Cleric Robe! The Fire user will chunk 60%+ of their own HP from their reflected burst!',
    defensiveAction_vi:
      'Hunter Hood (Phản Đòn) canh đúng lúc quả cầu lửa chạm người hoặc ngắt chiêu lúc hắn đang niệm.',
    defensiveAction_en:
      'Reflect with Hunter Hood right before the projectile hits, or interrupt during its 1.2s channel.',
  },
  {
    opponentUniqueName: 'T8_2H_COMBATSTAFF_MORGANA',
    opponentBaseId: '2H_COMBATSTAFF_MORGANA',
    opponentName_vi: 'Double Bladed Staff (Thiết Bảng 2 Đầu)',
    opponentName_en: 'Double Bladed Staff',
    relation: 'weakAgainst',
    threatLevel: 'HIGH',
    keyEnemySkill_vi: 'Overpower (E) + Concussive Combo (Q) - Khóa chân liên hoàn và lướt bám đuổi',
    keyEnemySkill_en: 'Overpower (E) + Concussive Combo (Q) - Chained root lockdown & endless chase',
    keyEnemySpellIcon: 'Overpower',
    counterTip_vi:
      'Thiết Bảng là vua Gank Mists. Không bao giờ dùng vội giày F để bỏ chạy khi hắn chưa tung chiêu E! Mang theo Fort Sterling Cape để tự động giải khống chế cú choáng đầu tiên, rồi quay lại đánh trả vì sát thương duy trì của hắn rất yếu.',
    counterTip_en:
      'Double Bladed is the ultimate chase weapon. Never burn your boot mobility until after they commit their E! Equip Fort Sterling Cape to cleanse their opening root, then turn and brawl since their sustained DPS is low.',
    defensiveAction_vi:
      'Áo Assassin Jacket (Tàng hình cắt chuỗi combo) hoặc bật Giày giáp chạy kháng làm chậm.',
    defensiveAction_en:
      'Assassin Jacket stealth to break their target lock, or pop displacement-immune boots.',
  },
  {
    opponentUniqueName: 'T8_2H_FROSTSTAFF',
    opponentBaseId: '2H_FROSTSTAFF',
    opponentName_vi: 'Great Frost Staff (Đại Gậy Băng)',
    opponentName_en: 'Great Frost Staff',
    relation: 'goodAgainst',
    threatLevel: 'MEDIUM',
    keyEnemySkill_vi: 'Hail (E) + Frost Nova (W) - Mưa băng liên tục làm chậm 50% và trói chân',
    keyEnemySkill_en: 'Hail (E) + Frost Nova (W) - Continuous blizzard slow & blink freeze',
    keyEnemySpellIcon: 'Hail',
    counterTip_vi:
      'Gậy Băng rất mỏng manh và phụ thuộc vào việc giữ đối thủ ở ngoài tầm. Sử dụng giày chạy không thể bị làm chậm (Knight / Miner) để áp sát thật nhanh. Khi cận chiến, hắn sẽ buộc phải W chạy trốn.',
    counterTip_en:
      'Frost Staff relies entirely on keeping you chilled at maximum range. Use slow-resistant boots to crash onto them; once in melee range, their defense crumbles.',
    defensiveAction_vi:
      'Bật Giày chạy kháng khống chế áp sát cận chiến và dồn sát thương sốc.',
    defensiveAction_en:
      'Use slow-resistant sprint to close the gap and execute in close quarters.',
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

  // ==========================================================================
  // 3. BATTLEAXE (MAIN_AXE)
  // ==========================================================================
  MAIN_AXE: {
    id: 'playbook-battleaxe',
    weaponFamily: 'axe',
    baseIdentifier: 'MAIN_AXE',
    weaponName_vi: 'Rìu Chiến 1 Tay (Battleaxe)',
    weaponName_en: 'Battleaxe',
    playstyleSummary_vi:
      'Vua tự sinh tồn (Solo Sustain Bruiser) đỉnh cao trong Mists và Corrupted Dungeons. Tuyệt kỹ Blood Bandit (E) cho phép ném rìu 2 lần liên tiếp: lần 1 rỉa máu và làm chậm, lần 2 gây sát thương kết liễu từ xa đồng thời hồi phục một lượng máu khổng lồ nếu mục tiêu dính 3 cộng dồn Xuất Huyết (Bleed).',
    playstyleSummary_en:
      'King of solo sustain in Mists and Corrupted Dungeons. Blood Bandit (E) throws two axes: the first slows and damages, while the second executes from range and restores massive HP when hitting a target with 3 Bleed stacks.',
    powerSpikes_vi: [
      'Ném trúng rìu E lần thứ 2 khi mục tiêu có 3 điểm Bleed hồi phục tới 15% - 22% máu tối đa ngay lập tức!',
      'Kết hợp với Đuốc (Torch) hoặc Sừng Mistcaller ở tay phụ giúp giảm tối đa thời gian hồi chiêu E và tăng tốc độ chém thường.',
      'Kỹ năng W Battle Rush (Xung Trận) ở Tier VI vừa cho cú lướt 12m áp sát vừa áp hiệu ứng giảm 40% khả năng hồi máu của địch.',
    ],
    powerSpikes_en: [
      'Landing the 2nd E throw on a 3-Bleed target restores up to 15-22% max HP instantly!',
      'Pairs with Torch or Mistcaller off-hand for rapid attack speed and minimum E cooldown.',
      'Battle Rush (W) at T6 grants a 12m gap closer with a built-in 40% healing reduction debuff.',
    ],
    combos: [
      {
        id: 'baxe-combo-1',
        title_vi: 'Combo Ném Rìu Kép Hút Máu Đảo Ngược Máu (Blood Bandit Dual Cast)',
        title_en: 'Blood Bandit Double Throw Turnaround',
        modeTag: '1v1 Mists / Corrupted',
        difficulty: 'Medium',
        sequence: ['slotW', 'slotQ', 'slotQ', 'slotQ', 'slotE', 'slotE'],
        steps: [
          {
            slot: 'slotW',
            slotLabel: 'W',
            spellIcon: 'Adrenaline Boost',
            spellName_vi: 'Tăng Tốc Sinh Lực',
            spellName_en: 'Adrenaline Boost',
            note_vi: '+50% tốc chạy & +25% sát thương áp sát',
            note_en: '+50% Move Speed & +25% Damage',
          },
          {
            slot: 'slotQ',
            slotLabel: 'Q (x3)',
            spellIcon: 'Rending Rage',
            spellName_vi: 'Chém Rách Thịt (3 Bleed)',
            spellName_en: '3x Rending Rage',
            note_vi: 'Tích đủ 3 cộng dồn Xuất Huyết',
            note_en: 'Cap 3 Bleed stacks on target',
          },
          {
            slot: 'slotE',
            slotLabel: 'E (Cast 1)',
            spellIcon: 'ITEM:T8_MAIN_AXE',
            spellName_vi: 'Blood Bandit (Lần 1)',
            spellName_en: 'Blood Bandit (Throw 1)',
            note_vi: 'Ném rỉa máu & làm chậm đối thủ',
            note_en: 'Slows & damages target',
          },
          {
            slot: 'slotE',
            slotLabel: 'E (Cast 2)',
            spellIcon: 'ITEM:T8_MAIN_AXE',
            spellName_vi: 'Blood Bandit (Lần 2)',
            spellName_en: 'Blood Bandit (Throw 2)',
            note_vi: 'Ném kết liễu + Hồi 20% Máu tối đa!',
            note_en: 'Execute + Heal 20% max HP!',
          },
        ],
        description_vi:
          'Luôn tích đủ 3 điểm Xuất Huyết trước khi ném E! Ném E lần 1 để làm chậm đối thủ, sau đó bước thêm 1 nhịp căn thẳng góc ném E lần 2 nhằm đảm bảo không bị hụt. Lượng máu hồi lại từ E lần 2 thường xuyên khiến đối thủ bất ngờ bị lật kèo.',
        description_en:
          'Always secure 3 Bleed stacks before committing E! The first throw slows the foe, letting you line up the crucial 2nd throw that triggers the massive heal and execute.',
      },
      {
        id: 'baxe-combo-2',
        title_vi: 'Hồi Đầy Cây Máu Kết Hợp Mercenary Jacket (Burst Sustain)',
        title_en: 'Mercenary Jacket Bloodlust Burst Sustain',
        modeTag: 'PvE Burst',
        difficulty: 'Easy',
        sequence: ['slotArmor', 'slotQ', 'slotE', 'slotE'],
        steps: [
          {
            slot: 'slotArmor',
            slotLabel: 'R (Áo)',
            spellIcon: 'Bloodlust',
            spellName_vi: 'Áo Mercenary Jacket',
            spellName_en: 'Mercenary Bloodlust',
            note_vi: 'Kích hoạt bùa hồi máu theo số đòn đánh',
            note_en: 'Each hit restores HP up to 7 times',
          },
          {
            slot: 'slotQ',
            slotLabel: 'Q',
            spellIcon: 'Spin Attack',
            spellName_vi: 'Rending Spin',
            spellName_en: 'Rending Spin',
            note_vi: 'Xoay trúng nhiều quái kích 3-4 lần hồi máu',
            note_en: 'AoE hits proc multiple heals',
          },
          {
            slot: 'slotE',
            slotLabel: 'E',
            spellIcon: 'ITEM:T8_MAIN_AXE',
            spellName_vi: 'Blood Bandit Dual',
            spellName_en: 'Blood Bandit Dual',
            note_vi: 'Hoàn tất hồi đầy 100% thanh máu',
            note_en: 'Restores HP back to 100%',
          },
        ],
        description_vi:
          'Khi máu tụt xuống dưới 30%, bật Bloodlust (Áo Mercenary) rồi xoay Q trúng mục tiêu, kết hợp ném E2 để kéo đầy thanh máu chỉ trong 1.5 giây!',
        description_en:
          'Drop to 30% HP, pop Mercenary Jacket Bloodlust, spin Q into E throws to snap back to 100% HP within 1.5 seconds.',
      },
    ],
    matchups: {
      goodAgainst: [
        GLOBAL_OPPONENT_COUNTER_DB[2], // Dual Swords
        GLOBAL_OPPONENT_COUNTER_DB[4], // Carving Sword
        GLOBAL_OPPONENT_COUNTER_DB[11], // Great Frost Staff
      ],
      weakAgainst: [
        GLOBAL_OPPONENT_COUNTER_DB[0], // Bloodletter
        GLOBAL_OPPONENT_COUNTER_DB[1], // Deathgivers
        GLOBAL_OPPONENT_COUNTER_DB[3], // 1H Cursed Staff
      ],
      allMatchups: GLOBAL_OPPONENT_COUNTER_DB,
    },
    communityTips: [
      {
        id: 'tip-baxe-1',
        weaponIdentifier: 'MAIN_AXE',
        author: 'AxeMaster_Asia',
        authorBadge_vi: 'Chiến Tướng Mists T8',
        authorBadge_en: 'T8 Mists Warlord',
        content_vi:
          'Đừng bao giờ vội vàng bấm E lần 2 nếu đối thủ đang cầm giày lướt hoặc chuẩn bị chạy vòng quanh tảng đá! Cú ném E2 có thời gian chờ tới 4 giây, hãy bình tĩnh đi bộ theo ép góc rồi mới ném.',
        content_en:
          'Never panic-cast the 2nd E if the enemy still has a dash or is running around an obstacle. You have a generous 4-second window to line up the second throw!',
        upvotes: 189,
        downvotes: 5,
        patchVersion: 'v1.26 (Horizon)',
        isOutdated: false,
        createdAt: '1 ngày trước',
      },
      {
        id: 'tip-baxe-2',
        weaponIdentifier: 'MAIN_AXE',
        author: 'CorruptedGrinder',
        authorBadge_vi: 'Top 100 Corrupted Slayer',
        authorBadge_en: 'Top 100 Corrupted Slayer',
        content_vi:
          'Gặp kẻ địch mặc Hunter Hood (Phản Đòn), hãy ném E1 vào người hắn để lấy làm chậm nhưng giữ lại E2. Chờ 4 giây cho bùa phản đòn của hắn biến mất rồi mới ném E2 để nhận trọn vẹn hồi máu!',
        content_en:
          'Against Hunter Hood reflect, throw E1 to slow them but hold E2. Wait out their 4s reflect before firing E2 for the uncontested heal!',
        upvotes: 134,
        downvotes: 3,
        patchVersion: 'v1.26 (Horizon)',
        isOutdated: false,
        createdAt: '3 ngày trước',
      },
    ],
  },

  // ==========================================================================
  // 4. BLOODLETTER (MAIN_DAGGER / MAIN_RAPIER_MORGANA)
  // ==========================================================================
  MAIN_DAGGER: {
    id: 'playbook-bloodletter',
    weaponFamily: 'dagger',
    baseIdentifier: 'MAIN_DAGGER',
    weaponName_vi: 'Kiếm Tử Thần (Bloodletter / 1H Dagger)',
    weaponName_en: 'Bloodletter / 1H Dagger',
    playstyleSummary_vi:
      'Sát thủ kết liễu và cơ động số 1 thế giới Albion. Chiêu cuối Lunging Stabs (E) lướt xuyên 10m gây sát thương gấp 4 lần nếu máu mục tiêu dưới 40%, đồng thời là công cụ đào thoát xuyên màn hình khiến không kẻ địch nào có thể đuổi kịp.',
    playstyleSummary_en:
      'Premier execute assassin and hyper-mobility king of Albion. Lunging Stabs (E) dashes 10m and deals 400% amplified damage against targets below 40% HP, doubling as an unstoppable cross-screen disengage.',
    powerSpikes_vi: [
      'Ngưỡng 40% máu của kẻ địch biến Lunging Stabs (E) thành lưỡi hái tử thần gây 1200+ sát thương chuẩn.',
      'W Shadow Edge trúng đích lập tức kéo bạn tới kẻ địch và làm choáng 1.2s, đồng thời xóa khựng đòn đánh.',
      'Sử dụng Mũ Stalker Hood giảm giáp kết hợp Áo Assassin Jacket cho khả năng tàng hình phục kích rình mồi.',
    ],
    powerSpikes_en: [
      'The 40% HP enemy threshold multiplies Lunging Stabs (E) damage up to 1200+ raw burst.',
      'Shadow Edge (W) pulls you directly onto the target, stunning for 1.2s and resetting attack frames.',
      'Synergizes with Stalker Hood armor shred and Assassin Jacket stealth for lethal ambush windows.',
    ],
    combos: [
      {
        id: 'bl-combo-1',
        title_vi: 'Chuỗi Ám Sát Dưới 40% Máu (Shadow Execute Burst)',
        title_en: 'Under-40% HP Shadow Execute Burst',
        modeTag: '1v1 Mists / Corrupted',
        difficulty: 'Hard',
        sequence: ['slotW', 'slotQ', 'slotHead', 'slotE', 'slotShoes'],
        steps: [
          {
            slot: 'slotW',
            slotLabel: 'W',
            spellIcon: 'Shadow Edge',
            spellName_vi: 'Phi Dao Bóng Tối',
            spellName_en: 'Shadow Edge',
            note_vi: 'Kéo bản thân áp sát & Làm choáng 1.2s',
            note_en: 'Pulls you to target & stuns 1.2s',
          },
          {
            slot: 'slotQ',
            slotLabel: 'Q',
            spellIcon: 'Sunder Armor',
            spellName_vi: 'Xuyên Giáp',
            spellName_en: 'Sunder Armor',
            note_vi: 'Trừ giáp và tích cộng dồn sát thương',
            note_en: 'Shreds resistance & stacks buff',
          },
          {
            slot: 'slotHead',
            slotLabel: 'D (Mũ)',
            spellIcon: 'Mortal Agony',
            spellName_vi: 'Mũ Stalker Hood',
            spellName_en: 'Stalker Hood',
            note_vi: 'Trừ thêm 30% giáp mục tiêu dưới 50% máu',
            note_en: 'Shreds 30% armor on low HP target',
          },
          {
            slot: 'slotE',
            slotLabel: 'E',
            spellIcon: 'ITEM:T8_MAIN_RAPIER_MORGANA',
            spellName_vi: 'Lunging Stabs (Kết Liễu)',
            spellName_en: 'Lunging Stabs (Execute)',
            note_vi: 'Lướt xuyên kích sát thương x4 kết liễu!',
            note_en: 'Dash pierce dealing 4x execute burst!',
          },
          {
            slot: 'slotShoes',
            slotLabel: 'F (Giày)',
            spellIcon: 'Refreshing Sprint',
            spellName_vi: 'Giày Chạy Thoát Thân',
            spellName_en: 'Sprint Mobility',
            note_vi: 'Thoát khỏi vùng giao tranh an toàn',
            note_en: 'Disengage cleanly from third parties',
          },
        ],
        description_vi:
          'Căn chuẩn khi máu địch tụt xuống mốc 40-45%. Phóng W (Shadow Edge) kéo trúng làm choáng, bấm Stalker Hood trừ giáp rồi tung ngay Lunging Stabs (E) chém xuyên người kết liễu tức thì!',
        description_en:
          'Wait until the target reaches 40-45% HP. Land Shadow Edge (W) stun, pop Stalker Hood, then unleash Lunging Stabs (E) for an unreactable instant finish.',
      },
      {
        id: 'bl-combo-2',
        title_vi: 'Combo Đào Thoát Mists Siêu Tốc (Double Dash Escape)',
        title_en: 'Hyper-Mobility Double Dash Escape',
        modeTag: 'Solo Gank',
        difficulty: 'Easy',
        sequence: ['slotE', 'slotShoes', 'slotArmor'],
        steps: [
          {
            slot: 'slotE',
            slotLabel: 'E',
            spellIcon: 'ITEM:T8_MAIN_RAPIER_MORGANA',
            spellName_vi: 'Lunging Stabs (Lướt 10m)',
            spellName_en: 'Lunging Stabs (10m Dash)',
            note_vi: 'Lướt không trúng ai chỉ tốn 10s hồi chiêu',
            note_en: 'Only 10s cooldown when not hitting enemies',
          },
          {
            slot: 'slotShoes',
            slotLabel: 'F (Giày)',
            spellIcon: 'Miner Workboots',
            spellName_vi: 'Giày Thợ Mỏ / Giày Chạy',
            spellName_en: 'Flee / Wanderlust',
            note_vi: 'Tăng tốc 120% bứt tốc',
            note_en: '+120% sprint velocity',
          },
          {
            slot: 'slotArmor',
            slotLabel: 'R (Áo)',
            spellIcon: 'Ambush',
            spellName_vi: 'Áo Assassin Jacket',
            spellName_en: 'Assassin Ambush Stealth',
            note_vi: 'Tàng hình cắt đuôi tầm nhìn đối thủ',
            note_en: 'Invisibility to break chase aggro',
          },
        ],
        description_vi:
          'Khi gặp nguy hiểm hoặc bị nhiều người ập vào (Third-party), lướt E về hướng an toàn, bấm giày chạy rồi tàng hình để biến mất hoàn toàn khỏi minimap của kẻ địch.',
        description_en:
          'When third-partied, dash E toward safety, trigger sprint boots, and enter Assassin Jacket stealth to drop all radar detection.',
      },
    ],
    matchups: {
      goodAgainst: [
        GLOBAL_OPPONENT_COUNTER_DB[5], // Regular Bow
        GLOBAL_OPPONENT_COUNTER_DB[3], // 1H Cursed Staff
        GLOBAL_OPPONENT_COUNTER_DB[9], // 1H Fire Staff
      ],
      weakAgainst: [
        GLOBAL_OPPONENT_COUNTER_DB[7], // Battle Bracers
        GLOBAL_OPPONENT_COUNTER_DB[1], // Deathgivers
        GLOBAL_OPPONENT_COUNTER_DB[2], // Dual Swords
      ],
      allMatchups: GLOBAL_OPPONENT_COUNTER_DB,
    },
    communityTips: [
      {
        id: 'tip-bl-1',
        weaponIdentifier: 'MAIN_DAGGER',
        author: 'Ghost_Mists',
        authorBadge_vi: 'Thợ Săn Mists Huyền Thoại',
        authorBadge_en: 'Legendary Mists Hunter',
        content_vi:
          'Lunging Stabs (E) chỉ có hồi chiêu 10s nếu bạn lướt vào không khí hoặc lướt quái rừng! Hãy dùng E như một công cụ di chuyển liên tục để đi farm và nhặt hòm nhanh gấp đôi người khác.',
        content_en:
          'Lunging Stabs only has a 10s cooldown when dashed into empty space. Use it continuously while roaming to clear camp chests twice as fast!',
        upvotes: 245,
        downvotes: 4,
        patchVersion: 'v1.26 (Horizon)',
        isOutdated: false,
        createdAt: '1 ngày trước',
      },
    ],
  },

  // ==========================================================================
  // 5. DEATHGIVERS (2H_DUALDAGGER_HELL)
  // ==========================================================================
  '2H_DUALDAGGER_HELL': {
    id: 'playbook-deathgivers',
    weaponFamily: 'dagger',
    baseIdentifier: '2H_DUALDAGGER_HELL',
    weaponName_vi: 'Song Dao Tử Thần (Deathgivers)',
    weaponName_en: 'Deathgivers',
    playstyleSummary_vi:
      'Đỉnh cao sát thủ cận chiến tàng hình và dồn sát thương liên hoàn. Chiêu Ghost Strike (E) được hồi lại ngay lập tức khi bạn chém trúng mục tiêu đang có 3 cộng dồn Assassin Spirit (Q), đồng thời ban hiệu ứng tàng hình ngắn giúp bạn né tránh các đòn phản kích.',
    playstyleSummary_en:
      'Apex stealth assassin in the Dagger line. Ghost Strike (E) instantly resets its cooldown when striking a target with 3 Assassin Spirit (Q) charges while granting brief invisibility to evade counter-attacks.',
    powerSpikes_vi: [
      'Đủ 3 cộng dồn Assassin Spirit cho phép tung 2 lần Ghost Strike (E) liên tiếp chỉ trong 1.5 giây!',
      'Hiệu ứng tàng hình sau cú E đầu tiên làm mất mục tiêu chỉ định của đối thủ và né được các chiêu thức diện rộng.',
      'Kết hợp với Áo Feyscale Robe hoặc Stalker Jacket tạo lượng sát thương sốc không thể chống đỡ.',
    ],
    powerSpikes_en: [
      '3 Assassin Spirit stacks enable back-to-back Ghost Strike (E) casts within 1.5 seconds!',
      'The post-E invisibility drops enemy target-locks and avoids directional skillshots.',
      'Synergizes with Feyscale Robe or Stalker Jacket for overwhelming burst windows.',
    ],
    combos: [
      {
        id: 'dg-combo-1',
        title_vi: 'Chuỗi Chém Tàng Hình Kép (Ghost Strike Double Reset)',
        title_en: 'Ghost Strike Double Reset Chain',
        modeTag: '1v1 Mists / Corrupted',
        difficulty: 'Hard',
        sequence: ['slotQ', 'slotQ', 'slotQ', 'slotW', 'slotE', 'slotE'],
        steps: [
          {
            slot: 'slotQ',
            slotLabel: 'Q (x3)',
            spellIcon: 'Assassin Spirit',
            spellName_vi: 'Linh Hồn Sát Thủ (3 Stacks)',
            spellName_en: '3x Assassin Spirit',
            note_vi: 'Tích đủ 3 cộng dồn trước khi vào tầm',
            note_en: 'Stack 3 charges on mobs or target',
          },
          {
            slot: 'slotW',
            slotLabel: 'W',
            spellIcon: 'Shadow Edge',
            spellName_vi: 'Phi Dao Bóng Tối',
            spellName_en: 'Shadow Edge',
            note_vi: 'Áp sát và làm choáng 1.2s',
            note_en: 'Gap-closer stun',
          },
          {
            slot: 'slotE',
            slotLabel: 'E (Reset 1)',
            spellIcon: 'ITEM:T8_2H_DUALDAGGER_HELL',
            spellName_vi: 'Ghost Strike (Lần 1)',
            spellName_en: 'Ghost Strike (Reset 1)',
            note_vi: 'Xóa hồi chiêu E + Tàng hình tức thì',
            note_en: 'Instant CD reset & brief stealth',
          },
          {
            slot: 'slotE',
            slotLabel: 'E (Cast 2)',
            spellIcon: 'ITEM:T8_2H_DUALDAGGER_HELL',
            spellName_vi: 'Ghost Strike (Lần 2)',
            spellName_en: 'Ghost Strike (Finisher)',
            note_vi: 'Chém bồi kết liễu mục tiêu',
            note_en: 'Burst execution strike',
          },
        ],
        description_vi:
          'Trước khi giao chiến trong Mists, hãy đánh quái rừng xung quanh để tích sẵn 3 điểm Assassin Spirit trên người. Khi áp sát đối thủ bằng W, tung ngay E lần 1 để lấy sát thương và tàng hình, sau đó lập tức chém E lần 2 để kết liễu!',
        description_en:
          'Pre-stack 3 Assassin Spirit charges on nearby camp mobs before jumping the enemy. Land W stun, cast Ghost Strike (E) once for reset and stealth, then immediately deliver the second Ghost Strike finisher!',
      },
    ],
    matchups: {
      goodAgainst: [
        GLOBAL_OPPONENT_COUNTER_DB[5], // Regular Bow
        GLOBAL_OPPONENT_COUNTER_DB[3], // 1H Cursed Staff
        GLOBAL_OPPONENT_COUNTER_DB[8], // Druidic Staff
      ],
      weakAgainst: [
        GLOBAL_OPPONENT_COUNTER_DB[7], // Battle Bracers
        GLOBAL_OPPONENT_COUNTER_DB[6], // Battleaxe
        GLOBAL_OPPONENT_COUNTER_DB[2], // Dual Swords
      ],
      allMatchups: GLOBAL_OPPONENT_COUNTER_DB,
    },
    communityTips: [
      {
        id: 'tip-dg-1',
        weaponIdentifier: '2H_DUALDAGGER_HELL',
        author: 'NightStalker_DG',
        authorBadge_vi: 'Top 10 Dagger PvP',
        authorBadge_en: 'Top 10 Dagger PvP',
        content_vi:
          'Nếu đối thủ bật Hunter Hood phản đòn, hãy dùng cú Ghost Strike (E) đầu tiên để tàng hình và DỪNG ĐÁNH THƯỜNG. Đi bộ quanh đối thủ trong 2 giây tàng hình cho hết bùa phản đòn rồi mới bấm E lần 2!',
        content_en:
          'If the opponent pops Hunter Hood, use your first Ghost Strike to enter stealth and STOP auto-attacking. Walk around them while invisible until their reflect fades, then land your second E!',
        upvotes: 198,
        downvotes: 2,
        patchVersion: 'v1.26 (Horizon)',
        isOutdated: false,
        createdAt: '2 ngày trước',
      },
    ],
  },

  // ==========================================================================
  // 6. CARVING SWORD (2H_CLEAVER_HELL)
  // ==========================================================================
  '2H_CLEAVER_HELL': {
    id: 'playbook-carving-sword',
    weaponFamily: 'sword',
    baseIdentifier: '2H_CLEAVER_HELL',
    weaponName_vi: 'Đại Đao Địa Ngục (Carving Sword)',
    weaponName_en: 'Carving Sword',
    playstyleSummary_vi:
      'Đấu sĩ xuyên giáp toàn diện (Armor Shred Bruiser). Chiêu Fearless Strike (E) lướt xuyên đội hình trừ tới 35-42% giáp của toàn bộ kẻ địch trúng đòn theo số điểm Heroic Charge, mở đường cho Hellion Jacket hút máu hủy diệt trong Small-Scale và Mists.',
    playstyleSummary_en:
      'Premier armor-shred bruiser for Small-Scale and Mists. Fearless Strike (E) dashes through enemy lines, stripping up to 35-42% armor based on Heroic Charges and setting up massive follow-up burst.',
    powerSpikes_vi: [
      '3 điểm Heroic Charge tăng 27% tốc chạy và tối đa hóa chỉ số trừ giáp của chiêu E.',
      'W Splitting Slash trói chân mục tiêu tới 2.2 giây từ cự ly 8m.',
      'Kết hợp hoàn hảo với Áo Hellion Jacket và Mũ Fiend Cowl (Xóa bùa đối thủ).',
    ],
    powerSpikes_en: [
      '3 Heroic Charges grant +27% movement speed and max out E armor shredding.',
      'Splitting Slash (W) roots targets for up to 2.2s from 8m range.',
      'Deadly synergy with Hellion Jacket sustain and Fiend Cowl purge.',
    ],
    combos: [
      {
        id: 'carving-combo-1',
        title_vi: 'Chuỗi Lướt Trừ Giáp Bão Tố (Triple Heroic Armor Shred)',
        title_en: 'Triple Heroic Armor Shred Chain',
        modeTag: 'Small-Scale Brawl',
        difficulty: 'Medium',
        sequence: ['slotQ', 'slotQ', 'slotQ', 'slotW', 'slotE', 'slotArmor'],
        steps: [
          {
            slot: 'slotQ',
            slotLabel: 'Q (x3)',
            spellIcon: 'Heroic Strike',
            spellName_vi: 'Tích 3 Heroic Charge',
            spellName_en: '3x Heroic Charge',
            note_vi: 'Nhận +27% tốc chạy & chuẩn bị E',
            note_en: '+27% move speed & prime E',
          },
          {
            slot: 'slotW',
            slotLabel: 'W',
            spellIcon: 'Splitting Slash',
            spellName_vi: 'Trảm Phân Đôi',
            spellName_en: 'Splitting Slash',
            note_vi: 'Trói chân đối thủ 2.2 giây',
            note_en: 'Roots target for 2.2s',
          },
          {
            slot: 'slotE',
            slotLabel: 'E',
            spellIcon: 'ITEM:T8_2H_CLEAVER_HELL',
            spellName_vi: 'Fearless Strike (Trừ Giáp)',
            spellName_en: 'Fearless Strike (Shred)',
            note_vi: 'Lướt xuyên trừ 38% giáp toàn bộ mục tiêu',
            note_en: 'Dash piercing & stripping 38% armor',
          },
          {
            slot: 'slotArmor',
            slotLabel: 'R (Áo)',
            spellIcon: 'Life Steal Aura',
            spellName_vi: 'Áo Hellion Jacket',
            spellName_en: 'Hellion Jacket Lifesteal',
            note_vi: 'Bật vòng hút máu tối đa trên kẻ địch bị trừ giáp',
            note_en: 'Maximized lifesteal against shredded targets',
          },
        ],
        description_vi:
          'Giữ 3 điểm Heroic để lấy tốc độ chạy áp sát. Tung W trói chân giữ cứng mục tiêu, sau đó lướt E xuyên qua để bóc sạch lớp giáp của địch, mở vòng Hellion Jacket hút máu hồi lại đầy cây máu!',
        description_en:
          'Maintain 3 Heroic charges for mobility. Root with Splitting Slash (W), pierce through with Fearless Strike (E) to strip armor, then trigger Hellion Jacket aura to drain massive HP.',
      },
    ],
    matchups: {
      goodAgainst: [
        GLOBAL_OPPONENT_COUNTER_DB[11], // Great Frost Staff
        GLOBAL_OPPONENT_COUNTER_DB[6], // Battleaxe
        GLOBAL_OPPONENT_COUNTER_DB[5], // Regular Bow
      ],
      weakAgainst: [
        GLOBAL_OPPONENT_COUNTER_DB[3], // 1H Cursed Staff
        GLOBAL_OPPONENT_COUNTER_DB[1], // Deathgivers
        GLOBAL_OPPONENT_COUNTER_DB[7], // Battle Bracers
      ],
      allMatchups: GLOBAL_OPPONENT_COUNTER_DB,
    },
    communityTips: [
      {
        id: 'tip-carving-1',
        weaponIdentifier: '2H_CLEAVER_HELL',
        author: 'Avalon_Swordsman',
        authorBadge_vi: 'Chỉ Huy Small-Scale',
        authorBadge_en: 'Small-Scale Shotcaller',
        content_vi:
          'Luôn chém quái ven đường để giữ ít nhất 1-2 điểm Heroic Charge trên người khi đang đi tuần tra. Tốc độ di chuyển tăng thêm giúp bạn không bao giờ bị đối thủ bắt lẻ.',
        content_en:
          'Keep 1-2 Heroic Charges rolling off camp mobs while roaming. The persistent movement speed boost prevents anyone from catching you off-guard.',
        upvotes: 167,
        downvotes: 3,
        patchVersion: 'v1.26 (Horizon)',
        isOutdated: false,
        createdAt: '3 ngày trước',
      },
    ],
  },

  // ==========================================================================
  // 7. DUAL SWORDS (2H_DUALSWORD)
  // ==========================================================================
  '2H_DUALSWORD': {
    id: 'playbook-dual-swords',
    weaponFamily: 'sword',
    baseIdentifier: '2H_DUALSWORD',
    weaponName_vi: 'Song Kiếm Chiến Binh (Dual Swords)',
    weaponName_en: 'Dual Swords',
    playstyleSummary_vi:
      'Cỗ máy chém cận chiến bão táp. Chiêu Spinning Blades (E) nhảy bổ vào mục tiêu hoàn toàn miễn nhiễm khống chế (Unstoppable), gây sát thương diện rộng kèm sát thương theo % máu tối đa của đối thủ và tăng mạnh tốc đánh.',
    playstyleSummary_en:
      'High-tempo melee skirmisher. Spinning Blades (E) delivers an unstoppable aerial leap dealing AoE damage scaling with target max HP while granting enormous attack speed buffs.',
    powerSpikes_vi: [
      'Cú nhảy E hoàn toàn không thể bị ngắt (Unstoppable), có thể dùng để nhảy vượt qua tường mỏng hoặc thoát khỏi các vòng khống chế diện rộng.',
      'Kỹ năng W Iron Will cho phép tăng tốc và miễn nhiễm 100% hiệu ứng Xóa Bùa (Purge Immunity).',
      'Tốc đánh cực cao kết hợp với Áo Mercenary Jacket hồi máu thần tốc.',
    ],
    powerSpikes_en: [
      'Spinning Blades (E) is completely unstoppable and can hop over narrow terrain cliffs or CC fields.',
      'Iron Will (W) grants speed and complete Purge Immunity against enemy Cowls/Robes.',
      'Hyper-fast auto-attacks proc Mercenary Jacket heals in under a second.',
    ],
    combos: [
      {
        id: 'ds-combo-1',
        title_vi: 'Cú Nhảy Bão Kiếm Không Thể Cản Phá (Unstoppable Leap)',
        title_en: 'Unstoppable Spinning Blades Leap',
        modeTag: '1v1 Mists / Corrupted',
        difficulty: 'Easy',
        sequence: ['slotQ', 'slotQ', 'slotW', 'slotE', 'slotArmor', 'autoAttack'],
        steps: [
          {
            slot: 'slotQ',
            slotLabel: 'Q (x3)',
            spellIcon: 'Heroic Strike',
            spellName_vi: 'Tích 3 Heroic Charge',
            spellName_en: '3x Heroic Charge',
            note_vi: 'Gia tăng tốc độ đánh & sát thương E',
            note_en: 'Empowers attack speed & E',
          },
          {
            slot: 'slotW',
            slotLabel: 'W',
            spellIcon: 'Iron Will',
            spellName_vi: 'Ý Chí Sắt Đá (Iron Will)',
            spellName_en: 'Iron Will',
            note_vi: 'Miễn nhiễm bị Purge xóa bùa lợi',
            note_en: 'Grants Purge Immunity',
          },
          {
            slot: 'slotE',
            slotLabel: 'E',
            spellIcon: 'Spin Attack',
            spellName_vi: 'Spinning Blades',
            spellName_en: 'Spinning Blades',
            note_vi: 'Nhảy vồ miễn nhiễm khống chế + Đốt % máu',
            note_en: 'Unstoppable leap + % max HP damage',
          },
          {
            slot: 'slotArmor',
            slotLabel: 'R (Áo)',
            spellIcon: 'Bloodlust',
            spellName_vi: 'Áo Mercenary Jacket',
            spellName_en: 'Mercenary Jacket',
            note_vi: 'Chém thường siêu tốc hồi đầy máu tức thì',
            note_en: 'High attack speed procs instant full heal',
          },
        ],
        description_vi:
          'Tích 3 điểm Heroic rồi bấm W (Iron Will) để kẻ địch không thể dùng Purge xóa bùa. Nhảy E thẳng vào mục tiêu và bật Áo Mercenary Jacket chém thường liên tục để vừa gây sát thương khủng khiếp vừa hồi máu.',
        description_en:
          'Stack 3 charges, pop Iron Will (W) for purge immunity, leap in with Spinning Blades (E), and trigger Mercenary Jacket to shred the target while healing back to full.',
      },
    ],
    matchups: {
      goodAgainst: [
        GLOBAL_OPPONENT_COUNTER_DB[5], // Regular Bow
        GLOBAL_OPPONENT_COUNTER_DB[11], // Great Frost Staff
        GLOBAL_OPPONENT_COUNTER_DB[9], // 1H Fire Staff
      ],
      weakAgainst: [
        GLOBAL_OPPONENT_COUNTER_DB[6], // Battleaxe
        GLOBAL_OPPONENT_COUNTER_DB[0], // Bloodletter
        GLOBAL_OPPONENT_COUNTER_DB[3], // 1H Cursed Staff
      ],
      allMatchups: GLOBAL_OPPONENT_COUNTER_DB,
    },
    communityTips: [
      {
        id: 'tip-ds-1',
        weaponIdentifier: '2H_DUALSWORD',
        author: 'SwordSaint_VN',
        authorBadge_vi: 'Top 50 Corrupted Asia',
        authorBadge_en: 'Top 50 Corrupted Asia',
        content_vi:
          'Cú nhảy E (Spinning Blades) có thể dùng để nhảy qua các vách đá hoặc bờ hào trong Mists để thoát gank mà không cần mục tiêu kẻ địch!',
        content_en:
          'Spinning Blades (E) can be cast without a target to hop over cliff ledges and river choke points to escape ganks!',
        upvotes: 210,
        downvotes: 4,
        patchVersion: 'v1.26 (Horizon)',
        isOutdated: false,
        createdAt: '1 ngày trước',
      },
    ],
  },

  // ==========================================================================
  // 8. REGULAR BOW (2H_BOW)
  // ==========================================================================
  '2H_BOW': {
    id: 'playbook-regular-bow',
    weaponFamily: 'bow',
    baseIdentifier: '2H_BOW',
    weaponName_vi: 'Cung Thường (Regular Bow)',
    weaponName_en: 'Regular Bow',
    playstyleSummary_vi:
      'Cỗ máy xả tên thả diều tầm xa tối thượng (Hyper-DPS Kiting Machine). Toàn bộ sức mạnh nằm ở Tuyệt kỹ Enchanted Quiver (E) nạp 6 mũi tên ma thuật cường hóa, tăng tốc bắn lên mức tối đa và trừ dồn dập giáp của mục tiêu từ tầm xa 12-13m.',
    playstyleSummary_en:
      'Premier ranged kiting machine. All power concentrates into Enchanted Quiver (E), loading 6 empowered magic arrows that grant max attack speed and shred enemy resistances from 12-13m safety.',
    powerSpikes_vi: [
      '6 mũi tên Enchanted Quiver (E) tăng hơn 200% tốc độ bắn và mỗi đòn đánh trừ tích lũy chỉ số kháng của mục tiêu.',
      'W Frost Shot (Bắn Băng Thối Lui) cho một cú nhảy lùi 9m làm chậm kẻ địch, giữ cự ly hoàn hảo.',
      'Kết hợp với Mũ Hunter Hood (Phản Đòn) hoặc Áo Cleric Robe để tự bảo vệ khi bị sát thủ áp sát.',
    ],
    powerSpikes_en: [
      '6 Enchanted Quiver arrows grant 200%+ attack speed and cumulative resistance shred.',
      'Frost Shot (W) launches you 9m backward while slowing pursuers.',
      'Synergizes with Hunter Hood (Retaliate) and Cleric Robe to survive melee dives.',
    ],
    combos: [
      {
        id: 'bow-combo-1',
        title_vi: 'Chuỗi Bắn Tỉa Thả Diều Bão Tên (Enchanted Quiver Gatling)',
        title_en: 'Enchanted Quiver Gatling Kite',
        modeTag: '1v1 Mists / Corrupted',
        difficulty: 'Medium',
        sequence: ['slotW', 'slotE', 'slotQ', 'autoAttack', 'slotHead'],
        steps: [
          {
            slot: 'slotW',
            slotLabel: 'W',
            spellIcon: 'Frost Shot',
            spellName_vi: 'Phát Bắn Băng Lùi (Frost Shot)',
            spellName_en: 'Frost Shot',
            note_vi: 'Nhảy lùi 9m & làm chậm kẻ địch 40%',
            note_en: 'Knocks back 9m & slows 40%',
          },
          {
            slot: 'slotE',
            slotLabel: 'E',
            spellIcon: 'ITEM:T8_2H_BOW',
            spellName_vi: 'Enchanted Quiver',
            spellName_en: 'Enchanted Quiver',
            note_vi: 'Nạp 6 mũi tên cường hóa tốc đánh',
            note_en: 'Loads 6 empowered arrows',
          },
          {
            slot: 'slotQ',
            slotLabel: 'Q',
            spellIcon: 'Poisoned Arrow',
            spellName_vi: 'Tên Độc (Poisoned Arrow)',
            spellName_en: 'Poisoned Arrow',
            note_vi: 'Đốt máu liên tục không ngừng',
            note_en: 'Applies stacking DoT burn',
          },
          {
            slot: 'autoAttack',
            slotLabel: 'AA (x6)',
            spellIcon: 'ITEM:T8_2H_BOW',
            spellName_vi: 'Xả 6 Mũi Tên E',
            spellName_en: 'Fire 6 Empowered Arrows',
            note_vi: 'Bắn liên thanh xé nát thanh máu',
            note_en: 'Machine-gun down the target',
          },
          {
            slot: 'slotHead',
            slotLabel: 'D (Mũ)',
            spellIcon: 'Retaliate',
            spellName_vi: 'Mũ Hunter Hood',
            spellName_en: 'Hunter Hood',
            note_vi: 'Phản đòn nếu đối thủ cố gắng áp sát',
            note_en: 'Reflects burst if target dives in',
          },
        ],
        description_vi:
          'Khi đối phương lao vào, dùng W Frost Shot nhảy lùi ra xa làm chậm đối thủ, bật E nạp tên và xả liên thanh 6 mũi tên cường hóa. Nếu đối phương bật giày áp sát, bật ngay Hunter Hood phản đòn!',
        description_en:
          'When the enemy dives, leap back with Frost Shot (W), trigger Enchanted Quiver (E), and machine-gun the target from max range. Pop Hunter Hood if they sprint in with burst.',
      },
    ],
    matchups: {
      goodAgainst: [
        GLOBAL_OPPONENT_COUNTER_DB[6], // Battleaxe
        GLOBAL_OPPONENT_COUNTER_DB[2], // Dual Swords
        GLOBAL_OPPONENT_COUNTER_DB[7], // Battle Bracers
      ],
      weakAgainst: [
        GLOBAL_OPPONENT_COUNTER_DB[0], // Bloodletter
        GLOBAL_OPPONENT_COUNTER_DB[1], // Deathgivers
        GLOBAL_OPPONENT_COUNTER_DB[9], // 1H Fire Staff
      ],
      allMatchups: GLOBAL_OPPONENT_COUNTER_DB,
    },
    communityTips: [
      {
        id: 'tip-bow-1',
        weaponIdentifier: '2H_BOW',
        author: 'RobinHood_Albion',
        authorBadge_vi: 'Chuyên gia Cung T8',
        authorBadge_en: 'T8 Bow Specialist',
        content_vi:
          'Gặp kẻ địch mặc áo Purge (Mage Robe) hoặc đội mũ Fiend Cowl, tuyệt đối ĐỪNG bấm E ngay từ đầu! Hãy bắn cấu rỉa bằng Q và bắn thường, ép hắn bấm xóa bùa trước rồi mới bật E xả trọn vẹn 6 mũi tên.',
        content_en:
          'Against Purge users (Fiend Cowl / Mage Robe), bait out their purge with regular Q and auto-attacks before activating Enchanted Quiver!',
        upvotes: 182,
        downvotes: 3,
        patchVersion: 'v1.26 (Horizon)',
        isOutdated: false,
        createdAt: '2 ngày trước',
      },
    ],
  },

  // ==========================================================================
  // 9. 1H CURSED STAFF (MAIN_CURSEDSTAFF)
  // ==========================================================================
  MAIN_CURSEDSTAFF: {
    id: 'playbook-cursed-staff',
    weaponFamily: 'cursed_staff',
    baseIdentifier: 'MAIN_CURSEDSTAFF',
    weaponName_vi: 'Gậy Nguyền Rủa 1 Tay (1H Cursed Staff)',
    weaponName_en: '1H Cursed Staff',
    playstyleSummary_vi:
      'Tử thần gieo rắc nguyền rủa (DoT & Delayed Bomb Executioner). Kỹ năng Death Curse (E) gắn một quả bom tử thần hẹn giờ 5 giây, sát thương phát nổ nhân theo số lượng cộng dồn Vile Curse Q trên người nạn nhân, có thể nổ bay hơn 1500 máu chuẩn.',
    playstyleSummary_en:
      'The ticking time-bomb executioner. Death Curse (E) plants a 5-second delayed bomb whose detonation scales massively with active Vile Curse (Q) stacks, routinely dealing 1500+ unmitigated burst damage.',
    powerSpikes_vi: [
      'Đủ 4 cộng dồn Vile Curse trên người mục tiêu giúp cú nổ E đạt sát thương cực đại.',
      'W Armor Piercer trừ thẳng chỉ số phòng ngự của mục tiêu trước khi quả bom nổ.',
      'Kết hợp với Sừng Mistcaller hoặc Sọ Cryptcandle ở tay phụ tăng sát thương phép đột biến.',
    ],
    powerSpikes_en: [
      '4 Vile Curse stacks maximize the Death Curse (E) explosion multiplier.',
      'Armor Piercer (W) tears down enemy resistances right before the bomb detonates.',
      'Mistcaller or Cryptcandle off-hand pushes spell damage to lethal thresholds.',
    ],
    combos: [
      {
        id: 'curse-combo-1',
        title_vi: 'Bom Hẹn Giờ Tử Thần (4x Curse Detonation Nuke)',
        title_en: '4x Curse Detonation Bomb Nuke',
        modeTag: '1v1 Mists / Corrupted',
        difficulty: 'Medium',
        sequence: ['slotQ', 'slotQ', 'slotQ', 'slotQ', 'slotW', 'slotE', 'slotShoes'],
        steps: [
          {
            slot: 'slotQ',
            slotLabel: 'Q (x4)',
            spellIcon: 'Vile Curse',
            spellName_vi: 'Nguyền Rủa Độc Tố (4 Stacks)',
            spellName_en: '4x Vile Curse',
            note_vi: 'Tích đủ 4 cộng dồn nguyền rủa tối đa',
            note_en: 'Stack to max 4 curse charges',
          },
          {
            slot: 'slotW',
            slotLabel: 'W',
            spellIcon: 'Armor Piercer',
            spellName_vi: 'Xuyên Giáp (Armor Piercer)',
            spellName_en: 'Armor Piercer',
            note_vi: 'Trừ giáp mục tiêu từ xa',
            note_en: 'Shreds magic resistance',
          },
          {
            slot: 'slotE',
            slotLabel: 'E',
            spellIcon: 'ITEM:T8_MAIN_CURSEDSTAFF',
            spellName_vi: 'Death Curse (Gắn Bom)',
            spellName_en: 'Death Curse (Bomb)',
            note_vi: 'Gắn bom tử thần đếm lùi 5 giây',
            note_en: 'Plants 5-second ticking bomb',
          },
          {
            slot: 'slotShoes',
            slotLabel: 'F (Giày)',
            spellIcon: 'Refreshing Sprint',
            spellName_vi: 'Giày Lùi Câu Giờ',
            spellName_en: 'Kite & Delay',
            note_vi: 'Giữ cự ly chờ giây thứ 5 bom nổ kết liễu',
            note_en: 'Kite while waiting for second 5 detonation',
          },
        ],
        description_vi:
          'Tích đủ 4 điểm Vile Curse (Q), bắn W xuyên giáp rồi gắn quả bom Death Curse (E). Sau đó chỉ việc chạy lùi thả diều câu giờ trong 5 giây để quả bom phát nổ kết liễu nạn nhân!',
        description_en:
          'Stack 4 Vile Curses, cast Armor Piercer (W), and plant Death Curse (E). Kite out for 5 seconds as the bomb ticks down to an unstoppable detonation.',
      },
    ],
    matchups: {
      goodAgainst: [
        GLOBAL_OPPONENT_COUNTER_DB[6], // Battleaxe
        GLOBAL_OPPONENT_COUNTER_DB[2], // Dual Swords
        GLOBAL_OPPONENT_COUNTER_DB[4], // Carving Sword
        GLOBAL_OPPONENT_COUNTER_DB[8], // Druidic Staff
      ],
      weakAgainst: [
        GLOBAL_OPPONENT_COUNTER_DB[0], // Light Crossbow
        GLOBAL_OPPONENT_COUNTER_DB[0], // Bloodletter
        GLOBAL_OPPONENT_COUNTER_DB[1], // Deathgivers
      ],
      allMatchups: GLOBAL_OPPONENT_COUNTER_DB,
    },
    communityTips: [
      {
        id: 'tip-curse-1',
        weaponIdentifier: 'MAIN_CURSEDSTAFF',
        author: 'DoomBringer_VN',
        authorBadge_vi: 'Chuyên Gia Cursed Staff',
        authorBadge_en: 'Cursed Staff Specialist',
        content_vi:
          'Nếu đối phương có Cleric Robe, họ sẽ bấm bất tử vào giây thứ 4 của bom E. Hãy dùng kỹ năng câm lặng (Silence) hoặc làm choáng ở giây thứ 3.8 để khóa tay không cho họ kịp bấm nút bảo mệnh!',
        content_en:
          'Opponents with Cleric Robe will try to invuln on second 4 of your E. Time a silence or knockback at second 3.8 to lock their keys before the bomb goes off!',
        upvotes: 215,
        downvotes: 4,
        patchVersion: 'v1.26 (Horizon)',
        isOutdated: false,
        createdAt: '1 ngày trước',
      },
    ],
  },

  // ==========================================================================
  // 10. DRUIDIC STAFF (MAIN_NATURESTAFF_KEEPER)
  // ==========================================================================
  MAIN_NATURESTAFF_KEEPER: {
    id: 'playbook-druidic-staff',
    weaponFamily: 'nature_staff',
    baseIdentifier: 'MAIN_NATURESTAFF_KEEPER',
    weaponName_vi: 'Gậy Rừng Tự Nhiên (Druidic Staff)',
    weaponName_en: 'Druidic Staff',
    playstyleSummary_vi:
      'Chúa tể sinh tồn và hồi phục bất tận (Endless Sustain & Healing Kiter). Chiêu Spiritual Seed (E) ươm một hạt mầm sinh mệnh lên bản thân hoặc đồng đội, sau 3 giây sẽ bung nở một lượng hồi máu khổng lồ giúp bạn gần như bất tử trong các trận chiến kéo dài.',
    playstyleSummary_en:
      'The undying master of attrition. Spiritual Seed (E) plants an essence seed on you or an ally, blooming after 3 seconds for a colossal burst heal that makes you near-immortal in long skirmishes.',
    powerSpikes_vi: [
      'Duy trì liên tục 3 cộng dồn Rejuvenation (Q) giúp hồi máu theo thời gian và tăng kháng sát thương.',
      'Spiritual Seed (E) có thời gian hồi chiêu chỉ 15 giây, bung nở hồi lại 40-50% lượng máu đã mất.',
      'Kỹ năng W Bramble Seed (Hạt Gai) hất tung và gây sát thương diện rộng để đẩy lùi kẻ địch cận chiến.',
    ],
    powerSpikes_en: [
      'Maintaining 3 Rejuvenation (Q) charges provides persistent HoT and defense buffs.',
      'Spiritual Seed (E) on a 15s cooldown blooms for 40-50% missing HP recovery.',
      'Bramble Seed (W) provides knockup CC and AoE zoning against melee pursuers.',
    ],
    combos: [
      {
        id: 'druid-combo-1',
        title_vi: 'Vòng Lặp Hồi Máu Bất Tử (Infinite Sustain Loop)',
        title_en: 'Infinite Sustain Healing Loop',
        modeTag: '1v1 Mists / Corrupted',
        difficulty: 'Easy',
        sequence: ['slotQ', 'slotQ', 'slotQ', 'slotE', 'slotW'],
        steps: [
          {
            slot: 'slotQ',
            slotLabel: 'Q (x3)',
            spellIcon: 'Rejuvenation',
            spellName_vi: 'Tích 3 HoT Hồi Máu',
            spellName_en: '3x Rejuvenation HoT',
            note_vi: 'Giữ bùa hồi máu liên tục trên người',
            note_en: 'Keep 3 rolling HoTs active',
          },
          {
            slot: 'slotE',
            slotLabel: 'E',
            spellIcon: 'ITEM:T8_MAIN_NATURESTAFF_KEEPER',
            spellName_vi: 'Spiritual Seed (Ươm Mầm)',
            spellName_en: 'Spiritual Seed',
            note_vi: 'Ươm mầm hồi máu khổng lồ sau 3s',
            note_en: 'Plants 3s massive burst heal seed',
          },
          {
            slot: 'slotW',
            slotLabel: 'W',
            spellIcon: 'Bramble Seed',
            spellName_vi: 'Hạt Gai Hất Tung (Bramble Seed)',
            spellName_en: 'Bramble Seed',
            note_vi: 'Hất tung kẻ địch cố gắng áp sát',
            note_en: 'Knocks up & zones pursuers',
          },
        ],
        description_vi:
          'Luôn duy trì 3 điểm Q Rejuvenation. Khi máu tụt xuống 60%, ươm mầm E lên bản thân và tung W hạt gai hất tung đối thủ, chờ 3 giây để hạt mầm nở kéo đầy thanh máu.',
        description_en:
          'Keep 3x Q active. Drop to 60% HP, plant Spiritual Seed (E) on yourself, toss Bramble Seed (W) to disrupt the enemy, and let the bloom bring you back to full.',
      },
    ],
    matchups: {
      goodAgainst: [
        GLOBAL_OPPONENT_COUNTER_DB[6], // Battleaxe
        GLOBAL_OPPONENT_COUNTER_DB[4], // Carving Sword
        GLOBAL_OPPONENT_COUNTER_DB[11], // Great Frost Staff
      ],
      weakAgainst: [
        GLOBAL_OPPONENT_COUNTER_DB[3], // 1H Cursed Staff
        GLOBAL_OPPONENT_COUNTER_DB[0], // Bloodletter
        GLOBAL_OPPONENT_COUNTER_DB[7], // Battle Bracers
      ],
      allMatchups: GLOBAL_OPPONENT_COUNTER_DB,
    },
    communityTips: [
      {
        id: 'tip-druid-1',
        weaponIdentifier: 'MAIN_NATURESTAFF_KEEPER',
        author: 'ForestHealer_VN',
        authorBadge_vi: 'Chiến Y Tự Nhiên T8',
        authorBadge_en: 'T8 Nature Medic',
        content_vi:
          'Bấm Alt + Q (hoặc phím tự niệm lên bản thân) mỗi 4.5 giây để làm mới thời gian tồn tại của cả 3 điểm Q mà không phải tích lại từ đầu!',
        content_en:
          'Self-cast Q every 4.5s to refresh the duration of all 3 Rejuvenation stacks without having to rebuild them from scratch!',
        upvotes: 195,
        downvotes: 2,
        patchVersion: 'v1.26 (Horizon)',
        isOutdated: false,
        createdAt: '2 ngày trước',
      },
    ],
  },

  // ==========================================================================
  // 11. BATTLE BRACERS (2H_GLOVES_SET1)
  // ==========================================================================
  '2H_GLOVES_SET1': {
    id: 'playbook-battle-bracers',
    weaponFamily: 'war_gloves',
    baseIdentifier: '2H_GLOVES_SET1',
    weaponName_vi: 'Bao Tay Chiến Binh (Battle Bracers)',
    weaponName_en: 'Battle Bracers',
    playstyleSummary_vi:
      'Đấu sĩ quyền cước siêu cơ động và dồn khống chế diện rộng. Tuyệt kỹ Falcon Smash (E) nhảy vọt lên không trung hoàn toàn miễn nhiễm khống chế, sau đó nện thẳng xuống đất gây sát thương bùng nổ và hất tung nhiều kẻ địch.',
    playstyleSummary_en:
      'Hyper-mobile martial arts brawler with AoE shockwave control. Falcon Smash (E) soars into the sky completely immune to CC, crashing down to deliver devastating burst damage and knockup in a wide radius.',
    powerSpikes_vi: [
      'Falcon Smash (E) bay trên không miễn nhiễm toàn bộ khống chế và có thể vượt qua mọi địa hình đồi núi trong Mists.',
      'Q Dragon Leap lướt 2 nhịp liên tục gây sát thương và cơ động cực cao.',
      'W Triple Kick đá choáng liên hoàn dồn ép đối thủ vào góc tường.',
    ],
    powerSpikes_en: [
      'Falcon Smash (E) is airborne CC-immune and crosses any cliff terrain in Mists.',
      'Dragon Leap (Q) double-dashes for insane pressure and agility.',
      'Triple Kick (W) locks foes in a chained stun against obstacle walls.',
    ],
    combos: [
      {
        id: 'gloves-combo-1',
        title_vi: 'Cú Đấm Chim Ưng Huỷ Diệt (Falcon Smash Aerial Slam)',
        title_en: 'Falcon Smash Aerial Slam Finisher',
        modeTag: '1v1 Mists / Corrupted',
        difficulty: 'Medium',
        sequence: ['slotQ', 'slotW', 'slotE', 'slotHead', 'slotQ'],
        steps: [
          {
            slot: 'slotQ',
            slotLabel: 'Q',
            spellIcon: 'Dragon Leap',
            spellName_vi: 'Lướt Rồng Bay (Dragon Leap)',
            spellName_en: 'Dragon Leap',
            note_vi: 'Lướt 2 nhịp áp sát mục tiêu',
            note_en: 'Double-dash gap closer',
          },
          {
            slot: 'slotW',
            slotLabel: 'W',
            spellIcon: 'Triple Kick',
            spellName_vi: 'Tam Cước Liên Hoàn (Triple Kick)',
            spellName_en: 'Triple Kick',
            note_vi: 'Đá choáng khóa cứng đối thủ',
            note_en: 'Stuns & locks the target',
          },
          {
            slot: 'slotE',
            slotLabel: 'E',
            spellIcon: 'ITEM:T8_2H_GLOVES_SET1',
            spellName_vi: 'Falcon Smash (Nhảy Nện)',
            spellName_en: 'Falcon Smash Slam',
            note_vi: 'Bay lên trời nện xuống gây sát thương cực đại',
            note_en: 'Airborne slam dealing massive burst',
          },
          {
            slot: 'slotHead',
            slotLabel: 'D (Mũ)',
            spellIcon: 'Mortal Agony',
            spellName_vi: 'Mũ Stalker Hood',
            spellName_en: 'Stalker Hood',
            note_vi: 'Trừ giáp kết liễu mục tiêu thấp máu',
            note_en: 'Armor shred finisher',
          },
        ],
        description_vi:
          'Áp sát bằng Q Dragon Leap, đá choáng W giữ chân rồi lập tức tung Falcon Smash (E) nhảy lên trời nện xuống gây sát thương khổng lồ. Kẻ địch không thể ngắt chiêu E của bạn khi đang bay trên không.',
        description_en:
          'Close gap with Dragon Leap (Q), lock down with Triple Kick (W), and crash down with Falcon Smash (E). Opponents cannot interrupt your airborne trajectory.',
      },
    ],
    matchups: {
      goodAgainst: [
        GLOBAL_OPPONENT_COUNTER_DB[0], // Bloodletter
        GLOBAL_OPPONENT_COUNTER_DB[1], // Deathgivers
        GLOBAL_OPPONENT_COUNTER_DB[5], // Regular Bow
        GLOBAL_OPPONENT_COUNTER_DB[0], // Light Crossbow
      ],
      weakAgainst: [
        GLOBAL_OPPONENT_COUNTER_DB[6], // Battleaxe
        GLOBAL_OPPONENT_COUNTER_DB[3], // 1H Cursed Staff
        GLOBAL_OPPONENT_COUNTER_DB[9], // 1H Fire Staff
      ],
      allMatchups: GLOBAL_OPPONENT_COUNTER_DB,
    },
    communityTips: [
      {
        id: 'tip-gloves-1',
        weaponIdentifier: '2H_GLOVES_SET1',
        author: 'FistOfFury_VN',
        authorBadge_vi: 'Cao Thủ Quyền Cước',
        authorBadge_en: 'Brawler Master',
        content_vi:
          'Falcon Smash (E) có thể dùng để nhảy vượt qua khe suối hoặc gờ tường trong Mists. Đây là vũ khí đào thoát và truy đuổi số 1 dành cho người chơi thích phong cách lả lướt!',
        content_en:
          'Falcon Smash can jump over rivers, cliffs, and obstacles in Mists. It is the premier outplay mobility tool for aggressive solo players!',
        upvotes: 184,
        downvotes: 3,
        patchVersion: 'v1.26 (Horizon)',
        isOutdated: false,
        createdAt: '1 ngày trước',
      },
    ],
  },

  // ==========================================================================
  // 12. 1H FIRE STAFF (MAIN_FIRESTAFF)
  // ==========================================================================
  MAIN_FIRESTAFF: {
    id: 'playbook-fire-staff',
    weaponFamily: 'fire_staff',
    baseIdentifier: 'MAIN_FIRESTAFF',
    weaponName_vi: 'Gậy Lửa 1 Tay (1H Fire Staff)',
    weaponName_en: '1H Fire Staff',
    playstyleSummary_vi:
      'Pháp sư hỏa ngục sát thương bùng nổ tầm xa (Nuclear Single-Target Burst). Tuyệt kỹ Pyroblast (E) ngưng tụ một quả cầu lửa hạt nhân khổng lồ bắn thẳng vào kẻ địch, gây hơn 1200 sát thương tức thì kèm hiệu ứng thiêu đốt thiêu rụi mục tiêu.',
    playstyleSummary_en:
      'Nuclear single-target fire mage. Pyroblast (E) channels a titanic fireball projectile that obliterates up to 60% of an enemy’s health bar in one catastrophic blast.',
    powerSpikes_vi: [
      'Chiêu Pyroblast (E) có sát thương đơn mục tiêu cao bậc nhất trong các dòng gậy phép.',
      'W Wall of Flames (Tường Lửa) chặn đứng 100% mọi đối thủ cận chiến lao vào, gây hiệu ứng sợ hãi (Fear) trong 4 giây.',
      'Kết hợp với Sọ Cryptcandle và Áo Druid Robe tối đa hóa sát thương phép lên đỉnh điểm.',
    ],
    powerSpikes_en: [
      'Pyroblast (E) boasts unmatched single-target magic burst.',
      'Wall of Flames (W) completely repels melee dives with a 4s fear zoning wall.',
      'Cryptcandle and Druid Robe synergy pushes magical output to one-shot levels.',
    ],
    combos: [
      {
        id: 'fire-combo-1',
        title_vi: 'Tường Lửa Bắn Cầu Lửa Hạt Nhân (Wall of Flames into Pyroblast)',
        title_en: 'Wall of Flames into Pyroblast One-Shot',
        modeTag: '1v1 Mists / Corrupted',
        difficulty: 'Medium',
        sequence: ['slotW', 'slotQ', 'slotE', 'slotArmor'],
        steps: [
          {
            slot: 'slotW',
            slotLabel: 'W',
            spellIcon: 'Wall of Flames',
            spellName_vi: 'Tường Lửa (Wall of Flames)',
            spellName_en: 'Wall of Flames',
            note_vi: 'Chặn đứng đối thủ & gây hoảng loạn',
            note_en: 'Blocks dives & fears enemies',
          },
          {
            slot: 'slotQ',
            slotLabel: 'Q',
            spellIcon: 'Fire Bolt',
            spellName_vi: 'Tên Lửa Đốt Máu (Fire Bolt)',
            spellName_en: 'Fire Bolt',
            note_vi: 'Đốt máu & tích cộng dồn nội tại phép',
            note_en: 'Applies burning stacks',
          },
          {
            slot: 'slotE',
            slotLabel: 'E',
            spellIcon: 'ITEM:T8_MAIN_FIRESTAFF',
            spellName_vi: 'Pyroblast (Cầu Lửa Hạt Nhân)',
            spellName_en: 'Pyroblast Nuclear Ball',
            note_vi: 'Bắn cầu lửa nổ 1200+ sát thương',
            note_en: 'Fires massive 1200+ burst projectile',
          },
          {
            slot: 'slotArmor',
            slotLabel: 'R (Áo)',
            spellIcon: 'Everlasting Spirit',
            spellName_vi: 'Áo Cleric Robe',
            spellName_en: 'Cleric Robe Shield',
            note_vi: 'Bật khiên bất tử bảo vệ khi đứng gồng chiêu',
            note_en: 'Invulnerability shield while channeling',
          },
        ],
        description_vi:
          'Khi kẻ địch áp sát, dựng W Wall of Flames ngay trước mặt để đẩy lùi và làm hoảng loạn đối phương. Khi chúng bị kẹt phía bên kia tường lửa, thoải mái gồng Pyroblast (E) bắn cầu lửa hạt nhân nổ thẳng mặt!',
        description_en:
          'Drop Wall of Flames (W) when rushed to fear and zone the enemy. While they are trapped, channel Pyroblast (E) for an unblockable nuclear strike.',
      },
    ],
    matchups: {
      goodAgainst: [
        GLOBAL_OPPONENT_COUNTER_DB[6], // Battleaxe
        GLOBAL_OPPONENT_COUNTER_DB[5], // Regular Bow
        GLOBAL_OPPONENT_COUNTER_DB[11], // Great Frost Staff
      ],
      weakAgainst: [
        GLOBAL_OPPONENT_COUNTER_DB[0], // Bloodletter
        GLOBAL_OPPONENT_COUNTER_DB[0], // Light Crossbow
        GLOBAL_OPPONENT_COUNTER_DB[3], // 1H Cursed Staff
      ],
      allMatchups: GLOBAL_OPPONENT_COUNTER_DB,
    },
    communityTips: [
      {
        id: 'tip-fire-1',
        weaponIdentifier: 'MAIN_FIRESTAFF',
        author: 'InfernoLord_VN',
        authorBadge_vi: 'Pháp Sư Lửa T8',
        authorBadge_en: 'T8 Pyromancer',
        content_vi:
          'Tường Lửa (Wall of Flames) có thể ngắt các chiêu lướt của đối thủ như Fearless Strike của Carving Sword hay Dragon Leap của War Gloves nếu bạn đặt đúng đường di chuyển của họ!',
        content_en:
          'Wall of Flames completely interrupts dashes like Carving’s Fearless Strike or Glove leaps if placed directly in their path!',
        upvotes: 210,
        downvotes: 3,
        patchVersion: 'v1.26 (Horizon)',
        isOutdated: false,
        createdAt: '1 ngày trước',
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

  // Map to curated playbook based on family keywords
  if (cleanBase.includes('CROSSBOW')) {
    return {
      ...WEAPON_PLAYBOOKS_DB.MAIN_1HCROSSBOW,
      baseIdentifier: cleanBase,
      weaponName_vi: name_vi,
      weaponName_en: name_en,
    };
  }
  if (cleanBase.includes('SCYTHE_CRYSTAL') || cleanBase.includes('HALBERD')) {
    return {
      ...WEAPON_PLAYBOOKS_DB['2H_SCYTHE_CRYSTAL'],
      baseIdentifier: cleanBase,
      weaponName_vi: name_vi,
      weaponName_en: name_en,
    };
  }
  if (cleanBase.includes('AXE')) {
    return {
      ...WEAPON_PLAYBOOKS_DB.MAIN_AXE,
      baseIdentifier: cleanBase,
      weaponName_vi: name_vi,
      weaponName_en: name_en,
    };
  }
  if (cleanBase.includes('DUALDAGGER_HELL') || cleanBase.includes('DEATHGIVER')) {
    return {
      ...WEAPON_PLAYBOOKS_DB['2H_DUALDAGGER_HELL'],
      baseIdentifier: cleanBase,
      weaponName_vi: name_vi,
      weaponName_en: name_en,
    };
  }
  if (cleanBase.includes('DAGGER') || cleanBase.includes('RAPIER') || cleanBase.includes('CLAW')) {
    return {
      ...WEAPON_PLAYBOOKS_DB.MAIN_DAGGER,
      baseIdentifier: cleanBase,
      weaponName_vi: name_vi,
      weaponName_en: name_en,
    };
  }
  if (cleanBase.includes('CLEAVER_HELL') || cleanBase.includes('CARVING')) {
    return {
      ...WEAPON_PLAYBOOKS_DB['2H_CLEAVER_HELL'],
      baseIdentifier: cleanBase,
      weaponName_vi: name_vi,
      weaponName_en: name_en,
    };
  }
  if (cleanBase.includes('SWORD') || cleanBase.includes('CLAYMORE')) {
    return {
      ...WEAPON_PLAYBOOKS_DB['2H_DUALSWORD'],
      baseIdentifier: cleanBase,
      weaponName_vi: name_vi,
      weaponName_en: name_en,
    };
  }
  if (cleanBase.includes('BOW')) {
    return {
      ...WEAPON_PLAYBOOKS_DB['2H_BOW'],
      baseIdentifier: cleanBase,
      weaponName_vi: name_vi,
      weaponName_en: name_en,
    };
  }
  if (cleanBase.includes('CURSED')) {
    return {
      ...WEAPON_PLAYBOOKS_DB.MAIN_CURSEDSTAFF,
      baseIdentifier: cleanBase,
      weaponName_vi: name_vi,
      weaponName_en: name_en,
    };
  }
  if (cleanBase.includes('NATURE') || cleanBase.includes('WILD')) {
    return {
      ...WEAPON_PLAYBOOKS_DB.MAIN_NATURESTAFF_KEEPER,
      baseIdentifier: cleanBase,
      weaponName_vi: name_vi,
      weaponName_en: name_en,
    };
  }
  if (cleanBase.includes('GLOVE') || cleanBase.includes('BRACER')) {
    return {
      ...WEAPON_PLAYBOOKS_DB['2H_GLOVES_SET1'],
      baseIdentifier: cleanBase,
      weaponName_vi: name_vi,
      weaponName_en: name_en,
    };
  }
  if (cleanBase.includes('FIRE') || cleanBase.includes('INFERNO')) {
    return {
      ...WEAPON_PLAYBOOKS_DB.MAIN_FIRESTAFF,
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

