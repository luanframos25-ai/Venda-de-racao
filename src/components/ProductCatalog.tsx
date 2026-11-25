import React, { useEffect, useMemo, useState } from 'react';
import {
  Filter,
  History,
  RotateCcw,
  Scale,
  SlidersHorizontal,
} from 'lucide-react';
import { CATEGORIES, formatBRL } from '../data/catalog';
import {
  CatAgeGroup,
  CategorySlug,
  FoodType,
  NutritionalNeed,
  Product,
  SortOption,
} from '../types/store';
import { ProductCard } from './ProductCard';
import { SafeImage } from './SafeImage';

interface ProductCatalogProps {
  products: Product[];
  activeCategory: CategorySlug;
  onCategoryChange: (slug: CategorySlug) => void;
  searchQuery: string;
  onClearSearch: () => void;
  favorites: string[];
  compareIds: string[];
  recentlyViewedIds: string[];
  onlyOffers: boolean;
  onToggleOnlyOffers: (val: boolean) => void;
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onOpenCompareModal: () => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (productId: string, quantity: number) => void;
}

const FOOD_TYPE_LABELS: Record<FoodType, string> = {
  seca: 'Ração seca',
  natural: 'Ração natural',
  umida: 'Úmida e sachês',
  petisco: 'Petiscos',
};

const AGE_LABELS: Record<CatAgeGroup, string> = {
  filhote: 'Filhote',
  adulto: 'Adulto',
  castrado: 'Castrado',
  idoso: 'Idoso (7+)',
};

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onClearSearch,
  favorites,
  compareIds,
  recentlyViewedIds,
  onlyOffers,
  onToggleOnlyOffers,
  onToggleFavorite,
  onToggleCompare,
  onOpenCompareModal,
  onQuickView,
  onAddToCart,
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('todas');
  const [selectedAge, setSelectedAge] = useState<string>('todas');
  const [selectedWeight, setSelectedWeight] = useState<string>('todos');
  const [selectedFoodType, setSelectedFoodType] = useState<string>('todos');
  const [selectedNeed, setSelectedNeed] = useState<string>('todas');
  const [priceRange, setPriceRange] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<SortOption>('bestsellers');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const brands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))).sort(),
    [products]
  );
  const weights = useMemo(
    () => Array.from(new Set(products.map((p) => p.weight))),
    [products]
  );
  const needs = useMemo(() => {
    const set = new Set<NutritionalNeed>();
    products.forEach((p) => p.nutritionalNeeds.forEach((n) => set.add(n)));
    return Array.from(set).sort();
  }, [products]);

  // Brief subtle skeleton loading feedback when user actively switches filters or sort
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, [
    activeCategory,
    selectedBrand,
    selectedAge,
    selectedWeight,
    selectedFoodType,
    selectedNeed,
    priceRange,
    sortBy,
    onlyOffers,
  ]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const list = products.filter((p) => {
      if (activeCategory !== 'todos' && !p.categories.includes(activeCategory)) {
        return false;
      }
      if (onlyOffers && (!p.originalPrice || p.originalPrice <= p.price)) {
        return false;
      }
      if (selectedBrand !== 'todas' && p.brand !== selectedBrand) {
        return false;
      }
      if (
        selectedAge !== 'todas' &&
        !p.ageGroups.includes(selectedAge as CatAgeGroup)
      ) {
        return false;
      }
      if (selectedWeight !== 'todos' && p.weight !== selectedWeight) {
        return false;
      }
      if (selectedFoodType !== 'todos' && p.foodType !== selectedFoodType) {
        return false;
      }
      if (
        selectedNeed !== 'todas' &&
        !p.nutritionalNeeds.includes(selectedNeed as NutritionalNeed)
      ) {
        return false;
      }
      if (priceRange === 'ate-60' && p.price > 60) return false;
      if (priceRange === '60-150' && (p.price < 60 || p.price > 150)) return false;
      if (priceRange === 'acima-150' && p.price <= 150) return false;

      if (q) {
        const match =
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.nutritionalNeeds.some((n) => n.toLowerCase().includes(q));
        if (!match) return false;
      }

      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating-desc') return b.rating - a.rating;
      // bestsellers
      return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0) || b.reviewCount - a.reviewCount;
    });
  }, [
    products,
    activeCategory,
    onlyOffers,
    selectedBrand,
    selectedAge,
    selectedWeight,
    selectedFoodType,
    selectedNeed,
    priceRange,
    searchQuery,
    sortBy,
  ]);

  const activeFiltersCount = [
    activeCategory !== 'todos',
    onlyOffers,
    selectedBrand !== 'todas',
    selectedAge !== 'todas',
    selectedWeight !== 'todos',
    selectedFoodType !== 'todos',
    selectedNeed !== 'todas',
    priceRange !== 'todos',
    searchQuery.trim().length > 0,
  ].filter(Boolean).length;

  const resetAllFilters = () => {
    onCategoryChange('todos');
    onToggleOnlyOffers(false);
    setSelectedBrand('todas');
    setSelectedAge('todas');
    setSelectedWeight('todos');
    setSelectedFoodType('todos');
    setSelectedNeed('todas');
    setPriceRange('todos');
    onClearSearch();
  };

  const recentlyViewedProducts = useMemo(
    () =>
      recentlyViewedIds
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p)),
    [recentlyViewedIds, products]
  );

  return (
    <section id="produtos" className="py-14 sm:py-16 bg-[#F7F4ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold text-[#30483A]/65 tracking-wide mb-1">
              Vitrine de produtos · Produtos e preços fictícios demonstrativos
            </p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#30483A]">
              Rações, sachês e petiscos selecionados
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {compareIds.length > 0 && (
              <button
                type="button"
                onClick={onOpenCompareModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#A8BFA3] text-[#30483A] font-semibold text-sm hover:bg-[#97b191] transition-colors whitespace-nowrap shrink-0"
              >
                <Scale className="w-4 h-4" />
                <span>Comparar ({compareIds.length}/3)</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setFiltersOpen((prev) => !prev)}
              aria-expanded={filtersOpen}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#30483A]/15 text-[#30483A] font-semibold text-sm hover:border-[#30483A]/40 transition-colors whitespace-nowrap shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filtros</span>
              {activeFiltersCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-md bg-[#F4AD73] text-[#30483A] text-xs font-bold tabular-nums">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-2 bg-white border border-[#30483A]/15 rounded-xl px-3 h-10">
              <label
                htmlFor="sort-select"
                className="text-xs font-semibold text-[#30483A]/65 whitespace-nowrap"
              >
                Ordenar:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-sm font-semibold text-[#30483A] bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="bestsellers">Mais vendidos</option>
                <option value="price-asc">Menor preço</option>
                <option value="price-desc">Maior preço</option>
                <option value="rating-desc">Melhores avaliações</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Quick Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6">
          <button
            type="button"
            onClick={() => onCategoryChange('todos')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
              activeCategory === 'todos' && !onlyOffers
                ? 'bg-[#30483A] text-white'
                : 'bg-white text-[#30483A] border border-[#30483A]/12 hover:bg-[#30483A]/5'
            }`}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => onToggleOnlyOffers(!onlyOffers)}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
              onlyOffers
                ? 'bg-[#F4AD73] text-[#30483A]'
                : 'bg-white text-[#30483A] border border-[#30483A]/12 hover:bg-[#F4AD73]/20'
            }`}
          >
            Em oferta
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => onCategoryChange(cat.slug)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeCategory === cat.slug
                  ? 'bg-[#30483A] text-white'
                  : 'bg-white text-[#30483A] border border-[#30483A]/12 hover:bg-[#30483A]/5'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Multi-Facet Filter Panel */}
        {filtersOpen && (
          <div className="bg-white rounded-2xl border border-[#30483A]/12 p-5 mb-8 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#30483A]">
                <Filter className="w-4 h-4" />
                <span>Refinar resultados</span>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#30483A] hover:text-[#F4AD73] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Limpar filtros</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#30483A]/70 mb-1.5">
                  Marca
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#F7F4ED] border border-[#30483A]/15 text-sm text-[#30483A]"
                >
                  <option value="todas">Todas as marcas</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#30483A]/70 mb-1.5">
                  Idade do gato
                </label>
                <select
                  value={selectedAge}
                  onChange={(e) => setSelectedAge(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#F7F4ED] border border-[#30483A]/15 text-sm text-[#30483A]"
                >
                  <option value="todas">Todas as idades</option>
                  {Object.entries(AGE_LABELS).map(([k, label]) => (
                    <option key={k} value={k}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#30483A]/70 mb-1.5">
                  Peso da embalagem
                </label>
                <select
                  value={selectedWeight}
                  onChange={(e) => setSelectedWeight(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#F7F4ED] border border-[#30483A]/15 text-sm text-[#30483A]"
                >
                  <option value="todos">Todos os pesos</option>
                  {weights.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#30483A]/70 mb-1.5">
                  Tipo de alimentação
                </label>
                <select
                  value={selectedFoodType}
                  onChange={(e) => setSelectedFoodType(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#F7F4ED] border border-[#30483A]/15 text-sm text-[#30483A]"
                >
                  <option value="todos">Todos os tipos</option>
                  {Object.entries(FOOD_TYPE_LABELS).map(([k, label]) => (
                    <option key={k} value={k}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#30483A]/70 mb-1.5">
                  Necessidade nutricional
                </label>
                <select
                  value={selectedNeed}
                  onChange={(e) => setSelectedNeed(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#F7F4ED] border border-[#30483A]/15 text-sm text-[#30483A]"
                >
                  <option value="todas">Todas as necessidades</option>
                  {needs.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#30483A]/70 mb-1.5">
                  Faixa de preço
                </label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#F7F4ED] border border-[#30483A]/15 text-sm text-[#30483A]"
                >
                  <option value="todos">Qualquer valor</option>
                  <option value="ate-60">Até R$ 60,00</option>
                  <option value="60-150">De R$ 60,00 a R$ 150,00</option>
                  <option value="acima-150">Acima de R$ 150,00</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Active Search or Count Summary */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 text-sm text-[#30483A]/75">
          <p className="tabular-nums">
            Exibindo <strong className="text-[#30483A]">{filteredProducts.length}</strong>{' '}
            {filteredProducts.length === 1 ? 'produto' : 'produtos'}
            {searchQuery.trim() ? ` para "${searchQuery.trim()}"` : ''}
          </p>
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="text-xs font-semibold text-[#30483A] underline underline-offset-4 hover:text-[#F4AD73]"
            >
              Limpar todos os filtros
            </button>
          )}
        </div>

        {/* Product Grid with Skeleton Loading */}
        {isLoading ? (
          <div
            aria-label="Carregando produtos"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#30483A]/10 overflow-hidden p-4 space-y-4 animate-pulse"
              >
                <div className="aspect-[4/3] rounded-xl bg-[#E8E3D7]" />
                <div className="h-3 bg-[#E8E3D7] rounded w-1/2" />
                <div className="h-5 bg-[#E8E3D7] rounded w-5/6" />
                <div className="h-3 bg-[#E8E3D7] rounded w-full" />
                <div className="pt-2 flex justify-between items-center">
                  <div className="h-6 bg-[#E8E3D7] rounded w-24" />
                  <div className="h-9 bg-[#E8E3D7] rounded-xl w-28" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favorites.includes(product.id)}
                isCompared={compareIds.includes(product.id)}
                onToggleFavorite={onToggleFavorite}
                onToggleCompare={onToggleCompare}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#30483A]/10 p-10 text-center max-w-lg mx-auto">
            <p className="font-display font-bold text-lg text-[#30483A] mb-2">
              Nenhuma ração encontrada com esses filtros
            </p>
            <p className="text-sm text-[#30483A]/70 mb-5">
              Que tal limpar os filtros atuais para ver todo o catálogo da Miau &amp; Co.?
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="px-5 py-2.5 rounded-xl bg-[#30483A] text-white text-sm font-semibold hover:bg-[#24372c] transition-colors"
            >
              Mostrar todos os produtos
            </button>
          </div>
        )}

        {/* Recently Viewed History */}
        {recentlyViewedProducts.length > 0 && (
          <div className="mt-14 pt-10 border-t border-[#30483A]/10">
            <div className="flex items-center gap-2 mb-5">
              <History className="w-4 h-4 text-[#30483A]" />
              <h3 className="font-display font-bold text-lg text-[#30483A]">
                Vistos recentemente por você
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {recentlyViewedProducts.slice(0, 5).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onQuickView(item)}
                  className="bg-white rounded-2xl border border-[#30483A]/10 p-3 text-left hover:border-[#A8BFA3] hover:-translate-y-0.5 transition-all"
                >
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#F7F4ED] mb-2.5">
                    <SafeImage
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-[#30483A]/60 truncate">
                    {item.brand} · {item.weight}
                  </p>
                  <p className="text-sm font-semibold text-[#30483A] line-clamp-1 mt-0.5">
                    {item.name}
                  </p>
                  <p className="text-sm font-bold text-[#30483A] tabular-nums mt-1">
                    {formatBRL(item.price)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
