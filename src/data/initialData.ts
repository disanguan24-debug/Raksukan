import { AppSettings, Category, Product, Store, UserProfile, UserRole } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', nama_kategori: 'Pakaian Pria', slug: 'pakaian-pria', status: 'aktif', urutan: 1 },
  { id: 'cat-2', nama_kategori: 'Pakaian Wanita', slug: 'pakaian-wanita', status: 'aktif', urutan: 2 },
  { id: 'cat-3', nama_kategori: 'Busana Muslim & Muslimah', slug: 'busana-muslim', status: 'aktif', urutan: 3 },
  { id: 'cat-4', nama_kategori: 'Hijab & Aksesori', slug: 'hijab-aksesori', status: 'aktif', urutan: 4 },
  { id: 'cat-5', nama_kategori: 'Pakaian Anak', slug: 'pakaian-anak', status: 'aktif', urutan: 5 },
  { id: 'cat-6', nama_kategori: 'Kaos, Kemeja & Celana', slug: 'kaos-kemeja-celana', status: 'aktif', urutan: 6 },
  { id: 'cat-7', nama_kategori: 'Tas & Dompet', slug: 'tas-dompet', status: 'aktif', urutan: 7 },
  { id: 'cat-8', nama_kategori: 'Sepatu & Sandal', slug: 'sepatu-sandal', status: 'aktif', urutan: 8 },
  { id: 'cat-9', nama_kategori: 'Produk Handmade', slug: 'produk-handmade', status: 'aktif', urutan: 9 },
  { id: 'cat-10', nama_kategori: 'Produk Fashion Lainnya', slug: 'fashion-lainnya', status: 'aktif', urutan: 10 },
];

export const INITIAL_STORES: Store[] = [
  {
    id: 'store-1',
    owner_id: 'user-seller-1',
    owner_name: 'Mang Asep Mulyana',
    nama_toko: 'Rumah Batik Parungkuda',
    deskripsi: 'Kerajinan batik tulis & cap kontemporer hasil karya pengrajin RT 02/04 Parungkuda dengan bahan katun primisima adem.',
    nomor_kontak: '081288991122',
    alamat_toko: 'Jl. Warga Opat No. 14, Parungkuda, Sukabumi',
    status: 'aktif',
    created_at: '2026-01-15T08:00:00Z',
  },
  {
    id: 'store-2',
    owner_id: 'user-seller-2',
    owner_name: 'Teh Annisa Zahra',
    nama_toko: 'Gamis Syar’i Opat',
    deskripsi: 'Busana muslim & muslimah syar’i jahitan rapi taylor lokal. Nyaman dipakai pengajian maupun acara keluarga.',
    nomor_kontak: '081399887766',
    alamat_toko: 'Gang Melati RT 01/04 Parungkuda, Sukabumi',
    status: 'aktif',
    created_at: '2026-02-10T09:30:00Z',
  },
  {
    id: 'store-3',
    owner_id: 'user-seller-3',
    owner_name: 'Kang Dedi Kusnadi',
    nama_toko: 'Anyaman Kriya Opat',
    deskripsi: 'Kreasi tas anyaman serat bambu & rotan Parungkuda dipadu kulit sintetis ramah lingkungan.',
    nomor_kontak: '085712349988',
    alamat_toko: 'Jl. Raya Parungkuda No. 88, Sukabumi',
    status: 'aktif',
    created_at: '2026-03-01T10:00:00Z',
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    store_id: 'store-1',
    store_name: 'Rumah Batik Parungkuda',
    category_id: 'cat-1',
    category_name: 'Pakaian Pria',
    nama_produk: 'Kemeja Batik Parungkuda Warga Opat Slim Fit',
    slug: 'kemeja-batik-parungkuda-warga-opat-slim-fit',
    deskripsi: 'Kemeja batik pria lengan pendek dengan motif ornamen khas Jawa Barat berpadu nuansa modern hijau tua & terracotta. Dibuat dengan katun 100% prima halus yang sejuk, tidak mudah kusut, dan jahitan lapis furing premium.',
    harga: 165000,
    stok: 24,
    foto: ['/src/assets/images/product_batik_parungkuda_1793157773143.jpg'],
    status: 'aktif',
    is_featured: true,
    terjual_count: 38,
    variants: [
      { id: 'var-1', product_id: 'prod-1', ukuran: 'M', warna: 'Hijau Daun Tua', stok: 8, harga_tambahan: 0 },
      { id: 'var-2', product_id: 'prod-1', ukuran: 'L', warna: 'Hijau Daun Tua', stok: 10, harga_tambahan: 0 },
      { id: 'var-3', product_id: 'prod-1', ukuran: 'XL', warna: 'Hijau Daun Tua', stok: 6, harga_tambahan: 10000 },
    ],
    created_at: '2026-03-10T11:00:00Z',
  },
  {
    id: 'prod-2',
    store_id: 'store-2',
    store_name: 'Gamis Syar’i Opat',
    category_id: 'cat-3',
    category_name: 'Busana Muslim & Muslimah',
    nama_produk: 'Gamis Muslimah Elegan Sage Aksen Krem Parungkuda',
    slug: 'gamis-muslimah-elegan-sage-aksen-krem-parungkuda',
    deskripsi: 'Dress gamis muslimah flowy material crinkle airflow premium tebal tapi sejuk dan jatuh elegan. Dilengkapi resleting dada depan (busui friendly) serta bordir halus di bagian kerah karya penjahit binaan Parungkuda.',
    harga: 220000,
    stok: 16,
    foto: ['/src/assets/images/product_gamis_muslimah_1793157772976.jpg'],
    status: 'aktif',
    is_featured: true,
    terjual_count: 52,
    variants: [
      { id: 'var-4', product_id: 'prod-2', ukuran: 'All Size (L/XL)', warna: 'Sage Green', stok: 10, harga_tambahan: 0 },
      { id: 'var-5', product_id: 'prod-2', ukuran: 'Jumbo (XXL)', warna: 'Sage Green', stok: 6, harga_tambahan: 15000 },
    ],
    created_at: '2026-03-15T14:20:00Z',
  },
  {
    id: 'prod-3',
    store_id: 'store-3',
    store_name: 'Anyaman Kriya Opat',
    category_id: 'cat-7',
    category_name: 'Tas & Dompet',
    nama_produk: 'Tas Tote Anyaman Serat Bambu Handle Kulit Alami',
    slug: 'tas-tote-anyaman-serat-bambu-handle-kulit-alami',
    deskripsi: 'Tas fashion anyaman tangan tradisional dengan finishing anti jamur dan handle kulit sintetis premium kokoh. Sangat cocok untuk acara santai, bepergian, atau cinderamata khas Sukabumi.',
    harga: 145000,
    stok: 12,
    foto: ['/src/assets/images/product_tas_anyaman_1793157773908.jpg'],
    status: 'aktif',
    is_featured: true,
    terjual_count: 27,
    variants: [
      { id: 'var-6', product_id: 'prod-3', ukuran: 'Sedang (32x22cm)', warna: 'Natural Brown', stok: 8, harga_tambahan: 0 },
      { id: 'var-7', product_id: 'prod-3', ukuran: 'Besar (38x26cm)', warna: 'Natural Brown', stok: 4, harga_tambahan: 20000 },
    ],
    created_at: '2026-03-20T09:15:00Z',
  },
  {
    id: 'prod-4',
    store_id: 'store-1',
    store_name: 'Rumah Batik Parungkuda',
    category_id: 'cat-6',
    category_name: 'Kaos, Kemeja & Celana',
    nama_produk: 'Bomber Jacket Outer Tenun Etnik Nusantara Sukabumi',
    slug: 'bomber-jacket-outer-tenun-etnik-nusantara-sukabumi',
    deskripsi: 'Jacket bomber outer unisex berbahan tenun tenun lokal dipadukan furing katun adem. Desain zipper depan kuningan vintage memberikan kesan gagah, kasual, dan berkarakter khas warga lokal.',
    harga: 285000,
    stok: 10,
    foto: ['/src/assets/images/product_outer_tenun_1793157774058.jpg'],
    status: 'aktif',
    is_featured: true,
    terjual_count: 19,
    variants: [
      { id: 'var-8', product_id: 'prod-4', ukuran: 'L', warna: 'Navy Etnik', stok: 5, harga_tambahan: 0 },
      { id: 'var-9', product_id: 'prod-4', ukuran: 'XL', warna: 'Navy Etnik', stok: 5, harga_tambahan: 0 },
    ],
    created_at: '2026-03-25T16:45:00Z',
  },
];

export interface DemoCredentialInfo {
  role: UserRole;
  roleTitle: string;
  roleBadge: string;
  name: string;
  username: string;
  email: string;
  password: string;
  description: string;
  targetView: string;
}

export const DEMO_CREDENTIALS: DemoCredentialInfo[] = [
  {
    role: 'admin',
    roleTitle: 'Pengelola (Admin)',
    roleBadge: '👑 Pengelola / Admin',
    name: 'Kang Hendra',
    username: 'admin',
    email: 'admin.raksukan@wargaopat.id',
    password: 'adminraksukan2026',
    description: 'Akses penuh kurasi produk UMKM warga, persetujuan etalase, verifikasi pesanan, dan ekspor CSV.',
    targetView: 'admin',
  },
  {
    role: 'seller',
    roleTitle: 'Penjual UMKM (Seller)',
    roleBadge: '🏪 Penjual UMKM',
    name: 'Mang Asep Mulyana',
    username: 'asep_batik',
    email: 'asep.batik@wargaopat.id',
    password: 'batikparungkuda',
    description: 'Kelola etalase Rumah Batik Parungkuda, tambah produk baru dengan foto dari HP, dan pantau pesanan.',
    targetView: 'seller',
  },
  {
    role: 'member',
    roleTitle: 'Warga / Pembeli (Member)',
    roleBadge: '🛍️ Member Warga',
    name: 'Siti Nurhaliza',
    username: 'siti_nurhaliza',
    email: 'siti.nur@gmail.com',
    password: 'wargaopat2026',
    description: 'Belanja fashion lokal warga Opat, simpan produk favorit (wishlist), dan checkout WhatsApp cepat.',
    targetView: 'beranda',
  },
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-admin-1',
    username: 'admin',
    password: 'adminraksukan2026',
    nama: 'Kang Hendra (Pengelola)',
    email: 'admin.raksukan@wargaopat.id',
    nomor_whatsapp: '081234567890',
    alamat: 'Sekretariat RW 04 Parungkuda, Sukabumi',
    status_member: 'aktif',
    roles: ['admin'],
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'user-seller-1',
    username: 'asep_batik',
    password: 'batikparungkuda',
    nama: 'Mang Asep Mulyana',
    email: 'asep.batik@wargaopat.id',
    nomor_whatsapp: '081288991122',
    alamat: 'RT 02/04 Parungkuda, Sukabumi',
    status_member: 'aktif',
    roles: ['seller'],
    created_at: '2026-01-15T08:00:00Z',
  },
  {
    id: 'user-member-1',
    username: 'siti_nurhaliza',
    password: 'wargaopat2026',
    nama: 'Siti Nurhaliza',
    email: 'siti.nur@gmail.com',
    nomor_whatsapp: '087811223344',
    alamat: 'Jl. Anggrek No. 12, Parungkuda, Sukabumi',
    status_member: 'aktif',
    roles: ['member'],
    created_at: '2026-03-01T10:00:00Z',
  },
];

export const INITIAL_SETTINGS: AppSettings = {
  nama_marketplace: 'Kampoeng Raksukan Warga Opat Parungkuda',
  tagline: 'Produk Fashion Warga, Karya Lokal, Peluang Global',
  nomor_whatsapp: '6281234567890',
  alamat: 'Komplek Warga Opat, Parungkuda, Kabupaten Sukabumi, Jawa Barat 43357',
  email_kontak: 'kampoengraksukan.warga4@gmail.com',
  biaya_ongkir_flat: 15000,
  pesan_wa_template: 'Halo Admin Kampoeng Raksukan Warga Opat, saya mau konfirmasi pesanan fashion lokal:',
  banner_promo_text: 'Gratis konsultasi ukuran & garansi tukar produk untuk sesama warga Sukabumi!',
};
