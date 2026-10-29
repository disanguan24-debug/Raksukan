import React, { useState } from 'react';
import {
  Shield,
  Users,
  Package,
  ShoppingBag,
  DollarSign,
  Check,
  X,
  Download,
  Settings,
  Store as StoreIcon,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Tag,
  Save,
  Edit3,
  HelpCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  exportOrdersToCSV,
  formatRupiah,
  formatTanggalIndo,
  getOrderStatusLabel,
  getPaymentStatusLabel,
} from '../lib/formatters';
import { OrderStatus, PaymentStatus, Product } from '../types';
import { EditProductModal } from './EditProductModal';
import { PhotoGuideModal } from './PhotoGuideModal';

export const AdminDashboard: React.FC = () => {
  const {
    users,
    products,
    categories,
    stores,
    orders,
    settings,
    updateSettings,
    updateProductStatus,
    updateProduct,
    deleteProduct,
    addCategory,
    toggleUserMemberStatus,
    approveUserAsSeller,
    updateOrderStatus,
    updatePaymentStatus,
    isAdmin,
    currentUser,
    setCurrentView,
    switchDemoUser,
  } = useStore();

  const [currentTab, setCurrentTab] = useState<
    'ringkasan' | 'produk' | 'pesanan' | 'anggota' | 'kategori' | 'pengaturan'
  >('ringkasan');

  // Edit Product & Photo Guide states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [guideModalOpen, setGuideModalOpen] = useState(false);

  // Filter & Search states
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('all');
  const [productFilterStatus, setProductFilterStatus] = useState<string>('all');
  const [memberSearch, setMemberSearch] = useState<string>('');

  // Settings form
  const [namaMarketplace, setNamaMarketplace] = useState(settings.nama_marketplace);
  const [waPengelola, setWaPengelola] = useState(settings.nomor_whatsapp);
  const [alamatKantor, setAlamatKantor] = useState(settings.alamat);
  const [ongkirFlat, setOngkirFlat] = useState<number>(settings.biaya_ongkir_flat);
  const [bannerPromo, setBannerPromo] = useState(settings.banner_promo_text);
  const [settingsNotice, setSettingsNotice] = useState<string>('');

  // New Category input
  const [newCatName, setNewCatName] = useState('');
  const [catNotice, setCatNotice] = useState('');

  // Payment note editing
  const [editingPaymentOrderId, setEditingPaymentOrderId] = useState<string | null>(null);
  const [paymentNoteInput, setPaymentNoteInput] = useState('');

  // Calculations for KPIs
  const totalMembers = users.length;
  const activeSellers = users.filter((u) => u.roles.includes('seller')).length;
  const activeProducts = products.filter((p) => p.status === 'aktif').length;
  const pendingProducts = products.filter((p) => p.status === 'menunggu_persetujuan').length;
  const newOrdersCount = orders.filter((o) => o.status === 'menunggu_konfirmasi').length;
  const processingOrdersCount = orders.filter((o) => o.status === 'diproses' || o.status === 'siap_dikirim').length;

  const totalFinishedRevenue = orders
    .filter((o) => o.status === 'selesai' || o.payment_status === 'lunas')
    .reduce((acc, curr) => acc + curr.total, 0);

  // Best selling products based on actual orders
  const bestSellers = [...products]
    .sort((a, b) => b.terjual_count - a.terjual_count)
    .slice(0, 5);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      nama_marketplace: namaMarketplace.trim(),
      nomor_whatsapp: waPengelola.trim(),
      alamat: alamatKantor.trim(),
      biaya_ongkir_flat: Number(ongkirFlat),
      banner_promo_text: bannerPromo.trim(),
    });
    setSettingsNotice('Pengaturan marketplace berhasil disimpan ke database!');
    setTimeout(() => setSettingsNotice(''), 3000);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const slug = newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    addCategory(newCatName.trim(), slug);
    setNewCatName('');
    setCatNotice('Kategori baru berhasil ditambahkan!');
    setTimeout(() => setCatNotice(''), 2500);
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (orderFilterStatus !== 'all' && o.status !== orderFilterStatus) return false;
    return true;
  });

  // Filtered products
  const filteredProducts = products.filter((p) => {
    if (productFilterStatus !== 'all' && p.status !== productFilterStatus) return false;
    return true;
  });

  // Filtered members
  const filteredUsers = users.filter((u) => {
    if (memberSearch.trim()) {
      const q = memberSearch.toLowerCase();
      return (
        u.nama.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.nomor_whatsapp.includes(q)
      );
    }
    return true;
  });

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-[#f7eedd] text-[#c86d44] rounded-full flex items-center justify-center mx-auto shadow-xs">
          <Shield className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-bold text-[#1e4535]">Akses Khusus Pengelola (Admin)</h2>
          <p className="text-sm text-[#6b6255]">
            Halaman ini khusus untuk manajemen marketplace UMKM Parungkuda. Anda saat ini aktif sebagai{' '}
            <strong className="text-[#1e4535]">
              {currentUser ? `${currentUser.nama} (${currentUser.roles.join(', ')})` : 'Tamu / Warga Umum'}
            </strong>.
          </p>
          <p className="text-xs text-[#8a7f72]">
            Gunakan tombol simulasi peran di bilah atas navigasi untuk beralih ke peran Pengelola jika Anda ingin menguji menu kurasi dan verifikasi produk.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => switchDemoUser('admin')}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#1e4535] text-white rounded font-medium text-sm hover:bg-[#285c47] transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Shield className="w-4 h-4" />
            Aktifkan Peran Pengelola (Kang Hendra)
          </button>
          <button
            onClick={() => setCurrentView('beranda')}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#efe8dc] text-[#3d362e] rounded font-medium text-sm hover:bg-[#e4dcce] transition cursor-pointer"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e6decb]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#1e4535] text-white rounded">
              <Shield className="w-5 h-5" />
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1e4535]">
              Dashboard Pengelola Marketplace
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#6b6255] mt-1">
            Kampoeng Raksukan Warga Opat Parungkuda · Manajemen Komunitas & Verifikasi Produk
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#efe8dc] p-1 rounded-md text-xs">
          <button
            onClick={() => setCurrentTab('ringkasan')}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              currentTab === 'ringkasan' ? 'bg-white text-[#1e4535] shadow-xs' : 'text-[#6b6255]'
            }`}
          >
            Ringkasan
          </button>
          <button
            onClick={() => setCurrentTab('produk')}
            className={`px-3 py-1.5 rounded font-medium transition-colors flex items-center gap-1 ${
              currentTab === 'produk' ? 'bg-white text-[#1e4535] shadow-xs' : 'text-[#6b6255]'
            }`}
          >
            <span>Produk</span>
            {pendingProducts > 0 && (
              <span className="px-1.5 py-0.2 bg-[#c86d44] text-white text-[10px] rounded-full font-bold">
                {pendingProducts}
              </span>
            )}
          </button>
          <button
            onClick={() => setCurrentTab('pesanan')}
            className={`px-3 py-1.5 rounded font-medium transition-colors flex items-center gap-1 ${
              currentTab === 'pesanan' ? 'bg-white text-[#1e4535] shadow-xs' : 'text-[#6b6255]'
            }`}
          >
            <span>Pesanan</span>
            {newOrdersCount > 0 && (
              <span className="px-1.5 py-0.2 bg-[#1e4535] text-white text-[10px] rounded-full font-bold">
                {newOrdersCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setCurrentTab('anggota')}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              currentTab === 'anggota' ? 'bg-white text-[#1e4535] shadow-xs' : 'text-[#6b6255]'
            }`}
          >
            Anggota ({users.length})
          </button>
          <button
            onClick={() => setCurrentTab('kategori')}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              currentTab === 'kategori' ? 'bg-white text-[#1e4535] shadow-xs' : 'text-[#6b6255]'
            }`}
          >
            Kategori
          </button>
          <button
            onClick={() => setCurrentTab('pengaturan')}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              currentTab === 'pengaturan' ? 'bg-white text-[#1e4535] shadow-xs' : 'text-[#6b6255]'
            }`}
          >
            Pengaturan
          </button>
        </div>
      </div>

      {/* TAB 1: RINGKASAN / OVERVIEW */}
      {currentTab === 'ringkasan' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-lg border border-[#e6decb] shadow-xs">
              <span className="text-[10px] uppercase tracking-wider text-[#8a7f72] font-bold block">
                Total Anggota
              </span>
              <span className="font-serif text-2xl font-bold text-[#1e4535] tabular-nums">
                {totalMembers}
              </span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-[#e6decb] shadow-xs">
              <span className="text-[10px] uppercase tracking-wider text-[#8a7f72] font-bold block">
                Penjual UMKM
              </span>
              <span className="font-serif text-2xl font-bold text-[#1e4535] tabular-nums">
                {activeSellers}
              </span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-[#e6decb] shadow-xs">
              <span className="text-[10px] uppercase tracking-wider text-[#8a7f72] font-bold block">
                Produk Aktif
              </span>
              <span className="font-serif text-2xl font-bold text-[#1e4535] tabular-nums">
                {activeProducts}
              </span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-[#e6decb] shadow-xs">
              <span className="text-[10px] uppercase tracking-wider text-[#8a7f72] font-bold block">
                Menunggu Kurasi
              </span>
              <span className="font-serif text-2xl font-bold text-[#c86d44] tabular-nums">
                {pendingProducts}
              </span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-[#e6decb] shadow-xs">
              <span className="text-[10px] uppercase tracking-wider text-[#8a7f72] font-bold block">
                Pesanan Baru
              </span>
              <span className="font-serif text-2xl font-bold text-[#1e4535] tabular-nums">
                {newOrdersCount}
              </span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-[#e6decb] shadow-xs">
              <span className="text-[10px] uppercase tracking-wider text-[#8a7f72] font-bold block">
                Total Omset Selesai
              </span>
              <span className="font-serif text-lg sm:text-xl font-bold text-[#1e4535] tabular-nums truncate block">
                {formatRupiah(totalFinishedRevenue)}
              </span>
            </div>
          </div>

          {/* Quick Action Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Best Sellers */}
            <div className="bg-white rounded-lg border border-[#e6decb] p-5 shadow-xs space-y-3">
              <h2 className="font-serif text-base font-bold text-[#1e4535] pb-2 border-b border-[#f0ebd9]">
                5 Produk Paling Laris (Data Riil Transaksi)
              </h2>
              <div className="divide-y divide-[#f5f1e7] text-xs">
                {bestSellers.map((prod, idx) => (
                  <div key={prod.id} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-xs text-[#8a7f72]">0{idx + 1}.</span>
                      <div>
                        <span className="font-medium text-[#1c2420] block">{prod.nama_produk}</span>
                        <span className="text-[11px] text-[#8a7f72]">{prod.store_name}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-[#1e4535] tabular-nums block">
                        {formatRupiah(prod.harga)}
                      </span>
                      <span className="text-[10px] text-[#736859] tabular-nums">
                        Terjual {prod.terjual_count} pcs
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Approvals quick review */}
            <div className="bg-white rounded-lg border border-[#e6decb] p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#f0ebd9]">
                <h2 className="font-serif text-base font-bold text-[#1e4535]">
                  Kurasi Produk Menunggu Persetujuan ({pendingProducts})
                </h2>
                {pendingProducts > 0 && (
                  <button
                    onClick={() => {
                      setProductFilterStatus('menunggu_persetujuan');
                      setCurrentTab('produk');
                    }}
                    className="text-xs text-[#c86d44] hover:underline font-medium"
                  >
                    Buka Semua
                  </button>
                )}
              </div>

              {pendingProducts > 0 ? (
                <div className="divide-y divide-[#f5f1e7] text-xs">
                  {products
                    .filter((p) => p.status === 'menunggu_persetujuan')
                    .map((p) => (
                      <div key={p.id} className="py-2.5 flex items-center justify-between gap-3">
                        <div>
                          <span className="font-medium text-[#1c2420] block">{p.nama_produk}</span>
                          <span className="text-[11px] text-[#736859]">
                            {p.store_name} · {formatRupiah(p.harga)} · Stok {p.stok}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => updateProductStatus(p.id, 'aktif')}
                            className="px-2.5 py-1 bg-green-700 hover:bg-green-800 text-white rounded text-[11px] font-semibold flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" /> Setujui
                          </button>
                          <button
                            onClick={() => updateProductStatus(p.id, 'ditolak')}
                            className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[11px] font-semibold flex items-center gap-1"
                          >
                            <X className="w-3 h-3" /> Tolak
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-[#736859]">
                  Tidak ada produk antre kurasi saat ini. Seluruh produk telah diproses.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANAJEMEN PRODUK */}
      {currentTab === 'produk' && (
        <div className="bg-white rounded-lg border border-[#e6decb] shadow-xs overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f0ebd9]">
            <h2 className="font-serif text-lg font-bold text-[#1e4535]">
              Manajemen Produk & Kurasi Mutu
            </h2>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button
                onClick={() => setGuideModalOpen(true)}
                className="px-2.5 py-1 bg-[#faf8f5] hover:bg-[#efe8dc] text-[#1e4535] border border-[#d6cdbc] rounded text-[11px] font-medium flex items-center gap-1 transition-colors"
                title="Buka petunjuk memotret & upload foto"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#c86d44]" />
                <span>Petunjuk Foto Produk</span>
              </button>

              <div className="flex items-center gap-1">
                <span className="text-[#6b6255]">Filter:</span>
                <select
                  value={productFilterStatus}
                  onChange={(e) => setProductFilterStatus(e.target.value)}
                  className="border border-[#d6cdbc] rounded px-2 py-1 bg-white text-xs"
                >
                  <option value="all">Semua Status ({products.length})</option>
                  <option value="menunggu_persetujuan">Menunggu Persetujuan ({pendingProducts})</option>
                  <option value="aktif">Aktif ({activeProducts})</option>
                  <option value="nonaktif">Nonaktif</option>
                  <option value="ditolak">Ditolak</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#faf8f5] text-[#736859] border-b border-[#f0ebd9]">
                <tr>
                  <th className="p-3">Produk</th>
                  <th className="p-3">Etalase Penjual</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Harga</th>
                  <th className="p-3">Stok</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Aksi & Perbaikan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f1e7]">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#faf9f6]">
                    <td className="p-3 flex items-center gap-3">
                      <img
                        src={p.foto[0] || '/src/assets/images/product_batik_parungkuda_1793157773143.jpg'}
                        alt={p.nama_produk}
                        className="w-10 h-10 rounded object-cover border border-[#e6decb]"
                      />
                      <span className="font-medium text-[#1c2420]">{p.nama_produk}</span>
                    </td>
                    <td className="p-3 text-[#554b40]">{p.store_name}</td>
                    <td className="p-3 text-[#554b40]">{p.category_name}</td>
                    <td className="p-3 font-semibold text-[#1e4535] tabular-nums">
                      {formatRupiah(p.harga)}
                    </td>
                    <td className="p-3 tabular-nums">{p.stok} pcs</td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          p.status === 'aktif'
                            ? 'bg-green-100 text-green-800'
                            : p.status === 'menunggu_persetujuan'
                            ? 'bg-amber-100 text-amber-800'
                            : p.status === 'ditolak'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1 whitespace-nowrap">
                      {/* ICON EDIT / KOREKSI DATA PRODUK */}
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="px-2 py-1 bg-[#efe9dc] hover:bg-[#e2dacb] text-[#c86d44] rounded text-[10px] font-semibold inline-flex items-center gap-1 transition-colors"
                        title="Edit / Koreksi Data Produk"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      {p.status === 'menunggu_persetujuan' ? (
                        <>
                          <button
                            onClick={() => updateProductStatus(p.id, 'aktif')}
                            className="px-2 py-1 bg-green-700 hover:bg-green-800 text-white rounded text-[10px] font-semibold"
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() => updateProductStatus(p.id, 'ditolak')}
                            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-semibold"
                          >
                            Tolak
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() =>
                            updateProductStatus(p.id, p.status === 'aktif' ? 'nonaktif' : 'aktif')
                          }
                          className="px-2 py-1 bg-[#efe9dc] hover:bg-[#e2dacb] text-[#3d362f] rounded text-[10px] font-medium"
                        >
                          {p.status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (window.confirm('Hapus produk ini secara permanen?')) {
                            deleteProduct(p.id);
                          }
                        }}
                        className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded text-[10px] font-medium"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MANAJEMEN PESANAN */}
      {currentTab === 'pesanan' && (
        <div className="bg-white rounded-lg border border-[#e6decb] shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f0ebd9]">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#1e4535]">
                Daftar Seluruh Pesanan Pembeli ({orders.length})
              </h2>
              <p className="text-xs text-[#736859]">
                Kelola status pengiriman, verifikasi bukti transfer, dan unduh laporan transaksi.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={orderFilterStatus}
                onChange={(e) => setOrderFilterStatus(e.target.value)}
                className="border border-[#d6cdbc] rounded px-2.5 py-1 text-xs bg-white"
              >
                <option value="all">Semua Status Pesanan</option>
                <option value="menunggu_konfirmasi">Menunggu Konfirmasi</option>
                <option value="dikonfirmasi">Dikonfirmasi</option>
                <option value="diproses">Diproses</option>
                <option value="siap_dikirim">Siap Dikirim</option>
                <option value="dikirim">Dikirim</option>
                <option value="selesai">Selesai</option>
                <option value="dibatalkan">Dibatalkan</option>
              </select>

              <button
                onClick={() => exportOrdersToCSV(orders)}
                className="px-3 py-1.5 bg-[#1e4535] hover:bg-[#16382b] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                Ekspor CSV
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="border border-[#e6decb] rounded-lg p-4 space-y-3 bg-[#faf9f6]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#f0ebd9] text-xs">
                    <div>
                      <span className="font-mono font-bold text-sm text-[#1e4535]">
                        {order.order_number}
                      </span>
                      <span className="text-[#8a7f72] ml-2">
                        {formatTanggalIndo(order.created_at)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="text-[#6b6255]">Status Pesanan:</span>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="border border-[#d6cdbc] rounded px-2 py-0.5 text-xs bg-white font-medium"
                        >
                          <option value="menunggu_konfirmasi">Menunggu Konfirmasi</option>
                          <option value="dikonfirmasi">Dikonfirmasi</option>
                          <option value="diproses">Diproses Penjual</option>
                          <option value="siap_dikirim">Siap Dikirim</option>
                          <option value="dikirim">Dikirim / Ekspedisi</option>
                          <option value="selesai">Selesai</option>
                          <option value="dibatalkan">Dibatalkan</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-[#6b6255]">Status Bayar:</span>
                        <select
                          value={order.payment_status}
                          onChange={(e) => updatePaymentStatus(order.id, e.target.value as PaymentStatus)}
                          className="border border-[#d6cdbc] rounded px-2 py-0.5 text-xs bg-white font-medium"
                        >
                          <option value="belum_dibayar">Belum Dibayar</option>
                          <option value="menunggu_verifikasi">Menunggu Verifikasi</option>
                          <option value="lunas">Lunas / Terverifikasi</option>
                          <option value="dibatalkan">Dibatalkan</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-[#554b40]">
                    <div className="space-y-0.5">
                      <strong className="text-[#1c2420]">Penerima:</strong>
                      <p>{order.nama_pembeli} ({order.nomor_whatsapp})</p>
                      <p>{order.alamat_pengiriman}</p>
                    </div>

                    <div className="space-y-0.5">
                      <strong className="text-[#1c2420]">Barang Pesanan:</strong>
                      {order.items.map((it, idx) => (
                        <p key={idx} className="truncate">
                          • {it.nama_produk_snapshot} ({it.variant_snapshot}) x{it.quantity}
                        </p>
                      ))}
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Metode:</span>
                        <strong className="text-[#1e4535]">{order.payment_method}</strong>
                      </div>
                      <div className="flex justify-between text-sm font-bold font-serif text-[#1e4535]">
                        <span>Total:</span>
                        <span className="tabular-nums">{formatRupiah(order.total)}</span>
                      </div>
                      {order.payment_reference && (
                        <p className="text-[11px] text-green-700">
                          Ref: {order.payment_reference}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-[#736859]">
                Tidak ada pesanan yang sesuai dengan filter ini.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: MANAJEMEN ANGGOTA */}
      {currentTab === 'anggota' && (
        <div className="bg-white rounded-lg border border-[#e6decb] shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f0ebd9]">
            <h2 className="font-serif text-lg font-bold text-[#1e4535]">
              Daftar Anggota & Penjual Warga ({users.length})
            </h2>

            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-[#8a7f72] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                placeholder="Cari nama, email, whatsapp..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-[#d6cdbc] rounded focus:outline-hidden"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#faf8f5] text-[#736859] border-b border-[#f0ebd9]">
                <tr>
                  <th className="p-3">Nama Anggota</th>
                  <th className="p-3">Email & Kontak WA</th>
                  <th className="p-3">Domisili Warga</th>
                  <th className="p-3">Peran (Roles)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Otoritas Pengelola</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f1e7]">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#faf9f6]">
                    <td className="p-3 font-medium text-[#1c2420]">{u.nama}</td>
                    <td className="p-3 text-[#554b40]">
                      <div>{u.email}</div>
                      <div className="text-[11px] text-[#8a7f72]">{u.nomor_whatsapp}</div>
                    </td>
                    <td className="p-3 text-[#554b40] max-w-xs truncate">{u.alamat}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {u.roles.map((r) => (
                          <span
                            key={r}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                              r === 'admin'
                                ? 'bg-purple-100 text-purple-800'
                                : r === 'seller'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          u.status_member === 'aktif'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {u.status_member}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      {!u.roles.includes('seller') && (
                        <button
                          onClick={() => approveUserAsSeller(u.id)}
                          className="px-2 py-1 bg-[#1e4535] text-white rounded text-[10px] font-semibold hover:bg-[#16382b]"
                          title="Beri akses buka etalase UMKM"
                        >
                          + Setujui Jadi Penjual
                        </button>
                      )}

                      <button
                        onClick={() =>
                          toggleUserMemberStatus(
                            u.id,
                            u.status_member === 'aktif' ? 'ditangguhkan' : 'aktif'
                          )
                        }
                        className={`px-2 py-1 rounded text-[10px] font-medium ${
                          u.status_member === 'aktif'
                            ? 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                            : 'bg-green-50 text-green-800 hover:bg-green-100'
                        }`}
                      >
                        {u.status_member === 'aktif' ? 'Tangguhkan' : 'Aktifkan'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: KATEGORI PRODUK */}
      {currentTab === 'kategori' && (
        <div className="bg-white rounded-lg border border-[#e6decb] shadow-xs p-5 space-y-6 max-w-3xl">
          <div className="pb-3 border-b border-[#f0ebd9]">
            <h2 className="font-serif text-lg font-bold text-[#1e4535]">
              Kelola Kategori Fashion
            </h2>
            <p className="text-xs text-[#736859]">
              Kategori yang aktif akan muncul di navigasi filter toko online.
            </p>
          </div>

          {catNotice && (
            <div className="p-3 bg-green-50 text-green-800 text-xs rounded border border-green-200">
              {catNotice}
            </div>
          )}

          <form onSubmit={handleAddCategory} className="flex gap-2">
            <input
              type="text"
              required
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="Nama kategori baru (contoh: Pakaian Renang Muslimah)..."
              className="flex-1 px-3 py-2 text-xs border border-[#d6cdbc] rounded focus:outline-hidden"
            />
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#1e4535] hover:bg-[#16382b] rounded whitespace-nowrap"
            >
              + Tambah Kategori
            </button>
          </form>

          <div className="divide-y divide-[#f5f1e7] text-xs">
            {categories.map((cat, idx) => (
              <div key={cat.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-medium text-[#1c2420]">{cat.nama_kategori}</span>
                  <span className="text-[11px] text-[#8a7f72] ml-2">slug: /{cat.slug}</span>
                </div>
                <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-[10px] font-semibold">
                  {cat.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: PENGATURAN APLIKASI */}
      {currentTab === 'pengaturan' && (
        <form
          onSubmit={handleSaveSettings}
          className="bg-white rounded-lg border border-[#e6decb] shadow-xs p-6 space-y-4 max-w-2xl"
        >
          <div className="pb-2 border-b border-[#f0ebd9]">
            <h2 className="font-serif text-lg font-bold text-[#1e4535]">
              Pengaturan Marketplace & WhatsApp
            </h2>
            <p className="text-xs text-[#736859]">
              Nomor WhatsApp di bawah menjadi tujuan penerimaan pesan konfirmasi pesanan dari seluruh pembeli.
            </p>
          </div>

          {settingsNotice && (
            <div className="p-3 bg-green-50 text-green-800 text-xs rounded border border-green-200">
              {settingsNotice}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#383129] block">
              Nama Marketplace
            </label>
            <input
              type="text"
              required
              value={namaMarketplace}
              onChange={(e) => setNamaMarketplace(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#d6cdbc] rounded focus:outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#383129] block">
              Nomor WhatsApp Pengelola (Format 62... tanpa spasi/tanda hubung) <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={waPengelola}
              onChange={(e) => setWaPengelola(e.target.value)}
              placeholder="6281234567890"
              className="w-full px-3 py-2 text-xs border border-[#d6cdbc] rounded focus:outline-hidden font-mono"
            />
            <span className="text-[11px] text-[#8a7f72] block">
              Semua tombol &quot;Pesan via WhatsApp&quot; akan menargetkan nomor ini.
            </span>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#383129] block">
              Tarif Ongkir Standar Flat (Rupiah)
            </label>
            <input
              type="number"
              min={0}
              step={1000}
              value={ongkirFlat}
              onChange={(e) => setOngkirFlat(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs border border-[#d6cdbc] rounded focus:outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#383129] block">
              Alamat Sekretariat / Wilayah Layanan
            </label>
            <textarea
              rows={2}
              value={alamatKantor}
              onChange={(e) => setAlamatKantor(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#d6cdbc] rounded focus:outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#383129] block">
              Teks Promo Banner Landing Page
            </label>
            <input
              type="text"
              value={bannerPromo}
              onChange={(e) => setBannerPromo(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#d6cdbc] rounded focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-xs font-semibold text-white bg-[#1e4535] hover:bg-[#16382b] rounded transition-colors shadow-xs flex items-center justify-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            Simpan Pengaturan Marketplace
          </button>
        </form>
      )}

      {/* Edit Product Modal for Admin */}
      <EditProductModal
        product={editingProduct}
        isOpen={Boolean(editingProduct)}
        onClose={() => setEditingProduct(null)}
        isAdminEdit={true}
      />

      {/* Photo Guide Modal for Admin */}
      <PhotoGuideModal
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
      />
    </div>
  );
};
