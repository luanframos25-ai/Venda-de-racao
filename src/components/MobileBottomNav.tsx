import React from 'react';
import { Grid, Heart, Home, Search, ShoppingBag } from 'lucide-react';

interface MobileBottomNavProps {
  cartCount: number;
  favoritesCount: number;
  onNavigateHome: () => void;
  onNavigateCategories: () => void;
  onFocusSearch: () => void;
  onOpenFavorites: () => void;
  onOpenCart: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cartCount,
  favoritesCount,
  onNavigateHome,
  onNavigateCategories,
  onFocusSearch,
  onOpenFavorites,
  onOpenCart,
}) => {
  return (
    <nav
      aria-label="Navegação rápida móvel"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#30483A]/12 px-2 py-1.5 flex items-center justify-around shadow-[0_-4px_20px_rgba(48,72,58,0.06)]"
    >
      <button
        type="button"
        onClick={onNavigateHome}
        className="flex flex-col items-center justify-center min-w-[54px] min-h-[44px] text-[#30483A]/80 hover:text-[#30483A] gap-0.5"
      >
        <Home className="w-5 h-5" />
        <span className="text-[11px] font-semibold">Início</span>
      </button>

      <button
        type="button"
        onClick={onNavigateCategories}
        className="flex flex-col items-center justify-center min-w-[54px] min-h-[44px] text-[#30483A]/80 hover:text-[#30483A] gap-0.5"
      >
        <Grid className="w-5 h-5" />
        <span className="text-[11px] font-semibold">Categorias</span>
      </button>

      <button
        type="button"
        onClick={onFocusSearch}
        className="flex flex-col items-center justify-center min-w-[54px] min-h-[44px] text-[#30483A]/80 hover:text-[#30483A] gap-0.5"
      >
        <Search className="w-5 h-5" />
        <span className="text-[11px] font-semibold">Pesquisa</span>
      </button>

      <button
        type="button"
        onClick={onOpenFavorites}
        className="relative flex flex-col items-center justify-center min-w-[54px] min-h-[44px] text-[#30483A]/80 hover:text-[#30483A] gap-0.5"
      >
        <Heart className="w-5 h-5" />
        <span className="text-[11px] font-semibold">Favoritos</span>
        {favoritesCount > 0 && (
          <span className="absolute top-0.5 right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-[#F4AD73] text-[#30483A] text-[10px] font-bold flex items-center justify-center tabular-nums">
            {favoritesCount}
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={onOpenCart}
        className="relative flex flex-col items-center justify-center min-w-[54px] min-h-[44px] text-[#30483A] gap-0.5"
      >
        <ShoppingBag className="w-5 h-5" />
        <span className="text-[11px] font-bold">Carrinho</span>
        {cartCount > 0 && (
          <span className="absolute top-0.5 right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-[#30483A] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
            {cartCount}
          </span>
        )}
      </button>
    </nav>
  );
};
