"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useEffect, useState } from "react";
import { useLocale } from "@/i18n/LocaleContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useToast } from "@/context/ToastContext";
import { digitsOnly } from "@/lib/validate";
import { PhoneInput } from "@/components/PhoneInput";

type Tab = "phone" | "email";

export default function LoginPage() {
  const { dict } = useLocale();
  const { requestLoginOtp, verifyOtp, loginWithEmail, customer } = useCustomerAuth();
  const { show } = useToast();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("phone");
  const [mobile, setMobile] = useState("");
  const [code, setCode] = useState("");
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [stage, setStage] = useState<"enter" | "verify">("enter");
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [next, setNext] = useState("/profile");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNext(params.get("next") || "/profile");
  }, []);

  useEffect(() => {
    if (customer) router.replace(next);
  }, [customer, next, router]);

  const handleSendCode = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (mobile.length < 13) {
      setError(dict.auth.invalidPhone);
      return;
    }
    const c = await requestLoginOtp(mobile);
    if (!c) {
      setError(dict.auth.noAccountFound);
      return;
    }
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
    show(dict.auth.loginSuccess, "success");
  };

  const handleEmailLogin = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const ok = await loginWithEmail(email, password);
    if (!ok) {
      setError(dict.auth.invalidCredentials);
      return;
    }
    show(dict.auth.loginSuccess, "success");
  };

  return (
    <div className="container-page max-w-md py-section">
      <h1 className="font-display text-3xl font-semibold text-heading">{dict.auth.loginTitle}</h1>
      <p className="mt-2 text-muted">{dict.auth.loginSubtitle}</p>

      <div className="mt-8 flex gap-2 rounded-full bg-tint-strong p-1">
        <button
          onClick={() => setTab("phone")}
          className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
            tab === "phone" ? "bg-white text-brown-900 shadow-sm" : "text-muted"
          }`}
        >
          {dict.auth.tabPhone}
        </button>
        <button
          onClick={() => setTab("email")}
          className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
            tab === "email" ? "bg-white text-brown-900 shadow-sm" : "text-muted"
          }`}
        >
          {dict.auth.tabEmail}
        </button>
      </div>

      {tab === "phone" ? (
        stage === "enter" ? (
          <form onSubmit={handleSendCode} className="mt-6 space-y-4">
            <Field label={dict.auth.phoneLabel}>
              <PhoneInput value={mobile} onChange={setMobile} />
            </Field>
            {error && <p className="text-sm text-red-700">{error}</p>}
            <button type="submit" className={submitClass}>
              {dict.auth.sendCode}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="mt-6 space-y-4">
            <p className="text-sm text-muted">
              {dict.auth.codeSentTo} <span dir="ltr">{mobile}</span>
            </p>
            {demoCode && (
              <p className="rounded-xl bg-tint p-3 text-sm text-body">
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
        )
      ) : (
        <form onSubmit={handleEmailLogin} className="mt-6 space-y-4">
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
          <Field label={dict.auth.passwordLabel}>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </Field>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button type="submit" className={submitClass}>
            {dict.auth.loginTitle}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted">
        {dict.auth.noAccount}{" "}
        <Link href="/register" className="font-semibold text-brown-800 hover:underline">
          {dict.auth.createAccount}
        </Link>
      </p>
    </div>
  );
}

const inputClass =
  "focus-ring mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-brown-900";
const submitClass =
  "focus-ring w-full rounded-full bg-primary py-3 text-sm font-semibold text-on-primary hover:bg-primary-strong";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-body">
      {label}
      {children}
    </label>
  );
}
