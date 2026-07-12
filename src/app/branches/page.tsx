"use client";

import Link from "next/link";
import { useLocale } from "@/i18n/LocaleContext";
import { pick } from "@/i18n/pick";
import { useBranch } from "@/context/BranchContext";
import { useAdminData } from "@/context/AdminDataContext";
import { BRANCHES } from "@/lib/branches";
import { haversineDistanceKm } from "@/lib/geo";

export default function BranchesPage() {
  const { locale, dict } = useLocale();
  const { branchId, setBranchId, coords, nearestBranchId } = useBranch();
  const { getBranchDisplay } = useAdminData();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-brown-950 sm:text-4xl">
        {dict.branches.title}
      </h1>
      <p className="mt-2 max-w-2xl text-brown-500">{dict.branches.subtitle}</p>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {BRANCHES.map((base) => {
          const b = getBranchDisplay(base.id);
          const isSelected = b.id === branchId;
          const isNearest = b.id === nearestBranchId;
          const dist = coords ? haversineDistanceKm(coords.lat, coords.lng, b.lat, b.lng) : null;
          return (
            <div
              key={b.id}
              className={`flex flex-col overflow-hidden rounded-2xl border bg-white ${
                isSelected ? "border-brown-800 ring-1 ring-brown-800" : "border-brown-100"
              }`}
            >
              <div className="aspect-[16/10] w-full">
                <iframe
                  title={b.name}
                  src={`https://maps.google.com/maps?q=${b.lat},${b.lng}&z=14&output=embed`}
                  className="h-full w-full grayscale"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-display text-xl font-semibold text-brown-950">
                    {pick(locale, b.name, b.nameAr)}
                  </h2>
                  {isNearest && (
                    <span className="shrink-0 rounded-full bg-brown-100 px-2.5 py-1 text-[11px] font-semibold text-brown-700">
                      {dict.branches.nearest}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-brown-500">{b.address}</p>
                {dist !== null && (
                  <p className="mt-1 text-xs text-brown-400">
                    {dist.toFixed(1)} km {dict.branches.distanceAway}
                  </p>
                )}

                <dl className="mt-4 space-y-1.5 text-sm">
                  {b.hours.map((h) => (
                    <div key={h.day} className="flex justify-between gap-3 text-brown-600">
                      <dt>{h.day}</dt>
                      <dd className="font-medium text-brown-800">{h.hours}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 text-sm text-brown-600" dir="ltr">
                  {b.phone}
                </p>

                <div className="mt-5 flex flex-col gap-2">
                  {isSelected ? (
                    <span className="focus-ring rounded-full bg-brown-100 px-5 py-2.5 text-center text-sm font-semibold text-brown-700">
                      ✓ {dict.branches.selected}
                    </span>
                  ) : (
                    <button
                      onClick={() => setBranchId(b.id)}
                      className="focus-ring rounded-full bg-brown-800 px-5 py-2.5 text-sm font-semibold text-cream-50 hover:bg-brown-900"
                    >
                      {dict.branches.selectBranch}
                    </button>
                  )}
                  <a
                    href={b.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring rounded-full border border-brown-200 px-5 py-2.5 text-center text-sm font-medium text-brown-700 hover:border-brown-400"
                  >
                    {dict.branches.getDirections}
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <Link href="/" className="focus-ring text-sm font-semibold text-brown-700 hover:underline">
          {dict.menu.title} →
        </Link>
      </div>
    </div>
  );
}
