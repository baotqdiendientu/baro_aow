# SYSTEM SPECIFICATION & UI/UX BRIEF: ALBION ONLINE WIKI & COMPANION APP
> **Target Environment:** Google Antigravity IDE (Agentic Workflow)
> **Project Type:** Data-heavy Gaming Wiki, Loadout Builder & Real-time Market Tracker
> **Primary Data Sources:** `ao-data` (JSON Dumps for Items/Spells/Localization) + `Albion Online Data Project API` (Market Prices) + Render Service API (`render.albiononline.com`)

---

## PART 1: AGENTIC ARCHITECTURE & EXECUTION PLAN
*Hướng dẫn dành cho AI Agent trong Antigravity IDE: Tuân thủ nghiêm ngặt quy trình xử lý dữ liệu và chia Phase dưới đây trước khi sinh code.*

### 1.1. Kiến trúc Luồng Dữ Liệu & Tối Ưu Hiệu Năng (Data & State Planning)
* **Vì sao (Rationale):** File `items.json` và `localization.json` gốc của Albion Online cực kỳ nặng (hàng chục MB với hơn 10,000+ biến thể Tier/Enchantment). Nếu tải trực tiếp ở Client-side sẽ gây treo trình duyệt.
* **Giải pháp kỹ thuật bắt buộc cho Agent:**
  1. **Data Pre-processing Pipeline (Build-time / Indexing):**
     - Viết script lọc và tách nhỏ dữ liệu gốc từ `ao-data` thành các file JSON tối giản theo danh mục (`weapons.json`, `armors.json`, `mounts.json`, `consumables.json`).
     - Chuẩn hóa cấu trúc song ngữ **Việt - Anh** (`name_vi`, `name_en`, `unique_name` - VD: `T4_2H_CROSSBOW_CANNON@1`). Giữ nguyên thuật ngữ gốc tiếng Anh song song với bản dịch tiếng Việt để game thủ dễ tra cứu.
  2. **Instant Search Indexing (Client-side Search):**
     - Sử dụng chỉ mục tìm kiếm nhẹ (FlexSearch hoặc Fuse.js) chỉ nạp `id`, `unique_name`, `name_vi`, `name_en`, `tier`, `category`. Phản hồi kết quả tìm kiếm dưới **50ms**.
  3. **Image & Icon Delivery:**
     - Tuyệt đối không lưu toàn bộ ảnh vật phẩm trong source code. Sử dụng URL động từ Render API chính thức của Albion:
       `https://render.albiononline.com/v1/item/{UNIQUE_NAME}.png?quality={QUALITY}&size={SIZE}`
     - Spell Icon URL: `https://render.albiononline.com/v1/spell/{SPELL_NAME}.png`
  4. **Market Data Caching (Stale-While-Revalidate):**
     - Gọi API từ `Albion Online Data Project` cho 8 khu vực chính (`Bridgewatch`, `Martlock`, `Thetford`, `Lymhurst`, `Fort Sterling`, `Caerleon`, `Brecilien`, `Black Market`). Cache dữ liệu 5 phút để tránh bị Rate Limit.

### 1.2. Lộ Trình Thực Thi Cho Agent (4-Phase Execution Roadmap)
Khi nhận lệnh code từ người dùng, Agent phải thực hiện tuần tự theo 4 giai đoạn sau (hoàn thành và kiểm thử từng Phase trước khi sang Phase tiếp theo):

* **PHASE 1: Core Foundation & Design Tokens**
  - Khởi tạo dự án (Next.js App Router / React + TailwindCSS + Lucide Icons).
  - Cấu hình `tailwind.config.js` với toàn bộ **Bảng màu Tier (T1-T8), Enchantment (.0-.4), Quality (1-5)** và Font chữ đã quy định ở Phần 2.
  - Xây dựng Layout khung: **Collapsible Left Sidebar** + **Top Sticky Command Bar (`Cmd/Ctrl + K`)** + **Main Viewport**.
* **PHASE 2: Data Adapter & Item Tooltip Engine**
  - Tạo module đọc dữ liệu JSON từ `ao-data` và hàm helper tạo link ảnh Render API.
  - Xây dựng Component cốt lõi: `<ItemSlot />` (hiển thị icon, khung viền Tier, chấm sáng Enchantment) và `<ItemTooltip />` (hiển thị chỉ số Item Power, Sát thương, Giáp, và danh sách kỹ năng Q/W/E/Passive).
* **PHASE 3: Interactive Loadout Builder (Công cụ lắp Build)**
  - Thiết kế khung nhân vật **10 Slots chuẩn Albion**: `Bag`, `Head`, `Cape`, `MainHand`, `Armor`, `OffHand`, `Potion`, `Shoes`, `Food`, `Mount`.
  - Xây dựng logic chọn vũ khí 2 tay (2H - như *Light Crossbow* bịch 2 tay hoặc *Crystal Reaper*) sẽ tự động làm mờ (disable) ô `OffHand`, trừ các vũ khí 1H (như *Druidic Staff* hoặc *1H Crossbow*) cho phép lắp kèm `OffHand` (Muisak, Mistcaller, Torch...).
  - Tính năng xuất/chia sẻ Build qua URL Query hoặc mã JSON ngắn gọn.
* **PHASE 4: Market Tracker & Farming/Crafting Calculator**
  - Xây dựng bảng so sánh giá mua (Buy Order) / giá bán (Sell Order) giữa các thành phố.
  - Công cụ tính lợi nhuận nhanh (Crafting/Refining/Farming Profit) có nút bật/tắt **Focus (Tập trung)** và **Premium Tax (Thuế có/không Premium)**.

---

## PART 2: UI/UX DESIGN SYSTEM & VISUAL TOKENS
*Hướng dẫn dành cho AI Agent: Áp dụng chính xác các mã màu HEX, quy tắc Typography và Component Specs dưới đây vào CSS/Tailwind.*

### 2.1. Triết Lý Thiết Kế (Visual Direction)
* **Concept:** **Dark Tactical RPG Dashboard**. Kết hợp sự sắc sảo, tốc độ cao của các công cụ phân tích dữ liệu hiện đại với điểm nhấn kim loại/đá cổ điển của thế giới Albion.
* **Vì sao (Rationale):** Game thủ thường mở Wiki trong điều kiện phòng tối hoặc vừa chạy trong *Verdant Mists* / chờ *Faction Warfare* vừa `Alt + Tab`. Nền tối sâu giúp chống mỏi mắt, đồng thời làm nổi bật hoàn toàn màu sắc phân cấp của vật phẩm (Tier & Enchantment).

### 2.2. Hệ Thống Màu Sắc Chuẩn Albion (Color Palette & Tokens)

#### A. Màu Nền & Giao Diện Cơ Bản (Base UI Colors)
```json
{
  "bg-primary": "#0B0E14",       // Nền chính sâu thẳm (Main Viewport)
  "bg-secondary": "#131822",     // Nền Sidebar, Header, Card mặc định
  "bg-elevated": "#1C2433",      // Nền Tooltip, Modal, Dropdown, Hover state
  "border-subtle": "#263042",    // Viền chia tách các khu vực dữ liệu
  "border-gold": "#C59B27",      // Viền Active / Highlight mang chất RPG
  "text-primary": "#F3F4F6",     // Chữ chính (Trắng xám dịu mắt)
  "text-secondary": "#9CA3AF",   // Chữ phụ, mô tả kỹ năng
  "text-muted": "#6B7280",       // Chú thích, ID vật phẩm
  "accent-primary": "#E5A93C",   // Vàng Albion (CTA chính, Active Tab)
  "accent-crimson": "#C83E31"    // Đỏ Albion (Cảnh báo, PvP/Lethal Zone tag)
}
B. Bảng Màu Cấp Bậc Vật Phẩm (Albion Item Tier Colors: T1 - T8)
Vì sao: Trong Albion, người chơi nhận diện sức mạnh đồ qua màu nền của từng bậc (Tier). Giao diện bắt buộc phải đồng bộ với màu trong game.
{
  "tier-1": "#6D6D6D",  // Beginner's (Xám tro)
  "tier-2": "#8C7853",  // Novice's (Nâu nhạt)
  "tier-3": "#4A7A4C",  // Journeyman's (Xanh lá trầm)
  "tier-4": "#3B7898",  // Adept's (Xanh lam chuẩn - Tier phổ biến nhất)
  "tier-5": "#8E2822",  // Expert's (Đỏ sẫm)
  "tier-6": "#D06B27",  // Master's (Cam hổ phách)
  "tier-7": "#D9B834",  // Grandmaster's (Vàng sáng)
  "tier-8": "#EBEBEB"   // Elder's (Trắng bạc phát sáng)
}
C. Bảng Màu Cường Hóa (Enchantment Glow Colors: .0 - .4)
Quy tắc hiển thị: Dùng làm viền phát sáng (Box-shadow / Border) hoặc các viên kim cương nhỏ dưới đáy khung Item.
{
  "enchant-0": "transparent", // Không cường hóa
  "enchant-1": "#2ECC71",     // .1 Uncommon (Xanh lục bảo)
  "enchant-2": "#3498DB",     // .2 Rare (Xanh lam sáng)
  "enchant-3": "#9B59B6",     // .3 Exceptional (Tím thạch anh)
  "enchant-4": "#F1C40F"      // .4 Pristine (Vàng hoàng kim rực rỡ)
}
D. Bảng Màu Phẩm Chất (Item Quality Borders: 1 - 5)
{
  "quality-1-normal": "#555555",       // Thường (Viền xám mờ)
  "quality-2-good": "#8A9BA8",         // Tốt (Viền bạc mờ)
  "quality-3-outstanding": "#CD7F32",  // Xuất sắc (Viền đồng)
  "quality-4-excellent": "#E2E8F0",    // Tuyệt hảo (Viền bạc sáng)
  "quality-5-masterpiece": "#FFD700"   // Tuyệt tác (Viền vàng kim lấp lánh)
}
E. Màu Khu Vực Bản Đồ (Zone Safety Tags)
Dùng cho các nhãn (Badges) hướng dẫn nội dung PvE/PvP:

Safe / Blue Zone: #2563EB

Yellow Zone (Non-lethal PvP): #D97706

Red Zone / Black Zone / Lethal Mists: #DC2626

Roads of Avalon: #0D9488

2.3. Hệ Thống Chữ Viết (Typography)
Vì sao: Cần sự cân bằng giữa cảm giác nhập vai (RPG) ở tiêu đề và khả năng đọc lướt số liệu cực nhanh (Damage, Cooldown, Silver, Fame) ở bảng thông số.

Cấu hình Font (Google Fonts - Hỗ trợ đầy đủ Tiếng Việt):

Heading Font (font-display): Cinzel hoặc Spectral (Có chân sắc nét, mang phong cách Trung cổ cho tiêu đề trang, tên Boss, tên Thành phố).

Body & UI Font (font-sans): Inter hoặc Plus Jakarta Sans (Hiển thị mô tả kỹ năng, bài viết hướng dẫn, thanh điều hướng cực kỳ rõ nét).

Data & Numbers Font (font-mono): JetBrains Mono (Bắt buộc áp dụng cho: Item Power (IP), Giá bạc (Silver), Thời gian hồi chiêu (Cooldown), Năng lượng (Energy cost) để các con số thẳng hàng tuyệt đối khi so sánh).

2.4. Quy Chuẩn Thiết Kế Component Đặc Thù (Core Gaming Components)
Global Command Search (Cmd + K / Ctrl + K):

Nằm cố định ở giữa Header.

Hỗ trợ gõ tắt cú pháp nhanh của dân chơi Albion: Ví dụ gõ "light crossbow 6.2" hoặc "cung ánh sáng t6" -> Tự động hiểu là lọc Item Tier 6, Enchantment 2 và trả về kết quả ngay trong Dropdown kèm Icon và giá chợ trung bình.

Component <ItemSlot />:

Kích thước chuẩn: 64x64px (Desktop) và 48x48px (Mobile).

Luôn hiển thị góc trên bên trái là cấp Tier (La Mã: IV, V, VI, VII, VIII), cạnh dưới là 4 chấm thoi thể hiện mức Enchantment (.1 đến .4).

Component <SpellSelector />:

Khi người dùng bấm vào một món đồ trong Loadout Builder, hiển thị hàng ngang các ô kỹ năng (Q, W, E, Passive) dạng hình tròn viền vàng đồng. Cho phép chọn và lưu đúng bộ skill cho từng tình huống (VD: đi Corrupted Dungeon chọn skill khác, đi Bridgewatch Faction ZvZ chọn skill khác).

Chế độ "Second-Screen Compact Mode":

Mọi bảng dữ liệu và khung Build đều phải hoạt động mượt ở độ rộng màn hình thu nhỏ (768px - 1024px) để người chơi có thể chia đôi màn hình hoặc dùng trên iPad/Tablet đặt cạnh PC.
PART 3: RULES FOR ANTIGRAVITY AGENT (QUY TẮC THỰC THI)
Ưu tiên Component hóa (Modularity): Tách biệt hoàn toàn lớp dữ liệu (src/data/, src/services/ao-api.ts) với lớp giao diện (src/components/albion/).

Không dùng Mock Data chung chung: Khi tạo dữ liệu mẫu để test giao diện, bắt buộc dùng tên và mã vật phẩm thật của Albion Online (Ví dụ: T4_MAIN_1HCROSSBOW - Light Crossbow, T6_2H_SCYTHE_CRYSTAL - Crystal Reaper, T5_MAIN_NATURESTAFF_DRUID - Druidic Staff, T8_MOUNT_OWL_FW_BRECILIEN_ELITE - Saddled Mystic Owl).

Programmatic SEO Ready: Mọi trang chi tiết vật phẩm (/item/[uniqueName]) và trang Build (/build/[slug]) đều phải tự động sinh Dynamic Metadata (Title, Description, OpenGraph Image) theo cấu trúc chuẩn SEO.
## PART 4: GAMER UX STRATEGY & INFORMATION ARCHITECTURE

### 4.1. Phân Tích Persona & Nỗi Đau (Gamer Personas & Pain Points)
1. **Persona 1 - The Mist / Solo Grinder (Newbie -> Mid-core):**
   - **Hành vi:** Chơi Solo PvE/PvP trong *Verdant Mists*, *Corrupted Dungeons*, hoặc làm kinh tế cá nhân (trồng *Carrot*, nuôi thú trên đảo, đi Gather).
   - **Nỗi đau:** Không biết bộ trang bị nào rẻ mà hiệu quả (Budget Build 4.1 / 4.2), không biết tính toán lợi nhuận trồng trọt/chế đồ có dùng Focus hay không, rào cản ngôn ngữ khi đọc hiệu ứng kỹ năng tiếng Anh phức tạp.
2. **Persona 2 - The Faction / ZvZ Veteran (Hardcore):**
   - **Hành vi:** Tham gia *Faction Warfare* (VD: *Bridgewatch*), gank nhóm, đánh ZvZ quy mô lớn, buôn hàng liên thành phố.
   - **Nỗi đau:** Các trang Wiki cũ tải quá chậm khi cần `Alt + Tab` kiểm tra nhanh thông số vũ khí mới (như hệ vũ khí Crystal) hoặc so sánh chênh lệch giá chợ Đen (*Black Market*) với các thành phố Hoàng gia.
3. **Hành trình người dùng mục tiêu (5-Second User Journey):**
   - `Alt + Tab` hoặc mở điện thoại -> Bấm `Cmd/Ctrl + K` -> Gõ tên viết tắt (VD: `"druid"`, `"lxbow"`, `"owl"`) -> Xem ngay thông số IP, kỹ năng, giá thị trường hiện tại hoặc Build đề xuất trong vòng **dưới 5 giây** mà không phải tải lại trang.

---

### 4.2. Sitemap & Cấu Trúc URL (Chuẩn Programmatic SEO)
Agent cần thiết lập hệ thống Routing (Next.js App Router) theo đúng cấu trúc phân cấp sau:
```text
/ (Homepage - Command Center Dashboard)
├── /items (Danh mục tổng hợp toàn bộ vật phẩm, bộ lọc đa chiều)
│   └── /items/[uniqueName] (Trang chi tiết từng Item, VD: /items/T4_MAIN_1HCROSSBOW)
├── /builds (Thư viện Build theo chế độ chơi: Solo Mists, Faction ZvZ, PvE Group, Gathering)
│   ├── /builds/create (Công cụ Loadout Builder tương tác trực tiếp)
│   └── /builds/[slug] (Trang chi tiết 1 bản Build đã lưu)
├── /market (Bảng theo dõi giá chợ Real-time 8 thành phố)
├── /calculators (Công cụ tính toán kinh tế)
│   ├── /calculators/farming (Tính lãi trồng trọt/chăn nuôi trên Đảo)
│   └── /calculators/crafting (Tính lãi chế đồ & Refining có hoàn trả Resource Return Rate)
└── /guides (Cẩm nang tân thủ, lộ trình mở khóa Destiny Board)
4.3. Wireframe & Bố Cục Chi Tiết Trang Chủ (Homepage Command Center)
Vì sao: Game thủ không cần đọc lời giới thiệu dài dòng. Trang chủ phải là một bảng điều khiển (Dashboard) truy cập thẳng vào công cụ.

Cấu trúc từ trên xuống dưới (Top-to-Bottom Layout):

Top Server Status Bar (Высота 32px): Hiển thị trạng thái Server Albion Asia (East), Americas (West), Europe + Đồng hồ UTC in-game (cực kỳ quan trọng để canh giờ Reset lãnh thổ, Bandit Assault).

Hero Search Command Section:

Tiêu đề ngắn gọn, đậm chất RPG.

Thanh tìm kiếm khổng lồ ở trung tâm kèm các nút Quick Filter Tags bên dưới: [Vũ khí Crystal], [Thú cưỡi Faction], [Meta Solo Mists], [Giá Chợ Hôm Nay].

Bento Grid - 3 Công Cụ Cốt Lõi (Core Modules):

Ô 1 (Lớn - 6 cột): Trending Meta Builds (Hiển thị trực quan các bộ khung trang bị đang hot như Light Crossbow PvE/Mists, Druidic Staff Solo Boss, Crystal Reaper ZvZ kèm nút "Copy Build").

Ô 2 (Vừa - 3 cột): Quick Market Movers (Top vật phẩm đang biến động giá mạnh hoặc chênh lệch cao giữa Caerleon và Royal Cities).

Ô 3 (Vừa - 3 cột): Destiny Board & Farming Quick Links (Truy cập nhanh bảng tính lợi nhuận trồng trọt, nuôi thú, chế tạo).

Database Category Explorer: Lưới Icon truy cập nhanh theo nhánh trang bị (Warrior, Hunter, Mage, Toolmaker, Mounts, Consumables).

4.4. Cấu Trúc Khung Lắp Đồ 10 Slots (Loadout Builder Grid Specification)
Khi code màn hình /builds/create hoặc hiển thị thẻ Build, Agent bắt buộc sắp xếp Grid 3x4 mô phỏng chính xác giao diện Inventory trong Albion Online:

Hàng 1: [Bag (Túi)] — [Head (Mũ)] — [Cape (Áo choàng)]

Hàng 2: [Main-Hand (Vũ khí chính)] — [Armor (Áo giáp)] — [Off-Hand (Tay phụ)]

Hàng 3: [Potion (Thuốc)] — [Shoes (Giày)] — [Food (Thức ăn)]

Hàng 4: [Trống] — [Mount (Thú cưỡi)] — [Trống]

Khu vực bên dưới khung đồ: Dải chọn kỹ năng (Spell Row) cho Head, Armor, Shoes, và 3 ô kỹ năng Q - W - E + Passive của Main-Hand.

PART 5: TECHNICAL SEO, MICRO-INTERACTIONS & QA/QC CHECKLIST
5.1. Animation & Micro-Interactions
Hover Tooltip Follow: Khi di chuột qua bất kỳ <ItemSlot /> nào, khung <ItemTooltip /> xuất hiện tức thì (delay < 100ms), tự động căn chỉnh vị trí (Flip/Shift) để không bị tràn khỏi mép màn hình.

Tier & Enchantment Switcher: Trên trang chi tiết vật phẩm, khi người dùng bấm đổi từ T4 sang T8 hoặc từ .0 sang .4, toàn bộ chỉ số Item Power (IP), Damage, HP, và Viền phát sáng (Glow) phải cập nhật mượt mà ngay lập tức ở Client-side mà không cần tải lại trang.

5.2. Chiến Lược Programmatic SEO
Tự động sinh thẻ <title> theo công thức: [Tên Tiếng Việt] ([Tên Tiếng Anh]) - Thông số, Kỹ năng, Giá chợ & Build | AlbionVN Wiki.

Tự động tích hợp cấu trúc JSON-LD Schema (BreadcrumbList & FAQPage) cho từng trang vật phẩm (VD: "Nguyên liệu chế tạo [Tên Item] là gì?", "Nên dùng [Tên Vũ Khí] đi nội dung nào?").

5.3.Những Lỗi Chí Mạng Cần Tránh & QA/QC Acceptance Criteria (Tiêu Chí Nghiệm Thu)
Trước khi bàn giao bất kỳ tính năng nào, Agent phải tự kiểm tra qua Checklist QA/QC sau:

[ ] Check 1 (2H Weapon Logic): Khi chọn vũ khí 2 tay (như Crystal Reaper, Bow, 2H Crossbow), ô Off-Hand phải tự động khóa và hiển thị bóng mờ của vũ khí chính. Khi chọn vũ khí 1 tay (như Light Crossbow, Druidic Staff), ô Off-Hand phải mở khóa để chọn Cryptcandle, Muisak, Mistcaller, Torch...

[ ] Check 2 (Fallback Image): Nếu Render API của Albion chưa kịp tải hoặc lỗi mạng, phải có ảnh Skeleton/Placeholder khung viền RPG tối màu, tuyệt đối không để vỡ layout (Broken Image Icon).

[ ] Check 3 (Number Formatting): Toàn bộ giá bạc (Silver) và Fame phải được format có dấu phân cách hàng nghìn rõ ràng (VD: 1,250,000 Silver hoặc rút gọn 1.25M) và dùng font JetBrains Mono.

[ ] Check 4 (Mobile Tap vs Desktop Hover): Trên màn hình cảm ứng (Mobile/Tablet), thao tác Hover để xem Tooltip phải tự động chuyển thành Tap 1 lần mở Bottom Sheet / Modal, Tap lần 2 hoặc nút chọn để lắp vào Slot.