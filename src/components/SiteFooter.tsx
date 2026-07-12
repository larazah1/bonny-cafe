"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/i18n/LocaleContext";
import { pick } from "@/i18n/pick";
import { BRANCHES } from "@/lib/branches";
import { useAdminData } from "@/context/AdminDataContext";
import { SocialIcons } from "./SocialIcons";

export function SiteFooter() {
  const { locale, dict } = useLocale();
  const { getBranchDisplay } = useAdminData();

  return (
    <footer className="mt-16 border-t border-brown-100 bg-brown-950 text-cream-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <Image
                src="/images/logo.png"
                alt="Bonny"
                width={30}
                height={30}
                className="h-[30px] w-[30px] invert"
              />
              <span className="font-display text-lg font-semibold text-cream-50">
                {dict.common.brandName}
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-brown-200">{dict.footer.tagline}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-cream-50">{dict.footer.quickLinks}</h3>
            <ul className="mt-3 space-y-2 text-sm text-brown-200">
              <li><Link href="/branches" className="hover:text-cream-50">{dict.nav.branches}</Link></li>
              <li><Link href="/rooftop" className="hover:text-cream-50">{dict.nav.rooftop}</Link></li>
              <li><Link href="/about" className="hover:text-cream-50">{dict.nav.about}</Link></li>
              <li><Link href="/contact" className="hover:text-cream-50">{dict.nav.contact}</Link></li>
              <li><Link href="/staff" className="hover:text-cream-50">{dict.nav.staffPortal}</Link></li>
              <li><Link href="/admin" className="hover:text-cream-50">{dict.nav.adminPortal}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-cream-50">{dict.footer.branchesTitle}</h3>
            <ul className="mt-3 space-y-2 text-sm text-brown-200">
              {BRANCHES.map((base) => {
                const b = getBranchDisplay(base.id);
                return (
                  <li key={b.id}>
                    <a
                      href={b.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-cream-50"
                    >
                      {pick(locale, b.name, b.nameAr)}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-cream-50">{dict.footer.followUs}</h3>
            <div className="mt-3 text-brown-200">
              <SocialIcons />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-brown-800 pt-6 text-xs text-brown-300 sm:flex-row">
          <p>© {new Date().getFullYear()} {dict.common.brandName}. {dict.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
