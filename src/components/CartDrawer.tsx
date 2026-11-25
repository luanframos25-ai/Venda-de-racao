import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import { DEMO_COUPONS } from '../config/store';
import { formatBRL } from '../data/catalog';
import { CartItem, Product } from '../types/store';
import { SafeImage } from './SafeImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  products: Product[];
  freeShippingThreshold: number;
  onUpdateQuantity: (productId: string, isSubscription: boolean, quantity: number) => void;
  onRemoveItem: (productId: string, isSubscription: boolean) => void;
  onClearCart: () => void;
}

type CheckoutStep = 'cart' | 'address' | 'shipping' | 'payment' | 'confirmed';

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  products,
  freeShippingThreshold,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const [cepInput, setCepInput] = useState('');
  const [simulatedCep, setSimulatedCep] = useState<string | null>(null);
  const [shippingOption, setShippingOption] = useState<'padrao' | 'expresso'>(
    'padrao'
  );

  const [step, setStep] = useState<CheckoutStep>('cart');
  const [customerName, setCustomerName] = useState('Ana Clara');
  const [customerEmail, setCustomerEmail] = useState('ana@exemplo.com.br');
  const [addressStreet, setAddressStreet] = useState('Rua das Acácias, 240');
  const [addressCity, setAddressCity] = useState('São Paulo - SP');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao'>('pix');
  const [orderNumber, setOrderNumber] = useState('MC-4821');

  const resolvedItems = useMemo(() => {
    return items
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;
        const unitPrice = item.isSubscription
          ? product.price * 0.85
          : product.price;
        return {
          ...item,
          product,
          unitPrice,
          lineTotal: unitPrice * item.quantity,
        };
      })
      .filter((x): x is NonNullable<typeof x> => Boolean(x));
  }, [items, products]);

  const subtotal = useMemo(
    () => resolvedItems.reduce((sum, item) => sum + item.lineTotal, 0),
    [resolvedItems]
  );

  const appliedCoupon = useMemo(
    () => DEMO_COUPONS.find((c) => c.code === appliedCouponCode) ?? null,
    [appliedCouponCode]
  );

  const couponDiscount = useMemo(() => {
    if (!appliedCoupon?.discountPercent) return 0;
    return subtotal * (appliedCoupon.discountPercent / 100);
  }, [appliedCoupon, subtotal]);

  const qualifiesFreeShipping =
    subtotal >= freeShippingThreshold || Boolean(appliedCoupon?.freeShipping);

  const baseShippingCost = useMemo(() => {
    if (resolvedItems.length === 0) return 0;
    if (qualifiesFreeShipping && shippingOption === 'padrao') return 0;
    if (shippingOption === 'expresso') return 29.9;
    return simulatedCep ? 18.9 : 19.9;
  }, [resolvedItems.length, qualifiesFreeShipping, shippingOption, simulatedCep]);

  const total = Math.max(0, subtotal - couponDiscount + baseShippingCost);

  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = couponInput.trim().toUpperCase();
    const found = DEMO_COUPONS.find((c) => c.code === clean);
    if (!found) {
      setCouponError('Cupom inválido. Tente MIAU10, PRIMEIRACOMPRA ou FRETEGRATIS.');
      return;
    }
    setCouponError(null);
    setAppliedCouponCode(found.code);
    setCouponInput('');
  };

  const handleSimulateCep = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = cepInput.replace(/\D/g, '');
    if (digits.length < 8) return;
    setSimulatedCep(`${digits.slice(0, 5)}-${digits.slice(5, 8)}`);
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const randomNum = Math.floor(1000 + Math.random() * 8999);
    setOrderNumber(`MC-${randomNum}`);
    setStep('confirmed');
    onClearCart();
  };

  const handleCloseDrawer = () => {
    if (step === 'confirmed') {
      setStep('cart');
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Carrinho de compras"
    >
      <div
        className="fixed inset-0 bg-[#30483A]/45 backdrop-blur-[2px]"
        onClick={handleCloseDrawer}
      />

      <div className="relative z-10 w-full max-w-md bg-white h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#30483A]/10 flex items-center justify-between bg-[#F7F4ED]">
          <div className="flex items-center gap-2.5">
            {step !== 'cart' && step !== 'confirmed' && (
              <button
                type="button"
                onClick={() => {
                  if (step === 'address') setStep('cart');
                  else if (step === 'shipping') setStep('address');
                  else if (step === 'payment') setStep('shipping');
                }}
                aria-label="Voltar etapa"
                className="p-1.5 rounded-lg hover:bg-white text-[#30483A]"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <ShoppingBag className="w-5 h-5 text-[#30483A]" />
            <h2 className="font-display font-bold text-lg text-[#30483A]">
              {step === 'cart' && 'Seu carrinho'}
              {step === 'address' && 'Checkout · Endereço'}
              {step === 'shipping' && 'Checkout · Entrega'}
              {step === 'payment' && 'Checkout · Pagamento'}
              {step === 'confirmed' && 'Pedido demonstrativo'}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleCloseDrawer}
            aria-label="Fechar carrinho"
            className="p-2 rounded-xl hover:bg-white text-[#30483A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar (only in cart step when items exist) */}
        {step === 'cart' && resolvedItems.length > 0 && (
          <div className="px-5 py-3 bg-[#A8BFA3]/20 border-b border-[#30483A]/10">
            <p className="text-xs font-semibold text-[#30483A] mb-1.5">
              {freeShippingRemaining === 0
                ? 'Frete grátis liberado para o seu gatinho!'
                : `Faltam ${formatBRL(freeShippingRemaining)} para ganhar frete grátis`}
            </p>
            <div className="h-2 rounded-full bg-white overflow-hidden">
              <div
                className="h-full bg-[#30483A] rounded-full transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {step === 'cart' && (
            <>
              {resolvedItems.length === 0 ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#F7F4ED] text-[#30483A] flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <p className="font-display font-bold text-lg text-[#30483A]">
                    Sua tigela ainda está vazia
                  </p>
                  <p className="text-sm text-[#30483A]/70 max-w-xs mx-auto">
                    Explore nossas rações, sachês e petiscos ou faça o quiz para
                    descobrir a opção ideal.
                  </p>
                  <button
                    type="button"
                    onClick={handleCloseDrawer}
                    className="px-5 py-2.5 rounded-xl bg-[#30483A] text-white text-sm font-semibold hover:bg-[#24372c]"
                  >
                    Continuar explorando
                  </button>
                </div>
              ) : (
                <>
                  {/* Items */}
                  <ul className="space-y-3">
                    {resolvedItems.map((item) => (
                      <li
                        key={`${item.productId}-${item.isSubscription ? 'sub' : 'one'}`}
                        className="flex gap-3.5 p-3 rounded-2xl bg-[#F7F4ED]/70 border border-[#30483A]/10"
                      >
                        <SafeImage
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-18 h-18 rounded-xl object-cover shrink-0 bg-white"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-bold text-[#30483A] line-clamp-2 leading-snug">
                              {item.product.name}
                            </p>
                            <button
                              type="button"
                              onClick={() =>
                                onRemoveItem(
                                  item.productId,
                                  Boolean(item.isSubscription)
                                )
                              }
                              aria-label={`Remover ${item.product.name}`}
                              className="text-[#30483A]/45 hover:text-[#30483A] p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <p className="text-xs text-[#30483A]/65 mt-0.5">
                            {item.product.weight}
                            {item.isSubscription
                              ? ` · Clube Miau (-15% a cada ${item.frequencyDays} dias)`
                              : ''}
                          </p>

                          <div className="flex items-center justify-between mt-2.5">
                            <div className="flex items-center rounded-lg bg-white border border-[#30483A]/15 h-8">
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateQuantity(
                                    item.productId,
                                    Boolean(item.isSubscription),
                                    item.quantity - 1
                                  )
                                }
                                aria-label="Diminuir quantidade"
                                className="w-7 h-full flex items-center justify-center hover:bg-[#F7F4ED] rounded-l-lg"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center text-xs font-bold tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateQuantity(
                                    item.productId,
                                    Boolean(item.isSubscription),
                                    item.quantity + 1
                                  )
                                }
                                aria-label="Aumentar quantidade"
                                className="w-7 h-full flex items-center justify-center hover:bg-[#F7F4ED] rounded-r-lg"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <span className="font-display font-bold text-sm text-[#30483A] tabular-nums">
                              {formatBRL(item.lineTotal)}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Coupon Box */}
                  <form onSubmit={handleApplyCoupon} className="space-y-2 pt-2">
                    <label
                      htmlFor="coupon-input"
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#30483A]"
                    >
                      <Tag className="w-3.5 h-3.5" />
                      <span>Cupom de desconto (ex.: MIAU10)</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="coupon-input"
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Digite o código"
                        className="flex-1 h-10 px-3 rounded-xl bg-[#F7F4ED] border border-[#30483A]/15 text-sm uppercase"
                      />
                      <button
                        type="submit"
                        className="px-4 h-10 rounded-xl bg-[#30483A]/10 text-[#30483A] text-xs font-bold hover:bg-[#30483A]/20 transition-colors"
                      >
                        Aplicar
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-xs text-[#b45309] font-medium">
                        {couponError}
                      </p>
                    )}
                    {appliedCoupon && (
                      <div className="flex items-center justify-between text-xs bg-[#A8BFA3]/25 text-[#30483A] px-3 py-2 rounded-xl font-semibold">
                        <span>
                          Cupom {appliedCoupon.code} ({appliedCoupon.label})
                        </span>
                        <button
                          type="button"
                          onClick={() => setAppliedCouponCode(null)}
                          className="underline"
                        >
                          Remover
                        </button>
                      </div>
                    )}
                  </form>

                  {/* CEP Simulator */}
                  <form onSubmit={handleSimulateCep} className="space-y-2">
                    <label
                      htmlFor="cep-input"
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#30483A]"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Simular frete por CEP</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="cep-input"
                        type="text"
                        value={cepInput}
                        onChange={(e) => setCepInput(e.target.value)}
                        placeholder="00000-000"
                        maxLength={9}
                        className="flex-1 h-10 px-3 rounded-xl bg-[#F7F4ED] border border-[#30483A]/15 text-sm tabular-nums"
                      />
                      <button
                        type="submit"
                        className="px-4 h-10 rounded-xl bg-[#30483A]/10 text-[#30483A] text-xs font-bold hover:bg-[#30483A]/20 transition-colors"
                      >
                        Calcular
                      </button>
                    </div>
                    {simulatedCep && (
                      <p className="text-xs text-[#30483A]/80">
                        CEP {simulatedCep}: Entrega padrão em 2 a 4 dias úteis (
                        {qualifiesFreeShipping
                          ? 'Grátis'
                          : formatBRL(baseShippingCost)}
                        ).
                      </p>
                    )}
                  </form>
                </>
              )}
            </>
          )}

          {/* Checkout Step 1: Address */}
          {step === 'address' && (
            <form
              id="checkout-address-form"
              onSubmit={(e) => {
                e.preventDefault();
                setStep('shipping');
              }}
              className="space-y-4"
            >
              <div className="p-3 rounded-xl bg-[#F4AD73]/20 text-xs text-[#30483A] font-medium">
                Fluxo demonstrativo de checkout — nenhuma cobrança real será
                realizada.
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#30483A] mb-1">
                  Nome do tutor
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#F7F4ED] border border-[#30483A]/15 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#30483A] mb-1">
                  E-mail para acompanhamento
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#F7F4ED] border border-[#30483A]/15 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#30483A] mb-1">
                  Endereço de entrega
                </label>
                <input
                  type="text"
                  required
                  value={addressStreet}
                  onChange={(e) => setAddressStreet(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#F7F4ED] border border-[#30483A]/15 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#30483A] mb-1">
                  Cidade / UF
                </label>
                <input
                  type="text"
                  required
                  value={addressCity}
                  onChange={(e) => setAddressCity(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#F7F4ED] border border-[#30483A]/15 text-sm"
                />
              </div>
            </form>
          )}

          {/* Checkout Step 2: Shipping */}
          {step === 'shipping' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#F7F4ED] flex items-start gap-2.5 text-xs text-[#30483A]">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold">{customerName}</p>
                  <p>
                    {addressStreet} · {addressCity}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                <p className="text-xs font-semibold text-[#30483A]">
                  Escolha a modalidade de entrega
                </p>
                <button
                  type="button"
                  onClick={() => setShippingOption('padrao')}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between ${
                    shippingOption === 'padrao'
                      ? 'border-[#30483A] bg-[#F7F4ED]'
                      : 'border-[#30483A]/15'
                  }`}
                >
                  <div>
                    <p className="text-sm font-bold text-[#30483A]">
                      Entrega Padrão (2 a 4 dias úteis)
                    </p>
                    <p className="text-xs text-[#30483A]/70">
                      Envio sustentável com embalagem reciclável
                    </p>
                  </div>
                  <span className="font-bold text-sm tabular-nums">
                    {qualifiesFreeShipping ? 'Grátis' : formatBRL(19.9)}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setShippingOption('expresso')}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between ${
                    shippingOption === 'expresso'
                      ? 'border-[#30483A] bg-[#F7F4ED]'
                      : 'border-[#30483A]/15'
                  }`}
                >
                  <div>
                    <p className="text-sm font-bold text-[#30483A]">
                      Miau Express (até 24h úteis)
                    </p>
                    <p className="text-xs text-[#30483A]/70">
                      Prioridade para reposição urgente
                    </p>
                  </div>
                  <span className="font-bold text-sm tabular-nums">
                    {formatBRL(29.9)}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Checkout Step 3: Payment */}
          {step === 'payment' && (
            <form
              id="checkout-payment-form"
              onSubmit={handleConfirmOrder}
              className="space-y-4"
            >
              <div className="space-y-2.5">
                <p className="text-xs font-semibold text-[#30483A]">
                  Forma de pagamento demonstrativa
                </p>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between ${
                    paymentMethod === 'pix'
                      ? 'border-[#30483A] bg-[#F7F4ED]'
                      : 'border-[#30483A]/15'
                  }`}
                >
                  <div>
                    <p className="text-sm font-bold text-[#30483A]">
                      Pix instantâneo (simulação)
                    </p>
                    <p className="text-xs text-[#30483A]/70">
                      Aprovação imediata no pedido demonstrativo
                    </p>
                  </div>
                  <CreditCard className="w-5 h-5 text-[#30483A]" />
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cartao')}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between ${
                    paymentMethod === 'cartao'
                      ? 'border-[#30483A] bg-[#F7F4ED]'
                      : 'border-[#30483A]/15'
                  }`}
                >
                  <div>
                    <p className="text-sm font-bold text-[#30483A]">
                      Cartão de crédito em até 3x sem juros (simulação)
                    </p>
                    <p className="text-xs text-[#30483A]/70">
                      Ambiente ilustrativo sem solicitação de dados reais
                    </p>
                  </div>
                  <CreditCard className="w-5 h-5 text-[#30483A]" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7F4ED] space-y-2 text-sm">
                <p className="font-bold text-[#30483A]">Resumo do pedido</p>
                <div className="flex justify-between text-xs text-[#30483A]/80">
                  <span>Itens ({resolvedItems.length})</span>
                  <span className="tabular-nums">{formatBRL(subtotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-xs text-[#30483A]">
                    <span>Cupom ({appliedCouponCode})</span>
                    <span className="tabular-nums">
                      -{formatBRL(couponDiscount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-[#30483A]/80">
                  <span>Entrega</span>
                  <span className="tabular-nums">
                    {baseShippingCost === 0
                      ? 'Grátis'
                      : formatBRL(baseShippingCost)}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#30483A]/12 flex justify-between font-bold text-[#30483A]">
                  <span>Total</span>
                  <span className="tabular-nums">{formatBRL(total)}</span>
                </div>
              </div>
            </form>
          )}

          {/* Checkout Step 4: Confirmed */}
          {step === 'confirmed' && (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#A8BFA3]/30 text-[#30483A] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <p className="text-xs font-semibold text-[#30483A]/70">
                Pedido demonstrativo #{orderNumber}
              </p>
              <h3 className="font-display font-bold text-2xl text-[#30483A]">
                Miau! Pedido simulado com sucesso
              </h3>
              <p className="text-sm text-[#30483A]/75 max-w-xs mx-auto leading-relaxed">
                Obrigado, {customerName}! Este é um resumo demonstrativo
                enviado para <strong>{customerEmail}</strong> (nenhuma cobrança
                real foi efetuada).
              </p>
              <button
                type="button"
                onClick={handleCloseDrawer}
                className="mt-2 px-6 py-3 rounded-xl bg-[#30483A] text-white text-sm font-semibold hover:bg-[#24372c]"
              >
                Voltar para a loja
              </button>
            </div>
          )}
        </div>

        {/* Footer Summary + Primary Action */}
        {step !== 'confirmed' && resolvedItems.length > 0 && (
          <div className="p-5 border-t border-[#30483A]/10 bg-white space-y-3">
            {step === 'cart' && (
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-[#30483A]/75">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{formatBRL(subtotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-[#30483A] font-medium">
                    <span>Desconto cupom</span>
                    <span className="tabular-nums">
                      -{formatBRL(couponDiscount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-[#30483A]/75">
                  <span>Frete estimado</span>
                  <span className="tabular-nums">
                    {baseShippingCost === 0
                      ? 'Grátis'
                      : formatBRL(baseShippingCost)}
                  </span>
                </div>
                <div className="flex justify-between font-display font-bold text-lg text-[#30483A] pt-1.5 border-t border-[#30483A]/10">
                  <span>Total</span>
                  <span className="tabular-nums">{formatBRL(total)}</span>
                </div>
              </div>
            )}

            {step === 'cart' && (
              <button
                type="button"
                onClick={() => setStep('address')}
                className="w-full py-3.5 rounded-2xl bg-[#30483A] text-white font-semibold text-sm sm:text-base hover:bg-[#24372c] transition-colors"
              >
                Finalizar compra (demo)
              </button>
            )}
            {step === 'address' && (
              <button
                type="submit"
                form="checkout-address-form"
                className="w-full py-3.5 rounded-2xl bg-[#30483A] text-white font-semibold text-sm sm:text-base hover:bg-[#24372c] transition-colors"
              >
                Continuar para entrega
              </button>
            )}
            {step === 'shipping' && (
              <button
                type="button"
                onClick={() => setStep('payment')}
                className="w-full py-3.5 rounded-2xl bg-[#30483A] text-white font-semibold text-sm sm:text-base hover:bg-[#24372c] transition-colors"
              >
                Continuar para pagamento
              </button>
            )}
            {step === 'payment' && (
              <button
                type="submit"
                form="checkout-payment-form"
                className="w-full py-3.5 rounded-2xl bg-[#30483A] text-white font-semibold text-sm sm:text-base hover:bg-[#24372c] transition-colors"
              >
                Confirmar pedido demonstrativo
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
