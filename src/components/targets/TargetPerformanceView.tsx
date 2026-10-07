import React, { useState } from 'react';
import {
  Target,
  Award,
  TrendingUp,
  Users,
  Sparkles,
  Calculator,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useSales } from '../../context/SalesContext';
import {
  formatRupiah,
  formatCompactRupiah,
  formatPercent,
  formatNumber,
} from '../../utils/formatters';
import { MonthlyTargetCard } from '../charts/MonthlyTargetCard';

export const TargetPerformanceView: React.FC = () => {
  const { monthlyTarget, updateMonthlyTarget } = useSales();

  const [simulatedDailySales, setSimulatedDailySales] = useState<number>(
    monthlyTarget.dailyRunRateRequired
  );

  const projectedSimulatedTotal =
    monthlyTarget.totalAchieved + simulatedDailySales * monthlyTarget.daysRemaining;
  const simulatedPct = (projectedSimulatedTotal / (monthlyTarget.totalTarget || 1)) * 100;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Target Bulanan & Kinerja Tim Penjualan
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Pantau progres pencapaian omzet bulanan, target per kategori, dan kinerja per sales executive
        </p>
      </div>

      {/* Target Bulanan Main Card */}
      <MonthlyTargetCard />

      {/* Sales Team Performance Leaderboard */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-semibold text-slate-900 tracking-tight flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Kinerja Tim Sales & Account Executive
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pencapaian target individu bulan {monthlyTarget.monthName} {monthlyTarget.year}
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {monthlyTarget.salesReps.length} Sales Representative
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {monthlyTarget.salesReps.map((rep, idx) => {
            const isTop = idx === 0;
            return (
              <div
                key={rep.id}
                className={`p-4 rounded-xl border transition-all ${
                  isTop
                    ? 'border-blue-200 bg-blue-50/30 shadow-2xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={rep.avatar}
                        alt={rep.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80';
                        }}
                      />
                      {isTop && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-900 text-[10px] font-bold flex items-center justify-center">
                          1
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 text-sm block">
                        {rep.name}
                      </span>
                      <span className="text-slate-500 text-[11px] block">{rep.role}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-bold font-mono text-slate-900 block tabular-nums">
                      {formatPercent(rep.percentage, 1)}
                    </span>
                    <span className="text-[10px] text-slate-500">{rep.dealsCount} deals ditutup</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        rep.percentage >= 80 ? 'bg-emerald-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.min(100, rep.percentage)}%` }}
                    />
                  </div>

                  <div className="mt-1.5 flex items-center justify-between text-xs font-mono text-slate-500 tabular-nums">
                    <span>Realisasi: {formatCompactRupiah(rep.achieved)}</span>
                    <span>Target: {formatCompactRupiah(rep.target)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulator Run-Rate & Proyeksi Akhir Bulan */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Calculator className="w-4 h-4 text-blue-600" />
          <h3 className="text-base font-semibold text-slate-900 tracking-tight">
            Simulator Proyeksi Run-Rate Penjualan
          </h3>
        </div>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-7 space-y-3">
            <p className="text-xs text-slate-600 leading-relaxed">
              Gunakan slider interaktif di bawah untuk menguji skenario laju penjualan harian
              selama <strong>{monthlyTarget.daysRemaining} hari</strong> tersisa di bulan {monthlyTarget.monthName}.
            </p>

            <div>
              <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Simulasi Omzet Rata-rata per Hari:</span>
                <span className="font-mono font-bold text-blue-700 text-sm">
                  {formatRupiah(simulatedDailySales)} / hari
                </span>
              </div>
              <input
                type="range"
                min="5000000"
                max="25000000"
                step="500000"
                value={simulatedDailySales}
                onChange={(e) => setSimulatedDailySales(parseInt(e.target.value, 10))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-1">
                <span>Rp 5 Juta/hari</span>
                <span>Kebutuhan Saat Ini: {formatCompactRupiah(monthlyTarget.dailyRunRateRequired)}</span>
                <span>Rp 25 Juta/hari</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <span className="font-semibold text-slate-800 block text-[11px] uppercase tracking-wider">
              Hasil Estimasi Tutup Buku Bulan Ini
            </span>

            <div className="flex items-center justify-between">
              <span className="text-slate-600">Total Proyeksi Omzet:</span>
              <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                {formatRupiah(projectedSimulatedTotal)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600">Estimasi Pencapaian Target:</span>
              <span
                className={`font-mono font-bold text-sm tabular-nums ${
                  simulatedPct >= 100 ? 'text-emerald-700' : 'text-amber-600'
                }`}
              >
                {formatPercent(simulatedPct, 1)}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
              {simulatedPct >= 100 ? (
                <span className="text-emerald-700 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Target bulanan diproyeksikan terlampaui dengan surplus{' '}
                  {formatRupiah(projectedSimulatedTotal - monthlyTarget.totalTarget)}!
                </span>
              ) : (
                <span className="text-amber-700 flex items-center gap-1 font-medium">
                  Defisit proyeksi sebesar{' '}
                  {formatRupiah(monthlyTarget.totalTarget - projectedSimulatedTotal)}. Perlu
                  peningkatan promo atau campaign.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
