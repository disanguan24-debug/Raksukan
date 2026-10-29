# Kampoeng Raksukan Warga Opat Parungkuda

> **Tagline:** *“Produk Fashion Warga, Karya Lokal, Peluang Global.”*  
> Marketplace Toko Online UMKM Fashion Warga Opat Parungkuda, Kabupaten Sukabumi, Jawa Barat.

Aplikasi toko online komunitas UMKM yang dibangun secara lengkap, fungsional, dan siap pakai. Menghubungkan para perajin batik lokal, penjahit busana muslimah syar'i, pembuat kriya anyaman bambu, dan pengrajin apparel warga dengan pembeli di seluruh Indonesia menggunakan integrasi pesan WhatsApp otomatis dan database cloud PostgreSQL (Supabase).

---

## 🌟 Fitur Utama Aplikasi

### 1. Katalog & Belanja Komunitas
- **Katalog Lengkap & Responsif:** Pakaian Pria, Pakaian Wanita, Busana Muslim & Muslimah, Hijab & Aksesori, Pakaian Anak, Kaos & Celana, Tas Anyaman, Sepatu/Sandal, hingga Produk Handmade.
- **Filter & Pencarian Instan:** Pencarian nama produk, filter kategori, slider rentang harga, filter ketersediaan stok ready, serta opsi pengurutan (Terbaru, Terlaris, Termurah, Termahal).
- **Format Rupiah Standar:** Seluruh harga disajikan dalam format mata uang resmi Indonesia (contoh: `Rp165.000`).
- **Detail Produk Komprehensif:** Galeri foto resolusi tinggi, pilihan variasi ukuran (S, M, L, XL, XXL) dan warna, indikator stok nyata, informasi etalase toko warga, tombol bagikan (WhatsApp, Facebook, Salin Tautan, dan Web Share API).

### 2. Keranjang & Pemesanan Terintegrasi WhatsApp
- **Validasi Stok Otomatis:** Sistem secara otomatis memvalidasi ketersediaan stok sebelum checkout dan mengurangi stok secara aman di database.
- **Metode Pembayaran:** Mendukung Transfer Bank/QRIS, COD (Bayar di Tempat khusus Parungkuda & Sukabumi), dan Ambil di Toko Warga.
- **Generator WhatsApp Otomatis:** Mengubah pesanan yang berhasil tersimpan di database menjadi format pesan WhatsApp terstruktur ke nomor WhatsApp pengelola lengkap dengan nomor unik (`KRW-YYYYMMDD-XXXX`), daftar barang, varian, dan alamat pengiriman.
- **Nota & Lacak Pesanan:** Pelanggan dapat melacak tahapan pesanan (*Menunggu Konfirmasi*, *Dikonfirmasi*, *Diproses*, *Siap Dikirim*, *Dikirim*, *Selesai*) dan mencetak nota pesanan.

### 3. Portal Penjual UMKM (Seller)
- **Etalase Toko Warga:** Mengelola nama toko, kontak WhatsApp toko, dan alamat rumah produksi.
- **Pengajuan Produk Baru:** Menambah produk baru lengkap dengan foto, variasi ukuran, pilihan warna, harga, dan stok.
- **Kurasi Kualitas:** Produk baru otomatis berstatus *“Menunggu Persetujuan”* demi menjaga standar mutu sebelum tayang publik.
- **Manajemen Pesanan Masuk:** Melihat pesanan khusus produk miliknya dan memperbarui status pemrosesan.
- **Ringkasan Omset Penjualan:** Rekapitulasi nilai transaksi selesai secara riil.

### 4. Dashboard Pengelola (Admin)
- **Ringkasan Metrik (KPIs):** Total anggota terdaftar, penjual aktif, produk aktif, antrean kurasi produk, pesanan baru, dan total omset selesai.
- **Kurasi Produk:** Hak menyetujui, menolak, mengaktifkan, atau menonaktifkan produk.
- **Manajemen Pesanan:** Memperbarui tahapan pesanan, mencatat status verifikasi pembayaran (`Belum Dibayar`, `Menunggu Verifikasi`, `Lunas`), dan menyimpan nomor referensi bank.
- **Ekspor Laporan CSV:** Mengunduh seluruh rekap pesanan ke dalam file CSV untuk arsip pembukuan RT/RW atau koperasi.
- **Manajemen Anggota:** Memberikan otorisasi status penjual UMKM atau menangguhkan akun yang melanggar.
### 5. Pengelolaan Foto Produk & Fitur Edit (Koreksi Data)
- **Unggah Foto Sendiri Secara Langsung:** Penjual dapat langsung memilih file foto dari galeri HP atau komputer (`JPG`, `PNG`, `WEBP`) dengan pratinjau instan (*live preview*), tanpa memerlukan keahlian teknis hosting gambar.
- **Petunjuk Pemotretan Produk Fashion:** Dilengkapi modal panduan khusus (*Petunjuk Foto Produk*) yang memuat tips pencahayaan alami, latar belakang bersih, proporsi gambar (rasio 4:3 atau 1:1), dan kerapian pakaian.
- **Ikon Edit (Koreksi Data Keliru):** Tombol aksi ikon pensil (`Edit3`) tersedia di tabel produk penjual, tabel dashboard admin, dan jendela detail produk. Memungkinkan pengubahan nama produk, kategori, harga, jumlah stok, variasi ukuran/warna, deskripsi, serta penggantian foto produk secara cepat dan aman.

---

## 🛠️ Arsitektur Teknologi

- **Frontend:** React 19 + TypeScript + Vite
- **Desain UI:** Tailwind CSS v4, mobile-first, mengikuti prinsip anti-slop dengan font *Plus Jakarta Sans* & *Playfair Display*, palet warna hijau tua hutan (`#1e4535`), krem natural (`#faf8f5`), dan aksen terracotta (`#c86d44`).
- **Icons:** Lucide React
- **Backend & Database:** Supabase Free Plan (PostgreSQL) dengan Row Level Security (RLS) dan Trigger Otomatis.
- **Hosting Frontend:** Vercel / Netlify (konfigurasi rewrite bebas error 404 pada refresh).

---

## 🚀 Panduan Instalasi Lokal

1. **Clone repository:**
   ```bash
   git clone https://github.com/username/kampoeng-raksukan.git
   cd kampoeng-raksukan
   ```

2. **Pasang dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment:**
   Salin file `.env.example` menjadi `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Isi konfigurasi Supabase Anda (lihat bagian bawah).

4. **Jalankan server pengembangan:**
   ```bash
   npm run dev
   ```
   Buka peramban di `http://localhost:3000`.

---

## 🗄️ Menjalankan Skema Database Supabase

1. Buat proyek baru di [Supabase Dashboard](https://supabase.com).
2. Buka menu **SQL Editor** pada project Supabase Anda.
3. Buka file `supabase_schema.sql` pada proyek ini, salin seluruh kodenya, lalu tempelkan ke SQL Editor Supabase.
4. Klik **Run** untuk mengeksekusi migrasi.
   - Tabel `profiles`, `user_roles`, `stores`, `categories`, `products`, `product_variants`, `orders`, `order_items`, `order_status_history`, dan `app_settings` akan dibuat lengkap dengan indeks performa, fungsi trigger pengurangan stok, dan aturan keamanan RLS!

---

## 🔑 Pengaturan Lingkungan (Environment Variables)

| Nama Variabel | Keterangan | Contoh Nilai |
|---|---|---|
| `VITE_SUPABASE_URL` | URL Proyek Supabase | `https://xyzcompany.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Public / Anon Key Supabase | `eyJhbGciOiJIUzI1Ni...` |
| `VITE_DEFAULT_MANAGER_WA` | Nomor WhatsApp pengelola default | `6281234567890` |

*Catatan Keamanan: Jangan pernah memasukkan `service_role key` atau password basis data ke dalam file frontend atau repositori publik.*

---

## 🔐 Akses Login & Kredensial Pengujian Akun (User & Password)

Untuk keamanan dan kenyamanan verifikasi, aplikasi menyediakan dialog autentikasi login menggunakan **Username atau Email** dan **Password** yang dilengkapi **icon mata** (`Eye`/`EyeOff`) untuk melihat atau menyembunyikan password yang diketik.

### Daftar Akun Resmi Setiap Peran:

| Peran (Role) | Nama Pengguna | Username | Email | Password | Hak Akses |
|---|---|---|---|---|---|
| **👑 Pengelola (Admin)** | Kang Hendra | `admin` | `admin.raksukan@wargaopat.id` | `adminraksukan2026` | Kurasi & persetujuan produk UMKM, verifikasi pesanan, ekspor CSV, manajemen anggota & pengaturan toko |
| **🏪 Penjual UMKM (Seller)** | Mang Asep Mulyana | `asep_batik` | `asep.batik@wargaopat.id` | `batikparungkuda` | Kelola etalase Rumah Batik Parungkuda, tambah produk dengan upload foto dari galeri HP, edit produk, pantau pesanan toko |
| **🛍️ Member Warga (Pembeli)** | Siti Nurhaliza | `siti_nurhaliza` | `siti.nur@gmail.com` | `wargaopat2026` | Belanja fashion warga, simpan wishlist favorit, lacak riwayat belanja, checkout otomatis ke WhatsApp |
| **👀 Tamu / Umum (Guest)** | Pengunjung Umum | *(Tanpa Login)* | *(Tanpa Login)* | *(Tanpa Login)* | Melihat katalog publik, detail produk, diarahkan login/daftar saat ingin checkout |

> **Fitur Keamanan & Kenyamanan:**
> - **Icon Mata (Toggle Password Visibility):** Tersedia pada kolom password login, password pendaftaran akun baru, serta pada tab profil akun member untuk memeriksa ejaan password secara aman.
> - **Pilihan Akun Demo 1-Klik:** Pada modal login, pengguna dapat mengklik kartu peran untuk otomatis mengisi kredensial dan langsung menguji autentikasi peran tersebut.

---

## 📄 Lisensi & Kontributor

Dikembangkan untuk kemajuan ekonomi warga dan UMKM Fashion Parungkuda, Kabupaten Sukabumi, Jawa Barat.  
Dilisensikan di bawah Apache-2.0 License.
