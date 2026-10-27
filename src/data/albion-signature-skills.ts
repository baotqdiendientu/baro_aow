/**
 * Exact Albion Online Signature Skill Encyclopedia (E-skills for all 17 Weapon Trees,
 * D-skills for Helmets, R-skills for Chest Armors, F-skills for Boots, Passive Triggers for Capes,
 * Off-Hand stat auras, Mount skills, Potions, and Meals).
 */

export interface SignatureSkillMeta {
  name_en: string;
  name_vi: string;
  cooldown: number;
  energy: number;
  cast_en: string;
  cast_vi: string;
  range_en: string;
  range_vi: string;
  desc_vi: string;
  desc_en: string;
  icon?: string;
}

export const EXACT_SIGNATURE_SKILLS: Record<string, SignatureSkillMeta> = {
  // ============================================================================
  // 1. CROSSBOWS (8 Variants)
  // ============================================================================
  MAIN_1HCROSSBOW: {
    name_en: 'Exploding Shot',
    name_vi: 'Đạn Nổ Định Giờ (Exploding Shot)',
    cooldown: 15,
    energy: 13,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '13m',
    range_vi: '13m',
    desc_vi:
      'Gắn quả bom hẹn giờ lên mục tiêu gây sát thương vật lý ban đầu. Sau 2 giây, bom phát nổ gây lượng sát thương vật lý diện rộng cực lớn trong bán kính 4m quanh mục tiêu.',
    desc_en:
      'Plants a timed explosive bolt on the target dealing initial physical damage, then detonating after 2s for massive AoE physical damage in a 4m radius.',
    icon: 'Exploding Shot',
  },
  '2H_CROSSBOW': {
    name_en: 'Snipe Shot',
    name_vi: 'Bắn Tỉa Hủy Diệt (Snipe Shot)',
    cooldown: 20,
    energy: 19,
    cast_en: '1.8s Channel',
    cast_vi: 'Ngắm bắn 1.8s',
    range_en: '17m',
    range_vi: '17m',
    desc_vi:
      'Ngắm bắn chuẩn xác vào mục tiêu đơn lẻ và phóng mũi tên xuyên giáp gây lượng sát thương vật lý một mục tiêu cao bậc nhất trò chơi (bỏ qua hiệu ứng phản sát thương).',
    desc_en:
      'Locks onto an enemy and fires a high-caliber bolt dealing massive single-target physical damage that cannot be reflected.',
  },
  '2H_CROSSBOWLARGE': {
    name_en: 'Sweeping Bolt',
    name_vi: 'Tên Xuyên Phá Diện Rộng (Sweeping Bolt)',
    cooldown: 18,
    energy: 16,
    cast_en: '0.4s',
    cast_vi: '0.4 giây',
    range_en: '16m Line',
    range_vi: 'Đường thẳng 16m',
    desc_vi:
      'Bắn mũi tên đại nỏ xuyên thấu toàn bộ kẻ địch trên đường thẳng 16m, gây sát thương vật lý lớn và ngắt ngay lập tức mọi kỹ năng đang niệm của đối phương.',
    desc_en:
      'Fires a heavy bolt piercing all enemies in a 16m line, dealing heavy physical damage and interrupting all spellcasting.',
  },
  '2H_REPEATINGCROSSBOW_UNDEAD': {
    name_en: 'Explosive Mine',
    name_vi: 'Mìn Nổ Hầm Ngục (Explosive Mine)',
    cooldown: 15,
    energy: 15,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '13m',
    range_vi: '13m',
    desc_vi:
      'Ném quả mìn xuống vị trí chỉ định. Khi dẫm phải hoặc bị bắn trúng bằng kỹ năng Q, mìn phát nổ ngay lập tức gây sát thương vật lý diện rộng cực lớn lên đám đông.',
    desc_en:
      'Throws an explosive mine at the target area. Detonates when stepped on or hit by Explosive Bolt, dealing massive AoE physical damage.',
  },
  '2H_DUALCROSSBOW_HELL': {
    name_en: 'Deathward Climax',
    name_vi: 'Xả Tên Hủy Diệt (Deathward Climax)',
    cooldown: 20,
    energy: 18,
    cast_en: '3.4s Channel',
    cast_vi: 'Duy trì 3.4s',
    range_en: '12m',
    range_vi: '12m',
    desc_vi:
      'Duy trì xả liên thanh 11 loạt tên từ cặp nỏ đôi vào mục tiêu. Sát thương mỗi loạt tên tăng dần theo thời gian duy trì và kết thúc bằng phát bắn chí mạng.',
    desc_en:
      'Channels 11 rapid-fire bolts into the target over 3.4s. Each consecutive bolt deals escalating physical damage.',
  },
  '2H_CROSSBOWLARGE_MORGANA': {
    name_en: 'Ballista Support',
    name_vi: 'Pháo Đài Liên Xạ (Ballista Support)',
    cooldown: 25,
    energy: 20,
    cast_en: '3.0s Channel',
    cast_vi: 'Duy trì 3.0s',
    range_en: '20m Cone',
    range_vi: 'Hình nón 20m',
    desc_vi:
      'Dựng đại nỏ công thành bắn liên hoàn các đợt mưa tên xuyên giáp trong vùng hình nón 20m, gây sát thương vật lý theo % máu tối đa kèm chảy máu.',
    desc_en:
      'Deploys a siege ballista firing piercing volleys in a 20m cone, dealing physical damage plus max-HP bleed damage.',
  },
  '2H_CROSSBOW_CANNON_AVALON': {
    name_en: 'Divine Engine',
    name_vi: 'Đại Pháo Ánh Sáng Avalon (Divine Engine)',
    cooldown: 30,
    energy: 22,
    cast_en: '2.7s Channel',
    cast_vi: 'Duy trì 2.7s',
    range_en: '26m Beam',
    range_vi: 'Tia sáng 26m',
    desc_vi:
      'Phóng đại tia năng lượng Avalon dài 26m thiêu đốt mọi kẻ địch đứng trên đường thẳng, gây sát thương phép/vật lý khổng lồ mỗi 0.3 giây trong giao tranh ZvZ.',
    desc_en:
      'Projects a 26m Avalonian energy beam scorching all enemies in its path every 0.3s for devastating ZvZ line damage.',
  },
  '2H_DUALCROSSBOW_CRYSTAL': {
    name_en: 'Overdrive',
    name_vi: 'Tia Chớp Năng Lượng Pha Lê (Overdrive)',
    cooldown: 20,
    energy: 16,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '8m Dash / 12m',
    range_vi: 'Lướt 8m / Bắn 12m',
    desc_vi:
      'Lướt cơ động 2 lần và tích điện năng lượng Pha Lê: xả loạt đạn hồ quang điện gây sát thương diện rộng và tăng mạnh tốc độ di chuyển.',
    desc_en:
      'Performs a dual tactical dash while charging Crystal overdrive bolts that blast nearby enemies with arc damage.',
  },

  // ============================================================================
  // 2. BOWS (8 Variants)
  // ============================================================================
  '2H_BOW': {
    name_en: 'Enchanted Quiver',
    name_vi: 'Bao Tên Ma Thuật (Enchanted Quiver)',
    cooldown: 15,
    energy: 11,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: 'Self (13m Attack)',
    range_vi: 'Bản thân (Tầm bắn 13m)',
    desc_vi:
      'Nạp 6 mũi tên ma thuật cường hóa, tăng mạnh tốc độ bắn, tầm bắn và sát thương đòn đánh thường lên tới 235%. Có thể tái kích hoạt để nhảy lùi và nạp thêm tên.',
    desc_en:
      'Loads 6 enchanted arrows, massively increasing attack speed, attack range, and normal attack damage up to 235%. Can recast to vault and reload.',
  },
  '2H_WARBOW': {
    name_en: 'Magic Arrow',
    name_vi: 'Mũi Tên Ma Thuật Tầm Xa (Magic Arrow)',
    cooldown: 10,
    energy: 12,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '22m',
    range_vi: '22m',
    desc_vi:
      'Bắn mũi tên ma thuật bay xa 22m gây sát thương phép lớn và làm Choáng (Stun) mục tiêu đầu tiên trúng đòn (sát thương tăng theo khoảng cách bay).',
    desc_en:
      'Shoots a long-range magic arrow up to 22m that stuns and deals heavy magic damage scaling with distance traveled.',
  },
  '2H_LONGBOW': {
    name_en: 'Rain of Arrows',
    name_vi: 'Mưa Tên Diện Rộng (Rain of Arrows)',
    cooldown: 15,
    energy: 16,
    cast_en: '2.0s Channel',
    cast_vi: 'Duy trì 2.0s',
    range_en: '16m',
    range_vi: '16m',
    desc_vi:
      'Trút 5 đợt mưa tên liên tiếp xuống vùng chỉ định bán kính 5m, gây sát thương vật lý diện rộng và làm chậm 35% mọi kẻ địch trong vùng.',
    desc_en:
      'Rains 5 volleys of arrows onto a 5m target area, dealing AoE physical damage and slowing enemies by 35%.',
  },
  '2H_LONGBOW_UNDEAD': {
    name_en: 'Undead Arrows',
    name_vi: 'Cung Tên Bóng Ma (Undead Arrows)',
    cooldown: 20,
    energy: 15,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: 'Self (16.5m Range)',
    range_vi: 'Tầm bắn 16.5m',
    desc_vi:
      'Trong 10 giây, tăng tầm bắn thường thêm 35%, tăng tốc độ bắn và mỗi phát bắn gây thêm sát thương phép kèm giảm kháng phép của mục tiêu.',
    desc_en:
      'For 10s, increases normal attack range by 35%, boosts attack speed, and adds bonus magic damage + resistance shred on hit.',
  },
  '2H_BOW_HELL': {
    name_en: 'Demon Arrow',
    name_vi: 'Mũi Tên Quỷ Khốc (Demon Arrow)',
    cooldown: 25,
    energy: 19,
    cast_en: '0.5s',
    cast_vi: '0.5 giây',
    range_en: '24m Line',
    range_vi: 'Đường thẳng 24m',
    desc_vi:
      'Bắn đại tiễn địa ngục xuyên qua mọi kẻ địch trên đường thẳng 24m. Sát thương tăng vọt theo số lượng kẻ địch bị xuyên qua (vũ khí bomb squad ZvZ).',
    desc_en:
      'Fires a demonic arrow piercing all enemies in a 24m line. Damage escalates dramatically with each additional enemy hit.',
  },
  '2H_BOW_KEEPER': {
    name_en: 'Raging Storm',
    name_vi: 'Bão Điện Từ Badon (Raging Storm)',
    cooldown: 20,
    energy: 18,
    cast_en: '0.4s',
    cast_vi: '0.4 giây',
    range_en: '15m',
    range_vi: '15m',
    desc_vi:
      'Bắn mũi tên lôi điện tạo ra đám mây bão điện từ tồn tại 5.5 giây: gây sát thương phép liên tục và ngắt chiêu (Interrupt) mọi kẻ địch mỗi 0.5 giây.',
    desc_en:
      'Shoots a storm arrow creating a lightning cloud for 5.5s that repeatedly damages and interrupts all enemies inside every 0.5s.',
    icon: 'Raging Storm',
  },
  '2H_BOW_AVALON': {
    name_en: 'Focused Shot',
    name_vi: 'Tia Sáng Xuyên Sương Avalon (Focused Shot)',
    cooldown: 20,
    energy: 18,
    cast_en: 'Charge up to 2s',
    cast_vi: 'Tụ lực tối đa 2s',
    range_en: '22m Line',
    range_vi: 'Đường thẳng 22m',
    desc_vi:
      'Tụ năng lượng ánh sáng Avalon và bắn luồng sáng xuyên giáp dài 22m không thể bị phản đòn, gây sát thương khổng lồ dựa trên thời gian tụ lực.',
    desc_en:
      'Charges an unreflectable Avalonian light beam up to 22m, dealing massive piercing damage scaling with charge time.',
  },
  '2H_BOW_CRYSTAL': {
    name_en: 'Ascending Barrage',
    name_vi: 'Không Kích Pha Lê (Ascending Barrage)',
    cooldown: 20,
    energy: 17,
    cast_en: 'Instant Leap',
    cast_vi: 'Bật nhảy tức thì',
    range_en: '14m',
    range_vi: '14m',
    desc_vi:
      'Bay vọt lên không trung (miễn nhiễm sát thương và khống chế) đồng thời xả mưa tên pha lê xuống kẻ địch bên dưới và đáp xuống vị trí an toàn.',
    desc_en:
      'Leaps high into the air (becoming untargetable) while raining crystal arrows onto enemies below before landing at a chosen position.',
  },

  // ============================================================================
  // 3. AXES & SCYTHES (8 Variants)
  // ============================================================================
  MAIN_AXE: {
    name_en: 'Blood Bandit',
    name_vi: 'Ném Rìu Hút Máu (Blood Bandit)',
    cooldown: 15,
    energy: 13,
    cast_en: 'Instant (2 Casts)',
    cast_vi: 'Tức thì (2 Lần ném)',
    range_en: '13m',
    range_vi: '13m',
    desc_vi:
      'Lần 1: Ném rìu gây sát thương vật lý và làm chậm. Lần 2 (nếu trúng): Ném tiếp rìu thứ hai tiêu thụ cộng dồn chảy máu để Hồi lượng lớn Máu cho bản thân.',
    desc_en:
      '1st Cast: Throws an axe dealing damage and slowing. 2nd Cast: Throws a second axe consuming bleed stacks to heal yourself for a large amount.',
  },
  '2H_AXE': {
    name_en: 'Whirlwind',
    name_vi: 'Lốc Xoáy Tử Thần (Whirlwind)',
    cooldown: 20,
    energy: 17,
    cast_en: '2.5s Channel',
    cast_vi: 'Xoay 2.5s',
    range_en: '5m AoE',
    range_vi: '5m Diện rộng',
    desc_vi:
      'Xoay đại rìu liên tục trong 2.5 giây đồng thời tăng tốc chạy, miễn nhiễm làm chậm và gây sát thương vật lý diện rộng tăng dần mỗi nhịp xoay.',
    desc_en:
      'Spins for 2.5s with increased move speed and slow immunity, dealing escalating AoE physical damage every 0.5s.',
  },
  '2H_HALBERD': {
    name_en: 'Searing Flame / Forrest of Blades',
    name_vi: 'Quét Kích Lan Truyền Chảy Máu (Halberd Smash)',
    cooldown: 15,
    energy: 15,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '6m AoE',
    range_vi: '6m Diện rộng',
    desc_vi:
      'Quét đại kích gây sát thương vật lý diện rộng lớn và phát tán tối đa 3 cộng dồn chảy máu Rending Bleed sang toàn bộ kẻ địch xung quanh.',
    desc_en:
      'Cleaves all enemies in a 6m radius, dealing heavy physical damage and spreading Rending Bleed stacks to all targets hit.',
  },
  '2H_HALBERD_MORGANA': {
    name_en: 'Morgana Raven',
    name_vi: 'Quạ Đen Vết Thương Sâu (Morgana Raven)',
    cooldown: 20,
    energy: 16,
    cast_en: '0.4s',
    cast_vi: '0.4 giây',
    range_en: '15m Line',
    range_vi: 'Đường thẳng 15m',
    desc_vi:
      'Phóng quạ huyết của Morgana xuyên qua kẻ địch trên đường thẳng 15m, gây chảy máu và giảm 35% toàn bộ lượng hồi máu nhận vào của địch trong 6 giây.',
    desc_en:
      'Sends a Morgana raven in a 15m line, dealing bleed damage and reducing all healing received by hit enemies by 35% for 6s.',
  },
  '2H_SCYTHE_HELL': {
    name_en: 'Bloody Reap',
    name_vi: 'Lưỡi Hái Tử Thần Kết Liễu (Bloody Reap)',
    cooldown: 20,
    energy: 18,
    cast_en: '0.8s (2 Sweeps)',
    cast_vi: '2 Nhát quét',
    range_en: '5.5m AoE',
    range_vi: '5.5m Diện rộng',
    desc_vi:
      'Quét 2 vòng lưỡi hái địa ngục: Vòng 1 gây sát thương diện rộng, Vòng 2 gây sát thương kết liễu cực lớn lên các mục tiêu dưới 40% máu.',
    desc_en:
      'Swings the infernal scythe twice in a circle: the first sweep damages all foes, and the second executes targets below 40% HP for massive damage.',
  },
  '2H_DUALAXE_KEEPER': {
    name_en: 'Razor Cut',
    name_vi: 'Vồ Mồi Xé Xác (Razor Cut)',
    cooldown: 20,
    energy: 17,
    cast_en: 'Instant Leap',
    cast_vi: 'Nhảy bổ tức thì',
    range_en: '11m Leap',
    range_vi: 'Nhảy 11m',
    desc_vi:
      'Nhảy bổ tới trước chém rách mục tiêu gây sát thương vật lý cực lớn kèm chảy máu chuẩn (True Damage Bleed) và giảm hồi chiêu khi trúng tướng địch.',
    desc_en:
      'Leaps forward slashing enemies in a cone, inflicting a devastating true-damage bleed and refunding cooldown on hitting players.',
  },
  '2H_AXE_AVALON': {
    name_en: 'Aftershock',
    name_vi: 'Chấn Động Giảm Máu Tối Đa (Aftershock)',
    cooldown: 25,
    energy: 19,
    cast_en: '0.9s Leap',
    cast_vi: 'Nhảy bổ 0.9s',
    range_en: '11m',
    range_vi: '11m',
    desc_vi:
      'Nhảy lên không trung và bổ rìu Avalon tạo sóng chấn động: Hất tung kẻ địch, gây sát thương vật lý lớn và cắt giảm 20% Máu Tối Đa (Max HP) của toàn bộ mục tiêu trong 6 giây.',
    desc_en:
      'Leaps and slams the ground with Avalonian power, knocking enemies airborne and reducing their Max HP by 20% for 6s.',
    icon: 'Aftershock',
  },
  '2H_SCYTHE_CRYSTAL': {
    name_en: 'Frozen Surge',
    name_vi: 'Lưỡi Hái Băng Giá Pha Lê (Frozen Surge)',
    cooldown: 20,
    energy: 18,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '11m Dash + 5m AoE',
    range_vi: 'Lướt 11m + Quét 5m',
    desc_vi:
      'Lướt xuyên qua đội hình địch tạo vết cắt băng giá làm chậm 40%, sau đó quét lưỡi hái pha lê 360 độ gom kẻ địch và giảm thời gian hồi chiêu khi trúng nhiều mục tiêu.',
    desc_en:
      'Dashes 11m leaving a frost trail that slows by 40%, then sweeps in a 5m circle dealing heavy AoE physical damage and reducing cooldown per hit.',
  },

  // ============================================================================
  // 4. SWORDS (8 Variants)
  // ============================================================================
  MAIN_SWORD: {
    name_en: 'Mighty Blow',
    name_vi: 'Nhát Chém Cường Lực (Mighty Blow)',
    cooldown: 10,
    energy: 11,
    cast_en: 'Instant Leap',
    cast_vi: 'Áp sát tức thì',
    range_en: '9m',
    range_vi: '9m',
    desc_vi:
      'Lao tới mục tiêu tung nhát chém ngắt chiêu (Interrupt), tăng Giáp/Kháng Phép cho bản thân và gây sát thương cực lớn theo số tầng Heroic Charge đang có.',
    desc_en:
      'Leaps to the target, interrupting spellcasting, boosting your resistances, and dealing heavy damage scaling with Heroic Charges.',
  },
  '2H_CLAYMORE': {
    name_en: 'Charge',
    name_vi: 'Xung Phong Trói Chân (Claymore Charge)',
    cooldown: 15,
    energy: 14,
    cast_en: 'Instant (Iframe)',
    cast_vi: 'Lướt miễn nhiễm 0.4s',
    range_en: '11m',
    range_vi: '11m',
    desc_vi:
      'Lướt 11m tới mục tiêu trong trạng thái miễn nhiễm sát thương & khống chế, Trói chân (Root) đối thủ và chém mạnh theo số tầng Heroic Charge.',
    desc_en:
      'Dashes 11m while immune to all damage and CC, rooting the target and dealing heavy physical damage scaling with Heroic Charges.',
  },
  '2H_DUALSWORD': {
    name_en: 'Spinning Blades',
    name_vi: 'Song Kiếm Xoay Tròn (Spinning Blades)',
    cooldown: 15,
    energy: 14,
    cast_en: '0.7s Leap',
    cast_vi: 'Nhảy bổ 0.7s',
    range_en: '11m',
    range_vi: '11m',
    desc_vi:
      'Nhảy xoay song kiếm tới vùng chỉ định (miễn nhiễm khống chế khi đang bay), hất tung kẻ địch, gây sát thương theo % máu tối đa và tăng mạnh tốc đánh.',
    desc_en:
      'Leaps to target area while CC-immune, dealing AoE damage plus bonus % Max HP damage and boosting your attack speed.',
    icon: 'Spinning Blades',
  },
  MAIN_SCIMITAR_MORGANA: {
    name_en: 'Crescent Slash',
    name_vi: 'Bán Nguyệt Trảm (Crescent Slash)',
    cooldown: 15,
    energy: 14,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '11m Arc',
    range_vi: 'Vòng cung 11m',
    desc_vi:
      'Vung kiếm phóng luồng kiếm khí bán nguyệt diện rộng gây sát thương vật lý kèm hiệu ứng Câm Lặng (Silence) hoặc Làm Chậm tùy theo số tầng Heroic Charge.',
    desc_en:
      'Slashes a wide crescent wave dealing AoE physical damage and applying Silence or Slow depending on consumed Heroic Charges.',
  },
  '2H_CLEAVER_HELL': {
    name_en: 'Fearless Strike',
    name_vi: 'Nhát Chém Xuyên Giáp (Fearless Strike)',
    cooldown: 18,
    energy: 15,
    cast_en: 'Instant Dash',
    cast_vi: 'Lướt chém tức thì',
    range_en: '10m Dash',
    range_vi: 'Lướt 10m',
    desc_vi:
      'Lướt xuyên qua toàn bộ kẻ địch trên đường thẳng 10m, gây sát thương vật lý lớn và giảm mạnh Giáp & Kháng Phép của địch theo số tầng Heroic Charge.',
    desc_en:
      'Dashes 10m through enemies, dealing heavy physical damage and shredding Armor & Magic Resistance scaling with Heroic Charges.',
    icon: 'Fearless Strike',
  },
  '2H_DUALSCIMITAR_UNDEAD': {
    name_en: 'Soulless Stream',
    name_vi: 'Trảm Hồn Diện Rộng (Soulless Stream)',
    cooldown: 25,
    energy: 19,
    cast_en: '1.0s',
    cast_vi: '1.0 giây',
    range_en: '7m AoE',
    range_vi: '7m Diện rộng',
    desc_vi:
      'Giải phóng cơn bão kiếm khí tử thần bán kính 7m gây sát thương diện rộng khổng lồ và cắt giảm 24% Máu hiện tại/tối đa của toàn bộ kẻ địch.',
    desc_en:
      'Unleashes a 7m blade storm dealing massive AoE physical damage and reducing enemy Max HP by up to 24%.',
  },
  '2H_CLAYMORE_AVALON': {
    name_en: 'Majestic Smash',
    name_vi: 'Đại Kiếm Vương Giả (Majestic Smash)',
    cooldown: 20,
    energy: 17,
    cast_en: '0.8s (2 Sweeps)',
    cast_vi: '2 Nhát chém',
    range_en: '6m Cone',
    range_vi: 'Hình nón 6m',
    desc_vi:
      'Quét đại kiếm Avalon hất văng kẻ địch hai bên và giáng nhát bổ xuống mặt đất tạo vùng thánh địa tăng Giáp và gây sát thương hủy diệt.',
    desc_en:
      'Sweeps enemies aside and slams the Avalonian claymore down, creating a zone that boosts defense and deals massive AoE burst.',
  },
  MAIN_SWORD_CRYSTAL: {
    name_en: 'Limitbreaker',
    name_vi: 'Kiếm Cực Hạn Pha Lê (Limitbreaker)',
    cooldown: 20,
    energy: 15,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '8m',
    range_vi: '8m',
    desc_vi:
      'Kích hoạt trạng thái Cực Hạn Pha Lê: tăng tốc chạy, miễn nhiễm làm chậm và phóng nhát chém năng lượng diện rộng theo số tầng Heroic Charge.',
    desc_en:
      'Enters Crystal Limitbreaker stance, boosting move speed and unleashing an energized shockwave slash.',
  },

  // ============================================================================
  // 5. DAGGERS (8 Variants)
  // ============================================================================
  MAIN_DAGGER: {
    name_en: 'Deadly Swipe / Bloodthirsty Blade',
    name_vi: 'Huyết Đao Tốc Đánh (Bloodthirsty Blade)',
    cooldown: 20,
    energy: 0,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: 'Self',
    range_vi: 'Bản thân',
    desc_vi:
      'Tiêu thụ máu bản thân để cường hóa dao găm trong 6 giây: tăng vọt tốc độ đánh, gây thêm sát thương phép mỗi đòn và hút 100% lượng máu gây ra.',
    desc_en:
      'Sacrifices HP to empower your dagger for 6s, massively boosting attack speed, adding bonus magic damage on hit, and granting 100% lifesteal.',
  },
  '2H_DAGGERPAIR': {
    name_en: 'Slit Throat',
    name_vi: 'Cắt Cổ Chảy Máu (Slit Throat)',
    cooldown: 15,
    energy: 15,
    cast_en: '0.4s',
    cast_vi: '0.4 giây',
    range_en: '3.5m',
    range_vi: '3.5m',
    desc_vi:
      'Chém chéo song đao vào yếu huyệt mục tiêu, tiêu thụ 3 tầng Assassin Spirit để gây sát thương vật lý cực lớn kèm sát thương chảy máu xuyên giáp.',
    desc_en:
      'Slashes the target throat, consuming Assassin Spirit stacks to deal massive burst physical damage and deep bleeding.',
  },
  '2H_CLAWPAIR': {
    name_en: 'Disembowel',
    name_vi: 'Cào Xé Khóa Mục Tiêu (Disembowel)',
    cooldown: 20,
    energy: 16,
    cast_en: '2.2s Channel',
    cast_vi: 'Khóa mục tiêu 2.2s',
    range_en: '4m',
    range_vi: '4m',
    desc_vi:
      'Khóa chặt (Root) và cào xé mục tiêu liên tục trong 2.2 giây, gây sát thương vật lý lớn và xóa bỏ bùa lợi tốc chạy của nạn nhân (vũ khí Gank số 1).',
    desc_en:
      'Roots and shreds the target over 2.2s, dealing heavy physical damage and purging movement buffs.',
  },
  MAIN_RAPIER_MORGANA: {
    name_en: 'Lunging Stabs',
    name_vi: 'Nhát Đâm Đoạt Mệnh <40% HP (Lunging Stabs)',
    cooldown: 25,
    energy: 16,
    cast_en: 'Instant Dash',
    cast_vi: 'Lướt tức thì',
    range_en: '11m Dash',
    range_vi: 'Lướt 11m',
    desc_vi:
      'Lướt 11m xuyên qua mọi kẻ địch. Nếu trúng mục tiêu dưới 40% máu: Gây gấp đôi sát thương kết liễu VÀ giảm ngay 10 giây hồi chiêu của toàn bộ kỹ năng!',
    desc_en:
      'Dashes 11m through enemies. Against targets below 40% HP, deals massive execute damage and reduces all your cooldowns by 10s.',
    icon: 'Lunging Stabs',
  },
  MAIN_DAGGER_HELL: {
    name_en: 'Blood Ritual',
    name_vi: 'Hiến Tế Huyết Đao (Blood Ritual)',
    cooldown: 15,
    energy: 14,
    cast_en: 'Instant (Up to 3 Casts)',
    cast_vi: 'Tối đa 3 nhát chém',
    range_en: '5m Cone',
    range_vi: 'Hình nón 5m',
    desc_vi:
      'Vung huyết đao chém tối đa 3 lần liên tiếp trong vùng hình nón, gây sát thương vật lý diện rộng cực lớn đổi lại tự đốt một phần máu bản thân.',
    desc_en:
      'Slashes up to 3 times in a frontal cone, dealing heavy AoE physical damage at the cost of a small portion of your own HP.',
  },
  '2H_DUALDAGGER_UNDEAD': {
    name_en: 'Ghost Strike',
    name_vi: 'Trảm Ảnh Tàng Hình (Ghost Strike)',
    cooldown: 20,
    energy: 15,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '6m',
    range_vi: '6m',
    desc_vi:
      'Lướt chém gây sát thương cực lớn và tàng hình 1.5s. Nếu kích hoạt khi đang có đủ 3 tầng Assassin Spirit: Kỹ năng E được XÓA HỒI CHIÊU ngay lập tức!',
    desc_en:
      'Slashes the target for heavy damage and turns invisible for 1.5s. Casting with 3 Assassin Spirit stacks immediately resets Ghost Strike cooldown!',
  },
  '2H_DAGGER_KATAR_AVALON': {
    name_en: 'Vendetta',
    name_vi: 'Lộn Nhào Kết Liễu Avalon (Vendetta)',
    cooldown: 20,
    energy: 17,
    cast_en: '0.4s',
    cast_vi: '0.4 giây',
    range_en: '9m Cone + Backflip',
    range_vi: 'Quét 9m + Nhảy lùi',
    desc_vi:
      'Phóng sóng năng lượng Avalon diện rộng gây sát thương bùng nổ theo số tầng Sát Thủ đồng thời lộn nhào về phía sau để thoát khỏi tầm phản công.',
    desc_en:
      'Unleashes a devastating cone of Avalonian blades scaling with Assassin Spirit stacks while backflipping to safety.',
  },
  '2H_DAGGERPAIR_CRYSTAL': {
    name_en: 'Ring of Death',
    name_vi: 'Vòng Tròn Tử Vong Pha Lê (Ring of Death)',
    cooldown: 20,
    energy: 16,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '9m',
    range_vi: '9m',
    desc_vi:
      'Phóng vòng luân đao pha lê xoay quanh vùng chỉ định, sau đó dịch chuyển tức thời tới tâm vòng tròn và thu hồi đao gây sát thương xuyên thấu cực lớn.',
    desc_en:
      'Throws spinning crystal daggers in a ring, then blinks to the center recalling the blades for massive AoE burst damage.',
  },

  // ============================================================================
  // 6. SPEARS (8 Variants)
  // ============================================================================
  MAIN_SPEAR: {
    name_en: 'Reckless Charge',
    name_vi: 'Lao Thương Xung Kích (Reckless Charge)',
    cooldown: 15,
    energy: 13,
    cast_en: 'Instant Dash',
    cast_vi: 'Lướt tức thì',
    range_en: '11m',
    range_vi: '11m',
    desc_vi:
      'Lướt 11m xuyên qua kẻ địch, Hất Tung (Knock Up) mọi mục tiêu trên đường lướt và gây sát thương vật lý tăng thêm theo số tầng Spirit Spear.',
    desc_en:
      'Charges 11m forward, knocking enemies airborne and dealing physical damage scaling with active Spirit Spear charges.',
  },
  '2H_SPEAR': {
    name_en: 'Rooting Smash',
    name_vi: 'Đâm Thương Trói Chân (Rooting Smash)',
    cooldown: 15,
    energy: 14,
    cast_en: '0.3s',
    cast_vi: '0.3 giây',
    range_en: '5m',
    range_vi: '5m',
    desc_vi:
      'Đâm mạnh trường thương vào mục tiêu gây sát thương vật lý cực lớn và Trói Chân (Root) kẻ địch lâu hơn tùy theo số tầng Spirit Spear đang tích trữ.',
    desc_en:
      'Thrusts the pike into the target, dealing heavy burst damage and rooting them with duration scaling per Spirit Spear charge.',
  },
  '2H_GLAIVE': {
    name_en: 'Fling',
    name_vi: 'Hất Ngược Ra Sau (Glaive Fling)',
    cooldown: 18,
    energy: 15,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '4.5m',
    range_vi: '4.5m',
    desc_vi:
      'Dùng đại đao móc và hất tung mục tiêu địch bay ngược ra phía sau lưng bạn để đồng đội tập trung tiêu diệt (vũ khí bắt lẻ số 1 trong 5v5/Crystal League).',
    desc_en:
      'Hooks an enemy and flings them over your shoulder behind you while dealing physical damage.',
  },
  MAIN_SPEAR_KEEPER: {
    name_en: 'Spear Throw',
    name_vi: 'Phóng Lao Choáng Diện Rộng (Spear Throw)',
    cooldown: 20,
    energy: 15,
    cast_en: '0.4s',
    cast_vi: '0.4 giây',
    range_en: '15m',
    range_vi: '15m',
    desc_vi:
      'Phóng ngọn thương tầm xa 15m: khi trúng mục tiêu sẽ phát nổ làm Choáng (Stun) và gây sát thương vật lý lên toàn bộ kẻ địch trong bán kính 5m xung quanh.',
    desc_en:
      'Hurls your spear up to 15m, stunning and dealing AoE physical damage to all enemies in a 5m radius around the impact.',
  },
  '2H_HARPOON_HELL': {
    name_en: 'Corrupting Steel',
    name_vi: 'Lao Móc Phá Giáp Diện Rộng (Corrupting Steel)',
    cooldown: 20,
    energy: 17,
    cast_en: '0.5s',
    cast_vi: '0.5 giây',
    range_en: '18m',
    range_vi: '18m',
    desc_vi:
      'Phóng lao địa ngục xuống vùng chỉ định tạo thảm hủy diệt làm chậm 30% và giảm mạnh Giáp + Kháng Phép của toàn bộ đội hình địch (chuẩn Pierce ZvZ).',
    desc_en:
      'Hurls a hellish harpoon creating a corruption zone that slows by 30% and heavily shreds enemy Armor and Magic Resistance.',
  },
  '2H_TRIDENT_UNDEAD': {
    name_en: 'Spectral Trident',
    name_vi: 'Đinh Ba Bóng Ma (Spectral Trident)',
    cooldown: 20,
    energy: 16,
    cast_en: '0.6s Leap',
    cast_vi: 'Nhảy đâm 0.6s',
    range_en: '12m',
    range_vi: '12m',
    desc_vi:
      'Nhảy tới vùng chỉ định cắm đinh ba xuống đất: làm Choáng kẻ địch và tạo vùng ma giới tăng mạnh Tốc độ đánh + Hút máu cho bản thân và đồng minh.',
    desc_en:
      'Leaps to target area pinning foes and creating a spectral zone that massively boosts attack speed and lifesteal.',
  },
  MAIN_SPEAR_LANCE_AVALON: {
    name_en: 'Breakthrough',
    name_vi: 'Thương Kỵ Sĩ Thanh Trừng (Breakthrough)',
    cooldown: 20,
    energy: 16,
    cast_en: 'Instant Charge',
    cast_vi: 'Xung kích tức thì',
    range_en: '12m',
    range_vi: '12m',
    desc_vi:
      'Xung kích 12m trong trạng thái miễn nhiễm khống chế: gây sát thương, hất lùi và Thanh Trừng (Purge) mọi bùa lợi trên người kẻ địch trúng đòn.',
    desc_en:
      'Charges 12m while CC-immune, damaging, knocking back, and purging all positive buffs from enemies hit.',
  },
  '2H_GLAIVE_CRYSTAL': {
    name_en: 'Razor Rift',
    name_vi: 'Khe Nứt Không Gian Pha Lê (Razor Rift)',
    cooldown: 20,
    energy: 17,
    cast_en: '0.4s',
    cast_vi: '0.4 giây',
    range_en: '12m Line',
    range_vi: 'Đường thẳng 12m',
    desc_vi:
      'Chém rách không gian tạo khe nứt pha lê hút và gây sát thương vật lý diện rộng liên tục lên kẻ địch.',
    desc_en:
      'Tears open a crystal rift in a line that pulls and repeatedly damages enemies caught inside.',
  },

  // ============================================================================
  // 7. NATURE STAFFS (8 Variants)
  // ============================================================================
  MAIN_NATURESTAFF: {
    name_en: 'Circle of Life',
    name_vi: 'Vòng Tròn Sinh Mệnh (Circle of Life)',
    cooldown: 15,
    energy: 16,
    cast_en: '0.8s',
    cast_vi: '0.8 giây',
    range_en: '9m AoE',
    range_vi: '9m Diện rộng',
    desc_vi:
      'Tỏa sóng sinh mệnh bán kính 9m hồi máu ngay lập tức cho tối đa 5 đồng minh và xóa hiệu ứng bất lợi khi mục tiêu có đủ 3 tầng Rejuvenation.',
    desc_en:
      'Emits a 9m wave of nature magic healing up to 5 allies and cleansing debuffs on targets with 3 Rejuvenation stacks.',
  },
  '2H_NATURESTAFF': {
    name_en: 'Living Armor',
    name_vi: 'Giáp Sinh Mệnh Phản Hồi (Living Armor)',
    cooldown: 20,
    energy: 17,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '11m',
    range_vi: '11m',
    desc_vi:
      'Bao bọc mục tiêu trong Giáp Gai Sống suốt 5 giây: tăng mạnh Giáp/Kháng Phép và mỗi khi bị đánh sẽ tự động hồi lại một lượng máu lớn!',
    desc_en:
      'Wraps the target in Living Armor for 5s, boosting resistances and healing them every time they take direct damage.',
  },
  '2H_WILDSTAFF': {
    name_en: 'Well of Life',
    name_vi: 'Suối Nguồn Tươi Trẻ (Well of Life)',
    cooldown: 25,
    energy: 20,
    cast_en: '0.7s',
    cast_vi: '0.7 giây',
    range_en: '13m (7m AoE)',
    range_vi: '13m (Vùng 7m)',
    desc_vi:
      'Triệu hồi Suối Nguồn Sinh Mệnh bán kính 7m tồn tại 5 giây, hồi lượng máu khổng lồ mỗi giây cho tối đa 10 đồng minh đứng trong vùng.',
    desc_en:
      'Summons a 7m Well of Life for 5s that continuously heals up to 10 allies inside every second.',
  },
  MAIN_NATURESTAFF_KEEPER: {
    name_en: 'Spiritual Seed',
    name_vi: 'Hạt Giống Tâm Linh (Spiritual Seed)',
    cooldown: 20,
    energy: 16,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '11m',
    range_vi: '11m',
    desc_vi:
      'Gieo Hạt Giống Tâm Linh lên bản thân hoặc đồng minh. Sau 3 giây hạt giống nở rộ hồi lượng máu cực lớn. Có thể tái kích hoạt trong 2.5s để gieo thêm hạt thứ hai!',
    desc_en:
      'Plants a Spiritual Seed that blooms after 3s for a massive burst heal. Can be recast within 2.5s on a second target.',
    icon: 'Spiritual Seed',
  },
  '2H_NATURESTAFF_HELL': {
    name_en: 'Rutting / Euphoria',
    name_vi: 'Vũ Điệu Rừng Xanh (Blight Euphoria)',
    cooldown: 20,
    energy: 18,
    cast_en: '3.0s Moving Channel',
    cast_vi: 'Duy trì di chuyển 3.0s',
    range_en: '9m AoE',
    range_vi: '9m Diện rộng',
    desc_vi:
      'Vừa di chuyển nhanh (miễn nhiễm khống chế) vừa tỏa hào quang hồi máu liên tục suốt 3 giây cho tối đa 5 đồng minh xung quanh.',
    desc_en:
      'Channels for 3s while moving at increased speed and CC-immune, continuously healing up to 5 nearby allies.',
  },
  '2H_NATURESTAFF_KEEPER': {
    name_en: 'Spirit Animal',
    name_vi: 'Linh Thú Rừng Già (Spirit Animal)',
    cooldown: 25,
    energy: 20,
    cast_en: '0.5s',
    cast_vi: '0.5 giây',
    range_en: '20m Trail',
    range_vi: 'Đường chạy 20m',
    desc_vi:
      'Triệu hồi Linh Thú Hươu Thần chạy dọc chiến trường dài 20m, để lại thảm cỏ thánh hồi máu liên tục cho hàng chục đồng minh trong ZvZ.',
    desc_en:
      'Summons a forest spirit stag that charges 20m, leaving a lush trail that heals up to 10 allies continuously.',
  },
  MAIN_NATURESTAFF_AVALON: {
    name_en: 'Soul Link',
    name_vi: 'Liên Kết Linh Hồn Avalon (Soul Link)',
    cooldown: 16,
    energy: 14,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '14m',
    range_vi: '14m',
    desc_vi:
      'Liên kết sinh mệnh giữa 2 mục tiêu trong 5 giây: chia sẻ đều 50% sát thương nhận vào VÀ nhân bản toàn bộ lượng hồi máu nhận được giữa cả hai.',
    desc_en:
      'Links two targets for 5s, splitting incoming damage and duplicating all healing received between linked allies.',
  },
  MAIN_NATURESTAFF_CRYSTAL: {
    name_en: 'Entangling Bark',
    name_vi: 'Giáp Vỏ Cây Pha Lê (Entangling Bark)',
    cooldown: 20,
    energy: 16,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '11m',
    range_vi: '11m',
    desc_vi:
      'Tạo giáp vỏ cây pha lê bảo vệ đồng minh đồng thời phóng rễ cây trói chân kẻ địch xung quanh và hồi máu diện rộng.',
    desc_en:
      'Forms a crystal bark shield on an ally that roots nearby enemies on expiration while healing allies.',
  },

  // ============================================================================
  // 8. HOLY STAFFS (8 Variants)
  // ============================================================================
  MAIN_HOLYSTAFF: {
    name_en: 'Desperate Prayer',
    name_vi: 'Lời Cầu Nguyện Khẩn Cấp (Desperate Prayer)',
    cooldown: 15,
    energy: 14,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '11m',
    range_vi: '11m',
    desc_vi:
      'Hồi máu tức thì cho đồng minh. Nếu mục tiêu đang dưới 40% máu, lượng máu hồi được TĂNG GẤP ĐÔI (cứu nguy tức thì trong PvP/PvE).',
    desc_en:
      'Instantly heals a target ally. If the target is below 40% HP, the healing amount is massively increased.',
  },
  '2H_HOLYSTAFF': {
    name_en: 'Holy Explosion',
    name_vi: 'Bùng Nổ Ánh Sáng (Holy Explosion)',
    cooldown: 20,
    energy: 18,
    cast_en: '2.4s Channel',
    cast_vi: 'Duy trì 2.4s',
    range_en: '8m AoE',
    range_vi: '8m Diện rộng',
    desc_vi:
      'Tỏa sóng thánh quang đẩy lùi mọi kẻ địch áp sát đồng thời tăng kháng và hồi máu liên tục cho tối đa 5 đồng minh xung quanh.',
    desc_en:
      'Channels waves of holy light that knock back enemies while boosting resistances and healing up to 5 nearby allies.',
  },
  '2H_DIVINESTAFF': {
    name_en: 'Divine Protection',
    name_vi: 'Khiên Thánh Bảo Hộ (Divine Protection)',
    cooldown: 18,
    energy: 16,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '11m',
    range_vi: '11m',
    desc_vi:
      'Ban Khiên Thánh khổng lồ hấp thụ sát thương cho đồng minh trong 4 giây. Khi khiên kết thúc sẽ tự động hồi thêm một lượng máu lớn.',
    desc_en:
      'Grants a massive damage-absorbing shield to an ally for 4s that heals the target when the shield expires.',
  },
  MAIN_HOLYSTAFF_MORGANA: {
    name_en: 'Holy Touch',
    name_vi: 'Chạm Tay Cứu Rỗi (Holy Touch)',
    cooldown: 18,
    energy: 15,
    cast_en: '2.5s Channel',
    cast_vi: 'Duy trì 2.5s',
    range_en: '7m',
    range_vi: '7m',
    desc_vi:
      'Hồi lượng máu cực lớn mỗi 0.5s cho mục tiêu đồng thời khiến mục tiêu MIỄN NHIỄM MỌI KHỐNG CHẾ và xóa sạch hiệu ứng bất lợi.',
    desc_en:
      'Channels a powerful beam onto an ally, cleansing all debuffs, granting CC immunity, and healing heavily over 2.5s.',
  },
  '2H_HOLYSTAFF_HELL': {
    name_en: 'Salvation',
    name_vi: 'Vùng Đất Cứu Rỗi (Salvation)',
    cooldown: 25,
    energy: 21,
    cast_en: '0.6s',
    cast_vi: '0.6 giây',
    range_en: '14m (6m AoE)',
    range_vi: '14m (Vùng 6m)',
    desc_vi:
      'Giáng cột sáng cứu rỗi xuống vùng chỉ định: sau 1.2s sẽ Thanh Tẩy mọi khống chế/debuff và hồi lượng máu khổng lồ cho tối đa 10 đồng minh.',
    desc_en:
      'Calls down a sanctified zone that erupts after 1.2s, cleansing all CC/debuffs and burst-healing up to 10 allies.',
  },
  '2H_HOLYSTAFF_UNDEAD': {
    name_en: 'Celestial Sphere',
    name_vi: 'Quả Cầu Thiên Giới Nảy Bật (Celestial Sphere)',
    cooldown: 20,
    energy: 18,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '12m',
    range_vi: '12m',
    desc_vi:
      'Phóng quả cầu ánh sáng nảy qua lại tới 10 lần giữa các đồng minh đứng gần nhau, hồi máu mỗi lần chạm.',
    desc_en:
      'Launches an orb of light that bounces up to 10 times between nearby allies, healing on every bounce.',
  },
  MAIN_HOLYSTAFF_AVALON: {
    name_en: 'Divine Intervention',
    name_vi: 'Thiên Thần Giáng Thế Hallowfall (Divine Intervention)',
    cooldown: 20,
    energy: 17,
    cast_en: 'Instant Leap',
    cast_vi: 'Bay đáp tức thì',
    range_en: '13m Leap',
    range_vi: 'Bay 13m',
    desc_vi:
      'Bay vọt tới vị trí chỉ định với đôi cánh ánh sáng Avalon: Hất tung mọi kẻ địch và Hồi lượng máu lớn cho đồng minh xung quanh (giảm 35% hồi chiêu nếu cứu đồng minh).',
    desc_en:
      'Soars to target location on wings of light, knocking enemies airborne and healing allies while refunding 35% cooldown on ally hit.',
  },
  '2H_HOLYSTAFF_CRYSTAL': {
    name_en: 'Sanctify',
    name_vi: 'Thánh Tẩy Pha Lê (Sanctify)',
    cooldown: 22,
    energy: 18,
    cast_en: '0.4s',
    cast_vi: '0.4 giây',
    range_en: '13m',
    range_vi: '13m',
    desc_vi:
      'Tạo vùng thánh quang pha lê xóa bỏ toàn bộ vùng hiệu ứng mặt đất của kẻ địch đồng thời hồi máu và tăng kháng cho đồng đội.',
    desc_en:
      'Purifies the target area, removing enemy ground effects while healing and shielding allies inside.',
  },

  // ============================================================================
  // 9. FIRE, FROST, CURSED & ARCANE STAFFS (Mage Trees)
  // ============================================================================
  MAIN_FIRESTAFF: {
    name_en: 'Pyroblast',
    name_vi: 'Đại Cầu Lửa (Pyroblast)',
    cooldown: 15,
    energy: 14,
    cast_en: '1.2s Cast',
    cast_vi: 'Niệm 1.2s',
    range_en: '18m',
    range_vi: '18m',
    desc_vi:
      'Tụ năng lượng hỏa cầu và bắn thẳng vào mục tiêu gây sát thương phép thuật đơn mục tiêu cực lớn kèm đẩy lùi và thiêu đốt.',
    desc_en:
      'Hurls a massive fireball up to 18m dealing heavy single-target magic damage, knocking back, and igniting the target.',
  },
  '2H_FIRESTAFF': {
    name_en: 'Pillar of Fire',
    name_vi: 'Cột Lửa Huỷ Diệt (Pillar of Fire)',
    cooldown: 15,
    energy: 15,
    cast_en: '0.6s',
    cast_vi: '0.6 giây',
    range_en: '15m (4m AoE)',
    range_vi: '15m (Vùng 4m)',
    desc_vi:
      'Triệu hồi cột lửa phun trào tại vùng chỉ định gây sát thương phép diện rộng lớn với thời gian hồi chiêu cực ngắn.',
    desc_en:
      'Erupts a pillar of fire at the target location dealing high AoE magic damage on a short cooldown.',
  },
  '2H_INFERNOSTAFF': {
    name_en: 'Combustion',
    name_vi: 'Bùng Cháy Hoảng Loạn (Combustion)',
    cooldown: 20,
    energy: 16,
    cast_en: '0.4s',
    cast_vi: '0.4 giây',
    range_en: '13m',
    range_vi: '13m',
    desc_vi:
      'Đốt cháy mục tiêu gây Hoảng Sợ (Fear) và để lại vệt lửa dưới chân nạn nhân thiêu đốt mọi kẻ địch xung quanh.',
    desc_en:
      'Ignites an enemy in terror, causing them to flee in Fear while leaving a burning trail that damages nearby foes.',
  },
  MAIN_FIRESTAFF_KEEPER: {
    name_en: 'Magma Sphere',
    name_vi: 'Cầu Dung Nham Lăn (Magma Sphere)',
    cooldown: 20,
    energy: 16,
    cast_en: '0.7s',
    cast_vi: '0.7 giây',
    range_en: '18m Line',
    range_vi: 'Đường thẳng 18m',
    desc_vi:
      'Lăn quả cầu dung nham khổng lồ xuyên qua đội hình địch gây sát thương phép diện rộng và đốt cháy theo % máu tối đa.',
    desc_en:
      'Rolls a boulder of molten magma in an 18m line dealing heavy AoE magic damage plus % Max HP burn.',
  },
  '2H_FIRESTAFF_HELL': {
    name_en: 'Meteor',
    name_vi: 'Thiên Thạch Huỷ Diệt (Meteor)',
    cooldown: 25,
    energy: 20,
    cast_en: '1.2s',
    cast_vi: '1.2 giây',
    range_en: '16m (5.5m AoE)',
    range_vi: '16m (Vùng 5.5m)',
    desc_vi:
      'Gọi thiên thạch khổng lồ rơi xuống vùng chỉ định: gây lượng sát thương phép diện rộng cao bậc nhất trò chơi, hất văng và đốt cháy toàn bộ mặt đất.',
    desc_en:
      'Calls down a gigantic meteor onto the target area, dealing devastating AoE magic damage, knocking back, and burning the ground.',
  },
  '2H_INFERNOSTAFF_MORGANA': {
    name_en: 'Flame Tornado',
    name_vi: 'Bão Lửa Blazing (Flame Tornado)',
    cooldown: 25,
    energy: 19,
    cast_en: '0.8s',
    cast_vi: '0.8 giây',
    range_en: '14m (5m AoE)',
    range_vi: '14m (Vùng 5m)',
    desc_vi:
      'Triệu hồi cơn lốc xoáy lửa rực cháy tồn tại 5 giây, gây sát thương phép khổng lồ mỗi 0.5s lên mọi mục tiêu bị khóa chân bên trong.',
    desc_en:
      'Conjures a raging flame tornado for 5s that deals extreme continuous AoE magic damage to all enemies inside.',
  },
  '2H_FIRE_RINGPAIR_AVALON': {
    name_en: 'Flaming Phoenix',
    name_vi: 'Phượng Hoàng Lửa Avalon (Flaming Phoenix)',
    cooldown: 20,
    energy: 18,
    cast_en: '0.6s',
    cast_vi: '0.6 giây',
    range_en: '20m Line',
    range_vi: 'Đường bay 20m',
    desc_vi:
      'Phóng Phượng Hoàng Lửa Avalon bay dọc 20m: gây sát thương phép lớn, làm chậm và cắt giảm 30% lượng hồi máu của toàn bộ kẻ địch trúng chiêu.',
    desc_en:
      'Releases an Avalonian fire phoenix soaring 20m, dealing heavy AoE magic damage, slowing, and reducing enemy healing by 30%.',
  },
  MAIN_FIRESTAFF_CRYSTAL: {
    name_en: 'Spontaneous Combustion',
    name_vi: 'Biến Hình Hoả Tinh Pha Lê (Spontaneous Combustion)',
    cooldown: 20,
    energy: 16,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '12m',
    range_vi: '12m',
    desc_vi:
      'Hóa thân thành cầu lửa pha lê bay thẳng tới mục tiêu và phát nổ diện rộng gây sát thương phép cực lớn.',
    desc_en:
      'Transforms into a living crystal fireball, flying to the target and exploding for heavy AoE magic damage.',
  },

  // CURSED STAFFS
  MAIN_CURSEDSTAFF: {
    name_en: 'Death Curse',
    name_vi: 'Lời Nguyền Tử Vong (Death Curse)',
    cooldown: 20,
    energy: 16,
    cast_en: '0.5s',
    cast_vi: '0.5 giây',
    range_en: '11m',
    range_vi: '11m',
    desc_vi:
      'Khắc lời nguyền tử thần lên mục tiêu. Sau 5 giây lời nguyền phát nổ gây lượng sát thương khổng lồ tính theo số tầng Vile Curse đang có trên người nạn nhân.',
    desc_en:
      'Brands the target with a Death Curse that detonates after 5s for massive burst damage scaling with active Vile Curse stacks.',
  },
  '2H_CURSEDSTAFF': {
    name_en: 'Area of Decay',
    name_vi: 'Vùng Đất Thối Rữa (Area of Decay)',
    cooldown: 20,
    energy: 18,
    cast_en: '2.4s Channel',
    cast_vi: 'Duy trì 2.4s',
    range_en: '13m (5m AoE)',
    range_vi: '13m (Vùng 5m)',
    desc_vi:
      'Xóa sạch mọi bùa lợi Hồi máu theo thời gian (HoT) của địch và tích liên tục 4 tầng Vile Curse lên toàn bộ mục tiêu trong vùng.',
    desc_en:
      'Purges all Heal-over-Time effects in a 5m radius while rapidly applying Vile Curse stacks to all enemies.',
  },
  '2H_DEMONICSTAFF': {
    name_en: 'Field of Death',
    name_vi: 'Cánh Đồng Tử Thần Cấm Hồi Máu (Field of Death)',
    cooldown: 20,
    energy: 17,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '13m',
    range_vi: '13m',
    desc_vi:
      'Phủ đám mây hắc ám giảm 45% hiệu lực hồi máu và ngăn mục tiêu nhận bất kỳ sự cứu chữa hiệu quả nào từ Healer.',
    desc_en:
      'Unleashes a dark cloud that deals damage over time and reduces enemy healing received by 45%.',
  },
  MAIN_CURSEDSTAFF_UNDEAD: {
    name_en: 'Enfeeble Blades',
    name_vi: 'Lưỡi Đao Suy Yếu Thanh Trừng (Enfeeble Blades)',
    cooldown: 20,
    energy: 17,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '12m (5m AoE)',
    range_vi: '12m (Vùng 5m)',
    desc_vi:
      'Triệu hồi vòng lưỡi đao bóng ma xoay 4 giây: xóa bỏ mọi bùa lợi (Purge) và làm giảm tới 36% sát thương gây ra của toàn bộ kẻ địch trong vùng.',
    desc_en:
      'Summons spinning spectral blades for 4s that purge all positive buffs and reduce enemy damage output by up to 36%.',
  },
  '2H_SKULLORB_HELL': {
    name_en: 'Haunting Screams',
    name_vi: 'Đầu Lâu Hút Máu Chuẩn (Haunting Screams)',
    cooldown: 20,
    energy: 18,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '13m (5m AoE)',
    range_vi: '13m (Vùng 5m)',
    desc_vi:
      'Triệu hồi vùng oán hồn di chuyển chậm, gây sát thương phép diện rộng cộng thêm sát thương chuẩn (True Damage) theo % máu tối đa của tướng địch.',
    desc_en:
      'Summons a creeping zone of wailing skulls dealing AoE magic damage plus % Max HP true damage against players.',
  },
  '2H_CURSEDSTAFF_MORGANA': {
    name_en: 'Cataclysm',
    name_vi: 'Đại Thảm Họa Phá Giáp (Cataclysm)',
    cooldown: 25,
    energy: 20,
    cast_en: '1.5s Cast',
    cast_vi: 'Niệm 1.5s',
    range_en: '14m (9m AoE)',
    range_vi: '14m (Bán kính 9m)',
    desc_vi:
      'Nguyền rủa một vùng rộng lớn bán kính 9m, gây sát thương phép và giảm mạnh kháng vật lý/kháng phép của toàn bộ đội hình địch trong ZvZ.',
    desc_en:
      'Curses a massive 9m radius zone, dealing AoE magic damage and heavily shredding the Armor and Magic Resistance of all enemies hit.',
  },
  MAIN_CURSEDSTAFF_AVALON: {
    name_en: 'Inner Shadow',
    name_vi: 'Bóng Tối Nội Tâm Shadowcaller (Inner Shadow)',
    cooldown: 20,
    energy: 16,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '11m',
    range_vi: '11m',
    desc_vi:
      'Triệu hồi Bóng Tối Nội Tâm biến đổi theo lớp giáp của mục tiêu: Áo Da tạo vòng Hút Máu diện rộng cực khủng (vua Solo Static Dungeon), Áo Sắt phá giáp diện rộng, Áo Vải nổ sát thương.',
    desc_en:
      'Summons an Inner Shadow adapting to the target chest armor: Leather grants massive AoE Lifesteal, Plate shreds resistances, Cloth detonates for AoE burst.',
  },
  MAIN_CURSEDSTAFF_CRYSTAL: {
    name_en: 'Plaguebringer',
    name_vi: 'Chiến Xa Dịch Bệnh Pha Lê (Plaguebringer)',
    cooldown: 20,
    energy: 17,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '14m',
    range_vi: '14m',
    desc_vi:
      'Phóng chiến xa dịch bệnh pha lê phát tán cộng dồn nguyền rủa và giảm hồi máu diện rộng.',
    desc_en:
      'Launches a crystal plague phantom that spreads Vile Curse stacks and anti-heal across a wide area.',
  },

  // ============================================================================
  // 10. CHEST ARMORS (Plate / Leather / Cloth / Royal)
  // ============================================================================
  ARMOR_PLATE_SET1: {
    name_en: 'Fury',
    name_vi: 'Cuồng Nộ Tăng Sát Thương (Fury)',
    cooldown: 30,
    energy: 10,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: 'Self',
    range_vi: 'Bản thân',
    desc_vi:
      'Trong 8 giây, mỗi khi nhận sát thương bạn được cộng dồn tăng tới 50% sát thương kỹ năng và 40% hiệu lực khống chế (tối đa 10 tầng).',
    desc_en:
      'For 8s, every time you take damage you gain a stack increasing ability damage up to 50% and CC duration up to 40%.',
  },
  ARMOR_PLATE_SET2: {
    name_en: 'Wind Wall',
    name_vi: 'Tường Gió Chặn Địch (Wind Wall)',
    cooldown: 35,
    energy: 12,
    cast_en: 'Channel 4.5s',
    cast_vi: 'Duy trì 4.5s',
    range_en: '8m Wall',
    range_vi: 'Tường dài 8m',
    desc_vi:
      'Dựng bức tường gió dài 8m đẩy lùi liên tục mọi kẻ địch tìm cách bước qua và tăng kháng cho đồng minh.',
    desc_en:
      'Creates an 8m wind barrier that repeatedly knocks back all enemies attempting to cross it.',
  },
  ARMOR_PLATE_SET3: {
    name_en: 'Enfeeble Aura',
    name_vi: 'Hào Quang Suy Yếu (Enfeeble Aura)',
    cooldown: 35,
    energy: 12,
    cast_en: 'Channel / Aura 6s',
    cast_vi: 'Hào quang 6s',
    range_en: '7m AoE',
    range_vi: '7m Diện rộng',
    desc_vi:
      'Tỏa hào quang bán kính 7m làm giảm 55% sát thương gây ra, làm chậm 20% và làm lộ diện tàng hình của toàn bộ kẻ địch xung quanh.',
    desc_en:
      'Emits a 7m aura that reduces enemy damage output by 55%, slows them by 20%, and reveals invisible foes.',
  },
  ARMOR_PLATE_UNDEAD: {
    name_en: 'Soul Chain',
    name_vi: 'Xiềng Xích Linh Hồn Kéo Địch (Soul Chain)',
    cooldown: 35,
    energy: 12,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '12m',
    range_vi: '12m',
    desc_vi:
      'Phóng xiềng xích trói chặt mục tiêu và sau 2.5 giây kéo giật nạn nhân về vị trí của bạn.',
    desc_en:
      'Tethers an enemy with a soul chain and yanks them back to your position after 2.5s.',
  },
  ARMOR_PLATE_HELL: {
    name_en: 'Armor Aura / Reflect',
    name_vi: 'Hào Quang Phản Sát Thương (Demon Armor)',
    cooldown: 40,
    energy: 14,
    cast_en: 'Channel 4.5s',
    cast_vi: 'Duy trì 4.5s',
    range_en: '8m AoE',
    range_vi: '8m Diện rộng',
    desc_vi:
      'Tạo hào quang cho tối đa 5 đồng minh xung quanh: tăng mạnh Giáp và phản lại 35% sát thương phép/vật lý về phía kẻ tấn công.',
    desc_en:
      'Grants up to 5 nearby allies increased resistances and reflects 35% of incoming damage back to attackers.',
  },
  ARMOR_PLATE_KEEPER: {
    name_en: 'Force Shield',
    name_vi: 'Vòm Khiên Bảo Hộ Judicator (Force Shield)',
    cooldown: 40,
    energy: 14,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '6m Dome',
    range_vi: 'Vòm khiên 6m',
    desc_vi:
      'Dựng vòm thánh địa tồn tại 6 giây: tăng mạnh Giáp/Kháng Phép và tăng 25% toàn bộ lượng máu hồi nhận vào cho mọi đồng minh bên trong.',
    desc_en:
      'Deploys a 6m protective dome for 6s that massively boosts resistances and increases healing received by 25% for allies inside.',
  },
  ARMOR_PLATE_FEY: {
    name_en: 'Web Spindle',
    name_vi: 'Lưới Nhện Giữ Chân Duskweaver (Web Spindle)',
    cooldown: 30,
    energy: 11,
    cast_en: 'Instant (2 Casts)',
    cast_vi: '2 Lần kích hoạt',
    range_en: '10m',
    range_vi: '10m',
    desc_vi:
      'Phóng tơ nhện làm chậm cực mạnh, xóa mọi kỹ năng chạy nước rút (Purge Sprint) và kéo lùi kẻ địch.',
    desc_en:
      'Shoots spider webs that purge enemy sprint buffs, heavily slow, and pull targets back.',
  },
  ARMOR_PLATE_AVALON: {
    name_en: 'Rebuking Shield',
    name_vi: 'Khiên Phản Pháo Ánh Sáng (Rebuking Shield)',
    cooldown: 30,
    energy: 11,
    cast_en: 'Channel 2.5s',
    cast_vi: 'Đỡ đòn 2.5s',
    range_en: 'Self / 9m Cone',
    range_vi: 'Bản thân / 9m',
    desc_vi:
      'Dựng khiên ánh sáng Avalon tăng phòng thủ tối đa; khi bị đánh sẽ phóng sóng ánh sáng làm Câm Lặng (Silence) và gây sát thương lên kẻ địch.',
    desc_en:
      'Raises an Avalonian shield boosting defense and unleashing silencing waves of light when struck.',
  },

  // LEATHER JACKETS
  ARMOR_LEATHER_SET1: {
    name_en: 'Bloodlust',
    name_vi: 'Khát Máu Hồi Phục (Bloodlust)',
    cooldown: 45,
    energy: 10,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: 'Self',
    range_vi: 'Bản thân',
    desc_vi:
      'Trong 6 giây (tối đa 7 lần kích hoạt), mỗi lần bạn gây sát thương trực tiếp sẽ hồi ngay một lượng máu lớn cho bản thân (áo quốc dân Solo PvE/PvP).',
    desc_en:
      'For 6s (up to 7 hits), every time you deal direct damage you heal yourself for a significant amount of HP.',
  },
  ARMOR_LEATHER_SET2: {
    name_en: 'Haste',
    name_vi: 'Tăng Tốc Đánh Cực Đại (Haste)',
    cooldown: 35,
    energy: 10,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: 'Self',
    range_vi: 'Bản thân',
    desc_vi:
      'Tăng 45% tốc độ đánh thường và tăng 20% toàn bộ sát thương gây ra trong 6 giây.',
    desc_en:
      'Increases normal attack speed by 45% and boosts all damage dealt by 20% for 6 seconds.',
  },
  ARMOR_LEATHER_SET3: {
    name_en: 'Ambush',
    name_vi: 'Ẩn Thân Phục Kích (Ambush)',
    cooldown: 40,
    energy: 10,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: 'Self',
    range_vi: 'Bản thân',
    desc_vi:
      'Tàng hình ngay lập tức trong tối đa 7 giây. Đòn đánh tiếp theo sau khi hiện hình được tăng tới 40% sát thương.',
    desc_en:
      'Turns invisible for up to 7s. Staying invisible stacks a damage buff up to +40% for your first attack out of stealth.',
  },
  ARMOR_LEATHER_MORGANA: {
    name_en: 'Electric Field',
    name_vi: 'Trường Điện Giật Stalker (Electric Field)',
    cooldown: 30,
    energy: 12,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '5.5m AoE',
    range_vi: '5.5m Diện rộng',
    desc_vi:
      'Tỏa trường điện cao thế quanh người trong 4.5 giây, giật sét liên tục gây sát thương phép diện rộng lớn mỗi 0.5s.',
    desc_en:
      'Surrounds yourself with an electric storm for 4.5s, dealing rapid AoE magic damage every 0.5s to nearby foes.',
  },
  ARMOR_LEATHER_HELL: {
    name_en: 'Life Steal Aura',
    name_vi: 'Hào Quang Hút Máu Hellion (Life Steal Aura)',
    cooldown: 45,
    energy: 14,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '6m AoE',
    range_vi: '6m Diện rộng',
    desc_vi:
      'Tạo vòng hào quang huyết quỷ bán kính 6m trong 5.5 giây: gây sát thương bóng tối lên tối đa 5 kẻ địch và hút máu cực mạnh (càng thấp máu càng hút nhiều!).',
    desc_en:
      'Projects a 6m vampiric aura for 5.5s that drains HP from up to 5 enemies and heals you (healing scales higher the lower your HP is).',
  },
  ARMOR_LEATHER_UNDEAD: {
    name_en: 'Self Ignition',
    name_vi: 'Ngọn Lửa Thiêu Đốt Specter (Self Ignition)',
    cooldown: 30,
    energy: 0,
    cast_en: 'Toggle',
    cast_vi: 'Bật / Tắt',
    range_en: '5.5m AoE',
    range_vi: '5.5m Diện rộng',
    desc_vi:
      'Tự đốt cháy bản thân để tỏa hào quang lửa thiêu rụi quái vật và kẻ địch xung quanh với sát thương chuẩn cực lớn.',
    desc_en:
      'Engulfs yourself in spectral flames, burning your own HP to deal massive continuous AoE damage to nearby enemies.',
  },
  ARMOR_LEATHER_FEY: {
    name_en: 'Mist Cloud',
    name_vi: 'Màn Sương Bất Tử Mistwalker (Mist Cloud)',
    cooldown: 40,
    energy: 14,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: 'Self',
    range_vi: 'Bản thân',
    desc_vi:
      'Hóa thân thành sương mù trong 5 giây: hoàn toàn Tàng hình và MIỄN NHIỄM MỌI SÁT THƯƠNG & KHỐNG CHẾ khi đang di chuyển (chỉ lộ diện trong thoáng chốc khi tung chiêu).',
    desc_en:
      'Envelops you in mystical mist for 5s, making you invisible and completely immune to all damage and CC except briefly while attacking.',
  },
  ARMOR_LEATHER_AVALON: {
    name_en: 'Dynamic Defense',
    name_vi: 'Phòng Thủ Động Lực Avalon (Dynamic Defense)',
    cooldown: 25,
    energy: 10,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: 'Self',
    range_vi: 'Bản thân',
    desc_vi:
      'Tăng mạnh sát thương gây ra và kháng sát thương vật lý/phép thuật tùy theo loại sát thương vừa nhận.',
    desc_en:
      'Dynamically boosts your damage output and massively increases either Physical or Magical resistance for 5s.',
  },

  // CLOTH ROBES
  ARMOR_CLOTH_SET1: {
    name_en: 'Speed Caster',
    name_vi: 'Niệm Phép Thần Tốc (Speed Caster)',
    cooldown: 35,
    energy: 8,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: 'Self',
    range_vi: 'Bản thân',
    desc_vi:
      'Trong 6 giây: Giảm 55% thời gian niệm phép (Cast Time), giảm 55% tiêu hao năng lượng và miễn nhiễm ngắt chiêu khi bị đánh.',
    desc_en:
      'For 6s, reduces cast times by 55%, reduces energy costs by 55%, and prevents spell interruption from damage.',
  },
  ARMOR_CLOTH_SET2: {
    name_en: 'Everlasting Spirit',
    name_vi: 'Khiên Bất Tử Cleric (Everlasting Spirit)',
    cooldown: 45,
    energy: 10,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: 'Self',
    range_vi: 'Bản thân',
    desc_vi:
      'Nếu nhận sát thương trong 1.5s kích hoạt: Bạn trở nên BẤT TỬ (miễn nhiễm 100% sát thương) và tăng 20% toàn bộ sát thương & hồi máu trong 3 giây!',
    desc_en:
      'If you take damage within 1.5s of activation, grants a 3s invulnerability shield (100% damage immunity) and +20% damage/healing.',
  },
  ARMOR_CLOTH_SET3: {
    name_en: 'Purging Shield',
    name_vi: 'Khiên Thanh Trừng Mage Robe (Purging Shield)',
    cooldown: 40,
    energy: 10,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: 'Self',
    range_vi: 'Bản thân',
    desc_vi:
      'Tăng Giáp & Kháng Phép trong 5 giây. Bất kỳ kẻ địch nào đánh vào bạn sẽ bị XÓA SẠCH MỌI BÙA LỢI (Purge) ngay lập tức!',
    desc_en:
      'Increases resistances for 5s. Any enemy that deals direct damage to you immediately has all their positive buffs purged.',
  },
  ARMOR_CLOTH_KEEPER: {
    name_en: 'Obsessive Burst',
    name_vi: 'Cuồng Phép Cộng Dồn Druid Robe (Obsessive Burst)',
    cooldown: 40,
    energy: 12,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: 'Self',
    range_vi: 'Bản thân',
    desc_vi:
      'Trong 10 giây, mỗi kỹ năng bạn tung ra sẽ cộng dồn +6% Sát thương và Hồi máu (tối đa 6 tầng = +36% Sát thương/Hồi máu!).',
    desc_en:
      'For 10s, every ability cast grants a stack of +6% damage and healing power (stacking up to 6 times for +36% output).',
  },
  ARMOR_CLOTH_HELL: {
    name_en: 'Fear Aura',
    name_vi: 'Hào Quang Hoảng Sợ Fiend Robe (Fear Aura)',
    cooldown: 40,
    energy: 12,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '5m AoE',
    range_vi: '5m Diện rộng',
    desc_vi:
      'Tỏa hào quang ác quỷ làm mọi kẻ địch lại gần bị Hoảng Sợ (Fear) bỏ chạy tán loạn, dùng để chia cắt đội hình hoặc bảo vệ Healer.',
    desc_en:
      'Emits a demonic aura for 4s that causes any enemy coming within 5m to flee in Fear.',
  },
  ARMOR_CLOTH_MORGANA: {
    name_en: 'Levitate',
    name_vi: 'Lơ Lửng Hồi Máu Cultist Robe (Levitate)',
    cooldown: 45,
    energy: 0,
    cast_en: 'Channel 4.5s',
    cast_vi: 'Lơ lửng 4.5s',
    range_en: 'Self',
    range_vi: 'Bản thân',
    desc_vi:
      'Bay lơ lửng trên không trung: Miễn nhiễm hoàn toàn sát thương vật lý và hồi phục tới 45% Máu + Năng lượng tối đa.',
    desc_en:
      'Levitates in mid-air for up to 4.5s, becoming immune to physical damage while restoring up to 45% Max HP and Energy.',
  },
  ARMOR_CLOTH_FEY: {
    name_en: 'Wild Magic',
    name_vi: 'Ma Thuật Cổ Tích Feyscale (Wild Magic)',
    cooldown: 35,
    energy: 12,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: 'Self',
    range_vi: 'Bản thân',
    desc_vi:
      'Xoay vòng 3 phép thuật Fey: Vòng Lửa tăng sát thương, Vòng Bão làm chậm/đẩy lùi kẻ địch, hoặc Mảnh Vỡ Băng bảo vệ bản thân.',
    desc_en:
      'Cycles between 3 Fey enchantments: Ring of Fire (+Damage), Storm Shield (Slow/Knockback), or Frozen Fragments (Defense & Burst).',
  },
  ARMOR_CLOTH_AVALON: {
    name_en: 'Forceful Knockback',
    name_vi: 'Khiên Đẩy Lùi Ánh Sáng Robe of Purity',
    cooldown: 35,
    energy: 12,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: 'Self',
    range_vi: 'Bản thân',
    desc_vi:
      'Bao bọc bản thân trong quả cầu ánh sáng Avalon: tăng sát thương và hất văng mọi kẻ địch chạm vào ra xa 10m.',
    desc_en:
      'Encloses you in an orb of Avalonian light that boosts spell damage and violently knocks back any enemy that touches you.',
  },

  // ============================================================================
  // 11. HELMETS (Head Slot)
  // ============================================================================
  HEAD_PLATE_SET1: {
    name_en: 'Block',
    name_vi: 'Khiên Chắn Bất Tử (Soldier Block)',
    cooldown: 30,
    energy: 6,
    cast_en: 'Channel 2.0s',
    cast_vi: 'Đỡ đòn 2.0s',
    range_en: 'Self',
    range_vi: 'Bản thân',
    desc_vi:
      'Giơ khiên chặn đứng 100% sát thương và mọi hiệu ứng khống chế trong 2 giây trong khi vẫn có thể di chuyển.',
    desc_en:
      'Blocks 100% of incoming damage and crowd control effects for 2s while moving.',
  },
  HEAD_PLATE_SET2: {
    name_en: 'Displacement Immunity',
    name_vi: 'Kháng Hất Tung & Đẩy Lùi (Knight Helmet)',
    cooldown: 30,
    energy: 7,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '7m AoE',
    range_vi: '7m Diện rộng',
    desc_vi:
      'Giúp bản thân và tối đa 5 đồng minh xung quanh miễn nhiễm hoàn toàn với mọi kỹ năng Hất tung, Đẩy lùi và Kéo giật trong 5 giây.',
    desc_en:
      'Grants you and up to 5 nearby allies complete immunity to Knockback, Pull, and Airborne effects for 5s.',
  },
  HEAD_PLATE_SET3: {
    name_en: 'Emergency Shield',
    name_vi: 'Khiên Khẩn Cấp Xóa Chảy Máu (Guardian Helmet)',
    cooldown: 30,
    energy: 7,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: 'Self / 6m',
    range_vi: 'Bản thân / 6m',
    desc_vi:
      'Tạo khiên chắn hấp thụ sát thương và xóa bỏ ngay lập tức mọi hiệu ứng sát thương theo thời gian (Chảy máu / Nguyền rủa / Đốt lửa).',
    desc_en:
      'Grants a damage-absorbing shield and immediately cleanses all Damage-over-Time effects (Bleed, Curse, Burn).',
  },
  HEAD_PLATE_HELL: {
    name_en: 'Hush',
    name_vi: 'Đòn Đánh Câm Lặng Demon Helmet (Hush)',
    cooldown: 35,
    energy: 8,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: 'Next Attack',
    range_vi: 'Đòn đánh kế',
    desc_vi:
      'Cường hóa đòn đánh thường kế tiếp gây Câm Lặng (Silence) mục tiêu tới 4.2 giây, khóa hoàn toàn khả năng tung chiêu của địch.',
    desc_en:
      'Empowers your next normal attack to Silence the target for up to 4.2s.',
  },
  HEAD_PLATE_KEEPER: {
    name_en: 'Electric Discharge',
    name_vi: 'Sóng Điện Choáng Diện Rộng (Judicator Helmet)',
    cooldown: 35,
    energy: 9,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '10m Cone',
    range_vi: 'Hình nón 10m',
    desc_vi:
      'Phóng luồng điện hình nón làm Choáng (Stun) mọi kẻ địch phía trước mặt.',
    desc_en:
      'Releases a frontal wave of electricity that stuns all enemies hit.',
  },
  HEAD_PLATE_AVALON: {
    name_en: 'Purifying Smoke',
    name_vi: 'Khói Thanh Trừng Diện Rộng (Helmet of Valor)',
    cooldown: 30,
    energy: 8,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '12m (4.5m AoE)',
    range_vi: '12m (Vùng 4.5m)',
    desc_vi:
      'Ném quả cầu ánh sáng xóa bỏ mọi bùa lợi của kẻ địch đồng thời giải trừ khống chế cho đồng minh trong vùng.',
    desc_en:
      'Purges all positive buffs from enemies while cleansing crowd control from allies in the target area.',
  },
  HEAD_LEATHER_SET1: {
    name_en: 'Cleanse',
    name_vi: 'Thanh Tẩy Khống Chế & Làm Chậm (Mercenary Hood)',
    cooldown: 25,
    energy: 6,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '6m AoE',
    range_vi: '6m Diện rộng',
    desc_vi:
      'Xóa sạch mọi hiệu ứng khống chế trên bản thân và đồng minh, đồng thời làm chậm và giảm sát thương của kẻ địch xung quanh.',
    desc_en:
      'Cleanses crowd control from yourself and nearby allies while slowing and weakening nearby foes.',
  },
  HEAD_LEATHER_SET2: {
    name_en: 'Retaliate',
    name_vi: 'Khiên Phản Đòn Hunter Hood (Retaliate)',
    cooldown: 30,
    energy: 7,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: 'Self',
    range_vi: 'Bản thân',
    desc_vi:
      'Tăng mạnh Giáp/Kháng Phép và phản lại 85% toàn bộ sát thương nhận vào trực tiếp về phía kẻ tấn công trong 3.5 giây.',
    desc_en:
      'Increases resistances and reflects 85% of incoming damage back to the attacker for 3.5s.',
  },
  HEAD_LEATHER_SET3: {
    name_en: 'Meditation',
    name_vi: 'Thiền Định Giảm Hồi Chiêu (Assassin Hood)',
    cooldown: 40,
    energy: 0,
    cast_en: 'Channel 1.8s',
    cast_vi: 'Thiền 1.8s',
    range_en: 'Self',
    range_vi: 'Bản thân',
    desc_vi:
      'Thiền định trong 1.8 giây để rút ngắn ngay lập tức 60% thời gian hồi chiêu của toàn bộ kỹ năng đang chờ!',
    desc_en:
      'Channels meditation for 1.8s, accelerating all your active ability cooldowns by 60%.',
  },
  HEAD_LEATHER_MORGANA: {
    name_en: 'Mortal Agony',
    name_vi: 'Phá Giáp Tử Thần Stalker Hood (Mortal Agony)',
    cooldown: 25,
    energy: 7,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '6m AoE',
    range_vi: '6m Diện rộng',
    desc_vi:
      'Tăng 15% sát thương bản thân, làm lộ diện tàng hình và giảm mạnh Giáp của mọi kẻ địch dưới 50% máu trong bán kính 6m.',
    desc_en:
      'Increases your damage by 15%, reveals invisible enemies, and shreds resistances of foes below 50% HP.',
  },
  HEAD_LEATHER_HELL: {
    name_en: 'Smoke Bomb',
    name_vi: 'Bom Khói Tàng Hình & Câm Lặng (Hellion Hood)',
    cooldown: 35,
    energy: 9,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '5m Smoke Cloud',
    range_vi: ' Đám khói 5m',
    desc_vi:
      'Thả bom khói dưới chân: khiến mọi người bên trong Tàng hình và bị Câm Lặng (Silence) không thể niệm phép.',
    desc_en:
      'Drops a smoke bomb at your feet that silences and turns all characters inside invisible.',
  },
  HEAD_LEATHER_UNDEAD: {
    name_en: 'Flash of Insight',
    name_vi: 'Xóa Hồi Chiêu Áo Giáp Specter Hood (Flash of Insight)',
    cooldown: 45,
    energy: 8,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: 'Self',
    range_vi: 'Bản thân',
    desc_vi:
      'Xóa ngay lập tức thời gian hồi chiêu của kỹ năng Áo Giáp (Ô R), cho phép bật Hellion Jacket hoặc Mercenary Jacket 2 lần liên tiếp!',
    desc_en:
      'Immediately resets the cooldown of your Chest Armor ability (Slot R), allowing back-to-back jacket activations.',
  },
  HEAD_CLOTH_SET1: {
    name_en: 'Energy Shield',
    name_vi: 'Khiên Hồi Năng Lượng Scholar Cowl (Energy Shield)',
    cooldown: 30,
    energy: 0,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: 'Self',
    range_vi: 'Bản thân',
    desc_vi:
      'Tăng mạnh Giáp/Kháng Phép trong 4.5 giây và mỗi khi bị đánh sẽ hồi phục ngay Năng lượng (Energy) cho bản thân.',
    desc_en:
      'Increases resistances for 4.5s and restores Energy every time you take damage.',
  },
  HEAD_CLOTH_SET2: {
    name_en: 'Ice Block',
    name_vi: 'Khối Băng Bất Tử Cleric Cowl (Ice Block)',
    cooldown: 40,
    energy: 6,
    cast_en: 'Channel up to 3.5s',
    cast_vi: 'Đóng băng 3.5s',
    range_en: 'Self',
    range_vi: 'Bản thân',
    desc_vi:
      'Đóng băng bản thân trong khối băng vĩnh cửu, trở nên BẤT TỬ hoàn toàn trước mọi sát thương và khống chế.',
    desc_en:
      'Encases yourself in solid ice for up to 3.5s, becoming completely invulnerable to all damage and crowd control.',
  },
  HEAD_CLOTH_SET3: {
    name_en: 'Poison / Firebreath',
    name_vi: 'Hơi Thở Lửa Thiêu Đốt Mage Cowl (Firebreath)',
    cooldown: 20,
    energy: 7,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '8m Cone',
    range_vi: 'Hình nón 8m',
    desc_vi:
      'Phun luồng lửa ma thuật hình nón gây sát thương phép diện rộng và đốt cháy kẻ địch theo thời gian (tốc độ dọn quái cực nhanh).',
    desc_en:
      'Breathes a cone of fire in front of you, dealing AoE magic damage and igniting enemies over time.',
  },
  HEAD_CLOTH_HELL: {
    name_en: 'Purge',
    name_vi: 'Thanh Trừng Bùa Lợi Fiend Cowl (Purge)',
    cooldown: 30,
    energy: 8,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '11m',
    range_vi: '11m',
    desc_vi:
      'Xóa bỏ ngay lập tức mọi bùa lợi (Chạy nhanh, Tàng hình, Khiên máu, Haste, Bloodlust) trên người mục tiêu địch!',
    desc_en:
      'Immediately strips all positive buffs (Sprints, Shields, Bloodlust, HoTs) from target enemy.',
  },
  HEAD_CLOTH_MORGANA: {
    name_en: 'Inner Corruption',
    name_vi: 'Nguyền Rủa Nội Tại Cultist Cowl (Inner Corruption)',
    cooldown: 25,
    energy: 8,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '11m',
    range_vi: '11m',
    desc_vi:
      'Nguyền rủa kẻ địch: mỗi khi nạn nhân di chuyển hoặc dùng kỹ năng sẽ tự nhận lượng sát thương phép cực lớn!',
    desc_en:
      'Curses target enemy for 4s so that every attack or spell they cast inflicts heavy magic damage on themselves.',
  },
  HEAD_CLOTH_ROYAL: {
    name_en: 'Perpetual Energy',
    name_vi: 'Năng Lượng Vĩnh Cửu Royal Cowl (Perpetual Energy)',
    cooldown: 30,
    energy: 0,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: 'Self',
    range_vi: 'Bản thân',
    desc_vi:
      'Trong 12 giây, toàn bộ kỹ năng bạn tung ra KHÔNG TỐN NĂNG LƯỢNG (0 Energy Cost) — mảnh ghép bắt buộc cho các bộ Build tốn mana.',
    desc_en:
      'For 12 seconds, all of your abilities cost 0 Energy to cast.',
  },

  // ============================================================================
  // 12. CAPES & FACTION CRESTS
  // ============================================================================
  CAPEITEM_FW_THETFORD: {
    name_en: 'Chain Lightning (Thetford Crest)',
    name_vi: 'Giật Sét Liên Hoàn (Áo Choàng Thetford)',
    cooldown: 15,
    energy: 0,
    cast_en: 'Auto on Normal Attack',
    cast_vi: 'Tự kích khi đánh thường',
    range_en: '11m Chain (4 Targets)',
    range_vi: 'Nảy 4 mục tiêu',
    desc_vi:
      'Đòn đánh thường tự động phóng luồng sét tím nảy qua tối đa 4 kẻ địch xung quanh gây sát thương phép lớn (hồi chiêu 15 giây).',
    desc_en:
      'Normal attacks automatically unleash a Chain Lightning bolt that arcs up to 4 enemies for magic damage (15s cooldown).',
  },
  CAPEITEM_FW_FORTSTERLING: {
    name_en: 'Untouchable (Fort Sterling Crest)',
    name_vi: 'Miễn Nhiễm Khống Chế (Áo Choàng Fort Sterling)',
    cooldown: 110,
    energy: 0,
    cast_en: 'Auto on CC Hit',
    cast_vi: 'Tự kích khi dính CC',
    range_en: 'Self',
    range_vi: 'Bản thân',
    desc_vi:
      'Ngay khi bị dính Choáng, Trói chân hoặc Câm lặng, áo choàng tự động XÓA SẠCH mọi hiệu ứng khống chế để bạn thoát hiểm tức thì.',
    desc_en:
      'Automatically cleanses all Stun, Root, and Silence effects the moment you are crowd-controlled.',
  },
  CAPEITEM_FW_LYMHURST: {
    name_en: 'Energy Reserve (Lymhurst Crest)',
    name_vi: 'Suối Nguồn Năng Lượng (Áo Choàng Lymhurst)',
    cooldown: 120,
    energy: 0,
    cast_en: 'Auto below 40% Energy',
    cast_vi: 'Tự kích khi <40% Mana',
    range_en: 'Self',
    range_vi: 'Bản thân',
    desc_vi:
      'Khi Năng lượng tụt xuống dưới 40%, tự động hồi phục tới 80% tổng Năng lượng tối đa trong 8 giây.',
    desc_en:
      'When your Energy drops below 40%, automatically restores 80% of your Max Energy over 8s.',
  },
  CAPEITEM_FW_BRIDGEWATCH: {
    name_en: 'Sandstorm (Bridgewatch Crest)',
    name_vi: 'Bão Cát Làm Chậm & Giảm Sát Thương (Áo Choàng Bridgewatch)',
    cooldown: 55,
    energy: 0,
    cast_en: 'Auto on Normal Attack',
    cast_vi: 'Tự kích khi đánh thường',
    range_en: '5m AoE',
    range_vi: '5m Diện rộng',
    desc_vi:
      'Đòn đánh thường tạo cơn bão cát làm chậm 50% và giảm 15% sát thương gây ra của mọi kẻ địch xung quanh.',
    desc_en:
      'Normal attacks trigger a sandstorm that slows enemies by 50% and reduces their damage output by 15%.',
  },
  CAPEITEM_FW_MARTLOCK: {
    name_en: 'Shield of Protection (Martlock Crest)',
    name_vi: 'Khiên Hộ Mệnh Khi Thấp Máu (Áo Choàng Martlock)',
    cooldown: 130,
    energy: 0,
    cast_en: 'Auto below 25% HP',
    cast_vi: 'Tự kích khi <25% Máu',
    range_en: 'Self',
    range_vi: 'Bản thân',
    desc_vi:
      'Khi Máu xuống dưới 25%, tự động tăng 50% Phòng thủ trong 5 giây giúp sống sót trước đòn kết liễu.',
    desc_en:
      'When HP drops below 25%, automatically increases your Defense by 50% for 5 seconds.',
  },
  CAPEITEM_FW_CAERLEON: {
    name_en: 'Quickhands (Caerleon Crest)',
    name_vi: 'Xóa Hồi Chiêu Kỹ Năng Q (Áo Choàng Caerleon)',
    cooldown: 28,
    energy: 0,
    cast_en: 'Auto on Q Cast',
    cast_vi: 'Tự kích khi dùng Q',
    range_en: 'Self',
    range_vi: 'Bản thân',
    desc_vi:
      'Ngay khi bạn tung kỹ năng Q (Ô 1), áo choàng xóa hồi chiêu kỹ năng Q ngay lập tức để bạn xả 2 lần Q liên hoàn!',
    desc_en:
      'Casting your Q ability immediately resets its cooldown, allowing an instant double-Q burst combo.',
  },
  CAPEITEM_FW_BRECILIEN: {
    name_en: 'Protective Shield (Brecilien Crest)',
    name_vi: 'Khiên Sương Mù Kháng Thanh Trừng (Áo Choàng Brecilien)',
    cooldown: 40,
    energy: 0,
    cast_en: 'Auto on Head Skill Cast',
    cast_vi: 'Tự kích khi bật kỹ năng Mũ',
    range_en: 'Self',
    range_vi: 'Bản thân',
    desc_vi:
      'Khi kích hoạt kỹ năng Mũ (Ô D), tự động nhận khiên chắn hấp thụ sát thương và miễn nhiễm hiệu ứng Thanh Trừng (Purge Immune).',
    desc_en:
      'Activating your Helmet skill grants a damage shield and makes you immune to Purge effects.',
  },
  CAPEITEM_UNDEAD: {
    name_en: 'Play Dead (Undead Cape)',
    name_vi: 'Tàng Hình Thoát Chết (Áo Choàng Undead)',
    cooldown: 120,
    energy: 0,
    cast_en: 'Auto below 15% HP',
    cast_vi: 'Tự kích khi <15% Máu',
    range_en: 'Self',
    range_vi: 'Bản thân',
    desc_vi:
      'Khi máu tụt xuống dưới 15%, tự động Tàng Hình trong 6 giây để cắt đuôi kẻ địch trong Mists/Black Zone.',
    desc_en:
      'When HP drops below 15%, automatically turns you invisible for 6s to escape lethal combat.',
  },
  CAPEITEM_AVALON: {
    name_en: 'Force Pulse (Avalonian Cape)',
    name_vi: 'Sóng Chấn Động Giảm Sát Thương (Áo Choàng Avalon)',
    cooldown: 27,
    energy: 0,
    cast_en: 'Auto on Normal Attack',
    cast_vi: 'Tự kích khi đánh thường',
    range_en: '6m AoE',
    range_vi: '6m Diện rộng',
    desc_vi:
      'Đòn đánh thường phát nổ sóng năng lượng Avalon gây sát thương phép diện rộng và giảm 25% sát thương của kẻ địch trúng đòn.',
    desc_en:
      'Normal attacks emit an Avalonian shockwave dealing AoE magic damage and reducing enemy damage by 25%.',
  },
  CAPEITEM_KEEPER: {
    name_en: 'Berserk (Keeper Crest)',
    name_vi: 'Cuồng Nộ Tăng 50% Sát Thương (Áo Choàng Keeper)',
    cooldown: 110,
    energy: 0,
    cast_en: 'Auto below 70% HP',
    cast_vi: 'Tự kích khi <70% Máu',
    range_en: 'Self',
    range_vi: 'Bản thân',
    desc_vi:
      'Khi Máu xuống dưới 70%, tự động kích hoạt Cuồng Nộ tăng +50% toàn bộ Sát thương gây ra trong 6 giây!',
    desc_en:
      'When HP drops below 70%, automatically grants Berserk, increasing all damage dealt by +50% for 6s.',
  },
  CAPEITEM_MORGANA: {
    name_en: 'Mark of Dishonor (Morgana Crest)',
    name_vi: 'Ấn Cuồng Tốc Đánh +50% (Áo Choàng Morgana)',
    cooldown: 90,
    energy: 0,
    cast_en: 'Auto on E Cast',
    cast_vi: 'Tự kích khi dùng chiêu E',
    range_en: 'Self',
    range_vi: 'Bản thân',
    desc_vi:
      'Ngay khi bạn tung kỹ năng E (Ô 3), áo choàng tăng vọt +50% Tốc Độ Đánh và giảm 50% thời gian niệm phép trong 8 giây!',
    desc_en:
      'Casting your E ability grants +50% Attack Speed and halves cast times for 8 seconds.',
  },
  CAPEITEM_DEMON: {
    name_en: 'Lava Pool (Demon Crest)',
    name_vi: 'Hồ Dung Nham Đốt Cháy (Áo Choàng Demon)',
    cooldown: 60,
    energy: 0,
    cast_en: 'Auto on Normal Attack',
    cast_vi: 'Tự kích khi đánh thường',
    range_en: '4.5m AoE',
    range_vi: '4.5m Diện rộng',
    desc_vi:
      'Đòn đánh thường mở ra hồ dung nham địa ngục dưới chân mục tiêu, thiêu đốt và giảm kháng phép của mọi kẻ địch đứng trên đó.',
    desc_en:
      'Normal attacks open a pool of molten lava beneath the target, burning and shredding resistance of enemies standing in it.',
  },
  CAPEITEM_HERETIC: {
    name_en: 'Trapper (Heretic Crest)',
    name_vi: 'Bẫy Gấu Trói Chân Khi Bật Giày (Áo Choàng Heretic)',
    cooldown: 75,
    energy: 0,
    cast_en: 'Auto on Boots Cast',
    cast_vi: 'Tự kích khi bật Giày (F)',
    range_en: 'Self',
    range_vi: 'Bản thân',
    desc_vi:
      'Khi kích hoạt kỹ năng Giày (Ô F), tự động đặt bẫy trói chân (Root) kẻ địch truy đuổi suốt 4 giây.',
    desc_en:
      'Activating your Shoes skill deploys a hidden trap that roots pursuing enemies for 4s.',
  },
  CAPEITEM_SMUGGLER: {
    name_en: 'Backup Tonic (Smuggler Crest)',
    name_vi: 'Giảm 70s Hồi Bình Thuốc (Áo Choàng Smuggler)',
    cooldown: 90,
    energy: 0,
    cast_en: 'Auto on Potion Use',
    cast_vi: 'Tự kích khi uống thuốc',
    range_en: 'Self',
    range_vi: 'Bản thân',
    desc_vi:
      'Ngay khi bạn sử dụng Bình Thuốc (Potion), áo choàng giảm ngay 70 giây thời gian hồi thuốc để bạn dùng tiếp bình thứ hai!',
    desc_en:
      'Using a Potion immediately reduces your Potion slot cooldown by 70 seconds.',
  },

  // ============================================================================
  // 13. FROST, ARCANE, QUARTERSTAFF, MACE, HAMMER, WAR GLOVES, SHAPESHIFTER
  // ============================================================================
  MAIN_FROSTSTAFF: {
    name_en: 'Freezing Wind',
    name_vi: 'Gió Tuyết Trói Chân (Freezing Wind)',
    cooldown: 15,
    energy: 14,
    cast_en: '0.4s',
    cast_vi: '0.4 giây',
    range_en: '14m Cone',
    range_vi: 'Hình nón 14m',
    desc_vi:
      'Thổi luồng gió băng hình nón gây sát thương phép diện rộng và Trói Chân (Root) toàn bộ kẻ địch trúng đòn.',
    desc_en:
      'Unleashes a freezing wind in a cone dealing AoE magic damage and rooting all enemies hit.',
  },
  '2H_FROSTSTAFF': {
    name_en: 'Hail',
    name_vi: 'Mưa Đá Liên Hoàn (Great Frost Hail)',
    cooldown: 15,
    energy: 13,
    cast_en: '0.4s (2 Casts)',
    cast_vi: '2 Đợt mưa đá',
    range_en: '15m (4.5m AoE)',
    range_vi: '15m (Vùng 4.5m)',
    desc_vi:
      'Giáng 2 đợt mưa đá băng giá liên tiếp xuống vùng chỉ định với sát thương phép diện rộng lớn và không có độ trễ.',
    desc_en:
      'Calls down two rapid waves of hailstones at the target location dealing high AoE magic damage.',
  },
  '2H_GLACIALSTAFF': {
    name_en: 'Ice Storm',
    name_vi: 'Bão Tuyết Vĩnh Cửu (Ice Storm)',
    cooldown: 20,
    energy: 18,
    cast_en: '0.8s',
    cast_vi: '0.8 giây',
    range_en: '15m',
    range_vi: '15m',
    desc_vi:
      'Tạo cơn bão tuyết di chuyển chậm phía trước làm chậm 50% và đóng băng mọi kẻ địch đứng trong bão quá lâu.',
    desc_en:
      'Conjures a moving blizzard that slows enemies by 50% and freezes targets caught inside.',
  },
  MAIN_FROSTSTAFF_KEEPER: {
    name_en: 'Avalanche',
    name_vi: 'Quả Cầu Tuyết Lăn Hoarfrost (Avalanche)',
    cooldown: 20,
    energy: 16,
    cast_en: '0.4s',
    cast_vi: '0.4 giây',
    range_en: '16m Line',
    range_vi: 'Đường lăn 16m',
    desc_vi:
      'Lăn quả cầu tuyết khổng lồ hất tung kẻ địch và để lại thảm băng làm chậm, sau đó phát nổ đóng băng diện rộng.',
    desc_en:
      'Rolls a giant snowball knocking foes back and exploding to freeze enemies in an area.',
  },
  '2H_ICEGAUNTLETS_HELL': {
    name_en: 'Frozen Hell',
    name_vi: 'Địa Ngục Băng Giá (Icicle Frozen Hell)',
    cooldown: 25,
    energy: 19,
    cast_en: '0.5s',
    cast_vi: '0.5 giây',
    range_en: '15m (6.5m AoE)',
    range_vi: '15m (Bán kính 6.5m)',
    desc_vi:
      'Đóng băng mặt đất bán kính 6.5m suốt 5 giây, làm chậm tới 60% toàn bộ đội hình địch trong ZvZ.',
    desc_en:
      'Freezes a massive 6.5m ground zone for 5s, slowing all enemies inside by up to 60%.',
  },
  '2H_ICECRYSTAL_UNDEAD': {
    name_en: 'Ice Crystal',
    name_vi: 'Lăng Kính Đóng Băng Permafrost (Ice Crystal)',
    cooldown: 25,
    energy: 20,
    cast_en: '0.7s',
    cast_vi: '0.7 giây',
    range_en: '16m (5m AoE)',
    range_vi: '16m (Vùng 5m)',
    desc_vi:
      'Kích nổ tinh thể băng vĩnh cửu tại vùng chỉ định: gây lượng sát thương phép diện rộng cực lớn và làm Choáng (Stun) toàn bộ kẻ địch 1.6 giây!',
    desc_en:
      'Shatters a permafrost crystal at the target area, dealing massive AoE magic damage and stunning all enemies hit for 1.6s.',
  },
  MAIN_FROSTSTAFF_AVALON: {
    name_en: 'Glacial Obelisk',
    name_vi: 'Cột Băng Vĩnh Cửu Chillhowl (Glacial Obelisk)',
    cooldown: 20,
    energy: 16,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '13m',
    range_vi: '13m',
    desc_vi:
      'Đóng băng mục tiêu (hoặc bản thân) trong cột băng miễn nhiễm sát thương rồi phát nổ gây sát thương phép và làm chậm diện rộng.',
    desc_en:
      'Encases an enemy or yourself in an Avalonian ice obelisk before detonating for AoE frost damage and slow.',
  },
  '2H_FROSTSTAFF_CRYSTAL': {
    name_en: 'Glacial Volley',
    name_vi: 'Mưa Thương Băng Pha Lê (Glacial Volley)',
    cooldown: 20,
    energy: 17,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '16m',
    range_vi: '16m',
    desc_vi:
      'Phóng liên hoàn các mũi thương băng pha lê từ trên cao xuống mục tiêu gây sát thương phép dồn dập và làm chậm.',
    desc_en:
      'Calls down a rapid barrage of crystal ice lances onto target enemies.',
  },

  // ARCANE STAFFS
  MAIN_ARCANESTAFF: {
    name_en: 'Arcane Orb',
    name_vi: 'Quả Cầu Câm Lặng & Thanh Trừng (Arcane Orb)',
    cooldown: 18,
    energy: 15,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '15m',
    range_vi: '15m',
    desc_vi:
      'Phóng quả cầu bí thuật phát nổ xóa sạch bùa lợi (Purge) và gây Câm Lặng (Silence) mọi kẻ địch trong vùng.',
    desc_en:
      'Fires an arcane orb that purges all positive buffs and silences enemies in the blast radius.',
  },
  '2H_ARCANESTAFF': {
    name_en: 'Time Freeze',
    name_vi: 'Ngưng Đọng Thời Gian Great Arcane (Time Freeze)',
    cooldown: 35,
    energy: 21,
    cast_en: '0.6s',
    cast_vi: '0.6 giây',
    range_en: '15m (6m AoE)',
    range_vi: '15m (Bán kính 6m)',
    desc_vi:
      'Đóng băng thời gian của mọi mục tiêu (cả địch lẫn đồng minh) trong bán kính 6m suốt 3 giây — công cụ setup wombo-combo số 1 trong ZvZ!',
    desc_en:
      'Freezes time for all characters in a 6m radius for 3s, stopping all actions to set up devastating ZvZ combos.',
  },
  '2H_ENIGMATICSTAFF': {
    name_en: 'Protective Beam',
    name_vi: 'Tia Khiên Bảo Hộ Diện Rộng (Protective Beam)',
    cooldown: 20,
    energy: 18,
    cast_en: '3.0s Channel',
    cast_vi: 'Duy trì 3.0s',
    range_en: '13m',
    range_vi: '13m',
    desc_vi:
      'Chiếu tia năng lượng bí thuật ban khiên chắn khổng lồ liên tục cho đồng minh được chọn và tối đa 5 đồng đội xung quanh.',
    desc_en:
      'Channels a protective beam that repeatedly shields the target ally and up to 5 nearby teammates.',
  },
  MAIN_ARCANESTAFF_UNDEAD: {
    name_en: 'Black Hole',
    name_vi: 'Hố Đen Gom Địch Witchwork (Black Hole)',
    cooldown: 22,
    energy: 17,
    cast_en: '0.5s',
    cast_vi: '0.5 giây',
    range_en: '14m (5.5m Pull)',
    range_vi: '14m (Hút 5.5m)',
    desc_vi:
      'Mở ra Hố Đen vũ trụ hút toàn bộ kẻ địch trong bán kính 5.5m chụm lại vào tâm và gây sát thương phép.',
    desc_en:
      'Conjures a gravitational Black Hole that pulls all enemies within 5.5m tightly into the center.',
  },
  '2H_ENIGMATICORB_MORGANA': {
    name_en: 'The Void (Malevolent Locus)',
    name_vi: 'Vòm Hư Không Thanh Tẩy ZvZ (The Void)',
    cooldown: 35,
    energy: 22,
    cast_en: '3.5s Channel',
    cast_vi: 'Duy trì 3.5s',
    range_en: '9m AoE',
    range_vi: 'Bán kính 9m',
    desc_vi:
      'Mở ra Vòm Hư Không bán kính 9m: Xóa sạch mọi khống chế/debuff trên đồng minh, tăng mạnh Giáp và xóa bùa lợi của kẻ địch bước vào!',
    desc_en:
      'Opens a massive 9m Void zone that cleanses all debuffs/CC from allies, boosts their resistances, and purges enemy buffs.',
  },
  '2H_ARCANESTAFF_CRYSTAL': {
    name_en: 'Starfall',
    name_vi: 'Mưa Sao Băng Pha Lê Astral (Starfall)',
    cooldown: 25,
    energy: 19,
    cast_en: '3.0s Moving Channel',
    cast_vi: 'Duy trì di chuyển 3.0s',
    range_en: '6.5m AoE',
    range_vi: '6.5m Diện rộng',
    desc_vi:
      'Gọi mưa sao băng pha lê trút xuống liên tục quanh bản thân trong khi di chuyển, gây sát thương phép diện rộng cực lớn và giảm kháng địch.',
    desc_en:
      'Calls down a relentless shower of crystal meteors around you while moving, dealing massive AoE magic damage.',
  },

  // QUARTERSTAFFS, MACES, HAMMERS, WAR GLOVES, SHAPESHIFTER
  '2H_QUARTERSTAFF': {
    name_en: 'Separator',
    name_vi: 'Bổ Côn Hất Tung & Phá Khiên (Separator)',
    cooldown: 15,
    energy: 14,
    cast_en: '0.5s Leap',
    cast_vi: 'Nhảy bổ 0.5s',
    range_en: '9m',
    range_vi: '9m',
    desc_vi:
      'Nhảy bổ tới trước đập côn gây sát thương, Hất Tung (Knock Up) và xóa sạch mọi lớp khiên chắn của kẻ địch.',
    desc_en:
      'Leaps forward slamming the staff down, shattering all shields and knocking enemies airborne.',
  },
  '2H_DOUBLEBLADEDSTAFF': {
    name_en: 'Soaring Swipe',
    name_vi: 'Lướt Nhào Lộn Cơ Động (Soaring Swipe)',
    cooldown: 18,
    energy: 14,
    cast_en: 'Instant Leap',
    cast_vi: 'Phóng vọt tức thì',
    range_en: '14m Leap',
    range_vi: 'Bay 14m',
    desc_vi:
      'Phóng vọt 14m qua địa hình, gây sát thương và làm chậm 50% mọi kẻ địch tại điểm đáp (vũ khí cơ động bậc nhất Mists/Open World).',
    desc_en:
      'Vaults 14m forward, damaging and slowing all enemies at the landing zone by 50%.',
  },
  '2H_TWINSCYTHE_HELL': {
    name_en: 'Tornado',
    name_vi: 'Cuồng Phong Hất Tung Soulscythe (Tornado)',
    cooldown: 25,
    energy: 19,
    cast_en: '0.6s',
    cast_vi: '0.6 giây',
    range_en: '18m Line',
    range_vi: 'Đường lốc 18m',
    desc_vi:
      'Phóng cơn lốc xoáy địa ngục càn quét 18m, Hất Tung toàn bộ đội hình địch lên không trung suốt 1.8 giây!',
    desc_en:
      'Launches a massive tornado 18m forward, knocking all enemies in its path airborne for 1.8s.',
  },
  '2H_QUARTERSTAFF_AVALON': {
    name_en: 'Phantom Twin',
    name_vi: 'Lao Ánh Sáng Trói Chân Grailseeker (Phantom Twin)',
    cooldown: 25,
    energy: 18,
    cast_en: 'Instant Charge',
    cast_vi: 'Lướt tức thì',
    range_en: '13m',
    range_vi: '13m',
    desc_vi:
      'Lướt 13m và tạo thảm ánh sáng Avalon Trói Chân (Root) toàn bộ kẻ địch trong vùng suốt 3.5 giây.',
    desc_en:
      'Dashes 13m and creates an Avalonian sanctum that roots all enemies inside for up to 3.5s.',
  },
  MAIN_MACE: {
    name_en: 'Deep Leap',
    name_vi: 'Cú Nhảy Địa Chấn Câm Lặng (Deep Leap)',
    cooldown: 18,
    energy: 15,
    cast_en: 'Instant Leap',
    cast_vi: 'Nhảy bổ tức thì',
    range_en: '11m',
    range_vi: '11m',
    desc_vi:
      'Nhảy bổ 11m tới vị trí chỉ định: gây sát thương, làm chậm 45% và gây Câm Lặng (Silence) mọi kẻ địch tại điểm đáp.',
    desc_en:
      'Leaps 11m to target area, dealing physical damage, slowing by 45%, and silencing all enemies hit.',
  },
  '2H_MACE': {
    name_en: 'Battle Howl',
    name_vi: 'Tiếng Gầm Xóa Bùa Lợi Heavy Mace (Battle Howl)',
    cooldown: 20,
    energy: 16,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '6m AoE',
    range_vi: '6m Diện rộng',
    desc_vi:
      'Đập chùy phát nổ sóng âm bán kính 6m: XÓA SẠCH MỌI BÙA LỢI (Purge) và gây Câm Lặng toàn bộ kẻ địch xung quanh!',
    desc_en:
      'Slams the ground to purge all positive buffs and silence all enemies within a 6m radius.',
  },
  MAIN_MACE_HELL: {
    name_en: 'Shrinking Curse',
    name_vi: 'Nguyền Rủa Thu Nhỏ Incubus (Shrinking Curse)',
    cooldown: 20,
    energy: 16,
    cast_en: '0.4s',
    cast_vi: '0.4 giây',
    range_en: '11m (6m AoE)',
    range_vi: '11m (Vùng 6m)',
    desc_vi:
      'Thu nhỏ toàn bộ quái vật và kẻ địch trong vùng: cắt giảm 40% sát thương gây ra và giảm 25% Máu tối đa của chúng (vũ khí Tank số 1 PvE!).',
    desc_en:
      'Shrinks all enemies in a 6m area, reducing their damage output by 40% and their Max HP by 25%.',
  },
  '2H_MACE_MORGANA': {
    name_en: 'Vendetta (Camlann Pull)',
    name_vi: 'Hút Chụm Đội Hình Camlann (Vendetta Pull)',
    cooldown: 25,
    energy: 19,
    cast_en: '0.4s',
    cast_vi: '0.4 giây',
    range_en: '12m (7m Pull)',
    range_vi: '12m (Bán kính hút 7m)',
    desc_vi:
      'Khắc ấn tử thần lên mục tiêu; sau 1.2 giây phát nổ hút chụm toàn bộ kẻ địch trong bán kính 7m vào tâm và làm Choáng chúng!',
    desc_en:
      'Marks a target that implodes after 1.2s, pulling all enemies within 7m into a tight clump and stunning them.',
  },
  '2H_RAM_KEEPER': {
    name_en: 'Ground Pound',
    name_vi: 'Cú Dậm Choáng Diện Rộng Grovekeeper (Ground Pound)',
    cooldown: 30,
    energy: 20,
    cast_en: '0.9s Leap',
    cast_vi: 'Nhảy dậm 0.9s',
    range_en: '11m (5.5m AoE)',
    range_vi: '11m (Vùng 5.5m)',
    desc_vi:
      'Nhảy bổ vào giữa đội hình địch làm Choáng (Stun) tới 4.5 giây và tăng mạnh Giáp cho bản thân theo số lượng tướng địch trúng đòn.',
    desc_en:
      'Leaps into the enemy backline, stunning foes for up to 4.5s and massively boosting your resistances per enemy hit.',
  },
  '2H_KNUCKLES_SET2': {
    name_en: 'Falcon Smash',
    name_vi: 'Chim Ưng Bổ Nhào Battle Bracers (Falcon Smash)',
    cooldown: 20,
    energy: 15,
    cast_en: 'Instant',
    cast_vi: 'Tức thì',
    range_en: '12m Dive',
    range_vi: 'Bay bổ 12m',
    desc_vi:
      'Bay vọt lên không trung và lao xuống vùng chỉ định như chim ưng săn mồi, gây sát thương vật lý diện rộng lớn và hất tung kẻ địch.',
    desc_en:
      'Soars into the air and dives onto the target area, dealing heavy AoE physical damage and knocking enemies airborne.',
  },
  '2H_KNUCKLES_SET3': {
    name_en: 'Gravelleblower',
    name_vi: 'Cú Đấm Nghiền Nát Giáp Spiked Gauntlets',
    cooldown: 25,
    energy: 17,
    cast_en: '0.5s',
    cast_vi: '0.5 giây',
    range_en: '6m Cone',
    range_vi: 'Hình nón 6m',
    desc_vi:
      'Tung cú đấm chấn địa gây sát thương khổng lồ (nhân đôi sát thương lên các mục tiêu mặc Áo Sắt / Plate Armor) và làm chậm diện rộng!',
    desc_en:
      'Unleashes a seismic punch dealing massive AoE physical damage (dealing bonus catastrophic damage against Plate Armor wearers).',
  },
  '2H_KNUCKLES_AVALON': {
    name_en: 'Purifying Combination',
    name_vi: 'Liên Hoàn Quyền Thanh Trừng Fists of Avalon',
    cooldown: 20,
    energy: 16,
    cast_en: 'Instant (2 Casts)',
    cast_vi: '2 Cú lao đấm',
    range_en: '11m',
    range_vi: '11m',
    desc_vi:
      'Lần 1: Bay đạp hất tung mục tiêu. Lần 2: Dịch chuyển tới đấm nổ sóng ánh sáng Avalon XÓA SẠCH BÙA LỢI (Purge) và gây sát thương cực lớn.',
    desc_en:
      '1st Cast: Flying kick knocking enemies airborne. 2nd Cast: Teleports and slams the target, purging all buffs and dealing massive AoE burst.',
  },
  '2H_SHAPESHIFTER_SET1': {
    name_en: 'Shadow Panther Transformation',
    name_vi: 'Hóa Hình Báo Đen Tàng Hình (Prowling Staff)',
    cooldown: 10,
    energy: 0,
    cast_en: 'Instant Transform',
    cast_vi: 'Biến hình tức thì',
    range_en: 'Self',
    range_vi: 'Bản thân',
    desc_vi:
      'Biến hình thành Báo Đen Bóng Tối: có kỹ năng Tàng Hình săn mồi, vồ áp sát cào xé và kết liễu mục tiêu theo số tầng cộng dồn.',
    desc_en:
      'Transforms into a Shadow Panther with stealth prowl, pounce mobility, and lethal execution swipe.',
  },
  '2H_SHAPESHIFTER_MORGANA': {
    name_en: 'Werewolf Transformation',
    name_vi: 'Hóa Hình Người Sói Hút Máu (Bloodmoon Staff)',
    cooldown: 10,
    energy: 0,
    cast_en: 'Instant Transform',
    cast_vi: 'Biến hình tức thì',
    range_en: 'Self',
    range_vi: 'Bản thân',
    desc_vi:
      'Biến hình thành Người Sói Huyết Nguyệt: điên cuồng cào xé diện rộng, tăng tốc chạy và hút máu liên tục từ vũng máu của kẻ địch.',
    desc_en:
      'Transforms into a ferocious Werewolf with relentless AoE slashes, blood-pool lifesteal, and pack speed.',
  },
  '2H_SHAPESHIFTER_AVALON': {
    name_en: 'Dawnbird Transformation',
    name_vi: 'Hóa Hình Đại Bàng Ánh Sáng (Lightcaller)',
    cooldown: 10,
    energy: 0,
    cast_en: 'Instant Transform',
    cast_vi: 'Biến hình tức thì',
    range_en: 'Self',
    range_vi: 'Bản thân',
    desc_vi:
      'Biến hình thành Đại Bàng Ánh Sáng Avalon: phóng tia laser thánh quang và triệu hồi bão sét thiên giới dọn sạch quái/đội hình địch.',
    desc_en:
      'Transforms into an Avalonian Dawnbird, unleashing solar beams and calling down celestial lightning storms.',
  },
};

