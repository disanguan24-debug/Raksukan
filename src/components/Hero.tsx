import React from 'react';
import { ArrowRight, Search, ShieldCheck, Truck, Users } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Hero: React.FC = () => {
  const { setCurrentView, setAuthModalOpen, searchQuery, setSearchQuery } = useStore();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentView('katalog');
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f2ece1] via-[#faf8f5] to-[#faf8f5] border-b border-[#e6decb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#1e4535] bg-[#e4ded0]/80 px-3 py-1 rounded-sm border border-[#d6cdbc]">
              <span>Karya Warga Opat Parungkuda</span>
              <span aria-hidden="true">·</span>
              <span>Kabupaten Sukabumi</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1e4535] leading-tight tracking-tight text-balance">
              Belanja Fashion Lokal, Dukung UMKM Warga Opat Parungkuda.
            </h1>

            <p className="text-base sm:text-lg text-[#554b40] leading-relaxed max-w-2xl">
              Marketplace komunitas resmi warga RW 04 Parungkuda. Temukan batik asli,
              busana muslim syar’i, kemeja kasual, tas kriya, dan produk pakaian berkualitas
              langsung dari tangan pengrajin tetangga kita.
            </p>

            {/* Quick Search in Hero */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-lg">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#8a7f72] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari produk fashion warga..."
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#d6cdbc] rounded-md text-sm text-[#1c2420] focus:outline-hidden focus:border-[#1e4535] focus:ring-1 focus:ring-[#1e4535] shadow-xs"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-3 text-sm font-semibold text-white bg-[#1e4535] hover:bg-[#16382b] transition-colors rounded-md whitespace-nowrap shadow-xs"
              >
                Cari
              </button>
            </form>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setCurrentView('katalog')}
                className="px-6 py-3 text-sm font-semibold text-white bg-[#c86d44] hover:bg-[#b55e37] transition-colors rounded-md shadow-sm flex items-center gap-2"
              >
                <span>Mulai Belanja</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-6 py-3 text-sm font-semibold text-[#1e4535] bg-white hover:bg-[#f6f1e6] border border-[#d6cdbc] transition-colors rounded-md shadow-xs"
              >
                Gabung Menjadi Member
              </button>
            </div>

            {/* Trust points */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#e6decb] text-[#554b40]">
              <div className="flex items-center gap-2 text-xs">
                <Users className="w-4 h-4 text-[#1e4535] shrink-0" />
                <span>100% Produk Warga Lokal</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-[#1e4535] shrink-0" />
                <span>Terverifikasi Pengelola</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Truck className="w-4 h-4 text-[#1e4535] shrink-0" />
                <span>Bisa COD / Kirim Se-Indonesia</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-xl overflow-hidden shadow-xl border-4 border-white bg-[#efe8db] aspect-16/9 lg:aspect-4/3">
              <img
                src="/src/assets/images/hero_fashion_warga_1793157771730.jpg"
                alt="Koleksi Busana Kampoeng Raksukan Warga Opat Parungkuda"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-5">
                <div className="text-white space-y-1">
                  <div className="text-[11px] uppercase tracking-wider text-[#e2c17b] font-medium">
                    Koleksi Unggulan 2026
                  </div>
                  <div className="font-serif text-lg font-bold">
                    Batik & Busana Modern Warga Opat
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
