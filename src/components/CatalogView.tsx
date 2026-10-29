import React, { useMemo, useState } from 'react';
import { Filter, RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

type SortOption = 'terbaru' | 'harga_rendah' | 'harga_tinggi' | 'terlaris';

export const CatalogView: React.FC = () => {
  const { activeProducts, categories, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } =
    useStore();

  const [sortBy, setSortBy] = useState<SortOption>('terbaru');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(500000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return activeProducts
      .filter((product) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = product.nama_produk.toLowerCase().includes(q);
          const matchDesc = product.deskripsi.toLowerCase().includes(q);
          const matchStore = product.store_name?.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchStore) return false;
        }

        // Category filter
        if (selectedCategory !== 'all') {
          if (product.category_id !== selectedCategory) return false;
        }

        // Stock filter
        if (inStockOnly && product.stok <= 0) return false;

        // Price filter
        if (product.harga > maxPrice) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'harga_rendah') return a.harga - b.harga;
        if (sortBy === 'harga_tinggi') return b.harga - a.harga;
        if (sortBy === 'terlaris') return b.terjual_count - a.terjual_count;
        // Default terbaru
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [activeProducts, searchQuery, selectedCategory, inStockOnly, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setInStockOnly(false);
    setMaxPrice(500000);
    setSortBy('terbaru');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Title */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#e6decb]">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1e4535]">
            Katalog Fashion Warga Opat
          </h1>
          <p className="text-xs sm:text-sm text-[#6b6255] mt-1">
            Produk UMKM asli Parungkuda, Kabupaten Sukabumi yang telah terverifikasi pengelola.
          </p>
        </div>

        {/* Sorting & Filter toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#6b6255] whitespace-nowrap">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-white border border-[#d6cdbc] text-xs rounded-md px-2.5 py-1.5 text-[#1c2420] focus:outline-hidden focus:border-[#1e4535]"
            >
              <option value="terbaru">Terbaru</option>
              <option value="terlaris">Paling Laris</option>
              <option value="harga_rendah">Harga Terendah</option>
              <option value="harga_tinggi">Harga Tertinggi</option>
            </select>
          </div>

          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1e4535] bg-white border border-[#d6cdbc] rounded-md"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside
          className={`${
            mobileFilterOpen ? 'block' : 'hidden md:block'
          } md:col-span-1 space-y-6 bg-white p-5 rounded-lg border border-[#e6decb] h-fit`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#f0ebd9]">
            <h2 className="text-sm font-bold text-[#1e4535] flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#c86d44]" />
              Filter Produk
            </h2>
            <button
              onClick={handleResetFilters}
              className="text-xs text-[#8a7f72] hover:text-[#c86d44] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Search Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#383129] block">Pencarian</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#8a7f72] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nama atau jenis pakaian..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-[#d6cdbc] rounded focus:outline-hidden focus:border-[#1e4535]"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#383129] block">Kategori</label>
            <div className="space-y-1 max-h-56 overflow-y-auto pr-1 text-xs">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-2.5 py-1.5 rounded transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-[#1e4535] text-white font-semibold'
                    : 'text-[#4d443b] hover:bg-[#f6f2e8]'
                }`}
              >
                Semua Kategori ({activeProducts.length})
              </button>
              {categories.map((cat) => {
                const count = activeProducts.filter((p) => p.category_id === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-[#1e4535] text-white font-semibold'
                        : 'text-[#4d443b] hover:bg-[#f6f2e8]'
                    }`}
                  >
                    <span className="truncate">{cat.nama_kategori}</span>
                    <span className="text-[11px] opacity-75 tabular-nums">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-2 pt-2 border-t border-[#f0ebd9]">
            <label className="text-xs font-semibold text-[#383129] block">Ketersediaan Stok</label>
            <label className="flex items-center gap-2 text-xs text-[#4d443b] cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-[#d6cdbc] text-[#1e4535] focus:ring-0"
              />
              <span>Hanya tampilkan stok ready</span>
            </label>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 pt-2 border-t border-[#f0ebd9]">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#383129]">Batas Harga Maksimal</span>
              <span className="font-bold text-[#1e4535] tabular-nums">
                Rp{maxPrice.toLocaleString('id-ID')}
              </span>
            </div>
            <input
              type="range"
              min={50000}
              max={600000}
              step={25000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#1e4535]"
            />
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="md:col-span-3">
          {/* Active summary */}
          <div className="mb-4 flex items-center justify-between text-xs text-[#6b6255]">
            <span>
              Menampilkan <strong className="text-[#1e4535]">{filteredProducts.length}</strong> produk
            </span>
            {(selectedCategory !== 'all' || searchQuery || inStockOnly) && (
              <button
                onClick={handleResetFilters}
                className="text-[#c86d44] hover:underline font-medium"
              >
                Hapus Semua Filter
              </button>
            )}
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#e6decb] p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#f4efe6] text-[#8a7f72] flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1e4535]">
                Produk Tidak Ditemukan
              </h3>
              <p className="text-xs text-[#6b6255] max-w-sm mx-auto">
                Coba sesuaikan kata kunci pencarian, ubah filter kategori, atau naikkan batas harga.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 text-xs font-semibold bg-[#1e4535] text-white rounded-md hover:bg-[#16382b] transition-colors"
              >
                Tampilkan Semua Produk
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
