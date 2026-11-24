"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLocale } from "@/i18n/LocaleContext";
import { kashida } from "@/lib/kashida";
import { useCart } from "@/context/CartContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useStaffAuth } from "@/context/StaffAuthContext";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { BranchSwitcher } from "./BranchSwitcher";

export function SiteHeader() {
  const { locale, dict, toggleLocale } = useLocale();
  const pathname = usePathname();
  const { count } = useCart();
  const { customer } = useCustomerAuth();
  const { staff } = useStaffAuth();
  const { admin } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/", label: dict.nav.home },
    { href: "/branches", label: dict.nav.branches },
    { href: "/rooftop", label: dict.nav.rooftop },
    { href: "/about", label: dict.nav.about },
    { href: "/contact", label: dict.nav.contact },
  ];

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname?.startsWith(href));

  // The account icon should follow whichever portal is currently active —
  // an admin browsing /admin/* shouldn't get routed to the customer profile.
  const accountHref =
    pathname?.startsWith("/admin") && admin
      ? "/admin/profile"
      : pathname?.startsWith("/staff") && staff
      ? "/staff/profile"
      : customer
      ? "/profile"
      : "/login";
  const accountLabel =
    pathname?.startsWith("/admin") && admin
      ? dict.admin.profileLink
      : pathname?.startsWith("/staff") && staff
      ? dict.staff.profileLink
      : customer
      ? dict.nav.myOrders
      : dict.nav.login;

  return (
    <header className="sticky top-0 z-50 border-b border-line-soft bg-cream-50/95 backdrop-saturate-150">
      <div className="container-page flex h-16 max-w-7xl items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/images/logo.svg"
            alt={dict.common.brandName}
            width={34}
            height={34}
            priority
            className="size-8.5"
          />
          <span className="font-display text-xl font-semibold tracking-tight text-brown-900">
            {locale === "ar" ? kashida(dict.common.brandName, 1) : dict.common.brandName}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`focus-ring rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                isActive(l.href)
                  ? "bg-primary text-on-primary"
                  : "text-body hover:bg-tint-strong"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <BranchSwitcher compact />
          </div>

          <button
            onClick={toggleLocale}
            className="focus-ring hidden rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-brown-800 hover:border-brown-400 sm:block"
            aria-label="Toggle language"
          >
            {dict.footer.langToggle}
          </button>

          <Link
            href="/cart"
            className="focus-ring relative rounded-full p-2 text-brown-800 hover:bg-tint-strong"
            aria-label={dict.nav.cart}
          >
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
            {count > 0 && (
              <span className="absolute -top-0.5 -end-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-2xs font-bold text-on-primary">
                {count}
              </span>
            )}
          </Link>

          <Link
            href={accountHref}
            className="focus-ring hidden rounded-full p-2 text-brown-800 hover:bg-tint-strong sm:block"
            aria-label={accountLabel}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="3.6" stroke="currentColor" strokeWidth="1.7" />
              <path
                d="M4.5 20c1.4-3.6 4.4-5.5 7.5-5.5s6.1 1.9 7.5 5.5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </Link>

          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="focus-ring rounded-full p-2 text-brown-800 hover:bg-tint-strong lg:hidden"
            aria-label="Menu"
            aria-expanded={mobileOpen}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              {mobileOpen ? (
                <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-line-soft bg-cream-50 px-4 pb-4 pt-2 lg:hidden">
          <div className="mb-3">
            <BranchSwitcher />
          </div>
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-xl px-3.5 py-2.5 text-sm font-medium ${
                  isActive(l.href) ? "bg-primary text-on-primary" : "text-body hover:bg-tint-strong"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href={accountHref}
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-3.5 py-2.5 text-sm font-medium text-body hover:bg-tint-strong"
            >
              {accountLabel}
            </Link>
            <button
              onClick={toggleLocale}
              className="mt-1 rounded-xl border border-line px-3.5 py-2.5 text-start text-sm font-semibold text-brown-800"
            >
              {dict.footer.langToggle}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
