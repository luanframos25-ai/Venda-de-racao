import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORIES } from '../data/catalog';
import { CategorySlug } from '../types/store';
import { SafeImage } from './SafeImage';

interface CategoriesSectionProps {
  activeCategory: CategorySlug;
  onSelectCategory: (slug: CategorySlug) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <section
      id="categorias"
      className="py-14 sm:py-16 bg-white border-y border-[#30483A]/8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <p className="text-xs font-semibold text-[#30483A]/65 tracking-wide mb-1.5">
              Navegue por fase e estilo alimentar
            </p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#30483A] text-balance">
              Escolha o melhor para o momento do seu gato
            </h2>
          </div>

          {activeCategory !== 'todos' && (
            <button
              type="button"
              onClick={() => onSelectCategory('todos')}
              className="self-start sm:self-auto text-sm font-semibold text-[#30483A] underline underline-offset-4 hover:text-[#F4AD73] transition-colors whitespace-nowrap shrink-0"
            >
              Ver todas as categorias
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((category, idx) => {
            const isSelected = activeCategory === category.slug;
            return (
              <motion.button
                key={category.slug}
                type="button"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.35,
                  delay: Math.min(idx * 0.04, 0.2),
                  ease: [0.16, 1, 0.3, 1],
                }}
                onClick={() => onSelectCategory(category.slug)}
                aria-pressed={isSelected}
                className={`group text-left rounded-2xl p-3 sm:p-4 transition-all duration-200 border ${
                  isSelected
                    ? 'bg-[#F7F4ED] border-[#30483A] shadow-md -translate-y-0.5'
                    : 'bg-[#F7F4ED]/65 border-[#30483A]/10 hover:bg-[#F7F4ED] hover:border-[#A8BFA3] hover:-translate-y-1 hover:shadow-sm'
                }`}
              >
                <div
                  className="relative aspect-[4/3] w-full rounded-xl overflow-hidden mb-3"
                  style={{ backgroundColor: category.accentBg }}
                >
                  <SafeImage
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    fallbackLabel={category.title}
                  />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-display font-semibold text-sm sm:text-base text-[#30483A] leading-snug">
                      {category.title}
                    </h3>
                    <p className="text-xs text-[#30483A]/70 mt-0.5 line-clamp-1">
                      {category.subtitle}
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#30483A]/50 group-hover:text-[#30483A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 mt-0.5" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
