import React from 'react';
import { Store, ShoppingBag, Globe, MessageSquare, Award } from 'lucide-react';
import { CHANNEL_DISTRIBUTION, PRODUCT_IMAGE_URL } from '../../data/mockData';
import { formatCompactRupiah, formatNumber, formatPercent } from '../../utils/formatters';

export const ChannelShareCard: React.FC = () => {
  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'Shopee':
      case 'Tokopedia':
        return ShoppingBag;
      case 'Website':
        return Globe;
      case 'WhatsApp':
        return MessageSquare;
      default:
        return Store;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-semibold text-slate-900 tracking-tight">
              Kontribusi Kanal Penjualan
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Distribusi omzet per marketplace dan kanal langsung
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">5 Kanal</span>
        </div>

        {/* Channel Bars */}
        <div className="mt-4 space-y-3">
          {CHANNEL_DISTRIBUTION.map((item) => {
            const Icon = getChannelIcon(item.channel);
            return (
              <div key={item.channel} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-slate-700">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono tabular-nums text-xs">
                    <span className="text-slate-500">{formatNumber(item.orders)} order</span>
                    <span className="text-slate-300">·</span>
                    <span className="font-semibold text-slate-900">
                      {formatCompactRupiah(item.revenue)}
                    </span>
                    <span className="text-slate-500 w-10 text-right">
                      {formatPercent(item.percentage, 0)}
                    </span>
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Top Product Highlight */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 mb-2.5">
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>Produk Terlaris Minggu Ini</span>
        </div>

        <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
          <img
            src={PRODUCT_IMAGE_URL}
            alt="Produk Unggulan"
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-md object-cover border border-slate-200 shrink-0"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=120&q=80';
            }}
          />
          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold text-slate-900 block truncate">
              Smart Desk Lamp Minimalist Pro Ultra
            </span>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
              <span>94 Terjual</span>
              <span>·</span>
              <span className="font-mono text-emerald-600 font-medium">Rp 117,5 Jt</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
