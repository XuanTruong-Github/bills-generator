"use client";

import React, { forwardRef } from "react";
import { BillData } from "@/types/bill";

interface BillPreviewProps {
  data: BillData;
}

export const BillPreview = forwardRef<HTMLDivElement, BillPreviewProps>(
  ({ data }, ref) => {
    // Format amount: 10000 -> "10.000đ"
    const formatAmount = (val: string) => {
      const clean = val.replace(/[^0-9]/g, "");
      if (!clean) return "0đ";
      const num = parseInt(clean, 10);
      return `${num.toLocaleString("de-DE")}đ`;
    };

    return (
      <div className="flex justify-center items-center py-4 select-none">
        {/* Device wrapper / Screen capture target */}
        <div
          ref={ref}
          id="bill-capture-target"
          className={`w-[390px] bg-white text-[#111111] overflow-hidden transition-all duration-300 relative flex flex-col justify-between ${
            data.includeFrame
              ? "rounded-[52px] shadow-[0_0_0_12px_#1e1e1e,0_0_0_14px_#383838,0_30px_70px_rgba(0,0,0,0.4)]"
              : "rounded-none shadow-xl border border-gray-100"
          }`}
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            minHeight: "844px", // Standard iPhone 12/13/14 screen height
          }}
        >
          {/* Top Notch (Chỉ hiện khi bật Khung điện thoại iPhone) */}
          {data.includeFrame && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-32 h-6 bg-[#1e1e1e] rounded-b-2xl pointer-events-none" />
          )}

          <div>
            {/* iOS Status Bar */}
            {data.showStatusBar && (
              <div className="pt-3 px-8 pb-1 flex items-center justify-between text-[15px] font-semibold text-black bg-white">
                {/* Left: Time + Location Arrow icon */}
                <div className="flex items-center gap-1">
                  <span>{data.time || "21:17"}</span>
                  {/* Location indicator arrow */}
                  <svg
                    className="w-3.5 h-3.5 fill-black transform -rotate-45 ml-0.5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                  </svg>
                </div>

                {/* Right: Cellular, Wifi, Battery */}
                <div className="flex items-center gap-1.5 text-black">
                  {/* Cellular signal (4 dots/bars) */}
                  {data.showSignal && (
                    <svg className="w-4 h-3" viewBox="0 0 17 12" fill="currentColor">
                      <rect x="0" y="8" width="2.8" height="4" rx="0.5" />
                      <rect x="4.5" y="5.2" width="2.8" height="6.8" rx="0.5" />
                      <rect x="9" y="2.6" width="2.8" height="9.4" rx="0.5" />
                      <rect x="13.5" y="0" width="2.8" height="12" rx="0.5" />
                    </svg>
                  )}

                  {/* Wifi wave */}
                  {data.showWifi && (
                    <svg
                      className="w-4 h-3"
                      viewBox="0 0 16 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    >
                      <path d="M1 3.5 Q8 -1 15 3.5" />
                      <path d="M3.2 6.5 Q8 3 12.8 6.5" />
                      <path d="M5.5 9.5 Q8 7.5 10.5 9.5" />
                      <circle cx="8" cy="11.2" r="0.75" fill="currentColor" stroke="none" />
                    </svg>
                  )}

                  {/* Battery capsule */}
                  <div className="flex items-center ml-0.5">
                    <div className="relative w-[27px] h-[13px] border-[1.5px] border-black rounded-[4px] p-[1.5px] flex items-center">
                      <div
                        className="h-full bg-black rounded-[1.5px] transition-all"
                        style={{
                          width: `${Math.min(100, Math.max(10, data.batteryLevel))}%`,
                        }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white mix-blend-difference tracking-tighter">
                        {data.batteryLevel}
                      </span>
                    </div>
                    <div className="w-[1.5px] h-[4.5px] bg-black rounded-r-[1px] ml-[0.5px]" />
                  </div>
                </div>
              </div>
            )}

            {/* Header: Logo Viettel Money & "Chia sẻ" */}
            <div
              className={`flex items-center justify-between px-7 pb-2 ${
                !data.showStatusBar
                  ? data.includeFrame
                    ? "pt-8"
                    : "pt-6"
                  : "pt-4"
              }`}
            >
              <div className="h-9 flex items-center">
                <img
                  src="/images/logo.png"
                  alt="Viettel Money"
                  className="h-8 w-auto object-contain"
                  crossOrigin="anonymous"
                />
              </div>
              <button
                type="button"
                className="text-[#e52836] font-medium text-[15px] hover:opacity-80 transition-opacity"
              >
                Chia sẻ
              </button>
            </div>

            {/* Illustration */}
            <div className="flex justify-center pt-2 pb-1">
              <img
                src="/images/success-icon.png"
                alt="Giao dịch thành công"
                className="w-48 h-40 object-contain drop-shadow-sm"
                crossOrigin="anonymous"
              />
            </div>

            {/* Title & Amount */}
            <div className="text-center px-4 mt-2">
              <h2 className="text-[#333333] text-[16px] font-normal mb-1.5">
                Chuyển tiền thành công
              </h2>
              <div className="text-[36px] font-bold text-[#111111] tracking-tight">
                {formatAmount(data.amount)}
              </div>
            </div>

            {/* Divider */}
            <div className="mt-6 mx-7 border-b border-[#eeeeee]" />

            {/* Information Section */}
            <div className="px-7 py-4 space-y-3.5 text-[14.5px]">
              {/* Tên người nhận */}
              <div className="flex justify-between items-start gap-4">
                <span className="text-[#888888] font-normal whitespace-nowrap">
                  Tên người nhận
                </span>
                <span className="text-[#111111] font-bold text-right uppercase">
                  {data.recipientName || "LE XUAN TRUONG"}
                </span>
              </div>

              {/* Tài khoản nhận */}
              <div className="flex justify-between items-center gap-4">
                <span className="text-[#888888] font-normal whitespace-nowrap">
                  Tài khoản nhận
                </span>
                <span className="text-[#111111] font-bold text-right tracking-normal">
                  {data.recipientAccount || "9375083463"}
                </span>
              </div>

              {/* Ngân hàng nhận */}
              <div className="flex justify-between items-center gap-4">
                <span className="text-[#888888] font-normal whitespace-nowrap">
                  Ngân hàng nhận
                </span>
                <div className="flex items-center gap-1.5 justify-end">
                  <img
                    src="/images/vcb-icon.png"
                    alt="Vietcombank"
                    className="w-4 h-4 object-contain"
                    crossOrigin="anonymous"
                  />
                  <span className="text-[#111111] font-bold">
                    {data.bankName || "Vietcombank"}
                  </span>
                </div>
              </div>

              {/* Nội dung giao dịch */}
              <div className="flex justify-between items-start gap-4">
                <span className="text-[#888888] font-normal whitespace-nowrap">
                  Nội dung giao dịch
                </span>
                <span className="text-[#111111] font-bold text-right max-w-[210px] break-words leading-tight">
                  {data.transactionContent ||
                    "Le Xuan Truong chuyen tien tu ViettelMoney"}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="mx-7 border-b border-[#eeeeee]" />

            {/* "Xem chi tiết ⌵" */}
            <div className="py-4 flex items-center justify-center gap-1 text-[#888888] text-[14px] cursor-pointer hover:text-gray-600 transition-colors">
              <span>Xem chi tiết</span>
              <svg
                className="w-3.5 h-3.5 stroke-current"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          {/* Bottom section: Action buttons + Home bar */}
          <div className="px-7 pb-4 pt-6 space-y-3 mt-auto">
            {/* Về trang chủ button */}
            <button
              type="button"
              className="w-full py-4 px-6 rounded-full bg-[#e62b3a] hover:bg-[#d61f2e] text-white font-semibold text-[16px] shadow-[0_6px_16px_rgba(230,43,58,0.3)] transition-all active:scale-[0.99]"
            >
              Về trang chủ
            </button>

            {/* Tiếp tục chuyển tiền link */}
            <div className="text-center pt-1 pb-2">
              <button
                type="button"
                className="text-[#e62b3a] font-medium text-[15px] hover:opacity-80 transition-opacity"
              >
                Tiếp tục chuyển tiền
              </button>
            </div>

            {/* iOS Home Indicator Bar */}
            <div className="pt-2 pb-1 flex justify-center">
              <div className="w-32 h-[4.5px] bg-black rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

BillPreview.displayName = "BillPreview";
