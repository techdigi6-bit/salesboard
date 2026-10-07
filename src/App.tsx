import React, { useState } from 'react';
import { SalesProvider, useSales } from './context/SalesContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { OverviewView } from './components/dashboard/OverviewView';
import { TrendsDeepDiveView } from './components/trends/TrendsDeepDiveView';
import { OrdersView } from './components/orders/OrdersView';
import { CustomersView } from './components/customers/CustomersView';
import { TargetPerformanceView } from './components/targets/TargetPerformanceView';
import { OrderDetailModal } from './components/orders/OrderDetailModal';
import { CustomerDetailDrawer } from './components/customers/CustomerDetailDrawer';
import { CreateOrderModal } from './components/orders/CreateOrderModal';

const DashboardContent: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const {
    activeTab,
    selectedOrder,
    setSelectedOrder,
    selectedCustomer,
    setSelectedCustomer,
    isCreateOrderOpen,
    setIsCreateOrderOpen,
    isSidebarCollapsed,
  } = useSales();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewView />;
      case 'trends':
        return <TrendsDeepDiveView />;
      case 'orders':
        return <OrdersView />;
      case 'customers':
        return <CustomersView />;
      case 'targets':
        return <TargetPerformanceView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content Area with Adaptive Smooth Padding */}
      <div
        className={`flex-1 ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        } transition-all duration-300 ease-in-out flex flex-col min-w-0 min-h-screen`}
      >
        <Header onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Modals & Drawers */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      <CustomerDetailDrawer
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />

      <CreateOrderModal
        isOpen={isCreateOrderOpen}
        onClose={() => setIsCreateOrderOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <SalesProvider>
      <DashboardContent />
    </SalesProvider>
  );
}
