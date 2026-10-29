export type UserRole = 'admin' | 'seller' | 'member';

export type MemberStatus = 'menunggu_verifikasi' | 'aktif' | 'ditangguhkan';

export interface UserProfile {
  id: string;
  username?: string;
  password?: string;
  nama: string;
  email: string;
  nomor_whatsapp: string;
  alamat: string;
  status_member: MemberStatus;
  roles: UserRole[];
  foto_avatar?: string;
  created_at: string;
}

export interface Store {
  id: string;
  owner_id: string;
  owner_name?: string;
  nama_toko: string;
  deskripsi: string;
  nomor_kontak: string;
  alamat_toko: string;
  status: 'menunggu_persetujuan' | 'aktif' | 'nonaktif';
  created_at: string;
}

export interface Category {
  id: string;
  nama_kategori: string;
  slug: string;
  status: 'aktif' | 'nonaktif';
  urutan: number;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  ukuran: string;
  warna: string;
  stok: number;
  harga_tambahan: number;
}

export interface Product {
  id: string;
  store_id: string;
  store_name?: string;
  category_id: string;
  category_name?: string;
  nama_produk: string;
  slug: string;
  deskripsi: string;
  harga: number;
  stok: number;
  foto: string[];
  status: 'menunggu_persetujuan' | 'aktif' | 'ditolak' | 'nonaktif';
  is_featured: boolean;
  terjual_count: number;
  variants: ProductVariant[];
  created_at: string;
  updated_at?: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  product: Product;
  variant_id?: string;
  selected_ukuran?: string;
  selected_warna?: string;
  quantity: number;
  price_at_addition: number;
}

export type OrderStatus =
  | 'menunggu_konfirmasi'
  | 'dikonfirmasi'
  | 'diproses'
  | 'siap_dikirim'
  | 'dikirim'
  | 'selesai'
  | 'dibatalkan';

export type PaymentMethod = 'transfer_bank' | 'cod' | 'tunai_toko';
export type PaymentStatus = 'belum_dibayar' | 'menunggu_verifikasi' | 'lunas' | 'dibatalkan';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  seller_id?: string;
  store_id?: string;
  nama_produk_snapshot: string;
  harga_snapshot: number;
  quantity: number;
  variant_snapshot: string;
  subtotal: number;
}

export interface Order {
  id: string;
  order_number: string;
  buyer_id?: string;
  nama_pembeli: string;
  nomor_whatsapp: string;
  alamat_pengiriman: string;
  catatan?: string;
  subtotal: number;
  biaya_pengiriman: number;
  total: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_reference?: string;
  items: OrderItem[];
  created_at: string;
  updated_at?: string;
}

export interface AppSettings {
  nama_marketplace: string;
  tagline: string;
  nomor_whatsapp: string;
  alamat: string;
  email_kontak: string;
  biaya_ongkir_flat: number;
  pesan_wa_template: string;
  banner_promo_text: string;
}
