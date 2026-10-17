import { forwardRef, useState, useCallback } from "react";
import { Check, Home, Copy } from "lucide-react";
import { BillData } from "../../types/bill";
import { BankLogo, NapasLogo, VCBLogoText } from "./BankLogos";
import { MandalaBackground } from "./MandalaBackground";

export interface BillPreviewProps {
  data: BillData;
  className?: string;
  showActions?: boolean;
}

/**
 * BillPreview renders the pixel-accurate Vietcombank (VCB Digibank)
 * electronic payment receipt matching bill.JPG.
 *
 * Implements React.forwardRef so capturing libraries (html-to-image)
 * can attach directly to the canvas root DOM node.
 */
export const BillPreview = forwardRef<HTMLDivElement, BillPreviewProps>(
  ({ data, className = "" }, ref) => {
    const [copied, setCopied] = useState(false);

    const handleCopyReference = useCallback(async () => {
      if (!data.referenceCode) return;
      try {
        await navigator.clipboard.writeText(data.referenceCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy reference code:", err);
      }
    }, [data.referenceCode]);

    const normalizedBankId = (data.bankId || "").trim().toLowerCase();
    const isVCB =
      normalizedBankId === "vietcombank" || normalizedBankId === "vcb";
    const shouldShowNapas =
      !isVCB &&
      (data.transferType.toLowerCase().includes("nhanh") ||
        data.transferType.toLowerCase().includes("napas"));

    return (
      <div
        ref={ref}
        data-testid="bill-preview-canvas"
        className={`relative w-full max-w-[420px] mx-auto min-h-[760px] bg-gradient-to-b from-[#f2f9f4] via-[#eaf5ed] to-[#f4faf5]  font-sans antialiased overflow-hidden flex flex-col p-5 sm:p-6 select-none ${className}`}
        style={{
          boxSizing: "border-box",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        {/* Authentic Dong Son / Lotus radial mandala SVG watermark */}
        <MandalaBackground />

        {/* 1. Header: VCB Digibank branding on left, Home icon button on right */}
        <div className="relative z-10 flex items-center justify-between pt-1 pb-3">
          <VCBLogoText />
          <button
            type="button"
            aria-label="Trang chủ"
            className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-emerald-100/60 flex items-center justify-center text-[#025938] hover:bg-white active:scale-95 transition-all"
          >
            <Home className="w-5 h-5 stroke-[1.8]" />
          </button>
        </div>

        {/* 2. Success Status Section */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center pt-2 pb-4">
          <div className="relative flex items-center justify-center mb-2.5">
            {/* Soft radial glow aura */}
            <div className="absolute w-20 h-20 rounded-full bg-emerald-300/40 blur-xl pointer-events-none" />
            {/* Checkmark circle badge */}
            <div
              data-testid="checkmark-badge"
              className="relative z-10 size-[40px] rounded-full bg-[#70a800] shadow-[0_4px_12px_rgba(27,131,68,0.25)] flex items-center justify-center text-white ring-4 ring-emerald-50"
            >
              <Check className="size-6 stroke-[3]" />
            </div>
          </div>

          <h2 className="font-semibold text-green-900 text-base tracking-tight">
            Giao dịch thành công!
          </h2>

          <div className="flex items-start justify-center gap-1.5 mt-2">
            <span className="text-2xl font-bold tracking-tight text-green-900 leading-none">
              {data.amount}
            </span>
            <span className="text-xs text-green-900 tracking-normal">VND</span>
          </div>

          <p className="text-xs text-gray-500 font-medium mt-1.5">
            {data.dateTime}
          </p>
        </div>

        {/* 3. Detail Card */}
        <div className="relative z-10 rounded-xl border p-3 mt-2 space-y-3">
          {/* Row 1: Tài khoản nhận */}
          <div className="flex justify-between items-center pb-2.5 border-b text-xs">
            <span className="text-gray-500">Tài khoản nhận</span>
            <span className="font-bold  tracking-wide">
              {data.accountNumber}
            </span>
          </div>

          {/* Row 2: Tên người nhận */}
          <div className="flex justify-between items-center pb-2.5 border-b text-xs">
            <span className="text-gray-500">Tên người nhận</span>
            <span className="font-bold  uppercase text-right tracking-tight">
              {data.accountName}
            </span>
          </div>

          {/* Row 3: Ngân hàng nhận */}
          <div className="flex justify-between items-start pb-2.5 border-b text-xs">
            <span className="text-gray-500 pt-0.5">Ngân hàng nhận</span>
            <div className="flex flex-col items-end text-right">
              <div className="flex items-center gap-1.5">
                <BankLogo
                  bankId={data.bankId}
                  className="w-5 h-5 flex-shrink-0"
                />
                <span className="font-extrabold ">{data.bankName}</span>
              </div>
              {data.bankSubName && (
                <span className="text-[11px] text-gray-500 mt-0.5 font-normal">
                  {data.bankSubName}
                </span>
              )}
            </div>
          </div>

          {/* Row 4: Nội dung */}
          <div className="flex justify-between items-start pb-2.5 border-b text-xs">
            <span className="text-gray-500">Nội dung</span>
            <span className="font-bold text-right max-w-[210px] break-words leading-snug">
              {data.content}
            </span>
          </div>

          {/* Row 5: Mã tham chiếu */}
          <div className="flex justify-between items-center pb-2.5 border-b text-xs">
            <span className="text-gray-500">Mã tham chiếu</span>
            <div className="flex items-center gap-1.5">
              <span className="font-bold font-mono tracking-tight">
                {data.referenceCode}
              </span>
              <button
                type="button"
                onClick={handleCopyReference}
                aria-label="Sao chép mã tham chiếu"
                title="Sao chép mã tham chiếu"
                className="p-1 rounded text-gray-400 hover:text-emerald-700 transition-colors focus:outline-none"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                ) : (
                  <Copy className="w-3.5 h-3.5 stroke-[2]" />
                )}
              </button>
            </div>
          </div>

          {/* Row 6: Phí chuyển tiền */}
          <div className="flex justify-between items-center pb-2.5 border-b text-xs">
            <span className="text-gray-500">Phí chuyển tiền</span>
            <span className="font-semibold">{data.transferFee}</span>
          </div>

          {/* Row 7: Hình thức chuyển */}
          <div className="flex justify-between items-start pb-2.5 border-b text-xs">
            <span className="text-gray-500 pt-0.5">
              Hình thức chuyển
            </span>
            <div className="flex flex-col items-end text-right">
              <span className="font-bold">{data.transferType}</span>
              {shouldShowNapas && (
                <div className="mt-0.5">
                  <NapasLogo className="text-xs" />
                </div>
              )}
            </div>
          </div>

          {/* Row 8: Mã giao dịch */}
          <div className="flex justify-between items-center text-xs pt-0.5">
            <span className="text-gray-500">Mã giao dịch</span>
            <span className="font-bold font-mono tracking-tight">
              {data.transactionId}
            </span>
          </div>
        </div>

        {/* 4. Lưu mẫu chuyển tiền toggle switch */}
        <div className="relative z-10 flex items-center justify-between px-2 pt-3 pb-1 text-xs">
          <span className="font-medium text-gray-700">
            Lưu mẫu chuyển tiền
          </span>
          <div
            role="switch"
            aria-label="Lưu mẫu"
            aria-checked={data.saveTemplate}
            className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out p-0.5 flex items-center cursor-default ${
              data.saveTemplate ? "bg-[#1b8344]" : "bg-[#cbd5e1]"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${
                data.saveTemplate ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </div>
      </div>
    );
  },
);

BillPreview.displayName = "BillPreview";
