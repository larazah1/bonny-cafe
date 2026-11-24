"use client";

import Image from "next/image";
import { useLocale } from "@/i18n/LocaleContext";
import { pick } from "@/i18n/pick";
import { formatSAR } from "@/lib/currency";
import { ResolvedProduct } from "@/lib/types";

export function ProductCard({
  product,
  onSelect,
}: {
  product: ResolvedProduct;
  onSelect: (p: ResolvedProduct) => void;
}) {
  const { locale, dict } = useLocale();

  return (
    <button
      onClick={() => onSelect(product)}
      disabled={!product.available}
      className="focus-ring group flex flex-col overflow-hidden rounded-2xl border border-line-soft bg-white text-start transition-shadow hover:shadow-md disabled:opacity-60"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-cream-100">
        <Image
          src={product.image}
          alt={pick(locale, product.name, product.nameAr)}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {!product.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary-deep/45">
            <span className="rounded-full bg-cream-50 px-3 py-1 text-xs font-semibold text-brown-900">
              {pick(locale, "Sold out", "غير متوفر")}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3.5">
        <h3 className="font-display text-base font-semibold leading-snug text-heading">
          {pick(locale, product.name, product.nameAr)}
        </h3>
        {locale === "en" && (
          <p className="line-clamp-2 text-xs text-muted">{product.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-sm font-semibold text-brown-800">
            {product.priceNote
              ? `${product.priceNote} ${dict.common.sar}`
              : `${formatSAR(product.price).replace(" SAR", "")} ${dict.common.sar}`}
          </span>
          <span className="rounded-full bg-tint-strong px-2.5 py-1 text-xs font-medium text-body group-hover:bg-primary group-hover:text-on-primary">
            {pick(locale, "Add", "إضافة")}
          </span>
        </div>
      </div>
    </button>
  );
}
