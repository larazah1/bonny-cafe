"use client";

import { digitsOnly } from "@/lib/validate";

const COUNTRY_CODE = "+966";

export function PhoneInput({
  value,
  onChange,
  className = "",
}: {
  value: string;
  onChange: (fullValue: string) => void;
  className?: string;
}) {
  const local = value.startsWith(COUNTRY_CODE)
    ? value.slice(COUNTRY_CODE.length)
    : digitsOnly(value).replace(/^0+/, "");

  return (
    <div
      dir="ltr"
      className={`focus-within:ring-brown-700 mt-1.5 flex items-stretch overflow-hidden rounded-xl border border-brown-200 bg-white focus-within:ring-1 ${className}`}
    >
      <span className="flex items-center bg-brown-50 px-3 text-sm font-medium text-brown-600">
        {COUNTRY_CODE}
      </span>
      <input
        required
        dir="ltr"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={10}
        value={local}
        onChange={(e) => onChange(COUNTRY_CODE + digitsOnly(e.target.value).slice(0, 10))}
        placeholder="5xxxxxxxx"
        className="w-full flex-1 px-3 py-2.5 text-sm text-brown-900 outline-none placeholder:text-brown-300"
      />
    </div>
  );
}
