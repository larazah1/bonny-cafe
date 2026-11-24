"use client";

import { useLocale } from "@/i18n/LocaleContext";
import { CATEGORIES } from "@/lib/menu";
import { ProductCategory } from "@/lib/types";

export function CategoryTabs({
  active,
  onChange,
}: {
  active: ProductCategory;
  onChange: (c: ProductCategory) => void;
}) {
  const { locale } = useLocale();

  return (
    <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
      {CATEGORIES.map((c) => (
        <button
          key={c.id}
          onClick={() => onChange(c.id)}
          className={`focus-ring shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            active === c.id
              ? "border-primary bg-primary text-on-primary"
              : "border-line text-body hover:border-brown-400"
          }`}
        >
          {locale === "ar" ? c.labelAr : c.label}
        </button>
      ))}
    </div>
  );
}
