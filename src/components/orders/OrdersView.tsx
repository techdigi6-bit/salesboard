import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  ArrowUpDown,
  ShoppingBag,
  RotateCcw,
} from 'lucide-react';
import { useSales } from '../../context/SalesContext';
import { Order, OrderStatus, SalesChannel } from '../../types';
import {
  formatRupiah,
  formatDateTimeIndo,
  getStatusBadge,
  downloadOrdersCSV,
} from '../../utils/formatters';

export const OrdersView: React.FC = () => {
  const { orders, setSelectedOrder, setIsCreateOrderOpen } = useSales();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Filtered & Sorted orders
  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        // Status filter
        if (selectedStatus !== 'all' && order.status !== selectedStatus) return false;

        // Channel filter
        if (selectedChannel !== 'all' && order.channel !== selectedChannel) return false;

        // Search text
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchId = order.id.toLowerCase().includes(q);
          const matchName = order.customerName.toLowerCase().includes(q);
          const matchCity = order.customerCity.toLowerCase().includes(q);
          const matchItems = order.items.some((i) => i.name.toLowerCase().includes(q));
          return matchId || matchName || matchCity || matchItems;
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.date).getTime();
        const timeB = new Date(b.date).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [orders, selectedStatus, selectedChannel, searchQuery, sortOrder]);

  const statusCounts = useMemo(() => {
    return {
      all: orders.length,
      processing: orders.filter((o) => o.status === 'processing').length,
      shipped: orders.filter((o) => o.status === 'shipped').length,
      completed: orders.filter((o) => o.status === 'completed').length,
      pending: orders.filter((o) => o.status === 'pending').length,
      cancelled: orders.filter((o) => o.status === 'cancelled').length,
    };
  }, [orders]);

  const handleExport = () => {
    downloadOrdersCSV(filteredOrders);
  };

  return (
    <div className="space-y-4">
      {/* Page Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Order Terbaru & Riwayat Transaksi
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola dan pantau seluruh pesanan masuk dari semua kanal penjualan secara terpusat
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Ekspor ({filteredOrders.length})</span>
          </button>
          <button
            onClick={() => setIsCreateOrderOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Pesanan Baru</span>
          </button>
        </div>
      </div>

      {/* Status Segmented Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200">
        {[
          { key: 'all', label: 'Semua Status', count: statusCounts.all },
          { key: 'processing', label: 'Diproses', count: statusCounts.processing },
          { key: 'shipped', label: 'Dikirim', count: statusCounts.shipped },
          { key: 'completed', label: 'Selesai', count: statusCounts.completed },
          { key: 'pending', label: 'Menunggu', count: statusCounts.pending },
          { key: 'cancelled', label: 'Dibatalkan', count: statusCounts.cancelled },
        ].map((tab) => {
          const isActive = selectedStatus === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setSelectedStatus(tab.key)}
              className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ID order, nama pelanggan, kota, atau nama produk..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        {/* Channel Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="bg-white border border-slate-200 text-xs text-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Kanal Penjualan</option>
            <option value="Shopee">Shopee</option>
            <option value="Tokopedia">Tokopedia</option>
            <option value="Website">Website Resmi</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Offline Store">Toko Offline</option>
          </select>

          {/* Sort Date Toggle */}
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="px-3 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap"
            title="Ubah Urutan Waktu"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span>{sortOrder === 'desc' ? 'Terbaru' : 'Terlama'}</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">ID Pesanan</th>
                <th className="py-3 px-4">Tanggal & Waktu</th>
                <th className="py-3 px-4">Pelanggan</th>
                <th className="py-3 px-4">Kanal & Bayar</th>
                <th className="py-3 px-4">Ringkasan Produk</th>
                <th className="py-3 px-4 text-right">Total Tagihan</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <ShoppingBag className="w-10 h-10 text-slate-300 mb-2" />
                      <span className="font-semibold text-slate-700 text-sm">
                        Tidak ada pesanan yang sesuai filter
                      </span>
                      <span className="text-xs text-slate-500 mt-0.5">
                        Coba ubah kata kunci pencarian atau bersihkan filter status
                      </span>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedStatus('all');
                          setSelectedChannel('all');
                        }}
                        className="mt-3 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset Filter
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusBadge = getStatusBadge(order.status);
                  const itemCount = order.items.reduce((acc, itm) => acc + itm.quantity, 0);

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                      onClick={() => setSelectedOrder(order)}
                    >
                      {/* ID */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 whitespace-nowrap">
                        {order.id}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-500 text-[11px]">
                        {formatDateTimeIndo(order.date)}
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4 min-w-[140px]">
                        <span className="font-semibold text-slate-900 block truncate">
                          {order.customerName}
                        </span>
                        <span className="text-slate-400 text-[11px] block truncate">
                          {order.customerCity}
                        </span>
                      </td>

                      {/* Channel & Payment */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-medium text-slate-800 block text-xs">
                          {order.channel}
                        </span>
                        <span className="text-slate-400 text-[11px] block">
                          {order.paymentMethod}
                        </span>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4 max-w-[200px]">
                        <span className="font-medium text-slate-800 block truncate">
                          {order.items[0]?.name}
                        </span>
                        <span className="text-slate-500 text-[11px] block">
                          {itemCount} unit
                          {order.items.length > 1 ? ` (${order.items.length} varian)` : ''}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap tabular-nums">
                        {formatRupiah(order.totalAmount)}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span
                          className={`w-28 inline-flex items-center justify-center gap-1.5 py-1 rounded-full text-xs font-semibold ${statusBadge.bgClass} ${statusBadge.textClass}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusBadge.dotClass}`} />
                          <span>{statusBadge.label}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-md font-medium text-xs inline-flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Rincian</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            Menampilkan <strong className="text-slate-700">{filteredOrders.length}</strong> dari{' '}
            <strong className="text-slate-700">{orders.length}</strong> total transaksi pesanan
          </span>
          <div className="flex items-center gap-3 font-mono tabular-nums text-[11px]">
            <span>
              Total Nilai Terfilter:{' '}
              <strong className="text-blue-700">
                {formatRupiah(filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0))}
              </strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
