"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { readStorage, writeStorage } from "@/lib/storage";
import en, { Dictionary } from "./en";
import ar from "./ar";

export type Locale = "en" | "ar";

interface LocaleContextValue {
  locale: Locale;
  dir: "ltr" | "rtl";
  dict: Dictionary;
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;
}

const LOCALE_KEY = "bonny.locale";

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = readStorage<Locale | null>(LOCALE_KEY, null);
    if (stored === "en" || stored === "ar") setLocaleState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    writeStorage(LOCALE_KEY, l);
  };

  const toggleLocale = () => setLocale(locale === "en" ? "ar" : "en");

  const dict = useMemo(() => (locale === "ar" ? ar : en), [locale]);
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <LocaleContext.Provider value={{ locale, dir, dict, setLocale, toggleLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
