"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { LanguageCode } from "../../i18n";
import { logoutUser } from "../../lib/backendApi";
import { clearAuthSession, useAuthSession } from "../../lib/authSession";
import { useI18n, useTheme } from "../../providers";
import LanguageMenu from "./LanguageMenu";
import ThemeMenu from "./ThemeMenu";

type NavItem = {
  href: string;
  labelKey: string;
};

type QuickPanel = "lang" | "theme" | null;

type LanguageOption = {
  code: LanguageCode;
  label: string;
  flagSrc: string;
  flagAlt: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/", labelKey: "nav.home" },
  { href: "/about", labelKey: "nav.docs" },
  { href: "/price", labelKey: "nav.pricing" },
  { href: "/faq", labelKey: "nav.faq" },
  { href: "/contact", labelKey: "nav.contact" },
];

function navItemClass(isActive: boolean) {
  if (isActive) {
    return "px-5 py-2 rounded-full bg-white text-blue-600 text-sm font-semibold shadow-sm border border-slate-100 transition-all dark:bg-slate-800 dark:text-blue-300 dark:border-slate-700";
  }
  return "px-5 py-2 rounded-full text-slate-600 hover:text-slate-900 text-sm font-medium hover:bg-white hover:shadow-sm transition-all dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800";
}

export default function MarketingHeader() {
  const pathname = usePathname();
  const { t, lang, setLang } = useI18n();
  const { theme, setTheme } = useTheme();
  const authSession = useAuthSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickMenuOpen, setQuickMenuOpen] = useState(false);
  const [quickPanel, setQuickPanel] = useState<QuickPanel>(null);
  const quickMenuRef = useRef<HTMLDivElement | null>(null);

  const displayName = authSession
    ? `${authSession.user.first_name} ${authSession.user.last_name}`.trim()
    : "";
  const authHref = authSession ? "/chat" : "/?auth=login";
  const authLabel = authSession ? displayName : t("nav.login", "Kirish");

  const languageOptions: LanguageOption[] = [
    { code: "uz", label: t("lang.uz", "O'zbek tili"), flagSrc: "/flags/uz.svg", flagAlt: "Uzbek flag" },
    { code: "en", label: t("lang.en", "English"), flagSrc: "/flags/gb.svg", flagAlt: "English flag" },
    { code: "ru", label: t("lang.ru", "Russian"), flagSrc: "/flags/ru.svg", flagAlt: "Russian flag" },
    { code: "ko", label: t("lang.ko", "Korean"), flagSrc: "/flags/kr.svg", flagAlt: "Korean flag" },
  ];

  const themeOptions: Array<{ mode: "light" | "dark" | "system"; label: string; icon: string }> = [
    { mode: "light", label: "Yorqin", icon: "light_mode" },
    { mode: "dark", label: "Tungi", icon: "dark_mode" },
    { mode: "system", label: "Tizim", icon: "devices" },
  ];

  const langSubtitle =
    languageOptions.find((item) => item.code === lang)?.label || languageOptions[0].label;
  const themeSubtitle = themeOptions.find((item) => item.mode === theme)?.label || "Yorqin";

  const handleLogout = async () => {
    if (authSession?.token) {
      try {
        await logoutUser(authSession.token);
      } catch {
        // ignore logout network errors
      }
    }
    clearAuthSession();
    setQuickMenuOpen(false);
    setQuickPanel(null);
  };

  useEffect(() => {
    if (!quickMenuOpen) {
      return;
    }
    const onClick = (event: MouseEvent) => {
      if (!quickMenuRef.current) {
        return;
      }
      if (!quickMenuRef.current.contains(event.target as Node)) {
        setQuickMenuOpen(false);
        setQuickPanel(null);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [quickMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <Image src="/brand.svg" alt="Brand logo" width={44} height={44} className="h-10 w-10 object-contain" />
          </div>
          <div className="leading-tight">
            <h1 className="text-base font-black tracking-tight text-slate-900 dark:text-white">SHNQ AI</h1>
            <span className="text-[10px] font-medium uppercase tracking-widest text-blue-600 dark:text-blue-400">
              SHNQ
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-slate-200/60 bg-slate-50 p-1.5 lg:flex dark:border-slate-800 dark:bg-slate-900">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} className={navItemClass(isActive)} href={item.href}>
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="relative hidden items-center gap-2 sm:flex" ref={quickMenuRef}>
            <Link
              href={authHref}
              className="inline-flex h-11 max-w-[220px] items-center rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              <span className="truncate">{authLabel}</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                setQuickMenuOpen((prev) => {
                  const next = !prev;
                  if (!next) {
                    setQuickPanel(null);
                  }
                  return next;
                });
              }}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              aria-haspopup="menu"
              aria-expanded={quickMenuOpen}
              aria-label={t("nav.quick_menu", "Tez menyu")}
            >
              <span className="material-symbols-outlined text-[20px]">menu</span>
            </button>

            {quickMenuOpen ? (
              <div className="absolute right-0 top-[calc(100%+10px)] z-[70]">
                <div className="relative flex">
                  <div className="w-[260px] rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900">
                    <Link
                      href={authSession ? "/chat" : "/?auth=login"}
                      onClick={() => {
                        setQuickMenuOpen(false);
                        setQuickPanel(null);
                      }}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-slate-800 transition hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800"
                    >
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">person</span>
                        {t("nav.profile", "Mening profilim")}
                      </span>
                      <span className="text-[11px] text-slate-400">Ctrl+P</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => setQuickPanel((prev) => (prev === "lang" ? null : "lang"))}
                      className={`mt-1 flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                        quickPanel === "lang"
                          ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                          : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">translate</span>
                        Til
                      </span>
                      <span className="flex items-center gap-2 text-xs text-slate-500">
                        <span>{langSubtitle}</span>
                        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setQuickPanel((prev) => (prev === "theme" ? null : "theme"))}
                      className={`mt-1 flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                        quickPanel === "theme"
                          ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                          : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">routine</span>
                        Mavzu sozlamalari
                      </span>
                      <span className="flex items-center gap-2 text-xs text-slate-500">
                        <span>{themeSubtitle}</span>
                        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                      </span>
                    </button>

                    {authSession ? (
                      <button
                        type="button"
                        onClick={() => {
                          void handleLogout();
                        }}
                        className="mt-1 flex w-full items-center gap-2 rounded-xl border-t border-slate-200 px-3 py-2.5 text-left text-sm text-rose-600 transition hover:bg-rose-50 dark:border-slate-700 dark:text-rose-300 dark:hover:bg-rose-950/30"
                      >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        {t("nav.logout", "Chiqish")}
                      </button>
                    ) : null}
                  </div>

                  {quickPanel ? (
                    <div
                      className={`absolute left-[calc(100%+8px)] rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-900 ${
                        quickPanel === "lang" ? "w-[190px]" : "w-[170px]"
                      } ${
                        quickPanel === "lang" ? "top-[56px]" : "top-[104px]"
                      }`}
                    >
                      {quickPanel === "lang"
                        ? languageOptions.map((item) => {
                            const active = item.code === lang;
                            return (
                              <button
                                key={item.code}
                                type="button"
                                onClick={() => {
                                  setLang(item.code);
                                  setQuickMenuOpen(false);
                                  setQuickPanel(null);
                                }}
                                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
                                  active
                                    ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                                    : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                                }`}
                              >
                                <Image
                                  src={item.flagSrc}
                                  alt={item.flagAlt}
                                  width={18}
                                  height={12}
                                  className="h-3 w-[18px] rounded-[2px] object-cover"
                                />
                                <span>{item.label}</span>
                              </button>
                            );
                          })
                        : themeOptions.map((item) => {
                            const active = theme === item.mode;
                            return (
                              <button
                                key={item.mode}
                                type="button"
                                onClick={() => {
                                  setTheme(item.mode);
                                  setQuickMenuOpen(false);
                                  setQuickPanel(null);
                                }}
                                className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm transition ${
                                  active
                                    ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                                    : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                                } ${item.mode === "system" ? "mt-1 border-t border-slate-200 pt-2 dark:border-slate-700" : ""}`}
                              >
                                <span className="material-symbols-outlined text-[17px]">
                                  {item.icon}
                                </span>
                                {item.label}
                              </button>
                            );
                          })}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            aria-label="Mobil menyu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <span className="material-symbols-outlined text-[20px]">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      <div className="lg:hidden border-t border-slate-200/70 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95">
        <div
          className={`overflow-hidden transition-[max-height,opacity] duration-300 ${
            mobileMenuOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mx-auto w-full max-w-7xl px-6 py-4">
            <nav className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    }`}
                    href={item.href}
                  >
                    {t(item.labelKey)}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {mobileMenuOpen ? (
          <div className="mx-auto w-full max-w-7xl px-6 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={authHref}
                className="inline-flex h-10 items-center rounded-full bg-slate-900 px-4 text-sm font-semibold text-white dark:bg-blue-600"
              >
                <span className="truncate">{authLabel}</span>
              </Link>
              <LanguageMenu />
              <ThemeMenu />
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
