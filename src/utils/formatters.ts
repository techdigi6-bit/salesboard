/**
 * Currency & Date formatting utilities configured for Indonesian locale
 */

export function formatRupiah(value: number): string {
  if (isNaN(value)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompactRupiah(value: number): string {
  if (isNaN(value)) return 'Rp 0';
  if (value >= 1_000_000_000) {
    const formatted = (value / 1_000_000_000).toFixed(1).replace('.', ',');
    return `Rp ${formatted} M`;
  }
  if (value >= 1_000_000) {
    const formatted = (value / 1_000_000).toFixed(1).replace('.', ',');
    return `Rp ${formatted} Jt`;
  }
  if (value >= 1_000) {
    const formatted = (value / 1_000).toFixed(0);
    return `Rp ${formatted} Rb`;
  }
  return `Rp ${value}`;
}

export function formatNumber(value: number): string {
  if (isNaN(value)) return '0';
  return new Intl.NumberFormat('id-ID').format(value);
}

export function formatPercent(value: number, decimals: number = 1): string {
  if (isNaN(value)) return '0%';
  return `${value.toFixed(decimals).replace('.', ',')}%`;
}

export function formatDateIndo(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
}

export function formatDateTimeIndo(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateStr;
  }
}

export function getStatusBadge(status: string): { label: string; textClass: string; bgClass: string; dotClass: string } {
  switch (status) {
    case 'completed':
      return {
        label: 'Selesai',
        textClass: 'text-white',
        bgClass: 'bg-emerald-600 border border-emerald-700/30 shadow-2xs',
        dotClass: 'bg-white',
      };
    case 'shipped':
      return {
        label: 'Dikirim',
        textClass: 'text-white',
        bgClass: 'bg-blue-600 border border-blue-700/30 shadow-2xs',
        dotClass: 'bg-white',
      };
    case 'processing':
      return {
        label: 'Diproses',
        textClass: 'text-white',
        bgClass: 'bg-amber-600 border border-amber-700/30 shadow-2xs',
        dotClass: 'bg-white',
      };
    case 'pending':
      return {
        label: 'Menunggu',
        textClass: 'text-white',
        bgClass: 'bg-slate-600 border border-slate-700/30 shadow-2xs',
        dotClass: 'bg-white',
      };
    case 'cancelled':
      return {
        label: 'Dibatalkan',
        textClass: 'text-white',
        bgClass: 'bg-rose-600 border border-rose-700/30 shadow-2xs',
        dotClass: 'bg-white',
      };
    default:
      return {
        label: status,
        textClass: 'text-white',
        bgClass: 'bg-slate-700 border border-slate-800 shadow-2xs',
        dotClass: 'bg-white',
      };
  }
}

export function downloadOrdersCSV(orders: Array<{
  id: string;
  date: string;
  customerName: string;
  customerCity: string;
  channel: string;
  paymentMethod: string;
  status: string;
  totalAmount: number;
}>): void {
  const headers = ['ID Pesanan', 'Tanggal', 'Nama Pelanggan', 'Kota', 'Channel', 'Metode Bayar', 'Status', 'Total Nilai (IDR)'];
  const rows = orders.map((o) => [
    o.id,
    o.date,
    `"${o.customerName}"`,
    `"${o.customerCity}"`,
    o.channel,
    o.paymentMethod,
    o.status,
    o.totalAmount,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `laporan_penjualan_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
