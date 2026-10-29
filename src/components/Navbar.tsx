import React from 'react';
import {
  ShoppingBag,
  User,
  Shield,
  Store as StoreIcon,
  Search,
  Heart,
  LogIn,
  LogOut,
  Sparkles,
  CheckCircle2,
  X,
  KeyRound,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatRupiah } from '../lib/formatters';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cartCount,
    cartSubtotal,
    currentUser,
    isAdmin,
    isSeller,
    roleSwitchNotice,
    setRoleSwitchNotice,
    switchDemoUser,
    setAuthModalOpen,
    logoutUser,
    settings,
    wishlist,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const isCurrentAdmin = Boolean(currentUser && isAdmin);
  const isCurrentSeller = Boolean(currentUser && isSeller && !isAdmin);
  const isCurrentMember = Boolean(currentUser && !isAdmin && !isSeller);
  const isCurrentGuest = Boolean(!currentUser);

  return (
    <header className="sticky top-0 z-40 bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#e6decb] shadow-xs">
      {/* Test & Demo Role Switcher Bar */}
      <div className="bg-[#1e4535] text-white text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-[#16382b]">
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          <span className="text-[#e2c17b] font-bold flex items-center gap-1.5 text-xs">
            <Sparkles className="w-4 h-4 text-[#e2c17b]" />
            Uji Coba Peran:
          </span>

          <button
            type="button"
            onClick={() => switchDemoUser('admin')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
              isCurrentAdmin
                ? 'bg-[#e2c17b] text-[#16382b] shadow-xs ring-2 ring-white/40'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            Pengelola (Admin)
          </button>

          <button
            type="button"
            onClick={() => switchDemoUser('seller')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
              isCurrentSeller
                ? 'bg-[#e2c17b] text-[#16382b] shadow-xs ring-2 ring-white/40'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            Penjual UMKM (Seller)
          </button>

          <button
            type="button"
            onClick={() => switchDemoUser('member')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
              isCurrentMember
                ? 'bg-[#e2c17b] text-[#16382b] font-bold shadow-xs ring-2 ring-white/40'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            Warga / Pembeli (Member)
          </button>

          <button
            type="button"
            onClick={() => switchDemoUser('guest')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
              isCurrentGuest
                ? 'bg-[#e2c17b] text-[#16382b] shadow-xs ring-2 ring-white/40'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            Tamu / Umum (Guest)
          </button>

          <button
            type="button"
            onClick={() => setAuthModalOpen(true)}
            className="px-2.5 py-1 rounded text-xs font-semibold bg-[#e2c17b] text-[#16382b] hover:bg-[#ebd299] transition-all cursor-pointer flex items-center gap-1 shadow-xs ml-1.5"
            title="Buka dialog autentikasi login dengan username & password"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Login User & Password</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#faf8f5]/90">
          <span className="hidden sm:inline">Peran Aktif:</span>
          <span className="font-semibold px-2 py-0.5 bg-black/30 rounded text-[#e2c17b]">
            {isCurrentAdmin
              ? '👑 Pengelola (Kang Hendra)'
              : isCurrentSeller
              ? '🏪 Penjual UMKM (Mang Asep)'
              : isCurrentMember
              ? '🛍️ Member Warga (Siti Nurhaliza)'
              : '👀 Tamu (Pengunjung Umum)'}
          </span>
        </div>
      </div>

      {/* Role Switch Feedback Toast */}
      {roleSwitchNotice && (
        <div className="bg-[#e8f2ec] text-[#1e4535] border-b border-[#c2ded0] px-4 py-2 text-xs flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#1e4535] shrink-0" />
            <span>{roleSwitchNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setRoleSwitchNotice(null)}
            className="p-1 hover:bg-[#d6e8dc] rounded text-[#1e4535] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Top Bar Contract: 3 Zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => {
            setCurrentView('beranda');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-left group flex items-center gap-2.5 whitespace-nowrap shrink-0 focus:outline-hidden"
        >
          <div className="w-9 h-9 rounded-lg bg-[#1e4535] text-[#e2c17b] flex items-center justify-center font-serif text-lg font-bold shadow-xs">
            KR
          </div>
          <div>
            <span className="block font-serif text-base sm:text-lg font-bold text-[#1e4535] leading-tight tracking-tight group-hover:text-[#c86d44] transition-colors">
              Kampoeng Raksukan
            </span>
            <span className="block text-[10px] uppercase tracking-wider text-[#6b6255] font-medium">
              Warga Opat Parungkuda
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (single line, clean text) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#463e35]">
          <button
            onClick={() => setCurrentView('beranda')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentView === 'beranda'
                ? 'text-[#1e4535] font-semibold border-b-2 border-[#1e4535]'
                : 'hover:text-[#1e4535]'
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => setCurrentView('katalog')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentView === 'katalog'
                ? 'text-[#1e4535] font-semibold border-b-2 border-[#1e4535]'
                : 'hover:text-[#1e4535]'
            }`}
          >
            Katalog Produk
          </button>
          <button
            onClick={() => setCurrentView('pesanan')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentView === 'pesanan'
                ? 'text-[#1e4535] font-semibold border-b-2 border-[#1e4535]'
                : 'hover:text-[#1e4535]'
            }`}
          >
            Lacak Pesanan
          </button>

          {isSeller && (
            <button
              onClick={() => setCurrentView('seller')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
                currentView === 'seller'
                  ? 'text-[#c86d44] font-semibold border-b-2 border-[#c86d44]'
                  : 'text-[#c86d44] hover:text-[#a85530]'
              }`}
            >
              <StoreIcon className="w-4 h-4" />
              Toko UMKM
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => setCurrentView('admin')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
                currentView === 'admin'
                  ? 'text-[#1e4535] font-semibold border-b-2 border-[#1e4535]'
                  : 'text-[#1e4535] hover:text-[#16382b]'
              }`}
            >
              <Shield className="w-4 h-4" />
              Dashboard Admin
            </button>
          )}
        </nav>

        {/* Zone 3: Primary Actions (Search bar on desktop, Wishlist, Cart & Auth) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick search input */}
          <div className="hidden lg:flex items-center relative">
            <Search className="w-4 h-4 text-[#8a7f72] absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (currentView !== 'katalog') setCurrentView('katalog');
              }}
              placeholder="Cari baju, batik, gamis..."
              className="pl-9 pr-3 py-1.5 text-xs bg-white border border-[#e6decb] rounded-md focus:outline-hidden focus:border-[#1e4535] w-48 text-[#1c2420] transition-all focus:w-60"
            />
          </div>

          {/* Cart Button */}
          <button
            onClick={() => setCurrentView('keranjang')}
            className="relative p-2 text-[#1e4535] hover:text-[#c86d44] transition-colors rounded-lg hover:bg-[#efe9dc] flex items-center gap-2"
            title="Keranjang Belanja"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#c86d44] text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center tabular-nums shadow-xs">
                {cartCount}
              </span>
            )}
            <span className="hidden xl:inline text-xs font-semibold text-[#1e4535]">
              {formatRupiah(cartSubtotal)}
            </span>
          </button>

          {/* Auth Button */}
          {currentUser ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentView('akun')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1e4535] bg-white border border-[#ded5c2] rounded-md hover:bg-[#f6f2e9] transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#1e4535]" />
                <span className="max-w-[100px] truncate">{currentUser.nama.split(' ')[0]}</span>
              </button>
              <button
                onClick={() => setAuthModalOpen(true)}
                className="p-1.5 text-[#554b40] hover:text-[#1e4535] hover:bg-[#efe9dc] transition-colors rounded-md cursor-pointer"
                title="Ganti Akun / Login Peran Lain"
              >
                <KeyRound className="w-4 h-4" />
              </button>
              <button
                onClick={logoutUser}
                className="p-1.5 text-[#8a7f72] hover:text-[#c86d44] transition-colors rounded-md cursor-pointer"
                title="Keluar"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#1e4535] rounded-md hover:bg-[#16382b] transition-colors whitespace-nowrap shrink-0 shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              Masuk / Daftar
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
