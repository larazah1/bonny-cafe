"use client";

import { useLocale } from "@/i18n/LocaleContext";

export default function AboutPage() {
  const { dict } = useLocale();
  const values = [
    { t: dict.about.value1Title, b: dict.about.value1Body },
    { t: dict.about.value2Title, b: dict.about.value2Body },
    { t: dict.about.value3Title, b: dict.about.value3Body },
  ];

  return (
    <div>
      <section className="bg-brown-950 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <span className="rounded-full border border-brown-700 px-4 py-1.5 text-xs font-medium text-brown-200">
            {dict.about.kicker}
          </span>
          <h1 className="font-display mt-5 text-3xl font-semibold leading-tight text-cream-50 sm:text-5xl">
            {dict.about.title}
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-6 text-lg leading-relaxed text-brown-700">
          <p>{dict.about.p1}</p>
          <p>{dict.about.p2}</p>
          <p>{dict.about.p3}</p>
        </div>
      </section>

      <section className="bg-brown-50 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-center text-2xl font-semibold text-brown-950 sm:text-3xl">
            {dict.about.valuesTitle}
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {values.map((v) => (
              <div key={v.t} className="rounded-2xl border border-brown-100 bg-white p-6 text-center">
                <h3 className="font-display text-lg font-semibold text-brown-950">{v.t}</h3>
                <p className="mt-2 text-sm text-brown-500">{v.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
