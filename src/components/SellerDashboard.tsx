import React, { useState } from 'react';
import {
  Store as StoreIcon,
  Plus,
  Package,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  Upload,
  HelpCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatRupiah, formatTanggalIndo, getOrderStatusLabel } from '../lib/formatters';
import { Product, ProductVariant } from '../types';
import { EditProductModal } from './EditProductModal';
import { PhotoGuideModal } from './PhotoGuideModal';

export const SellerDashboard: React.FC = () => {
  const {
    currentUser,
    currentStore,
    registerOrUpdateStore,
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    sellerOrders,
    updateOrderStatus,
    isSeller,
    setCurrentView,
    switchDemoUser,
  } = useStore();

  // Tab
  const [activeTab, setActiveTab] = useState<'produk' | 'tambah' | 'pesanan' | 'profil'>('produk');

  // Edit and Guide modals state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [guideModalOpen, setGuideModalOpen] = useState(false);

  // Store profile form
  const [namaToko, setNamaToko] = useState(currentStore?.nama_toko || '');
  const [deskripsiToko, setDeskripsiToko] = useState(currentStore?.deskripsi || '');
  const [nomorKontak, setNomorKontak] = useState(currentStore?.nomor_kontak || currentUser?.nomor_whatsapp || '');
  const [alamatToko, setAlamatToko] = useState(currentStore?.alamat_toko || currentUser?.alamat || '');
  const [storeNotice, setStoreNotice] = useState('');

  // Add Product Form
  const [namaProduk, setNamaProduk] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [deskripsiProduk, setDeskripsiProduk] = useState('');
  const [harga, setHarga] = useState<number>(100000);
  const [stok, setStok] = useState<number>(10);
  const [ukuranInput, setUkuranInput] = useState('S, M, L, XL');
  const [warnaInput, setWarnaInput] = useState('Hitam, Putih, Terracotta');
  const [fotoUrl, setFotoUrl] = useState('');
  const [productNotice, setProductNotice] = useState('');

  // Seller's own products
  const myProducts = products.filter(
    (p) => currentStore && p.store_id === currentStore.id
  );

  // Sales total for this seller
  const completedSalesTotal = sellerOrders
    .filter((o) => o.status === 'selesai' || o.payment_status === 'lunas')
    .reduce((acc, order) => {
      const myItemsTotal = order.items
        .filter((i) => currentStore && i.store_id === currentStore.id)
        .reduce((sum, i) => sum + i.subtotal, 0);
      return acc + myItemsTotal;
    }, 0);

  const handleSaveStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaToko.trim()) return;
    registerOrUpdateStore({
      nama_toko: namaToko.trim(),
      deskripsi: deskripsiToko.trim(),
      nomor_kontak: nomorKontak.trim(),
      alamat_toko: alamatToko.trim(),
    });
    setStoreNotice('Informasi etalase toko UMKM berhasil diperbarui!');
    setTimeout(() => setStoreNotice(''), 3000);
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStore) {
      setProductNotice('Harap lengkapi profil toko terlebih dahulu.');
      return;
    }
    if (!namaProduk.trim() || harga <= 0 || stok < 0) {
      setProductNotice('Harap isi data produk dengan lengkap.');
      return;
    }

    const sizes = ukuranInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const colors = warnaInput
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const variants: ProductVariant[] = [];
    sizes.forEach((sz, idx) => {
      colors.forEach((col, cIdx) => {
        variants.push({
          id: `var-${Date.now()}-${idx}-${cIdx}`,
          product_id: '',
          ukuran: sz,
          warna: col,
          stok: Math.ceil(stok / (sizes.length * colors.length || 1)),
          harga_tambahan: 0,
        });
      });
    });

    const categoryObj = categories.find((c) => c.id === categoryId);

    addProduct({
      store_id: currentStore.id,
      store_name: currentStore.nama_toko,
      category_id: categoryId,
      category_name: categoryObj?.nama_kategori || 'Fashion',
      nama_produk: namaProduk.trim(),
      slug: namaProduk.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      deskripsi: deskripsiProduk.trim(),
      harga: Number(harga),
      stok: Number(stok),
      foto: fotoUrl ? [fotoUrl] : ['/src/assets/images/product_batik_parungkuda_1793157773143.jpg'],
      status: 'menunggu_persetujuan', // Requirement: new products require admin approval!
      is_featured: false,
      variants,
    });

    setProductNotice(
      'Produk berhasil diajukan! Status saat ini: "Menunggu Persetujuan Pengelola" untuk kurasi kualitas.'
    );
    setNamaProduk('');
    setDeskripsiProduk('');
    setFotoUrl('');
    setTimeout(() => {
      setProductNotice('');
      setActiveTab('produk');
    }, 2500);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setProductNotice('File harus berupa gambar (JPG, PNG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFotoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isSeller) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-[#e8f2ec] text-[#1e4535] rounded-full flex items-center justify-center mx-auto shadow-xs">
          <StoreIcon className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-bold text-[#1e4535]">Akses Khusus Penjual UMKM</h2>
          <p className="text-sm text-[#6b6255]">
            Halaman ini khusus untuk pelaku usaha UMKM warga Opat Parungkuda. Anda saat ini aktif sebagai{' '}
            <strong className="text-[#1e4535]">
              {currentUser ? `${currentUser.nama} (${currentUser.roles.join(', ')})` : 'Tamu / Warga Umum'}
            </strong>.
          </p>
          <p className="text-xs text-[#8a7f72]">
            Gunakan tombol simulasi peran di bilah atas navigasi untuk beralih ke peran Penjual UMKM jika Anda ingin menguji pengelolaan produk dan pesanan toko.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => switchDemoUser('seller')}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#1e4535] text-white rounded font-medium text-sm hover:bg-[#285c47] transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <StoreIcon className="w-4 h-4" />
            Aktifkan Peran Penjual (Mang Asep)
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
            <span className="p-1.5 bg-[#e8f2ec] text-[#1e4535] rounded">
              <StoreIcon className="w-5 h-5" />
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1e4535]">
              Dashboard Penjual UMKM
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#6b6255] mt-1">
            Etalase: <strong>{currentStore?.nama_toko || 'Toko Belum Dinamai'}</strong> · Pemilik: {currentUser?.nama}
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#efe8dc] p-1 rounded-md text-xs">
          <button
            onClick={() => setActiveTab('produk')}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              activeTab === 'produk' ? 'bg-white text-[#1e4535] shadow-xs' : 'text-[#6b6255]'
            }`}
          >
            Katalog Toko ({myProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('tambah')}
            className={`px-3 py-1.5 rounded font-medium transition-colors flex items-center gap-1 ${
              activeTab === 'tambah' ? 'bg-[#1e4535] text-white shadow-xs' : 'text-[#6b6255]'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            + Produk Baru
          </button>
          <button
            onClick={() => setActiveTab('pesanan')}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              activeTab === 'pesanan' ? 'bg-white text-[#1e4535] shadow-xs' : 'text-[#6b6255]'
            }`}
          >
            Pesanan Masuk ({sellerOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('profil')}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              activeTab === 'profil' ? 'bg-white text-[#1e4535] shadow-xs' : 'text-[#6b6255]'
            }`}
          >
            Profil Etalase
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-[#e6decb] shadow-xs space-y-1">
          <span className="text-[11px] text-[#8a7f72] uppercase font-bold tracking-wider">Total Produk</span>
          <div className="font-serif text-2xl font-bold text-[#1e4535] tabular-nums">
            {myProducts.length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[#e6decb] shadow-xs space-y-1">
          <span className="text-[11px] text-[#8a7f72] uppercase font-bold tracking-wider">Produk Aktif</span>
          <div className="font-serif text-2xl font-bold text-[#1e4535] tabular-nums">
            {myProducts.filter((p) => p.status === 'aktif').length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[#e6decb] shadow-xs space-y-1">
          <span className="text-[11px] text-[#8a7f72] uppercase font-bold tracking-wider">Menunggu Kurasi</span>
          <div className="font-serif text-2xl font-bold text-[#c86d44] tabular-nums">
            {myProducts.filter((p) => p.status === 'menunggu_persetujuan').length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[#e6decb] shadow-xs space-y-1">
          <span className="text-[11px] text-[#8a7f72] uppercase font-bold tracking-wider">Estimasi Omset</span>
          <div className="font-serif text-xl sm:text-2xl font-bold text-[#1e4535] tabular-nums">
            {formatRupiah(completedSalesTotal)}
          </div>
        </div>
      </div>

      {/* Tab: Produk Saya */}
      {activeTab === 'produk' && (
        <div className="bg-white rounded-lg border border-[#e6decb] overflow-hidden shadow-xs">
          <div className="p-4 border-b border-[#f0ebd9] flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-sm text-[#1e4535]">Daftar Produk Etalase Anda</h2>
              <p className="text-[11px] text-[#736859]">
                Klik ikon pensil (<span className="text-[#c86d44] font-bold">Edit</span>) untuk mengubah data produk yang keliru.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('tambah')}
              className="px-3 py-1.5 text-xs font-semibold bg-[#1e4535] text-white rounded hover:bg-[#16382b] flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Produk
            </button>
          </div>

          {myProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#faf8f5] text-[#736859] border-b border-[#f0ebd9]">
                  <tr>
                    <th className="p-3">Foto & Nama Produk</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Harga</th>
                    <th className="p-3">Stok</th>
                    <th className="p-3">Status Kurasi</th>
                    <th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f1e7]">
                  {myProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-[#faf9f6]">
                      <td className="p-3 flex items-center gap-3">
                        <img
                          src={p.foto[0] || '/src/assets/images/product_batik_parungkuda_1793157773143.jpg'}
                          alt={p.nama_produk}
                          className="w-10 h-10 rounded object-cover border border-[#e6decb]"
                        />
                        <div>
                          <span className="font-medium text-[#1c2420] block">{p.nama_produk}</span>
                          <span className="text-[11px] text-[#8a7f72]">Terjual: {p.terjual_count}</span>
                        </div>
                      </td>
                      <td className="p-3 text-[#554b40]">{p.category_name}</td>
                      <td className="p-3 font-semibold text-[#1e4535] tabular-nums">
                        {formatRupiah(p.harga)}
                      </td>
                      <td className="p-3 tabular-nums font-medium">
                        <span className={p.stok <= 0 ? 'text-red-600 font-bold' : ''}>
                          {p.stok} pcs
                        </span>
                      </td>
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
                          {p.status === 'aktif'
                            ? 'Aktif / Disetujui'
                            : p.status === 'menunggu_persetujuan'
                            ? 'Menunggu Persetujuan'
                            : p.status === 'ditolak'
                            ? 'Ditolak'
                            : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1 whitespace-nowrap">
                        {/* ICON EDIT PRODUK */}
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="p-1.5 hover:bg-[#efe8dc] rounded text-[#c86d44] transition-colors"
                          title="Edit & Perbaiki Data Produk"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() =>
                            updateProduct(p.id, {
                              status: p.status === 'aktif' ? 'nonaktif' : 'aktif',
                            })
                          }
                          className="p-1.5 hover:bg-[#efe8dc] rounded text-[#554b40] transition-colors"
                          title={p.status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                        >
                          {p.status === 'aktif' ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm('Yakin ingin menghapus produk ini?')) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 hover:bg-red-50 rounded text-red-600 transition-colors"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#736859]">
              Belum ada produk di etalase Anda. Klik &quot;+ Produk Baru&quot; untuk menambahkan katalog.
            </div>
          )}
        </div>
      )}

      {/* Tab: Tambah Produk Baru */}
      {activeTab === 'tambah' && (
        <form
          onSubmit={handleAddProductSubmit}
          className="bg-white rounded-lg border border-[#e6decb] p-6 space-y-4 shadow-xs max-w-2xl"
        >
          <h2 className="font-serif text-lg font-bold text-[#1e4535] pb-2 border-b border-[#f0ebd9]">
            Formulir Pengajuan Produk Baru
          </h2>

          {productNotice && (
            <div className="p-3 bg-amber-50 text-amber-800 text-xs rounded border border-amber-200">
              {productNotice}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#383129] block">
              Nama Produk Fashion <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={namaProduk}
              onChange={(e) => setNamaProduk(e.target.value)}
              placeholder="Contoh: Kemeja Batik Parungkuda Motif Daun Teh"
              className="w-full px-3 py-2 text-xs border border-[#d6cdbc] rounded focus:outline-hidden focus:border-[#1e4535]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#383129] block">Kategori</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#d6cdbc] rounded focus:outline-hidden focus:border-[#1e4535] bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nama_kategori}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#383129] block">
                Harga (Rupiah) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min={1000}
                step={1000}
                value={harga}
                onChange={(e) => setHarga(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-[#d6cdbc] rounded focus:outline-hidden focus:border-[#1e4535]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#383129] block">Stok Awal</label>
              <input
                type="number"
                required
                min={0}
                value={stok}
                onChange={(e) => setStok(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-[#d6cdbc] rounded focus:outline-hidden focus:border-[#1e4535]"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-[#383129] block">
                Pilihan Ukuran (Pisahkan dengan koma)
              </label>
              <input
                type="text"
                value={ukuranInput}
                onChange={(e) => setUkuranInput(e.target.value)}
                placeholder="S, M, L, XL, XXL"
                className="w-full px-3 py-2 text-xs border border-[#d6cdbc] rounded focus:outline-hidden focus:border-[#1e4535]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#383129] block">
              Pilihan Warna (Pisahkan dengan koma)
            </label>
            <input
              type="text"
              value={warnaInput}
              onChange={(e) => setWarnaInput(e.target.value)}
              placeholder="Hijau Daun, Hitam, Cokelat Terracotta"
              className="w-full px-3 py-2 text-xs border border-[#d6cdbc] rounded focus:outline-hidden focus:border-[#1e4535]"
            />
          </div>

          {/* Foto Produk Section */}
          <div className="space-y-2 pt-2 border-t border-[#f0ebd9]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#383129] block">
                Foto Produk Fashion
              </label>
              <button
                type="button"
                onClick={() => setGuideModalOpen(true)}
                className="text-xs font-semibold text-[#1e4535] hover:text-[#c86d44] flex items-center gap-1 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Petunjuk Menambah Foto Sendiri</span>
              </button>
            </div>

            {/* Live Preview & Upload Button */}
            <div className="flex items-center gap-4 p-3 bg-[#faf8f5] rounded-lg border border-[#e6decb]">
              <div className="w-20 h-20 rounded bg-white overflow-hidden border border-[#d6cdbc] shrink-0 flex items-center justify-center">
                {fotoUrl ? (
                  <img
                    src={fotoUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <ImageIcon className="w-7 h-7 text-[#8a7f72]" />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1e4535] text-white rounded text-xs font-semibold hover:bg-[#16382b] cursor-pointer transition-colors shadow-2xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Pilih File Foto dari HP / Laptop</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {fotoUrl && (
                  <button
                    type="button"
                    onClick={() => setFotoUrl('')}
                    className="text-[11px] text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Hapus Foto Saat Ini
                  </button>
                )}
                <p className="text-[11px] text-[#736859]">
                  Bisa langsung jepret atau pilih dari galeri ponsel (JPG/PNG &lt; 5MB).
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-[#736859] block">
                Atau masukkan link URL Foto (Google Drive / Supabase Storage / dsb):
              </span>
              <input
                type="text"
                value={fotoUrl}
                onChange={(e) => setFotoUrl(e.target.value)}
                placeholder="https://... atau path aset lokal"
                className="w-full px-3 py-1.5 text-xs border border-[#d6cdbc] rounded focus:outline-hidden font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#383129] block">
              Deskripsi Produk & Bahan <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={deskripsiProduk}
              onChange={(e) => setDeskripsiProduk(e.target.value)}
              placeholder="Jelaskan jenis kain, kenyamanan, jahitan furing, petunjuk perawatan..."
              className="w-full px-3 py-2 text-xs border border-[#d6cdbc] rounded focus:outline-hidden focus:border-[#1e4535]"
            />
          </div>

          <p className="text-[11px] text-[#736859]">
            Catatan Keamanan & Kualitas: Produk baru berstatus <em>&quot;Menunggu Persetujuan&quot;</em> dan
            baru akan tayang publik setelah diverifikasi oleh tim pengelola komunitas.
          </p>

          <button
            type="submit"
            className="w-full py-2.5 text-xs font-semibold text-white bg-[#1e4535] hover:bg-[#16382b] rounded transition-colors shadow-xs"
          >
            Ajukan Produk ke Pengelola
          </button>
        </form>
      )}

      {/* Tab: Pesanan Masuk Penjual */}
      {activeTab === 'pesanan' && (
        <div className="bg-white rounded-lg border border-[#e6decb] overflow-hidden shadow-xs">
          <div className="p-4 border-b border-[#f0ebd9]">
            <h2 className="font-semibold text-sm text-[#1e4535]">
              Daftar Pesanan Terkait Produk Toko Anda
            </h2>
          </div>

          {sellerOrders.length > 0 ? (
            <div className="divide-y divide-[#f5f1e7]">
              {sellerOrders.map((order) => (
                <div key={order.id} className="p-4 sm:p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-mono font-bold text-sm text-[#1e4535]">
                        {order.order_number}
                      </span>
                      <span className="text-xs text-[#8a7f72] ml-2">
                        {formatTanggalIndo(order.created_at)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#6b6255]">Ubah Status:</span>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                        className="text-xs bg-[#faf8f5] border border-[#d6cdbc] rounded px-2 py-1 font-medium"
                      >
                        <option value="menunggu_konfirmasi">Menunggu Konfirmasi</option>
                        <option value="dikonfirmasi">Dikonfirmasi</option>
                        <option value="diproses">Sedang Diproses</option>
                        <option value="siap_dikirim">Siap Dikirim</option>
                        <option value="dikirim">Sudah Dikirim</option>
                        <option value="selesai">Selesai</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-xs text-[#554b40] bg-[#faf8f5] p-3 rounded space-y-1">
                    <p>
                      <strong>Pembeli:</strong> {order.nama_pembeli} ({order.nomor_whatsapp})
                    </p>
                    <p>
                      <strong>Alamat:</strong> {order.alamat_pengiriman}
                    </p>
                    {order.catatan && (
                      <p>
                        <strong>Catatan:</strong> {order.catatan}
                      </p>
                    )}
                  </div>

                  <div className="text-xs space-y-1">
                    <strong className="text-[#1c2420]">Item Toko Ini:</strong>
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-[#554b40]">
                        <span>
                          {it.nama_produk_snapshot} ({it.variant_snapshot}) x {it.quantity}
                        </span>
                        <span className="tabular-nums font-semibold">{formatRupiah(it.subtotal)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#736859]">
              Belum ada pesanan masuk untuk produk toko Anda saat ini.
            </div>
          )}
        </div>
      )}

      {/* Tab: Profil Toko */}
      {activeTab === 'profil' && (
        <form
          onSubmit={handleSaveStore}
          className="bg-white rounded-lg border border-[#e6decb] p-6 space-y-4 shadow-xs max-w-xl"
        >
          <h2 className="font-serif text-lg font-bold text-[#1e4535] pb-2 border-b border-[#f0ebd9]">
            Pengaturan Toko & Etalase Warga
          </h2>

          {storeNotice && (
            <div className="p-3 bg-green-50 text-green-800 text-xs rounded border border-green-200">
              {storeNotice}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#383129] block">Nama Toko UMKM</label>
            <input
              type="text"
              required
              value={namaToko}
              onChange={(e) => setNamaToko(e.target.value)}
              placeholder="Contoh: Rumah Batik Parungkuda"
              className="w-full px-3 py-2 text-xs border border-[#d6cdbc] rounded focus:outline-hidden focus:border-[#1e4535]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#383129] block">Deskripsi Singkat</label>
            <textarea
              rows={3}
              value={deskripsiToko}
              onChange={(e) => setDeskripsiToko(e.target.value)}
              placeholder="Ceritakan keunggulan jahitan, bahan lokal, atau karya khas..."
              className="w-full px-3 py-2 text-xs border border-[#d6cdbc] rounded focus:outline-hidden focus:border-[#1e4535]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#383129] block">Nomor WhatsApp Toko</label>
            <input
              type="tel"
              value={nomorKontak}
              onChange={(e) => setNomorKontak(e.target.value)}
              placeholder="081234567890"
              className="w-full px-3 py-2 text-xs border border-[#d6cdbc] rounded focus:outline-hidden focus:border-[#1e4535]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#383129] block">Alamat / Lokasi Rumah Pengrajin</label>
            <textarea
              rows={2}
              value={alamatToko}
              onChange={(e) => setAlamatToko(e.target.value)}
              placeholder="RT/RW Parungkuda, Sukabumi..."
              className="w-full px-3 py-2 text-xs border border-[#d6cdbc] rounded focus:outline-hidden focus:border-[#1e4535]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-xs font-semibold text-white bg-[#1e4535] hover:bg-[#16382b] rounded transition-colors shadow-xs"
          >
            Simpan Perubahan Profil Toko
          </button>
        </form>
      )}

      {/* Edit Product Modal */}
      <EditProductModal
        product={editingProduct}
        isOpen={Boolean(editingProduct)}
        onClose={() => setEditingProduct(null)}
      />

      {/* Photo Guide Modal */}
      <PhotoGuideModal
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
      />
    </div>
  );
};
