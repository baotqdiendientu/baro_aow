#!/usr/bin/env node
/**
 * ALBION ONLINE DATA SEEDING & CLEANING PIPELINE
 * Source: https://raw.githubusercontent.com/ao-data/ao-bin-dumps/master/formatted/items.json
 * Outputs:
 *   - src/data/albion-items.json
 *   - src/data/albion-db.json
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const AO_FORMATTED_ITEMS_URL =
  'https://raw.githubusercontent.com/ao-data/ao-bin-dumps/master/formatted/items.json';

// Tier prefix translations (EN -> VI)
const TIER_PREFIX_VI = {
  "Beginner's": 'Tân Thủ',
  "Novice's": 'Nhập Môn',
  "Journeyman's": 'Học Việc',
  "Adept's": 'Thông Thạo',
  "Expert's": 'Chuyên Gia',
  "Master's": 'Bậc Thầy',
  "Grandmaster's": 'Đại Sư',
  "Elder's": 'Trưởng Lão',
};

// Base IP by Tier (Standard Albion progression)
const BASE_IP_BY_TIER = {
  1: 100,
  2: 300,
  3: 500,
  4: 700,
  5: 800,
  6: 900,
  7: 1000,
  8: 1100,
};

// Comprehensive Albion Online Terminology Dictionary (EN -> VI)
const ALBION_TERM_DICT = [
  // Specific Iconic Weapons & Items
  ['Light Crossbow', 'Nỏ Ánh Sáng'],
  ['Heavy Crossbow', 'Nỏ Hạng Nặng'],
  ['Weeping Repeater', 'Nỏ Liên Thanh'],
  ['Boltcasters', 'Song Nỏ Bắn Tên'],
  ['Siegebow', 'Nỏ Công Thành'],
  ['Energy Shaper', 'Nỏ Năng Lượng Avalon'],
  ['Arclight Blasters', 'Song Nỏ Pha Lê'],
  ['Crystal Reaper', 'Lưỡi Hái Pha Lê'],
  ['Infernal Scythe', 'Lưỡi Hái Địa Ngục'],
  ['Bear Paws', 'Song Rìu Chân Gấu'],
  ['Realmbreaker', 'Đại Rìu Phá Giới'],
  ['Halberd', 'Kích Chiến'],
  ['Carrioncaller', 'Rìu Gọi Quạ'],
  ['Greataxe', 'Đại Rìu'],
  ['Battleaxe', 'Rìu Chiến'],
  ['Druidic Staff', 'Trượng Tự Nhiên Druid'],
  ['Blight Staff', 'Trượng Tự Nhiên Khô Héo'],
  ['Rampant Staff', 'Trượng Tự Nhiên Rừng Xanh'],
  ['Ironroot Staff', 'Trượng Rễ Sắt Avalon'],
  ['Great Nature Staff', 'Đại Trượng Tự Nhiên'],
  ['Wild Staff', 'Trượng Tự Nhiên Hoang Dã'],
  ['Nature Staff', 'Trượng Tự Nhiên'],
  ['Forgebark Staff', 'Trượng Vỏ Thép Pha Lê'],
  ['Bloodletter', 'Đoản Kiếm Huyết Lệ'],
  ['Deathgivers', 'Song Kiếm Tử Thần'],
  ['Bridled Fury', 'Song Dao Cuồng Nộ'],
  ['Demonfang', 'Dao Găm Nanh Quỷ'],
  ['Black Hands', 'Thiết Thủ Hắc Ám'],
  ['Claws', 'Vuốt Sắt'],
  ['Dagger Pair', 'Song Dao Găm'],
  ['Dagger', 'Dao Găm'],
  ['Twin Slayers', 'Song Dao Pha Lê'],
  ['Carving Sword', 'Đại Đao Xẻ Giáp'],
  ['Kingmaker', 'Đại Kiếm Vương Giả'],
  ['Galatine Pair', 'Song Kiếm Galatine'],
  ['Clarent Blade', 'Kiếm Clarent'],
  ['Claymore', 'Trọng Kiếm Claymore'],
  ['Dual Swords', 'Song Kiếm'],
  ['Broadsword', 'Kiếm Bản Rộng'],
  ['Infinity Blade', 'Kiếm Vô Cực Pha Lê'],
  ['Bow of Badon', 'Cung Sấm Sét Badon'],
  ['Mistpiercer', 'Cung Xuyên Sương Avalon'],
  ['Wailing Bow', 'Cung Ai Oán'],
  ['Whispering Bow', 'Cung Thì Thầm'],
  ['Longbow', 'Trường Cung'],
  ['Warbow', 'Cung Chiến'],
  ['Skystrider Bow', 'Cung Thiên Không Pha Lê'],
  ['Bow', 'Cung'],
  ['Shadowcaller', 'Trượng Nguyền Rủa Bóng Tối'],
  ['Damnation Staff', 'Trượng Nguyền Rủa Diệt Vong'],
  ['Lifecurse Staff', 'Trượng Nguyền Sinh Mệnh'],
  ['Cursed Skull', 'Đầu Lâu Nguyền Rủa'],
  ['Demonic Staff', 'Trượng Nguyền Quỷ Dữ'],
  ['Great Cursed Staff', 'Đại Trượng Nguyền Rủa'],
  ['Cursed Staff', 'Trượng Nguyền Rủa'],
  ['Rotcaller Staff', 'Trượng Mục Rữa Pha Lê'],
  ['Wildfire Staff', 'Trượng Hỏa Cầu Hoang Dã'],
  ['Dawnsong', 'Trượng Lửa Bình Minh'],
  ['Blazing Staff', 'Trượng Lửa Rực Cháy'],
  ['Brimstone Staff', 'Trượng Lửa Lưu Huỳnh'],
  ['Infernal Staff', 'Trượng Lửa Địa Ngục'],
  ['Great Fire Staff', 'Đại Trượng Lửa'],
  ['Fire Staff', 'Trượng Lửa'],
  ['Flamewalker Staff', 'Trượng Lửa Pha Lê'],
  ['Permafrost Prism', 'Lăng Kính Băng Vĩnh Cửu'],
  ['Chillhowl', 'Trượng Băng Hàn Phong'],
  ['Icicle Staff', 'Trượng Băng Nhũ'],
  ['Glacial Staff', 'Trượng Băng Hà'],
  ['Hoarfrost Staff', 'Trượng Sương Giá'],
  ['Great Frost Staff', 'Đại Trượng Băng'],
  ['Frost Staff', 'Trượng Băng'],
  ['Arctic Staff', 'Trượng Băng Cực Pha Lê'],
  ['Hallowfall', 'Trượng Thánh Quang Sa Ngã'],
  ['Fallen Staff', 'Trượng Thánh Sa Ngã'],
  ['Redemption Staff', 'Trượng Thánh Cứu Chuộc'],
  ['Lifetouch Staff', 'Trượng Thánh Chạm Sự Sống'],
  ['Divine Staff', 'Trượng Thánh Thần'],
  ['Great Holy Staff', 'Đại Trượng Thánh'],
  ['Holy Staff', 'Trượng Thánh'],
  ['Exalted Staff', 'Trượng Thánh Tôn Quý Pha Lê'],
  ['Evensong', 'Trượng Bí Thuật Hoàng Hôn'],
  ['Malevolent Locus', 'Trượng Bí Thuật Hắc Tâm'],
  ['Occult Staff', 'Trượng Bí Thuật Huyền Bí'],
  ['Enigmatic Staff', 'Trượng Bí Thuật Bí Ẩn'],
  ['Witchwork Staff', 'Trượng Bí Thuật Phù Thủy'],
  ['Great Arcane Staff', 'Đại Trượng Bí Thuật'],
  ['Arcane Staff', 'Trượng Bí Thuật'],
  ['Astral Staff', 'Trượng Tinh Tú Pha Lê'],
  ['Daybreaker', 'Thương Phá Bình Minh'],
  ['Spirithunter', 'Thương Săn Hồn'],
  ['Trinity Spear', 'Thương Tam Vị'],
  ['Heron Spear', 'Thương Diệc'],
  ['Glaive', 'Đại Đao Cán Dài'],
  ['Pike', 'Trường Thương'],
  ['Spear', 'Thương'],
  ['Rift Glaive', 'Trường Đao Không Gian Pha Lê'],
  ['Grailseeker', 'Trường Côn Tầm Chén Thánh'],
  ['Soulscythe', 'Trường Côn Hồn Liềm'],
  ['Black Monk Stave', 'Trường Côn Hắc Tăng'],
  ['Double Bladed Staff', 'Trường Côn Hai Đầu'],
  ['Iron-clad Staff', 'Trường Côn Bọc Sắt'],
  ['Quarterstaff', 'Trường Côn'],
  ['Phantom Twinblade', 'Song Đao Bóng Ma Pha Lê'],
  ['Oathkeepers', 'Song Chùy Thệ Ước'],
  ['Camlan Mace', 'Chùy Camlan'],
  ['Incubus Mace', 'Chùy Ác Mộng'],
  ['Bedrock Mace', 'Chùy Đá Tảng'],
  ['Heavy Mace', 'Trọng Chùy'],
  ['Morning Star', 'Chùy Sao Mai'],
  ['Mace', 'Chùy'],
  ['Dreadstorm Monarch', 'Chùy Bão Tố Pha Lê'],
  ['Hand of Justice', 'Búa Công Lý'],
  ['Grovekeeper', 'Búa Hộ Rừng'],
  ['Forge Hammers', 'Song Búa Thợ Rèn'],
  ['Tombhammer', 'Búa Mộ Cổ'],
  ['Great Hammer', 'Đại Chùy Búa'],
  ['Polehammer', 'Búa Cán Dài'],
  ['Hammer', 'Búa'],
  ['Truebolt Hammer', 'Búa Sấm Sét Pha Lê'],
  ['Fists of Avalon', 'Găng Tay Avalon'],
  ['Hellfire Hands', 'Găng Tay Hỏa Ngục'],
  ['Ravenstrike Cestus', 'Găng Tay Quạ Đen'],
  ['Ursine Maulers', 'Găng Tay Gấu Chiến'],
  ['Spiked Gauntlets', 'Găng Tay Gai Sắt'],
  ['Battle Bracers', 'Găng Tay Chiến Đấu'],
  ['Brawler Gloves', 'Găng Tay Đấu Sĩ'],
  ['Forcepulse Bracers', 'Găng Tay Xung Lực Pha Lê'],
  ['Prowling Staff', 'Trượng Hóa Báo Đen'],
  ['Rootbound Staff', 'Trượng Hóa Thụ Nhân'],
  ['Primal Staff', 'Trượng Hóa Gấu Nguyên Thủy'],
  ['Bloodmoon Staff', 'Trượng Hóa Người Sói'],
  ['Hellspawn Staff', 'Trượng Hóa Tiểu Quỷ'],
  ['Earthrune Staff', 'Trượng Hóa Khổng Lồ Đá'],
  ['Lightcaller', 'Trượng Hóa Chim Thần Avalon'],

  // Off-Hands
  ['Mistcaller', 'Tù Và Gọi Sương (Mistcaller)'],
  ['Cryptcandle', 'Đầu Lâu Nến Ngục (Cryptcandle)'],
  ['Muisak', 'Mặt Nạ Muisak'],
  ['Taproot', 'Rễ Cây Cổ Thụ (Taproot)'],
  ['Celestial Censer', 'Lư Hương Thiên Giới'],
  ['Leering Cane', 'Gậy Đầu Lâu'],
  ['Sarcophagus', 'Khiên Quan Tài'],
  ['Caitiff Shield', 'Khiên Hắc Ám'],
  ['Facebreaker', 'Khiên Phá Diện'],
  ['Astral Aegis', 'Khiên Tinh Tú Avalon'],
  ['Sacred Scepter', 'Quyền Trượng Thánh'],
  ['Eye of Secrets', 'Con Mắt Bí Mật'],
  ['Tome of Spells', 'Sách Phép Thuật'],
  ['Shield', 'Khiên Chắn'],
  ['Torch', 'Đuốc Chiến Thuật'],

  // Armors, Helmets, Shoes
  ['Hellion Jacket', 'Áo Da Địa Ngục (Hellion Jacket)'],
  ['Mercenary Jacket', 'Áo Da Lính Đánh Thuê'],
  ['Assassin Jacket', 'Áo Da Sát Thủ'],
  ['Stalker Jacket', 'Áo Da Kẻ Săn Đuổi'],
  ['Hunter Jacket', 'Áo Da Thợ Săn'],
  ['Specter Jacket', 'Áo Da Bóng Ma'],
  ['Mistwalker Jacket', 'Áo Da Sương Mù'],
  ['Jacket of Tenacity', 'Áo Da Kiên Cường Avalon'],
  ['Cleric Robe', 'Áo Vải Giáo Sĩ'],
  ['Mage Robe', 'Áo Vải Pháp Sư'],
  ['Scholar Robe', 'Áo Vải Học Giả'],
  ['Cultist Robe', 'Áo Vải Cuồng Giáo'],
  ['Fiend Robe', 'Áo Vải Ác Quỷ'],
  ['Druid Robe', 'Áo Vải Druid'],
  ['Feyscale Robe', 'Áo Vải Vảy Tiên'],
  ['Robe of Purity', 'Áo Vải Thuần Khiết Avalon'],
  ['Soldier Armor', 'Giáp Sắt Chiến Binh'],
  ['Knight Armor', 'Giáp Sắt Hiệp Sĩ'],
  ['Guardian Armor', 'Giáp Sắt Hộ Vệ'],
  ['Judicator Armor', 'Giáp Sắt Phán Quyết'],
  ['Demon Armor', 'Giáp Sắt Ác Quỷ'],
  ['Graveguard Armor', 'Giáp Sắt Thủ Mộ'],
  ['Duskweaver Armor', 'Giáp Sắt Dệt Hoàng Hôn'],
  ['Armor of Valor', 'Giáp Sắt Dũng Khí Avalon'],
  ['Royal Cowl', 'Mũ Vải Hoàng Gia'],
  ['Royal Hood', 'Mũ Da Hoàng Gia'],
  ['Royal Helmet', 'Mũ Sắt Hoàng Gia'],
  ['Royal Jacket', 'Áo Da Hoàng Gia'],
  ['Royal Robe', 'Áo Vải Hoàng Gia'],
  ['Royal Armor', 'Giáp Sắt Hoàng Gia'],
  ['Royal Sandals', 'Giày Vải Hoàng Gia'],
  ['Royal Shoes', 'Giày Da Hoàng Gia'],
  ['Royal Boots', 'Giày Sắt Hoàng Gia'],
  ['Stalker Hood', 'Mũ Da Kẻ Săn Đuổi'],
  ['Hunter Hood', 'Mũ Da Thợ Săn'],
  ['Mercenary Hood', 'Mũ Da Lính Đánh Thuê'],
  ['Assassin Hood', 'Mũ Da Sát Thủ'],
  ['Specter Hood', 'Mũ Da Bóng Ma'],
  ['Hellion Hood', 'Mũ Da Địa Ngục'],
  ['Mistwalker Hood', 'Mũ Da Sương Mù'],
  ['Hood of Tenacity', 'Mũ Da Kiên Cường Avalon'],
  ['Scholar Cowl', 'Mũ Vải Học Giả'],
  ['Cleric Cowl', 'Mũ Vải Giáo Sĩ'],
  ['Mage Cowl', 'Mũ Vải Pháp Sư'],
  ['Cultist Cowl', 'Mũ Vải Cuồng Giáo'],
  ['Fiend Cowl', 'Mũ Vải Ác Quỷ'],
  ['Druid Cowl', 'Mũ Vải Druid'],
  ['Feyscale Hat', 'Mũ Vải Vảy Tiên'],
  ['Cowl of Purity', 'Mũ Vải Thuần Khiết Avalon'],
  ['Soldier Helmet', 'Mũ Sắt Chiến Binh'],
  ['Knight Helmet', 'Mũ Sắt Hiệp Sĩ'],
  ['Guardian Helmet', 'Mũ Sắt Hộ Vệ'],
  ['Graveguard Helmet', 'Mũ Sắt Thủ Mộ'],
  ['Demon Helmet', 'Mũ Sắt Ác Quỷ'],
  ['Judicator Helmet', 'Mũ Sắt Phán Quyết'],
  ['Duskweaver Helmet', 'Mũ Sắt Dệt Hoàng Hôn'],
  ['Helmet of Valor', 'Mũ Sắt Dũng Khí Avalon'],
  ['Soldier Boots', 'Giày Sắt Chiến Binh'],
  ['Knight Boots', 'Giày Sắt Hiệp Sĩ'],
  ['Guardian Boots', 'Giày Sắt Hộ Vệ'],
  ['Graveguard Boots', 'Giày Sắt Thủ Mộ'],
  ['Demon Boots', 'Giày Sắt Ác Quỷ'],
  ['Judicator Boots', 'Giày Sắt Phán Quyết'],
  ['Duskweaver Boots', 'Giày Sắt Dệt Hoàng Hôn'],
  ['Boots of Valor', 'Giày Sắt Dũng Khí Avalon'],
  ['Scholar Sandals', 'Giày Vải Học Giả'],
  ['Cleric Sandals', 'Giày Vải Giáo Sĩ'],
  ['Mage Sandals', 'Giày Vải Pháp Sư'],
  ['Cultist Sandals', 'Giày Vải Cuồng Giáo'],
  ['Fiend Sandals', 'Giày Vải Ác Quỷ'],
  ['Druid Sandals', 'Giày Vải Druid'],
  ['Feyscale Sandals', 'Giày Vải Vảy Tiên'],
  ['Sandals of Purity', 'Giày Vải Thuần Khiết Avalon'],
  ['Hunter Shoes', 'Giày Da Thợ Săn'],
  ['Mercenary Shoes', 'Giày Da Lính Đánh Thuê'],
  ['Assassin Shoes', 'Giày Da Sát Thủ'],
  ['Stalker Shoes', 'Giày Da Kẻ Săn Đuổi'],
  ['Hellion Shoes', 'Giày Da Địa Ngục'],
  ['Specter Shoes', 'Giày Da Bóng Ma'],
  ['Mistwalker Shoes', 'Giày Da Sương Mù'],
  ['Shoes of Tenacity', 'Giày Da Kiên Cường Avalon'],

  // Capes & Bags
  ['Thetford Cape', 'Áo Choàng Sét Thetford'],
  ['Caerleon Cape', 'Áo Choàng Đạo Tặc Caerleon'],
  ['Martlock Cape', 'Áo Choàng Khiên Martlock'],
  ['Bridgewatch Cape', 'Áo Choàng Cát Bridgewatch'],
  ['Lymhurst Cape', 'Áo Choàng Năng Lượng Lymhurst'],
  ['Fort Sterling Cape', 'Áo Choàng Thanh Trừng Fort Sterling'],
  ['Brecilien Cape', 'Áo Choàng Sương Mù Brecilien'],
  ['Avalonian Cape', 'Áo Choàng Năng Lượng Avalon'],
  ['Smuggler Cape', 'Áo Choàng Buôn Lậu'],
  ['Keeper Cape', 'Áo Choàng Cuồng Nộ Keeper'],
  ['Heretic Cape', 'Áo Choàng Bẫy Dị Giáo'],
  ['Undead Cape', 'Áo Choàng Tàng Hình Undead'],
  ['Demon Cape', 'Áo Choàng Dung Nham Ác Quỷ'],
  ['Morgana Cape', 'Áo Choàng Tốc Đánh Morgana'],
  ['Satchel of Insight', 'Túi Thông Thái (Tăng Fame)'],
  ['Bag', 'Túi Đựng Đồ'],
  ['Cape', 'Áo Choàng'],

  // Mounts
  ['Saddled Mystic Owl', 'Cú Thần Brecilien'],
  ['Divine Owl', 'Cú Thần Thánh Quang'],
  ['Swiftclaw', 'Báo Đen Tốc Hành'],
  ['Direwolf', 'Sói Tuyết Tốc Hành'],
  ['Direboar', 'Lợn Rừng Chiến'],
  ['Direbear', 'Gấu Tuyết Khổng Lồ'],
  ['Transport Mammoth', 'Voi Ma Mút Vận Tải'],
  ['Command Mammoth', 'Voi Ma Mút Chỉ Huy'],
  ['Armored Horse', 'Ngựa Bọc Giáp'],
  ['Riding Horse', 'Ngựa Cưỡi'],
  ['Transport Ox', 'Bò Thồ Vận Tải'],
  ['Giant Stag', 'Hươu Sừng Tấm'],
  ['Moose', 'Tuần Lộc Lớn'],
  ['Swamp Dragon', 'Thằn Lằn Đầm Lầy'],
  ['Pest Lizard', 'Thằn Lằn Độc'],
  ['Snow Husky', 'Chó Kéo Xe Tuyết'],
  ['Frost Ram', 'Cừu Băng'],
  ['Gallant Horse', 'Chiến Mã Anh Dũng'],
  ['Rageclaw', 'Báo Đen Cuồng Nộ'],

  // Consumables & Farming
  ['Beef Stew', 'Thịt Bò Hầm'],
  ['Mutton Stew', 'Thịt Cừu Hầm'],
  ['Goat Stew', 'Thịt Dê Hầm'],
  ['Pork Omelette', 'Trứng Cuộn Thịt Heo'],
  ['Chicken Omelette', 'Trứng Cuộn Thịt Gà'],
  ['Goose Omelette', 'Trứng Cuộn Thịt Ngỗng'],
  ['Beef Sandwich', 'Bánh Mì Kẹp Thịt Bò'],
  ['Pork Pie', 'Bánh Nướng Thịt Heo'],
  ['Goose Pie', 'Bánh Nướng Thịt Ngỗng'],
  ['Chicken Pie', 'Bánh Nướng Thịt Gà'],
  ['Cabbage Soup', 'Súp Bắp Cải'],
  ['Carrot Soup', 'Súp Cà Rốt'],
  ['Wheat Soup', 'Súp Lúa Mì'],
  ['Potato Salad', 'Salad Khoai Tây'],
  ['Turnip Salad', 'Salad Củ Cải'],
  ['Bean Salad', 'Salad Đậu'],
  ['Roast Pork', 'Thịt Heo Quay'],
  ['Roast Chicken', 'Gà Quay'],
  ['Roast Goose', 'Ngỗng Quay'],
  ['Healing Potion', 'Bình Thuốc Hồi Máu'],
  ['Energy Potion', 'Bình Thuốc Năng Lượng'],
  ['Gigantify Potion', 'Bình Thuốc Khổng Lồ Hóa'],
  ['Resistance Potion', 'Bình Thuốc Tăng Kháng'],
  ['Sticky Potion', 'Bình Thuốc Nhựa Dính'],
  ['Poison Potion', 'Bình Thuốc Độc'],
  ['Invisibility Potion', 'Bình Thuốc Tàng Hình'],
  ['Calming Potion', 'Bình Thuốc Tịnh Tâm'],
  ['Cleansing Potion', 'Bình Thuốc Thanh Tẩy'],
  ['Acid Potion', 'Bình Thuốc Axit Phá Giáp'],
  ['Berserk Potion', 'Bình Thuốc Cuồng Chiến'],
  ['Hellfire Potion', 'Bình Thuốc Lửa Địa Ngục'],
  ['Gathering Potion', 'Bình Thuốc Thu Thập'],
  ['Tornado in a Bottle', 'Bình Lốc Xoáy'],
];

/**
 * Strips Vietnamese diacritics for instant accent-insensitive search.
 */
function stripAccents(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

/**
 * Generates an accurate Vietnamese name from the English Albion item name.
 */
function translateAlbionNameToVi(nameEn) {
  let cleanEn = nameEn.trim();
  let tierSuffix = '';

  for (const [enPrefix, viLabel] of Object.entries(TIER_PREFIX_VI)) {
    if (cleanEn.startsWith(enPrefix + ' ')) {
      cleanEn = cleanEn.slice(enPrefix.length + 1).trim();
      tierSuffix = ` (${viLabel})`;
      break;
    }
  }

  for (const [enTerm, viTerm] of ALBION_TERM_DICT) {
    if (cleanEn.toLowerCase() === enTerm.toLowerCase()) {
      return `${viTerm}${tierSuffix}`;
    }
  }

  for (const [enTerm, viTerm] of ALBION_TERM_DICT) {
    if (cleanEn.toLowerCase().includes(enTerm.toLowerCase())) {
      return `${viTerm} — ${cleanEn}`;
    }
  }

  return `${cleanEn}${tierSuffix}`;
}

/**
 * Auto-categorizes an Albion item based purely on its base UniqueName (Step 1.3 rules).
 */
function classifyByUniqueName(baseId) {
  // 1. Weapons (1H & 2H) — exclude gathering tools (_TOOL_)
  if (baseId.includes('_TOOL_')) {
    return null;
  }

  if (baseId.includes('_2H_')) {
    let subEn = '2-Handed Weapon';
    let subVi = 'Vũ Khí 2 Tay (2H)';
    let filterGroup = 'MELEE';
    if (baseId.includes('BOW') || baseId.includes('CROSSBOW')) {
      subEn = 'Ranged Weapon (2H)';
      subVi = 'Vũ Khí Tầm Xa (2 Tay)';
      filterGroup = 'RANGED';
    } else if (
      baseId.includes('STAFF') &&
      !baseId.includes('QUARTERSTAFF') &&
      !baseId.includes('IRONCLADEDSTAFF') &&
      !baseId.includes('DOUBLEBLADEDSTAFF') &&
      !baseId.includes('COMBATSTAFF') &&
      !baseId.includes('TWINSCYTHE') &&
      !baseId.includes('ROCKSTAFF')
    ) {
      subEn = 'Magic / Nature Staff (2H)';
      subVi = 'Trượng Phép & Tự Nhiên (2 Tay)';
      filterGroup = 'MAGIC_NATURE';
    }
    return {
      category: 'weapons',
      slot_type: 'MainHand',
      handedness: '2H',
      isTwoHanded: true,
      filter_group: filterGroup,
      sub_category_en: subEn,
      sub_category_vi: subVi,
      best_city: 'Caerleon / Martlock',
    };
  }

  if (baseId.includes('_MAIN_')) {
    let subEn = '1-Handed Weapon';
    let subVi = 'Vũ Khí 1 Tay (1H)';
    let filterGroup = 'MELEE';
    if (baseId.includes('CROSSBOW') || baseId.includes('BOW')) {
      subEn = 'Ranged Weapon (1H)';
      subVi = 'Vũ Khí Tầm Xa (1 Tay)';
      filterGroup = 'RANGED';
    } else if (baseId.includes('STAFF')) {
      subEn = 'Magic / Nature Staff (1H)';
      subVi = 'Trượng Phép & Tự Nhiên (1 Tay)';
      filterGroup = 'MAGIC_NATURE';
    }
    return {
      category: 'weapons',
      slot_type: 'MainHand',
      handedness: '1H',
      isTwoHanded: false,
      filter_group: filterGroup,
      sub_category_en: subEn,
      sub_category_vi: subVi,
      best_city: 'Bridgewatch / Thetford',
    };
  }

  // 2. Off-Hand (_OFF_)
  if (baseId.includes('_OFF_')) {
    return {
      category: 'weapons',
      slot_type: 'OffHand',
      handedness: 'OFFHAND',
      isTwoHanded: false,
      filter_group: 'OFFHAND_MOUNT',
      sub_category_en: 'Off-Hand Equipment',
      sub_category_vi: 'Trang Bị Tay Phụ (Off-Hand)',
      best_city: 'Lymhurst / Martlock',
    };
  }

  // 3. Head / Armor / Shoes (_HEAD_, _ARMOR_, _SHOES_)
  if (baseId.includes('_HEAD_')) {
    const branch = baseId.includes('_PLATE_')
      ? { en: 'Plate Helmet', vi: 'Mũ Sắt (Plate)' }
      : baseId.includes('_LEATHER_')
        ? { en: 'Leather Hood', vi: 'Mũ Da (Leather)' }
        : { en: 'Cloth Cowl', vi: 'Mũ Vải (Cloth)' };
    return {
      category: 'armors',
      slot_type: 'Head',
      handedness: 'NONE',
      isTwoHanded: false,
      filter_group: 'ARMOR_GEAR',
      sub_category_en: `${branch.en} • Head`,
      sub_category_vi: `${branch.vi} • Đầu`,
      best_city: 'Fort Sterling / Lymhurst',
    };
  }

  if (baseId.includes('_ARMOR_')) {
    const branch = baseId.includes('_PLATE_')
      ? { en: 'Plate Armor', vi: 'Giáp Sắt (Plate)' }
      : baseId.includes('_LEATHER_')
        ? { en: 'Leather Jacket', vi: 'Áo Da (Leather)' }
        : { en: 'Cloth Robe', vi: 'Áo Vải (Cloth)' };
    return {
      category: 'armors',
      slot_type: 'Armor',
      handedness: 'NONE',
      isTwoHanded: false,
      filter_group: 'ARMOR_GEAR',
      sub_category_en: `${branch.en} • Chest`,
      sub_category_vi: `${branch.vi} • Thân`,
      best_city: 'Thetford / Martlock',
    };
  }

  if (baseId.includes('_SHOES_')) {
    const branch = baseId.includes('_PLATE_')
      ? { en: 'Plate Boots', vi: 'Giày Sắt (Plate)' }
      : baseId.includes('_LEATHER_')
        ? { en: 'Leather Shoes', vi: 'Giày Da (Leather)' }
        : { en: 'Cloth Sandals', vi: 'Giày Vải (Cloth)' };
    return {
      category: 'armors',
      slot_type: 'Shoes',
      handedness: 'NONE',
      isTwoHanded: false,
      filter_group: 'ARMOR_GEAR',
      sub_category_en: `${branch.en} • Shoes`,
      sub_category_vi: `${branch.vi} • Chân`,
      best_city: 'Bridgewatch / Lymhurst',
    };
  }

  // 4. Cape & Bag (_CAPE, _BAG)
  if (baseId.includes('_CAPE')) {
    return {
      category: 'armors',
      slot_type: 'Cape',
      handedness: 'NONE',
      isTwoHanded: false,
      filter_group: 'ARMOR_GEAR',
      sub_category_en: 'Cape & Faction Crest',
      sub_category_vi: 'Áo Choàng & Phe Phái',
      best_city: 'Royal Cities / Caerleon',
    };
  }

  if (baseId === 'BAG' || baseId.startsWith('BAG_') || baseId.includes('_BAG')) {
    return {
      category: 'armors',
      slot_type: 'Bag',
      handedness: 'NONE',
      isTwoHanded: false,
      filter_group: 'ARMOR_GEAR',
      sub_category_en: 'Inventory Bag & Satchel',
      sub_category_vi: 'Túi Đựng Đồ & Túi Fame',
      best_city: 'Lymhurst / Caerleon',
    };
  }

  // 5. Mounts (_MOUNT_)
  if (baseId.includes('_MOUNT_')) {
    return {
      category: 'mounts',
      slot_type: 'Mount',
      handedness: 'NONE',
      isTwoHanded: false,
      filter_group: 'OFFHAND_MOUNT',
      sub_category_en: 'Mount & Transport',
      sub_category_vi: 'Thú Cưỡi & Vận Tải',
      best_city: 'Brecilien / Fort Sterling',
    };
  }

  // 6. Consumables & Farming (_MEAL_, _POTION_, _FARM_)
  if (baseId.includes('_MEAL_')) {
    return {
      category: 'consumables',
      slot_type: 'Food',
      handedness: 'NONE',
      isTwoHanded: false,
      filter_group: 'ARMOR_GEAR',
      sub_category_en: 'Combat Food (Meal)',
      sub_category_vi: 'Thức Ăn Chiến Đấu',
      best_city: 'Caerleon',
    };
  }

  if (baseId.includes('_POTION_')) {
    return {
      category: 'consumables',
      slot_type: 'Potion',
      handedness: 'NONE',
      isTwoHanded: false,
      filter_group: 'ARMOR_GEAR',
      sub_category_en: 'Combat Potion',
      sub_category_vi: 'Bình Thuốc Chiến Đấu',
      best_city: 'Caerleon / Brecilien',
    };
  }

  if (baseId.includes('_FARM_')) {
    return {
      category: 'consumables',
      slot_type: 'Food',
      handedness: 'NONE',
      isTwoHanded: false,
      filter_group: 'ARMOR_GEAR',
      sub_category_en: 'Farming Seed & Offspring',
      sub_category_vi: 'Hạt Giống & Chăn Nuôi',
      best_city: 'Caerleon / Island',
    };
  }

  return null;
}

async function main() {
  console.log('⚡ [1/4] Fetching official ao-bin-dumps formatted/items.json...');
  const response = await fetch(AO_FORMATTED_ITEMS_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch items.json: HTTP ${response.status}`);
  }

  const rawItems = await response.json();
  console.log(`📦 Raw items downloaded: ${rawItems.length.toLocaleString()} entries`);

  console.log('🧹 [2/4] Filtering junk, grouping enchantments (@1-@4) & auto-categorizing...');

  // Map keyed by clean unenchanted UniqueName (e.g. "T4_MAIN_1HCROSSBOW")
  const groupedMap = new Map();

  const EXCLUDED_SUBSTRINGS = [
    '_ARTEFACT_',
    '_BP',
    '_DEBUG',
    '_TEST',
    '_TOKEN',
    '_DUMMY',
    '_SKIN_',
    '_VANITY_',
    '_QUESTITEM_',
    '_TRASH',
    '_UPGRADE',
    '_FACTION_',
  ];

  for (const row of rawItems) {
    const uniqueName = row?.UniqueName;
    if (!uniqueName || typeof uniqueName !== 'string') continue;

    // Rule 1: Must start with T1_ to T8_
    const tierMatch = uniqueName.match(/^T([1-8])_(.+)$/);
    if (!tierMatch) continue;

    // Rule 2: Exclude system junk
    if (EXCLUDED_SUBSTRINGS.some((sub) => uniqueName.includes(sub))) continue;

    // Must have an English localized name
    const nameEn =
      row?.LocalizedNames?.['EN-US'] || row?.LocalizedNames?.['EN-GB'];
    if (!nameEn) continue;

    const tier = Number(tierMatch[1]);
    const rest = tierMatch[2];

    // Extract enchantment suffix (@1..@4 or LEVEL1..LEVEL4)
    let enchantment = 0;
    let baseIdentifier = rest;

    const atMatch = rest.match(/^(.+)@([1-4])$/);
    if (atMatch) {
      baseIdentifier = atMatch[1];
      enchantment = Number(atMatch[2]);
    } else {
      // Also strip _LEVEL1@1 style enchantment suffixes on bags/capes/armors if present
      const lvlMatch = baseIdentifier.match(/^(.+)_LEVEL([1-4])$/);
      if (lvlMatch) {
        baseIdentifier = lvlMatch[1];
        enchantment = Number(lvlMatch[2]);
      }
    }

    const cleanUniqueName = `T${tier}_${baseIdentifier}`;

    const classification = classifyByUniqueName(cleanUniqueName);
    if (!classification) continue;

    if (groupedMap.has(cleanUniqueName)) {
      const existing = groupedMap.get(cleanUniqueName);
      if (!existing.availableEnchantments.includes(enchantment)) {
        existing.availableEnchantments.push(enchantment);
        existing.availableEnchantments.sort((a, b) => a - b);
      }
      // Prefer the unenchanted row's LocalizedNames for the base item
      if (enchantment === 0) {
        existing.name_en = nameEn;
        existing.name_vi = translateAlbionNameToVi(nameEn);
        existing.desc_en =
          row?.LocalizedDescriptions?.['EN-US'] || existing.desc_en;
      }
      continue;
    }

    const nameVi = translateAlbionNameToVi(nameEn);
    const descEn =
      row?.LocalizedDescriptions?.['EN-US'] ||
      `${nameEn} (${cleanUniqueName}) — Official Albion Online equipment.`;

    const isArtifact =
      baseIdentifier.includes('_KEEPER') ||
      baseIdentifier.includes('_HELL') ||
      baseIdentifier.includes('_MORGANA') ||
      baseIdentifier.includes('_UNDEAD') ||
      baseIdentifier.includes('_AVALON') ||
      baseIdentifier.includes('_CRYSTAL') ||
      baseIdentifier.includes('_FEY') ||
      baseIdentifier.includes('_ROYAL');

    const artifactType = baseIdentifier.includes('_CRYSTAL')
      ? 'Crystal'
      : baseIdentifier.includes('_AVALON')
        ? 'Avalonian'
        : baseIdentifier.includes('_HELL') || baseIdentifier.includes('_FEY')
          ? 'Relic'
          : baseIdentifier.includes('_MORGANA') ||
              baseIdentifier.includes('_UNDEAD')
            ? 'Soul'
            : isArtifact
              ? 'Rune'
              : undefined;

    const baseIp =
      (BASE_IP_BY_TIER[tier] || 700) + (isArtifact ? 50 : 0);

    const estimatedSilver = Math.round(
      Math.pow(2.15, Math.max(0, tier - 3)) *
        4200 *
        (isArtifact ? 2.4 : 1)
    );

    const searchNormalized = stripAccents(
      `${cleanUniqueName} ${baseIdentifier} ${nameEn} ${nameVi} ${classification.sub_category_en} ${classification.sub_category_vi}`
    );

    groupedMap.set(cleanUniqueName, {
      id: cleanUniqueName.toLowerCase(),
      unique_name: cleanUniqueName,
      base_identifier: baseIdentifier,
      name_en: nameEn,
      name_vi: nameVi,
      desc_en: descEn,
      tier,
      enchantment: 0,
      availableEnchantments: [0, enchantment].filter(
        (v, idx, arr) => arr.indexOf(v) === idx
      ),
      quality: 1,
      category: classification.category,
      filter_group: classification.filter_group,
      slot_type: classification.slot_type,
      handedness: classification.handedness,
      isTwoHanded: classification.isTwoHanded,
      sub_category_en: classification.sub_category_en,
      sub_category_vi: classification.sub_category_vi,
      is_artifact: isArtifact,
      artifact_type: artifactType,
      avg_market_silver: estimatedSilver,
      best_city: classification.best_city,
      base_ip: baseIp,
      search_text: searchNormalized,
    });
  }

  // Sort items cleanly: Higher Tier & Popular Categories first or T4->T8 order
  const finalItems = Array.from(groupedMap.values()).sort((a, b) => {
    if (a.category !== b.category) {
      const order = { weapons: 1, armors: 2, mounts: 3, consumables: 4 };
      return (order[a.category] || 9) - (order[b.category] || 9);
    }
    if (a.tier !== b.tier) return a.tier - b.tier;
    return a.unique_name.localeCompare(b.unique_name);
  });

  console.log(
    `✅ [3/4] Cleaned & grouped into ${finalItems.length.toLocaleString()} unique playable base items!`
  );

  const dataDir = path.join(ROOT_DIR, 'src', 'data');
  await fs.mkdir(dataDir, { recursive: true });

  const outItemsPath = path.join(dataDir, 'albion-items.json');
  const outDbPath = path.join(dataDir, 'albion-db.json');

  const jsonPayload = JSON.stringify(finalItems, null, 2);
  await fs.writeFile(outItemsPath, jsonPayload, 'utf-8');
  await fs.writeFile(outDbPath, jsonPayload, 'utf-8');

  // Breakdown stats
  const counts = finalItems.reduce((acc, item) => {
    acc[item.slot_type] = (acc[item.slot_type] || 0) + 1;
    return acc;
  }, {});

  console.log('📊 [4/4] Slot Breakdown:', counts);
  console.log(`💾 Saved to: ${outItemsPath}`);
  console.log(`💾 Saved to: ${outDbPath}`);
}

main().catch((err) => {
  console.error('❌ Error running sync-albion-data:', err);
  process.exit(1);
});
