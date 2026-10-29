/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AccountProfileView } from './components/AccountProfileView';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { BottomNav } from './components/BottomNav';
import { CartView } from './components/CartView';
import { CatalogView } from './components/CatalogView';
import { Footer } from './components/Footer';
import { LandingHome } from './components/LandingHome';
import { Navbar } from './components/Navbar';
import { OrderConfirmationView } from './components/OrderConfirmationView';
import { OrderTrackingView } from './components/OrderTrackingView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SellerDashboard } from './components/SellerDashboard';
import { StoreProvider, useStore } from './context/StoreContext';

const MainLayout: React.FC = () => {
  const { currentView, selectedProduct, setSelectedProduct } = useStore();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-[#1c2420]">
      {/* Top Header & Navbar */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'beranda' && <LandingHome />}
        {currentView === 'katalog' && <CatalogView />}
        {currentView === 'keranjang' && <CartView />}
        {currentView === 'pesanan' && <OrderTrackingView />}
        {currentView === 'konfirmasi' && <OrderConfirmationView />}
        {currentView === 'seller' && <SellerDashboard />}
        {currentView === 'admin' && <AdminDashboard />}
        {currentView === 'akun' && <AccountProfileView />}
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Auth Modal */}
      <AuthModal />

      {/* Desktop/Tablet Footer */}
      <Footer />

      {/* Mobile-Only Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}
