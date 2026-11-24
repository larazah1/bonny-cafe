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
      <section className="bg-primary-deep py-20">
        <div className="container-page max-w-3xl text-center">
          <span className="rounded-full border border-brown-700 px-4 py-1.5 text-xs font-medium text-brown-200">
            {dict.about.kicker}
          </span>
          <h1 className="font-display mt-5 text-3xl font-semibold leading-tight text-on-primary sm:text-5xl">
            {dict.about.title}
          </h1>
        </div>
      </section>

      <section className="container-page max-w-3xl py-section">
        <div className="space-y-6 text-lg leading-relaxed text-body">
          <p>{dict.about.p1}</p>
          <p>{dict.about.p2}</p>
          <p>{dict.about.p3}</p>
        </div>
      </section>

      <section className="bg-tint py-16">
        <div className="container-page max-w-5xl">
          <h2 className="font-display text-center text-2xl font-semibold text-heading sm:text-3xl">
            {dict.about.valuesTitle}
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {values.map((v) => (
              <div key={v.t} className="rounded-2xl border border-line-soft bg-white p-6 text-center">
                <h3 className="font-display text-lg font-semibold text-heading">{v.t}</h3>
                <p className="mt-2 text-sm text-muted">{v.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
