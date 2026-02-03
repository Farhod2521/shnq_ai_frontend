"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  TRANSLATIONS,
  type LanguageCode,
  type Translations,
} from "./i18n";

type ThemeMode = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  resolvedTheme: "light" | "dark";
};

type I18nContextValue = {
  lang: LanguageCode;
  setLang: (code: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  translations: Translations;
};

const THEME_KEY = "shnq_theme";
const LANG_KEY = "shnq_lang";

const ThemeContext = createContext<ThemeContextValue | null>(null);
const I18nContext = createContext<I18nContextValue | null>(null);

function getSystemPrefersDark() {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolveTheme(mode: ThemeMode): "light" | "dark" {
  if (mode === "dark") {
    return "dark";
  }
  if (mode === "light") {
    return "light";
  }
  return getSystemPrefersDark() ? "dark" : "light";
}

function applyThemeToDocument(resolved: "light" | "dark") {
  if (typeof document === "undefined") {
    return;
  }
  const root = document.documentElement;
  if (resolved === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function Providers({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [lang, setLangState] = useState<LanguageCode>(DEFAULT_LANGUAGE);

  useEffect(() => {
    try {
      const storedTheme = window.localStorage.getItem(THEME_KEY) as ThemeMode | null;
      const initialTheme: ThemeMode =
        storedTheme === "light" || storedTheme === "dark" || storedTheme === "system"
          ? storedTheme
          : "system";
      setThemeState(initialTheme);
      const resolved = resolveTheme(initialTheme);
      setResolvedTheme(resolved);
      applyThemeToDocument(resolved);
    } catch {
      const resolved = resolveTheme("system");
      setResolvedTheme(resolved);
      applyThemeToDocument(resolved);
    }
  }, []);

  useEffect(() => {
    const resolved = resolveTheme(theme);
    setResolvedTheme(resolved);
    applyThemeToDocument(resolved);

    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") {
        const nextResolved = media.matches ? "dark" : "light";
        setResolvedTheme(nextResolved);
        applyThemeToDocument(nextResolved);
      }
    };
    media.addEventListener?.("change", handler);
    return () => {
      media.removeEventListener?.("change", handler);
    };
  }, [theme]);

  useEffect(() => {
    try {
      const storedLang = window.localStorage.getItem(LANG_KEY) as LanguageCode | null;
      const initialLang = storedLang && LANGUAGES.includes(storedLang) ? storedLang : DEFAULT_LANGUAGE;
      setLangState(initialLang);
    } catch {
      setLangState(DEFAULT_LANGUAGE);
    }
  }, []);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
    try {
      window.localStorage.setItem(THEME_KEY, mode);
    } catch {
      // ignore storage errors
    }
  }, []);

  const setLang = useCallback((code: LanguageCode) => {
    setLangState(code);
    try {
      window.localStorage.setItem(LANG_KEY, code);
    } catch {
      // ignore storage errors
    }
  }, []);

  const translations = useMemo(() => TRANSLATIONS[lang], [lang]);

  const t = useCallback(
    (key: string, fallback?: string) => {
      return translations[key] ?? fallback ?? TRANSLATIONS[DEFAULT_LANGUAGE][key] ?? key;
    },
    [translations],
  );

  const themeValue = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
    }),
    [theme, setTheme, resolvedTheme],
  );

  const i18nValue = useMemo<I18nContextValue>(
    () => ({
      lang,
      setLang,
      t,
      translations,
    }),
    [lang, setLang, t, translations],
  );

  return (
    <ThemeContext.Provider value={themeValue}>
      <I18nContext.Provider value={i18nValue}>{children}</I18nContext.Provider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within Providers");
  }
  return ctx;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within Providers");
  }
  return ctx;
}

export type { ThemeMode };

