import React, { useState } from 'react';
import {
  BookOpen,
  Check,
  ChevronDown,
  Instagram,
  Mail,
  MessageCircle,
  Star,
  X,
} from 'lucide-react';
import {
  BLOG_ARTICLES,
  FAQ_ITEMS,
  ILLUSTRATIVE_REVIEWS,
} from '../data/catalog';
import { BlogArticle } from '../types/store';
import { BrandLogoMark, PawPrintSvg } from './PawGraphics';
import { SafeImage } from './SafeImage';

interface CommunityAndInfoProps {
  brandName: string;
  whatsappNumber: string;
  onNavigateSection: (id: string) => void;
}

export const CommunityAndInfo: React.FC<CommunityAndInfoProps> = ({
  brandName,
  whatsappNumber,
  onNavigateSection,
}) => {
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQ_ITEMS[0].id);
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(
    null
  );
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSaved, setNewsletterSaved] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSaved(true);
    setNewsletterEmail('');
  };

  return (
    <>
      {/* Illustrative Reviews */}
      <section className="py-14 sm:py-16 bg-[#F7F4ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-8">
            <p className="text-xs font-semibold text-[#30483A]/65 tracking-wide mb-1">
              Exemplos ilustrativos de avaliações · Conteúdo demonstrativo
            </p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#30483A]">
              Como tutores avaliam a experiência
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ILLUSTRATIVE_REVIEWS.map((review) => (
              <article
                key={review.id}
                className="bg-white rounded-2xl border border-[#30483A]/10 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: review.rating }).map((_, idx) => (
                      <Star
                        key={idx}
                        className="w-4 h-4 fill-[#F4AD73] text-[#F4AD73]"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-[#30483A]/85 leading-relaxed mb-4">
                    "{review.comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-[#30483A]/10 text-xs">
                  <p className="font-bold text-[#30483A]">
                    {review.tutorName} · Tutor(a) de {review.catName}
                  </p>
                  <p className="text-[#30483A]/65 mt-0.5">
                    {review.productName} · {review.city}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section id="blog" className="py-14 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-8">
            <p className="text-xs font-semibold text-[#30483A]/65 tracking-wide mb-1">
              Diário Felino · Dicas de alimentação e cuidado
            </p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#30483A]">
              Leituras rápidas para cuidar ainda melhor
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BLOG_ARTICLES.map((article) => (
              <article
                key={article.id}
                className="bg-[#F7F4ED]/65 rounded-2xl border border-[#30483A]/10 overflow-hidden flex flex-col"
              >
                <div className="aspect-[4/3] bg-[#E8E3D7] overflow-hidden">
                  <SafeImage
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="text-xs text-[#30483A]/65 font-semibold mb-2">
                    {article.category} · {article.readTime}
                  </div>
                  <h3 className="font-display font-bold text-lg text-[#30483A] leading-snug mb-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-[#30483A]/75 leading-relaxed mb-4">
                    {article.summary}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedArticle(article)}
                    className="mt-auto inline-flex items-center gap-1.5 text-sm font-bold text-[#30483A] hover:text-[#F4AD73] transition-colors self-start"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Ler artigo completo</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-14 sm:py-16 bg-[#F7F4ED] border-t border-[#30483A]/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold text-[#30483A]/65 tracking-wide mb-1">
              Dúvidas frequentes
            </p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#30483A]">
              Perguntas sobre rações, entregas e assinatura
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-[#30483A]/10 overflow-hidden"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-display font-semibold text-sm sm:text-base text-[#30483A] hover:bg-[#F7F4ED]/40 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-sm text-[#30483A]/80 leading-relaxed border-t border-[#30483A]/8 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 sm:py-14 bg-[#A8BFA3]/30 border-t border-[#30483A]/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <PawPrintSvg className="w-8 h-8 text-[#30483A] mx-auto mb-3" />
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#30483A] text-balance">
            Receba novidades, cupons e dicas felinas
          </h2>
          <p className="text-sm sm:text-base text-[#30483A]/80 mt-2 max-w-lg mx-auto">
            Prometemos enviar apenas conteúdos leves, receitas e ofertas para o
            seu gato — sem encher sua caixa de entrada.
          </p>

          {newsletterSaved ? (
            <div className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-[#30483A] font-semibold text-sm shadow-xs">
              <Check className="w-4 h-4 text-[#30483A]" />
              <span>
                Miau! E-mail cadastrado na lista demonstrativa de novidades.
              </span>
            </div>
          ) : (
            <form
              onSubmit={handleNewsletterSubmit}
              className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="seuemail@exemplo.com.br"
                aria-label="E-mail para receber novidades"
                className="flex-1 h-12 px-4 rounded-xl bg-white border border-[#30483A]/15 text-sm text-[#30483A]"
              />
              <button
                type="submit"
                className="h-12 px-6 rounded-xl bg-[#30483A] text-white font-semibold text-sm hover:bg-[#24372c] transition-colors whitespace-nowrap shrink-0"
              >
                Quero receber
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#30483A] text-[#F7F4ED] pt-12 pb-24 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/12">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <BrandLogoMark className="w-8 h-8" />
                <span className="font-display font-bold text-lg text-white">
                  {brandName}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#F7F4ED]/75 leading-relaxed">
                Nutrição felina pensada com carinho, ingredientes selecionados e
                experiência de compra acolhedora.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp de atendimento"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a
                  href="#blog"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateSection('blog');
                  }}
                  aria-label="Conteúdo e Instagram ilustrativo"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="mailto:ola@miaueco.exemplo.br"
                  aria-label="E-mail de contato"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-display font-semibold text-sm text-white mb-3">
                Navegação
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-[#F7F4ED]/75">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigateSection('inicio')}
                    className="hover:text-white"
                  >
                    Início
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigateSection('produtos')}
                    className="hover:text-white"
                  >
                    Vitrine de produtos
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigateSection('quiz')}
                    className="hover:text-white"
                  >
                    Quiz nutricional
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigateSection('clube-miau')}
                    className="hover:text-white"
                  >
                    Clube Miau (Assinatura)
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-display font-semibold text-sm text-white mb-3">
                Institucional &amp; Políticas
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-[#F7F4ED]/75">
                <li>Sobre a {brandName}</li>
                <li>Política de Privacidade (LGPD)</li>
                <li>Trocas e Devoluções</li>
                <li>Termos de Uso Demonstrativo</li>
              </ul>
            </div>

            <div>
              <h3 className="font-display font-semibold text-sm text-white mb-3">
                Atendimento &amp; Pagamentos
              </h3>
              <p className="text-xs sm:text-sm text-[#F7F4ED]/75 mb-3">
                WhatsApp: {whatsappNumber}
                <br />
                Seg a Sex, 9h às 18h
              </p>
              <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold text-white/90">
                <span className="px-2 py-1 rounded bg-white/10">Pix</span>
                <span className="px-2 py-1 rounded bg-white/10">Visa</span>
                <span className="px-2 py-1 rounded bg-white/10">Mastercard</span>
                <span className="px-2 py-1 rounded bg-white/10">Elo</span>
                <span className="px-2 py-1 rounded bg-white/10">Boleto</span>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#F7F4ED]/65">
            <p>
              © {new Date().getFullYear()} {brandName} — Todos os direitos
              reservados.
            </p>
            <p>
              Loja demonstrativa com produtos, preços e avaliações fictícias.
            </p>
          </div>
        </div>
      </footer>

      {/* Blog Article Reader Modal */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={selectedArticle.title}
        >
          <div
            className="fixed inset-0 bg-[#30483A]/50 backdrop-blur-[2px]"
            onClick={() => setSelectedArticle(null)}
          />
          <div className="relative z-10 bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedArticle(null)}
              aria-label="Fechar artigo"
              className="absolute top-4 right-4 p-2 rounded-xl bg-[#F7F4ED] text-[#30483A] hover:bg-[#E8E3D7]"
            >
              <X className="w-5 h-5" />
            </button>

            <p className="text-xs font-semibold text-[#30483A]/65 mb-2">
              {selectedArticle.category} · {selectedArticle.readTime}
            </p>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-[#30483A] mb-4 pr-8">
              {selectedArticle.title}
            </h3>
            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-[#F7F4ED] mb-5">
              <SafeImage
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-3 text-sm sm:text-base text-[#30483A]/85 leading-relaxed">
              {selectedArticle.content.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
