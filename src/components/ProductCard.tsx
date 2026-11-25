import React, { useState } from 'react';
import {
  Check,
  Eye,
  Heart,
  Minus,
  Plus,
  Scale,
  ShoppingBag,
  Star,
} from 'lucide-react';
import { formatBRL, getDiscountPercent } from '../data/catalog';
import { Product } from '../types/store';
import { SafeImage } from './SafeImage';

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  isCompared: boolean;
  onToggleFavorite: (productId: string) => void;
  onToggleCompare: (productId: string) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (productId: string, quantity: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isFavorite,
  isCompared,
  onToggleFavorite,
  onToggleCompare,
  onQuickView,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const discount = getDiscountPercent(product.price, product.originalPrice);

  const handleAdd = () => {
    onAddToCart(product.id, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <article className="group bg-white rounded-2xl border border-[#30483A]/10 overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(48,72,58,0.08)]">
      {/* Image Area */}
      <div className="relative aspect-[4/3] bg-[#F7F4ED] overflow-hidden">
        <button
          type="button"
          onClick={() => onQuickView(product)}
          className="w-full h-full block text-left focus-visible:outline-2 focus-visible:outline-[#30483A]"
          aria-label={`Visualizar detalhes de ${product.name}`}
        >
          <SafeImage
            src={product.image}
            alt={product.imageAlt}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            fallbackLabel={product.name}
          />
        </button>

        {/* Top actions */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between pointer-events-none">
          {discount > 0 ? (
            <span className="pointer-events-auto px-2.5 py-1 rounded-lg bg-[#F4AD73] text-[#30483A] text-xs font-bold tabular-nums shadow-xs">
              -{discount}%
            </span>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              type="button"
              onClick={() => onToggleFavorite(product.id)}
              aria-label={
                isFavorite
                  ? `Remover ${product.name} dos favoritos`
                  : `Adicionar ${product.name} aos favoritos`
              }
              aria-pressed={isFavorite}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors shadow-xs ${
                isFavorite
                  ? 'bg-[#30483A] text-white'
                  : 'bg-white/95 text-[#30483A] hover:bg-white'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`}
              />
            </button>
            <button
              type="button"
              onClick={() => onQuickView(product)}
              aria-label={`Visualização rápida de ${product.name}`}
              className="w-9 h-9 rounded-xl bg-white/95 text-[#30483A] hover:bg-white flex items-center justify-center transition-colors shadow-xs"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Info Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2 text-xs text-[#30483A]/65 font-medium mb-1.5">
          <span className="truncate">
            {product.brand} · {product.weight}
          </span>
          <span className="flex items-center gap-1 text-[#30483A] font-semibold shrink-0 tabular-nums">
            <Star className="w-3.5 h-3.5 fill-[#F4AD73] text-[#F4AD73]" />
            {product.rating.toFixed(1)}
            <span className="text-[#30483A]/55 font-normal">
              ({product.reviewCount})
            </span>
          </span>
        </div>

        <h3 className="font-display font-semibold text-base text-[#30483A] leading-snug line-clamp-2 min-h-[2.75rem]">
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="text-left hover:underline underline-offset-2"
          >
            {product.name}
          </button>
        </h3>

        <p className="text-xs text-[#30483A]/70 mt-1.5 line-clamp-2 mb-3">
          {product.shortDescription}
        </p>

        {/* Pricing */}
        <div className="mt-auto pt-3 border-t border-[#30483A]/8">
          <div className="flex items-baseline justify-between gap-2 mb-3">
            <div>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="block text-xs text-[#30483A]/50 line-through tabular-nums">
                  {formatBRL(product.originalPrice)}
                </span>
              )}
              <span className="font-display font-bold text-lg sm:text-xl text-[#30483A] tabular-nums">
                {formatBRL(product.price)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onToggleCompare(product.id)}
              aria-pressed={isCompared}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                isCompared
                  ? 'bg-[#A8BFA3]/35 text-[#30483A]'
                  : 'text-[#30483A]/70 hover:bg-[#F7F4ED] hover:text-[#30483A]'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isCompared ? 'Comparando' : 'Comparar'}</span>
            </button>
          </div>

          {/* Quantity + Add to cart */}
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl border border-[#30483A]/15 bg-[#F7F4ED]/60 h-10 shrink-0">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Diminuir quantidade"
                className="w-8 h-full flex items-center justify-center text-[#30483A] hover:bg-[#30483A]/10 rounded-l-xl transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span
                className="w-7 text-center text-sm font-bold text-[#30483A] tabular-nums"
                aria-live="polite"
              >
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                aria-label="Aumentar quantidade"
                className="w-8 h-full flex items-center justify-center text-[#30483A] hover:bg-[#30483A]/10 rounded-r-xl transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className={`flex-1 h-10 px-3 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
                justAdded
                  ? 'bg-[#A8BFA3] text-[#30483A]'
                  : 'bg-[#30483A] text-white hover:bg-[#24372c] active:scale-[0.98]'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Adicionado</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Adicionar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
