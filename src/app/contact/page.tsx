"use client";

import Link from "next/link";
import { SyntheticEvent, useState } from "react";
import { useLocale } from "@/i18n/LocaleContext";
import { pick } from "@/i18n/pick";
import { useToast } from "@/context/ToastContext";
import { useAdminData } from "@/context/AdminDataContext";
import { BRANCHES } from "@/lib/branches";
import { SocialIcons } from "@/components/SocialIcons";
import { Field, inputClass } from "@/components/FormField";

export default function ContactPage() {
  const { locale, dict } = useLocale();
  const { show } = useToast();
  const { getBranchDisplay } = useAdminData();

  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setContactSubmitted(true);
    show(dict.contact.formSuccess, "success");
    e.currentTarget.reset();
  };

  return (
    <div className="container-page max-w-6xl py-page">
      <h1 className="font-display text-3xl font-semibold text-heading sm:text-4xl">
        {dict.contact.title}
      </h1>
      <p className="mt-2 max-w-2xl text-muted">{dict.contact.subtitle}</p>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Branch locations */}
        <div>
          <h2 className="font-display text-xl font-semibold text-heading">
            {dict.contact.branchesTitle}
          </h2>
          <div className="mt-4 space-y-4">
            {BRANCHES.map((base) => {
              const b = getBranchDisplay(base.id);
              return (
                <div key={b.id} className="rounded-2xl border border-line-soft bg-white p-5">
                  <h3 className="font-semibold text-heading">{pick(locale, b.name, b.nameAr)}</h3>
                  <p className="mt-1 text-sm text-muted">{b.address}</p>
                  <p className="mt-1 text-sm text-brown-600" dir="ltr">
                    {b.phone}
                  </p>
                  <div className="mt-2 space-y-0.5 text-xs text-subtle">
                    {b.hours.map((h) => (
                      <div key={h.day}>
                        {h.day}: {h.hours}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6">
            <h2 className="font-display text-xl font-semibold text-heading">
              {dict.contact.socialTitle}
            </h2>
            <div className="mt-3 text-muted">
              <SocialIcons />
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div className="rounded-2xl border border-line-soft bg-white p-6">
          <h2 className="font-display text-xl font-semibold text-heading">
            {dict.contact.formTitle}
          </h2>
          {contactSubmitted ? (
            <p className="mt-4 rounded-xl bg-tint p-4 text-sm text-body">
              {dict.contact.formSuccess}
            </p>
          ) : (
            <form onSubmit={handleContactSubmit} className="mt-4 space-y-4">
              <Field label={dict.contact.formName}>
                <input required name="name" className={inputClass} />
              </Field>
              <Field label={dict.contact.formEmail}>
                <input required type="email" name="email" dir="ltr" className={inputClass} />
              </Field>
              <Field label={dict.contact.formMessage}>
                <textarea required name="message" rows={4} className={`${inputClass} resize-none`} />
              </Field>
              <button
                type="submit"
                className="focus-ring w-full rounded-full bg-primary py-3 text-sm font-semibold text-on-primary hover:bg-primary-strong"
              >
                {dict.contact.formSubmit}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Rooftop teaser */}
      <Link
        href="/rooftop"
        className="focus-ring mt-16 flex flex-col items-start justify-between gap-4 overflow-hidden rounded-3xl border border-line-soft bg-primary-deep p-8 transition-opacity hover:opacity-95 sm:flex-row sm:items-center sm:p-10"
      >
        <div>
          <span className="rounded-full border border-brown-700 px-3.5 py-1 text-xs font-medium text-brown-200">
            {dict.nav.rooftop}
          </span>
          <h2 className="font-display mt-4 text-2xl font-semibold text-on-primary sm:text-3xl">
            {dict.rooftop.title}
          </h2>
          <p className="mt-2 max-w-xl text-brown-200">{dict.rooftop.subtitle}</p>
        </div>
        <span className="shrink-0 rounded-full bg-cream-50 px-6 py-3 text-sm font-semibold text-heading">
          {dict.rooftop.formSubmit} →
        </span>
      </Link>
    </div>
  );
}
