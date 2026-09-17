"use client";

import { useLocale } from "next-intl";
import { enUS, es, ko } from "date-fns/locale";

export function useDateLocale() {
  const locale = useLocale();
  return { localeTag: locale, dateLocale: locale === "es" ? es : locale === "ko" ? ko : enUS };
}
