import React from 'react';
import {
  ArrowRight,
  ShoppingBag,
  Users,
  Eye,
  Award,
  ExternalLink,
} from 'lucide-react';
import { useSales } from '../../context/SalesContext';
import { KpiOverview } from './KpiOverview';
import { SalesTrendChart } from '../charts/SalesTrendChart';
import { MonthlyTargetCard } from '../charts/MonthlyTargetCard';
import { ChannelShareCard } from '../charts/ChannelShareCard';
import {
  formatRupiah,
  formatCompactRupiah,
  formatDateTimeIndo,
  getStatusBadge,
} from '../../utils/formatters';

export const OverviewView: React.FC = () => {
  const {
    orders,
    customers,
    setActiveTab,
    setSelectedOrder,
    setSelectedCustomer,
  } = useSales();

  const recentOrders = orders.slice(0, 5);
  const topVipCustomers = customers.filter((c) => c.tier === 'VIP').slice(0, 4);

  return (
    <div className="space-y-6">
      {/* 1. KPI Metrik Utama */}
      <KpiOverview />

      {/* 2. Visualisasi Tren Penjualan Harian & Mingguan */}
      <SalesTrendChart />

      {/* 3. Target Bulanan & Kontribusi Kanal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <MonthlyTargetCard />
        </div>
        <div className="lg:col-span-5">
          <ChannelShareCard />
        </div>
      </div>

      {/* 4. Sub-Menu Teasers: Order Terbaru Ringkas & Detail Pelanggan Unggulan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Order Terbaru Ringkas */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                  Order Terbaru Masuk
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline cursor-pointer"
              >
                Buka Menu Order
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List */}
            <div className="mt-2 divide-y divide-slate-100">
              {recentOrders.map((ord) => {
                const badge = getStatusBadge(ord.status);
                return (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className="py-3 px-1 hover:bg-slate-50/80 rounded-lg cursor-pointer transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-slate-900 text-xs">
                          {ord.id}
                        </span>
                        <span
                          className={`w-22 inline-flex items-center justify-center gap-1 text-[10px] font-semibold py-0.5 rounded-full ${badge.bgClass} ${badge.textClass}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${badge.dotClass}`} />
                          <span>{badge.label}</span>
                        </span>
                      </div>
                      <span className="text-xs text-slate-700 block truncate mt-0.5">
                        {ord.customerName} ·{' '}
                        <span className="text-slate-400">{ord.channel}</span>
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono font-bold text-slate-900 text-xs tabular-nums block">
                        {formatRupiah(ord.totalAmount)}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {formatDateTimeIndo(ord.date).split(' ')[0]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-slate-100 text-center">
            <button
              onClick={() => setActiveTab('orders')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Lihat seluruh daftar {orders.length} pesanan &rarr;
            </button>
          </div>
        </div>

        {/* Pelanggan Unggulan (VIP Cohort) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                  Pelanggan VIP Unggulan
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('customers')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline cursor-pointer"
              >
                Semua Pelanggan
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-2 divide-y divide-slate-100">
              {topVipCustomers.map((cust) => (
                <div
                  key={cust.id}
                  onClick={() => setSelectedCustomer(cust)}
                  className="py-2.5 px-1 hover:bg-slate-50/80 rounded-lg cursor-pointer transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center overflow-hidden shrink-0">
                      {cust.avatar ? (
                        <img
                          src={cust.avatar}
                          alt={cust.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-bold text-purple-700 font-mono">
                          {cust.name.substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-slate-900 block truncate">
                        {cust.name}
                      </span>
                      <span className="text-[11px] text-slate-400 block truncate">
                        {cust.city} · {cust.ordersCount}x Order
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-slate-900 text-xs tabular-nums block">
                      {formatCompactRupiah(cust.totalSpent)}
                    </span>
                    <span className="text-[10px] text-purple-600 font-medium">VIP Member</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-slate-100 text-center">
            <button
              onClick={() => setActiveTab('customers')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Buka direktori detail pelanggan &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
