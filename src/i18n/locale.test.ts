import { describe, expect, it } from "vitest";
import { resolveLocale } from "./locale";

describe("locale preference", () => {
  it("prioritizes a saved choice over the deployment default", () => {
    expect(resolveLocale("es", "en")).toBe("es");
    expect(resolveLocale("en", "es")).toBe("en");
  });
  it("uses the configured language without a valid saved preference", () => {
    expect(resolveLocale(undefined, "es")).toBe("es");
    expect(resolveLocale("invalid", "ko")).toBe("ko");
  });
  it("falls back to English for unsupported locales", () => {
    expect(resolveLocale("../../invalid", "invalid")).toBe("en");
  });
});
