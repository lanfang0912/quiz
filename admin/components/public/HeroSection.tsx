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
    <section className="bg-gradient-to-b from-blue-600 to-blue-700 text-white py-20 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-blue-100 text-lg leading-relaxed mb-8 whitespace-pre-line">
            {subtitle}
          </p>
        )}
        {btn && (
          <button
            onClick={scrollToForm}
            className="inline-block bg-white text-blue-700 font-semibold
                       px-8 py-3 rounded-full shadow hover:shadow-md
                       transition-all hover:-translate-y-0.5"
          >
            {btn}
          </button>
        )}
      </div>
    </section>
  );
}
