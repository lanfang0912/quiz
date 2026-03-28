"use client";

type Props = {
  title: string;
  subtitle?: string;
  btn?: string;
  slug: string;
};

export function HeroSection({ title, subtitle, btn, slug }: Props) {
  function scrollToForm() {
    document.getElementById(`subscribe-form-${slug}`)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="text-center pt-16 pb-10">
      <div
        className="inline-block mb-8 px-4 py-1.5 rounded-full"
        style={{
          color: "#a07850",
          border: "1px solid rgba(201,169,110,.35)",
          letterSpacing: "0.2em",
          fontSize: 11,
        }}
      >
        免費領取
      </div>
      <h1
        className="mb-4 leading-snug"
        style={{
          fontFamily: "'Noto Serif TC', serif",
          fontWeight: 900,
          fontSize: "clamp(26px, 6vw, 40px)",
          color: "#3d2b1f",
          lineHeight: 1.4,
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className="mx-auto mb-10 whitespace-pre-line"
          style={{ fontSize: 15, lineHeight: 1.9, color: "#9a8070", maxWidth: 420 }}
        >
          {subtitle}
        </p>
      )}
      {btn && (
        <button
          onClick={scrollToForm}
          className="inline-block rounded-xl px-8 py-3 text-white font-medium transition-all hover:-translate-y-0.5"
          style={{
            background: "linear-gradient(135deg,#b07060,#c9856e)",
            fontSize: 15,
            letterSpacing: "0.05em",
            boxShadow: "0 8px 32px rgba(176,112,96,.3)",
          }}
        >
          {btn}
        </button>
      )}
    </section>
  );
}
