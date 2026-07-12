import { ReactNode } from "react";

export const inputClass =
  "focus-ring mt-1.5 w-full rounded-xl border border-brown-200 bg-white px-3.5 py-2.5 text-sm text-brown-900 placeholder:text-brown-300";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm font-medium text-brown-700">
      {label}
      {children}
    </label>
  );
}
