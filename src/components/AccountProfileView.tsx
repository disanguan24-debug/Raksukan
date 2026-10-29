import React, { useState } from 'react';
import {
  User,
  Heart,
  Package,
  Store as StoreIcon,
  Shield,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Eye,
  EyeOff,
  KeyRound,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatRupiah, formatTanggalIndo } from '../lib/formatters';
import { ProductCard } from './ProductCard';

export const AccountProfileView: React.FC = () => {
  const {
    currentUser,
    updateUserProfile,
    wishlist,
    products,
    buyerOrders,
    setCurrentView,
    setAuthModalOpen,
    registerOrUpdateStore,
    isSeller,
    isAdmin,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'profil' | 'favorit' | 'pesanan'>('profil');

  // Edit profile form state
  const [nama, setNama] = useState(currentUser?.nama || '');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [whatsapp, setWhatsapp] = useState(currentUser?.nomor_whatsapp || '');
  const [alamat, setAlamat] = useState(currentUser?.alamat || '');
  const [password, setPassword] = useState(currentUser?.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState('');

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#f4efe6] text-[#1e4535] flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#1e4535]">
          Akses Akun Member
        </h2>
        <p className="text-xs sm:text-sm text-[#6b6255]">
          Silakan masuk atau daftar menjadi member Kampoeng Raksukan untuk melihat riwayat belanja, produk favorit, dan etalase UMKM.
        </p>
        <button
          onClick={() => setAuthModalOpen(true)}
          className="px-6 py-2.5 text-xs font-semibold text-white bg-[#1e4535] hover:bg-[#16382b] rounded-md transition-colors cursor-pointer shadow-xs"
        >
          Masuk / Login Akun
        </button>
      </div>
    );
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      nama: nama.trim(),
      username: username.trim(),
      password: password,
      nomor_whatsapp: whatsapp.trim(),
      alamat: alamat.trim(),
    });
    setNotice('Data profil & kredensial login berhasil diperbarui!');
    setTimeout(() => setNotice(''), 2500);
  };

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg border border-[#e6decb] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#1e4535] text-[#e2c17b] font-serif font-bold text-xl flex items-center justify-center shrink-0 shadow-xs">
            {currentUser.nama.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#1e4535]">
                {currentUser.nama}
              </h1>

              {/* Role Badges */}
              {currentUser.roles.includes('admin') && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1e4535] text-[#e2c17b] shadow-2xs">
                  👑 Pengelola (Admin)
                </span>
              )}
              {currentUser.roles.includes('seller') && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#c86d44] text-white shadow-2xs">
                  🏪 Penjual UMKM
                </span>
              )}
              {currentUser.roles.includes('member') && !currentUser.roles.includes('admin') && !currentUser.roles.includes('seller') && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#2c5282] text-white shadow-2xs">
                  🛍️ Member Warga
                </span>
              )}

              <span
                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  currentUser.status_member === 'aktif'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {currentUser.status_member === 'aktif' ? 'Aktif' : 'Ditangguhkan'}
              </span>
            </div>

            <p className="text-xs text-[#6b6255] mt-1 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[#1e4535] bg-[#f0ebd9] px-1.5 py-0.5 rounded font-medium">
                @{currentUser.username || 'user'}
              </span>
              <span>· {currentUser.email}</span>
              <span>· Terdaftar {formatTanggalIndo(currentUser.created_at)}</span>
            </p>
          </div>
        </div>

        {/* Action Button for Seller / Role Switch */}
        <div className="flex flex-wrap items-center gap-2">
          {isSeller ? (
            <button
              onClick={() => setCurrentView('seller')}
              className="px-4 py-2 text-xs font-semibold text-[#c86d44] bg-[#faf0ea] hover:bg-[#f3dfd4] rounded border border-[#f0c8b4] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <StoreIcon className="w-4 h-4" />
              Kelola Toko UMKM
            </button>
          ) : (
            <button
              onClick={() => {
                registerOrUpdateStore({
                  nama_toko: `Toko Fashion ${currentUser.nama}`,
                  deskripsi: 'Menjual produk busana lokal Parungkuda',
                  nomor_kontak: currentUser.nomor_whatsapp,
                  alamat_toko: currentUser.alamat,
                });
                setCurrentView('seller');
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#c86d44] hover:bg-[#b05830] rounded shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <StoreIcon className="w-4 h-4" />
              Buka Etalase Toko Warga
            </button>
          )}

          <button
            onClick={() => setAuthModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-[#1e4535] bg-[#faf8f5] hover:bg-[#efe8dc] rounded border border-[#ded5c2] transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Buka dialog autentikasi untuk login ke peran lain"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#c86d44]" />
            Ganti Akun
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#e6decb] text-xs font-semibold gap-2">
        <button
          onClick={() => setActiveTab('profil')}
          className={`py-2 px-4 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'profil'
              ? 'border-[#1e4535] text-[#1e4535]'
              : 'border-transparent text-[#736859] hover:text-[#1e4535]'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          Data Profil & Akun
        </button>

        <button
          onClick={() => setActiveTab('favorit')}
          className={`py-2 px-4 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'favorit'
              ? 'border-[#1e4535] text-[#1e4535]'
              : 'border-transparent text-[#736859] hover:text-[#1e4535]'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          Favorit ({wishlist.length})
        </button>

        <button
          onClick={() => setActiveTab('pesanan')}
          className={`py-2 px-4 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'pesanan'
              ? 'border-[#1e4535] text-[#1e4535]'
              : 'border-transparent text-[#736859] hover:text-[#1e4535]'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          Riwayat Pesanan ({buyerOrders.length})
        </button>
      </div>

      {/* TAB: DATA PROFIL */}
      {activeTab === 'profil' && (
        <form
          onSubmit={handleUpdate}
          className="bg-white rounded-lg border border-[#e6decb] p-6 space-y-4 max-w-xl shadow-xs"
        >
          <h2 className="font-serif text-base font-bold text-[#1e4535] pb-2 border-b border-[#f0ebd9] flex items-center justify-between">
            <span>Perbarui Biodata & Kredensial Akun</span>
            <span className="text-[10px] text-[#8a7f72] font-sans font-normal">
              Peran: {currentUser.roles.join(', ')}
            </span>
          </h2>

          {notice && (
            <div className="p-3 bg-green-50 text-green-800 text-xs rounded border border-green-200">
              {notice}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#383129] block">Nama Lengkap</label>
              <input
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#d6cdbc] rounded focus:outline-hidden focus:border-[#1e4535]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#383129] block">Username Login</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                className="w-full px-3 py-2 text-xs border border-[#d6cdbc] rounded focus:outline-hidden focus:border-[#1e4535]"
              />
            </div>
          </div>

          {/* Password with Eye Icon */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#383129]">Password Akun</label>
              <span className="text-[10px] text-[#8a7f72]">Klik icon mata untuk memeriksa password</span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-3 pr-10 py-2 text-xs border border-[#d6cdbc] rounded focus:outline-hidden focus:border-[#1e4535]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8a7f72] hover:text-[#1e4535] cursor-pointer"
                title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#383129] block">Nomor WhatsApp</label>
            <input
              type="tel"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#d6cdbc] rounded focus:outline-hidden focus:border-[#1e4535]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#383129] block">
              Alamat Domisili Parungkuda
            </label>
            <textarea
              rows={3}
              required
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#d6cdbc] rounded focus:outline-hidden focus:border-[#1e4535]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-xs font-semibold text-white bg-[#1e4535] hover:bg-[#16382b] rounded transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            Simpan Perubahan
          </button>
        </form>
      )}

      {/* TAB: PRODUK FAVORIT */}
      {activeTab === 'favorit' && (
        <div>
          {wishlistedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-[#e6decb] p-8 text-center text-xs text-[#736859]">
              Belum ada produk favorit yang disimpan. Klik ikon hati pada kartu produk untuk menambahkan ke daftar ini.
            </div>
          )}
        </div>
      )}

      {/* TAB: RIWAYAT PESANAN */}
      {activeTab === 'pesanan' && (
        <div className="space-y-3">
          {buyerOrders.length > 0 ? (
            buyerOrders.map((o) => (
              <div
                key={o.id}
                className="bg-white rounded-lg border border-[#e6decb] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-[#1e4535]">{o.order_number}</span>
                  <span className="text-[#8a7f72] ml-2">{formatTanggalIndo(o.created_at)}</span>
                  <div className="text-[11px] text-[#554b40] mt-1">
                    {o.items.map((i) => `${i.nama_produk_snapshot} (${i.quantity}x)`).join(', ')}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#1e4535]">{formatRupiah(o.total)}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#e8f2ec] text-[#1e4535]">
                    {o.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg border border-[#e6decb] p-8 text-center text-xs text-[#736859]">
              Belum ada riwayat pesanan.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
