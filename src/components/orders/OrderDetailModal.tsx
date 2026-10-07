import React from 'react';
import {
  X,
  Printer,
  Truck,
  CreditCard,
  User,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Clock,
  Package,
} from 'lucide-react';
import { useSales } from '../../context/SalesContext';
import { Order, OrderStatus } from '../../types';
import {
  formatRupiah,
  formatDateTimeIndo,
  getStatusBadge,
} from '../../utils/formatters';

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
}) => {
  const { updateOrderStatus, quickNavigateToCustomer } = useSales();

  if (!order) return null;

  const statusInfo = getStatusBadge(order.status);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateOrderStatus(order.id, e.target.value as OrderStatus);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight font-mono">
                {order.id}
              </h2>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bgClass} ${statusInfo.textClass}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`} />
                {statusInfo.label}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Dibuat pada {formatDateTimeIndo(order.date)}</span>
              <span>·</span>
              <span className="font-medium text-slate-700">Kanal {order.channel}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
              title="Cetak Salinan Invoice"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-slate-600">
          {/* Quick Status Control Bar */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-slate-900 text-xs">
                Perbarui Status Pesanan Ini:
              </span>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={order.status}
                onChange={handleStatusChange}
                className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Menunggu Pembayaran</option>
                <option value="processing">Sedang Diproses</option>
                <option value="shipped">Sedang Dikirim</option>
                <option value="completed">Selesai</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>
          </div>

          {/* Customer & Shipping Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Customer Box */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Informasi Pembeli
                </span>
                <button
                  onClick={() => {
                    quickNavigateToCustomer(order.customerId);
                    onClose();
                  }}
                  className="text-[11px] text-blue-600 hover:underline flex items-center gap-0.5"
                >
                  Lihat Profil
                  <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </div>

              <div>
                <span className="font-medium text-slate-800 block">{order.customerName}</span>
                <span className="text-slate-500 block">{order.customerEmail}</span>
                <span className="text-slate-500 block">{order.customerPhone}</span>
              </div>
            </div>

            {/* Shipping & Payment Box */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
              <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-slate-400" />
                Pengiriman & Pembayaran
              </span>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Metode Bayar:</span>
                  <span className="font-medium text-slate-800">{order.paymentMethod}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Status Bayar:</span>
                  <span className="font-medium text-emerald-600 capitalize">
                    {order.paymentStatus === 'paid' ? 'Lunas' : order.paymentStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Ekspedisi:</span>
                  <span className="font-medium text-slate-800">{order.courier}</span>
                </div>
                {order.trackingNumber && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">No. Resi:</span>
                    <span className="font-mono text-blue-600 font-semibold">
                      {order.trackingNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900 block text-xs">
                Alamat Pengiriman ({order.customerCity})
              </span>
              <p className="text-slate-600 mt-0.5 leading-relaxed">{order.shippingAddress}</p>
            </div>
          </div>

          {/* Itemized Order Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-3 bg-slate-50 border-b border-slate-200 font-semibold text-slate-900 flex items-center justify-between">
              <span>Daftar Produk ({order.items.length} Barang)</span>
              <span className="text-[11px] font-normal text-slate-500">Harga Satuan</span>
            </div>
            <div className="divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between hover:bg-slate-50/50">
                  <div className="min-w-0 pr-3">
                    <span className="font-medium text-slate-900 block truncate">{item.name}</span>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="font-mono">{item.sku}</span>
                      <span>·</span>
                      <span>Kategori: {item.category}</span>
                      <span>·</span>
                      <span className="font-medium text-slate-700">{item.quantity} unit</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-semibold text-slate-900 block tabular-nums">
                      {formatRupiah(item.totalPrice)}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400 block tabular-nums">
                      @{formatRupiah(item.unitPrice)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="p-4 bg-slate-50/70 border-t border-slate-200 space-y-1.5 font-mono tabular-nums text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Subtotal Barang:</span>
                <span>{formatRupiah(order.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Ongkos Kirim:</span>
                <span>{formatRupiah(order.shippingFee)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex items-center justify-between text-emerald-600">
                  <span>Diskon Promo:</span>
                  <span>-{formatRupiah(order.discount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm font-bold text-slate-900">
                <span className="font-sans font-bold">Total Pembayaran:</span>
                <span className="text-blue-700">{formatRupiah(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {order.notes && (
            <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-xs text-amber-900">
              <span className="font-semibold block mb-0.5">Catatan Khusus Pesanan:</span>
              <p>{order.notes}</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
