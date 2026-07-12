"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useEffect, useState } from "react";
import { useLocale } from "@/i18n/LocaleContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useToast } from "@/context/ToastContext";
import { digitsOnly, isValidEmail } from "@/lib/validate";
import { PhoneInput } from "@/components/PhoneInput";

export default function RegisterPage() {
  const { dict } = useLocale();
  const { requestRegisterOtp, verifyOtp, customer } = useCustomerAuth();
  const { show } = useToast();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stage, setStage] = useState<"enter" | "verify">("enter");
  const [code, setCode] = useState("");
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [next, setNext] = useState("/profile");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNext(params.get("next") || "/profile");
  }, []);

  useEffect(() => {
    if (customer) router.replace(next);
  }, [customer, next, router]);

  const handleRegister = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (mobile.length < 13) {
      setError(dict.auth.invalidPhone);
      return;
    }
    if (!isValidEmail(email)) {
      setError(dict.auth.invalidEmail);
      return;
    }
    const c = await requestRegisterOtp(fullName.trim(), mobile.trim(), email.trim(), password || undefined);
    setDemoCode(c);
    setStage("verify");
  };

  const handleVerify = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const ok = await verifyOtp(code);
    if (!ok) {
      setError(dict.auth.invalidCode);
      return;
    }
    show(dict.auth.registerSuccess, "success");
  };

  return (
    <div className="mx-auto max-w-md px-4 py-14 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-brown-950">{dict.auth.registerTitle}</h1>
      <p className="mt-2 text-brown-500">{dict.auth.registerSubtitle}</p>

      {stage === "enter" ? (
        <form onSubmit={handleRegister} className="mt-8 space-y-4">
          <Field label={dict.auth.fullNameLabel}>
            <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
          </Field>
          <Field label={dict.auth.phoneLabel}>
            <PhoneInput value={mobile} onChange={setMobile} />
          </Field>
          <Field label={dict.auth.emailLabel}>
            <input
              required
              type="email"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label={`${dict.auth.passwordOptionalLabel} (${dict.common.optional})`}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
            <span className="mt-1 block text-xs text-brown-400">{dict.auth.passwordOptionalHint}</span>
          </Field>
          <button type="submit" className={submitClass}>
            {dict.auth.registerSubmit}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="mt-8 space-y-4">
          <p className="text-sm text-brown-500">
            {dict.auth.codeSentTo} <span dir="ltr">{mobile}</span>
          </p>
          {demoCode && (
            <p className="rounded-xl bg-brown-50 p-3 text-sm text-brown-700">
              {dict.auth.demoCodeNote} <span className="font-mono font-bold">{demoCode}</span>
            </p>
          )}
          <Field label={dict.auth.codeLabel}>
            <input
              required
              dir="ltr"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(digitsOnly(e.target.value))}
              className={`${inputClass} text-center tracking-[0.5em]`}
            />
          </Field>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button type="submit" className={submitClass}>
            {dict.auth.verifyAndLogin}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-brown-500">
        {dict.auth.alreadyHaveAccount}{" "}
        <Link href="/login" className="font-semibold text-brown-800 hover:underline">
          {dict.auth.logInInstead}
        </Link>
      </p>
    </div>
  );
}

const inputClass =
  "focus-ring mt-1.5 w-full rounded-xl border border-brown-200 bg-white px-3.5 py-2.5 text-sm text-brown-900";
const submitClass =
  "focus-ring w-full rounded-full bg-brown-800 py-3 text-sm font-semibold text-cream-50 hover:bg-brown-900";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-brown-700">
      {label}
      {children}
    </label>
  );
}
