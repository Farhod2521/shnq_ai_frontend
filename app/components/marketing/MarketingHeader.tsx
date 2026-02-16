"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "../../providers";
import LanguageMenu from "./LanguageMenu";
import ThemeMenu from "./ThemeMenu";

type NavItem = {
  href: string;
  labelKey: string;
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
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <Image src="/brand.svg" alt="Brand logo" width={44} height={44} className="h-10 w-10 object-contain" />
          </div>
          <div className="leading-tight">
            <h1 className="text-base font-black tracking-tight text-slate-900 dark:text-white">
              SHNQ AI
            </h1>
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
          <div className="hidden items-center gap-2 md:flex">
            <LanguageMenu />
            <ThemeMenu />
          </div>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/30 transition-all hover:bg-blue-500"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            <span className="hidden sm:inline">{t("nav.chat")}</span>
          </Link>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            aria-label="Mobil menyu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className="material-symbols-outlined text-[20px]">
              {menuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      <div className="lg:hidden border-t border-slate-200/70 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95">
        <div
          className={`overflow-hidden transition-[max-height,opacity] duration-300 ${
            menuOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
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

        {menuOpen ? (
          <div className="mx-auto w-full max-w-7xl px-6 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <LanguageMenu />
              <ThemeMenu />
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
