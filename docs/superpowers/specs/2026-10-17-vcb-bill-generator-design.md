# Design Document: VCB Digibank Bill Generator (iPhone 16 Pro Max)

**Ngày tạo:** 2026-10-17  
**Trạng thái:** Chờ phê duyệt  
**Tác giả:** Antigravity & User  

---

## 1. Intent and Why (Mục đích & Lý do)

Ứng dụng web cho phép người dùng nhập thông tin giao dịch chuyển khoản ngân hàng thông qua một biểu mẫu trực quan, sau đó kết xuất (render) thành hóa đơn chuyển tiền điện tử mô phỏng chính xác giao diện ứng dụng **VCB Digibank** (Vietcombank) dựa trên mẫu hóa đơn thực tế `bill.JPG`. Toàn bộ hóa đơn được hiển thị trong khung máy **iPhone 16 Pro Max** sang trọng (viền mỏng Titanium) và có thể tải về dưới dạng ảnh PNG chất lượng cao.

---

## 2. Goals, Non-Goals & Anti-Goals

### Goals
- **Biểu mẫu nhập liệu linh hoạt (shadcn/ui + Tailwind CSS):**
  - **Số tiền giao dịch (VND):** Hỗ trợ format số tự động (ví dụ: `110,000`).
  - **Tài khoản nhận:** Chuỗi số tài khoản người nhận.
  - **Tên người nhận:** Tự động chuyển thành chữ hoa (in hoa chuẩn hóa ngân hàng).
  - **Ngân hàng nhận:** Mặc định chọn sẵn **TPBANK - Ngân hàng Tiên phong** kèm biểu tượng logo tam giác vector gradient đa diện chính thức. Cho phép chọn các ngân hàng phổ biến khác tại Việt Nam.
  - **Nội dung giao dịch:** Chuỗi văn bản tùy ý.
  - **Thời gian giao dịch:** Hỗ trợ nhập tay hoặc bấm nút "Lấy thời gian hiện tại" (định dạng `HH:mm Thứ [Thứ] DD/MM/YYYY`).
  - **Mã tham chiếu:** Chuỗi ký tự ngẫu nhiên hoặc nhập tay (ví dụ: `6289BFTVGLCCKWSZ`), kèm nút copy nhanh.
  - **Phí chuyển tiền:** Mặc định "Miễn phí" hoặc nhập phí tùy chỉnh.
  - **Hình thức chuyển:** Mặc định "Chuyển tiền nhanh napas 247" (kèm logo napas 247).
  - **Mã giao dịch:** Chuỗi số (ví dụ: `16559745403`), có nút sinh ngẫu nhiên.
  - **Lưu mẫu chuyển tiền:** Toggle Switch bật/tắt.
- **Giao diện Hóa đơn VCB Digibank chuẩn xác 98%+:**
  - Mô phỏng chính xác typography, khoảng cách, màu sắc thương hiệu VCB (`#025938`, `#65a30d`, `#15803d`).
  - Hiệu ứng nền hoa văn/gradient xanh ngọc nhạt đặc trưng của Vietcombank.
  - Checkmark tròn xanh lá đậm với đổ bóng mềm mại.
  - Thẻ thông tin (card) viền mỏng bo góc 20px, nền bán trong suốt `rgba(255,255,255,0.92)`.
  - Logo TPBank chuẩn vector SVG (sắc nét không vỡ hạt).
  - Logo Napas 247 thiết kế chuẩn nhận diện.
- **Khung hiển thị iPhone 16 Pro Max:**
  - Tỷ lệ màn hình hiện đại, góc bo `54px`, viền kim loại Titanium mỏng và đổ bóng thực tế.
  - **Không có thanh trạng thái điện thoại (status bar: pin, sóng, wifi)** theo đúng yêu cầu người dùng.
  - Có thanh Home Indicator bo tròn mỏng tinh tế ở cạnh đáy.
- **Tiện ích xuất ảnh & tương tác:**
  - Nút **Tải ảnh bill PNG** (sử dụng thư viện `html-to-image` với scale 2x/3x để ảnh siêu nét trên mọi thiết bị).
  - Nút **Điền mẫu nhanh** (khôi phục dữ liệu đúng như ảnh mẫu `bill.JPG`).
  - Nút **Sinh mã ngẫu nhiên** (đổi mã tham chiếu, mã giao dịch, thời gian mới ngay lập tức).
  - Live Preview cập nhật tức thì theo thời gian thực khi gõ form.

### Non-Goals
- Không kết nối API tài khoản thực tế của Vietcombank hay TPBank (ứng dụng client-side độc lập).
- Không yêu cầu backend/database server, ứng dụng chạy 100% trên trình duyệt web, đảm bảo an toàn và bảo mật dữ liệu cục bộ cho người dùng.

### Anti-Goals
- Không để sai lệch màu sắc nhận diện của Vietcombank (VCB Green) và TPBank (Orange - Purple).
- Không làm vỡ layout khi nội dung chuyển khoản quá dài (tự động xuống dòng và cân chỉnh chiều cao hài hòa).
- Không chèn watermark hay làm mờ chất lượng ảnh khi xuất ra PNG.

---

## 3. Technology Stack & Constraints (Công nghệ & Ràng buộc)

- **Ngôn ngữ & Nền tảng:** React 18+ với TypeScript / JavaScript, Vite làm bundler cho tốc độ phản hồi cực nhanh.
- **Styling:** Tailwind CSS cho toàn bộ hệ thống style, tiện ích utility-first.
- **UI Components:** shadcn/ui (Card, Input, Button, Label, Switch, Select, Tooltip, Badge).
- **Icons:** `lucide-react` cho các biểu tượng giao diện web; SVG nội tại chuẩn xác cho logo TPBank, Vietcombank, Napas 247.
- **Image Export:** `html-to-image` (hoặc `html2canvas`) hỗ trợ render DOM thành PNG với độ phân giải cao.

---

## 4. UI Architecture & Layout (Bố cục giao diện)

Giao diện ứng dụng được chia thành 2 khu vực chính trên màn hình máy tính (responsive thu gọn theo tab trên mobile):

1. **Bảng điều khiển bên trái (Control Panel - 45%):**
   - Header ứng dụng với logo và nút "Điền dữ liệu mẫu" (Reset to Sample).
   - Form nhập liệu các trường theo nhóm logic:
     - Nhóm 1: Số tiền & Người nhận (Số tài khoản, Tên người nhận, Dropdown chọn ngân hàng).
     - Nhóm 2: Nội dung & Thời gian (Nội dung GD, Thời gian GD + nút lấy giờ hiện tại).
     - Nhóm 3: Thông số hệ thống (Mã tham chiếu + nút sinh mã, Mã giao dịch, Phí, Hình thức, Toggle Lưu mẫu).
   - Nút thao tác chính: "Tải ảnh Bill (.PNG)" và "Sao chép ảnh vào Clipboard".

2. **Khung Preview bên phải (Live Phone Preview - 55%):**
   - Vùng hiển thị trung tâm với nền xám nhạt nhẹ nhàng làm nổi bật khung máy.
   - Khung máy **iPhone 16 Pro Max** với viền đen/titanium siêu mỏng bo góc 54px.
   - Bên trong khung là toàn bộ màn hình hóa đơn VCB Digibank, không có status bar.
   - Cạnh dưới là Home indicator thanh mảnh.
   - Nút bấm nhanh Tải ảnh nổi (floating action) ngay cạnh khung điện thoại để thao tác nhanh.

---

## 5. Danh sách Ngân hàng Hỗ trợ trong Dropdown
- **Mặc định:** TPBANK (Ngân hàng Tiên phong) - Đầy đủ logo SVG.
- Các ngân hàng phổ biến khác bổ sung:
  - Vietcombank (Ngân hàng Ngoại thương Việt Nam)
  - Techcombank (Ngân hàng Kỹ thương Việt Nam)
  - MBBank (Ngân hàng Quân đội)
  - BIDV (Ngân hàng Đầu tư và Phát triển Việt Nam)
  - VietinBank (Ngân hàng Công thương Việt Nam)
  - ACB (Ngân hàng Á Châu)
  - VPBank (Ngân hàng Việt Nam Thịnh Vượng)

---

## 6. What's Left to the Builder (Các quyết định kỹ thuật nội bộ)
- Cấu trúc thư mục mã nguồn:
  - `src/components/bill/`: `BillPreview.tsx`, `IPhoneFrame.tsx`, `BankLogos.tsx`.
  - `src/components/form/`: `BillForm.tsx`, `QuickActions.tsx`.
  - `src/types/`: `bill.ts` (định nghĩa interface `BillData`).
  - `src/utils/`: `formatters.ts` (format tiền tệ VND, ngày tháng), `generators.ts` (sinh mã tham chiếu, mã GD ngẫu nhiên), `exportImage.ts` (xuất DOM ra PNG).
- Xử lý thông báo toast nhẹ nhàng khi sao chép thành công hoặc tải ảnh hoàn tất.

---

## 7. Builder Resolutions & Technical Calls (Các quyết định kỹ thuật đã giải quyết)

1. **Họa tiết nền VCB (Mandala / Trống đồng Đông Sơn):**
   - Không dùng gradient trơn đơn giản; ứng dụng sẽ tích hợp hoa văn vector SVG mandala chìm với độ mờ tinh tế (~8% opacity, mix-blend-mode: multiply), tỏa ra từ tâm checkmark xanh lá đúng như `bill.JPG` thật để đạt độ tương đồng 99%.

2. **Kích thước độ phân giải xuất ảnh:**
   - Cố định chiều rộng canvas capture là **1320px** (đúng theo thông số pixel đo được từ `bill.JPG` gốc: 1320 × 2531 px), sử dụng font hiển thị native mượt mà để khi zoom vào các chi tiết số tiền và mã giao dịch vẫn giữ độ sắc nét tối đa.

3. **Cơ chế liên kết thông minh giữa Ngân hàng và Hình thức chuyển:**
   - Mặc định chọn **TPBANK**: Hình thức chuyển là `Chuyển tiền nhanh` kèm logo `napas 247`.
   - Nếu người dùng chuyển sang ngân hàng thụ hưởng là `Vietcombank`: Tự động gợi ý đổi hình thức thành `Chuyển tiền trong Vietcombank` và ẩn logo Napas (người dùng vẫn có thể ghi đè thủ công nếu muốn).

4. **Xử lý nội dung dài:**
   - Thiết lập font size linh hoạt (clamp/dynamic padding) để với các nội dung giao dịch từ ngắn đến dài (3 dòng), hóa đơn vẫn giữ bố cục cân đối hoàn hảo trong màn hình điện thoại mà không bị tràn viền.

5. **Phạm vi đối tượng khi xuất ảnh (Xác nhận từ người dùng):**
   - **Xuất ảnh đúng nguyên bản như ảnh chụp màn hình giao dịch thật:** Khi bấm "Tải ảnh Bill (.PNG)", ảnh xuất ra là toàn bộ nội dung hóa đơn VCB Digibank phẳng (kích thước chuẩn 1320 × 2531 px, nền và các chi tiết đúng như file `bill.JPG`), hoàn toàn **không** chứa viền vỏ máy kim loại hay bóng đổ bên ngoài.
   - Khung máy **iPhone 16 Pro Max** đóng vai trò là khung xem trước trực quan (interactive live preview wrapper) trên web, giúp người dùng có trải nghiệm chân thực khi thao tác nhập liệu.

