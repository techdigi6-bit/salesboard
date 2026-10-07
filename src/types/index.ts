export type OrderStatus = 'completed' | 'shipped' | 'processing' | 'pending' | 'cancelled';

export type PaymentMethod = 'Transfer BCA' | 'Transfer Mandiri' | 'QRIS' | 'Kartu Kredit' | 'COD' | 'GoPay / OVO';

export type SalesChannel = 'Tokopedia' | 'Shopee' | 'Website' | 'WhatsApp' | 'Offline Store';

export type ProductCategory = 'Elektronik' | 'Fashion & Apparel' | 'F&B Nusantara' | 'Home & Living' | 'Aksesoris Gadget';

export interface OrderItem {
  id: string;
  name: string;
  category: ProductCategory;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  sku: string;
}

export interface Order {
  id: string; // e.g. "ORD-20261006-081"
  date: string; // ISO string or YYYY-MM-DD HH:mm
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCity: string;
  shippingAddress: string;
  courier: string;
  trackingNumber?: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'unpaid' | 'refunded';
  channel: SalesChannel;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  tier: 'VIP' | 'Reguler' | 'Baru';
  totalSpent: number;
  ordersCount: number;
  firstOrderDate: string;
  lastOrderDate: string;
  avatar?: string;
  favoriteCategory: ProductCategory;
  notes?: string;
}

export interface DailyTrendPoint {
  date: string; // YYYY-MM-DD
  dayLabel: string; // '01 Okt', '02 Okt'
  dayName: string; // 'Sen', 'Sel', 'Rab', etc.
  dayNameShort?: string;
  revenue: number;
  ordersCount: number;
  target: number;
  aov: number; // Average Order Value
}

export interface WeeklyTrendPoint {
  weekId: string; // e.g. 'W39', 'W40'
  label: string; // 'Minggu 1 (1-7 Okt)'
  startDate: string;
  endDate: string;
  revenue: number;
  ordersCount: number;
  target: number;
  aov: number;
}

export interface CategoryTarget {
  category: ProductCategory;
  target: number;
  achieved: number;
  percentage: number;
  color: string;
}

export interface SalesRep {
  id: string;
  name: string;
  role: string;
  target: number;
  achieved: number;
  percentage: number;
  dealsCount: number;
  avatar: string;
}

export interface MonthlyTargetData {
  monthName: string;
  year: number;
  totalTarget: number;
  totalAchieved: number;
  daysPassed: number;
  daysInMonth: number;
  daysRemaining: number;
  dailyRunRateRequired: number;
  projectedEndMonth: number;
  categories: CategoryTarget[];
  salesReps: SalesRep[];
}

export type ActiveTab = 'overview' | 'trends' | 'orders' | 'customers' | 'targets';

export type TimeRangeFilter = '7d' | '14d' | '30d' | 'this_month' | 'quarter';
