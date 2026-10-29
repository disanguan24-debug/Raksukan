import React from 'react';
import { Home, Grid, ShoppingBag, Package, User } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const BottomNav: React.FC = () => {
  const { currentView, setCurrentView, cartCount } = useStore();

  const navItems = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'katalog', label: 'Katalog', icon: Grid },
    { id: 'keranjang', label: 'Keranjang', icon: ShoppingBag, badge: cartCount },
    { id: 'pesanan', label: 'Pesanan', icon: Package },
    { id: 'akun', label: 'Akun', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#faf8f5]/95 backdrop-blur-md border-t border-[#e2d8c3] px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center py-1 px-2 min-w-[56px] relative transition-colors ${
                isActive ? 'text-[#1e4535]' : 'text-[#857b6f] hover:text-[#1e4535]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#c86d44] text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center tabular-nums">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight ${
                  isActive ? 'font-bold text-[#1e4535]' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
