"use client";

import { SyntheticEvent, useState } from "react";
import { useLocale } from "@/i18n/LocaleContext";
import { useToast } from "@/context/ToastContext";
import { useRental } from "@/context/RentalContext";
import { Field, inputClass } from "@/components/FormField";
import { PhoneInput } from "@/components/PhoneInput";

export default function RooftopPage() {
  const { dict } = useLocale();
  const { show } = useToast();
  const { submitRequest } = useRental();
  const [submitted, setSubmitted] = useState(false);
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (phone.length < 13) {
      show(dict.auth.invalidPhone, "error");
      return;
    }
    const form = new FormData(e.currentTarget);
    submitRequest({
      name: String(form.get("name") || ""),
      phone,
      date: String(form.get("date") || ""),
      timeSlot: String(form.get("slot") || ""),
      guests: Number(form.get("guests") || 0),
      eventType: String(form.get("eventType") || ""),
      notes: String(form.get("notes") || "") || undefined,
    });
    setSubmitted(true);
    show(dict.rooftop.formSuccess, "success");
    e.currentTarget.reset();
    setPhone("");
  };

  return (
    <div>
      <section className="bg-brown-950 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <span className="rounded-full border border-brown-700 px-4 py-1.5 text-xs font-medium text-brown-200">
            {dict.nav.rooftop}
          </span>
          <h1 className="font-display mt-5 text-3xl font-semibold leading-tight text-cream-50 sm:text-5xl">
            {dict.rooftop.title}
          </h1>
          <p className="mt-4 text-lg text-brown-200">{dict.rooftop.subtitle}</p>
          <ul className="mx-auto mt-6 flex max-w-xl flex-col items-start gap-2 text-sm text-brown-200 sm:items-center">
            {[dict.rooftop.feature1, dict.rooftop.feature2, dict.rooftop.feature3].map((f) => (
              <li key={f} className="flex items-start gap-2 sm:items-center">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brown-400 sm:mt-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-brown-100 bg-white p-6 sm:p-8">
          {submitted ? (
            <p className="rounded-xl bg-brown-50 p-4 text-sm text-brown-700">
              {dict.rooftop.formSuccess}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label={dict.rooftop.formName}>
                  <input required name="name" className={inputClass} />
                </Field>
                <Field label={dict.rooftop.formPhone}>
                  <PhoneInput value={phone} onChange={setPhone} />
                </Field>
                <Field label={dict.rooftop.formDate}>
                  <input required type="date" name="date" className={inputClass} />
                </Field>
                <Field label={dict.rooftop.formSlot}>
                  <select required name="slot" className={inputClass} defaultValue="">
                    <option value="" disabled>
                      —
                    </option>
                    <option value={dict.rooftop.slotMorning}>{dict.rooftop.slotMorning}</option>
                    <option value={dict.rooftop.slotAfternoon}>{dict.rooftop.slotAfternoon}</option>
                    <option value={dict.rooftop.slotEvening}>{dict.rooftop.slotEvening}</option>
                    <option value={dict.rooftop.slotNight}>{dict.rooftop.slotNight}</option>
                  </select>
                </Field>
                <Field label={dict.rooftop.formGuests}>
                  <input required type="number" min={1} max={40} name="guests" className={inputClass} />
                </Field>
                <Field label={dict.rooftop.formEventType}>
                  <select required name="eventType" className={inputClass} defaultValue="">
                    <option value="" disabled>
                      —
                    </option>
                    <option value={dict.rooftop.eventBirthday}>{dict.rooftop.eventBirthday}</option>
                    <option value={dict.rooftop.eventEngagement}>{dict.rooftop.eventEngagement}</option>
                    <option value={dict.rooftop.eventCorporate}>{dict.rooftop.eventCorporate}</option>
                    <option value={dict.rooftop.eventFamily}>{dict.rooftop.eventFamily}</option>
                    <option value={dict.rooftop.eventOther}>{dict.rooftop.eventOther}</option>
                  </select>
                </Field>
              </div>
              <Field label={dict.rooftop.formNotes}>
                <textarea name="notes" rows={3} className={`${inputClass} resize-none`} />
              </Field>
              <button
                type="submit"
                className="focus-ring w-full rounded-full bg-brown-800 py-3 text-sm font-semibold text-cream-50 hover:bg-brown-900"
              >
                {dict.rooftop.formSubmit}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
