import React, { useState } from 'react';
import { X, Plus, Trash2, ShoppingBag, Check } from 'lucide-react';
import { useSales } from '../../context/SalesContext';
import { AVAILABLE_CATALOG_ITEMS } from '../../data/mockData';
import {
  OrderItem,
  PaymentMethod,
  SalesChannel,
  OrderStatus,
} from '../../types';
import { formatRupiah } from '../../utils/formatters';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { customers, addOrder } = useSales();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    customers[0]?.id || ''
  );
  const [channel, setChannel] = useState<SalesChannel>('Website');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Transfer BCA');
  const [courier, setCourier] = useState<string>('JNE Regular');
  const [status, setStatus] = useState<OrderStatus>('processing');
  const [discount, setDiscount] = useState<number>(0);
  const [shippingFee, setShippingFee] = useState<number>(30000);
  const [orderNotes, setOrderNotes] = useState<string>('');

  // Items in current draft order
  const [selectedItems, setSelectedItems] = useState<
    Array<{
      catalogIdx: number;
      quantity: number;
    }>
  >([{ catalogIdx: 0, quantity: 1 }]);

  if (!isOpen) return null;

  const currentCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  const handleAddItemRow = () => {
    setSelectedItems((prev) => [...prev, { catalogIdx: 1, quantity: 1 }]);
  };

  const handleRemoveItemRow = (idx: number) => {
    if (selectedItems.length <= 1) return;
    setSelectedItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleItemChange = (idx: number, catalogIdx: number) => {
    setSelectedItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, catalogIdx } : item))
    );
  };

  const handleQtyChange = (idx: number, qty: number) => {
    const validQty = Math.max(1, qty);
    setSelectedItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, quantity: validQty } : item))
    );
  };

  // Calculations
  const calculatedItems: OrderItem[] = selectedItems.map((sel, idx) => {
    const catalogItem = AVAILABLE_CATALOG_ITEMS[sel.catalogIdx] || AVAILABLE_CATALOG_ITEMS[0];
    return {
      id: `ITM-DRAFT-${idx + 1}`,
      name: catalogItem.name,
      category: catalogItem.category,
      quantity: sel.quantity,
      unitPrice: catalogItem.price,
      totalPrice: catalogItem.price * sel.quantity,
      sku: catalogItem.sku,
    };
  });

  const subtotal = calculatedItems.reduce((acc, itm) => acc + itm.totalPrice, 0);
  const totalAmount = Math.max(0, subtotal + shippingFee - discount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCustomer) return;

    addOrder({
      customerId: currentCustomer.id,
      customerName: currentCustomer.name,
      customerEmail: currentCustomer.email,
      customerPhone: currentCustomer.phone,
      customerCity: currentCustomer.city,
      shippingAddress: currentCustomer.address,
      courier,
      trackingNumber: `EXP${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      items: calculatedItems,
      subtotal,
      shippingFee,
      discount,
      totalAmount,
      status,
      paymentMethod,
      paymentStatus: 'paid',
      channel,
      notes: orderNotes,
    });

    onClose();
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
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              Input Transaksi Penjualan Baru
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Data transaksi baru akan langsung memperbarui grafik tren dan realisasi target
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Customer Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-800 block mb-1">
                Pilih Pelanggan:
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.city}) - {c.tier}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-800 block mb-1">
                Kanal Penjualan:
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as SalesChannel)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Website">Website Nusantara.id</option>
                <option value="Tokopedia">Tokopedia Mall</option>
                <option value="Shopee">Shopee Official Store</option>
                <option value="WhatsApp">WhatsApp Business</option>
                <option value="Offline Store">Toko Offline Kemang</option>
              </select>
            </div>
          </div>

          {/* Product Items Selection */}
          <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900">
                Item Produk yang Dipesan:
              </span>
              <button
                type="button"
                onClick={handleAddItemRow}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Produk
              </button>
            </div>

            <div className="space-y-2">
              {selectedItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <select
                    value={item.catalogIdx}
                    onChange={(e) => handleItemChange(idx, parseInt(e.target.value, 10))}
                    className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 truncate"
                  >
                    {AVAILABLE_CATALOG_ITEMS.map((cat, cIdx) => (
                      <option key={cIdx} value={cIdx}>
                        {cat.name} ({formatRupiah(cat.price)})
                      </option>
                    ))}
                  </select>

                  <div className="w-20">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQtyChange(idx, parseInt(e.target.value, 10) || 1)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                      title="Jumlah Unit"
                    />
                  </div>

                  {selectedItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItemRow(idx)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Payment, Courier & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-800 block mb-1">
                Metode Pembayaran:
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
              >
                <option value="Transfer BCA">Transfer BCA</option>
                <option value="Transfer Mandiri">Transfer Mandiri</option>
                <option value="QRIS">QRIS ShopeePay/Gopay</option>
                <option value="Kartu Kredit">Kartu Kredit</option>
                <option value="GoPay / OVO">GoPay / OVO</option>
                <option value="COD">Cash on Delivery (COD)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-800 block mb-1">
                Jasa Ekspedisi:
              </label>
              <select
                value={courier}
                onChange={(e) => setCourier(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
              >
                <option value="JNE Regular">JNE Regular</option>
                <option value="JNE YES (Next Day)">JNE YES (Next Day)</option>
                <option value="SiCepat BEST">SiCepat BEST</option>
                <option value="J&T Express">J&T Express</option>
                <option value="GrabExpress Instant">GrabExpress Instant</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-800 block mb-1">
                Status Awal:
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
              >
                <option value="processing">Sedang Diproses</option>
                <option value="shipped">Sedang Dikirim</option>
                <option value="completed">Selesai (Langsung Lunas)</option>
                <option value="pending">Menunggu Pembayaran</option>
              </select>
            </div>
          </div>

          {/* Pricing Adjustments */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Ongkos Kirim (Rp):
              </label>
              <input
                type="number"
                value={shippingFee}
                onChange={(e) => setShippingFee(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Potongan Diskon (Rp):
              </label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono text-xs"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Catatan Order (Opsional):
            </label>
            <input
              type="text"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              placeholder="Contoh: Packing kayu atau pengiriman sore hari"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs"
            />
          </div>

          {/* Summary Box */}
          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 flex items-center justify-between font-mono tabular-nums">
            <span className="text-slate-700 font-sans font-semibold">Total Tagihan Pesanan:</span>
            <span className="text-base font-bold text-blue-700">{formatRupiah(totalAmount)}</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold"
            >
              Batalkan
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Simpan & Terbitkan Pesanan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
