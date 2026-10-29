import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Share2,
  Copy,
  Check,
  Store as StoreIcon,
  MessageCircle,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Edit3,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatRupiah } from '../lib/formatters';
import { Product } from '../types';
import { EditProductModal } from './EditProductModal';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, setCurrentView, isAdmin, currentStore } = useStore();
  const [selectedUkuran, setSelectedUkuran] = useState<string>('');
  const [selectedWarna, setSelectedWarna] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  if (!product) return null;

  // Initialize selected variants if available
  const availableSizes = Array.from(
    new Set(product.variants?.map((v) => v.ukuran).filter(Boolean))
  );
  const availableColors = Array.from(
    new Set(product.variants?.map((v) => v.warna).filter(Boolean))
  );

  const activeSize = selectedUkuran || availableSizes[0] || '';
  const activeColor = selectedWarna || availableColors[0] || '';
  const isOutOfStock = product.stok <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, activeSize, activeColor);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, activeSize, activeColor);
    onClose();
    setCurrentView('keranjang');
  };

  // Social sharing handlers
  const currentUrl = window.location.href;
  const shareTitle = `${product.nama_produk} - Kampoeng Raksukan Warga Opat`;

  const handleShareWA = () => {
    const text = `Lihat produk fashion warga lokal "${product.nama_produk}" harga ${formatRupiah(
      product.harga
    )} di Kampoeng Raksukan Warga Opat Parungkuda: ${currentUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareFB = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `Beli produk UMKM fashion ${product.nama_produk}`,
          url: currentUrl,
        });
      } catch {
        // User dismissed
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden my-8 border border-[#e6decb]">
        {/* Header Actions */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          {(isAdmin || currentStore?.id === product.store_id) && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="py-1.5 px-3 bg-white/95 hover:bg-white text-[#c86d44] hover:text-[#9e4620] rounded-full shadow-md transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Edit & Perbaiki Data Produk Ini"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Produk</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="p-2 bg-white/90 hover:bg-white text-[#554b40] rounded-full shadow-md transition-colors"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery / Image */}
          <div className="bg-[#f7f3ec] p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#e6decb]">
            <div className="aspect-4/3 md:aspect-square w-full rounded-lg overflow-hidden bg-white shadow-xs">
              {product.foto && product.foto.length > 0 ? (
                <img
                  src={product.foto[0]}
                  alt={product.nama_produk}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#8c8274]">
                  <StoreIcon className="w-12 h-12" />
                </div>
              )}
            </div>

            {/* Seller Info box */}
            <div className="mt-4 p-3 bg-white/80 rounded-lg border border-[#e6decb] text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-[#1e4535]">
                <StoreIcon className="w-4 h-4 text-[#c86d44]" />
                <span>{product.store_name || 'Etalase UMKM Parungkuda'}</span>
              </div>
              <p className="text-[#6b6255]">
                Dibuat langsung oleh warga binaan UMKM Parungkuda, Kabupaten Sukabumi.
              </p>
            </div>
          </div>

          {/* Details & Purchase Module */}
          <div className="p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              {/* Category & Status */}
              <div className="flex items-center gap-2 text-xs text-[#736859]">
                <span>{product.category_name || 'Katalog Fashion'}</span>
                <span aria-hidden="true">·</span>
                <span className={product.stok > 0 ? 'text-[#1e4535] font-medium' : 'text-[#c86d44] font-bold'}>
                  {product.stok > 0 ? `Stok Tersedia (${product.stok} pcs)` : 'Stok Habis'}
                </span>
                <span aria-hidden="true">·</span>
                <span>Terjual {product.terjual_count}</span>
              </div>

              {/* Title */}
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1c2420] leading-snug">
                {product.nama_produk}
              </h2>

              {/* Price */}
              <div className="text-2xl font-serif font-bold text-[#1e4535] tabular-nums">
                {formatRupiah(product.harga)}
              </div>

              {/* Description */}
              <div className="text-xs sm:text-sm text-[#554b40] leading-relaxed max-h-36 overflow-y-auto pr-1">
                {product.deskripsi}
              </div>

              {/* Size Selector */}
              {availableSizes.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-semibold text-[#383129] block">
                    Pilih Ukuran:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedUkuran(sz)}
                        className={`px-3 py-1 text-xs rounded border transition-colors ${
                          activeSize === sz
                            ? 'bg-[#1e4535] text-white border-[#1e4535] font-semibold'
                            : 'bg-white text-[#463e35] border-[#d6cdbc] hover:border-[#1e4535]'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {availableColors.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-semibold text-[#383129] block">
                    Pilihan Warna:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setSelectedWarna(col)}
                        className={`px-3 py-1 text-xs rounded border transition-colors ${
                          activeColor === col
                            ? 'bg-[#c86d44] text-white border-[#c86d44] font-semibold'
                            : 'bg-white text-[#463e35] border-[#d6cdbc] hover:border-[#c86d44]'
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs font-semibold text-[#383129]">Jumlah:</span>
                <div className="flex items-center border border-[#d6cdbc] rounded bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-2.5 py-1 text-sm font-semibold hover:bg-[#f6f2e8] text-[#554b40]"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold tabular-nums min-w-[28px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stok, q + 1))}
                    disabled={quantity >= product.stok}
                    className="px-2.5 py-1 text-sm font-semibold hover:bg-[#f6f2e8] text-[#554b40] disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-3 border-t border-[#f0ebd9]">
              {addedNotice && (
                <div className="p-2 bg-[#e8f2ec] text-[#1e4535] text-xs font-medium rounded flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1e4535]" />
                  <span>Berhasil ditambahkan ke keranjang belanja!</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className="w-full py-2.5 px-3 text-xs sm:text-sm font-semibold text-[#1e4535] bg-[#efe9dc] hover:bg-[#e4ddcc] border border-[#d6cdbc] rounded-md transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>+ Keranjang</span>
                </button>

                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                  className="w-full py-2.5 px-3 text-xs sm:text-sm font-semibold text-white bg-[#1e4535] hover:bg-[#16382b] rounded-md transition-colors shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <span>Beli Sekarang</span>
                </button>
              </div>

              {/* Share Bar */}
              <div className="pt-2 flex items-center justify-between text-xs text-[#736859] border-t border-[#f0ebd9]">
                <span className="font-medium flex items-center gap-1">
                  <Share2 className="w-3.5 h-3.5" /> Bagikan:
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleShareWA}
                    className="p-1.5 text-white bg-[#25D366] hover:bg-[#20ba59] rounded transition-colors"
                    title="Bagikan ke WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleShareFB}
                    className="px-2 py-1 text-[11px] font-medium bg-[#1877F2] text-white rounded hover:bg-[#1567d3]"
                  >
                    FB
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="p-1.5 bg-[#eae4d5] hover:bg-[#dfd7c5] text-[#3d362f] rounded transition-colors"
                    title="Salin tautan produk"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-green-700" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Product Modal */}
      <EditProductModal
        product={product}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        isAdminEdit={isAdmin}
      />
    </div>
  );
};
