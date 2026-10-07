import React from 'react';
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useSales } from '../../context/SalesContext';
import {
  formatRupiah,
  formatCompactRupiah,
  formatNumber,
  formatPercent,
} from '../../utils/formatters';

export const KpiOverview: React.FC = () => {
  const { monthlyTarget, orders } = useSales();

  const totalRevenue = monthlyTarget.totalAchieved;
  const totalOrdersCount = orders.length + 328; // baseline + current
  const avgOrderValue = Math.round(totalRevenue / (totalOrdersCount || 1));
  const targetPct = (monthlyTarget.totalAchieved / monthlyTarget.totalTarget) * 100;

  const kpis = [
    {
      title: 'Total Omzet Penjualan',
      value: formatRupiah(totalRevenue),
      subtitle: `Target: ${formatCompactRupiah(monthlyTarget.totalTarget)}`,
      change: '+14,8%',
      isPositive: true,
      icon: DollarSign,
      // Card 1: Vibrant Royal Blue
      cardBg: 'bg-gradient-to-br from-blue-600 to-blue-700',
      cardBorder: 'border-blue-500/30',
      iconBg: 'bg-white/20 text-white',
      badgeBg: 'bg-white/20 text-white',
      subtitleColor: 'text-blue-100',
    },
    {
      title: 'Volume Pesanan',
      value: `${formatNumber(totalOrdersCount)} Order`,
      subtitle: 'Rata-rata 26 pesanan/hari',
      change: '+11,2%',
      isPositive: true,
      icon: ShoppingCart,
      // Card 2: Vibrant Deep Indigo / Violet
      cardBg: 'bg-gradient-to-br from-indigo-600 to-purple-700',
      cardBorder: 'border-indigo-500/30',
      iconBg: 'bg-white/20 text-white',
      badgeBg: 'bg-white/20 text-white',
      subtitleColor: 'text-indigo-100',
    },
    {
      title: 'Rata-rata Nilai Order (AOV)',
      value: formatRupiah(avgOrderValue),
      subtitle: 'Keranjang belanja rata-rata',
      change: '+4,5%',
      isPositive: true,
      icon: TrendingUp,
      // Card 3: Vibrant Emerald / Teal
      cardBg: 'bg-gradient-to-br from-emerald-600 to-teal-700',
      cardBorder: 'border-emerald-500/30',
      iconBg: 'bg-white/20 text-white',
      badgeBg: 'bg-white/20 text-white',
      subtitleColor: 'text-emerald-100',
    },
    {
      title: 'Pencapaian Target',
      value: formatPercent(targetPct, 1),
      subtitle: `${monthlyTarget.daysRemaining} hari menuju tutup buku`,
      change: targetPct >= 70 ? 'On Track' : 'Butuh Dorongan',
      isPositive: targetPct >= 70,
      icon: Target,
      // Card 4: Vibrant Amber / Warm Orange
      cardBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
      cardBorder: 'border-amber-400/30',
      iconBg: 'bg-white/20 text-white',
      badgeBg: 'bg-white/20 text-white',
      subtitleColor: 'text-amber-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div
            key={idx}
            className={`${kpi.cardBg} rounded-xl border ${kpi.cardBorder} p-4 text-white shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white/90 tracking-wide truncate">
                {kpi.title}
              </span>
              <div className={`p-2 rounded-lg ${kpi.iconBg} backdrop-blur-xs shadow-2xs`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight tabular-nums drop-shadow-2xs">
                {kpi.value}
              </div>

              <div className="mt-2 flex items-center justify-between text-xs">
                <span className={`${kpi.subtitleColor} text-[11px] truncate font-medium`}>
                  {kpi.subtitle}
                </span>
                <span
                  className={`inline-flex items-center gap-1 font-semibold text-[11px] font-mono tabular-nums px-2 py-0.5 rounded-md ${kpi.badgeBg} backdrop-blur-xs shadow-2xs`}
                >
                  {kpi.isPositive ? (
                    <ArrowUpRight className="w-3 h-3 text-white" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-white" />
                  )}
                  {kpi.change}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
