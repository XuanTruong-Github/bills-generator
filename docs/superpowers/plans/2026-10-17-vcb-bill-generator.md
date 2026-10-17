# VCB Digibank Bill Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng ứng dụng web React + Tailwind CSS + shadcn/ui cho phép nhập thông tin giao dịch qua biểu mẫu và render ra hóa đơn chuyển tiền VCB Digibank trong khung máy iPhone 16 Pro Max, xuất ảnh PNG sắc nét giống 100% ảnh mẫu `bill.JPG`.

**Architecture:** Ứng dụng client-side hoạt động dựa trên luồng dữ liệu 1 chiều (unidirectional data flow) trong React. `BillForm` quản lý state giao dịch (`BillData`), đồng bộ theo thời gian thực tới `BillPreview` đặt trong `IPhoneFrame`. Pipeline xuất ảnh sử dụng `html-to-image` bắt chính xác DOM node của hóa đơn ở kích thước chuẩn 1320 × 2531 px để xuất file ảnh PNG không có viền điện thoại.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, Lucide React, html-to-image, Vitest, React Testing Library.

**Spec:** [docs/superpowers/specs/2026-10-17-vcb-bill-generator-design.md](file:///Users/truonglx/Workspace/bills-generator/docs/superpowers/specs/2026-10-17-vcb-bill-generator-design.md)

## Global Constraints

- **Công nghệ bắt buộc:** ReactJS + Tailwind CSS + shadcn/ui.
- **Mặc định ngân hàng nhận:** TPBANK (Ngân hàng Tiên phong) với logo vector chính thức (gradient cam - tím).
- **Khung máy:** iPhone 16 Pro Max (viền mỏng Titanium bo góc 54px, thanh Home Indicator ở cạnh đáy).
- **Thanh trạng thái:** Tuyệt đối không có thanh trạng thái điện thoại (status bar: pin, sóng, wifi).
- **Phạm vi xuất ảnh PNG:** Chỉ xuất phần hóa đơn phẳng (1320 × 2531 px) đúng như `bill.JPG`, không chứa viền thân máy.
- **Độ tương đồng:** Tái tạo hoa văn chìm Vietcombank mandala/trống đồng tỏa từ checkmark xanh lá đạt độ tương đồng 98%+.

## Review Focus

1. **Số tiền nhập vào chứa ký tự đặc biệt hoặc số quá lớn:** Format tiền tệ phải tự động loại bỏ ký tự không phải số, định dạng phân cách hàng nghìn bằng dấu phẩy (ví dụ `110,000`), không để `NaN`.
2. **Nội dung chuyển khoản dài nhiều dòng:** Tự động ngắt dòng và co giãn padding thẻ hóa đơn mà không làm vỡ tỉ lệ hoặc che khuất mã tham chiếu phía dưới.
3. **Chuyển đổi giữa các ngân hàng trong dropdown:** Khi chọn Vietcombank, hình thức chuyển đổi sang "Chuyển tiền trong Vietcombank" và ẩn logo Napas 247; khi chọn TPBank hoặc các ngân hàng khác, tự phục hồi "Chuyển tiền nhanh" kèm logo Napas 247.
4. **Ký tự tên người nhận:** Tự động viết hoa không dấu/có dấu chuẩn hóa ngân hàng (UPPERCASE) ngay khi người dùng gõ.
5. **Độ sắc nét khi xuất ảnh trên màn hình Retina/Mobile:** Canvas capture của `html-to-image` phải chỉ định `pixelRatio: 2` hoặc kích thước chuẩn 1320px để ảnh tải về không bị mờ hay răng cưa chữ.

---

### Task 1: Scaffolding dự án Vite React TypeScript & Cấu hình môi trường

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`, `src/index.css`, `index.html`
- Test: `src/App.test.tsx`

**Interfaces:**
- Produces: Project build & test runtime sẵn sàng cho React, Tailwind CSS và Vitest.

- [ ] **Step 1: Khởi tạo package.json và cài đặt dependencies**

Cài đặt React, ReactDOM, Tailwind CSS, Lucide React, clsx, tailwind-merge, html-to-image, Vitest, @testing-library/react, jsdom.

- [ ] **Step 2: Cấu hình Vite, Tailwind CSS, PostCSS và Vitest**

Thiết lập file `vite.config.ts` với plugin react và cấu hình test jsdom; cấu hình `tailwind.config.js` với các màu sắc thương hiệu VCB (`#025938`, `#65a30d`, `#15803d`).

- [ ] **Step 3: Viết test kiểm tra khởi động môi trường**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('Environment Scaffolding', () => {
  it('renders without crashing', () => {
    render(<div data-testid="app-root">VCB Bill Generator</div>);
    expect(screen.getByTestId('app-root')).toHaveTextContent('VCB Bill Generator');
  });
});
```

- [ ] **Step 4: Chạy test kiểm tra môi trường**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit scaffolding**

```bash
git init
git add .
git commit -m "chore: scaffold react tailwind vitest environment"
```

---

### Task 2: Data Models, Formatters & Utilities

**Files:**
- Create: `src/types/bill.ts`
- Create: `src/utils/formatters.ts`
- Create: `src/utils/generators.ts`
- Test: `src/utils/formatters.test.ts`
- Test: `src/utils/generators.test.ts`

**Interfaces:**
- Produces:
  - `interface BillData`
  - `formatVND(value: string | number): string`
  - `formatCurrentDateTime(): string`
  - `generateRandomReferenceCode(): string`
  - `generateRandomTransactionId(): string`
  - `SAMPLE_BILL_DATA: BillData`

- [ ] **Step 1: Viết test cho formatters và generators**

```ts
import { describe, it, expect } from 'vitest';
import { formatVND, formatCurrentDateTime } from './formatters';
import { generateRandomReferenceCode, generateRandomTransactionId } from './generators';

describe('formatters', () => {
  it('formats number string with commas', () => {
    expect(formatVND('110000')).toBe('110,000');
    expect(formatVND(5000000)).toBe('5,000,000');
    expect(formatVND('abc')).toBe('0');
  });

  it('formats current datetime in Vietnamese standard format', () => {
    const formatted = formatCurrentDateTime(new Date('2026-10-16T09:08:00'));
    expect(formatted).toContain('09:08');
    expect(formatted).toContain('16/10/2026');
  });
});

describe('generators', () => {
  it('generates 16-character alphanumeric uppercase reference code', () => {
    const code = generateRandomReferenceCode();
    expect(code).toMatch(/^[A-Z0-9]{16}$/);
  });

  it('generates 11-digit numeric transaction id', () => {
    const id = generateRandomTransactionId();
    expect(id).toMatch(/^\d{11}$/);
  });
});
```

- [ ] **Step 2: Chạy test để xác nhận fail**

Run: `npx vitest run src/utils/formatters.test.ts src/utils/generators.test.ts`
Expected: FAIL

- [ ] **Step 3: Cài đặt types, formatters và generators**

Xây dựng `BillData` interface chứa tất cả các trường: `amount`, `accountNumber`, `accountName`, `bankId`, `bankName`, `bankSubName`, `content`, `dateTime`, `referenceCode`, `transferFee`, `transferType`, `transactionId`, `saveTemplate`. Cài đặt logic định dạng và sinh mã ngẫu nhiên.

- [ ] **Step 4: Chạy test xác nhận pass**

Run: `npx vitest run src/utils/formatters.test.ts src/utils/generators.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/types/ src/utils/
git commit -m "feat: add bill data types, formatters and generators"
```

---

### Task 3: Vector Bank Logos & Bank Catalog

**Files:**
- Create: `src/components/bill/BankLogos.tsx`
- Create: `src/data/banks.ts`
- Test: `src/components/bill/BankLogos.test.tsx`

**Interfaces:**
- Produces:
  - `BankLogo: React.FC<{ bankId: string, className?: string }>`
  - `NapasLogo: React.FC<{ className?: string }>`
  - `VCBLogoText: React.FC<{ className?: string }>`
  - `BANKS_CATALOG: BankOption[]` (với TPBank là mục đầu tiên mặc định)

- [ ] **Step 1: Viết test cho BankLogos và catalog**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BankLogo, NapasLogo, VCBLogoText } from './BankLogos';
import { BANKS_CATALOG, DEFAULT_BANK } from '../../data/banks';

describe('BankLogos and Catalog', () => {
  it('has TPBank as default bank with correct details', () => {
    expect(DEFAULT_BANK.id).toBe('tpbank');
    expect(DEFAULT_BANK.name).toBe('TPBANK');
    expect(DEFAULT_BANK.subName).toBe('Ngân hàng Tiên phong');
  });

  it('renders TPBank vector svg logo', () => {
    const { container } = render(<BankLogo bankId="tpbank" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders Napas 247 logo', () => {
    render(<NapasLogo />);
    expect(screen.getByText('napas')).toBeInTheDocument();
    expect(screen.getByText('247')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Chạy test để xác nhận fail**

Run: `npx vitest run src/components/bill/BankLogos.test.tsx`
Expected: FAIL

- [ ] **Step 3: Cài đặt BankLogos và danh mục ngân hàng**

Nhúng vector SVG tam giác đa diện TPBank (chuẩn hóa gradient cam-tím), vector Napas 247, logo VCB và cấu hình danh mục các ngân hàng (TPBank, Vietcombank, Techcombank, MB, BIDV, VietinBank, ACB, VPBank).

- [ ] **Step 4: Chạy test xác nhận pass**

Run: `npx vitest run src/components/bill/BankLogos.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/bill/BankLogos.tsx src/data/banks.ts
git commit -m "feat: add bank catalog and vector logos"
```

---

### Task 4: Bill Canvas Component (VCB Digibank Template)

**Files:**
- Create: `src/components/bill/MandalaBackground.tsx`
- Create: `src/components/bill/BillPreview.tsx`
- Test: `src/components/bill/BillPreview.test.tsx`

**Interfaces:**
- Consumes: `BillData` từ `src/types/bill.ts`, `BankLogo`, `NapasLogo` từ `src/components/bill/BankLogos.tsx`
- Produces: `BillPreview: React.ForwardRefExoticComponent<BillPreviewProps>` (nhận ref để capture ảnh)

- [ ] **Step 1: Viết test cho BillPreview**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BillPreview } from './BillPreview';
import { SAMPLE_BILL_DATA } from '../../types/bill';

describe('BillPreview', () => {
  it('renders all key transaction details from bill data', () => {
    render(<BillPreview data={SAMPLE_BILL_DATA} />);
    expect(screen.getByText('VCB')).toBeInTheDocument();
    expect(screen.getByText('Digibank')).toBeInTheDocument();
    expect(screen.getByText('Giao dịch thành công!')).toBeInTheDocument();
    expect(screen.getByText('110,000')).toBeInTheDocument();
    expect(screen.getByText('16986889999')).toBeInTheDocument();
    expect(screen.getByText('HKD CARNA SPORTS')).toBeInTheDocument();
    expect(screen.getByText('TPBANK')).toBeInTheDocument();
    expect(screen.getByText('Thanh toan online ve SC31531')).toBeInTheDocument();
    expect(screen.getByText('6289BFTVGLCCKWSZ')).toBeInTheDocument();
    expect(screen.getByText('16559745403')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Chạy test để xác nhận fail**

Run: `npx vitest run src/components/bill/BillPreview.test.tsx`
Expected: FAIL

- [ ] **Step 3: Cài đặt MandalaBackground & BillPreview**

Thiết kế `BillPreview.tsx` chuẩn xác từng pixel theo `bill.JPG`:
- Nền chuyển sắc xanh ngọc nhạt kết hợp hoa văn mandala chìm `MandalaBackground.tsx`.
- Header: VCB xanh đậm + Digibank xanh nõn chuối, icon Home tròn.
- Vùng trạng thái: Checkmark tròn xanh lá đậm với viền mờ mềm mại, số tiền lớn kèm ký hiệu VND.
- Thẻ chi tiết bo góc tròn 20px với bảng thông tin 2 cột cân đối.
- Icon sao chép mã tham chiếu ❐ và toggle lưu mẫu.

- [ ] **Step 4: Chạy test xác nhận pass**

Run: `npx vitest run src/components/bill/BillPreview.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/bill/MandalaBackground.tsx src/components/bill/BillPreview.tsx
git commit -m "feat: implement VCB Digibank bill preview template"
```

---

### Task 5: iPhone 16 Pro Max Device Frame Container

**Files:**
- Create: `src/components/frame/IPhoneFrame.tsx`
- Test: `src/components/frame/IPhoneFrame.test.tsx`

**Interfaces:**
- Consumes: `children: React.ReactNode`
- Produces: `IPhoneFrame: React.FC<{ children: React.ReactNode }>`

- [ ] **Step 1: Viết test cho IPhoneFrame**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { IPhoneFrame } from './IPhoneFrame';

describe('IPhoneFrame', () => {
  it('renders children inside frame without phone status bar', () => {
    render(
      <IPhoneFrame>
        <div data-testid="screen-content">Bill Content</div>
      </IPhoneFrame>
    );
    expect(screen.getByTestId('screen-content')).toBeInTheDocument();
    // Verify no status bar elements present
    expect(screen.queryByTestId('status-bar')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Chạy test để xác nhận fail**

Run: `npx vitest run src/components/frame/IPhoneFrame.test.tsx`
Expected: FAIL

- [ ] **Step 3: Cài đặt IPhoneFrame component**

Tạo khung máy iPhone 16 Pro Max với:
- Viền kim loại Titanium đen/xám mỏng thanh lịch.
- Bán kính góc bo `54px`.
- Đổ bóng thực tế `box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35)`.
- Thanh Home Indicator ở cạnh đáy.
- Hoàn toàn không chứa thanh pin/sóng/wifi theo yêu cầu người dùng.

- [ ] **Step 4: Chạy test xác nhận pass**

Run: `npx vitest run src/components/frame/IPhoneFrame.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/frame/IPhoneFrame.tsx
git commit -m "feat: implement iPhone 16 Pro Max device frame"
```

---

### Task 6: Control Form & Quick Action Controls

**Files:**
- Create: `src/components/form/BillForm.tsx`
- Create: `src/components/form/QuickActions.tsx`
- Test: `src/components/form/BillForm.test.tsx`

**Interfaces:**
- Consumes: `data: BillData`, `onChange: (newData: BillData) => void`, `onResetSample: () => void`, `onRandomize: () => void`
- Produces: `BillForm`, `QuickActions`

- [ ] **Step 1: Viết test cho BillForm tương tác**

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BillForm } from './BillForm';
import { SAMPLE_BILL_DATA } from '../../types/bill';

describe('BillForm', () => {
  it('calls onChange with updated uppercase recipient name when typed', () => {
    const handleChange = vi.fn();
    render(<BillForm data={SAMPLE_BILL_DATA} onChange={handleChange} />);
    const nameInput = screen.getByLabelText(/Tên người nhận/i);
    fireEvent.change(nameInput, { target: { value: 'nguyen van a' } });
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ accountName: 'NGUYEN VAN A' })
    );
  });

  it('formats amount automatically on input change', () => {
    const handleChange = vi.fn();
    render(<BillForm data={SAMPLE_BILL_DATA} onChange={handleChange} />);
    const amountInput = screen.getByLabelText(/Số tiền/i);
    fireEvent.change(amountInput, { target: { value: '250000' } });
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ amount: '250,000' })
    );
  });
});
```

- [ ] **Step 2: Chạy test để xác nhận fail**

Run: `npx vitest run src/components/form/BillForm.test.tsx`
Expected: FAIL

- [ ] **Step 3: Cài đặt BillForm & QuickActions**

Cài đặt form nhập liệu chuẩn shadcn/ui với:
- Input số tiền, số tài khoản, tên người nhận (uppercase).
- Select dropdown ngân hàng nhận (mặc định TPBank, tự động cập nhật tên, logo và hình thức chuyển).
- Input nội dung, thời gian (nút lấy giờ hiện tại), mã tham chiếu (nút sinh mã ngẫu nhiên), mã GD.
- Toggle switch lưu mẫu chuyển tiền.
- QuickActions: nút "Điền mẫu gốc `bill.JPG`" và nút "Sinh ngẫu nhiên mã GD & thời gian".

- [ ] **Step 4: Chạy test xác nhận pass**

Run: `npx vitest run src/components/form/BillForm.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/form/
git commit -m "feat: implement bill input form and quick actions"
```

---

### Task 7: Image Export Pipeline (Exact Flat Screenshot)

**Files:**
- Create: `src/utils/exportImage.ts`
- Test: `src/utils/exportImage.test.ts`

**Interfaces:**
- Consumes: `domNode: HTMLElement`, `fileName?: string`
- Produces:
  - `downloadBillImage(node: HTMLElement, filename?: string): Promise<boolean>`
  - `copyBillImageToClipboard(node: HTMLElement): Promise<boolean>`

- [ ] **Step 1: Viết test cho export utility**

```ts
import { describe, it, expect, vi } from 'vitest';
import { downloadBillImage } from './exportImage';

describe('exportImage', () => {
  it('calls html-to-image with correct pixel ratio and trigger download', async () => {
    const dummyNode = document.createElement('div');
    const result = await downloadBillImage(dummyNode, 'vcb-bill.png');
    expect(typeof result).toBe('boolean');
  });
});
```

- [ ] **Step 2: Chạy test để xác nhận fail**

Run: `npx vitest run src/utils/exportImage.test.ts`
Expected: FAIL

- [ ] **Step 3: Cài đặt exportImage logic**

Sử dụng `toPng` từ `html-to-image` với các options:
- `pixelRatio: 2` (hoặc scale 1320px) cho độ nét cao chuẩn Retina.
- Chuyển canvas thành Blob và kích hoạt tải về qua URL blob.
- Xử lý clipboard qua `navigator.clipboard.write([new ClipboardItem(...)])`.

- [ ] **Step 4: Chạy test xác nhận pass**

Run: `npx vitest run src/utils/exportImage.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/utils/exportImage.ts
git commit -m "feat: implement high-resolution flat screenshot export"
```

---

### Task 8: App Integration & End-to-End Verification

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`
- Test: `src/App.test.tsx`

**Interfaces:**
- Tích hợp toàn diện: `App.tsx` kết nối Form điều khiển bên trái và Live Phone Preview bên phải.

- [ ] **Step 1: Viết test tích hợp toàn diện cho App**

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Integration', () => {
  it('renders split layout with form on left and phone preview on right', () => {
    render(<App />);
    expect(screen.getByText(/Thông tin Giao Dịch/i)).toBeInTheDocument();
    expect(screen.getByText(/Giao dịch thành công!/i)).toBeInTheDocument();
  });

  it('updates phone preview in real-time when form is updated', () => {
    render(<App />);
    const amountInput = screen.getByLabelText(/Số tiền/i);
    fireEvent.change(amountInput, { target: { value: '990000' } });
    expect(screen.getAllByText('990,000').length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Chạy test để xác nhận fail**

Run: `npx vitest run src/App.test.tsx`
Expected: FAIL

- [ ] **Step 3: Cài đặt `App.tsx` hoàn chỉnh**

Tạo giao diện Split Screen 2 cột chuyên nghiệp:
- Cột trái: Tiêu đề ứng dụng, Toolbar mẫu nhanh, Form nhập dữ liệu, Nút "Tải ảnh Bill (.PNG)" và "Sao chép ảnh".
- Cột phải: Khung hiển thị iPhone 16 Pro Max với BillPreview trực tiếp, cập nhật theo thời gian thực.
- Toast thông báo phản hồi nhanh khi copy hoặc tải ảnh.

- [ ] **Step 4: Chạy test xác nhận pass**

Run: `npm test`
Expected: ALL PASS

- [ ] **Step 5: Build production và kiểm tra kích thước bundle**

Run: `npm run build`
Expected: Build thành công không có lỗi TypeScript hay warning.

- [ ] **Step 6: Commit hoàn thiện**

```bash
git add src/
git commit -m "feat: complete VCB Digibank bill generator application"
```
