
# SYSTEM SPECIFICATION: ALBION ONLINE WEAPON & SPELL ENGINE
> **Target Environment:** Google Antigravity IDE (Agentic Workflow)
> **Core Architecture:** Base Weapon Grouping + Interactive Popover Selector + Shared Spell Pools (Destiny Board Standard)

---

## PART 1: WEAPON GROUPING & POPOVER CONFIGURATOR ARCHITECTURE

### 1.1. Nguyên Tắc Gom Nhóm (Base Weapon Grouping)
* **Quy tắc hiển thị ngoài danh sách (/items hoặc Loadout Builder):**
  - Tuyệt đối **KHÔNG** hiển thị rời rạc hàng trăm biến thể Tier (`T4`, `T5`, `T6`...) ra lưới giao diện chính.
  - Ngoài danh sách chỉ hiển thị đúng các **Vũ khí đại diện (Base Weapons)** thuộc từng nhánh (Weapon Line). 
  - Mỗi nhánh vũ khí tiêu chuẩn gồm **8 vật phẩm** chính: 3 dòng cơ bản (1H, 2H, Biến thể 3), 4 dòng Cổ vật (Rune, Soul, Relic, Avalonian) và 1 dòng Pha lê (Crystal).

### 1.2. Tương Tác Popover Chọn Cấu Hình (Interactive Configuration Popover)
* Khi người dùng **Click vào bất kỳ thẻ vũ khí nào**, hệ thống không chuyển hướng ngay mà bật lên một **Popover / Modal cấu hình nhanh** ngay tại vị trí chọn, gồm 3 tầng lựa chọn:
  1. **Hàng 1 - Chọn Cấp Bậc (Tier Selector):** 
     - `IV (T4)` | `V (T5)` | `VI (T6)` | `VII (T7)` | `VIII (T8)`
     - *UI Rule:* Đổi màu nền nút bấm theo chuẩn màu Tier trong game.
  2. **Hàng 2 - Chọn Cường Hóa (Enchantment Selector):** 
     - `.0` | `.1 (Xanh lá)` | `.2 (Xanh lam)` | `.3 (Tím)` | `.4 (Vàng kim)`
  3. **Hàng 3 - Chọn Phẩm Chất (Quality Selector):** 
     - `Normal` -> `Good` -> `Outstanding` -> `Excellent` -> `Masterpiece`
* **Cập nhật thời gian thực (Real-time Preview):**
  - Khi người dùng thay đổi bất kỳ tùy chọn nào trong Popover, hình ảnh Render API (`render.albiononline.com/v1/item/...`) và chỉ số **Item Power (IP)** phải được tính toán và hiển thị lại tức thì trước khi bấm xác nhận thêm vào Build.

---

## PART 2: SHARED SPELL POOL ARCHITECTURE (CƠ CHẾ KẾ THỪA KỸ NĂNG)

Trong Albion Online, các vũ khí cùng một nhánh (Weapon Line) **DÙNG CHUNG** danh sách kỹ năng Slot 1 (Q), Slot 2 (W) và Nội tại (Passive). Do đó, cấu trúc dữ liệu bắt buộc phải tuân theo mô hình phân tách sau:

### 2.1. Cấu Trúc Dữ Liệu Nhánh Kỹ Năng (`WeaponLineSpellPool`)
```typescript
interface Spell {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  unlockTier?: number; // Một số skill W yêu cầu T6 trở lên mới mở khóa
}

interface WeaponLineSpellPool {
  lineId: string; // e.g., 'axe', 'crossbow', 'nature_staff'
  sharedQSpells: Spell[];      // Đầy đủ 3 kỹ năng Slot 1 (Q)
  sharedWSpells: Spell[];      // Đầy đủ 5 đến 6 kỹ năng Slot 2 (W)
  sharedPassives: Spell[];     // Đầy đủ 4 nội tại (Passive)
}

```

### 2.2. Cơ Chế Kết Hợp Kỹ Năng Cho Từng Vũ Khí

* Mỗi vũ khí lẻ trong nhánh chỉ cần lưu duy nhất trường `uniqueESpell` (Kỹ năng E đặc trưng của riêng vũ khí đó).
* Khi render trang chi tiết hoặc bảng chọn Skill, hệ thống tự động tổng hợp:
`[sharedQSpells của nhánh]` + `[sharedWSpells của nhánh]` + `[uniqueESpell của vũ khí]` + `[sharedPassives của nhánh]`.

### 2.3. Quy Tắc Khóa Kỹ Năng Theo Tier (Tier-Gated W Spells)

* Nếu người dùng chọn vũ khí ở cấp **T4** hoặc **T5**, các kỹ năng W yêu cầu `unlockTier: 6` (ví dụ chiêu *Raging Blades* của nhánh Rìu) vẫn hiển thị trên giao diện nhưng bị **làm mờ (Grayscale / Opacity 50%)** kèm nhãn `"Yêu cầu Tier VI+"`.
* Khi người dùng đổi Tier trong Popover lên `T6` đến `T8`, kỹ năng đó tự động sáng lên và cho phép click chọn.

---

## PART 3: YÊU CẦU DỮ LIỆU THỰC TẾ CHO CÁC NHÁNH TRỌNG TÂM

Agent phải đảm bảo dữ liệu cho các nhánh sau được nạp đầy đủ (không được thiếu sót):

1. **Nhánh Rìu (Axe):**
* Q (3 kỹ năng): *Rending Strike, Rending Spin, Rending Rage*.
* W (5 kỹ năng): *Adrenaline Boost, Deadly Chop, Internal Bleeding, Battle Rush, Raging Blades* (Yêu cầu T6+).
* Passive (4 kỹ năng): *Deep Cuts, Life Leech, Aggressive Rush, Armor Piercer*.


2. **Nhánh Nỏ (Crossbow):**
* Q (2-3 kỹ năng), W (5 kỹ năng đầy đủ: *Knockback Shot, Sunder Shot, Caltrops, Noise Eraser, Sniper Shot*), Passive (4 kỹ năng).


3. **Nhánh Gậy Tự Nhiên (Nature Staff):**
* Q (3 kỹ năng), W (5 kỹ năng đầy đủ: *Bramble Seed, Revitalize, Cleanse Heal, Protection of Nature, Breeze*), Passive (4 kỹ năng).


