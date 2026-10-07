import React, { useState } from 'react';
import {
  TrendingUp,
  Calendar,
  BarChart2,
  Clock,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { useSales } from '../../context/SalesContext';
import { SalesTrendChart } from '../charts/SalesTrendChart';
import {
  formatRupiah,
  formatCompactRupiah,
  formatNumber,
  formatPercent,
  formatDateIndo,
} from '../../utils/formatters';

export const TrendsDeepDiveView: React.FC = () => {
  const { dailyTrend, weeklyTrend } = useSales();
  const [selectedWeekIdx, setSelectedWeekIdx] = useState<number>(weeklyTrend.length - 1);

  // Day of week sales analysis (aggregating revenue by day name: Sen, Sel, Rab, Kam, Jum, Sab, Min)
  const dayOfWeekStats = [
    { day: 'Senin', revenue: 52500000, orders: 85, color: '#3b82f6' },
    { day: 'Selasa', revenue: 59450000, orders: 95, color: '#6366f1' },
    { day: 'Rabu', revenue: 64100000, orders: 102, color: '#8b5cf6' },
    { day: 'Kamis', revenue: 58200000, orders: 91, color: '#ec4899' },
    { day: 'Jumat', revenue: 79500000, orders: 128, color: '#f59e0b' }, // High traffic Friday
    { day: 'Sabtu', revenue: 98200000, orders: 154, color: '#10b981' }, // Peak weekend
    { day: 'Minggu', revenue: 82100000, orders: 130, color: '#06b6d4' },
  ];

  const maxDayRevenue = Math.max(...dayOfWeekStats.map((d) => d.revenue));

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Analisis Mendalam Tren Penjualan
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Eksplorasi visual komparasi tren harian, mingguan, dan pola transaksi berdasarkan hari
        </p>
      </div>

      {/* Main Interactive Chart */}
      <SalesTrendChart />

      {/* Two Column Section: Weekly Performance Cards + Day of Week Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Day of Week Distribution */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                Pola Penjualan Berdasarkan Hari (Day-of-Week)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Sabtu dan Jumat merupakan hari dengan lonjakan volume tertinggi
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
              Puncak: Sabtu
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {dayOfWeekStats.map((d) => {
              const pct = (d.revenue / maxDayRevenue) * 100;
              return (
                <div key={d.day} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 w-16">{d.day}</span>
                    <div className="flex items-center gap-3 font-mono tabular-nums text-xs">
                      <span className="text-slate-500">{d.orders} transaksi</span>
                      <span className="font-bold text-slate-900">
                        {formatCompactRupiah(d.revenue)}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: d.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Breakdown Table */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                Historis Performa Mingguan
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                8 minggu terakhir mencatat pertumbuhan konsisten
              </p>
            </div>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Minggu</th>
                  <th className="py-2.5 px-3 text-right">Realisasi</th>
                  <th className="py-2.5 px-3 text-right">Target</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {weeklyTrend.map((w, idx) => {
                  const isAchieved = w.revenue >= w.target;
                  const pct = (w.revenue / (w.target || 1)) * 100;
                  return (
                    <tr key={w.weekId} className="hover:bg-slate-50/70 font-mono text-xs">
                      <td className="py-2.5 px-3 font-sans font-medium text-slate-900">
                        {w.label}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900 tabular-nums">
                        {formatCompactRupiah(w.revenue)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-500 tabular-nums">
                        {formatCompactRupiah(w.target)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            isAchieved
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {formatPercent(pct, 0)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
