"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Check, Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LOCALE_COOKIE } from "@/i18n/locale";

function saveLanguage(locale: "es" | "en") {
  document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax${window.location.protocol === "https:" ? "; Secure" : ""}`;
}

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function changeLanguage(nextLocale: "es" | "en") {
    if (pending || nextLocale === locale) return;
    saveLanguage(nextLocale);
    startTransition(() => router.refresh());
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={pending}
        aria-label={locale === "es" ? "Cambiar idioma" : "Change language"}
        aria-busy={pending}
        className="flex h-10 items-center gap-2 rounded-md px-2 text-sm text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-50"
      >
        <Languages className="size-4" aria-hidden="true" />
        <span>{locale === "es" ? "ES" : locale === "ko" ? "KO" : "EN"}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6}>
        {([{ code: "es", label: "Español" }, { code: "en", label: "English" }] as const).map(({ code, label }) => (
          <DropdownMenuItem key={code} disabled={pending} onClick={() => changeLanguage(code)}>
            <span lang={code}>{label}</span>
            {locale === code && <Check className="ml-auto size-4" aria-label={locale === "es" ? "Seleccionado" : "Selected"} />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
