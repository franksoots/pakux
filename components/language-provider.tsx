"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  translations,
  type Language,
} from "../lib/i18n";

type TranslationDictionary =
  (typeof translations)[Language];

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: TranslationDictionary;
};

const LanguageContext =
  createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setLanguageState] =
    useState<Language>("en");

  useEffect(() => {
    const saved =
      window.localStorage.getItem(
        "pakux-language",
      );

    if (saved === "en" || saved === "et") {
      setLanguageState(saved);
      return;
    }

    const browserLanguage =
      navigator.language.toLowerCase();

    if (browserLanguage.startsWith("et")) {
      setLanguageState("et");
    } else {
      setLanguageState("en");
    }
  }, []);

  function setLanguage(nextLanguage: Language) {
    setLanguageState(nextLanguage);

    window.localStorage.setItem(
      "pakux-language",
      nextLanguage,
    );
  }

  const value: LanguageContextValue =
    useMemo(
      () => ({
        language,
        setLanguage,
        t: translations[language],
      }),
      [language],
    );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context =
    useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider",
    );
  }

  return context;
}