import { useState, useRef, useCallback } from "react";
import {
  Download,
  Copy,
  Check,
  Smartphone,
  FileEdit,
  Loader2,
  Sparkles,
} from "lucide-react";
import { BillData, SAMPLE_BILL_DATA } from "./types/bill";
import { BillForm } from "./components/form/BillForm";
import { BillPreview } from "./components/bill/BillPreview";
import { IPhoneFrame } from "./components/frame/IPhoneFrame";
import {
  downloadBillImage,
  copyBillImageToClipboard,
} from "./utils/exportImage";
import { formatCurrentDateTime } from "./utils/formatters";
import {
  generateRandomReferenceCode,
  generateRandomTransactionId,
} from "./utils/generators";

interface ToastState {
  message: string;
  type: "success" | "error" | "info";
}

export function App() {
  const [billData, setBillData] = useState<BillData>(SAMPLE_BILL_DATA);
  const [isExporting, setIsExporting] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");
  const [toast, setToast] = useState<ToastState | null>(null);

  const billRef = useRef<HTMLDivElement>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "success") => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
      setToast({ message, type });
      toastTimeoutRef.current = setTimeout(() => {
        setToast(null);
        toastTimeoutRef.current = null;
      }, 3500);
    },
    [],
  );

  const handleResetSample = useCallback(() => {
    setBillData(SAMPLE_BILL_DATA);
    showToast("Đã khôi phục dữ liệu mẫu ban đầu!", "info");
  }, [showToast]);

  const handleRandomize = useCallback(() => {
    setBillData((prev) => ({
      ...prev,
      referenceCode: generateRandomReferenceCode(),
      transactionId: generateRandomTransactionId(),
      dateTime: formatCurrentDateTime(),
    }));
    showToast("Đã tạo ngẫu nhiên mã và thời gian!", "info");
  }, [showToast]);

  const handleDownload = useCallback(async () => {
    if (!billRef.current) {
      showToast("Không tìm thấy khung hóa đơn để xuất ảnh.", "error");
      return;
    }
    setIsExporting(true);
    showToast("Đang tạo và tải ảnh hóa đơn...", "info");

    try {
      const filename = `vcb-bill-${billData.referenceCode || Date.now()}.png`;
      const success = await downloadBillImage(billRef.current, { filename });
      if (success) {
        showToast("Tải ảnh hóa đơn (.PNG) thành công!", "success");
      } else {
        showToast("Không thể tải ảnh. Vui lòng thử lại.", "error");
      }
    } catch (err) {
      console.error("Download error:", err);
      showToast("Đã xảy ra lỗi khi tạo ảnh hóa đơn.", "error");
    } finally {
      setIsExporting(false);
    }
  }, [billData.referenceCode, showToast]);

  const handleCopy = useCallback(async () => {
    if (!billRef.current) {
      showToast("Không tìm thấy khung hóa đơn để sao chép.", "error");
      return;
    }
    setIsCopying(true);
    showToast("Đang sao chép ảnh vào clipboard...", "info");

    try {
      const success = await copyBillImageToClipboard(billRef.current);
      if (success) {
        showToast("Đã sao chép ảnh vào clipboard!", "success");
      } else {
        showToast("Không thể sao chép ảnh vào clipboard.", "error");
      }
    } catch (err) {
      console.error("Copy error:", err);
      showToast("Đã xảy ra lỗi khi sao chép ảnh.", "error");
    } finally {
      setIsCopying(false);
    }
  }, [showToast]);

  return (
    <div
      data-testid="app-root"
      className="min-h-screen bg-slate-100/80 text-slate-900 flex flex-col font-sans"
    >
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            {/* Branding */}
            <div className="flex items-center gap-3">
              <img
                src="/logo.svg"
                alt="VCB Digibank"
                className="h-8 w-auto object-contain shrink-0"
              />
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  iPhone 16 Pro Max
                </span>
              </div>
            </div>

            {/* Header Export Actions */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <button
                type="button"
                onClick={handleCopy}
                disabled={isCopying}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-colors disabled:opacity-60"
              >
                {isCopying ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-600" />
                )}
                <span>Sao chép ảnh</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                disabled={isExporting}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-primary hover:bg-primary-hover active:bg-primary-dark rounded-lg shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>Tải ảnh Bill (.PNG)</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Tab Toggle */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-2">
        <div className="flex items-center justify-center gap-2 max-w-sm mx-auto p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            data-testid="tab-form"
            data-active={activeTab === "form" ? "true" : "false"}
            onClick={() => setActiveTab("form")}
            className={`flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "form"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>Nhập liệu</span>
          </button>
          <button
            type="button"
            data-testid="tab-preview"
            data-active={activeTab === "preview" ? "true" : "false"}
            onClick={() => setActiveTab("preview")}
            className={`flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "preview"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Xem hóa đơn</span>
          </button>
        </div>
      </div>

      {/* Main Content Area: Desktop Split View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Input Form & Quick Controls */}
          <div
            className={`lg:col-span-7 xl:col-span-7 space-y-4 ${
              activeTab === "form" ? "block" : "hidden lg:block"
            }`}
          >
            <BillForm
              data={billData}
              onChange={setBillData}
              onResetSample={handleResetSample}
              onRandomizeTimeAndCodes={handleRandomize}
            />
          </div>

          {/* Right Column: Sticky Live Preview */}
          <div
            className={`lg:col-span-5 xl:col-span-5 ${
              activeTab === "preview" ? "block" : "hidden lg:block"
            }`}
          >
            <div className="lg:sticky lg:top-24 flex flex-col items-center">
              {/* Quick download action above preview */}
              <div className="w-full max-w-[420px] mb-3 flex items-center justify-between px-2">
                <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Xem trước trực tiếp
                </span>
                <button
                  type="button"
                  data-testid="floating-download-btn"
                  onClick={handleDownload}
                  disabled={isExporting}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg shadow-2xs transition-colors disabled:opacity-60"
                >
                  {isExporting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span>Tải ảnh (.PNG)</span>
                </button>
              </div>

              {/* iPhone 16 Pro Max Frame */}
              <IPhoneFrame className="scale-[0.92] sm:scale-100 origin-top">
                <BillPreview ref={billRef} data={billData} />
              </IPhoneFrame>

              {/* User Guide Caption */}
              <p className="mt-4 text-center text-xs text-slate-400 max-w-xs">
                Ảnh xuất ra là toàn bộ hóa đơn phẳng độ nét cao 1320px chuẩn
                file gốc (không bao gồm khung viền điện thoại).
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Status Toast Feedback */}
      {toast && (
        <div
          data-testid="export-status-toast"
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all ${
            toast.type === "error"
              ? "bg-rose-50 text-rose-800 border-rose-200"
              : toast.type === "info"
                ? "bg-blue-50 text-blue-800 border-blue-200"
                : "bg-emerald-50 text-emerald-800 border-emerald-200"
          }`}
        >
          {toast.type === "error" ? (
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          ) : toast.type === "info" ? (
            <Sparkles className="w-4 h-4 text-blue-600" />
          ) : (
            <Check className="w-4 h-4 text-emerald-600" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

export default App;
