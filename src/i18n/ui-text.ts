"use client";

import { useCallback } from "react";
import { useLocale } from "next-intl";
import spanish from "../../messages/ui-es.json";
import patterns from "../../messages/ui-patterns-es.json";

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const rules = Object.entries(patterns).map(([source, target]) => ({
  pattern: new RegExp("^" + source.split(/\{\d+\}/).map(escapeRegex).join("([\\s\\S]*?)") + "$"),
  target,
}));

/** Localizes application UI literals; never apply to customer-authored content. */
export function translateUiText(locale: string, text: string): string {
  if (locale !== "es") return text;
  const exact = (spanish as Record<string, string>)[text];
  if (exact !== undefined) return exact;
  for (const { pattern, target } of rules) {
    const match = pattern.exec(text);
    if (match) return target.replace(/\{(\d+)\}/g, (_, index: string) => match[Number(index) + 1]);
  }
  return text;
}

export function useUiText() {
  const locale = useLocale();
  return useCallback((text: string) => translateUiText(locale, text), [locale]);
}
