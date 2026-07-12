"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useLocale } from "@/i18n/LocaleContext";
import { pick } from "@/i18n/pick";
import { formatSAR } from "@/lib/currency";
import { getAllergens } from "@/lib/menu";
import { useCart } from "@/context/CartContext";
import { ResolvedProduct } from "@/lib/types";

export function ProductModal({
  product,
  onClose,
}: {
  product: ResolvedProduct;
  onClose: () => void;
}) {
  const { locale, dict } = useLocale();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [sizeIndex, setSizeIndex] = useState(0);
  const allergens = getAllergens(product.slug);

  const sizes = product.sizes;
  const selectedSize = sizes && sizes.length > 0 ? sizes[sizeIndex] : null;
  const unitPrice = selectedSize ? selectedSize.price : product.price;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-brown-950/50 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="relative aspect-[4/3] w-full bg-cream-100">
          <Image
            src={product.image}
            alt={pick(locale, product.name, product.nameAr)}
            fill
            sizes="(max-width: 640px) 100vw, 32rem"
            className="object-cover"
          />
          <button
            onClick={onClose}
            aria-label={dict.common.close}
            className="focus-ring absolute end-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-brown-900 shadow"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          {!product.available && (
            <span className="absolute start-3 top-3 rounded-full bg-brown-950/80 px-3 py-1 text-xs font-semibold text-cream-50">
              {pick(locale, "Sold out", "غير متوفر")}
            </span>
          )}
        </div>

        <div className="p-5 sm:p-6">
          <h2 className="font-display text-2xl font-semibold text-brown-950">
            {pick(locale, product.name, product.nameAr)}
          </h2>
          <p className="mt-1 text-lg font-semibold text-brown-700">
            {selectedSize
              ? `${formatSAR(unitPrice).replace(" SAR", "")} ${dict.common.sar}`
              : product.priceNote
              ? `${product.priceNote} ${dict.common.sar}`
              : `${formatSAR(product.price).replace(" SAR", "")} ${dict.common.sar}`}
          </p>
          {locale === "en" && (
            <p className="mt-3 text-sm leading-relaxed text-brown-600">{product.description}</p>
          )}

          {allergens.length > 0 && (
            <p className="mt-3 text-xs text-brown-400">
              {pick(locale, "Contains: ", "يحتوي على: ")}
              {allergens.join(", ")}
            </p>
          )}

          {sizes && sizes.length > 0 && (
            <div className="mt-4">
              <span className="text-sm font-medium text-brown-700">
                {pick(locale, "Size", "الحجم")}
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {sizes.map((s, i) => (
                  <button
                    key={s.label}
                    onClick={() => setSizeIndex(i)}
                    className={`focus-ring rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      i === sizeIndex
                        ? "border-brown-800 bg-brown-800 text-cream-50"
                        : "border-brown-200 text-brown-700 hover:border-brown-400"
                    }`}
                  >
                    {pick(locale, s.label, s.labelAr)} · {formatSAR(s.price).replace(" SAR", "")}{" "}
                    {dict.common.sar}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.available ? (
            <>
              <div className="mt-5 flex items-center gap-4">
                <span className="text-sm font-medium text-brown-700">
                  {pick(locale, "Quantity", "الكمية")}
                </span>
                <div className="flex items-center gap-3 rounded-full border border-brown-200 px-1">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="focus-ring flex h-8 w-8 items-center justify-center rounded-full text-lg text-brown-800 hover:bg-brown-100"
                    aria-label="-"
                  >
                    −
                  </button>
                  <span className="w-5 text-center font-semibold">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="focus-ring flex h-8 w-8 items-center justify-center rounded-full text-lg text-brown-800 hover:bg-brown-100"
                    aria-label="+"
                  >
                    +
                  </button>
                </div>
              </div>

              <label className="mt-4 block text-sm font-medium text-brown-700">
                {pick(locale, "Note (optional)", "ملاحظة (اختياري)")}
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  placeholder={pick(locale, "e.g. less ice, extra hot", "مثال: ثلج أقل، حار جداً")}
                  className="focus-ring mt-1.5 w-full resize-none rounded-xl border border-brown-200 p-3 text-sm placeholder:text-brown-300"
                />
              </label>

              <button
                onClick={() => {
                  const cartProduct = selectedSize
                    ? {
                        ...product,
                        slug: `${product.slug}--${selectedSize.label.toLowerCase()}`,
                        name: `${product.name} (${selectedSize.label})`,
                        nameAr: `${product.nameAr} (${selectedSize.labelAr})`,
                        price: selectedSize.price,
                      }
                    : product;
                  addItem(cartProduct, qty, note || undefined);
                  onClose();
                }}
                className="focus-ring mt-5 w-full rounded-full bg-brown-800 py-3.5 text-sm font-semibold text-cream-50 hover:bg-brown-900"
              >
                {pick(locale, "Add to Cart", "أضف إلى السلة")} ·{" "}
                {formatSAR(unitPrice * qty).replace(" SAR", "")} {dict.common.sar}
              </button>
            </>
          ) : (
            <p className="mt-5 rounded-xl bg-brown-50 p-3.5 text-sm text-brown-600">
              {pick(
                locale,
                "This item is currently unavailable at this branch.",
                "هذا الصنف غير متوفر حالياً في هذا الفرع."
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
