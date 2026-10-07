import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  INITIAL_CUSTOMERS,
  INITIAL_DAILY_TREND,
  INITIAL_MONTHLY_TARGET,
  INITIAL_ORDERS,
  INITIAL_WEEKLY_TREND,
  RIZKY_AVATAR_URL,
  BAGUS_AVATAR_URL,
  MAYA_AVATAR_URL,
} from '../data/mockData';
import {
  ActiveTab,
  Customer,
  DailyTrendPoint,
  MonthlyTargetData,
  Order,
  OrderStatus,
  TimeRangeFilter,
  WeeklyTrendPoint,
} from '../types';

interface SalesContextType {
  orders: Order[];
  customers: Customer[];
  dailyTrend: DailyTrendPoint[];
  weeklyTrend: WeeklyTrendPoint[];
  monthlyTarget: MonthlyTargetData;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
  selectedCustomer: Customer | null;
  setSelectedCustomer: (customer: Customer | null) => void;
  isCreateOrderOpen: boolean;
  setIsCreateOrderOpen: (open: boolean) => void;
  timeRange: TimeRangeFilter;
  setTimeRange: (range: TimeRangeFilter) => void;
  isSidebarCollapsed: boolean;
  toggleSidebarCollapse: () => void;
  setIsSidebarCollapsed: (v: boolean) => void;
  addOrder: (orderData: Omit<Order, 'id' | 'date'>) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateMonthlyTarget: (newTarget: number) => void;
  addCustomer: (customerData: Omit<Customer, 'id' | 'totalSpent' | 'ordersCount' | 'firstOrderDate' | 'lastOrderDate'>) => void;
  quickNavigateToCustomer: (customerId: string) => void;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

const ORDERS_KEY = 'nusantara_sales_orders_v1';
const CUSTOMERS_KEY = 'nusantara_sales_customers_v1';
const TARGET_KEY = 'nusantara_sales_target_v1';
const SIDEBAR_COLLAPSED_KEY = 'nusantara_sales_sidebar_collapsed_v1';

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem(CUSTOMERS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [monthlyTarget, setMonthlyTarget] = useState<MonthlyTargetData>(() => {
    try {
      const saved = localStorage.getItem(TARGET_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.salesReps) {
          parsed.salesReps = parsed.salesReps.map((r: { id: string; name: string; avatar: string }) => {
            if (r.name === 'Rizky Alamsyah') return { ...r, avatar: RIZKY_AVATAR_URL };
            if (r.name === 'Maya Indah') return { ...r, avatar: MAYA_AVATAR_URL };
            if (r.name === 'Bagus Wicaksono') return { ...r, avatar: BAGUS_AVATAR_URL };
            return r;
          });
        }
        return parsed;
      }
      return INITIAL_MONTHLY_TARGET;
    } catch {
      return INITIAL_MONTHLY_TARGET;
    }
  });

  const [dailyTrend, setDailyTrend] = useState<DailyTrendPoint[]>(INITIAL_DAILY_TREND);
  const [weeklyTrend] = useState<WeeklyTrendPoint[]>(INITIAL_WEEKLY_TREND);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('30d');

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, JSON.stringify(isSidebarCollapsed));
    } catch {
      // storage error
    }
  }, [isSidebarCollapsed]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch {
      // storage error
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
    } catch {
      // storage error
    }
  }, [customers]);

  useEffect(() => {
    try {
      localStorage.setItem(TARGET_KEY, JSON.stringify(monthlyTarget));
    } catch {
      // storage error
    }
  }, [monthlyTarget]);

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'date'>) => {
    const today = new Date();
    const dateFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')} ${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;
    const newId = `ORD-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${String(Math.floor(100 + Math.random() * 900))}`;

    const newOrder: Order = {
      ...orderData,
      id: newId,
      date: dateFormatted,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Update customer stats if existing
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === orderData.customerId || c.email.toLowerCase() === orderData.customerEmail.toLowerCase()) {
          const updatedTotal = c.totalSpent + orderData.totalAmount;
          const updatedCount = c.ordersCount + 1;
          const updatedTier = updatedTotal > 30000000 ? 'VIP' : updatedTotal > 10000000 ? 'Reguler' : c.tier;
          return {
            ...c,
            totalSpent: updatedTotal,
            ordersCount: updatedCount,
            lastOrderDate: dateFormatted.split(' ')[0],
            tier: updatedTier,
          };
        }
        return c;
      })
    );

    // Update monthly target achievement
    setMonthlyTarget((prev) => {
      const newAchieved = prev.totalAchieved + orderData.totalAmount;
      const daysPassed = prev.daysPassed;
      const daysInMonth = prev.daysInMonth;
      const daysRemaining = Math.max(1, daysInMonth - daysPassed);
      const remainingTarget = Math.max(0, prev.totalTarget - newAchieved);
      const dailyRunRate = Math.round(remainingTarget / daysRemaining);

      return {
        ...prev,
        totalAchieved: newAchieved,
        dailyRunRateRequired: dailyRunRate,
        projectedEndMonth: Math.round((newAchieved / daysPassed) * daysInMonth),
      };
    });

    // Update today's trend data point
    setDailyTrend((prev) => {
      const lastIdx = prev.length - 1;
      const lastPoint = prev[lastIdx];
      const updatedRevenue = lastPoint.revenue + orderData.totalAmount;
      const updatedOrders = lastPoint.ordersCount + 1;
      const updatedPoint: DailyTrendPoint = {
        ...lastPoint,
        revenue: updatedRevenue,
        ordersCount: updatedOrders,
        aov: Math.round(updatedRevenue / updatedOrders),
      };
      return [...prev.slice(0, lastIdx), updatedPoint];
    });
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const updateMonthlyTarget = (newTarget: number) => {
    setMonthlyTarget((prev) => {
      const remainingTarget = Math.max(0, newTarget - prev.totalAchieved);
      const dailyRunRate = Math.round(remainingTarget / Math.max(1, prev.daysRemaining));
      return {
        ...prev,
        totalTarget: newTarget,
        dailyRunRateRequired: dailyRunRate,
      };
    });
  };

  const addCustomer = (customerData: Omit<Customer, 'id' | 'totalSpent' | 'ordersCount' | 'firstOrderDate' | 'lastOrderDate'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newCustomer: Customer = {
      ...customerData,
      id: `CUST-${String(customers.length + 1).padStart(3, '0')}`,
      totalSpent: 0,
      ordersCount: 0,
      firstOrderDate: today,
      lastOrderDate: today,
    };
    setCustomers((prev) => [newCustomer, ...prev]);
  };

  const quickNavigateToCustomer = (customerId: string) => {
    const found = customers.find((c) => c.id === customerId);
    if (found) {
      setSelectedCustomer(found);
      setActiveTab('customers');
    }
  };

  return (
    <SalesContext.Provider
      value={{
        orders,
        customers,
        dailyTrend,
        weeklyTrend,
        monthlyTarget,
        activeTab,
        setActiveTab,
        selectedOrder,
        setSelectedOrder,
        selectedCustomer,
        setSelectedCustomer,
        isCreateOrderOpen,
        setIsCreateOrderOpen,
        timeRange,
        setTimeRange,
        isSidebarCollapsed,
        toggleSidebarCollapse,
        setIsSidebarCollapsed,
        addOrder,
        updateOrderStatus,
        updateMonthlyTarget,
        addCustomer,
        quickNavigateToCustomer,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = (): SalesContextType => {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
};
