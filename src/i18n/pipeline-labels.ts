"use client";

import { useLocale } from "next-intl";

const labels: Record<string, string> = {
  "Sales Pipeline": "Embudo de ventas",
  "New Lead": "Nuevo prospecto",
  "Qualified": "Calificado",
  "Proposal Sent": "Propuesta enviada",
  "Negotiation": "Negociación",
  "Won": "Ganada",
  "Lost": "Perdida",
};

/** Translate only recognized default labels, without changing stored names or IDs. */
export function translatePipelineLabel(name: string, locale: string): string {
  if (locale === "es") return labels[name] ?? name;
  if (locale === "en") {
    return Object.entries(labels).find(([, spanish]) => spanish === name)?.[0] ?? name;
  }
  return name;
}

export function usePipelineLabel() {
  const locale = useLocale();
  return (name: string) => translatePipelineLabel(name, locale);
}
