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
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;600;900&family=Noto+Sans+TC:wght@300;400;500&display=swap"
        rel="stylesheet"
      />
      <div
        className="min-h-screen relative overflow-x-hidden"
        style={{
          background: "linear-gradient(160deg,#fdf8f3 0%,#faeee6 50%,#fdf4ef 100%)",
          color: "#3d2b1f",
          fontFamily: "'Noto Sans TC', sans-serif",
        }}
      >
        {/* Background glows */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 0 }}
        >
          <div
            className="absolute rounded-full"
            style={{
              width: 400, height: 400, top: -100, left: -100,
              background: "radial-gradient(circle,rgba(201,133,110,.18),transparent)",
              filter: "blur(80px)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: 300, height: 300, bottom: "10%", right: -80,
              background: "radial-gradient(circle,rgba(201,133,110,.12),transparent)",
              filter: "blur(80px)",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative" style={{ zIndex: 1 }}>
          <div className="max-w-xl mx-auto px-5 pb-20">
            <HeroSection
              title={page.hero_title ?? page.name}
              subtitle={page.hero_subtitle ?? undefined}
              btn={page.btn ?? undefined}
              slug={page.slug}
            />

            {/* CTA text */}
            {page.cta && (
              <p
                className="text-center leading-relaxed mb-8 whitespace-pre-line"
                style={{ fontSize: 15, color: "#9a8070", lineHeight: 1.9 }}
              >
                {page.cta}
              </p>
            )}

            {/* Form */}
            <SubscribeForm slug={page.slug} btnLabel={page.btn ?? "立即領取"} />

            {/* Consult scripts */}
            {consults.length > 0 && (
              <section className="mt-10">
                <ConsultSection scripts={consults} />
              </section>
            )}

            {/* FAQ */}
            {faqs.length > 0 && (
              <section className="mt-10">
                <FaqSection faqs={faqs} />
              </section>
            )}

            {/* Footer */}
            <p
              className="text-center mt-12"
              style={{ fontSize: 12, color: "#c0a090", lineHeight: 1.7 }}
            >
              🔒 你的資訊不會分享給任何第三方
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
