export type AlbionTier = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type AlbionEnchantment = 0 | 1 | 2 | 3 | 4;

export type AlbionQuality = 1 | 2 | 3 | 4 | 5;

export type AlbionSlotType =
  | 'MainHand'
  | 'OffHand'
  | 'Head'
  | 'Armor'
  | 'Shoes'
  | 'Bag'
  | 'Cape'
  | 'Mount'
  | 'Potion'
  | 'Food';

export type AlbionHandedness = '1H' | '2H' | 'OFFHAND' | 'NONE';

export type AlbionZoneType = 'SAFE' | 'YELLOW' | 'LETHAL' | 'AVALON';

export type SpellSlotKey = 'Q' | 'W' | 'E' | 'PASSIVE';

export type ArmoryFilterCategory =
  | 'ALL'
  | 'RANGED'
  | 'MELEE'
  | 'MAGIC_NATURE'
  | 'ARMOR_GEAR'
  | 'OFFHAND_MOUNT';

export interface AlbionSpell {
  id: string;
  spell_icon: string; // Verified 200 OK English spell name or ITEM:{code}
  slot: SpellSlotKey;
  name_en: string;
  name_vi: string;
  cooldown: number; // seconds
  energy_cost: number;
  cast_time_en: string;
  cast_time_vi: string;
  range_en: string;
  range_vi: string;
  description_vi: string;
  description_en: string;
  damage_type?: 'Physical' | 'Magical' | 'True' | 'Heal' | 'Buff';
  unlockTier?: number; // e.g. 6 for Tier VI+ gated W spells
}

export interface WeaponLineSpellPool {
  lineId: string; // e.g. 'axe', 'crossbow', 'nature_staff', 'sword', etc.
  sharedQSpells: AlbionSpell[];
  sharedWSpells: AlbionSpell[];
  sharedPassives: AlbionSpell[];
}

export interface AlbionItemStats {
  base_ip: number;
  damage_per_second?: number;
  auto_attack_damage?: number;
  attack_speed?: number; // attacks per second
  attack_range_en?: string;
  attack_range_vi?: string;
  resilience_penetration?: string;
  bonus_defense_vs_players?: string;
  bonus_defense_vs_mobs?: string;
  ability_bonus_en?: string;
  ability_bonus_vi?: string;
  max_energy?: number;
  energy_regen?: number;
  weight: string;
}

export interface AlbionItem {
  id: string;
  unique_name: string;
  base_identifier: string;
  name_en: string;
  name_vi: string;
  tier: AlbionTier;
  enchantment: AlbionEnchantment;
  quality: AlbionQuality;
  category: 'weapons' | 'armors' | 'mounts' | 'consumables';
  filter_group: Exclude<ArmoryFilterCategory, 'ALL'>;
  sub_category_en: string;
  sub_category_vi: string;
  slot_type: AlbionSlotType;
  handedness: AlbionHandedness;
  is_artifact: boolean;
  artifact_type?: 'Rune' | 'Soul' | 'Relic' | 'Avalonian' | 'Crystal';
  recommended_zones: AlbionZoneType[];
  avg_market_silver: number;
  best_city: string;
  lore_vi: string;
  lore_en: string;
  stats: AlbionItemStats;
  spells: {
    Q: AlbionSpell[];
    W: AlbionSpell[];
    E: AlbionSpell[];
    PASSIVE: AlbionSpell[];
  };
  default_spells: {
    Q: string;
    W: string;
    E: string;
    PASSIVE: string;
  };
}
