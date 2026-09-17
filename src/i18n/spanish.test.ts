import { describe, expect, it } from "vitest";
import { parse, type MessageFormatElement } from "@formatjs/icu-messageformat-parser";
import en from "../../messages/en.json";
import es from "../../messages/es.json";
import { translateUiText } from "./ui-text";

function flatten(value: Record<string, unknown>, prefix = ""): Record<string, string> {
  return Object.fromEntries(Object.entries(value).flatMap(([key, child]) => {
    const name = prefix ? `${prefix}.${key}` : key;
    return typeof child === "string" ? [[name, child]] : Object.entries(flatten(child as Record<string, unknown>, name));
  }));
}
function argumentsIn(elements: MessageFormatElement[]): string[] {
  const names = new Set<string>();
  function walk(items: MessageFormatElement[]) {
    for (const item of items) {
      if (item.type !== 0 && item.type !== 7) names.add(item.value);
      if ("options" in item) Object.values(item.options).forEach(option => walk(option.value));
      if ("children" in item) walk(item.children);
    }
  }
  walk(elements);
  return [...names].sort();
}

describe("Spanish catalogue", () => {
  const source = flatten(en), translated = flatten(es);
  it("covers every message including all CRM sections", () => {
    expect(Object.keys(translated).sort()).toEqual(Object.keys(source).sort());
    for (const section of Object.keys(en)) expect(es).toHaveProperty(section);
  });
  it("preserves ICU variables and rich-text tags", () => {
    for (const [key, value] of Object.entries(source)) {
      let original: MessageFormatElement[];
      try { original = parse(value); } catch { continue; } // raw template/HTML examples
      expect(argumentsIn(parse(translated[key])), key).toEqual(argumentsIn(original));
    }
  });
  it("only retains shared terms and technical examples in English", () => {
    const allowed = new Set(["Beta", "Avatar", "Total", "Video", "Audio", "[Video]", "[Audio]", "+1234567890", "Error", "Variables", "Variables:", "No", "HH:mm-HH:mm", "name / email / company", "URL", '{"Authorization": "Bearer ..."}', '{"id": "{{ contact.id }}"}', "Video (MP4, 3GP)", "+15551234567", "WhatsApp"]);
    const unchanged = Object.entries(source).filter(([key, value]) => value === translated[key] && !allowed.has(value));
    expect(unchanged).toEqual([]);
  });
  it("keeps WhatsApp variable syntax intact in raw examples", () => {
    for (const [key, value] of Object.entries(source)) {
      const variables = value.match(/\{\{[^}]+\}\}/g);
      if (variables) expect(translated[key].match(/\{\{[^}]+\}\}/g), key).toEqual(variables);
    }
  });
});

describe("additional interface translations", () => {
  it("switches UI text both ways without touching user text", () => {
    expect(translateUiText("es", "AI Agents")).toBe("Agentes de IA");
    expect(translateUiText("en", "AI Agents")).toBe("AI Agents");
    expect(translateUiText("es", "Acme custom customer message")).toBe("Acme custom customer message");
  });
  it("preserves dynamic values, including special characters", () => {
    expect(translateUiText("es", "Filter by VIP $& (A)")).toBe("Filtrar por VIP $& (A)");
    expect(translateUiText("es", "File is 18.2 MB — limit is 16 MB.")).toBe("El archivo ocupa 18.2 MB; el límite es 16 MB.");
    expect(translateUiText("en", "File is 18.2 MB — limit is 16 MB.")).toBe("File is 18.2 MB — limit is 16 MB.");
  });
});
