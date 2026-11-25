import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Compass } from 'lucide-react';
import { HERO_IMAGE } from '../config/store';
import { PawPrintSvg } from './PawGraphics';
import { SafeImage } from './SafeImage';

interface HeroSectionProps {
  onShopNow: () => void;
  onStartQuiz: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onShopNow,
  onStartQuiz,
}) => {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-[#F7F4ED] pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-20"
    >
      {/* Decorative delicate paw motifs */}
      <div className="pointer-events-none absolute top-10 left-[6%] text-[#A8BFA3] animate-paw-float hidden md:block">
        <PawPrintSvg className="w-8 h-8 rotate-[-18deg]" />
      </div>
      <div className="pointer-events-none absolute bottom-12 left-[44%] text-[#F4AD73] animate-paw-float-delayed hidden lg:block">
        <PawPrintSvg className="w-6 h-6 rotate-[14deg]" />
      </div>
      <div className="pointer-events-none absolute top-14 right-[5%] text-[#A8BFA3] animate-paw-float hidden lg:block">
        <PawPrintSvg className="w-7 h-7 rotate-[25deg]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Copy Column */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col justify-center space-y-6"
          >
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#30483A]/75 tracking-wide">
              <span>Nutrição felina selecionada</span>
              <span aria-hidden="true">·</span>
              <span>Receitas naturais e funcionais</span>
            </div>

            <h1 className="font-display font-bold text-[#30483A] text-3xl sm:text-4xl lg:text-[44px] leading-[1.15] tracking-tight text-balance">
              Grandes cuidados para pequenos felinos.
            </h1>

            <p className="text-base sm:text-lg text-[#30483A]/80 leading-relaxed max-w-xl">
              Nutrição, sabor e carinho em cada refeição. Encontre a ração ideal
              para o seu melhor amigo.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
              <button
                type="button"
                onClick={onShopNow}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#30483A] text-white font-semibold text-sm sm:text-base shadow-sm hover:bg-[#24372c] hover:-translate-y-0.5 active:translate-y-0 transition-all whitespace-nowrap shrink-0"
              >
                <span>Comprar agora</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onStartQuiz}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#F4AD73]/25 text-[#30483A] border border-[#F4AD73]/60 font-semibold text-sm sm:text-base hover:bg-[#F4AD73]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all whitespace-nowrap shrink-0"
              >
                <Compass className="w-4 h-4" />
                <span>Descobrir a ração ideal</span>
              </button>
            </div>

            <div className="pt-3 border-t border-[#30483A]/10 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-[#30483A]/75">
              <span>Sem corantes artificiais</span>
              <span aria-hidden="true">·</span>
              <span>15% OFF no Clube Miau</span>
              <span aria-hidden="true">·</span>
              <span>Entrega em todo o Brasil</span>
            </div>
          </motion.div>

          {/* Editorial Media Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative"
          >
            <div className="relative h-full min-h-[280px] sm:min-h-[380px] lg:min-h-[440px] rounded-3xl overflow-hidden bg-[#E7E2D6] shadow-[0_18px_45px_rgba(48,72,58,0.10)]">
              <SafeImage
                src={HERO_IMAGE}
                alt="Gato carismático sentado ao lado de embalagens de ração verde sálvia e creme"
                loading="eager"
                className="w-full h-full object-cover lg:absolute lg:inset-0"
                fallbackLabel="Miau & Co. — Nutrição Felina"
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#30483A]/30 to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
