import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import { formatBRL } from '../data/catalog';
import { Product } from '../types/store';
import { BrandLogoMark } from './PawGraphics';
import { SafeImage } from './SafeImage';

interface HeaderProps {
  brandName: string;
  freeShippingThreshold: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  cartCount: number;
  favoritesCount: number;
  onOpenCart: () => void;
  onOpenFavorites: () => void;
  onOpenProfile: () => void;
  onNavigateSection: (sectionId: string) => void;
  onFilterOffers: () => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

export const Header: React.FC<HeaderProps> = ({
  brandName,
  freeShippingThreshold,
  searchQuery,
  onSearchChange,
  products,
  onSelectProduct,
  cartCount,
  favoritesCount,
  onOpenCart,
  onOpenFavorites,
  onOpenProfile,
  onNavigateSection,
  onFilterOffers,
  searchInputRef,
}) => {
  const [promoVisible, setPromoVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(event.target as Node)
      ) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const suggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.nutritionalNeeds.some((n) => n.toLowerCase().includes(q))
      )
      .slice(0, 5);
  }, [products, searchQuery]);

  const handleNavClick = (sectionId: string, special?: 'offers') => {
    setMobileMenuOpen(false);
    if (special === 'offers') {
      onFilterOffers();
      return;
    }
    onNavigateSection(sectionId);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#30483A]/10">
      {promoVisible && (
        <div className="bg-[#30483A] text-[#F7F4ED] text-xs px-4 py-1.5 flex items-center justify-center relative">
          <p className="text-center pr-6 truncate">
            Frete grátis acima de {formatBRL(freeShippingThreshold)} · Use{' '}
            <span className="font-semibold text-[#F4AD73]">MIAU10</span> para 10% OFF · Loja demonstrativa
          </p>
          <button
            type="button"
            onClick={() => setPromoVisible(false)}
            aria-label="Fechar barra promocional"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#F7F4ED]/80 hover:text-white rounded-md focus-visible:outline-2 focus-visible:outline-[#F4AD73]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-[72px] flex items-center justify-between gap-4 lg:gap-8">
        {/* Mobile Hamburger + Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileMenuOpen}
            className="lg:hidden p-2 -ml-2 rounded-xl text-[#30483A] hover:bg-[#F7F4ED] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('inicio');
            }}
            className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group"
          >
            <BrandLogoMark className="w-9 h-9 transition-transform duration-200 group-hover:scale-105" />
            <span className="font-display font-bold text-xl tracking-tight text-[#30483A]">
              {brandName}
            </span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav
          aria-label="Navegação principal"
          className="hidden lg:flex items-center gap-6 text-sm font-semibold text-[#30483A]/80"
        >
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('inicio');
            }}
            className="whitespace-nowrap shrink-0 py-1 hover:text-[#30483A] border-b-2 border-transparent hover:border-[#F4AD73] transition-colors"
          >
            Início
          </a>
          <a
            href="#produtos"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('produtos');
            }}
            className="whitespace-nowrap shrink-0 py-1 hover:text-[#30483A] border-b-2 border-transparent hover:border-[#F4AD73] transition-colors"
          >
            Produtos
          </a>
          <a
            href="#categorias"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('categorias');
            }}
            className="whitespace-nowrap shrink-0 py-1 hover:text-[#30483A] border-b-2 border-transparent hover:border-[#F4AD73] transition-colors"
          >
            Categorias
          </a>
          <a
            href="#ofertas"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('ofertas', 'offers');
            }}
            className="whitespace-nowrap shrink-0 py-1 hover:text-[#30483A] border-b-2 border-transparent hover:border-[#F4AD73] transition-colors"
          >
            Ofertas
          </a>
          <a
            href="#sobre-nos"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('sobre-nos');
            }}
            className="whitespace-nowrap shrink-0 py-1 hover:text-[#30483A] border-b-2 border-transparent hover:border-[#F4AD73] transition-colors"
          >
            Sobre nós
          </a>
        </nav>

        {/* Smart Search & User Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 lg:flex-initial justify-end">
          <div
            ref={searchWrapperRef}
            className="relative hidden md:block w-full max-w-[260px] xl:max-w-[300px]"
          >
            <div className="relative flex items-center">
              <Search
                className="w-4 h-4 text-[#30483A]/55 absolute left-3.5 pointer-events-none"
                aria-hidden="true"
              />
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setSearchFocused(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSearchFocused(false);
                    onNavigateSection('produtos');
                  }
                  if (e.key === 'Escape') {
                    setSearchFocused(false);
                  }
                }}
                placeholder="Buscar ração, sachê, marca..."
                aria-label="Pesquisar produtos"
                className="w-full h-10 pl-10 pr-8 rounded-xl bg-[#F7F4ED] border border-[#30483A]/12 text-sm text-[#30483A] placeholder:text-[#30483A]/50 focus:bg-white focus:border-[#30483A]/40 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Limpar busca"
                  className="absolute right-2.5 text-[#30483A]/50 hover:text-[#30483A] p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {searchFocused && searchQuery.trim().length > 0 && (
              <div
                role="listbox"
                aria-label="Sugestões de busca"
                className="absolute top-12 left-0 right-0 bg-white rounded-2xl shadow-xl border border-[#30483A]/12 overflow-hidden z-50"
              >
                {suggestions.length > 0 ? (
                  <ul className="divide-y divide-[#30483A]/8">
                    {suggestions.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setSearchFocused(false);
                            onSelectProduct(item);
                          }}
                          className="w-full flex items-center gap-3 p-3 text-left hover:bg-[#F7F4ED] transition-colors"
                        >
                          <SafeImage
                            src={item.image}
                            alt={item.name}
                            className="w-11 h-11 rounded-lg object-cover shrink-0 bg-[#F7F4ED]"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-[#30483A]/60 font-medium truncate">
                              {item.brand} · {item.weight}
                            </p>
                            <p className="text-sm font-semibold text-[#30483A] truncate">
                              {item.name}
                            </p>
                          </div>
                          <span className="text-sm font-bold text-[#30483A] tabular-nums shrink-0">
                            {formatBRL(item.price)}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-sm text-[#30483A]/70">
                    Nenhum produto encontrado para "{searchQuery}".
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onOpenFavorites}
            aria-label={`Favoritos (${favoritesCount} itens)`}
            className="relative p-2.5 rounded-xl text-[#30483A] hover:bg-[#F7F4ED] transition-colors min-w-[42px] min-h-[42px] flex items-center justify-center"
          >
            <Heart className="w-5 h-5" />
            {favoritesCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#F4AD73] text-[#30483A] text-[11px] font-bold flex items-center justify-center tabular-nums">
                {favoritesCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenProfile}
            aria-label="Perfil e configurações da loja"
            className="p-2.5 rounded-xl text-[#30483A] hover:bg-[#F7F4ED] transition-colors min-w-[42px] min-h-[42px] flex items-center justify-center"
          >
            <User className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Abrir carrinho (${cartCount} produtos)`}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#30483A] text-white hover:bg-[#30483A]/90 active:scale-[0.98] transition-all text-sm font-semibold min-h-[42px] whitespace-nowrap shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Carrinho</span>
            <span className="px-1.5 py-0.5 rounded-md bg-[#F4AD73] text-[#30483A] text-xs font-bold tabular-nums">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation + Mobile Search */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#30483A]/10 bg-white px-4 py-4 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-[#30483A]/55 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setMobileMenuOpen(false);
                  onNavigateSection('produtos');
                }
              }}
              placeholder="Buscar ração, sachê, petisco..."
              aria-label="Pesquisar produtos no celular"
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#F7F4ED] border border-[#30483A]/15 text-sm text-[#30483A]"
            />
          </div>
          <nav className="flex flex-col space-y-1 text-base font-semibold text-[#30483A]">
            <button
              type="button"
              onClick={() => handleNavClick('inicio')}
              className="text-left px-3 py-2.5 rounded-xl hover:bg-[#F7F4ED]"
            >
              Início
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('produtos')}
              className="text-left px-3 py-2.5 rounded-xl hover:bg-[#F7F4ED]"
            >
              Produtos
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('categorias')}
              className="text-left px-3 py-2.5 rounded-xl hover:bg-[#F7F4ED]"
            >
              Categorias
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('ofertas', 'offers')}
              className="text-left px-3 py-2.5 rounded-xl hover:bg-[#F7F4ED]"
            >
              Ofertas
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('quiz')}
              className="text-left px-3 py-2.5 rounded-xl hover:bg-[#F7F4ED]"
            >
              Quiz Nutricional
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('clube-miau')}
              className="text-left px-3 py-2.5 rounded-xl hover:bg-[#F7F4ED]"
            >
              Clube Miau
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('sobre-nos')}
              className="text-left px-3 py-2.5 rounded-xl hover:bg-[#F7F4ED]"
            >
              Sobre nós
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
