import React, { useState } from 'react';
import {
  Target,
  Sparkles,
  TrendingUp,
  Clock,
  Edit3,
  Check,
  X,
  AlertCircle,
  Percent,
} from 'lucide-react';
import { useSales } from '../../context/SalesContext';
import {
  formatRupiah,
  formatCompactRupiah,
  formatPercent,
} from '../../utils/formatters';

export const MonthlyTargetCard: React.FC = () => {
  const { monthlyTarget, updateMonthlyTarget } = useSales();
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [targetInput, setTargetInput] = useState<string>(
    String(monthlyTarget.totalTarget)
  );

  const percentage = (monthlyTarget.totalAchieved / (monthlyTarget.totalTarget || 1)) * 100;
  const remaining = Math.max(0, monthlyTarget.totalTarget - monthlyTarget.totalAchieved);

  // Circular gauge math
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  // Arc angle 270 degrees
  const strokeDashoffset = circumference - (Math.min(100, percentage) / 100) * circumference;

  const handleSaveTarget = () => {
    const num = parseInt(targetInput.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(num) && num > 0) {
      updateMonthlyTarget(num);
      setIsEditingTarget(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-600" />
            <h3 className="text-base font-semibold text-slate-900 tracking-tight">
              Target Bulanan ({monthlyTarget.monthName} {monthlyTarget.year})
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Pelacakan realisasi omzet terhadap target komersial bulanan
          </p>
        </div>

        <button
          onClick={() => {
            setTargetInput(String(monthlyTarget.totalTarget));
            setIsEditingTarget(true);
          }}
          className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Sesuaikan</span>
        </button>
      </div>

      {/* Target Edit Input Form if editing */}
      {isEditingTarget && (
        <div className="my-3 p-3 bg-blue-50/70 border border-blue-200 rounded-lg">
          <div className="text-xs font-semibold text-slate-800 mb-1.5">
            Ubah Target Penjualan Bulan Ini:
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">
                Rp
              </span>
              <input
                type="number"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs font-mono font-medium border border-blue-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="450000000"
              />
            </div>
            <button
              onClick={handleSaveTarget}
              className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Simpan</span>
            </button>
            <button
              onClick={() => setIsEditingTarget(false)}
              className="p-1.5 text-slate-500 hover:text-slate-700 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Target Metrics & Circular Progress */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center my-4">
        {/* Circular Progress Gauge */}
        <div className="sm:col-span-4 flex flex-col items-center justify-center">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="stroke-slate-100"
                strokeWidth="11"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="stroke-blue-600 transition-all duration-700 ease-out"
                strokeWidth="11"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-bold font-mono text-slate-900 tracking-tight tabular-nums">
                {formatPercent(percentage, 1)}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Tercapai</span>
            </div>
          </div>
          <span className="text-[11px] text-slate-500 mt-1">
            {monthlyTarget.daysPassed} hari berjalan · {monthlyTarget.daysRemaining} hari tersisa
          </span>
        </div>

        {/* Breakdown Stats */}
        <div className="sm:col-span-8 space-y-2.5">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-500 mb-0.5">Target Total</div>
              <div className="text-sm font-bold font-mono text-slate-900 tabular-nums">
                {formatRupiah(monthlyTarget.totalTarget)}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-100">
              <div className="text-[11px] text-blue-700 mb-0.5">Realisasi Saat Ini</div>
              <div className="text-sm font-bold font-mono text-blue-700 tabular-nums">
                {formatRupiah(monthlyTarget.totalAchieved)}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-500 mb-0.5">Sisa Kekurangan</div>
              <div className="text-xs font-semibold font-mono text-slate-800 tabular-nums">
                {formatRupiah(remaining)}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100">
              <div className="text-[11px] text-emerald-800 mb-0.5">Proyeksi Akhir Bulan</div>
              <div className="text-xs font-bold font-mono text-emerald-700 tabular-nums">
                {formatRupiah(monthlyTarget.projectedEndMonth)}
              </div>
            </div>
          </div>

          {/* Daily Run-rate required banner */}
          <div className="p-2.5 bg-slate-100 rounded-lg flex items-center justify-between text-xs font-mono">
            <span className="text-slate-600 flex items-center gap-1.5 font-sans">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Target Run-Rate Harian:
            </span>
            <span className="font-bold text-slate-900 tabular-nums">
              {formatRupiah(monthlyTarget.dailyRunRateRequired)}
              <span className="text-[10px] text-slate-500 font-sans"> / hari</span>
            </span>
          </div>
        </div>
      </div>

      {/* Target per Kategori Progress Bars */}
      <div className="pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-2">
          <span>Pencapaian Berdasarkan Kategori</span>
          <span className="text-[11px] font-normal text-slate-500">Realisasi vs Target</span>
        </div>

        <div className="space-y-2">
          {monthlyTarget.categories.map((cat) => {
            const catPct = (cat.achieved / (cat.target || 1)) * 100;
            return (
              <div key={cat.category} className="text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-700 font-medium truncate">{cat.category}</span>
                  <div className="flex items-center gap-2 font-mono tabular-nums text-[11px]">
                    <span className="text-slate-500">{formatCompactRupiah(cat.achieved)}</span>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-700">{formatCompactRupiah(cat.target)}</span>
                    <span className="font-semibold text-slate-900 w-12 text-right">
                      {formatPercent(catPct, 0)}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, catPct)}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
