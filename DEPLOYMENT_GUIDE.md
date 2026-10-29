# PANDUAN DEPLOYMENT & ADMINISTRASI SISTEM
## Kampoeng Raksukan Warga Opat Parungkuda

Panduan langkah demi langkah untuk pemilik dan pengelola aplikasi dalam menghubungkan database Supabase, mengamankan hak akses pengelola (Admin), mendeploy aplikasi ke Vercel atau Netlify secara gratis, dan melakukan pencadangan data berkala.

---

### Bagian 1: Konfigurasi Supabase (Free Plan)

1. **Registrasi Akun:**
   - Kunjungi [supabase.com](https://supabase.com) dan buat akun gratis.
   - Klik **New Project**, tentukan nama proyek (misal: `kampoeng-raksukan-prod`) dan buat kata sandi database yang kuat.
   - Pilih region server terdekat: **Southeast Asia (Singapore)** untuk latensi terendah dari Indonesia.

2. **Eksekusi Migrasi Database:**
   - Masuk ke dashboard proyek, pilih menu **SQL Editor** pada bilah sisi kiri.
   - Buka file `supabase_schema.sql` dari repositori ini, salin seluruh isinya, lalu tempelkan ke editor.
   - Klik tombol **Run**. Tunggu hingga muncul pesan *Success*.

3. **Ambil Kredensial API:**
   - Buka menu **Project Settings** (ikon gerigi) -> **API**.
   - Salin **Project URL** (misal: `https://xxxx.supabase.co`).
   - Salin **Project API Keys (anon public)**.

---

### Bagian 2: Panduan Membuat Akun Admin Pertama Secara Aman

Peran admin (`admin`) **TIDAK PERNAH** dapat diberikan melalui formulir registrasi publik. Untuk mengangkat admin pertama:

1. Daftarkan diri Anda terlebih dahulu sebagai member melalui tombol **Daftar Member Baru** di aplikasi, atau buat pengguna di menu **Authentication -> Users** pada Supabase Dashboard dengan email Anda (misal: `pengelola@wargaopat.id`).
2. Dapatkan UUID pengguna Anda dari tabel `auth.users` atau `public.profiles`.
3. Buka menu **SQL Editor** di Supabase, lalu jalankan query berikut:
   ```sql
   -- Mengangkat akun menjadi Pengelola (Admin)
   INSERT INTO public.user_roles (user_id, role)
   VALUES ('MASUKKAN_UUID_PENGGUNA_DISINI', 'admin')
   ON CONFLICT (user_id, role) DO NOTHING;
   ```
4. Setelah query selesai dieksekusi, akun tersebut telah memiliki hak akses penuh ke menu **Dashboard Pengelola** untuk melakukan kurasi produk, manajemen pesanan, dan ekspor laporan keuangan.

---

### Bagian 3: Deployment ke Vercel (Gratis)

1. **Push Source Code ke GitHub:**
   - Buat repositori baru di GitHub (misal: `kampoeng-raksukan`).
   - Unggah seluruh source code proyek ini ke repositori tersebut.
2. **Koneksikan ke Vercel:**
   - Masuk ke [vercel.com](https://vercel.com) menggunakan akun GitHub Anda.
   - Klik **Add New...** -> **Project**, lalu impor repositori `kampoeng-raksukan`.
3. **Konfigurasi Build & Environment Variables:**
   - Framework Preset: **Vite**
   - Masukkan Environment Variables berikut:
     * `VITE_SUPABASE_URL`: (URL proyek Supabase Anda)
     * `VITE_SUPABASE_ANON_KEY`: (Anon key Supabase Anda)
     * `VITE_DEFAULT_MANAGER_WA`: `6281234567890` (Ganti dengan nomor WhatsApp aktif pengelola)
4. **Deploy:**
   - Klik **Deploy**.
   - Berkat file `vercel.json` yang telah disediakan, URL halaman produk dan navigasi dapat di-refresh tanpa kendala error 404.

---

### Bagian 4: Deployment ke Netlify (Gratis Alternatif)

1. Masuk ke [netlify.com](https://netlify.com) dan pilih **Add new site** -> **Import an existing project**.
2. Pilih penyedia Git (GitHub) dan pilih repositori proyek ini.
3. Konfigurasi build:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Masukkan environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_DEFAULT_MANAGER_WA`
5. File `public/_redirects` otomatis mencegah halaman 404 saat pengguna melakukan refresh atau membuka tautan langsung.

---

### Bagian 5: Konfigurasi Domain Kustom & HTTPS

1. Di dashboard Vercel / Netlify, buka menu **Settings** -> **Domains**.
2. Masukkan domain Anda, contoh: `toko.wargaopat.id` atau `kampoengraksukan.com`.
3. Tambahkan DNS Record pada penyedia domain Anda:
   - Tipe `CNAME` mengarah ke target yang diberikan (misal: `cname.vercel-dns.com`).
4. Sertifikat SSL/HTTPS akan diterbitkan secara otomatis dan gratis.

---

### Bagian 6: Panduan Backup & Ekspor Database

1. **Ekspor CSV Cepat dari Aplikasi:**
   - Masuk sebagai Admin ke menu **Dashboard Admin -> Manajemen Pesanan**.
   - Klik tombol **Ekspor CSV**. File rekapitulasi transaksi otomatis terunduh ke komputer Anda.
2. **Backup Penuh Database via Supabase:**
   - Buka **Supabase Dashboard -> Database -> Backups**.
   - Unduh file cadangan mingguan atau gunakan utilitas CLI `pg_dump`:
     ```bash
     pg_dump -h db.xxxx.supabase.co -U postgres -d postgres > backup_kampoeng_raksukan.sql
     ```

---

### Bagian 7: Checklist Pengujian Sistem (14 Skenario Wajib)

| No | Skenario Pengujian | Hasil yang Diharapkan | Status |
|---|---|---|---|
| 1 | Buka Landing Page Publik | Menampilkan hero fashion, produk pilihan, dan kategori tanpa login | ✅ Lulus |
| 2 | Pencarian & Filter Katalog | Pencarian nama produk & filter harga/stok memperbarui daftar | ✅ Lulus |
| 3 | Registrasi Member Baru | Form memvalidasi WhatsApp & persetujuan syarat penggunaan | ✅ Lulus |
| 4 | Keranjang Belanja | Tambah, ubah jumlah barang, dan hapus item dari keranjang | ✅ Lulus |
| 5 | Checkout Pemesanan | Memeriksa stok barang, nomor pesanan unik `KRW-...` terbentuk | ✅ Lulus |
| 6 | Integrasi WhatsApp | Membuka link `wa.me` dengan pesan pesanan terformat lengkap | ✅ Lulus |
| 7 | Pengurangan Stok Aman | Stok produk berkurang otomatis dan dicegah dari angka minus | ✅ Lulus |
| 8 | Lacak Pesanan | Pembeli dapat melacak tahapan pesanan menggunakan nomor order | ✅ Lulus |
| 9 | Pengajuan Produk Penjual | Produk baru berstatus *"Menunggu Persetujuan"* (belum tayang) | ✅ Lulus |
| 10 | Kurasi Produk oleh Admin | Admin menyetujui produk; produk langsung muncul di katalog | ✅ Lulus |
| 11 | Pembaruan Status Transaksi | Admin memperbarui status pesanan & status pembayaran lunas | ✅ Lulus |
| 12 | Ekspor Laporan CSV | Mengunduh file `.csv` dengan seluruh kolom transaksi valid | ✅ Lulus |
| 13 | Pengaturan Toko & Kontak | Penggantian nomor WA pengelola langsung mengubah target chat | ✅ Lulus |
| 14 | Refresh Halaman di Hosting | Tidak terjadi error 404 berkat rule rewrite routing SPA | ✅ Lulus |
| 15 | Unggah Foto Produk Sendiri | Memilih file foto dari galeri HP/laptop langsung muncul preview | ✅ Lulus |
| 16 | Edit & Koreksi Data Produk | Ikon pensil (Edit) membuka form koreksi dan perubahan tersimpan | ✅ Lulus |
