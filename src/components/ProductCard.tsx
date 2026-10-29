import React from 'react';
import { Heart, Plus, Store as StoreIcon } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatRupiah } from '../lib/formatters';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProduct, addToCart, isWishlisted, toggleWishlist } = useStore();
  const wishlisted = isWishlisted(product.id);
  const isOutOfStock = product.stok <= 0;

  return (
    <div className="group flex flex-col bg-white rounded-lg border border-[#e6decb] overflow-hidden transition-all duration-200 hover:shadow-md hover:border-[#1e4535]/30">
      {/* Product Image Box */}
      <div
        onClick={() => setSelectedProduct(product)}
        className="relative aspect-4/3 w-full bg-[#f4efe6] overflow-hidden cursor-pointer"
      >
        {product.foto && product.foto.length > 0 ? (
          <img
            src={product.foto[0]}
            alt={product.nama_produk}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-[#8c8274]">
            <StoreIcon className="w-8 h-8 mb-2 stroke-1" />
            <span className="text-xs text-center font-medium">Foto Produk Warga</span>
          </div>
        )}

        {/* Out of Stock Scrim */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
            <span className="text-white text-xs font-bold uppercase tracking-wider px-3 py-1 bg-[#c86d44] rounded-sm">
              Stok Habis
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md transition-colors ${
            wishlisted
              ? 'bg-white text-[#c86d44] shadow-xs'
              : 'bg-black/20 text-white hover:bg-white hover:text-[#c86d44]'
          }`}
          title={wishlisted ? 'Hapus dari favorit' : 'Simpan ke favorit'}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Metadata: unboxed clean text with bullet separators */}
          <div className="flex items-center gap-1.5 text-xs text-[#736859] mb-1">
            <span className="truncate max-w-[140px]">{product.category_name || 'Fashion'}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate max-w-[120px]">{product.store_name || 'UMKM Opat'}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">Stok {product.stok}</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => setSelectedProduct(product)}
            className="font-medium text-sm sm:text-base text-[#1c2420] line-clamp-2 hover:text-[#c86d44] cursor-pointer transition-colors leading-snug"
            title={product.nama_produk}
          >
            {product.nama_produk}
          </h3>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-[#f0ebd9] flex items-center justify-between gap-2">
          <div>
            <div className="text-[11px] text-[#8a7f72] uppercase tracking-wider font-medium">Harga</div>
            <div className="font-serif font-bold text-base sm:text-lg text-[#1e4535] tabular-nums">
              {formatRupiah(product.harga)}
            </div>
          </div>

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={() => {
              if (product.variants && product.variants.length > 0) {
                setSelectedProduct(product);
              } else {
                addToCart(product, 1);
              }
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-[#1e4535] text-white hover:bg-[#16382b] shadow-xs active:scale-95'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Pesan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
