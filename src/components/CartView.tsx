import React, { useState } from 'react';
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  Store as StoreIcon,
  ShieldCheck,
  Truck,
  CheckCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { buildWhatsAppOrderMessage, formatRupiah } from '../lib/formatters';
import { PaymentMethod } from '../types';

export const CartView: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    settings,
    currentUser,
    createOrder,
    setCurrentView,
    setLastCreatedOrder,
  } = useStore();

  // Checkout Form State
  const [namaPembeli, setNamaPembeli] = useState<string>(currentUser?.nama || '');
  const [nomorWa, setNomorWa] = useState<string>(currentUser?.nomor_whatsapp || '');
  const [alamat, setAlamat] = useState<string>(currentUser?.alamat || '');
  const [catatan, setCatatan] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transfer_bank');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const shippingFee = settings.biaya_ongkir_flat;
  const grandTotal = cartSubtotal + shippingFee;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!namaPembeli.trim()) {
      setErrorMessage('Harap masukkan nama penerima.');
      return;
    }
    if (!nomorWa.trim() || nomorWa.length < 8) {
      setErrorMessage('Harap masukkan nomor WhatsApp aktif yang valid.');
      return;
    }
    if (!alamat.trim()) {
      setErrorMessage('Harap masukkan alamat pengiriman lengkap (RT/RW, Desa/Kecamatan).');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createOrder({
        nama_pembeli: namaPembeli.trim(),
        nomor_whatsapp: nomorWa.trim(),
        alamat_pengiriman: alamat.trim(),
        catatan: catatan.trim(),
        payment_method: paymentMethod,
      });

      if (!res.success || !res.order) {
        setErrorMessage(res.error || 'Gagal memproses pesanan. Periksa kembali stok barang.');
        setIsSubmitting(false);
        return;
      }

      // Order created successfully in database/state!
      setLastCreatedOrder(res.order);

      // Open WhatsApp chat directly
      const waUrl = buildWhatsAppOrderMessage(res.order, settings.nomor_whatsapp);
      window.open(waUrl, '_blank');

      // Navigate to order confirmation
      setCurrentView('konfirmasi');
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan sistem saat menyimpan pesanan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-xl border border-[#e6decb] p-10 sm:p-14 space-y-5 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#f4efe6] text-[#1e4535] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1e4535]">
            Keranjang Belanja Anda Kosong
          </h2>
          <p className="text-sm text-[#6b6255] max-w-md mx-auto">
            Belum ada produk fashion warga yang dipilih. Mari jelajahi karya lokal berkualitas dari Warga Opat Parungkuda.
          </p>
          <div>
            <button
              onClick={() => setCurrentView('katalog')}
              className="px-6 py-3 text-sm font-semibold text-white bg-[#1e4535] hover:bg-[#16382b] rounded-md transition-colors shadow-xs inline-flex items-center gap-2"
            >
              <span>Buka Katalog Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between pb-3 border-b border-[#e6decb]">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1e4535]">
          Keranjang & Pemesanan
        </h1>
        <button
          onClick={clearCart}
          className="text-xs text-[#8a7f72] hover:text-[#c86d44] transition-colors"
        >
          Kosongkan Keranjang
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-lg border border-[#e6decb] overflow-hidden divide-y divide-[#f0ebd9]">
            {cart.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex gap-4 items-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded bg-[#f7f3ec] shrink-0 overflow-hidden border border-[#e6decb]">
                  {item.product.foto && item.product.foto[0] ? (
                    <img
                      src={item.product.foto[0]}
                      alt={item.product.nama_produk}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#8c8274]">
                      <StoreIcon className="w-6 h-6" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 text-[11px] text-[#7a6f62]">
                    <span className="truncate">{item.product.store_name || 'Toko UMKM'}</span>
                    {(item.selected_ukuran || item.selected_warna) && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-medium text-[#1e4535]">
                          {[item.selected_ukuran, item.selected_warna].filter(Boolean).join(' / ')}
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="font-medium text-sm sm:text-base text-[#1c2420] truncate">
                    {item.product.nama_produk}
                  </h3>

                  <div className="font-serif font-bold text-sm sm:text-base text-[#1e4535] tabular-nums">
                    {formatRupiah(item.product.harga)}
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-4 pt-1">
                    <div className="flex items-center border border-[#d6cdbc] rounded bg-white text-xs">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-0.5 hover:bg-[#f6f2e8] text-[#554b40] font-bold"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 font-bold tabular-nums min-w-[24px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stok}
                        className="px-2 py-0.5 hover:bg-[#f6f2e8] text-[#554b40] font-bold disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-xs text-[#8a7f72] tabular-nums">
                      Subtotal: {formatRupiah(item.product.harga * item.quantity)}
                    </span>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-auto text-xs text-[#c86d44] hover:text-[#9e4620] flex items-center gap-1"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Hapus</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-[#f8f5ee] rounded-lg border border-[#e6decb] text-xs text-[#554b40] space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-[#1e4535]">
              <Truck className="w-4 h-4 text-[#c86d44]" />
              <span>Pengiriman Langsung dari Parungkuda</span>
            </div>
            <p>
              Ongkir flat hemat Rp{shippingFee.toLocaleString('id-ID')} ke seluruh wilayah Sukabumi & sekitarnya,
              atau siap kirim melalui ekspedisi (J&T / JNE / SiCepat / COD Parungkuda).
            </p>
          </div>
        </div>

        {/* Right: Checkout & Customer Form */}
        <div className="lg:col-span-5">
          <form
            onSubmit={handleCheckoutSubmit}
            className="bg-white rounded-lg border border-[#e6decb] p-6 space-y-5 shadow-xs sticky top-24"
          >
            <h2 className="font-serif text-lg font-bold text-[#1e4535] pb-2 border-b border-[#f0ebd9]">
              Data Pembeli & Pengiriman
            </h2>

            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200">
                {errorMessage}
              </div>
            )}

            {/* Recipient Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#383129] block">
                Nama Lengkap Penerima <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={namaPembeli}
                onChange={(e) => setNamaPembeli(e.target.value)}
                placeholder="Contoh: Ibu Siti Rahmawati"
                className="w-full px-3 py-2 text-xs border border-[#d6cdbc] rounded focus:outline-hidden focus:border-[#1e4535]"
              />
            </div>

            {/* WhatsApp */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#383129] block">
                Nomor WhatsApp Aktif <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={nomorWa}
                onChange={(e) => setNomorWa(e.target.value)}
                placeholder="081234567890"
                className="w-full px-3 py-2 text-xs border border-[#d6cdbc] rounded focus:outline-hidden focus:border-[#1e4535]"
              />
              <span className="text-[11px] text-[#8a7f72] block">
                Digunakan untuk notifikasi dan konfirmasi pengiriman via WhatsApp.
              </span>
            </div>

            {/* Full Address */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#383129] block">
                Alamat Lengkap Pengiriman <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                placeholder="Nama jalan, nomor rumah, RT/RW, Desa, Kecamatan Parungkuda, Patokan..."
                className="w-full px-3 py-2 text-xs border border-[#d6cdbc] rounded focus:outline-hidden focus:border-[#1e4535]"
              />
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#383129] block">
                Catatan Pesanan (Opsional)
              </label>
              <input
                type="text"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Contoh: Titipkan di pos satpam, atau warna cadangan..."
                className="w-full px-3 py-2 text-xs border border-[#d6cdbc] rounded focus:outline-hidden focus:border-[#1e4535]"
              />
            </div>

            {/* Payment Method */}
            <div className="space-y-1.5 pt-2 border-t border-[#f0ebd9]">
              <label className="text-xs font-semibold text-[#383129] block">
                Pilihan Pembayaran:
              </label>
              <div className="space-y-1.5 text-xs">
                <label className="flex items-center gap-2 p-2 border border-[#d6cdbc] rounded cursor-pointer hover:bg-[#faf7f0]">
                  <input
                    type="radio"
                    name="payment"
                    value="transfer_bank"
                    checked={paymentMethod === 'transfer_bank'}
                    onChange={() => setPaymentMethod('transfer_bank')}
                    className="text-[#1e4535] focus:ring-0"
                  />
                  <div>
                    <span className="font-semibold block text-[#1e4535]">Transfer Bank / QRIS</span>
                    <span className="text-[11px] text-[#736859]">BCA / Mandiri / BRI / BSI</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2 border border-[#d6cdbc] rounded cursor-pointer hover:bg-[#faf7f0]">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="text-[#1e4535] focus:ring-0"
                  />
                  <div>
                    <span className="font-semibold block text-[#1e4535]">COD (Bayar di Tempat)</span>
                    <span className="text-[11px] text-[#736859]">Khusus wilayah Parungkuda & sekitarnya</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2 border border-[#d6cdbc] rounded cursor-pointer hover:bg-[#faf7f0]">
                  <input
                    type="radio"
                    name="payment"
                    value="tunai_toko"
                    checked={paymentMethod === 'tunai_toko'}
                    onChange={() => setPaymentMethod('tunai_toko')}
                    className="text-[#1e4535] focus:ring-0"
                  />
                  <div>
                    <span className="font-semibold block text-[#1e4535]">Ambil & Bayar di Toko Warga</span>
                    <span className="text-[11px] text-[#736859]">Bebas ongkos kirim saat pengambilan</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-3 border-t border-[#f0ebd9] space-y-1.5 text-xs text-[#554b40]">
              <div className="flex justify-between">
                <span>Subtotal Barang:</span>
                <span className="font-medium tabular-nums">{formatRupiah(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Ongkos Kirim:</span>
                <span className="font-medium tabular-nums">
                  {paymentMethod === 'tunai_toko' ? 'Rp0 (Ambil di Toko)' : formatRupiah(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-serif font-bold text-[#1e4535] pt-2 border-t border-[#f0ebd9]">
                <span>Total Pesanan:</span>
                <span className="tabular-nums">
                  {formatRupiah(paymentMethod === 'tunai_toko' ? cartSubtotal : grandTotal)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 text-xs sm:text-sm font-semibold text-white bg-[#1e4535] hover:bg-[#16382b] rounded-md transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <span>Memproses Pesanan...</span>
              ) : (
                <>
                  <span>Kirim Pesanan & Hubungkan WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-[#736859]">
              Pesanan tersimpan otomatis ke database sebelum diteruskan ke WhatsApp Pengelola.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
