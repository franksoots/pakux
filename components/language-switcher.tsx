"use client";

import { useLanguage } from "./language-provider";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="pk-language-switcher">
      <button
        type="button"
        className={`pk-language-option ${
          language === "et" ? "active" : ""
        }`}
        onClick={() => setLanguage("et")}
        aria-label="Eesti"
      >
        🇪🇪
      </button>

      <button
        type="button"
        className={`pk-language-option ${
          language === "en" ? "active" : ""
        }`}
        onClick={() => setLanguage("en")}
        aria-label="English"
      >
        🇬🇧
      </button>
    </div>
  );
}