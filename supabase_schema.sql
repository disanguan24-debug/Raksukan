-- ============================================================================
-- KAMPOENG RAKSUKAN WARGA OPAT PARUNGKUDA - SUPABASE POSTGRESQL SCHEMA
-- Skema Database Lengkap, Relasional, Indeks, Triggers & Row Level Security (RLS)
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL: PROFILES
-- Menyimpan informasi profil member warga dan pengguna
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nama TEXT NOT NULL,
    email TEXT NOT NULL,
    nomor_whatsapp TEXT NOT NULL,
    alamat TEXT NOT NULL,
    status_member TEXT NOT NULL DEFAULT 'aktif' CHECK (status_member IN ('menunggu_verifikasi', 'aktif', 'ditangguhkan')),
    foto_avatar TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. TABEL: USER_ROLES
-- Relasi peran pengguna (admin, seller, member). Role admin tidak boleh diinput via form publik.
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'seller', 'member')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, role)
);

-- 4. TABEL: STORES
-- Menyimpan data etalase/toko milik anggota penjual UMKM
CREATE TABLE IF NOT EXISTS public.stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    nama_toko TEXT NOT NULL,
    deskripsi TEXT,
    nomor_kontak TEXT,
    alamat_toko TEXT,
    status TEXT NOT NULL DEFAULT 'aktif' CHECK (status IN ('menunggu_persetujuan', 'aktif', 'nonaktif')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(owner_id)
);

-- 5. TABEL: CATEGORIES
-- Kategori produk fashion
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_kategori TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
    urutan INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. TABEL: PRODUCTS
-- Data produk fashion UMKM
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    nama_produk TEXT NOT NULL,
    slug TEXT NOT NULL,
    deskripsi TEXT NOT NULL,
    harga NUMERIC(12, 2) NOT NULL CHECK (harga >= 0),
    stok INTEGER NOT NULL DEFAULT 0 CHECK (stok >= 0),
    foto TEXT[] NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'menunggu_persetujuan' CHECK (status IN ('menunggu_persetujuan', 'aktif', 'ditolak', 'nonaktif')),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    terjual_count INTEGER NOT NULL DEFAULT 0 CHECK (terjual_count >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. TABEL: PRODUCT_VARIANTS
-- Pilihan variasi ukuran dan warna produk
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    ukuran TEXT,
    warna TEXT,
    stok INTEGER NOT NULL DEFAULT 0 CHECK (stok >= 0),
    harga_tambahan NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (harga_tambahan >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. TABEL: CART_ITEMS
-- Keranjang belanja pengguna
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. TABEL: ORDERS
-- Pesanan pelanggan
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    buyer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    nama_pembeli TEXT NOT NULL,
    nomor_whatsapp TEXT NOT NULL,
    alamat_pengiriman TEXT NOT NULL,
    catatan TEXT,
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    biaya_pengiriman NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (biaya_pengiriman >= 0),
    total NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
    status TEXT NOT NULL DEFAULT 'menunggu_konfirmasi' CHECK (status IN ('menunggu_konfirmasi', 'dikonfirmasi', 'diproses', 'siap_dikirim', 'dikirim', 'selesai', 'dibatalkan')),
    payment_method TEXT NOT NULL DEFAULT 'transfer_bank' CHECK (payment_method IN ('transfer_bank', 'cod', 'tunai_toko')),
    payment_status TEXT NOT NULL DEFAULT 'belum_dibayar' CHECK (payment_status IN ('belum_dibayar', 'menunggu_verifikasi', 'lunas', 'dibatalkan')),
    payment_reference TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. TABEL: ORDER_ITEMS
-- Snapshot item pesanan (nama & harga tidak berubah walau produk di-edit)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    seller_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    store_id UUID REFERENCES public.stores(id) ON DELETE SET NULL,
    nama_produk_snapshot TEXT NOT NULL,
    harga_snapshot NUMERIC(12, 2) NOT NULL CHECK (harga_snapshot >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    variant_snapshot TEXT,
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0)
);

-- 11. TABEL: ORDER_STATUS_HISTORY
-- Riwayat perubahan status pesanan
CREATE TABLE IF NOT EXISTS public.order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    catatan TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. TABEL: APP_SETTINGS
-- Pengaturan toko & informasi kontak marketplace
CREATE TABLE IF NOT EXISTS public.app_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- INDEKS PERFORMA & QUERY
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_store ON public.products(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON public.orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_seller ON public.order_items(seller_id);
CREATE INDEX IF NOT EXISTS idx_cart_user ON public.cart_items(user_id);

-- ============================================================================
-- FUNGSI & TRIGGER OTOMATISASI PENGURANGAN STOK SECARA AMAN
-- ============================================================================
CREATE OR REPLACE FUNCTION public.process_order_stock_reduction()
RETURNS TRIGGER AS $$
DECLARE
    item RECORD;
BEGIN
    FOR item IN
        SELECT product_id, quantity, variant_snapshot 
        FROM public.order_items 
        WHERE order_id = NEW.id
    LOOP
        -- Kurangi stok produk utama
        UPDATE public.products
        SET stok = stok - item.quantity,
            terjual_count = terjual_count + item.quantity
        WHERE id = item.product_id AND stok >= item.quantity;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Stok produk tidak mencukupi untuk pesanan %', NEW.order_number;
        END IF;
    END LOOP;

    -- Catat riwayat status pertama
    INSERT INTO public.order_status_history (order_id, status, catatan)
    VALUES (NEW.id, NEW.status, 'Pesanan dibuat oleh pembeli.');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_order_stock_reduction ON public.orders;
CREATE TRIGGER trigger_order_stock_reduction
    AFTER INSERT ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.process_order_stock_reduction();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Helper Function: Check Admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_roles.user_id = $1 AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Publik dapat membaca profil dasar penjual"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Pengguna dapat mengelola profil sendiri"
    ON public.profiles FOR ALL
    USING (auth.uid() = id);

-- Categories Policies
CREATE POLICY "Semua orang dapat membaca kategori aktif"
    ON public.categories FOR SELECT
    USING (status = 'aktif' OR public.is_admin(auth.uid()));

CREATE POLICY "Hanya admin yang dapat mengelola kategori"
    ON public.categories FOR ALL
    USING (public.is_admin(auth.uid()));

-- Stores Policies
CREATE POLICY "Publik dapat membaca toko aktif"
    ON public.stores FOR SELECT
    USING (status = 'aktif' OR owner_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Pemilik dapat mengelola toko sendiri"
    ON public.stores FOR ALL
    USING (owner_id = auth.uid() OR public.is_admin(auth.uid()));

-- Products Policies
CREATE POLICY "Publik dapat melihat produk yang disetujui dan aktif"
    ON public.products FOR SELECT
    USING (
        status = 'aktif' 
        OR store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid())
        OR public.is_admin(auth.uid())
    );

CREATE POLICY "Penjual dapat membuat dan mengedit produk di toko miliknya"
    ON public.products FOR ALL
    USING (
        store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid())
        OR public.is_admin(auth.uid())
    );

-- Orders Policies
CREATE POLICY "Pembeli dapat melihat pesanan mereka"
    ON public.orders FOR SELECT
    USING (buyer_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Pembeli dapat membuat pesanan"
    ON public.orders FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admin dapat mengelola seluruh pesanan"
    ON public.orders FOR ALL
    USING (public.is_admin(auth.uid()));

-- Order Items Policies
CREATE POLICY "Pembeli dan Penjual terkait dapat melihat item pesanan"
    ON public.order_items FOR SELECT
    USING (
        order_id IN (SELECT id FROM public.orders WHERE buyer_id = auth.uid())
        OR seller_id = auth.uid()
        OR public.is_admin(auth.uid())
    );

-- App Settings
CREATE POLICY "Publik dapat membaca pengaturan aplikasi"
    ON public.app_settings FOR SELECT
    USING (true);

CREATE POLICY "Hanya admin dapat mengelola pengaturan"
    ON public.app_settings FOR ALL
    USING (public.is_admin(auth.uid()));

-- ============================================================================
-- SEED DATA AWAL: KATEGORI & PENGATURAN TOKO
-- ============================================================================
INSERT INTO public.categories (nama_kategori, slug, urutan) VALUES
('Pakaian Pria', 'pakaian-pria', 1),
('Pakaian Wanita', 'pakaian-wanita', 2),
('Busana Muslim & Muslimah', 'busana-muslim', 3),
('Hijab & Aksesori', 'hijab-aksesori', 4),
('Pakaian Anak', 'pakaian-anak', 5),
('Kaos, Kemeja & Celana', 'kaos-kemeja-celana', 6),
('Tas & Dompet', 'tas-dompet', 7),
('Sepatu & Sandal', 'sepatu-sandal', 8),
('Produk Handmade', 'produk-handmade', 9),
('Produk Fashion Lainnya', 'fashion-lainnya', 10)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.app_settings (key, value) VALUES
('store_info', '{
    "nama_marketplace": "Kampoeng Raksukan Warga Opat Parungkuda",
    "tagline": "Produk Fashion Warga, Karya Lokal, Peluang Global",
    "nomor_whatsapp": "6281234567890",
    "alamat": "Komplek Warga Opat, Parungkuda, Kabupaten Sukabumi, Jawa Barat 43357",
    "email_kontak": "kampoengraksukan.warga4@gmail.com",
    "biaya_ongkir_flat": 15000,
    "pesan_wa_template": "Halo Admin Kampoeng Raksukan Warga Opat, saya mau konfirmasi pesanan fashion lokal:"
}'::jsonb)
ON CONFLICT (key) DO NOTHING;
