"use client";

import { useState } from "react";
import { useLocale } from "@/i18n/LocaleContext";
import { pick } from "@/i18n/pick";
import { kashida } from "@/lib/kashida";
import { useBranch } from "@/context/BranchContext";
import { useAdminData } from "@/context/AdminDataContext";
import { BRANCHES } from "@/lib/branches";
import { MenuBrowser } from "@/components/MenuBrowser";
import { BranchSwitcher } from "@/components/BranchSwitcher";

export default function HomePage() {
  const { locale, dict } = useLocale();
  const { geoStatus, requestLocation, coords, nearestBranchId, branchId, setBranchId } = useBranch();
  const { announcement } = useAdminData();
  const [dismissedLocate, setDismissedLocate] = useState(false);
  const [dismissedConfirm, setDismissedConfirm] = useState(false);

  const showLocatePrompt = !dismissedLocate && geoStatus === "idle";
  const showLocateFailed =
    !dismissedLocate && (geoStatus === "denied" || geoStatus === "unsupported");
  const showLocateConfirm =
    !dismissedConfirm &&
    geoStatus === "granted" &&
    coords &&
    nearestBranchId &&
    nearestBranchId !== branchId;

  return (
    <div>
      {announcement[locale] && (
        <div className="bg-brown-800 px-4 py-2.5 text-center text-sm font-medium text-cream-50">
          {announcement[locale]}
        </div>
      )}

      {/* Compact hero */}
      <section className="bg-brown-950">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-3 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <span className="rounded-full border border-brown-700 px-3.5 py-1 text-xs font-medium tracking-wide text-brown-200">
            {dict.home.heroKicker}
          </span>
          <h1 className="font-display max-w-2xl text-3xl font-semibold leading-[1.15] text-cream-50 sm:text-5xl">
            {locale === "ar" ? kashida(dict.home.heroTitle, 1) : dict.home.heroTitle}
          </h1>
        </div>
      </section>

      {/* Location status — prompt / locating / found, one clear state at a time */}
      {showLocatePrompt && (
        <section className="border-b border-brown-100 bg-brown-50">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-3 sm:flex-row sm:px-6 lg:px-8">
            <p className="text-sm text-brown-700">{dict.home.locatePrompt}</p>
            <div className="flex gap-2">
              <button
                onClick={requestLocation}
                className="focus-ring rounded-full bg-brown-800 px-5 py-2 text-xs font-semibold text-cream-50 hover:bg-brown-900"
              >
                {dict.home.locateAction}
              </button>
              <button
                onClick={() => setDismissedLocate(true)}
                className="focus-ring rounded-full px-4 py-2 text-xs font-medium text-brown-500 hover:bg-brown-100"
              >
                {dict.home.locateSkip}
              </button>
            </div>
          </div>
        </section>
      )}
      {geoStatus === "requesting" && (
        <section className="border-b border-brown-100 bg-brown-50">
          <div className="mx-auto flex max-w-7xl items-center gap-2.5 px-4 py-3 text-sm font-medium text-brown-700 sm:px-6 lg:px-8">
            <span className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-brown-300 border-t-brown-800" />
            {dict.home.locating}
          </div>
        </section>
      )}
      {showLocateFailed && (
        <section className="border-b border-brown-100 bg-brown-50">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-3 sm:flex-row sm:px-6 lg:px-8">
            <p className="text-sm text-brown-700">
              {geoStatus === "denied" ? dict.home.locateDenied : dict.home.locateUnsupported}
            </p>
            <div className="flex gap-2">
              {geoStatus === "denied" && (
                <button
                  onClick={requestLocation}
                  className="focus-ring rounded-full bg-brown-800 px-5 py-2 text-xs font-semibold text-cream-50 hover:bg-brown-900"
                >
                  {dict.home.locateRetry}
                </button>
              )}
              <button
                onClick={() => setDismissedLocate(true)}
                className="focus-ring rounded-full px-4 py-2 text-xs font-medium text-brown-500 hover:bg-brown-100"
              >
                {dict.home.locateSkip}
              </button>
            </div>
          </div>
        </section>
      )}
      {showLocateConfirm && (
        <section className="animate-fade-up border-b border-brown-100 bg-brown-800">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-3 text-sm text-cream-50 sm:flex-row sm:px-6 lg:px-8">
            <p>
              {dict.home.locateConfirmBody.split("{branch}")[0]}
              <span className="font-semibold">
                {pick(
                  locale,
                  BRANCHES.find((b) => b.id === nearestBranchId)!.name,
                  BRANCHES.find((b) => b.id === nearestBranchId)!.nameAr
                )}
              </span>
              {dict.home.locateConfirmBody.split("{branch}")[1]}
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => {
                  setBranchId(nearestBranchId!);
                  setDismissedConfirm(true);
                }}
                className="focus-ring rounded-full bg-cream-50 px-5 py-2 text-xs font-semibold text-brown-900 hover:bg-cream-100"
              >
                {dict.home.locateConfirmAction}
              </button>
              <button
                onClick={() => setDismissedConfirm(true)}
                className="focus-ring rounded-full px-4 py-2 text-xs font-medium text-cream-100 hover:bg-brown-700"
              >
                {dict.home.locateSkip}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Order now — the full, filterable menu right on the homepage */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-2xl font-semibold text-brown-950 sm:text-3xl">
            {dict.home.orderTitle}
          </h2>
          <BranchSwitcher />
        </div>
        <div className="mt-6">
          <MenuBrowser />
        </div>
      </section>

      {/* Ordering steps — compact, purchase-relevant guidance */}
      <section className="border-t border-brown-100 bg-brown-50 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { n: "1", t: dict.home.step1Title, b: dict.home.step1Body },
              { n: "2", t: dict.home.step2Title, b: dict.home.step2Body },
              { n: "3", t: dict.home.step3Title, b: dict.home.step3Body },
            ].map((s) => (
              <div key={s.n} className="flex items-start gap-3">
                <span className="font-display flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brown-800 text-sm font-semibold text-cream-50">
                  {s.n}
                </span>
                <div>
                  <h3 className="font-semibold text-brown-950">{s.t}</h3>
                  <p className="mt-0.5 text-sm text-brown-500">{s.b}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
