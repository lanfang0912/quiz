import type { LandingPage } from "@/types";
import { HeroSection } from "./HeroSection";
import { FaqSection } from "./FaqSection";
import { SubscribeForm } from "./SubscribeForm";
import { ConsultSection } from "./ConsultSection";

export function LandingPageView({ page }: { page: LandingPage }) {
  const faqs = [
    page.faq_1_q && page.faq_1_a ? { q: page.faq_1_q, a: page.faq_1_a } : null,
    page.faq_2_q && page.faq_2_a ? { q: page.faq_2_q, a: page.faq_2_a } : null,
    page.faq_3_q && page.faq_3_a ? { q: page.faq_3_q, a: page.faq_3_a } : null,
  ].filter(Boolean) as { q: string; a: string }[];

  const consults = [page.consult_1, page.consult_2, page.consult_3].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <HeroSection
        title={page.hero_title ?? page.name}
        subtitle={page.hero_subtitle ?? undefined}
        btn={page.btn ?? undefined}
        slug={page.slug}
      />

      {/* 主要表單 */}
      <section className="py-12 px-4 max-w-lg mx-auto">
        {page.cta && (
          <p className="text-center text-gray-600 mb-6 leading-relaxed whitespace-pre-line">
            {page.cta}
          </p>
        )}
        <SubscribeForm slug={page.slug} btnLabel={page.btn ?? "立即領取"} />
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-10 px-4 max-w-2xl mx-auto">
          <FaqSection faqs={faqs} />
        </section>
      )}

      {/* Consult Scripts */}
      {consults.length > 0 && (
        <section className="py-10 px-4 max-w-2xl mx-auto">
          <ConsultSection scripts={consults} />
        </section>
      )}

      {/* 結尾 CTA */}
      {page.btn && (
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-lg mx-auto text-center">
            <SubscribeForm slug={page.slug} btnLabel={page.btn} />
          </div>
        </section>
      )}
    </div>
  );
}
