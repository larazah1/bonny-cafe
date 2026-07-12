"use client";

import { SyntheticEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/i18n/LocaleContext";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function AdminLoginPage() {
  const { dict } = useLocale();
  const { login, admin } = useAdminAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (admin) router.replace("/admin/dashboard");
  }, [admin, router]);

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!login(username, password)) {
      setError(dict.admin.invalidCredentials);
      return;
    }
    setError(null);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-brown-950">{dict.admin.loginTitle}</h1>
      <p className="mt-2 text-brown-500">{dict.admin.loginSubtitle}</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="block text-sm font-medium text-brown-700">
          {dict.admin.username}
          <input
            required
            dir="ltr"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="focus-ring mt-1.5 w-full rounded-xl border border-brown-200 bg-white px-3.5 py-2.5 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-brown-700">
          {dict.admin.password}
          <input
            required
            dir="ltr"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="focus-ring mt-1.5 w-full rounded-xl border border-brown-200 bg-white px-3.5 py-2.5 text-sm"
          />
        </label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          className="focus-ring w-full rounded-full bg-brown-800 py-3 text-sm font-semibold text-cream-50 hover:bg-brown-900"
        >
          {dict.admin.logIn}
        </button>
      </form>

      <p className="mt-6 rounded-xl bg-brown-50 p-3 text-xs text-brown-400" dir="ltr">
        Demo: admin / admin123
      </p>
    </div>
  );
}
