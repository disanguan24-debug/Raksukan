import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_SETTINGS,
  INITIAL_STORES,
  INITIAL_USERS,
} from '../data/initialData';
import {
  AppSettings,
  Category,
  Order,
  Product,
  Store,
  UserProfile,
} from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project') &&
    !supabaseAnonKey.includes('...')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local persistence storage keys
const STORAGE_KEYS = {
  PRODUCTS: 'krw_products_v1',
  CATEGORIES: 'krw_categories_v1',
  STORES: 'krw_stores_v1',
  USERS: 'krw_users_v1',
  ORDERS: 'krw_orders_v1',
  SETTINGS: 'krw_settings_v1',
  WISHLIST: 'krw_wishlist_v1',
  CURRENT_USER_ID: 'krw_current_user_id_v1',
};

// Safe JSON loader
function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Error reading storage key ${key}:`, err);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error saving storage key ${key}:`, err);
  }
}

// Data Service Layer
export const storageService = {
  getProducts(): Product[] {
    const stored = loadFromStorage<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    if (stored.length === 0) {
      saveToStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      return INITIAL_PRODUCTS;
    }
    return stored;
  },

  saveProducts(products: Product[]) {
    saveToStorage(STORAGE_KEYS.PRODUCTS, products);
  },

  getCategories(): Category[] {
    const stored = loadFromStorage<Category[]>(STORAGE_KEYS.CATEGORIES, []);
    if (stored.length === 0) {
      saveToStorage(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
      return INITIAL_CATEGORIES;
    }
    return stored;
  },

  saveCategories(categories: Category[]) {
    saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
  },

  getStores(): Store[] {
    const stored = loadFromStorage<Store[]>(STORAGE_KEYS.STORES, []);
    if (stored.length === 0) {
      saveToStorage(STORAGE_KEYS.STORES, INITIAL_STORES);
      return INITIAL_STORES;
    }
    return stored;
  },

  saveStores(stores: Store[]) {
    saveToStorage(STORAGE_KEYS.STORES, stores);
  },

  getUsers(): UserProfile[] {
    const stored = loadFromStorage<UserProfile[]>(STORAGE_KEYS.USERS, []);
    const updated = [...stored];

    // Ensure all INITIAL_USERS exist and always have valid username, password, and distinct roles
    INITIAL_USERS.forEach((initUser) => {
      const idx = updated.findIndex(
        (u) =>
          u.id === initUser.id ||
          (u.email && u.email.toLowerCase() === initUser.email.toLowerCase()) ||
          (u.username && initUser.username && u.username.toLowerCase() === initUser.username.toLowerCase())
      );
      if (idx === -1) {
        updated.push(initUser);
      } else {
        updated[idx] = {
          ...initUser,
          ...updated[idx],
          username: initUser.username,
          password: initUser.password,
          roles: initUser.roles,
          status_member: updated[idx].status_member || 'aktif',
          nama: updated[idx].nama || initUser.nama,
        };
      }
    });

    saveToStorage(STORAGE_KEYS.USERS, updated);
    return updated;
  },

  saveUsers(users: UserProfile[]) {
    saveToStorage(STORAGE_KEYS.USERS, users);
  },

  getOrders(): Order[] {
    return loadFromStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
  },

  saveOrders(orders: Order[]) {
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
  },

  getSettings(): AppSettings {
    const stored = loadFromStorage<AppSettings | null>(STORAGE_KEYS.SETTINGS, null);
    if (!stored) {
      saveToStorage(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
      return INITIAL_SETTINGS;
    }
    return stored;
  },

  saveSettings(settings: AppSettings) {
    saveToStorage(STORAGE_KEYS.SETTINGS, settings);
  },

  getWishlist(): string[] {
    return loadFromStorage<string[]>(STORAGE_KEYS.WISHLIST, []);
  },

  saveWishlist(ids: string[]) {
    saveToStorage(STORAGE_KEYS.WISHLIST, ids);
  },

  getCurrentUserId(): string | null {
    return loadFromStorage<string | null>(STORAGE_KEYS.CURRENT_USER_ID, 'user-admin-1');
  },

  saveCurrentUserId(id: string | null) {
    saveToStorage(STORAGE_KEYS.CURRENT_USER_ID, id);
  },
};
