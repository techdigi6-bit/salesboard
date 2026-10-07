import React, { useState, useMemo } from 'react';
import {
  Search,
  UserPlus,
  Users,
  Award,
  TrendingUp,
  MapPin,
  Mail,
  Phone,
  ChevronRight,
  LayoutGrid,
  List,
  Calendar,
} from 'lucide-react';
import { useSales } from '../../context/SalesContext';
import { Customer } from '../../types';
import {
  formatRupiah,
  formatCompactRupiah,
  formatDateIndo,
} from '../../utils/formatters';

export const CustomersView: React.FC = () => {
  const { customers, setSelectedCustomer, addCustomer } = useSales();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Customer Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newTier, setNewTier] = useState<'VIP' | 'Reguler' | 'Baru'>('Baru');

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      if (selectedTier !== 'all' && cust.tier !== selectedTier) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          cust.name.toLowerCase().includes(q) ||
          cust.email.toLowerCase().includes(q) ||
          cust.phone.includes(q) ||
          cust.city.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [customers, selectedTier, searchQuery]);

  // Aggregate Metrics
  const totalLTV = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgLTV = Math.round(totalLTV / (customers.length || 1));
  const vipCount = customers.filter((c) => c.tier === 'VIP').length;

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    addCustomer({
      name: newName,
      email: newEmail,
      phone: newPhone || '+62 812-0000-0000',
      city: newCity || 'Jakarta',
      address: newAddress || 'Jl. Sudirman No. 10',
      tier: newTier,
      favoriteCategory: 'Elektronik',
      notes: 'Pelanggan baru ditambahkan secara manual via dashboard.',
    });

    setIsAddModalOpen(false);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewCity('');
    setNewAddress('');
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'VIP':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Reguler':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Direktori & Detail Pelanggan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Analisis nilai belanja seumur hidup (LTV), segmentasi loyalitas, dan kontak pelanggan
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors self-start sm:self-auto cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Pelanggan Baru</span>
        </button>
      </div>

      {/* Customer KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Pelanggan Terdaftar</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {customers.length} Akun
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-0.5 block">
            +3 pembeli baru bulan ini
          </span>
        </div>

        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Pelanggan VIP Premium</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-xl font-bold font-mono text-purple-700 mt-1 tabular-nums">
            {vipCount} Mitra VIP
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Kontribusi 64% total omzet
          </span>
        </div>

        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Rata-rata Nilai Belanja (LTV)</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {formatCompactRupiah(avgLTV)}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Per akun pelanggan</span>
        </div>

        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Repeat Order Rate</span>
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Tinggi
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-emerald-700 mt-1 tabular-nums">
            82,4%
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Frekuensi &gt; 3 pesanan
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan nama, email, nomor HP, atau kota..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Tier Segmented Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            {['all', 'VIP', 'Reguler', 'Baru'].map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`px-3 py-1 font-medium rounded-md transition-colors ${
                  selectedTier === tier
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tier === 'all' ? 'Semua Segmen' : tier}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
              title="Tampilan Tabel"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
              title="Tampilan Grid Kartu"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Customer Content (Table View or Grid View) */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Nama Pelanggan</th>
                  <th className="py-3 px-4">Segmen</th>
                  <th className="py-3 px-4">Kontak & Kota</th>
                  <th className="py-3 px-4 text-center">Frekuensi</th>
                  <th className="py-3 px-4 text-right">Total Belanja (LTV)</th>
                  <th className="py-3 px-4">Order Terakhir</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    onClick={() => setSelectedCustomer(c)}
                  >
                    {/* Name & Avatar */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                          {c.avatar ? (
                            <img
                              src={c.avatar}
                              alt={c.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-bold text-blue-700 font-mono">
                              {c.name.substring(0, 2).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900 block group-hover:text-blue-600 transition-colors">
                            {c.name}
                          </span>
                          <span className="text-slate-400 text-[11px] font-mono">{c.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Tier */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${getTierBadge(
                          c.tier
                        )}`}
                      >
                        {c.tier}
                      </span>
                    </td>

                    {/* Contact & City */}
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800 block truncate">{c.city}</span>
                      <span className="text-slate-400 text-[11px] block truncate">{c.email}</span>
                    </td>

                    {/* Frequency */}
                    <td className="py-3.5 px-4 text-center font-mono text-slate-800 tabular-nums font-medium">
                      {c.ordersCount}x Order
                    </td>

                    {/* Total Spent */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {formatRupiah(c.totalSpent)}
                    </td>

                    {/* Last Order */}
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                      {formatDateIndo(c.lastOrderDate)}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCustomer(c);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors inline-flex items-center gap-1"
                      >
                        Detail Profil
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedCustomer(c)}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                      {c.avatar ? (
                        <img
                          src={c.avatar}
                          alt={c.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-bold text-blue-700 font-mono">
                          {c.name.substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm tracking-tight">
                        {c.name}
                      </h3>
                      <span className="text-slate-400 text-[11px] font-mono">{c.id}</span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getTierBadge(
                      c.tier
                    )}`}
                  >
                    {c.tier}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 py-2 border-y border-slate-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{c.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{c.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono">{c.phone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Total Belanja</span>
                  <span className="text-sm font-bold font-mono text-slate-900 tabular-nums">
                    {formatRupiah(c.totalSpent)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Frekuensi</span>
                  <span className="text-xs font-semibold text-blue-600">
                    {c.ordersCount}x Order
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add Customer */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-600" />
                Tambah Profil Pelanggan Baru
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Lengkap:</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Contoh: Raden Mas Danang"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email:</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="nama@domain.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nomor WhatsApp:</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+62 812-xxxx-xxxx"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kota / Domisili:</label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="Contoh: Surabaya"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Segmen / Tingkatan:</label>
                  <select
                    value={newTier}
                    onChange={(e) => setNewTier(e.target.value as 'VIP' | 'Reguler' | 'Baru')}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
                  >
                    <option value="Baru">Pelanggan Baru</option>
                    <option value="Reguler">Pelanggan Reguler</option>
                    <option value="VIP">Mitra VIP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Alamat Lengkap Pengiriman:</label>
                <textarea
                  rows={2}
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kode pos..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:bg-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  Simpan Pelanggan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
