"use client";

import { useState, useRef, useEffect } from "react";
import { BRANCHES } from "@/lib/branches";
import { useBranch } from "@/context/BranchContext";
import { useLocale } from "@/i18n/LocaleContext";
import { pick } from "@/i18n/pick";
import { haversineDistanceKm } from "@/lib/geo";

export function BranchSwitcher({ compact = false }: { compact?: boolean }) {
  const { branch, branchId, setBranchId, coords, nearestBranchId } = useBranch();
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="focus-ring flex items-center gap-1.5 rounded-full border border-brown-200 px-3 py-1.5 text-xs font-medium text-brown-800 transition-colors hover:border-brown-400"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="shrink-0">
          <path
            d="M12 22s7-7.05 7-12.5A7 7 0 0 0 5 9.5C5 14.95 12 22 12 22Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        {!compact && <span className="hidden sm:inline">{pick(locale, "Branch:", "الفرع:")}</span>}
        <span className="font-semibold">{pick(locale, branch.name, branch.nameAr)}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
          <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute end-0 z-40 mt-2 w-72 rounded-2xl border border-brown-100 bg-white p-2 shadow-xl"
        >
          {BRANCHES.map((b) => {
            const dist = coords ? haversineDistanceKm(coords.lat, coords.lng, b.lat, b.lng) : null;
            return (
              <button
                key={b.id}
                role="option"
                aria-selected={b.id === branchId}
                onClick={() => {
                  setBranchId(b.id);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-start text-sm transition-colors ${
                  b.id === branchId
                    ? "bg-brown-800 text-cream-50"
                    : "text-brown-900 hover:bg-brown-50"
                }`}
              >
                <span>
                  <span className="block font-medium">{pick(locale, b.name, b.nameAr)}</span>
                  {b.id === nearestBranchId && (
                    <span
                      className={`text-xs ${
                        b.id === branchId ? "text-cream-100" : "text-brown-500"
                      }`}
                    >
                      {pick(locale, "Nearest to you", "الأقرب إليك")}
                    </span>
                  )}
                </span>
                {dist !== null && (
                  <span className={b.id === branchId ? "text-cream-100" : "text-brown-400"}>
                    {dist.toFixed(1)} km
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
