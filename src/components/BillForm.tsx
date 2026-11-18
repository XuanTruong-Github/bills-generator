"use client";

import React from "react";
import { BillData, DEFAULT_BILL_DATA } from "@/types/bill";
import {
  Clock,
  Battery,
  Download,
  RotateCcw,
  Smartphone,
  CreditCard,
  User,
  FileText,
  Building2,
  Sparkles,
} from "lucide-react";

interface BillFormProps {
  data: BillData;
  onChange: (data: BillData) => void;
  onDownload: () => void;
  isDownloading: boolean;
}

export const BillForm: React.FC<BillFormProps> = ({
  data,
  onChange,
  onDownload,
  isDownloading,
}) => {
  const updateField = <K extends keyof BillData>(field: K, value: BillData[K]) => {
    onChange({ ...data, [field]: value });
  };

  const handleSetCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    updateField("time", `${hours}:${minutes}`);
  };

  const handleAutoContent = () => {
    const name = data.recipientName.trim();
    if (name) {
      updateField("transactionContent", `${name} chuyen tien tu ViettelMoney`);
    }
  };

  const quickAmounts = ["10000", "50000", "100000", "500000", "1000000", "5000000"];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e52836] inline-block animate-pulse" />
            Cấu hình Bill Viettel Money
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Xem trước realtime & tải ảnh bill chất lượng cao
          </p>
        </div>
        <button
          onClick={() => onChange(DEFAULT_BILL_DATA)}
          title="Khôi phục mặc định"
          className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Thông tin giao dịch */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5 text-[#e52836]" />
          Thông tin chuyển khoản
        </h3>

        {/* Số tiền */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Số tiền chuyển (VNĐ)
          </label>
          <div className="relative">
            <input
              type="text"
              value={data.amount}
              onChange={(e) => {
                const num = e.target.value.replace(/[^0-9]/g, "");
                updateField("amount", num);
              }}
              placeholder="10000"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#e52836]/20 focus:border-[#e52836] focus:bg-white transition-all"
            />
            <span className="absolute right-3.5 top-2.5 text-xs font-bold text-gray-400">
              VNĐ
            </span>
          </div>

          {/* Quick amount chips */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => updateField("amount", amt)}
                className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition-colors ${
                  data.amount === amt
                    ? "bg-[#e52836] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {parseInt(amt).toLocaleString("vi-VN")}đ
              </button>
            ))}
          </div>
        </div>

        {/* Tên người nhận */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-gray-400" />
            Tên người nhận (In hoa)
          </label>
          <input
            type="text"
            value={data.recipientName}
            onChange={(e) => updateField("recipientName", e.target.value.toUpperCase())}
            placeholder="LE XUAN TRUONG"
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#e52836]/20 focus:border-[#e52836] focus:bg-white transition-all uppercase"
          />
        </div>

        {/* Tài khoản nhận */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Tài khoản nhận
          </label>
          <input
            type="text"
            value={data.recipientAccount}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, "");
              updateField("recipientAccount", val);
            }}
            placeholder="9375083463"
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-[#e52836]/20 focus:border-[#e52836] focus:bg-white transition-all"
          />
        </div>

        {/* Ngân hàng nhận (Vietcombank) */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-gray-400" />
            Ngân hàng nhận
          </label>
          <div className="flex items-center gap-3 p-2.5 bg-emerald-50/60 border border-emerald-200 rounded-xl">
            <img
              src="/images/vcb-icon.png"
              alt="Vietcombank"
              className="w-6 h-6 object-contain"
            />
            <div className="flex-1">
              <div className="text-sm font-semibold text-emerald-900">
                Vietcombank
              </div>
              <div className="text-[11px] text-emerald-700">
                Ngân hàng Ngoại thương Việt Nam
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
              Mặc định
            </span>
          </div>
        </div>

        {/* Nội dung giao dịch */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-gray-400" />
              Nội dung giao dịch
            </label>
            <button
              type="button"
              onClick={handleAutoContent}
              className="text-[11px] text-[#e52836] hover:underline font-medium flex items-center gap-0.5"
            >
              <Sparkles className="w-3 h-3" /> Tự động điền theo tên
            </button>
          </div>
          <textarea
            rows={2}
            value={data.transactionContent}
            onChange={(e) => updateField("transactionContent", e.target.value)}
            placeholder="Le Xuan Truong chuyen tien tu ViettelMoney"
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#e52836]/20 focus:border-[#e52836] focus:bg-white transition-all resize-none"
          />
        </div>
      </div>

      {/* Cài đặt hiển thị & Thanh trạng thái */}
      <div className="pt-4 border-t border-gray-100 space-y-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5 text-gray-500" />
          Giao diện điện thoại
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {/* Thời gian */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                <Clock className="w-3 h-3 text-gray-400" /> Giờ
              </label>
              <button
                type="button"
                onClick={handleSetCurrentTime}
                className="text-[10px] text-[#e52836] hover:underline"
              >
                Giờ hiện tại
              </button>
            </div>
            <input
              type="text"
              value={data.time}
              onChange={(e) => updateField("time", e.target.value)}
              placeholder="21:17"
              maxLength={5}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-mono focus:outline-none focus:border-[#e52836] focus:bg-white"
            />
          </div>

          {/* Phần trăm pin */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Battery className="w-3 h-3 text-gray-400" /> Pin ({data.batteryLevel}%)
            </label>
            <input
              type="range"
              min={5}
              max={100}
              value={data.batteryLevel}
              onChange={(e) => updateField("batteryLevel", parseInt(e.target.value, 10))}
              className="w-full accent-[#e52836] mt-2"
            />
          </div>
        </div>

        {/* Kiểu khung tải ảnh */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
          <div>
            <div className="text-xs font-semibold text-gray-800">
              Khung viền máy iPhone
            </div>
            <div className="text-[11px] text-gray-500">
              Bật: Viền vỏ máy bo tròn | Tắt: Ảnh chụp phẳng (chuẩn ảnh mẫu)
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={data.includeFrame}
              onChange={(e) => updateField("includeFrame", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e52836]"></div>
          </label>
        </div>
      </div>

      {/* Nút Download */}
      <div className="pt-3">
        <button
          type="button"
          onClick={onDownload}
          disabled={isDownloading}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#e52836] to-[#d01c2a] hover:from-[#d01c2a] hover:to-[#b81421] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(229,40,54,0.3)] hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Đang xuất ảnh...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Tải ảnh bill xuống (PNG)</span>
            </>
          )}
        </button>
        <p className="text-[11px] text-gray-400 text-center mt-2">
          Ảnh được xuất với độ nét cao 3x chuẩn retina.
        </p>
      </div>
    </div>
  );
};
