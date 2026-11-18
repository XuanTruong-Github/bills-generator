"use client";

import React, { useRef, useState } from "react";
import { BillData, DEFAULT_BILL_DATA } from "@/types/bill";
import { BillPreview } from "@/components/BillPreview";
import { BillForm } from "@/components/BillForm";

export default function Home() {
  const [billData, setBillData] = useState<BillData>(DEFAULT_BILL_DATA);
  const [isDownloading, setIsDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!previewRef.current) return;

    try {
      setIsDownloading(true);
      // Import html-to-image dynamically to avoid SSR issues
      const { toPng } = await import("html-to-image");

      const element = previewRef.current;
      const dataUrl = await toPng(element, {
        pixelRatio: 3, // Ultra-sharp 3x resolution
        cacheBust: true,
        backgroundColor: billData.includeFrame ? undefined : "#ffffff",
      });

      const link = document.createElement("a");
      const safeName = (billData.recipientName || "bill")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-");
      link.download = `bill-viettelmoney-${safeName}-${Date.now()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to generate bill image:", error);
      alert("Đã xảy ra lỗi khi tạo ảnh. Vui lòng thử lại!");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f3f4f6] flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#e52836] flex items-center justify-center text-white font-black text-base shadow-sm">
              V
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-none">
                Viettel Money Bill Generator
              </h1>
              <span className="text-[11px] text-gray-500">
                Next.js 16 • Tailwind CSS • Vietcombank Template
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
              Vietcombank
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 items-start justify-center">
        {/* Left Side: Configuration Controls */}
        <div className="w-full lg:w-[460px] flex-shrink-0">
          <BillForm
            data={billData}
            onChange={setBillData}
            onDownload={handleDownload}
            isDownloading={isDownloading}
          />
        </div>

        {/* Right Side: Live Visual Preview */}
        <div className="w-full lg:flex-1 flex flex-col items-center justify-center sticky top-20">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
            <span>Bản xem trước Realtime</span>
            <span className="text-gray-300">•</span>
            <span className="text-emerald-600 font-medium normal-case">
              {billData.includeFrame ? "Khung máy iPhone" : "Ảnh chụp màn hình (Phẳng)"}
            </span>
          </div>

          {/* Interactive Phone / Bill Component */}
          <div className="w-full flex justify-center overflow-auto p-2">
            <BillPreview ref={previewRef} data={billData} />
          </div>

          <p className="text-xs text-gray-400 text-center mt-3">
            Mẹo: Nhấn &quot;Tải ảnh bill xuống (PNG)&quot; để xuất file ảnh độ nét cao 3x.
          </p>
        </div>
      </div>
    </main>
  );
}
