import { Order, OrderStatus, PaymentStatus } from '../types';

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace(/\s+/g, '');
}

export function formatTanggalIndo(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function generateOrderNumber(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `KRW-${y}${m}${d}-${rand}`;
}

export function getOrderStatusLabel(status: OrderStatus): string {
  switch (status) {
    case 'menunggu_konfirmasi':
      return 'Menunggu Konfirmasi';
    case 'dikonfirmasi':
      return 'Dikonfirmasi';
    case 'diproses':
      return 'Diproses Penjual';
    case 'siap_dikirim':
      return 'Siap Dikirim';
    case 'dikirim':
      return 'Dalam Pengiriman';
    case 'selesai':
      return 'Selesai';
    case 'dibatalkan':
      return 'Dibatalkan';
    default:
      return status;
  }
}

export function getPaymentStatusLabel(status: PaymentStatus): string {
  switch (status) {
    case 'belum_dibayar':
      return 'Belum Dibayar';
    case 'menunggu_verifikasi':
      return 'Menunggu Verifikasi Admin';
    case 'lunas':
      return 'Lunas / Terverifikasi';
    case 'dibatalkan':
      return 'Dibatalkan';
    default:
      return status;
  }
}

export function buildWhatsAppOrderMessage(order: Order, managerPhone: string): string {
  // Clean phone number (ensure international format without + or spaces)
  let cleanPhone = managerPhone.replace(/\D/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.slice(1);
  } else if (!cleanPhone.startsWith('62')) {
    cleanPhone = '62' + cleanPhone;
  }

  const itemsList = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.nama_produk_snapshot}* (${item.variant_snapshot || 'Standar'}) x ${
          item.quantity
        } = ${formatRupiah(item.subtotal)}`
    )
    .join('\n');

  const message = `*KONFIRMASI PESANAN - KAMPOENG RAKSUKAN WARGA OPAT*
----------------------------------------
No. Pesanan: *${order.order_number}*
Tanggal: ${formatTanggalIndo(order.created_at)}

*Data Pembeli:*
Nama: ${order.nama_pembeli}
WhatsApp: ${order.nomor_whatsapp}
Alamat: ${order.alamat_pengiriman}
${order.catatan ? `Catatan: ${order.catatan}\n` : ''}
*Rincian Barang:*
${itemsList}

Subtotal: ${formatRupiah(order.subtotal)}
Ongkos Kirim: ${formatRupiah(order.biaya_pengiriman)}
*Total Pembayaran: ${formatRupiah(order.total)}*

Metode Pembayaran: *${order.payment_method === 'transfer_bank' ? 'Transfer Bank' : order.payment_method === 'cod' ? 'COD (Bayar di Tempat)' : 'Ambil di Toko Parungkuda'}*
Status Saat Ini: ${getOrderStatusLabel(order.status)}
----------------------------------------
Mohon konfirmasi ketersediaan dan detail instruksi pengiriman. Hatur nuhun!`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function exportOrdersToCSV(orders: Order[]): void {
  const headers = [
    'No Pesanan',
    'Tanggal',
    'Pembeli',
    'WhatsApp',
    'Alamat',
    'Jumlah Item',
    'Subtotal',
    'Ongkir',
    'Total',
    'Status Pesanan',
    'Metode Bayar',
    'Status Bayar',
  ];

  const rows = orders.map((o) => [
    `"${o.order_number}"`,
    `"${o.created_at}"`,
    `"${o.nama_pembeli.replace(/"/g, '""')}"`,
    `"${o.nomor_whatsapp}"`,
    `"${o.alamat_pengiriman.replace(/"/g, '""')}"`,
    o.items.reduce((acc, i) => acc + i.quantity, 0),
    o.subtotal,
    o.biaya_pengiriman,
    o.total,
    `"${getOrderStatusLabel(o.status)}"`,
    `"${o.payment_method}"`,
    `"${getPaymentStatusLabel(o.payment_status)}"`,
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `rekap_pesanan_kampoeng_raksukan_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
