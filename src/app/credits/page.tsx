"use client";

import Image from "next/image";
import { useLocale } from "@/i18n/LocaleContext";
import { pick } from "@/i18n/pick";
import { PRODUCTS } from "@/lib/menu";
import photoCredits from "@/lib/photoCredits.json";

type Credit = { file: string; author: string; license: string; licenseUrl: string; source: string };
const CREDITS = photoCredits as Record<string, Credit>;

export default function CreditsPage() {
  const { locale, dict } = useLocale();
  const items = PRODUCTS.filter((p) => CREDITS[p.slug]);

  return (
    <div className="container-page max-w-4xl py-section">
      <h1 className="font-display text-3xl font-semibold text-heading sm:text-4xl">
        {dict.credits.title}
      </h1>
      <p className="mt-3 max-w-2xl text-body">{dict.credits.subtitle}</p>

      <ul className="mt-10 divide-y divide-line-soft">
        {items.map((p) => {
          const c = CREDITS[p.slug];
          return (
            <li key={p.slug} className="flex items-center gap-4 py-4">
              <Image
                src={p.image}
                alt=""
                width={56}
                height={56}
                className="size-14 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0 text-sm">
                <p className="font-semibold text-heading">{pick(locale, p.name, p.nameAr)}</p>
                <p className="truncate text-body">
                  <a href={c.source} target="_blank" rel="noopener noreferrer" className="underline">
                    {c.file}
                  </a>
                  {" · "}
                  {dict.credits.photoBy} {c.author}
                  {" · "}
                  {c.licenseUrl ? (
                    <a href={c.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline">
                      {c.license}
                    </a>
                  ) : (
                    c.license
                  )}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
