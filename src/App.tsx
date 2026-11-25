import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CartDrawer } from './components/CartDrawer';
import { CategoriesSection } from './components/CategoriesSection';
import { ClubeMiau } from './components/ClubeMiau';
import { CommunityAndInfo } from './components/CommunityAndInfo';
import { FeaturedSection } from './components/FeaturedSection';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { MobileBottomNav } from './components/MobileBottomNav';
import {
  CompareModal,
  FavoritesDrawer,
  FloatingMascotAndWhatsApp,
  ProfileConfigModal,
  QuickViewModal,
  ToastNotification,
} from './components/Modals';
import { NutritionQuiz } from './components/NutritionQuiz';
import { ProductCatalog } from './components/ProductCatalog';
import { DEFAULT_STORE_CONFIG, STORAGE_KEYS } from './config/store';
import { PRODUCTS } from './data/catalog';
import { CartItem, CategorySlug, Product, StoreConfig } from './types/store';

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() =>
    readStorage<StoreConfig>(STORAGE_KEYS.storeConfig, DEFAULT_STORE_CONFIG)
  );
  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    readStorage<CartItem[]>(STORAGE_KEYS.cart, [])
  );
  const [favorites, setFavorites] = useState<string[]>(() =>
    readStorage<string[]>(STORAGE_KEYS.favorites, [])
  );
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() =>
    readStorage<string[]>(STORAGE_KEYS.recentlyViewed, [])
  );

  const [activeCategory, setActiveCategory] = useState<CategorySlug>('todos');
  const [onlyOffers, setOnlyOffers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const [cartOpen, setCartOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  // Sync localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cartItems));
    } catch {
      // ignore storage quota errors
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.favorites,
        JSON.stringify(favorites)
      );
    } catch {
      // ignore
    }
  }, [favorites]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.recentlyViewed,
        JSON.stringify(recentlyViewedIds)
      );
    } catch {
      // ignore
    }
  }, [recentlyViewedIds]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.storeConfig,
        JSON.stringify(storeConfig)
      );
      document.title = `${storeConfig.brandName} — Ração para Gatos, Sachês e Nutrição Felina`;
    } catch {
      // ignore
    }
  }, [storeConfig]);

  // Close active modals/drawers on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setQuickViewProduct(null);
        setCompareOpen(false);
        setFavoritesOpen(false);
        setProfileOpen(false);
        setCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleSelectCategory = useCallback(
    (slug: CategorySlug) => {
      setOnlyOffers(false);
      setActiveCategory(slug);
      scrollToSection('produtos');
    },
    [scrollToSection]
  );

  const handleFilterOffers = useCallback(() => {
    setActiveCategory('todos');
    setOnlyOffers(true);
    scrollToSection('produtos');
  }, [scrollToSection]);

  const handleQuickView = useCallback((product: Product) => {
    setQuickViewProduct(product);
    setRecentlyViewedIds((prev) => [
      product.id,
      ...prev.filter((id) => id !== product.id),
    ].slice(0, 8));
  }, []);

  const handleAddToCart = useCallback(
    (productId: string, quantity: number) => {
      setCartItems((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.productId === productId && !item.isSubscription
        );
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
          return updated;
        }
        return [...prev, { productId, quantity, isSubscription: false }];
      });
      showToast('Miau! Seu gatinho vai adorar essa escolha.');
    },
    [showToast]
  );

  const handleSubscribeToCart = useCallback(
    (productId: string, quantity: number, frequencyDays: number) => {
      setCartItems((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.productId === productId && item.isSubscription
        );
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
            frequencyDays,
          };
          return updated;
        }
        return [
          ...prev,
          {
            productId,
            quantity,
            isSubscription: true,
            frequencyDays,
          },
        ];
      });
      showToast('Miau! Seu gatinho vai adorar essa escolha.');
      setCartOpen(true);
    },
    [showToast]
  );

  const handleUpdateCartQty = useCallback(
    (productId: string, isSubscription: boolean, quantity: number) => {
      if (quantity <= 0) {
        setCartItems((prev) =>
          prev.filter(
            (i) =>
              !(
                i.productId === productId &&
                Boolean(i.isSubscription) === isSubscription
              )
          )
        );
        return;
      }
      setCartItems((prev) =>
        prev.map((i) =>
          i.productId === productId &&
          Boolean(i.isSubscription) === isSubscription
            ? { ...i, quantity }
            : i
        )
      );
    },
    []
  );

  const handleRemoveCartItem = useCallback(
    (productId: string, isSubscription: boolean) => {
      setCartItems((prev) =>
        prev.filter(
          (i) =>
            !(
              i.productId === productId &&
              Boolean(i.isSubscription) === isSubscription
            )
        )
      );
    },
    []
  );

  const handleToggleFavorite = useCallback(
    (productId: string) => {
      setFavorites((prev) => {
        const exists = prev.includes(productId);
        if (exists) {
          showToast('Produto removido dos favoritos.');
          return prev.filter((id) => id !== productId);
        }
        showToast('Salvo nos seus favoritos!');
        return [productId, ...prev];
      });
    },
    [showToast]
  );

  const handleToggleCompare = useCallback(
    (productId: string) => {
      setCompareIds((prev) => {
        if (prev.includes(productId)) {
          return prev.filter((id) => id !== productId);
        }
        if (prev.length >= 3) {
          showToast('Você pode comparar até 3 rações por vez.');
          return prev;
        }
        return [...prev, productId];
      });
    },
    [showToast]
  );

  const totalCartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const favoriteProducts = useMemo(
    () => PRODUCTS.filter((p) => favorites.includes(p.id)),
    [favorites]
  );

  const comparedProducts = useMemo(
    () => PRODUCTS.filter((p) => compareIds.includes(p.id)),
    [compareIds]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4ED] text-[#30483A]">
      <Header
        brandName={storeConfig.brandName}
        freeShippingThreshold={storeConfig.freeShippingThreshold}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
        }}
        products={PRODUCTS}
        onSelectProduct={handleQuickView}
        cartCount={totalCartCount}
        favoritesCount={favorites.length}
        onOpenCart={() => setCartOpen(true)}
        onOpenFavorites={() => setFavoritesOpen(true)}
        onOpenProfile={() => setProfileOpen(true)}
        onNavigateSection={scrollToSection}
        onFilterOffers={handleFilterOffers}
        searchInputRef={searchInputRef}
      />

      <main className="flex-1">
        <HeroSection
          onShopNow={() => scrollToSection('produtos')}
          onStartQuiz={() => scrollToSection('quiz')}
        />

        <CategoriesSection
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
        />

        <ProductCatalog
          products={PRODUCTS}
          activeCategory={activeCategory}
          onCategoryChange={(slug) => {
            setOnlyOffers(false);
            setActiveCategory(slug);
          }}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
          favorites={favorites}
          compareIds={compareIds}
          recentlyViewedIds={recentlyViewedIds}
          onlyOffers={onlyOffers}
          onToggleOnlyOffers={setOnlyOffers}
          onToggleFavorite={handleToggleFavorite}
          onToggleCompare={handleToggleCompare}
          onOpenCompareModal={() => setCompareOpen(true)}
          onQuickView={handleQuickView}
          onAddToCart={handleAddToCart}
        />

        <FeaturedSection
          products={PRODUCTS}
          favorites={favorites}
          compareIds={compareIds}
          onToggleFavorite={handleToggleFavorite}
          onToggleCompare={handleToggleCompare}
          onQuickView={handleQuickView}
          onAddToCart={handleAddToCart}
        />

        <NutritionQuiz
          products={PRODUCTS}
          onAddToCart={handleAddToCart}
          onQuickView={handleQuickView}
        />

        <ClubeMiau
          products={PRODUCTS}
          onSubscribeToCart={handleSubscribeToCart}
        />

        <CommunityAndInfo
          brandName={storeConfig.brandName}
          whatsappNumber={storeConfig.whatsappNumber}
          onNavigateSection={scrollToSection}
        />
      </main>

      <MobileBottomNav
        cartCount={totalCartCount}
        favoritesCount={favorites.length}
        onNavigateHome={() => scrollToSection('inicio')}
        onNavigateCategories={() => scrollToSection('categorias')}
        onFocusSearch={() => {
          scrollToSection('produtos');
          setTimeout(() => searchInputRef.current?.focus(), 300);
        }}
        onOpenFavorites={() => setFavoritesOpen(true)}
        onOpenCart={() => setCartOpen(true)}
      />

      {/* Drawers & Modals */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        products={PRODUCTS}
        freeShippingThreshold={storeConfig.freeShippingThreshold}
        onUpdateQuantity={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCartItems([])}
      />

      <FavoritesDrawer
        isOpen={favoritesOpen}
        products={favoriteProducts}
        onClose={() => setFavoritesOpen(false)}
        onToggleFavorite={handleToggleFavorite}
        onAddToCart={handleAddToCart}
      />

      <QuickViewModal
        key={quickViewProduct?.id ?? 'closed'}
        product={quickViewProduct}
        isFavorite={
          quickViewProduct ? favorites.includes(quickViewProduct.id) : false
        }
        isCompared={
          quickViewProduct ? compareIds.includes(quickViewProduct.id) : false
        }
        onClose={() => setQuickViewProduct(null)}
        onToggleFavorite={handleToggleFavorite}
        onToggleCompare={handleToggleCompare}
        onAddToCart={handleAddToCart}
      />

      <CompareModal
        isOpen={compareOpen}
        products={comparedProducts}
        onClose={() => setCompareOpen(false)}
        onRemoveCompare={(id) =>
          setCompareIds((prev) => prev.filter((item) => item !== id))
        }
        onAddToCart={handleAddToCart}
      />

      <ProfileConfigModal
        key={profileOpen ? 'open' : 'closed'}
        isOpen={profileOpen}
        config={storeConfig}
        onSaveConfig={setStoreConfig}
        onClose={() => setProfileOpen(false)}
      />

      <FloatingMascotAndWhatsApp
        whatsappNumber={storeConfig.whatsappNumber}
        onStartQuiz={() => scrollToSection('quiz')}
      />

      <ToastNotification message={toastMessage} />
    </div>
  );
}
