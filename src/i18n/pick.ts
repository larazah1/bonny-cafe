import { Locale } from "./LocaleContext";

export function pick(locale: Locale, enText: string, arText: string): string {
  return locale === "ar" ? arText : enText;
}
