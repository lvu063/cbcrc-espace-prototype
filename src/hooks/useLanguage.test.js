// ============================================================
// useLanguage — Unit Tests
// Author: Lê (Hai-Huong Le Vu)
// ============================================================
// Tests for the useLanguage custom hook using React Testing Library.
// Demonstrates knowledge of:
// - Unit testing with Jest
// - Testing React hooks with renderHook
// - Act wrapper for state updates
// - Edge case coverage
// ============================================================

import { renderHook, act } from "@testing-library/react";
import { useLanguage } from "./useLanguage";

describe("useLanguage hook", () => {

  // --- Default state ---
  describe("initialisation", () => {
    test("defaults to French when no argument provided", () => {
      const { result } = renderHook(() => useLanguage());
      expect(result.current.lang).toBe("fr");
    });

    test("accepts a custom default language", () => {
      const { result } = renderHook(() => useLanguage("en"));
      expect(result.current.lang).toBe("en");
    });

    test("exposes lang, toggleLanguage, and t", () => {
      const { result } = renderHook(() => useLanguage());
      expect(result.current).toHaveProperty("lang");
      expect(result.current).toHaveProperty("toggleLanguage");
      expect(result.current).toHaveProperty("t");
      expect(typeof result.current.toggleLanguage).toBe("function");
      expect(typeof result.current.t).toBe("function");
    });
  });

  // --- Toggle behaviour ---
  describe("toggleLanguage", () => {
    test("toggles from French to English", () => {
      const { result } = renderHook(() => useLanguage("fr"));
      act(() => { result.current.toggleLanguage(); });
      expect(result.current.lang).toBe("en");
    });

    test("toggles from English back to French", () => {
      const { result } = renderHook(() => useLanguage("en"));
      act(() => { result.current.toggleLanguage(); });
      expect(result.current.lang).toBe("fr");
    });

    test("toggles back and forth correctly multiple times", () => {
      const { result } = renderHook(() => useLanguage("fr"));
      act(() => { result.current.toggleLanguage(); });
      expect(result.current.lang).toBe("en");
      act(() => { result.current.toggleLanguage(); });
      expect(result.current.lang).toBe("fr");
      act(() => { result.current.toggleLanguage(); });
      expect(result.current.lang).toBe("en");
    });
  });

  // --- Translation helper t() ---
  describe("t() translation helper", () => {
    test("returns French string when lang is fr", () => {
      const { result } = renderHook(() => useLanguage("fr"));
      const str = { fr: "Bonjour", en: "Hello" };
      expect(result.current.t(str)).toBe("Bonjour");
    });

    test("returns English string when lang is en", () => {
      const { result } = renderHook(() => useLanguage("en"));
      const str = { fr: "Bonjour", en: "Hello" };
      expect(result.current.t(str)).toBe("Hello");
    });

    test("returns updated translation after toggle", () => {
      const { result } = renderHook(() => useLanguage("fr"));
      const str = { fr: "Publier", en: "Post" };
      expect(result.current.t(str)).toBe("Publier");
      act(() => { result.current.toggleLanguage(); });
      expect(result.current.t(str)).toBe("Post");
    });

    test("returns plain string unchanged (non-bilingual input)", () => {
      const { result } = renderHook(() => useLanguage("fr"));
      expect(result.current.t("plain string")).toBe("plain string");
    });

    test("falls back to French when English key is missing", () => {
      const { result } = renderHook(() => useLanguage("en"));
      const str = { fr: "Seulement en français" };
      expect(result.current.t(str)).toBe("Seulement en français");
    });

    test("returns empty string for null/undefined input", () => {
      const { result } = renderHook(() => useLanguage("fr"));
      expect(result.current.t(null)).toBe("");
      expect(result.current.t(undefined)).toBe("");
    });

    test("handles empty bilingual strings", () => {
      const { result } = renderHook(() => useLanguage("fr"));
      expect(result.current.t({ fr: "", en: "" })).toBe("");
    });
  });

  // --- Stability ---
  describe("referential stability", () => {
    test("toggleLanguage function reference is stable across renders", () => {
      const { result, rerender } = renderHook(() => useLanguage("fr"));
      const firstRef = result.current.toggleLanguage;
      rerender();
      expect(result.current.toggleLanguage).toBe(firstRef);
    });

    test("t function reference is stable until lang changes", () => {
      const { result } = renderHook(() => useLanguage("fr"));
      const firstRef = result.current.t;
      // t should be same reference before toggle
      expect(result.current.t).toBe(firstRef);
    });
  });
});
