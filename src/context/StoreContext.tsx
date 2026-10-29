import React, { createContext, useContext, useEffect, useState } from 'react';
import { INITIAL_USERS } from '../data/initialData';
import { generateOrderNumber } from '../lib/formatters';
import { storageService } from '../lib/supabase';
import {
  AppSettings,
  CartItem,
  Category,
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Product,
  Store,
  UserProfile,
  UserRole,
} from '../types';

interface CheckoutPayload {
  nama_pembeli: string;
  nomor_whatsapp: string;
  alamat_pengiriman: string;
  catatan?: string;
  payment_method: PaymentMethod;
}

interface StoreContextType {
  // Navigation & Modal views
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  lastCreatedOrder: Order | null;
  setLastCreatedOrder: (order: Order | null) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;

  // Auth & Roles
  currentUser: UserProfile | null;
  users: UserProfile[];
  isAdmin: boolean;
  isSeller: boolean;
  roleSwitchNotice: string | null;
  setRoleSwitchNotice: (notice: string | null) => void;
  switchDemoUser: (role: UserRole | 'guest') => void;
  loginUser: (identifier: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  registerUser: (data: {
    nama: string;
    email: string;
    nomor_whatsapp: string;
    alamat: string;
    password?: string;
    username?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logoutUser: () => void;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  toggleUserMemberStatus: (userId: string, status: 'aktif' | 'ditangguhkan') => void;
  approveUserAsSeller: (userId: string) => void;

  // Stores
  stores: Store[];
  currentStore: Store | null;
  registerOrUpdateStore: (data: {
    nama_toko: string;
    deskripsi: string;
    nomor_kontak: string;
    alamat_toko: string;
  }) => void;

  // Products
  products: Product[];
  activeProducts: Product[];
  categories: Category[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'terjual_count'>) => void;
  updateProductStatus: (
    productId: string,
    status: 'aktif' | 'ditolak' | 'nonaktif' | 'menunggu_persetujuan'
  ) => void;
  updateProduct: (productId: string, data: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;

  // Categories management
  addCategory: (name: string, slug: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, ukuran?: string, warna?: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;

  // Orders
  orders: Order[];
  buyerOrders: Order[];
  sellerOrders: Order[];
  createOrder: (payload: CheckoutPayload) => Promise<{ success: boolean; order?: Order; error?: string }>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updatePaymentStatus: (orderId: string, paymentStatus: PaymentStatus, referenceNote?: string) => void;

  // Settings
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation states
  const [currentView, setCurrentView] = useState<string>('beranda');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [roleSwitchNotice, setRoleSwitchNotice] = useState<string | null>(null);

  // Entities
  const [users, setUsers] = useState<UserProfile[]>(() => storageService.getUsers());
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => storageService.getCurrentUserId());
  const [stores, setStores] = useState<Store[]>(() => storageService.getStores());
  const [products, setProducts] = useState<Product[]>(() => storageService.getProducts());
  const [categories, setCategories] = useState<Category[]>(() => storageService.getCategories());
  const [orders, setOrders] = useState<Order[]>(() => storageService.getOrders());
  const [settings, setSettings] = useState<AppSettings>(() => storageService.getSettings());
  const [wishlist, setWishlist] = useState<string[]>(() => storageService.getWishlist());
  const [cart, setCart] = useState<CartItem[]>([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Persistence side-effects
  useEffect(() => {
    storageService.saveProducts(products);
  }, [products]);

  useEffect(() => {
    storageService.saveCategories(categories);
  }, [categories]);

  useEffect(() => {
    storageService.saveStores(stores);
  }, [stores]);

  useEffect(() => {
    storageService.saveUsers(users);
  }, [users]);

  useEffect(() => {
    storageService.saveOrders(orders);
  }, [orders]);

  useEffect(() => {
    storageService.saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    storageService.saveWishlist(wishlist);
  }, [wishlist]);

  useEffect(() => {
    storageService.saveCurrentUserId(currentUserId);
  }, [currentUserId]);

  // Current user & roles
  const currentUser = users.find((u) => u.id === currentUserId) || null;
  const isAdmin = currentUser?.roles.includes('admin') ?? false;
  const isSeller = currentUser?.roles.includes('seller') ?? false;
  const currentStore = stores.find((s) => s.owner_id === currentUserId) || null;

  // Active products for storefront
  const activeProducts = products.filter((p) => p.status === 'aktif');

  // Orders filtered
  const buyerOrders = orders.filter((o) => o.buyer_id === currentUserId);
  const sellerOrders = orders.filter((o) =>
    o.items.some((item) => item.seller_id === currentUserId || (currentStore && item.store_id === currentStore.id))
  );

  // Switch demo user
  const switchDemoUser = (role: UserRole | 'guest') => {
    if (role === 'guest') {
      setCurrentUserId(null);
      if (['admin', 'seller', 'akun'].includes(currentView)) {
        setCurrentView('beranda');
      }
      setRoleSwitchNotice('Mode Tamu / Pengunjung Umum aktif (Belum Login).');
      setTimeout(() => setRoleSwitchNotice(null), 3500);
      return;
    }

    if (role === 'admin') {
      let admin = users.find((u) => u.id === 'user-admin-1') || users.find((u) => u.roles.includes('admin'));
      if (!admin) {
        admin = {
          id: 'user-admin-1',
          username: 'admin',
          password: 'adminraksukan2026',
          nama: 'Kang Hendra (Pengelola)',
          email: 'admin.raksukan@wargaopat.id',
          nomor_whatsapp: '081234567890',
          alamat: 'Sekretariat RW 04 Parungkuda, Sukabumi',
          status_member: 'aktif',
          roles: ['admin'],
          created_at: new Date().toISOString(),
        };
        setUsers((prev) => [admin!, ...prev.filter((u) => u.id !== 'user-admin-1')]);
      } else if (!admin.username || !admin.password) {
        admin = { ...admin, username: 'admin', password: 'adminraksukan2026' };
        setUsers((prev) => prev.map((u) => (u.id === admin!.id ? admin! : u)));
      }
      setCurrentUserId(admin.id);
      setCurrentView('admin');
      setRoleSwitchNotice(`Beralih ke Peran: Pengelola / Admin (${admin.nama}).`);
      setTimeout(() => setRoleSwitchNotice(null), 3500);
      return;
    }

    if (role === 'seller') {
      let seller = users.find((u) => u.id === 'user-seller-1') || users.find((u) => u.roles.includes('seller') && !u.roles.includes('admin'));
      if (!seller) {
        seller = {
          id: 'user-seller-1',
          username: 'asep_batik',
          password: 'batikparungkuda',
          nama: 'Mang Asep Mulyana',
          email: 'asep.batik@wargaopat.id',
          nomor_whatsapp: '081288991122',
          alamat: 'RT 02/04 Parungkuda, Sukabumi',
          status_member: 'aktif',
          roles: ['seller'],
          created_at: new Date().toISOString(),
        };
        setUsers((prev) => [...prev.filter((u) => u.id !== 'user-seller-1'), seller!]);
      } else if (!seller.username || !seller.password) {
        seller = { ...seller, username: 'asep_batik', password: 'batikparungkuda' };
        setUsers((prev) => prev.map((u) => (u.id === seller!.id ? seller! : u)));
      }

      // Ensure store exists for seller
      const sellerStoreExists = stores.some((s) => s.owner_id === seller!.id);
      if (!sellerStoreExists) {
        const defaultStore: Store = {
          id: 'store-1',
          owner_id: seller.id,
          owner_name: seller.nama,
          nama_toko: 'Rumah Batik Parungkuda',
          deskripsi: 'Kerajinan batik tulis & cap kontemporer khas Parungkuda.',
          nomor_kontak: seller.nomor_whatsapp,
          alamat_toko: seller.alamat,
          status: 'aktif',
          created_at: new Date().toISOString(),
        };
        setStores((prev) => [...prev.filter((s) => s.id !== 'store-1'), defaultStore]);
      }

      setCurrentUserId(seller.id);
      setCurrentView('seller');
      setRoleSwitchNotice(`Beralih ke Peran: Penjual UMKM (${seller.nama} - Rumah Batik Parungkuda).`);
      setTimeout(() => setRoleSwitchNotice(null), 3500);
      return;
    }

    if (role === 'member') {
      let member = users.find((u) => u.id === 'user-member-1') || users.find((u) => u.roles.includes('member') && !u.roles.includes('admin') && !u.roles.includes('seller'));
      if (!member) {
        member = {
          id: 'user-member-1',
          username: 'siti_nurhaliza',
          password: 'wargaopat2026',
          nama: 'Siti Nurhaliza',
          email: 'siti.nur@gmail.com',
          nomor_whatsapp: '087811223344',
          alamat: 'Jl. Anggrek No. 12, Parungkuda, Sukabumi',
          status_member: 'aktif',
          roles: ['member'],
          created_at: new Date().toISOString(),
        };
        setUsers((prev) => [...prev.filter((u) => u.id !== 'user-member-1'), member!]);
      } else if (!member.username || !member.password) {
        member = { ...member, username: 'siti_nurhaliza', password: 'wargaopat2026' };
        setUsers((prev) => prev.map((u) => (u.id === member!.id ? member! : u)));
      }
      setCurrentUserId(member.id);
      if (['admin', 'seller'].includes(currentView)) {
        setCurrentView('beranda');
      }
      setRoleSwitchNotice(`Beralih ke Peran: Member Warga / Pembeli (${member.nama}).`);
      setTimeout(() => setRoleSwitchNotice(null), 3500);
      return;
    }
  };

  // Auth actions
  const loginUser = async (identifier: string, password?: string) => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanId) {
      return {
        success: false,
        error: 'Harap masukkan username atau email Anda.',
      };
    }

    // 1. Search in current state users
    let user = users.find(
      (u) =>
        (u.username && u.username.toLowerCase() === cleanId) ||
        (u.email && u.email.toLowerCase() === cleanId)
    );

    // 2. Fallback to INITIAL_USERS or role aliases if not found in state
    if (!user) {
      const initMatch = INITIAL_USERS.find(
        (u) =>
          (u.username && u.username.toLowerCase() === cleanId) ||
          (u.email && u.email.toLowerCase() === cleanId) ||
          (cleanId === 'admin' && u.roles.includes('admin')) ||
          ((cleanId === 'asep' || cleanId === 'seller') && u.roles.includes('seller')) ||
          ((cleanId === 'siti' || cleanId === 'member') && u.roles.includes('member'))
      );

      if (initMatch) {
        user = initMatch;
        setUsers((prev) => {
          const filtered = prev.filter(
            (u) => u.id !== initMatch.id && u.email.toLowerCase() !== initMatch.email.toLowerCase()
          );
          const next = [initMatch, ...filtered];
          storageService.saveUsers(next);
          return next;
        });
      }
    }

    if (!user) {
      return {
        success: false,
        error: `Akun "${identifier}" tidak ditemukan. Silakan gunakan username demo: "admin", "asep_batik", atau "siti_nurhaliza" (atau klik kartu akun demo yang tersedia).`,
      };
    }

    if (user.status_member === 'ditangguhkan') {
      return {
        success: false,
        error: 'Akun Anda sedang ditangguhkan oleh pengelola marketplace.',
      };
    }

    // Check password if user has password set
    if (user.password) {
      if (!cleanPass) {
        return {
          success: false,
          error: 'Password wajib diisi. Silakan masukkan password untuk akun ini.',
        };
      }
      if (user.password !== cleanPass) {
        return {
          success: false,
          error: `Password tidak cocok untuk ${user.nama}. Password demo akun ini adalah: "${user.password}". Klik icon mata pada kolom password untuk memeriksa ejaan.`,
        };
      }
    }

    setCurrentUserId(user.id);

    // Route based on role
    if (user.roles.includes('admin')) {
      setCurrentView('admin');
      setRoleSwitchNotice(`Berhasil masuk sebagai Pengelola: ${user.nama}`);
    } else if (user.roles.includes('seller')) {
      const sellerStoreExists = stores.some((s) => s.owner_id === user.id);
      if (!sellerStoreExists) {
        const defaultStore: Store = {
          id: `store-${Date.now()}`,
          owner_id: user.id,
          owner_name: user.nama,
          nama_toko: `Toko UMKM ${user.nama}`,
          deskripsi: 'Etalase busana & fashion karya warga Parungkuda.',
          nomor_kontak: user.nomor_whatsapp,
          alamat_toko: user.alamat,
          status: 'aktif',
          created_at: new Date().toISOString(),
        };
        setStores((prev) => [...prev, defaultStore]);
      }
      setCurrentView('seller');
      setRoleSwitchNotice(`Berhasil masuk sebagai Penjual UMKM: ${user.nama}`);
    } else {
      if (['admin', 'seller'].includes(currentView)) {
        setCurrentView('beranda');
      }
      setRoleSwitchNotice(`Berhasil masuk sebagai Member Warga: ${user.nama}`);
    }

    setTimeout(() => setRoleSwitchNotice(null), 3500);
    return { success: true };
  };

  const registerUser = async (data: {
    nama: string;
    email: string;
    nomor_whatsapp: string;
    alamat: string;
    password?: string;
    username?: string;
  }) => {
    const existing = users.find(
      (u) =>
        u.email.toLowerCase() === data.email.toLowerCase() ||
        (data.username && u.username?.toLowerCase() === data.username.toLowerCase())
    );
    if (existing) {
      return { success: false, error: 'Email atau username sudah terdaftar. Silakan login.' };
    }
    const derivedUsername =
      data.username ||
      data.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_');

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      username: derivedUsername,
      password: data.password || 'wargaopat2026',
      nama: data.nama,
      email: data.email,
      nomor_whatsapp: data.nomor_whatsapp,
      alamat: data.alamat,
      status_member: 'aktif',
      roles: ['member'],
      created_at: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    setRoleSwitchNotice(`Pendaftaran berhasil! Anda masuk sebagai Member Warga (${newUser.nama}).`);
    setTimeout(() => setRoleSwitchNotice(null), 3500);
    return { success: true };
  };

  const logoutUser = () => {
    setCurrentUserId(null);
  };

  const updateUserProfile = (data: Partial<UserProfile>) => {
    if (!currentUserId) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUserId ? { ...u, ...data } : u))
    );
  };

  const toggleUserMemberStatus = (userId: string, status: 'aktif' | 'ditangguhkan') => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status_member: status } : u))
    );
  };

  const approveUserAsSeller = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId && !u.roles.includes('seller')) {
          return { ...u, roles: [...u.roles, 'seller'] };
        }
        return u;
      })
    );
  };

  // Store Management
  const registerOrUpdateStore = (data: {
    nama_toko: string;
    deskripsi: string;
    nomor_kontak: string;
    alamat_toko: string;
  }) => {
    if (!currentUserId || !currentUser) return;
    const existing = stores.find((s) => s.owner_id === currentUserId);
    if (existing) {
      setStores((prev) =>
        prev.map((s) =>
          s.id === existing.id
            ? { ...s, ...data }
            : s
        )
      );
    } else {
      const newStore: Store = {
        id: `store-${Date.now()}`,
        owner_id: currentUserId,
        owner_name: currentUser.nama,
        nama_toko: data.nama_toko,
        deskripsi: data.deskripsi,
        nomor_kontak: data.nomor_kontak,
        alamat_toko: data.alamat_toko,
        status: 'aktif',
        created_at: new Date().toISOString(),
      };
      setStores((prev) => [...prev, newStore]);
      // Also ensure user has seller role
      if (!currentUser.roles.includes('seller')) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === currentUserId ? { ...u, roles: [...u.roles, 'seller'] } : u
          )
        );
      }
    }
  };

  // Products
  const addProduct = (item: Omit<Product, 'id' | 'created_at' | 'terjual_count'>) => {
    const newProduct: Product = {
      ...item,
      id: `prod-${Date.now()}`,
      created_at: new Date().toISOString(),
      terjual_count: 0,
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProductStatus = (
    productId: string,
    status: 'aktif' | 'ditolak' | 'nonaktif' | 'menunggu_persetujuan'
  ) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, status } : p))
    );
  };

  const updateProduct = (productId: string, data: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...data, updated_at: new Date().toISOString() } : p))
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Categories
  const addCategory = (nama_kategori: string, slug: string) => {
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      nama_kategori,
      slug,
      status: 'aktif',
      urutan: categories.length + 1,
    };
    setCategories((prev) => [...prev, newCat]);
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, ukuran?: string, warna?: string) => {
    setCart((prev) => {
      const matchIndex = prev.findIndex(
        (item) =>
          item.product_id === product.id &&
          item.selected_ukuran === (ukuran || '') &&
          item.selected_warna === (warna || '')
      );

      if (matchIndex > -1) {
        const next = [...prev];
        const existing = next[matchIndex];
        const newQty = existing.quantity + quantity;
        if (newQty > product.stok) {
          return prev; // capped at stock
        }
        next[matchIndex] = { ...existing, quantity: newQty };
        return next;
      }

      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        product_id: product.id,
        product,
        selected_ukuran: ukuran,
        selected_warna: warna,
        quantity: Math.min(quantity, product.stok),
        price_at_addition: product.harga,
      };
      return [...prev, newItem];
    });
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const maxStock = item.product.stok;
          return { ...item, quantity: Math.min(quantity, maxStock) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.harga * item.quantity, 0);

  // Create Order with stock validation & atomic reduction
  const createOrder = async (payload: CheckoutPayload): Promise<{ success: boolean; order?: Order; error?: string }> => {
    if (cart.length === 0) {
      return { success: false, error: 'Keranjang belanja kosong.' };
    }

    // Check stock for every cart item
    for (const item of cart) {
      const currentProduct = products.find((p) => p.id === item.product_id);
      if (!currentProduct) {
        return { success: false, error: `Produk "${item.product.nama_produk}" sudah tidak tersedia.` };
      }
      if (currentProduct.stok < item.quantity) {
        return {
          success: false,
          error: `Stok produk "${currentProduct.nama_produk}" tidak mencukupi (sisa ${currentProduct.stok} pcs).`,
        };
      }
    }

    // Build order items snapshots
    const orderItems: OrderItem[] = cart.map((item) => {
      const variantDesc = [item.selected_ukuran, item.selected_warna].filter(Boolean).join(', ');
      return {
        id: `oi-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        order_id: '',
        product_id: item.product_id,
        seller_id: item.product.store_id,
        store_id: item.product.store_id,
        nama_produk_snapshot: item.product.nama_produk,
        harga_snapshot: item.product.harga,
        quantity: item.quantity,
        variant_snapshot: variantDesc || 'Standar',
        subtotal: item.product.harga * item.quantity,
      };
    });

    const subtotal = cartSubtotal;
    const biaya_pengiriman = settings.biaya_ongkir_flat;
    const total = subtotal + biaya_pengiriman;
    const orderId = `order-${Date.now()}`;
    const orderNumber = generateOrderNumber();

    const newOrder: Order = {
      id: orderId,
      order_number: orderNumber,
      buyer_id: currentUserId || undefined,
      nama_pembeli: payload.nama_pembeli,
      nomor_whatsapp: payload.nomor_whatsapp,
      alamat_pengiriman: payload.alamat_pengiriman,
      catatan: payload.catatan,
      subtotal,
      biaya_pengiriman,
      total,
      status: 'menunggu_konfirmasi',
      payment_method: payload.payment_method,
      payment_status: 'belum_dibayar',
      items: orderItems.map((oi) => ({ ...oi, order_id: orderId })),
      created_at: new Date().toISOString(),
    };

    // Atomically reduce stock in state & increment terjual_count
    setProducts((prev) =>
      prev.map((prod) => {
        const cartMatched = cart.filter((c) => c.product_id === prod.id);
        if (cartMatched.length > 0) {
          const totalQtyBought = cartMatched.reduce((acc, c) => acc + c.quantity, 0);
          return {
            ...prod,
            stok: Math.max(0, prod.stok - totalQtyBought),
            terjual_count: prod.terjual_count + totalQtyBought,
          };
        }
        return prod;
      })
    );

    // Save order
    setOrders((prev) => [newOrder, ...prev]);
    setLastCreatedOrder(newOrder);
    clearCart();

    return { success: true, order: newOrder };
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status, updated_at: new Date().toISOString() }
          : o
      )
    );
  };

  const updatePaymentStatus = (
    orderId: string,
    paymentStatus: PaymentStatus,
    referenceNote?: string
  ) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              payment_status: paymentStatus,
              payment_reference: referenceNote ?? o.payment_reference,
              updated_at: new Date().toISOString(),
            }
          : o
      )
    );
  };

  // Settings
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedProduct,
        setSelectedProduct,
        lastCreatedOrder,
        setLastCreatedOrder,
        authModalOpen,
        setAuthModalOpen,

        currentUser,
        users,
        isAdmin,
        isSeller,
        roleSwitchNotice,
        setRoleSwitchNotice,
        switchDemoUser,
        loginUser,
        registerUser,
        logoutUser,
        updateUserProfile,
        toggleUserMemberStatus,
        approveUserAsSeller,

        stores,
        currentStore,
        registerOrUpdateStore,

        products,
        activeProducts,
        categories,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        addProduct,
        updateProductStatus,
        updateProduct,
        deleteProduct,

        addCategory,

        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,

        orders,
        buyerOrders,
        sellerOrders,
        createOrder,
        updateOrderStatus,
        updatePaymentStatus,

        settings,
        updateSettings,

        wishlist,
        toggleWishlist,
        isWishlisted,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
