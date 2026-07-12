"use client";

import { SyntheticEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/i18n/LocaleContext";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useToast } from "@/context/ToastContext";

type Stage = "idle" | "enterNew" | "verify";

export default function AdminProfilePage() {
  const { dict } = useLocale();
  const { admin, password, logout, changePassword } = useAdminAuth();
  const { show } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!admin) router.replace("/admin");
  }, [admin, router]);

  const [showPassword, setShowPassword] = useState(false);
  const [stage, setStage] = useState<Stage>("idle");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [demoCode, setDemoCode] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!admin) return null;

  const resetChangeForm = () => {
    setStage("idle");
    setNewPassword("");
    setConfirmPassword("");
    setDemoCode("");
    setCode("");
    setError(null);
  };

  const handleRequestChange = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirmPassword) {
      setError(dict.admin.passwordMismatch);
      return;
    }
    setDemoCode(String(Math.floor(100000 + Math.random() * 900000)));
    setStage("verify");
  };

  const handleVerify = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (code !== demoCode) {
      setError(dict.admin.invalidCode);
      return;
    }
    changePassword(newPassword);
    show(dict.admin.passwordChanged, "success");
    resetChangeForm();
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold text-brown-950">
          {dict.admin.profileTitle}
        </h1>
        <button
          onClick={logout}
          className="focus-ring rounded-full border border-brown-200 px-4 py-2 text-xs font-semibold text-brown-700 hover:border-brown-400"
        >
          {dict.nav.logout}
        </button>
      </div>

      <div className="mt-8 rounded-2xl border border-brown-100 bg-white p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <span className="block text-xs text-brown-400">{dict.auth.fullNameLabel}</span>
            <span className="text-brown-900">{admin.name}</span>
          </div>
          <div>
            <span className="block text-xs text-brown-400">{dict.admin.username}</span>
            <span className="text-brown-900" dir="ltr">
              {admin.username}
            </span>
          </div>
          <div>
            <span className="block text-xs text-brown-400">{dict.admin.password}</span>
            <div className="flex items-center gap-2">
              <span className="text-brown-900" dir="ltr">
                {showPassword ? password : "••••••••"}
              </span>
              <button
                onClick={() => setShowPassword((v) => !v)}
                className="focus-ring text-xs font-medium text-brown-500 hover:text-brown-800"
              >
                {showPassword ? dict.admin.hidePassword : dict.admin.showPassword}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-brown-100 bg-white p-5">
        {stage === "idle" && (
          <button
            onClick={() => setStage("enterNew")}
            className="focus-ring rounded-full bg-brown-800 px-5 py-2.5 text-sm font-semibold text-cream-50 hover:bg-brown-900"
          >
            {dict.admin.changePasswordAction}
          </button>
        )}

        {stage === "enterNew" && (
          <form onSubmit={handleRequestChange} className="space-y-4">
            <label className="block text-sm font-medium text-brown-700">
              {dict.admin.newPasswordLabel}
              <input
                required
                type="password"
                dir="ltr"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="focus-ring mt-1.5 w-full rounded-xl border border-brown-200 px-3.5 py-2.5 text-sm"
              />
            </label>
            <label className="block text-sm font-medium text-brown-700">
              {dict.admin.confirmPasswordLabel}
              <input
                required
                type="password"
                dir="ltr"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="focus-ring mt-1.5 w-full rounded-xl border border-brown-200 px-3.5 py-2.5 text-sm"
              />
            </label>
            {error && <p className="text-sm text-red-700">{error}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                className="focus-ring rounded-full bg-brown-800 px-5 py-2.5 text-sm font-semibold text-cream-50 hover:bg-brown-900"
              >
                {dict.admin.sendCode}
              </button>
              <button
                type="button"
                onClick={resetChangeForm}
                className="focus-ring rounded-full border border-brown-200 px-5 py-2.5 text-sm font-semibold text-brown-700"
              >
                {dict.common.cancel}
              </button>
            </div>
          </form>
        )}

        {stage === "verify" && (
          <form onSubmit={handleVerify} className="space-y-4">
            <p className="rounded-xl bg-brown-50 p-3 text-sm text-brown-700">
              {dict.admin.demoCodeNote} <span className="font-mono font-bold">{demoCode}</span>
            </p>
            <label className="block text-sm font-medium text-brown-700">
              {dict.admin.codeLabel}
              <input
                required
                dir="ltr"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="focus-ring mt-1.5 w-full rounded-xl border border-brown-200 px-3.5 py-2.5 text-center text-sm tracking-[0.5em]"
              />
            </label>
            {error && <p className="text-sm text-red-700">{error}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                className="focus-ring rounded-full bg-brown-800 px-5 py-2.5 text-sm font-semibold text-cream-50 hover:bg-brown-900"
              >
                {dict.admin.verifyAndChangePassword}
              </button>
              <button
                type="button"
                onClick={resetChangeForm}
                className="focus-ring rounded-full border border-brown-200 px-5 py-2.5 text-sm font-semibold text-brown-700"
              >
                {dict.common.cancel}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
