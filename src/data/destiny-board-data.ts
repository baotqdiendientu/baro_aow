export type DestinyMainTreeId =
  | 'warrior'
  | 'hunter'
  | 'mage'
  | 'plate'
  | 'leather'
  | 'cloth'
  | 'accessory';

export interface DestinyFamily {
  id: string;
  name_en: string;
  name_vi: string;
  iconItem: string; // T8 sprite code, e.g. 'T8_MAIN_AXE'
  category: 'weapons' | 'armors' | 'offhands' | 'accessories';
  baseIds: string[];
}

export interface DestinyMainTree {
  id: DestinyMainTreeId;
  name_en: string;
  name_vi: string;
  color: string;
  badgeClass: string;
  borderClass: string;
  bgGradient: string;
  families: DestinyFamily[];
}

export const DESTINY_TREES: Record<DestinyMainTreeId, DestinyMainTree> = {
  // ============================================================================
  // 1. WARRIOR (CHIẾN BINH - ĐỎ)
  // ============================================================================
  warrior: {
    id: 'warrior',
    name_en: 'Warrior Tree',
    name_vi: 'Chiến Binh (Warrior)',
    color: '#E74C3C',
    badgeClass: 'bg-red-500/20 text-red-400 border-red-500/40',
    borderClass: 'border-red-500/60',
    bgGradient: 'from-red-950/40 via-bg-secondary to-bg-elevated',
    families: [
      {
        id: 'axe',
        name_en: 'Axe',
        name_vi: 'Nhánh Rìu (Axe)',
        iconItem: 'T8_MAIN_AXE',
        category: 'weapons',
        baseIds: [
          'MAIN_AXE',
          '2H_AXE',
          '2H_HALBERD',
          '2H_HALBERD_MORGANA',
          '2H_SCYTHE_HELL',
          '2H_DUALAXE_KEEPER',
          '2H_AXE_AVALON',
          '2H_SCYTHE_CRYSTAL',
        ],
      },
      {
        id: 'sword',
        name_en: 'Sword',
        name_vi: 'Nhánh Kiếm (Sword)',
        iconItem: 'T8_MAIN_SWORD',
        category: 'weapons',
        baseIds: [
          'MAIN_SWORD',
          '2H_CLAYMORE',
          '2H_DUALSWORD',
          'MAIN_SCIMITAR_MORGANA',
          '2H_CLEAVER_HELL',
          '2H_CLAYMORE_AVALON',
          '2H_DUALSWORD_AVALON',
          'MAIN_SWORD_CRYSTAL',
        ],
      },
      {
        id: 'mace',
        name_en: 'Mace',
        name_vi: 'Nhánh Chùy (Mace)',
        iconItem: 'T8_MAIN_MACE',
        category: 'weapons',
        baseIds: [
          'MAIN_MACE',
          '2H_MACE',
          '2H_FLAIL',
          'MAIN_ROCKMACE_KEEPER',
          'MAIN_MACE_HELL',
          '2H_MACE_MORGANA',
          '2H_DUALMACE_AVALON',
          'MAIN_MACE_CRYSTAL',
        ],
      },
      {
        id: 'hammer',
        name_en: 'Hammer',
        name_vi: 'Nhánh Búa (Hammer)',
        iconItem: 'T8_2H_HAMMER',
        category: 'weapons',
        baseIds: [
          '2H_HAMMER',
          '2H_POLEHAMMER',
          'MAIN_HAMMER',
          '2H_HAMMER_UNDEAD',
          '2H_RAM_KEEPER',
          '2H_DUALHAMMER_HELL',
          '2H_HAMMER_AVALON',
          '2H_HAMMER_CRYSTAL',
        ],
      },
      {
        id: 'war_gloves',
        name_en: 'War Gloves',
        name_vi: 'Găng Chiến (War Gloves)',
        iconItem: 'T8_2H_KNUCKLES_AVALON',
        category: 'weapons',
        baseIds: [
          '2H_KNUCKLES_SET1',
          '2H_KNUCKLES_SET2',
          '2H_KNUCKLES_SET3',
          '2H_KNUCKLES_KEEPER',
          '2H_KNUCKLES_HELL',
          '2H_KNUCKLES_MORGANA',
          '2H_KNUCKLES_AVALON',
          '2H_KNUCKLES_CRYSTAL',
        ],
      },
      {
        id: 'crossbow',
        name_en: 'Crossbow',
        name_vi: 'Nhánh Nỏ (Crossbow)',
        iconItem: 'T8_2H_CROSSBOW',
        category: 'weapons',
        baseIds: [
          '2H_CROSSBOW',
          '2H_CROSSBOWLARGE',
          'MAIN_1HCROSSBOW',
          '2H_REPEATINGCROSSBOW_UNDEAD',
          '2H_DUALCROSSBOW_HELL',
          '2H_CROSSBOWLARGE_MORGANA',
          '2H_CROSSBOW_CANNON_AVALON',
          '2H_DUALCROSSBOW_CRYSTAL',
        ],
      },
      {
        id: 'shield',
        name_en: 'Shields',
        name_vi: 'Khiên (Shields)',
        iconItem: 'T8_OFF_SHIELD',
        category: 'offhands',
        baseIds: [
          'OFF_SHIELD',
          'OFF_TOWERSHIELD_UNDEAD',
          'OFF_SHIELD_HELL',
          'OFF_SPIKEDSHIELD_MORGANA',
          'OFF_SHIELD_AVALON',
          'OFF_SHIELD_CRYSTAL',
        ],
      },
    ],
  },

  // ============================================================================
  // 2. HUNTER (THỢ SĂN - XANH LÁ)
  // ============================================================================
  hunter: {
    id: 'hunter',
    name_en: 'Hunter Tree',
    name_vi: 'Thợ Săn (Hunter)',
    color: '#2ECC71',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    borderClass: 'border-emerald-500/60',
    bgGradient: 'from-emerald-950/40 via-bg-secondary to-bg-elevated',
    families: [
      {
        id: 'bow',
        name_en: 'Bow',
        name_vi: 'Nhánh Cung (Bow)',
        iconItem: 'T8_2H_BOW',
        category: 'weapons',
        baseIds: [
          '2H_BOW',
          '2H_WARBOW',
          '2H_LONGBOW',
          '2H_LONGBOW_UNDEAD',
          '2H_BOW_HELL',
          '2H_BOW_KEEPER',
          '2H_BOW_AVALON',
          '2H_BOW_CRYSTAL',
        ],
      },
      {
        id: 'spear',
        name_en: 'Spear',
        name_vi: 'Nhánh Thương (Spear)',
        iconItem: 'T8_MAIN_SPEAR',
        category: 'weapons',
        baseIds: [
          'MAIN_SPEAR',
          '2H_SPEAR',
          '2H_GLAIVE',
          'MAIN_SPEAR_KEEPER',
          '2H_HARPOON_HELL',
          '2H_TRIDENT_UNDEAD',
          'MAIN_SPEAR_LANCE_AVALON',
          '2H_GLAIVE_CRYSTAL',
        ],
      },
      {
        id: 'nature_staff',
        name_en: 'Nature Staff',
        name_vi: 'Gậy Tự Nhiên (Nature Staff)',
        iconItem: 'T8_MAIN_NATURESTAFF',
        category: 'weapons',
        baseIds: [
          'MAIN_NATURESTAFF',
          '2H_NATURESTAFF',
          '2H_WILDSTAFF',
          'MAIN_NATURESTAFF_KEEPER',
          '2H_NATURESTAFF_HELL',
          '2H_NATURESTAFF_KEEPER',
          'MAIN_NATURESTAFF_AVALON',
          'MAIN_NATURESTAFF_CRYSTAL',
        ],
      },
      {
        id: 'dagger',
        name_en: 'Dagger',
        name_vi: 'Nhánh Dao Găm (Dagger)',
        iconItem: 'T8_MAIN_DAGGER',
        category: 'weapons',
        baseIds: [
          'MAIN_DAGGER',
          '2H_DAGGERPAIR',
          '2H_CLAWPAIR',
          'MAIN_RAPIER_MORGANA',
          'MAIN_DAGGER_HELL',
          '2H_DUALSICKLE_UNDEAD',
          '2H_DAGGER_KATAR_AVALON',
          '2H_DAGGERPAIR_CRYSTAL',
        ],
      },
      {
        id: 'quarterstaff',
        name_en: 'Quarterstaff',
        name_vi: 'Gậy Côn (Quarterstaff)',
        iconItem: 'T8_2H_QUARTERSTAFF',
        category: 'weapons',
        baseIds: [
          '2H_QUARTERSTAFF',
          '2H_IRONCLADEDSTAFF',
          '2H_DOUBLEBLADEDSTAFF',
          '2H_COMBATSTAFF_MORGANA',
          '2H_TWINSCYTHE_HELL',
          '2H_ROCKSTAFF_KEEPER',
          '2H_QUARTERSTAFF_AVALON',
          '2H_DOUBLEBLADEDSTAFF_CRYSTAL',
        ],
      },
      {
        id: 'shapeshifter',
        name_en: 'Shapeshifter',
        name_vi: 'Gậy Biến Hình (Shapeshifter)',
        iconItem: 'T8_2H_SHAPESHIFTER_AVALON',
        category: 'weapons',
        baseIds: [
          '2H_SHAPESHIFTER_SET1',
          '2H_SHAPESHIFTER_SET2',
          '2H_SHAPESHIFTER_SET3',
          '2H_SHAPESHIFTER_KEEPER',
          '2H_SHAPESHIFTER_HELL',
          '2H_SHAPESHIFTER_MORGANA',
          '2H_SHAPESHIFTER_AVALON',
          '2H_SHAPESHIFTER_CRYSTAL',
        ],
      },
      {
        id: 'torch',
        name_en: 'Torches',
        name_vi: 'Đuốc & Tù Và (Torches)',
        iconItem: 'T8_OFF_TORCH',
        category: 'offhands',
        baseIds: [
          'OFF_TORCH',
          'OFF_HORN_KEEPER',
          'OFF_LAMP_UNDEAD',
          'OFF_JESTERCANE_HELL',
          'OFF_TALISMAN_AVALON',
        ],
      },
    ],
  },

  // ============================================================================
  // 3. MAGE (PHÁP SƯ - XANH DƯƠNG)
  // ============================================================================
  mage: {
    id: 'mage',
    name_en: 'Mage Tree',
    name_vi: 'Pháp Sư (Mage)',
    color: '#3498DB',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    borderClass: 'border-sky-500/60',
    bgGradient: 'from-blue-950/40 via-bg-secondary to-bg-elevated',
    families: [
      {
        id: 'fire_staff',
        name_en: 'Fire Staff',
        name_vi: 'Gậy Lửa (Fire Staff)',
        iconItem: 'T8_MAIN_FIRESTAFF',
        category: 'weapons',
        baseIds: [
          'MAIN_FIRESTAFF',
          '2H_FIRESTAFF',
          '2H_INFERNOSTAFF',
          'MAIN_FIRESTAFF_KEEPER',
          '2H_FIRESTAFF_HELL',
          '2H_INFERNOSTAFF_MORGANA',
          '2H_FIRE_RINGPAIR_AVALON',
          'MAIN_FIRESTAFF_CRYSTAL',
        ],
      },
      {
        id: 'holy_staff',
        name_en: 'Holy Staff',
        name_vi: 'Gậy Thánh (Holy Staff)',
        iconItem: 'T8_MAIN_HOLYSTAFF',
        category: 'weapons',
        baseIds: [
          'MAIN_HOLYSTAFF',
          '2H_HOLYSTAFF',
          '2H_DIVINESTAFF',
          'MAIN_HOLYSTAFF_MORGANA',
          '2H_HOLYSTAFF_HELL',
          '2H_HOLYSTAFF_UNDEAD',
          'MAIN_HOLYSTAFF_AVALON',
          '2H_HOLYSTAFF_CRYSTAL',
        ],
      },
      {
        id: 'arcane_staff',
        name_en: 'Arcane Staff',
        name_vi: 'Gậy Thần Bí (Arcane Staff)',
        iconItem: 'T8_MAIN_ARCANESTAFF',
        category: 'weapons',
        baseIds: [
          'MAIN_ARCANESTAFF',
          '2H_ARCANESTAFF',
          '2H_ENIGMATICSTAFF',
          'MAIN_ARCANESTAFF_UNDEAD',
          '2H_ARCANESTAFF_HELL',
          '2H_ENIGMATICORB_MORGANA',
          '2H_ARCANE_RINGPAIR_AVALON',
          '2H_ARCANESTAFF_CRYSTAL',
        ],
      },
      {
        id: 'frost_staff',
        name_en: 'Frost Staff',
        name_vi: 'Gậy Băng (Frost Staff)',
        iconItem: 'T8_MAIN_FROSTSTAFF',
        category: 'weapons',
        baseIds: [
          'MAIN_FROSTSTAFF',
          '2H_FROSTSTAFF',
          '2H_GLACIALSTAFF',
          'MAIN_FROSTSTAFF_KEEPER',
          '2H_ICEGAUNTLETS_HELL',
          '2H_ICECRYSTAL_UNDEAD',
          'MAIN_FROSTSTAFF_AVALON',
          '2H_FROSTSTAFF_CRYSTAL',
        ],
      },
      {
        id: 'cursed_staff',
        name_en: 'Cursed Staff',
        name_vi: 'Gậy Nguyền Rủa (Cursed Staff)',
        iconItem: 'T8_MAIN_CURSEDSTAFF',
        category: 'weapons',
        baseIds: [
          'MAIN_CURSEDSTAFF',
          '2H_CURSEDSTAFF',
          '2H_DEMONICSTAFF',
          'MAIN_CURSEDSTAFF_UNDEAD',
          '2H_SKULLORB_HELL',
          '2H_CURSEDSTAFF_MORGANA',
          'MAIN_CURSEDSTAFF_AVALON',
          'MAIN_CURSEDSTAFF_CRYSTAL',
        ],
      },
      {
        id: 'tome',
        name_en: 'Tomes',
        name_vi: 'Sách Phép & Hộp Đựng (Tomes)',
        iconItem: 'T8_OFF_BOOK',
        category: 'offhands',
        baseIds: [
          'OFF_BOOK',
          'OFF_ORB_MORGANA',
          'OFF_DEMONSKULL_HELL',
          'OFF_TOTEM_KEEPER',
          'OFF_CENSER_AVALON',
        ],
      },
    ],
  },

  // ============================================================================
  // 4. PLATE ARMOR (GIÁP BẢN KIM LOẠI)
  // ============================================================================
  plate: {
    id: 'plate',
    name_en: 'Plate Armor',
    name_vi: 'Giáp Bản Kim Loại (Plate Armor)',
    color: '#BDC3C7',
    badgeClass: 'bg-slate-400/20 text-slate-300 border-slate-400/40',
    borderClass: 'border-slate-400/60',
    bgGradient: 'from-slate-900/40 via-bg-secondary to-bg-elevated',
    families: [
      {
        id: 'plate_helmets',
        name_en: 'Plate Helmets',
        name_vi: 'Mũ Sắt (Plate Helmets)',
        iconItem: 'T8_HEAD_PLATE_SET1',
        category: 'armors',
        baseIds: [
          'HEAD_PLATE_SET1',
          'HEAD_PLATE_SET2',
          'HEAD_PLATE_SET3',
          'HEAD_PLATE_UNDEAD',
          'HEAD_PLATE_HELL',
          'HEAD_PLATE_KEEPER',
          'HEAD_PLATE_ROYAL',
          'HEAD_PLATE_AVALON',
          'HEAD_PLATE_FEY',
        ],
      },
      {
        id: 'plate_armors',
        name_en: 'Plate Armors',
        name_vi: 'Áo Giáp Sắt (Plate Armors)',
        iconItem: 'T8_ARMOR_PLATE_SET1',
        category: 'armors',
        baseIds: [
          'ARMOR_PLATE_SET1',
          'ARMOR_PLATE_SET2',
          'ARMOR_PLATE_SET3',
          'ARMOR_PLATE_UNDEAD',
          'ARMOR_PLATE_HELL',
          'ARMOR_PLATE_KEEPER',
          'ARMOR_PLATE_ROYAL',
          'ARMOR_PLATE_AVALON',
          'ARMOR_PLATE_FEY',
        ],
      },
      {
        id: 'plate_boots',
        name_en: 'Plate Boots',
        name_vi: 'Giày Sắt (Plate Boots)',
        iconItem: 'T8_SHOES_PLATE_SET1',
        category: 'armors',
        baseIds: [
          'SHOES_PLATE_SET1',
          'SHOES_PLATE_SET2',
          'SHOES_PLATE_SET3',
          'SHOES_PLATE_UNDEAD',
          'SHOES_PLATE_HELL',
          'SHOES_PLATE_KEEPER',
          'SHOES_PLATE_ROYAL',
          'SHOES_PLATE_AVALON',
          'SHOES_PLATE_FEY',
        ],
      },
    ],
  },

  // ============================================================================
  // 5. LEATHER ARMOR (GIÁP DA)
  // ============================================================================
  leather: {
    id: 'leather',
    name_en: 'Leather Armor',
    name_vi: 'Giáp Da (Leather Armor)',
    color: '#E67E22',
    badgeClass: 'bg-amber-600/20 text-amber-300 border-amber-600/40',
    borderClass: 'border-amber-600/60',
    bgGradient: 'from-amber-950/40 via-bg-secondary to-bg-elevated',
    families: [
      {
        id: 'leather_hoods',
        name_en: 'Leather Hoods',
        name_vi: 'Mũ Da (Leather Hoods)',
        iconItem: 'T8_HEAD_LEATHER_SET1',
        category: 'armors',
        baseIds: [
          'HEAD_LEATHER_SET1',
          'HEAD_LEATHER_SET2',
          'HEAD_LEATHER_SET3',
          'HEAD_LEATHER_MORGANA',
          'HEAD_LEATHER_HELL',
          'HEAD_LEATHER_UNDEAD',
          'HEAD_LEATHER_ROYAL',
          'HEAD_LEATHER_AVALON',
          'HEAD_LEATHER_FEY',
        ],
      },
      {
        id: 'leather_jackets',
        name_en: 'Leather Jackets',
        name_vi: 'Áo Giáp Da (Leather Jackets)',
        iconItem: 'T8_ARMOR_LEATHER_SET1',
        category: 'armors',
        baseIds: [
          'ARMOR_LEATHER_SET1',
          'ARMOR_LEATHER_SET2',
          'ARMOR_LEATHER_SET3',
          'ARMOR_LEATHER_MORGANA',
          'ARMOR_LEATHER_HELL',
          'ARMOR_LEATHER_UNDEAD',
          'ARMOR_LEATHER_ROYAL',
          'ARMOR_LEATHER_AVALON',
          'ARMOR_LEATHER_FEY',
        ],
      },
      {
        id: 'leather_shoes',
        name_en: 'Leather Shoes',
        name_vi: 'Giày Da (Leather Shoes)',
        iconItem: 'T8_SHOES_LEATHER_SET1',
        category: 'armors',
        baseIds: [
          'SHOES_LEATHER_SET1',
          'SHOES_LEATHER_SET2',
          'SHOES_LEATHER_SET3',
          'SHOES_LEATHER_MORGANA',
          'SHOES_LEATHER_HELL',
          'SHOES_LEATHER_UNDEAD',
          'SHOES_LEATHER_ROYAL',
          'SHOES_LEATHER_AVALON',
          'SHOES_LEATHER_FEY',
        ],
      },
    ],
  },

  // ============================================================================
  // 6. CLOTH ARMOR (GIÁP VẢI)
  // ============================================================================
  cloth: {
    id: 'cloth',
    name_en: 'Cloth Armor',
    name_vi: 'Giáp Vải (Cloth Armor)',
    color: '#9B59B6',
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    borderClass: 'border-purple-500/60',
    bgGradient: 'from-purple-950/40 via-bg-secondary to-bg-elevated',
    families: [
      {
        id: 'cloth_cowls',
        name_en: 'Cloth Cowls',
        name_vi: 'Mũ Vải (Cloth Cowls)',
        iconItem: 'T8_HEAD_CLOTH_SET1',
        category: 'armors',
        baseIds: [
          'HEAD_CLOTH_SET1',
          'HEAD_CLOTH_SET2',
          'HEAD_CLOTH_SET3',
          'HEAD_CLOTH_KEEPER',
          'HEAD_CLOTH_HELL',
          'HEAD_CLOTH_MORGANA',
          'HEAD_CLOTH_ROYAL',
          'HEAD_CLOTH_AVALON',
          'HEAD_CLOTH_FEY',
        ],
      },
      {
        id: 'cloth_robes',
        name_en: 'Cloth Robes',
        name_vi: 'Áo Choàng Pháp Sư (Cloth Robes)',
        iconItem: 'T8_ARMOR_CLOTH_SET1',
        category: 'armors',
        baseIds: [
          'ARMOR_CLOTH_SET1',
          'ARMOR_CLOTH_SET2',
          'ARMOR_CLOTH_SET3',
          'ARMOR_CLOTH_KEEPER',
          'ARMOR_CLOTH_HELL',
          'ARMOR_CLOTH_MORGANA',
          'ARMOR_CLOTH_ROYAL',
          'ARMOR_CLOTH_AVALON',
          'ARMOR_CLOTH_FEY',
        ],
      },
      {
        id: 'cloth_sandals',
        name_en: 'Cloth Sandals',
        name_vi: 'Giày Vải (Cloth Sandals)',
        iconItem: 'T8_SHOES_CLOTH_SET1',
        category: 'armors',
        baseIds: [
          'SHOES_CLOTH_SET1',
          'SHOES_CLOTH_SET2',
          'SHOES_CLOTH_SET3',
          'SHOES_CLOTH_KEEPER',
          'SHOES_CLOTH_HELL',
          'SHOES_CLOTH_MORGANA',
          'SHOES_CLOTH_ROYAL',
          'SHOES_CLOTH_AVALON',
          'SHOES_CLOTH_FEY',
        ],
      },
    ],
  },

  // ============================================================================
  // 7. ACCESSORIES (PHỤ KIỆN: ÁO CHOÀNG, TÚI, THÚ CƯỠI, THỨC ĂN)
  // ============================================================================
  accessory: {
    id: 'accessory',
    name_en: 'Accessories',
    name_vi: 'Phụ Kiện & Thú Cưỡi',
    color: '#F1C40F',
    badgeClass: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
    borderClass: 'border-amber-400/60',
    bgGradient: 'from-amber-900/30 via-bg-secondary to-bg-elevated',
    families: [
      {
        id: 'capes',
        name_en: 'Faction Capes',
        name_vi: 'Áo Choàng Thành Phố (Capes)',
        iconItem: 'T8_CAPEITEM_FW_MARTLOCK',
        category: 'accessories',
        baseIds: [
          'CAPE',
          'CAPEITEM_FW_THETFORD',
          'CAPEITEM_FW_FORTSTERLING',
          'CAPEITEM_FW_LYMHURST',
          'CAPEITEM_FW_BRIDGEWATCH',
          'CAPEITEM_FW_MARTLOCK',
          'CAPEITEM_FW_CAERLEON',
          'CAPEITEM_FW_BRECILIEN',
          'CAPEITEM_HERETIC',
          'CAPEITEM_UNDEAD',
          'CAPEITEM_KEEPER',
          'CAPEITEM_MORGANA',
          'CAPEITEM_DEMON',
        ],
      },
      {
        id: 'mounts',
        name_en: 'Battle Mounts',
        name_vi: 'Thú Cưỡi (Mounts)',
        iconItem: 'T8_MOUNT_HORSE',
        category: 'accessories',
        baseIds: [
          'MOUNT_HORSE',
          'MOUNT_OX',
          'MOUNT_DIREWOLF',
          'MOUNT_ARMORED_HORSE',
          'MOUNT_SWIFTCLAW',
          'MOUNT_MYSTICOWL',
          'MOUNT_MAMMOTH_TRANSPORT',
        ],
      },
    ],
  },
};
