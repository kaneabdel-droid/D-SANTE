"use client";

import React, { createContext, useContext, useEffect } from "react";

export type Locale = "fr" | "en" | "ar";

interface I18nContextType {
  locale: Locale;
  isRTL: boolean;
  t: (key: string, fallback?: string) => string;
  dict: Record<string, any>;
}

const I18nContext = createContext<I18nContextType>({
  locale: "fr",
  isRTL: false,
  t: (key, fallback) => fallback || key,
  dict: {},
});

export function I18nProvider({
  children,
  dict = {},
  locale = "fr",
}: {
  children: React.ReactNode;
  dict: Record<string, any>;
  locale: Locale;
}) {
  const isRTL = locale === "ar";

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dir = isRTL ? "rtl" : "ltr";
      document.documentElement.lang = locale;
    }
  }, [locale, isRTL]);

  const t = (key: string, fallback?: string): string => {
    if (!key) return fallback || "";
    const parts = key.split(".");
    let current: any = dict;
    for (const part of parts) {
      if (current === undefined || current === null || typeof current !== "object") {
        return fallback || key;
      }
      current = current[part];
    }
    if (typeof current === "string") return current;
    return fallback || key;
  };

  return (
    <I18nContext.Provider value={{ locale, isRTL, t, dict }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}

