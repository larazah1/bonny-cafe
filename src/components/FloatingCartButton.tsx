"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/i18n/LocaleContext";
import { formatSAR } from "@/lib/currency";

const HIDDEN_PREFIXES = ["/cart", "/staff", "/admin"];

export function FloatingCartButton() {
  const pathname = usePathname();
  const { count, total } = useCart();
  const { dict } = useLocale();

  const hidden = HIDDEN_PREFIXES.some((p) => pathname?.startsWith(p));
  if (hidden || count === 0) return null;

  return (
    <Link
      href="/cart"
      aria-label={dict.nav.cart}
      className="focus-ring fixed bottom-5 end-5 z-40 flex items-center gap-2.5 rounded-full bg-primary py-3 ps-4 pe-5 text-on-primary shadow-xl transition-transform hover:scale-105 hover:bg-primary-strong"
    >
      <span className="relative flex h-6 w-6 items-center justify-center">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="10" cy="21" r="1.4" fill="currentColor" />
          <circle cx="18" cy="21" r="1.4" fill="currentColor" />
        </svg>
        <span className="absolute -top-2 -end-2 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-cream-50 px-1 text-2xs font-bold text-brown-900">
          {count}
        </span>
      </span>
      <span className="text-sm font-semibold">{formatSAR(total)}</span>
    </Link>
  );
}
