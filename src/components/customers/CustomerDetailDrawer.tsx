import React from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShoppingBag,
  TrendingUp,
  Award,
  MessageCircle,
  ExternalLink,
  Tag,
} from 'lucide-react';
import { useSales } from '../../context/SalesContext';
import { Customer, Order } from '../../types';
import {
  formatRupiah,
  formatCompactRupiah,
  formatDateIndo,
  formatDateTimeIndo,
  getStatusBadge,
} from '../../utils/formatters';

interface CustomerDetailDrawerProps {
  customer: Customer | null;
  onClose: () => void;
}

export const CustomerDetailDrawer: React.FC<CustomerDetailDrawerProps> = ({
  customer,
  onClose,
}) => {
  const { orders, setSelectedOrder } = useSales();

  if (!customer) return null;

  // Filter orders made by this customer
  const customerOrders = orders.filter(
    (o) => o.customerId === customer.id || o.customerEmail === customer.email
  );

  const avgOrderValue =
    customerOrders.length > 0
      ? Math.round(customer.totalSpent / customerOrders.length)
      : 0;

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'VIP':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Reguler':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const handleWhatsAppClick = () => {
    const cleanPhone = customer.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Halo Bapak/Ibu ${customer.name}, terima kasih telah berbelanja di NusantaraSales. Ada yang bisa kami bantu mengenai pesanan Anda?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 border border-slate-200 shrink-0 flex items-center justify-center">
              {customer.avatar ? (
                <img
                  src={customer.avatar}
                  alt={customer.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80';
                  }}
                />
              ) : (
                <User className="w-6 h-6 text-blue-600" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  {customer.name}
                </h2>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getTierColor(
                    customer.tier
                  )}`}
                >
                  {customer.tier}
                </span>
              </div>
              <span className="text-xs text-slate-500 font-mono">{customer.id}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors"
            aria-label="Tutup Detail Pelanggan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-slate-600">
          {/* Quick Action Contact Bar */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsAppClick}
              className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-2xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Hubungi via WhatsApp</span>
            </button>
            <a
              href={`mailto:${customer.email}`}
              className="py-2 px-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium flex items-center gap-1.5 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>Email</span>
            </a>
          </div>

          {/* Metric Highlights */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block">Total Belanja (LTV)</span>
              <span className="text-sm font-bold font-mono text-slate-900 block mt-1 tabular-nums">
                {formatCompactRupiah(customer.totalSpent)}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block">Total Order</span>
              <span className="text-sm font-bold font-mono text-slate-900 block mt-1 tabular-nums">
                {customer.ordersCount} Kali
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block">Rata-rata Order</span>
              <span className="text-sm font-bold font-mono text-blue-700 block mt-1 tabular-nums">
                {formatCompactRupiah(avgOrderValue)}
              </span>
            </div>
          </div>

          {/* Contact Information & Demographics */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Informasi Kontak & Lokasi
            </h3>

            <div className="space-y-2 text-slate-700">
              <div className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{customer.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-mono">{customer.phone}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">{customer.city}</span>
                  <span className="text-slate-500 text-[11px] block mt-0.5">
                    {customer.address}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences & Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-slate-500 block text-[11px] mb-1">
                Kategori Favorit:
              </span>
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-600" />
                {customer.favoriteCategory}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-slate-500 block text-[11px] mb-1">
                Aktivitas Berbelanja:
              </span>
              <span className="text-slate-800 text-[11px] block font-mono">
                Pertama: {formatDateIndo(customer.firstOrderDate)}
              </span>
              <span className="text-emerald-700 text-[11px] block font-mono font-medium">
                Terakhir: {formatDateIndo(customer.lastOrderDate)}
              </span>
            </div>
          </div>

          {/* Admin Notes */}
          {customer.notes && (
            <div className="p-3 bg-blue-50/50 border border-blue-200/80 rounded-xl">
              <span className="font-semibold text-blue-900 block mb-0.5">
                Catatan CRM Internal:
              </span>
              <p className="text-slate-700 leading-relaxed">{customer.notes}</p>
            </div>
          )}

          {/* Order History Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between font-semibold text-slate-900">
              <span>Riwayat Transaksi Pelanggan ({customerOrders.length})</span>
              <span className="text-[11px] text-slate-500">Klik untuk melihat faktur</span>
            </div>

            {customerOrders.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                Belum ada transaksi terekam untuk pelanggan ini.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {customerOrders.map((ord) => {
                  const badge = getStatusBadge(ord.status);
                  return (
                    <div
                      key={ord.id}
                      onClick={() => {
                        setSelectedOrder(ord);
                        onClose();
                      }}
                      className="p-3 hover:bg-slate-50 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-slate-900">
                            {ord.id}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.2 rounded-full font-medium ${badge.bgClass} ${badge.textClass}`}
                          >
                            {badge.label}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          {formatDateTimeIndo(ord.date)} · {ord.channel}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="font-mono font-bold text-slate-900 tabular-nums block">
                          {formatRupiah(ord.totalAmount)}
                        </span>
                        <span className="text-[10px] text-blue-600 flex items-center gap-0.5 justify-end mt-0.5">
                          Detail <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
