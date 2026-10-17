import React from 'react';
import { Clock, Sparkles, Building2, CreditCard, User, DollarSign, FileText, CheckCircle2, Bookmark } from 'lucide-react';
import { BillData } from '../../types/bill';
import { BANKS_CATALOG, getBankById } from '../../data/banks';
import { formatVND, formatCurrentDateTime } from '../../utils/formatters';
import { generateRandomReferenceCode, generateRandomTransactionId } from '../../utils/generators';
import { QuickActions } from './QuickActions';

export interface BillFormProps {
  data: BillData;
  onChange: (newData: BillData) => void;
  className?: string;
  onResetSample?: () => void;
  onRandomizeTimeAndCodes?: () => void;
}

const AMOUNT_PRESETS = [
  { label: '+50.000', value: 50000 },
  { label: '+100.000', value: 100000 },
  { label: '+500.000', value: 500000 },
  { label: '+1.000.000', value: 1000000 },
  { label: '+2.000.000', value: 2000000 },
];

export const BillForm: React.FC<BillFormProps> = ({
  data,
  onChange,
  className = '',
  onResetSample,
  onRandomizeTimeAndCodes,
}) => {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatVND(e.target.value);
    onChange({
      ...data,
      amount: formatted,
    });
  };

  const handleAddPresetAmount = (presetValue: number) => {
    const currentNum = parseInt(data.amount.replace(/\D/g, '') || '0', 10);
    const newNum = currentNum + presetValue;
    onChange({
      ...data,
      amount: formatVND(newNum),
    });
  };

  const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedBank = getBankById(selectedId);
    if (selectedBank) {
      const isVCB = selectedBank.id.toLowerCase() === 'vietcombank';
      onChange({
        ...data,
        bankId: selectedBank.id,
        bankName: selectedBank.name,
        bankSubName: selectedBank.subName,
        transferType: isVCB ? 'Chuyển tiền trong Vietcombank' : 'Chuyển tiền nhanh',
      });
    }
  };

  const handleRecipientNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...data,
      accountName: e.target.value.toUpperCase(),
    });
  };

  const handleCurrentTime = () => {
    onChange({
      ...data,
      dateTime: formatCurrentDateTime(),
    });
  };

  const handleGenerateReferenceCode = () => {
    onChange({
      ...data,
      referenceCode: generateRandomReferenceCode(),
    });
  };

  const handleGenerateTransactionId = () => {
    onChange({
      ...data,
      transactionId: generateRandomTransactionId(),
    });
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-6 ${className}`}
      data-testid="bill-form"
    >
      {(onResetSample || onRandomizeTimeAndCodes) && (
        <QuickActions
          onResetSample={onResetSample ?? (() => {})}
          onRandomizeTimeAndCodes={onRandomizeTimeAndCodes ?? (() => {})}
        />
      )}

      {/* Section 1: Thông tin người nhận & Số tiền */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <DollarSign className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
            Thông tin số tiền &amp; Thụ hưởng
          </h3>
        </div>

        {/* Số tiền (VND) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="amount" className="text-xs font-semibold text-slate-700">
              Số tiền (VND) <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs text-slate-400">Đơn vị: VNĐ</span>
          </div>
          <div className="relative">
            <input
              id="amount"
              type="text"
              inputMode="numeric"
              value={data.amount}
              onChange={handleAmountChange}
              placeholder="110,000"
              className="w-full pl-3.5 pr-14 py-2.5 rounded-lg border border-slate-300 text-slate-900 font-semibold text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors shadow-2xs"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 pointer-events-none">
              VND
            </span>
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-slate-400 font-medium mr-1">Cộng nhanh:</span>
            {AMOUNT_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => handleAddPresetAmount(preset.value)}
                className="text-[11px] font-medium px-2 py-1 rounded-md bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 border border-slate-200/60 transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ngân hàng nhận */}
        <div className="space-y-1.5">
          <label htmlFor="bankId" className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Ngân hàng nhận</span>
            <span className="text-rose-500">*</span>
          </label>
          <select
            id="bankId"
            value={data.bankId}
            onChange={handleBankChange}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors shadow-2xs cursor-pointer"
          >
            {BANKS_CATALOG.map((bank) => (
              <option key={bank.id} value={bank.id}>
                {bank.name} - {bank.subName}
              </option>
            ))}
          </select>
        </div>

        {/* Grid: Số tài khoản & Tên người nhận */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label htmlFor="accountNumber" className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <CreditCard className="w-3.5 h-3.5 text-slate-500" />
              <span>Tài khoản nhận</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              id="accountNumber"
              type="text"
              value={data.accountNumber}
              onChange={(e) => onChange({ ...data, accountNumber: e.target.value })}
              placeholder="Ví dụ: 16986889999"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors shadow-2xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="accountName" className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Tên người nhận</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              id="accountName"
              type="text"
              value={data.accountName}
              onChange={handleRecipientNameChange}
              placeholder="Ví dụ: NGUYEN VAN A"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm font-semibold uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors shadow-2xs tracking-wide"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Chi tiết giao dịch */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <FileText className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
            Chi tiết giao dịch
          </h3>
        </div>

        {/* Nội dung giao dịch */}
        <div className="space-y-1.5">
          <label htmlFor="content" className="text-xs font-semibold text-slate-700">
            Nội dung giao dịch
          </label>
          <textarea
            id="content"
            rows={2}
            value={data.content}
            onChange={(e) => onChange({ ...data, content: e.target.value })}
            placeholder="Nhập nội dung chuyển tiền..."
            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors shadow-2xs resize-none"
          />
        </div>

        {/* Grid: Hình thức chuyển & Phí giao dịch */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label htmlFor="transferType" className="text-xs font-semibold text-slate-700">
              Hình thức chuyển tiền
            </label>
            <input
              id="transferType"
              type="text"
              value={data.transferType}
              onChange={(e) => onChange({ ...data, transferType: e.target.value })}
              placeholder="Chuyển tiền nhanh"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors shadow-2xs"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="transferFee" className="text-xs font-semibold text-slate-700">
              Phí chuyển tiền
            </label>
            <input
              id="transferFee"
              type="text"
              value={data.transferFee}
              onChange={(e) => onChange({ ...data, transferFee: e.target.value })}
              placeholder="Miễn phí"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Thông tin đối soát & Hệ thống */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
            Thời gian &amp; Mã đối soát
          </h3>
        </div>

        {/* Thời gian giao dịch */}
        <div className="space-y-1.5">
          <label htmlFor="dateTime" className="text-xs font-semibold text-slate-700">
            Thời gian giao dịch
          </label>
          <div className="flex gap-2">
            <input
              id="dateTime"
              type="text"
              value={data.dateTime}
              onChange={(e) => onChange({ ...data, dateTime: e.target.value })}
              placeholder="09:08 Thứ Sáu 16/10/2026"
              className="flex-1 px-3.5 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors shadow-2xs"
            />
            <button
              type="button"
              onClick={handleCurrentTime}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Lấy giờ hiện tại</span>
            </button>
          </div>
        </div>

        {/* Mã tham chiếu */}
        <div className="space-y-1.5">
          <label htmlFor="referenceCode" className="text-xs font-semibold text-slate-700">
            Mã tham chiếu (16 ký tự)
          </label>
          <div className="flex gap-2">
            <input
              id="referenceCode"
              type="text"
              maxLength={16}
              value={data.referenceCode}
              onChange={(e) => onChange({ ...data, referenceCode: e.target.value.toUpperCase() })}
              placeholder="6289BFTVGLCCKWSZ"
              className="flex-1 px-3.5 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors shadow-2xs"
            />
            <button
              type="button"
              onClick={handleGenerateReferenceCode}
              aria-label="Tạo mã tham chiếu mới"
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400/20 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Tạo mã mới</span>
            </button>
          </div>
        </div>

        {/* Mã giao dịch */}
        <div className="space-y-1.5">
          <label htmlFor="transactionId" className="text-xs font-semibold text-slate-700">
            Mã giao dịch (11 chữ số)
          </label>
          <div className="flex gap-2">
            <input
              id="transactionId"
              type="text"
              maxLength={11}
              value={data.transactionId}
              onChange={(e) => onChange({ ...data, transactionId: e.target.value.replace(/\D/g, '') })}
              placeholder="16559745403"
              className="flex-1 px-3.5 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors shadow-2xs"
            />
            <button
              type="button"
              onClick={handleGenerateTransactionId}
              aria-label="Tạo mã giao dịch mới"
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400/20 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Tạo mã mới</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 4: Tùy chọn bổ sung (Lưu mẫu chuyển tiền) */}
      <div className="pt-2">
        <label
          htmlFor="saveTemplate"
          className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 rounded-xl cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-4 h-4 text-emerald-600" />
            <div>
              <span className="text-xs font-semibold text-slate-800">
                Lưu mẫu chuyển tiền
              </span>
              <p className="text-[11px] text-slate-500">
                Hiển thị tùy chọn đã lưu mẫu giao dịch trên hóa đơn
              </p>
            </div>
          </div>
          <div className="relative inline-flex items-center cursor-pointer">
            <input
              id="saveTemplate"
              type="checkbox"
              checked={data.saveTemplate}
              onChange={(e) => onChange({ ...data, saveTemplate: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
          </div>
        </label>
      </div>
    </div>
  );
};
