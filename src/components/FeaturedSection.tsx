import React, { useMemo, useState } from 'react';
import { Award, HeartHandshake, Leaf, ShieldCheck, Truck } from 'lucide-react';
import { Product } from '../types/store';
import { ProductCard } from './ProductCard';

interface FeaturedSectionProps {
  products: Product[];
  favorites: string[];
  compareIds: string[];
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (productId: string, quantity: number) => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  products,
  favorites,
  compareIds,
  onToggleFavorite,
  onToggleCompare,
  onQuickView,
  onAddToCart,
}) => {
  const [activeTab, setActiveTab] = useState<'bestsellers' | 'offers'>(
    'bestsellers'
  );

  const displayedProducts = useMemo(() => {
    if (activeTab === 'offers') {
      return products.filter((p) => p.isWeeklyOffer).slice(0, 4);
    }
    return products.filter((p) => p.isBestseller).slice(0, 4);
  }, [products, activeTab]);

  return (
    <>
      {/* Mais vendidos & Ofertas da semana */}
      <section id="ofertas" className="py-14 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold text-[#30483A]/65 tracking-wide mb-1">
                Destaques da semana · Itens demonstrativos
              </p>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#30483A]">
                {activeTab === 'bestsellers'
                  ? 'Queridinhos dos tutores'
                  : 'Ofertas da semana'}
              </h2>
            </div>

            <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#F7F4ED] border border-[#30483A]/10 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveTab('bestsellers')}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'bestsellers'
                    ? 'bg-white text-[#30483A] shadow-xs'
                    : 'text-[#30483A]/70 hover:text-[#30483A]'
                }`}
              >
                Mais vendidos
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('offers')}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'offers'
                    ? 'bg-[#F4AD73] text-[#30483A] shadow-xs'
                    : 'text-[#30483A]/70 hover:text-[#30483A]'
                }`}
              >
                Ofertas da semana
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
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
        </div>
      </section>

      {/* Benefícios & Sobre nós */}
      <section
        id="sobre-nos"
        className="py-14 sm:py-16 bg-[#A8BFA3]/20 border-y border-[#30483A]/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-semibold text-[#30483A]/70 tracking-wide mb-1.5">
              Sobre a Miau &amp; Co.
            </p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#30483A] text-balance">
              Por que tutores escolhem cuidar da tigela com a gente
            </h2>
            <p className="text-sm sm:text-base text-[#30483A]/80 mt-2.5 leading-relaxed">
              Nascemos para tornar a escolha da alimentação felina mais simples,
              transparente e afetuosa — unindo receitas nutritivas, curadoria por
              fase da vida e entrega recorrente sem complicação.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-2xl p-6 border border-[#30483A]/10">
              <div className="w-11 h-11 rounded-xl bg-[#A8BFA3]/25 text-[#30483A] flex items-center justify-center mb-4">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="font-display font-semibold text-base text-[#30483A] mb-1.5">
                Curadoria de ingredientes
              </h3>
              <p className="text-sm text-[#30483A]/75 leading-relaxed">
                Priorizamos proteínas de qualidade, taurina na medida certa e
                fórmulas livres de corantes artificiais.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#30483A]/10">
              <div className="w-11 h-11 rounded-xl bg-[#F4AD73]/25 text-[#30483A] flex items-center justify-center mb-4">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-display font-semibold text-base text-[#30483A] mb-1.5">
                Frete grátis a partir de R$ 199
              </h3>
              <p className="text-sm text-[#30483A]/75 leading-relaxed">
                Embalagens protegidas e envio ágil com acompanhamento direto no
                nosso fluxo de compra demonstrativo.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#30483A]/10">
              <div className="w-11 h-11 rounded-xl bg-[#A8BFA3]/25 text-[#30483A] flex items-center justify-center mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-display font-semibold text-base text-[#30483A] mb-1.5">
                Economia no Clube Miau
              </h3>
              <p className="text-sm text-[#30483A]/75 leading-relaxed">
                15% OFF recorrente e entregas programadas para o pote do seu
                gato nunca ficar vazio.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#30483A]/10">
              <div className="w-11 h-11 rounded-xl bg-[#F4AD73]/25 text-[#30483A] flex items-center justify-center mb-4">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-display font-semibold text-base text-[#30483A] mb-1.5">
                Experiência acolhedora
              </h3>
              <p className="text-sm text-[#30483A]/75 leading-relaxed">
                Quiz interativo, comparador nutricional e atendimento humano
                configurável pelo WhatsApp.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs text-[#30483A]/70">
            <ShieldCheck className="w-4 h-4 text-[#30483A]" />
            <span>
              Ambiente de loja virtual demonstrativo com armazenamento local no
              navegador e suporte a futuras integrações comerciais.
            </span>
          </div>
        </div>
      </section>
    </>
  );
};
