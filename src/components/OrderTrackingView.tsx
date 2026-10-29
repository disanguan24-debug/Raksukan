import React, { useState } from 'react';
import {
  Package,
  Search,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
  MessageCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  buildWhatsAppOrderMessage,
  formatRupiah,
  formatTanggalIndo,
  getOrderStatusLabel,
  getPaymentStatusLabel,
} from '../lib/formatters';
import { Order, OrderStatus } from '../types';

export const OrderTrackingView: React.FC = () => {
  const { orders, buyerOrders, currentUser, settings, setCurrentView } = useStore();
  const [searchNumber, setSearchNumber] = useState<string>('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [searchError, setSearchError] = useState<string>('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    if (!searchNumber.trim()) return;

    const cleanInput = searchNumber.trim().toUpperCase();
    const found = orders.find((o) => o.order_number.toUpperCase() === cleanInput);
    if (found) {
      setSearchedOrder(found);
    } else {
      setSearchedOrder(null);
      setSearchError(`Nomor pesanan "${searchNumber}" tidak ditemukan. Pastikan format benar, contoh: KRW-20261027-1234.`);
    }
  };

  const statusSteps: OrderStatus[] = [
    'menunggu_konfirmasi',
    'dikonfirmasi',
    'diproses',
    'siap_dikirim',
    'dikirim',
    'selesai',
  ];

  const getStepIndex = (status: OrderStatus) => {
    return statusSteps.indexOf(status);
  };

  const displayedOrders = buyerOrders.length > 0 ? buyerOrders : orders.slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="pb-3 border-b border-[#e6decb]">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1e4535]">
          Lacak & Riwayat Pesanan
        </h1>
        <p className="text-xs sm:text-sm text-[#6b6255] mt-1">
          Pantau status pemrosesan dan pengiriman paket fashion Anda secara transparan.
        </p>
      </div>

      {/* Search by Order Number */}
      <div className="bg-white p-5 rounded-lg border border-[#e6decb] shadow-xs">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8a7f72] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchNumber}
              onChange={(e) => setSearchNumber(e.target.value)}
              placeholder="Masukkan nomor pesanan (Contoh: KRW-20261027-...)"
              className="w-full pl-9 pr-3 py-2 text-xs border border-[#d6cdbc] rounded focus:outline-hidden focus:border-[#1e4535]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-white bg-[#1e4535] hover:bg-[#16382b] rounded transition-colors whitespace-nowrap"
          >
            Lacak Pesanan
          </button>
        </form>

        {searchError && (
          <div className="mt-3 p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200">
            {searchError}
          </div>
        )}
      </div>

      {/* Searched Order Result Card */}
      {searchedOrder && (
        <div className="bg-white rounded-lg border-2 border-[#1e4535] p-6 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#f0ebd9]">
            <div>
              <span className="text-xs text-[#8a7f72]">Hasil Pencarian Pesanan</span>
              <h2 className="font-mono text-lg font-bold text-[#1e4535]">
                {searchedOrder.order_number}
              </h2>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-[#e8f2ec] text-[#1e4535] font-semibold rounded text-xs">
                {getOrderStatusLabel(searchedOrder.status)}
              </span>
            </div>
          </div>

          {/* Stepper timeline */}
          {searchedOrder.status !== 'dibatalkan' ? (
            <div className="py-2">
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                {statusSteps.map((step, idx) => {
                  const currentIdx = getStepIndex(searchedOrder.status);
                  const isDone = currentIdx >= idx;
                  const isCurrent = currentIdx === idx;
                  return (
                    <div
                      key={step}
                      className={`p-2 rounded text-center text-xs transition-colors border ${
                        isCurrent
                          ? 'bg-[#1e4535] text-white border-[#1e4535] font-semibold'
                          : isDone
                          ? 'bg-[#eef5f1] text-[#1e4535] border-[#c4e0ce]'
                          : 'bg-[#faf8f5] text-[#9c9183] border-[#e6decb]'
                      }`}
                    >
                      <div className="text-[10px] uppercase font-bold mb-0.5">Langkah {idx + 1}</div>
                      <div className="truncate">{getOrderStatusLabel(step)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200">
              Pesanan ini telah dibatalkan. Hubungi admin toko via WhatsApp untuk informasi lebih lanjut.
            </div>
          )}

          {/* Items & Shipping details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            <div className="space-y-1.5 p-3 bg-[#faf8f5] rounded border border-[#e6decb]">
              <span className="font-semibold text-[#1e4535] block">Informasi Penerima:</span>
              <p>Nama: {searchedOrder.nama_pembeli}</p>
              <p>WhatsApp: {searchedOrder.nomor_whatsapp}</p>
              <p>Alamat: {searchedOrder.alamat_pengiriman}</p>
              <p>Metode Pembayaran: {searchedOrder.payment_method}</p>
              <p>Status Pembayaran: {getPaymentStatusLabel(searchedOrder.payment_status)}</p>
            </div>

            <div className="space-y-1.5 p-3 bg-[#faf8f5] rounded border border-[#e6decb]">
              <span className="font-semibold text-[#1e4535] block">Ringkasan Biaya:</span>
              <p>Subtotal: {formatRupiah(searchedOrder.subtotal)}</p>
              <p>Ongkir: {formatRupiah(searchedOrder.biaya_pengiriman)}</p>
              <p className="font-bold text-sm text-[#1e4535]">
                Total: {formatRupiah(searchedOrder.total)}
              </p>
              <div className="pt-2">
                <a
                  href={buildWhatsAppOrderMessage(searchedOrder, settings.nomor_whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#25D366] hover:underline font-semibold"
                >
                  <MessageCircle className="w-4 h-4" />
                  Hubungi Admin mengenai pesanan ini
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders History List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-[#1e4535]">
          {currentUser ? `Daftar Pesanan Anda (${displayedOrders.length})` : 'Riwayat Transaksi Terbaru'}
        </h2>

        {displayedOrders.length > 0 ? (
          <div className="space-y-3">
            {displayedOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg border border-[#e6decb] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#1e4535]/40 transition-colors"
              >
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#1e4535]">
                      {order.order_number}
                    </span>
                    <span className="text-[#8a7f72]">·</span>
                    <span className="text-[#8a7f72]">{formatTanggalIndo(order.created_at)}</span>
                  </div>

                  <p className="text-[#554b40]">
                    Penerima: <strong className="text-[#1c2420]">{order.nama_pembeli}</strong> ({order.items.length} jenis pakaian)
                  </p>

                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="px-2 py-0.5 bg-[#f5ede0] text-[#824419] font-medium rounded text-[10px]">
                      {getOrderStatusLabel(order.status)}
                    </span>
                    <span className="px-2 py-0.5 bg-[#eaf1ec] text-[#1e4535] font-medium rounded text-[10px]">
                      {getPaymentStatusLabel(order.payment_status)}
                    </span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f0ebd9]">
                  <div className="font-serif font-bold text-base text-[#1e4535] tabular-nums">
                    {formatRupiah(order.total)}
                  </div>
                  <button
                    onClick={() => setSearchedOrder(order)}
                    className="px-3 py-1.5 text-xs font-semibold text-[#1e4535] bg-[#efe9dc] hover:bg-[#e2dacb] rounded transition-colors"
                  >
                    Detail Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-[#e6decb] p-8 text-center text-xs text-[#736859]">
            Belum ada riwayat pesanan. Silakan berbelanja di katalog fashion warga.
          </div>
        )}
      </div>
    </div>
  );
};
