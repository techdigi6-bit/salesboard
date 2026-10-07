import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  ShoppingBag,
  Users,
  Target,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  X,
  User,
} from 'lucide-react';
import { useSales } from '../../context/SalesContext';
import { ActiveTab } from '../../types';
import { formatPercent, formatCompactRupiah } from '../../utils/formatters';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const {
    activeTab,
    setActiveTab,
    orders,
    monthlyTarget,
    isSidebarCollapsed,
    toggleSidebarCollapse,
  } = useSales();

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'processing' || o.status === 'pending'
  ).length;

  const targetPercentage = (monthlyTarget.totalAchieved / monthlyTarget.totalTarget) * 100;

  const navItems: Array<{
    id: ActiveTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }> = [
    { id: 'overview', label: 'Ringkasan', icon: LayoutDashboard },
    { id: 'trends', label: 'Tren Penjualan', icon: TrendingUp },
    { id: 'orders', label: 'Order Terbaru', icon: ShoppingBag, badge: pendingOrdersCount },
    { id: 'customers', label: 'Detail Pelanggan', icon: Users },
    { id: 'targets', label: 'Target & Performa', icon: Target },
  ];

  const handleNavClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container with Smooth Collapse Transitions */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col transition-all duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Brand Header & Collapse Toggle */}
        <div className="h-16 px-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm font-bold text-sm tracking-tight shrink-0">
              NS
            </div>
            {!isSidebarCollapsed && (
              <div className="min-w-0 overflow-hidden transition-all duration-200">
                <span className="text-base font-semibold tracking-tight text-white block leading-tight truncate">
                  NusantaraSales
                </span>
                <span className="text-[11px] text-slate-400 font-medium truncate block">
                  Sistem Monitor Penjualan
                </span>
              </div>
            )}
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden cursor-pointer"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 py-4 px-2.5 overflow-y-auto space-y-1">
          {!isSidebarCollapsed && (
            <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Menu Utama
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={isSidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center ${
                  isSidebarCollapsed ? 'justify-center p-3' : 'justify-between px-3 py-2.5'
                } rounded-lg text-sm font-medium transition-colors cursor-pointer group relative ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className={`flex items-center ${isSidebarCollapsed ? '' : 'gap-3'}`}>
                  <Icon
                    className={`w-5 h-5 shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  {!isSidebarCollapsed && (
                    <span className="whitespace-nowrap">{item.label}</span>
                  )}
                </div>

                {/* Badges / Indicators */}
                {!isSidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-mono font-medium ${
                      isActive ? 'bg-blue-700 text-white' : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Collapsed dot badge for pending */}
                {isSidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400" />
                )}

                {!isSidebarCollapsed && isActive && (
                  <ChevronRight className="w-4 h-4 text-white/80" />
                )}
              </button>
            );
          })}
        </div>

        {/* Target Bulanan Quick Widget */}
        {!isSidebarCollapsed ? (
          <div className="p-3.5 mx-3 mb-3 rounded-xl bg-slate-800/70 border border-slate-700/60">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Target {monthlyTarget.monthName}
              </span>
              <span className="text-xs font-mono font-semibold text-blue-400 tabular-nums">
                {formatPercent(targetPercentage)}
              </span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden mb-2">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, targetPercentage)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono tabular-nums">
              <span>{formatCompactRupiah(monthlyTarget.totalAchieved)}</span>
              <span>{formatCompactRupiah(monthlyTarget.totalTarget)}</span>
            </div>
          </div>
        ) : (
          <div
            className="mx-auto mb-3 p-2 bg-slate-800 rounded-lg text-center cursor-pointer"
            title={`Target ${monthlyTarget.monthName}: ${formatPercent(targetPercentage)}`}
            onClick={() => setActiveTab('targets')}
          >
            <Sparkles className="w-4 h-4 text-blue-400 mx-auto" />
            <span className="text-[10px] font-mono font-bold text-blue-400 block mt-1">
              {Math.round(targetPercentage)}%
            </span>
          </div>
        )}

        {/* Admin User Profile */}
        <div
          className={`p-3 border-t border-slate-800 flex items-center ${
            isSidebarCollapsed ? 'justify-center' : 'gap-3'
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-slate-400">
            <User className="w-4 h-4 text-slate-400" />
          </div>
          {!isSidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate flex items-center gap-1">
                Edi Gunawan
                <ShieldCheck className="w-3 h-3 text-emerald-400 inline shrink-0" />
              </div>
              <div className="text-[11px] text-slate-400 truncate">Kepala Operasional</div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
