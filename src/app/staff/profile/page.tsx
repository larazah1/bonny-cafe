"use client";

import { SyntheticEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/i18n/LocaleContext";
import { pick } from "@/i18n/pick";
import { useStaffAuth } from "@/context/StaffAuthContext";
import { useToast } from "@/context/ToastContext";
import { getBranch } from "@/lib/branches";

type Stage = "idle" | "enterNew" | "verify";

export default function StaffProfilePage() {
  const { locale, dict } = useLocale();
  const { staff, staffAccounts, logout, changePassword } = useStaffAuth();
  const { show } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!staff) router.replace("/staff");
  }, [staff, router]);

  const [showPassword, setShowPassword] = useState(false);
  const [stage, setStage] = useState<Stage>("idle");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [demoCode, setDemoCode] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!staff) return null;

  const account = staffAccounts.find((s) => s.username === staff.username);
  const branch = getBranch(staff.branchId);

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
      setError(dict.staff.passwordMismatch);
      return;
    }
    setDemoCode(String(Math.floor(100000 + Math.random() * 900000)));
    setStage("verify");
  };

  const handleVerify = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (code !== demoCode) {
      setError(dict.staff.invalidCode);
      return;
    }
    changePassword(staff.username, newPassword);
    show(dict.staff.passwordChanged, "success");
    resetChangeForm();
  };

  return (
    <div className="container-page max-w-2xl py-page">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold text-heading">
          {dict.staff.profileTitle}
        </h1>
        <button
          onClick={logout}
          className="focus-ring rounded-full border border-line px-4 py-2 text-xs font-semibold text-body hover:border-brown-400"
        >
          {dict.nav.logout}
        </button>
      </div>

      <div className="mt-8 rounded-2xl border border-line-soft bg-white p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <span className="block text-xs text-subtle">{dict.auth.fullNameLabel}</span>
            <span className="text-brown-900">{staff.name}</span>
          </div>
          <div>
            <span className="block text-xs text-subtle">{dict.staff.username}</span>
            <span className="text-brown-900" dir="ltr">
              {staff.username}
            </span>
          </div>
          <div>
            <span className="block text-xs text-subtle">{dict.staff.branchLabel}</span>
            <span className="text-brown-900">{pick(locale, branch.name, branch.nameAr)}</span>
          </div>
          <div>
            <span className="block text-xs text-subtle">{dict.staff.password}</span>
            <div className="flex items-center gap-2">
              <span className="text-brown-900" dir="ltr">
                {showPassword ? account?.password : "••••••••"}
              </span>
              <button
                onClick={() => setShowPassword((v) => !v)}
                className="focus-ring text-xs font-medium text-muted hover:text-brown-800"
              >
                {showPassword ? dict.staff.hidePassword : dict.staff.showPassword}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-line-soft bg-white p-5">
        {stage === "idle" && (
          <button
            onClick={() => setStage("enterNew")}
            className="focus-ring rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-strong"
          >
            {dict.staff.changePasswordAction}
          </button>
        )}

        {stage === "enterNew" && (
          <form onSubmit={handleRequestChange} className="space-y-4">
            <label className="block text-sm font-medium text-body">
              {dict.staff.newPasswordLabel}
              <input
                required
                type="password"
                dir="ltr"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="focus-ring mt-1.5 w-full rounded-xl border border-line px-3.5 py-2.5 text-sm"
              />
            </label>
            <label className="block text-sm font-medium text-body">
              {dict.staff.confirmPasswordLabel}
              <input
                required
                type="password"
                dir="ltr"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="focus-ring mt-1.5 w-full rounded-xl border border-line px-3.5 py-2.5 text-sm"
              />
            </label>
            {error && <p className="text-sm text-red-700">{error}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                className="focus-ring rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-strong"
              >
                {dict.staff.sendCode}
              </button>
              <button
                type="button"
                onClick={resetChangeForm}
                className="focus-ring rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-body"
              >
                {dict.common.cancel}
              </button>
            </div>
          </form>
        )}

        {stage === "verify" && (
          <form onSubmit={handleVerify} className="space-y-4">
            <p className="rounded-xl bg-tint p-3 text-sm text-body">
              {dict.staff.demoCodeNote} <span className="font-mono font-bold">{demoCode}</span>
            </p>
            <label className="block text-sm font-medium text-body">
              {dict.staff.codeLabel}
              <input
                required
                dir="ltr"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="focus-ring mt-1.5 w-full rounded-xl border border-line px-3.5 py-2.5 text-center text-sm tracking-[0.5em]"
              />
            </label>
            {error && <p className="text-sm text-red-700">{error}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                className="focus-ring rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-strong"
              >
                {dict.staff.verifyAndChangePassword}
              </button>
              <button
                type="button"
                onClick={resetChangeForm}
                className="focus-ring rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-body"
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
