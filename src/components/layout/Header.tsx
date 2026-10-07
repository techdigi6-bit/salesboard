import React, { useState } from 'react';
import {
  Menu,
  Plus,
  Download,
  Bell,
  Calendar,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { useSales } from '../../context/SalesContext';
import { ActiveTab, TimeRangeFilter } from '../../types';
import { downloadOrdersCSV, formatRupiah, formatDateTimeIndo } from '../../utils/formatters';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileSidebar }) => {
  const {
    activeTab,
    timeRange,
    setTimeRange,
    setIsCreateOrderOpen,
    orders,
    setSelectedOrder,
    isSidebarCollapsed,
    toggleSidebarCollapse,
  } = useSales();

  const [showNotifications, setShowNotifications] = useState(false);

  const getBreadcrumbTitle = (tab: ActiveTab): string => {
    switch (tab) {
      case 'overview':
        return 'Dashboard';
      case 'trends':
        return 'Tren Penjualan';
      case 'orders':
        return 'Order Terbaru';
      case 'customers':
        return 'Detail Pelanggan';
      case 'targets':
        return 'Target & Performa';
      default:
        return 'Dashboard';
    }
  };

  const currentTitle = getBreadcrumbTitle(activeTab);

  const pendingOrders = orders.filter(
    (o) => o.status === 'processing' || o.status === 'pending'
  );

  const handleExport = () => {
    downloadOrdersCSV(orders);
  };

  const handleToggleMenu = () => {
    // If on mobile screen (< 1024px), toggle mobile sidebar drawer
    if (window.innerWidth < 1024) {
      onOpenMobileSidebar();
    } else {
      // On desktop, toggle collapse
      toggleSidebarCollapse();
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between text-white shadow-xs">
      {/* Zone 1: Menu Collapse Toggle & Title (Clean "Dashboard" in White Text) */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={handleToggleMenu}
          className="p-2 -ml-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          title={isSidebarCollapsed ? 'Buka Menu (Expand)' : 'Kecilkan Menu (Collapse)'}
          aria-label="Toggle Menu Navigasi"
        >
          {/* On desktop show collapse icon, on mobile show menu */}
          <span className="hidden lg:inline">
            {isSidebarCollapsed ? (
              <PanelLeft className="w-5 h-5 text-blue-400" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </span>
          <span className="lg:hidden">
            <Menu className="w-5 h-5" />
          </span>
        </button>

        {/* Dashboard Title - Pure White Text */}
        <div className="flex items-center text-sm sm:text-base">
          {activeTab === 'overview' ? (
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
              Dashboard
            </h1>
          ) : (
            <div className="flex items-center gap-2 truncate">
              <span className="text-white/60 font-medium hidden sm:inline">
                Dashboard
              </span>
              <span className="text-white/40 hidden sm:inline">/</span>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
                {currentTitle}
              </h1>
            </div>
          )}
        </div>
      </div>

      {/* Zone 2: Time Range Filter Segmented Control */}
      <div className="hidden md:flex items-center bg-slate-800/90 p-1 rounded-lg border border-slate-700/80">
        <span className="px-2 text-xs text-slate-400 flex items-center gap-1 font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          Periode:
        </span>
        <button
          onClick={() => setTimeRange('7d')}
          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
            timeRange === '7d'
              ? 'bg-blue-600 text-white shadow-xs font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
          }`}
        >
          7 Hari
        </button>
        <button
          onClick={() => setTimeRange('14d')}
          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
            timeRange === '14d'
              ? 'bg-blue-600 text-white shadow-xs font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
          }`}
        >
          14 Hari
        </button>
        <button
          onClick={() => setTimeRange('30d')}
          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
            timeRange === '30d'
              ? 'bg-blue-600 text-white shadow-xs font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
          }`}
        >
          30 Hari
        </button>
        <button
          onClick={() => setTimeRange('this_month')}
          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
            timeRange === 'this_month'
              ? 'bg-blue-600 text-white shadow-xs font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
          }`}
        >
          Bulan Ini (Okt)
        </button>
      </div>

      {/* Zone 3: Primary Action and Auxiliary Tools */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Export Data Button */}
        <button
          onClick={handleExport}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 hover:text-white transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
          title="Ekspor Data Pesanan ke format CSV"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Ekspor CSV</span>
        </button>

        {/* Notifications Popover Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg relative transition-colors cursor-pointer"
            aria-label="Pemberitahuan Pesanan"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {pendingOrders.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 z-50 p-4 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-900">
                      Pemberitahuan Pesanan
                    </span>
                    <span className="text-[11px] font-mono px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                      {pendingOrders.length} butuh tindakan
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">Terbaru</span>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 py-1">
                  {pendingOrders.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-500">
                      Semua pesanan telah diproses.
                    </div>
                  ) : (
                    pendingOrders.slice(0, 4).map((order) => (
                      <div
                        key={order.id}
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowNotifications(false);
                        }}
                        className="py-2.5 px-1 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-xs font-semibold text-slate-900 block">
                              {order.customerName}
                            </span>
                            <span className="text-[11px] text-slate-500 block">
                              {order.id} · {order.items[0]?.name}
                              {order.items.length > 1 ? ` (+${order.items.length - 1})` : ''}
                            </span>
                          </div>
                          <span className="text-xs font-mono font-medium text-slate-900 tabular-nums shrink-0">
                            {formatRupiah(order.totalAmount)}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                          <span>{formatDateTimeIndo(order.date)}</span>
                          <span className="font-medium text-amber-600">
                            {order.status === 'processing' ? 'Perlu Dikirim' : 'Menunggu Bayar'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {pendingOrders.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 text-center">
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                    >
                      Tutup Notifikasi
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Primary Action Button: Tambah Pesanan Baru */}
        <button
          onClick={() => setIsCreateOrderOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors whitespace-nowrap active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Pesanan Baru</span>
        </button>
      </div>
    </header>
  );
};
