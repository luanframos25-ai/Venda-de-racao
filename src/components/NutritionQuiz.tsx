import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  RotateCcw,
  ShoppingBag,
} from 'lucide-react';
import { formatBRL } from '../data/catalog';
import { NutritionalNeed, Product, QuizAnswers } from '../types/store';
import { QuizCatIllustration } from './PawGraphics';
import { SafeImage } from './SafeImage';

interface NutritionQuizProps {
  products: Product[];
  onAddToCart: (productId: string, quantity: number) => void;
  onQuickView: (product: Product) => void;
}

const INITIAL_ANSWERS: QuizAnswers = {
  catName: '',
  age: 'adulto',
  weight: '3-a-5kg',
  neutered: true,
  activity: 'moderado',
  foodPreference: 'seca',
  nutritionalNeed: 'Trato Urinário',
};

const TOTAL_STEPS = 7;

export const NutritionQuiz: React.FC<NutritionQuizProps> = ({
  products,
  onAddToCart,
  onQuickView,
}) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswers>(INITIAL_ANSWERS);
  const [completed, setCompleted] = useState(false);

  const displayName = answers.catName.trim() || 'seu gatinho';

  const recommendations = useMemo(() => {
    const scored = products.map((product) => {
      let score = 0;

      if (answers.age === 'filhote' && product.ageGroups.includes('filhote')) {
        score += 4;
      } else if (
        answers.age === 'idoso' &&
        product.ageGroups.includes('idoso')
      ) {
        score += 4;
      } else if (
        answers.age === 'adulto' &&
        product.ageGroups.includes('adulto')
      ) {
        score += 3;
      }

      if (answers.neutered && product.ageGroups.includes('castrado')) {
        score += 3;
      }

      if (
        answers.foodPreference === 'seca' &&
        product.foodType === 'seca'
      ) {
        score += 3;
      } else if (
        answers.foodPreference === 'umida' &&
        product.foodType === 'umida'
      ) {
        score += 4;
      } else if (
        answers.foodPreference === 'natural' &&
        (product.foodType === 'natural' || product.isNatural)
      ) {
        score += 4;
      } else if (
        answers.foodPreference === 'mista' &&
        (product.foodType === 'seca' || product.foodType === 'umida')
      ) {
        score += 3;
      }

      if (product.nutritionalNeeds.includes(answers.nutritionalNeed)) {
        score += 4;
      }

      if (
        answers.activity === 'calmo' &&
        product.nutritionalNeeds.includes('Controle de Peso')
      ) {
        score += 2;
      }

      if (product.isBestseller) score += 0.5;

      return { product, score };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.product);
  }, [answers, products]);

  const progressPercent = completed ? 100 : Math.round((step / TOTAL_STEPS) * 100);

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleBack = () => {
    if (completed) {
      setCompleted(false);
    } else if (step > 1) {
      setStep((s) => s - 1);
    }
  };

  const handleReset = () => {
    setAnswers(INITIAL_ANSWERS);
    setStep(1);
    setCompleted(false);
  };

  return (
    <section id="quiz" className="py-14 sm:py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F7F4ED] rounded-3xl border border-[#30483A]/12 p-6 sm:p-10 shadow-sm">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold text-[#30483A]/65 tracking-wide mb-1">
                Recomendação personalizada · Passo a passo
              </p>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#30483A] text-balance">
                Qual é a ração perfeita para o seu gato?
              </h2>
            </div>

            <div className="shrink-0">
              <QuizCatIllustration step={completed ? 8 : step} className="w-16 h-16" />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-semibold text-[#30483A]/75 mb-2 tabular-nums">
              <span>
                {completed
                  ? `Resultado pronto para ${displayName}`
                  : `Etapa ${step} de ${TOTAL_STEPS}`}
              </span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-white border border-[#30483A]/10 overflow-hidden">
              <div
                className="h-full bg-[#30483A] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {!completed ? (
              <motion.div
                key={`step-${step}`}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="min-h-[210px] flex flex-col justify-between"
              >
                {step === 1 && (
                  <div className="space-y-4">
                    <h3 className="font-display font-semibold text-lg sm:text-xl text-[#30483A]">
                      1. Como se chama o seu gato?
                    </h3>
                    <p className="text-sm text-[#30483A]/75">
                      Vamos personalizar a indicação especialmente para ele(a).
                    </p>
                    <input
                      type="text"
                      value={answers.catName}
                      onChange={(e) =>
                        setAnswers({ ...answers, catName: e.target.value })
                      }
                      placeholder="Ex.: Mingau, Luna, Bento..."
                      aria-label="Nome do gato"
                      className="w-full max-w-md h-12 px-4 rounded-xl bg-white border border-[#30483A]/20 text-base text-[#30483A] focus:border-[#30483A] focus:outline-none"
                    />
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <h3 className="font-display font-semibold text-lg sm:text-xl text-[#30483A]">
                      2. Qual é a idade de {displayName}?
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        {
                          value: 'filhote',
                          title: 'Filhote',
                          desc: 'Até 12 meses de vida',
                        },
                        {
                          value: 'adulto',
                          title: 'Adulto',
                          desc: 'De 1 a 7 anos',
                        },
                        {
                          value: 'idoso',
                          title: 'Idoso (Sênior)',
                          desc: 'Acima de 7 anos',
                        },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() =>
                            setAnswers({
                              ...answers,
                              age: opt.value as QuizAnswers['age'],
                            })
                          }
                          className={`p-4 rounded-2xl border text-left transition-all ${
                            answers.age === opt.value
                              ? 'bg-[#30483A] text-white border-[#30483A]'
                              : 'bg-white text-[#30483A] border-[#30483A]/15 hover:border-[#A8BFA3]'
                          }`}
                        >
                          <p className="font-display font-semibold text-base">
                            {opt.title}
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              answers.age === opt.value
                                ? 'text-white/80'
                                : 'text-[#30483A]/70'
                            }`}
                          >
                            {opt.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <h3 className="font-display font-semibold text-lg sm:text-xl text-[#30483A]">
                      3. Qual é o peso aproximado de {displayName}?
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        {
                          value: 'ate-3kg',
                          title: 'Até 3 kg',
                          desc: 'Porte pequeno ou filhote',
                        },
                        {
                          value: '3-a-5kg',
                          title: 'De 3 kg a 5 kg',
                          desc: 'Porte médio equilibrado',
                        },
                        {
                          value: 'acima-5kg',
                          title: 'Acima de 5 kg',
                          desc: 'Porte grande ou robusto',
                        },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() =>
                            setAnswers({
                              ...answers,
                              weight: opt.value as QuizAnswers['weight'],
                            })
                          }
                          className={`p-4 rounded-2xl border text-left transition-all ${
                            answers.weight === opt.value
                              ? 'bg-[#30483A] text-white border-[#30483A]'
                              : 'bg-white text-[#30483A] border-[#30483A]/15 hover:border-[#A8BFA3]'
                          }`}
                        >
                          <p className="font-display font-semibold text-base">
                            {opt.title}
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              answers.weight === opt.value
                                ? 'text-white/80'
                                : 'text-[#30483A]/70'
                            }`}
                          >
                            {opt.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4">
                    <h3 className="font-display font-semibold text-lg sm:text-xl text-[#30483A]">
                      4. {displayName} é castrado(a)?
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                      {[
                        {
                          value: true,
                          title: 'Sim, é castrado(a)',
                          desc: 'Menor gasto calórico e foco no trato urinário',
                        },
                        {
                          value: false,
                          title: 'Não é castrado(a)',
                          desc: 'Metabolismo padrão e demanda energética integral',
                        },
                      ].map((opt) => (
                        <button
                          key={String(opt.value)}
                          type="button"
                          onClick={() =>
                            setAnswers({ ...answers, neutered: opt.value })
                          }
                          className={`p-4 rounded-2xl border text-left transition-all ${
                            answers.neutered === opt.value
                              ? 'bg-[#30483A] text-white border-[#30483A]'
                              : 'bg-white text-[#30483A] border-[#30483A]/15 hover:border-[#A8BFA3]'
                          }`}
                        >
                          <p className="font-display font-semibold text-base">
                            {opt.title}
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              answers.neutered === opt.value
                                ? 'text-white/80'
                                : 'text-[#30483A]/70'
                            }`}
                          >
                            {opt.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-4">
                    <h3 className="font-display font-semibold text-lg sm:text-xl text-[#30483A]">
                      5. Como é o nível de atividade no dia a dia?
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        {
                          value: 'calmo',
                          title: 'Tranquilo / Caseiro',
                          desc: 'Adora cochilos no sofá e sol na janela',
                        },
                        {
                          value: 'moderado',
                          title: 'Moderado / Brincalhão',
                          desc: 'Alterna sonecas com sessões de varinha',
                        },
                        {
                          value: 'ativo',
                          title: 'Muito ativo / Explorador',
                          desc: 'Escala prateleiras e corre pela casa',
                        },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() =>
                            setAnswers({
                              ...answers,
                              activity: opt.value as QuizAnswers['activity'],
                            })
                          }
                          className={`p-4 rounded-2xl border text-left transition-all ${
                            answers.activity === opt.value
                              ? 'bg-[#30483A] text-white border-[#30483A]'
                              : 'bg-white text-[#30483A] border-[#30483A]/15 hover:border-[#A8BFA3]'
                          }`}
                        >
                          <p className="font-display font-semibold text-base">
                            {opt.title}
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              answers.activity === opt.value
                                ? 'text-white/80'
                                : 'text-[#30483A]/70'
                            }`}
                          >
                            {opt.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 6 && (
                  <div className="space-y-4">
                    <h3 className="font-display font-semibold text-lg sm:text-xl text-[#30483A]">
                      6. Qual tipo de refeição {displayName} prefere?
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {[
                        {
                          value: 'seca',
                          title: 'Ração seca crocante',
                          desc: 'Praticidade diária e mastigação',
                        },
                        {
                          value: 'umida',
                          title: 'Sachês úmidos',
                          desc: 'Alta hidratação e aroma intenso',
                        },
                        {
                          value: 'mista',
                          title: 'Alimentação mista',
                          desc: 'Seca + sachê ao longo do dia',
                        },
                        {
                          value: 'natural',
                          title: 'Receita natural / sem grãos',
                          desc: 'Ingredientes minimamente processados',
                        },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() =>
                            setAnswers({
                              ...answers,
                              foodPreference:
                                opt.value as QuizAnswers['foodPreference'],
                            })
                          }
                          className={`p-4 rounded-2xl border text-left transition-all ${
                            answers.foodPreference === opt.value
                              ? 'bg-[#30483A] text-white border-[#30483A]'
                              : 'bg-white text-[#30483A] border-[#30483A]/15 hover:border-[#A8BFA3]'
                          }`}
                        >
                          <p className="font-display font-semibold text-sm sm:text-base">
                            {opt.title}
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              answers.foodPreference === opt.value
                                ? 'text-white/80'
                                : 'text-[#30483A]/70'
                            }`}
                          >
                            {opt.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 7 && (
                  <div className="space-y-4">
                    <h3 className="font-display font-semibold text-lg sm:text-xl text-[#30483A]">
                      7. Existe alguma prioridade nutricional específica?
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {(
                        [
                          'Trato Urinário',
                          'Controle de Peso',
                          'Bolas de Pelo',
                          'Digestão Sensível',
                          'Pele & Pelagem',
                          'Sem Grãos',
                        ] as NutritionalNeed[]
                      ).map((need) => (
                        <button
                          key={need}
                          type="button"
                          onClick={() =>
                            setAnswers({ ...answers, nutritionalNeed: need })
                          }
                          className={`p-4 rounded-2xl border text-left font-display font-semibold text-sm sm:text-base transition-all flex items-center justify-between ${
                            answers.nutritionalNeed === need
                              ? 'bg-[#30483A] text-white border-[#30483A]'
                              : 'bg-white text-[#30483A] border-[#30483A]/15 hover:border-[#A8BFA3]'
                          }`}
                        >
                          <span>{need}</span>
                          {answers.nutritionalNeed === need && (
                            <Check className="w-4 h-4 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-8 mt-6 border-t border-[#30483A]/10">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={step === 1}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-[#30483A] hover:bg-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#30483A] text-white text-sm font-semibold hover:bg-[#24372c] transition-colors"
                  >
                    <span>
                      {step === TOTAL_STEPS ? 'Ver recomendações' : 'Próxima etapa'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="quiz-results"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display font-bold text-xl text-[#30483A]">
                      Combinações ideais para {displayName}
                    </h3>
                    <p className="text-sm text-[#30483A]/75 mt-0.5">
                      Perfil: {answers.age} ·{' '}
                      {answers.neutered ? 'castrado(a)' : 'não castrado(a)'} ·
                      foco em {answers.nutritionalNeed.toLowerCase()}.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#30483A] hover:text-[#F4AD73] transition-colors self-start sm:self-auto"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Refazer quiz</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {recommendations.map((product, index) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl border border-[#30483A]/12 p-4 flex flex-col"
                    >
                      <div className="text-xs font-bold text-[#30483A] mb-2">
                        {index === 0
                          ? '01. Maior compatibilidade'
                          : `0${index + 1}. Ótima alternativa`}
                      </div>
                      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#F7F4ED] mb-3">
                        <SafeImage
                          src={product.image}
                          alt={product.imageAlt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs text-[#30483A]/65">
                        {product.brand} · {product.weight}
                      </p>
                      <h4 className="font-display font-semibold text-base text-[#30483A] mt-0.5 line-clamp-2">
                        {product.name}
                      </h4>
                      <p className="font-display font-bold text-lg text-[#30483A] tabular-nums mt-2 mb-4">
                        {formatBRL(product.price)}
                      </p>
                      <div className="mt-auto flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onQuickView(product)}
                          className="px-3 py-2.5 rounded-xl border border-[#30483A]/15 text-xs font-semibold text-[#30483A] hover:bg-[#F7F4ED] transition-colors"
                        >
                          Detalhes
                        </button>
                        <button
                          type="button"
                          onClick={() => onAddToCart(product.id, 1)}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-[#30483A] text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-[#24372c] transition-colors"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>Adicionar</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mandatory Veterinary Disclaimer */}
                <div className="bg-white rounded-2xl border border-[#30483A]/12 p-4 flex items-start gap-3 text-xs sm:text-sm text-[#30483A]/80">
                  <AlertCircle className="w-5 h-5 text-[#F4AD73] shrink-0 mt-0.5" />
                  <p>
                    <strong>Aviso importante:</strong> As sugestões geradas
                    neste quiz têm caráter informativo e demonstrativo. Elas não
                    substituem a avaliação clínica nem a orientação nutricional
                    de um médico-veterinário.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
