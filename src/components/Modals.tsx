import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Check,
  Heart,
  MessageCircle,
  Scale,
  ShoppingBag,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { formatBRL, getDiscountPercent } from '../data/catalog';
import { Product, StoreConfig } from '../types/store';
import { MascotCatSvg } from './PawGraphics';
import { SafeImage } from './SafeImage';

/* 1. Quick View Modal */
export const QuickViewModal: React.FC<{
  product: Product | null;
  isFavorite: boolean;
  isCompared: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onAddToCart: (id: string, qty: number) => void;
}> = ({
  product,
  isFavorite,
  isCompared,
  onClose,
  onToggleFavorite,
  onToggleCompare,
  onAddToCart,
}) => {
  const [qty, setQty] = useState(1);

  if (!product) return null;
  const discount = getDiscountPercent(product.price, product.originalPrice);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Detalhes de ${product.name}`}
    >
      <div
        className="fixed inset-0 bg-[#30483A]/50 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative z-10 bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl grid grid-cols-1 md:grid-cols-2">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar visualização rápida"
          className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-[#F7F4ED] text-[#30483A] hover:bg-[#E8E3D7]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="bg-[#F7F4ED] p-6 flex items-center justify-center">
          <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-white">
            <SafeImage
              src={product.image}
              alt={product.imageAlt}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="p-6 sm:p-7 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="text-xs font-semibold text-[#30483A]/65">
              {product.brand} · {product.weight} · Produto demonstrativo
            </div>
            <h3 className="font-display font-bold text-xl text-[#30483A] pr-6">
              {product.name}
            </h3>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#30483A]">
              <Star className="w-4 h-4 fill-[#F4AD73] text-[#F4AD73]" />
              <span className="tabular-nums">{product.rating.toFixed(1)}</span>
              <span className="text-[#30483A]/60 font-normal">
                ({product.reviewCount} avaliações ilustrativas)
              </span>
            </div>

            <p className="text-sm text-[#30483A]/80 leading-relaxed">
              {product.shortDescription}
            </p>

            <div className="rounded-2xl bg-[#F7F4ED] p-3.5 space-y-1.5 text-xs">
              <p>
                <strong>Proteína bruta:</strong> {product.proteinPercent} ·{' '}
                <strong>Energia:</strong> {product.caloriesPer100g}
              </p>
              <p className="text-[#30483A]/80">
                <strong>Ingredientes principais:</strong> {product.ingredients}
              </p>
              <p className="text-[#30483A]/80">
                <strong>Indicações:</strong> {product.nutritionalNeeds.join(' · ')}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-[#30483A]/10 space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="block text-xs text-[#30483A]/50 line-through tabular-nums">
                    {formatBRL(product.originalPrice)}
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-2xl text-[#30483A] tabular-nums">
                    {formatBRL(product.price)}
                  </span>
                  {discount > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-[#F4AD73] text-[#30483A] text-xs font-bold tabular-nums">
                      -{discount}%
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleFavorite(product.id)}
                  aria-label="Favoritar produto"
                  className={`p-2.5 rounded-xl border transition-colors ${
                    isFavorite
                      ? 'bg-[#30483A] text-white border-[#30483A]'
                      : 'border-[#30483A]/15 text-[#30483A] hover:bg-[#F7F4ED]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={() => onToggleCompare(product.id)}
                  aria-label="Comparar produto"
                  className={`p-2.5 rounded-xl border transition-colors ${
                    isCompared
                      ? 'bg-[#A8BFA3]/40 text-[#30483A] border-[#30483A]'
                      : 'border-[#30483A]/15 text-[#30483A] hover:bg-[#F7F4ED]'
                  }`}
                >
                  <Scale className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                aria-label="Quantidade"
                className="h-11 px-3 rounded-xl bg-[#F7F4ED] border border-[#30483A]/15 text-sm font-bold text-[#30483A] tabular-nums"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} un.
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => {
                  onAddToCart(product.id, qty);
                  onClose();
                }}
                className="flex-1 h-11 rounded-xl bg-[#30483A] text-white font-semibold text-sm inline-flex items-center justify-center gap-2 hover:bg-[#24372c] transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Adicionar ao carrinho</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* 2. Compare Products Modal */
export const CompareModal: React.FC<{
  isOpen: boolean;
  products: Product[];
  onClose: () => void;
  onRemoveCompare: (id: string) => void;
  onAddToCart: (id: string, qty: number) => void;
}> = ({ isOpen, products, onClose, onRemoveCompare, onAddToCart }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Comparador de rações"
    >
      <div
        className="fixed inset-0 bg-[#30483A]/50 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative z-10 bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-display font-bold text-xl text-[#30483A]">
              Comparador de produtos ({products.length}/3)
            </h3>
            <p className="text-xs text-[#30483A]/65">
              Compare nutrientes, peso e valor lado a lado
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar comparador"
            className="p-2 rounded-xl bg-[#F7F4ED] text-[#30483A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {products.length === 0 ? (
          <p className="text-sm text-[#30483A]/75 py-8 text-center">
            Selecione até 3 produtos clicando em "Comparar" nos cards da vitrine.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[540px]">
              <thead>
                <tr className="border-b border-[#30483A]/10">
                  <th className="py-3 pr-4 text-xs font-semibold text-[#30483A]/60 w-36">
                    Produto
                  </th>
                  {products.map((p) => (
                    <th key={p.id} className="py-3 px-3 align-top">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-display font-semibold text-sm text-[#30483A]">
                          {p.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => onRemoveCompare(p.id)}
                          aria-label={`Remover ${p.name} da comparação`}
                          className="text-[#30483A]/50 hover:text-[#30483A]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30483A]/8 text-sm">
                <tr>
                  <td className="py-3 pr-4 text-xs font-semibold text-[#30483A]/65">
                    Marca / Peso
                  </td>
                  {products.map((p) => (
                    <td key={p.id} className="py-3 px-3">
                      {p.brand} · {p.weight}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-xs font-semibold text-[#30483A]/65">
                    Preço
                  </td>
                  {products.map((p) => (
                    <td
                      key={p.id}
                      className="py-3 px-3 font-bold text-[#30483A] tabular-nums"
                    >
                      {formatBRL(p.price)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-xs font-semibold text-[#30483A]/65">
                    Proteína
                  </td>
                  {products.map((p) => (
                    <td key={p.id} className="py-3 px-3 tabular-nums">
                      {p.proteinPercent}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-xs font-semibold text-[#30483A]/65">
                    Energia
                  </td>
                  {products.map((p) => (
                    <td key={p.id} className="py-3 px-3 tabular-nums">
                      {p.caloriesPer100g}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-xs font-semibold text-[#30483A]/65">
                    Foco nutricional
                  </td>
                  {products.map((p) => (
                    <td key={p.id} className="py-3 px-3 text-xs">
                      {p.nutritionalNeeds.join(', ')}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 pr-4" />
                  {products.map((p) => (
                    <td key={p.id} className="py-3 px-3">
                      <button
                        type="button"
                        onClick={() => onAddToCart(p.id, 1)}
                        className="w-full py-2 px-3 rounded-xl bg-[#30483A] text-white text-xs font-semibold hover:bg-[#24372c]"
                      >
                        Adicionar
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

/* 3. Favorites Drawer */
export const FavoritesDrawer: React.FC<{
  isOpen: boolean;
  products: Product[];
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onAddToCart: (id: string, qty: number) => void;
}> = ({ isOpen, products, onClose, onToggleFavorite, onAddToCart }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Lista de favoritos"
    >
      <div
        className="fixed inset-0 bg-[#30483A]/45 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md bg-white h-full flex flex-col shadow-2xl">
        <div className="px-5 py-4 border-b border-[#30483A]/10 flex items-center justify-between bg-[#F7F4ED]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#30483A]" />
            <h2 className="font-display font-bold text-lg text-[#30483A]">
              Favoritos ({products.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar favoritos"
            className="p-2 rounded-xl hover:bg-white text-[#30483A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {products.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Heart className="w-10 h-10 text-[#A8BFA3] mx-auto" />
              <p className="font-display font-bold text-lg text-[#30483A]">
                Nenhum favorito salvo ainda
              </p>
              <p className="text-sm text-[#30483A]/70">
                Toque no coração em qualquer produto para guardar suas escolhas.
              </p>
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="flex gap-3 p-3 rounded-2xl bg-[#F7F4ED]/70 border border-[#30483A]/10"
              >
                <SafeImage
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 bg-white"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#30483A] line-clamp-1">
                    {product.name}
                  </p>
                  <p className="text-xs text-[#30483A]/65">
                    {product.brand} · {product.weight}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-sm text-[#30483A] tabular-nums">
                      {formatBRL(product.price)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onToggleFavorite(product.id)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#30483A]/70 hover:bg-white"
                      >
                        Remover
                      </button>
                      <button
                        type="button"
                        onClick={() => onAddToCart(product.id, 1)}
                        className="px-3 py-1.5 rounded-lg bg-[#30483A] text-white text-xs font-semibold hover:bg-[#24372c]"
                      >
                        Comprar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

/* 4. Profile & Configurable Brand/WhatsApp Modal */
export const ProfileConfigModal: React.FC<{
  isOpen: boolean;
  config: StoreConfig;
  onSaveConfig: (next: StoreConfig) => void;
  onClose: () => void;
}> = ({ isOpen, config, onSaveConfig, onClose }) => {
  const [brandName, setBrandName] = useState(config.brandName);
  const [whatsappNumber, setWhatsappNumber] = useState(config.whatsappNumber);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      ...config,
      brandName: brandName.trim() || 'Miau & Co.',
      whatsappNumber: whatsappNumber.replace(/\D/g, '') || '0000000000000',
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Perfil do tutor e configurações da marca"
    >
      <div
        className="fixed inset-0 bg-[#30483A]/50 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative z-10 bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-[#30483A]">
              Espaço do Tutor &amp; Marca
            </h3>
            <p className="text-xs text-[#30483A]/65">
              Personalize o nome da loja e o WhatsApp de atendimento
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar perfil"
            className="p-2 rounded-xl bg-[#F7F4ED] text-[#30483A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#30483A] mb-1">
              Nome da marca exibido na loja
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-[#F7F4ED] border border-[#30483A]/15 text-sm text-[#30483A]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#30483A] mb-1">
              Número do WhatsApp (com DDI + DDD)
            </label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="0000000000000"
              className="w-full h-11 px-3.5 rounded-xl bg-[#F7F4ED] border border-[#30483A]/15 text-sm text-[#30483A] tabular-nums"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#30483A] text-white font-semibold text-sm hover:bg-[#24372c] inline-flex items-center justify-center gap-2"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Alterações salvas!</span>
              </>
            ) : (
              <span>Salvar configurações</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

/* 5. Toast Feedback */
export const ToastNotification: React.FC<{ message: string | null }> = ({
  message,
}) => (
  <AnimatePresence>
    {message && (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        role="status"
        aria-live="polite"
        className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-[#30483A] text-white shadow-xl flex items-center gap-2.5 text-sm font-semibold max-w-[90vw]"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#F4AD73] shrink-0" />
        <span>{message}</span>
      </motion.div>
    )}
  </AnimatePresence>
);

/* 6. Floating Cat Mascot + Configurable WhatsApp Button */
const MASCOT_TIPS = [
  'Dica do Sr. Bigodes: água fresca longe da caixa de areia incentiva seu gato a beber mais!',
  'Sabia? Gatos castrados se beneficiam de rações com controle calórico e suporte urinário.',
  'Quer ajuda rápida? Faça nosso quiz em menos de 1 minuto para encontrar a receita ideal.',
  'No Clube Miau você garante 15% OFF e nunca mais corre para o pet shop no domingo!',
];

export const FloatingMascotAndWhatsApp: React.FC<{
  whatsappNumber: string;
  onStartQuiz: () => void;
}> = ({ whatsappNumber, onStartQuiz }) => {
  const [mascotOpen, setMascotOpen] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  const whatsappHref = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
    'Olá! Gostaria de ajuda para escolher a ração ideal para o meu gato.'
  )}`;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-30 flex flex-col items-end gap-3">
      <AnimatePresence>
        {mascotOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            className="bg-white rounded-2xl border border-[#30483A]/15 shadow-xl p-4 w-72 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-sm text-[#30483A]">
                Sr. Bigodes · Mascote Miau
              </span>
              <button
                type="button"
                onClick={() => setMascotOpen(false)}
                aria-label="Fechar balão do mascote"
                className="text-[#30483A]/50 hover:text-[#30483A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#30483A]/85 leading-relaxed">
              {MASCOT_TIPS[tipIndex]}
            </p>
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={() => setTipIndex((i) => (i + 1) % MASCOT_TIPS.length)}
                className="text-xs font-semibold text-[#30483A] underline underline-offset-2"
              >
                Outra dica
              </button>
              <button
                type="button"
                onClick={() => {
                  setMascotOpen(false);
                  onStartQuiz();
                }}
                className="px-3 py-1.5 rounded-lg bg-[#F4AD73] text-[#30483A] text-xs font-bold"
              >
                Abrir Quiz
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => setMascotOpen((prev) => !prev)}
          aria-label="Conversar com o mascote Sr. Bigodes"
          className="w-12 h-12 rounded-2xl bg-white border border-[#30483A]/15 shadow-lg flex items-center justify-center hover:-translate-y-0.5 transition-transform"
        >
          <MascotCatSvg className="w-9 h-9" />
        </button>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          aria-label="Atendimento via WhatsApp"
          className="h-12 px-4 rounded-2xl bg-[#30483A] text-white shadow-lg flex items-center gap-2 font-semibold text-xs sm:text-sm hover:bg-[#24372c] hover:-translate-y-0.5 transition-all whitespace-nowrap"
        >
          <MessageCircle className="w-4 h-4 text-[#A8BFA3]" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
