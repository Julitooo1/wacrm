export const LOCALE_COOKIE = "insitelvia-locale";
export const SUPPORTED_LOCALES = ["en", "es", "ko"] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

function isLocale(value: string | undefined): value is AppLocale {
  return SUPPORTED_LOCALES.some((locale) => locale === value);
}

export function resolveLocale(saved?: string, configured?: string): AppLocale {
  if (isLocale(saved)) return saved;
  if (isLocale(configured)) return configured;
  return "en";
}
