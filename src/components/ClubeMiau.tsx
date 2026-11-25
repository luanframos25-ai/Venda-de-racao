import React, { useMemo, useState } from 'react';
import { CalendarClock, Check, Minus, PauseCircle, Plus, Repeat, ShoppingBag } from 'lucide-react';
import { formatBRL } from '../data/catalog';
import { Product } from '../types/store';
import { SafeImage } from './SafeImage';

interface ClubeMiauProps {
  products: Product[];
  onSubscribeToCart: (
    productId: string,
    quantity: number,
    frequencyDays: number
  ) => void;
}

const FREQUENCIES = [
  { days: 15, label: 'A cada 15 dias' },
  { days: 30, label: 'Mensal (30 dias)' },
  { days: 45, label: 'A cada 45 dias' },
  { days: 60, label: 'Bimestral (60 dias)' },
];

export const ClubeMiau: React.FC<ClubeMiauProps> = ({
  products,
  onSubscribeToCart,
}) => {
  const clubCandidates = useMemo(() => products.slice(0, 6), [products]);
  const [selectedProductId, setSelectedProductId] = useState(
    clubCandidates[0]?.id ?? 'prod-1'
  );
  const [quantity, setQuantity] = useState(1);
  const [frequencyDays, setFrequencyDays] = useState(30);

  const selectedProduct =
    clubCandidates.find((p) => p.id === selectedProductId) ?? clubCandidates[0];

  const subscriptionDiscountRate = 0.15;
  const regularTotal = (selectedProduct?.price ?? 0) * quantity;
  const clubPriceTotal = regularTotal * (1 - subscriptionDiscountRate);
  const savingsPerOrder = regularTotal - clubPriceTotal;
  const annualOrders = Math.round(365 / frequencyDays);
  const annualSavings = savingsPerOrder * annualOrders;

  return (
    <section
      id="clube-miau"
      className="py-14 sm:py-16 bg-[#30483A] text-[#F7F4ED]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-semibold text-[#F4AD73] tracking-wide">
              Programa de Assinatura · Clube Miau
            </div>

            <h2 className="font-display font-bold text-2xl sm:text-4xl text-white leading-tight text-balance">
              Seu gato bem alimentado. Você com uma preocupação a menos.
            </h2>

            <p className="text-sm sm:text-base text-[#F7F4ED]/85 leading-relaxed">
              Receba a ração e os sachês favoritos do seu felino no ritmo certo,
              com desconto exclusivo de 15% e total liberdade para pausar,
              trocar sabores ou cancelar quando quiser — sem multas.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="rounded-2xl bg-white/8 border border-white/12 p-4">
                <Repeat className="w-5 h-5 text-[#F4AD73] mb-2" />
                <p className="font-display font-semibold text-sm text-white">
                  15% OFF sempre
                </p>
                <p className="text-xs text-[#F7F4ED]/75 mt-1">
                  Desconto recorrente em todas as entregas programadas.
                </p>
              </div>

              <div className="rounded-2xl bg-white/8 border border-white/12 p-4">
                <CalendarClock className="w-5 h-5 text-[#A8BFA3] mb-2" />
                <p className="font-display font-semibold text-sm text-white">
                  Frequência flexível
                </p>
                <p className="text-xs text-[#F7F4ED]/75 mt-1">
                  Escolha entre 15, 30, 45 ou 60 dias conforme o consumo.
                </p>
              </div>

              <div className="rounded-2xl bg-white/8 border border-white/12 p-4">
                <PauseCircle className="w-5 h-5 text-[#F4AD73] mb-2" />
                <p className="font-display font-semibold text-sm text-white">
                  Sem fidelidade
                </p>
                <p className="text-xs text-[#F7F4ED]/75 mt-1">
                  Altere a data, pause ou cancele em poucos cliques.
                </p>
              </div>
            </div>
          </div>

          {/* Right Interactive Simulator */}
          <div className="lg:col-span-6">
            <div className="bg-white text-[#30483A] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div>
                <h3 className="font-display font-bold text-lg sm:text-xl text-[#30483A]">
                  Simule sua assinatura do Clube Miau
                </h3>
                <p className="text-xs sm:text-sm text-[#30483A]/70 mt-0.5">
                  Personalize produto, quantidade e frequência de entrega
                </p>
              </div>

              {/* Product Selector */}
              <div>
                <label
                  htmlFor="club-product-select"
                  className="block text-xs font-semibold text-[#30483A]/75 mb-2"
                >
                  Escolha o produto principal
                </label>
                <select
                  id="club-product-select"
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#F7F4ED] border border-[#30483A]/15 text-sm font-semibold text-[#30483A]"
                >
                  {clubCandidates.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.weight}) — {formatBRL(p.price)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected preview & quantity */}
              {selectedProduct && (
                <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#F7F4ED]">
                  <SafeImage
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 bg-white"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[#30483A]/65 truncate">
                      {selectedProduct.brand} · {selectedProduct.weight}
                    </p>
                    <p className="text-sm font-bold text-[#30483A] truncate">
                      {selectedProduct.name}
                    </p>
                  </div>
                  <div className="flex items-center rounded-xl bg-white border border-[#30483A]/15 h-9 shrink-0">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Diminuir quantidade da assinatura"
                      className="w-8 h-full flex items-center justify-center hover:bg-[#F7F4ED] rounded-l-xl"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-7 text-center text-sm font-bold tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                      aria-label="Aumentar quantidade da assinatura"
                      className="w-8 h-full flex items-center justify-center hover:bg-[#F7F4ED] rounded-r-xl"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Frequency */}
              <div>
                <span className="block text-xs font-semibold text-[#30483A]/75 mb-2">
                  Frequência de entrega
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  {FREQUENCIES.map((freq) => (
                    <button
                      key={freq.days}
                      type="button"
                      onClick={() => setFrequencyDays(freq.days)}
                      className={`px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-colors flex items-center justify-between ${
                        frequencyDays === freq.days
                          ? 'bg-[#30483A] text-white border-[#30483A]'
                          : 'bg-[#F7F4ED]/60 text-[#30483A] border-[#30483A]/12 hover:bg-[#F7F4ED]'
                      }`}
                    >
                      <span>{freq.label}</span>
                      {frequencyDays === freq.days && (
                        <Check className="w-3.5 h-3.5 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Savings Simulation */}
              <div className="rounded-2xl bg-[#A8BFA3]/25 border border-[#A8BFA3] p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#30483A]/80">Valor avulso:</span>
                  <span className="line-through text-[#30483A]/60 tabular-nums">
                    {formatBRL(regularTotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#30483A]">
                    No Clube Miau (-15%):
                  </span>
                  <span className="font-display font-bold text-2xl text-[#30483A] tabular-nums">
                    {formatBRL(clubPriceTotal)}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#30483A]/12 flex items-center justify-between text-xs font-semibold text-[#30483A]">
                  <span>Economia estimada em 12 meses:</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#F4AD73] text-[#30483A] font-bold tabular-nums">
                    {formatBRL(annualSavings)}/ano
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  selectedProduct &&
                  onSubscribeToCart(selectedProduct.id, quantity, frequencyDays)
                }
                className="w-full py-3.5 px-5 rounded-2xl bg-[#30483A] text-white font-semibold text-sm sm:text-base hover:bg-[#24372c] active:scale-[0.99] transition-all inline-flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Adicionar assinatura ao carrinho</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
