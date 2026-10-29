import React from 'react';
import {
  CheckCircle2,
  MessageCircle,
  Package,
  Calendar,
  MapPin,
  ArrowRight,
  Printer,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  buildWhatsAppOrderMessage,
  formatRupiah,
  formatTanggalIndo,
  getOrderStatusLabel,
} from '../lib/formatters';

export const OrderConfirmationView: React.FC = () => {
  const { lastCreatedOrder, settings, setCurrentView } = useStore();

  if (!lastCreatedOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-sm text-[#736859]">Tidak ada data pesanan baru.</p>
        <button
          onClick={() => setCurrentView('katalog')}
          className="mt-4 px-4 py-2 text-xs font-semibold bg-[#1e4535] text-white rounded"
        >
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  const waUrl = buildWhatsAppOrderMessage(lastCreatedOrder, settings.nomor_whatsapp);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="bg-white rounded-xl border border-[#e6decb] p-6 sm:p-8 shadow-xs space-y-6">
        {/* Success Icon & Notice */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-[#e8f2ec] text-[#1e4535] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1e4535]">
            Pesanan Berhasil Tersimpan!
          </h1>
          <p className="text-xs sm:text-sm text-[#6b6255] max-w-md mx-auto">
            Terima kasih telah berbelanja dan memajukan produk fashion warga Opat Parungkuda.
          </p>
        </div>

        {/* WhatsApp Callout Box */}
        <div className="p-5 bg-[#f4f8f5] rounded-lg border border-[#cbe4d3] space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#25D366] text-white rounded-full shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#1e4535]">
                Langkah Terakhir: Kirim Konfirmasi ke WhatsApp Pengelola
              </h3>
              <p className="text-xs text-[#554b40] mt-0.5">
                Jika aplikasi WhatsApp Anda tidak terbuka otomatis, silakan klik tombol di bawah untuk mengirim pesan rincian pesanan ke admin toko.
              </p>
            </div>
          </div>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs sm:text-sm rounded-md transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Kirim Pesan WhatsApp Sekarang</span>
          </a>
        </div>

        {/* Order Details Receipt */}
        <div className="border border-[#e6decb] rounded-lg p-5 space-y-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#f0ebd9]">
            <div>
              <span className="text-[#8a7f72] block">Nomor Pesanan:</span>
              <strong className="text-sm sm:text-base font-mono text-[#1e4535]">
                {lastCreatedOrder.order_number}
              </strong>
            </div>

            <div className="text-right">
              <span className="text-[#8a7f72] block">Status:</span>
              <span className="inline-block px-2.5 py-0.5 bg-[#f7f2e8] text-[#1e4535] font-semibold rounded text-[11px] border border-[#e6decb]">
                {getOrderStatusLabel(lastCreatedOrder.status)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[#554b40]">
            <div>
              <span className="text-[#8a7f72] block">Nama Penerima:</span>
              <span className="font-semibold text-[#1c2420]">{lastCreatedOrder.nama_pembeli}</span>
            </div>
            <div>
              <span className="text-[#8a7f72] block">WhatsApp Pembeli:</span>
              <span className="font-semibold text-[#1c2420]">{lastCreatedOrder.nomor_whatsapp}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-[#8a7f72] block">Alamat Pengiriman:</span>
              <span className="text-[#1c2420]">{lastCreatedOrder.alamat_pengiriman}</span>
            </div>
          </div>

          {/* Items breakdown */}
          <div className="pt-2 border-t border-[#f0ebd9] space-y-2">
            <span className="font-semibold text-[#383129] block">Barang yang Dipesan:</span>
            <div className="divide-y divide-[#f7f4ee]">
              {lastCreatedOrder.items.map((item, idx) => (
                <div key={idx} className="py-1.5 flex justify-between items-center">
                  <div>
                    <span className="font-medium text-[#1c2420]">{item.nama_produk_snapshot}</span>
                    <span className="text-[11px] text-[#7a6f62] ml-2">({item.variant_snapshot})</span>
                    <span className="text-[#8a7f72] ml-2">x {item.quantity}</span>
                  </div>
                  <span className="tabular-nums font-semibold text-[#1e4535]">
                    {formatRupiah(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing totals */}
          <div className="pt-2 border-t border-[#f0ebd9] space-y-1 text-[#554b40]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="tabular-nums">{formatRupiah(lastCreatedOrder.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Ongkos Kirim:</span>
              <span className="tabular-nums">{formatRupiah(lastCreatedOrder.biaya_pengiriman)}</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base font-serif font-bold text-[#1e4535] pt-1 border-t border-[#f0ebd9]">
              <span>Total Pesanan:</span>
              <span className="tabular-nums">{formatRupiah(lastCreatedOrder.total)}</span>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 text-xs font-medium text-[#554b40] bg-white border border-[#d6cdbc] rounded hover:bg-[#f6f2e8] flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak Nota
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('pesanan')}
              className="px-4 py-2 text-xs font-semibold text-[#1e4535] bg-[#efe9dc] hover:bg-[#e4ddcc] rounded flex items-center gap-1.5"
            >
              <Package className="w-3.5 h-3.5" />
              Lacak Status Pesanan
            </button>
            <button
              onClick={() => setCurrentView('katalog')}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#1e4535] hover:bg-[#16382b] rounded flex items-center gap-1.5"
            >
              Belanja Lagi <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
