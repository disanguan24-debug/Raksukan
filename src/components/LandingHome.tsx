import React from 'react';
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Store as StoreIcon,
  MessageCircle,
  Award,
  Users,
  CheckCircle,
  Truck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatRupiah } from '../lib/formatters';
import { Hero } from './Hero';
import { ProductCard } from './ProductCard';

export const LandingHome: React.FC = () => {
  const {
    activeProducts,
    categories,
    setCurrentView,
    setSelectedCategory,
    setAuthModalOpen,
    settings,
  } = useStore();

  // Curator's picks / Featured
  const featuredProducts = activeProducts.filter((p) => p.is_featured).slice(0, 3);

  // Newest arrivals
  const newestProducts = [...activeProducts]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4);

  // Best sellers based on actual sales count
  const bestSellerProducts = [...activeProducts]
    .sort((a, b) => b.terjual_count - a.terjual_count)
    .slice(0, 3);

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Featured Categories Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-2 border-b border-[#e6decb]">
          <div>
            <span className="text-xs font-bold text-[#c86d44] uppercase tracking-wider block">
              Pilihan Ragam Busana
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#1e4535]">
              Kategori Busana UMKM
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setCurrentView('katalog');
            }}
            className="text-xs font-semibold text-[#1e4535] hover:text-[#c86d44] flex items-center gap-1 transition-colors"
          >
            Lihat Semua Kategori <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.slice(0, 10).map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setCurrentView('katalog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-3.5 bg-white rounded-lg border border-[#e6decb] hover:border-[#1e4535] hover:bg-[#faf8f4] text-left transition-all duration-200 group shadow-2xs"
            >
              <div className="text-xs font-semibold text-[#1c2420] group-hover:text-[#1e4535] line-clamp-1">
                {cat.nama_kategori}
              </div>
              <div className="text-[11px] text-[#8a7f72] mt-0.5 group-hover:text-[#c86d44]">
                Jelajahi Koleksi →
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Produk Pilihan Pengelola (Curated Collection) */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-2 border-b border-[#e6decb]">
            <div>
              <span className="text-xs font-bold text-[#c86d44] uppercase tracking-wider block">
                Karya Pilihan Terkurasi
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1e4535]">
                Produk Pilihan Pengelola
              </h2>
            </div>
            <p className="text-xs text-[#736859] max-w-md">
              Koleksi batik, busana muslim, dan aksesoris dengan bahan pilihan dan penilaian mutu terbaik.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Produk Terlaris (Berdasarkan Data Aktual) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-2 border-b border-[#e6decb]">
          <div>
            <span className="text-xs font-bold text-[#1e4535] uppercase tracking-wider block">
              Paling Diminati Pembeli
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#1e4535]">
              Produk Terlaris Warga
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('katalog')}
            className="text-xs font-semibold text-[#1e4535] hover:text-[#c86d44] flex items-center gap-1 transition-colors"
          >
            Buka Katalog Lengkap <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestSellerProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 5. Produk Terbaru */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-2 border-b border-[#e6decb]">
          <div>
            <span className="text-xs font-bold text-[#c86d44] uppercase tracking-wider block">
              Rilisan Anyar
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#1e4535]">
              Koleksi Busana Terbaru
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('katalog')}
            className="text-xs font-semibold text-[#1e4535] hover:text-[#c86d44] flex items-center gap-1 transition-colors"
          >
            Semua Produk Terbaru <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newestProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 6. Seller Invitation Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1e4535] text-white rounded-2xl p-8 sm:p-12 relative overflow-hidden shadow-lg border border-[#16382b]">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-block px-3 py-1 bg-[#e2c17b] text-[#16382b] font-bold text-xs uppercase tracking-wider rounded-sm">
              Ajakan Khusus Warga Opat Parungkuda
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug">
              Punya Karya Jahitan atau Kerajinan Fashion? Pasarkan Bersama Kami.
            </h2>
            <p className="text-sm text-[#f4efe6]/90 leading-relaxed">
              Daftarkan usaha konveksi rumahan, butik, atau karya jahit Anda ke marketplace komunitas.
              Dapatkan bantuan promosi, kemudahan pencatatan pesanan via WhatsApp, dan perluas jangkauan pasar hingga ke luar Sukabumi.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <button
                onClick={() => setCurrentView('seller')}
                className="px-6 py-3 text-xs sm:text-sm font-semibold text-[#16382b] bg-[#e2c17b] hover:bg-[#d8b56d] rounded-md transition-colors shadow-sm flex items-center gap-2"
              >
                <StoreIcon className="w-4 h-4" />
                <span>Buka Etalase UMKM Anda</span>
              </button>

              <a
                href={`https://wa.me/${settings.nomor_whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                  'Halo Pengelola Kampoeng Raksukan, saya warga Parungkuda ingin mendaftar sebagai penjual produk fashion:'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-md transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Konsultasi Penjual via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Community Trust & Testimonial Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl border border-[#e6decb] p-8 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1e4535]">
              Komitmen Kualitas & Dukungan Warga
            </h3>
            <p className="text-xs text-[#6b6255]">
              Suara pengalaman nyata pembeli dan pelaku UMKM di lingkungan Parungkuda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#554b40]">
            <div className="p-4 bg-[#faf8f5] rounded-lg border border-[#e6decb] space-y-2">
              <p className="italic leading-relaxed">
                &quot;Kemeja batiknya sangat adem, jahitannya rapi dan ada furingnya. Bangga bisa pakai produk buatan tetangga warga Opat sendiri.&quot;
              </p>
              <div className="font-semibold text-[#1e4535]">
                — Kang Ridwan Kamiludin, Warga RT 03 Parungkuda
              </div>
            </div>

            <div className="p-4 bg-[#faf8f5] rounded-lg border border-[#e6decb] space-y-2">
              <p className="italic leading-relaxed">
                &quot;Gamis syar’i pesanan saya langsung dikonfirmasi lewat WhatsApp. Pengiriman cepat dan ukuran pas banget sesuai konsultasi.&quot;
              </p>
              <div className="font-semibold text-[#1e4535]">
                — Ibu Dewi Sartika, Pelanggan Cibadak
              </div>
            </div>

            <div className="p-4 bg-[#faf8f5] rounded-lg border border-[#e6decb] space-y-2">
              <p className="italic leading-relaxed">
                &quot;Sebagai penjahit lokal, aplikasi ini sangat membantu saya terima pesanan tanpa harus pusing kelola website sendiri.&quot;
              </p>
              <div className="font-semibold text-[#1e4535]">
                — Mang Asep Mulyana, Pengrajin Batik Parungkuda
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
