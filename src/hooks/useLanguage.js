// ============================================================
// useLanguage — Custom React Hook
// Author: Lê (Hai Huong Le Vu)
// ============================================================
// Manages the bilingual state of the Espace application.
// Provides a simple toggle between 'fr' and 'en' that can be
// consumed by any component in the tree.
//
// In a production app, this would be extended to:
// - Persist language preference in localStorage
// - Sync with browser language settings (navigator.language)
// - Integrate with i18next for scalable translation management
// ============================================================

import { useState, useCallback } from "react";

export function useLanguage(defaultLang = "fr") {
  const [lang, setLang] = useState(defaultLang);

  // Toggle between French and English
  const toggleLanguage = useCallback(() => {
    setLang((prev) => (prev === "fr" ? "en" : "fr"));
  }, []);

  // Helper: resolve a bilingual string object { fr: "...", en: "..." }
  const t = useCallback(
    (stringObj) => {
      if (typeof stringObj === "string") return stringObj;
      return stringObj?.[lang] ?? stringObj?.fr ?? "";
    },
    [lang]
  );

  return { lang, toggleLanguage, t };
}
