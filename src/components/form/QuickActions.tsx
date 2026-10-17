import React from 'react';
import { RotateCcw, Shuffle } from 'lucide-react';

export interface QuickActionsProps {
  onResetSample: () => void;
  onRandomizeTimeAndCodes: () => void;
  className?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onResetSample,
  onRandomizeTimeAndCodes,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-wrap items-center gap-2.5 p-3 sm:p-4 bg-slate-50 border border-slate-200/80 rounded-xl ${className}`}
      data-testid="quick-actions"
    >
      <button
        type="button"
        onClick={onResetSample}
        className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-slate-100 hover:text-slate-900 border border-slate-200 rounded-lg shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 active:scale-[0.98]"
      >
        <RotateCcw className="w-4 h-4 text-emerald-600" />
        <span>Điền mẫu bill gốc</span>
      </button>

      <button
        type="button"
        onClick={onRandomizeTimeAndCodes}
        className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-slate-100 hover:text-slate-900 border border-slate-200 rounded-lg shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 active:scale-[0.98]"
      >
        <Shuffle className="w-4 h-4 text-blue-600" />
        <span>Ngẫu nhiên mã &amp; thời gian</span>
      </button>
    </div>
  );
};
