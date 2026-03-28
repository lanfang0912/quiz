"use client";

import { useState } from "react";

type Faq = { q: string; a: string };

export function FaqSection({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">常見問題</h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4
                         text-left text-sm font-medium text-gray-900 hover:bg-gray-50"
            >
              <span>{faq.q}</span>
              <span className="text-gray-400 text-lg leading-none ml-4">
                {open === i ? "−" : "+"}
              </span>
            </button>
            {open === i && (
              <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed whitespace-pre-line border-t border-gray-100">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
