"use client";

import { useEffect, useState } from "react";
import { useI18n } from "../providers";

export default function TopBar() {
  const { t } = useI18n();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("shnq_theme");
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = saved ? saved === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", shouldUseDark);
    setIsDark(shouldUseDark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("shnq_theme", next ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
 

      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="text-sm font-semibold text-slate-900 dark:text-white">
            {t("topbar.secure_session", "SHNQ AI - Xavfsiz sessiya")}
          </div>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
            {t("topbar.encrypted", "Shifrlangan")}
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <button
            type="button"
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            onClick={toggleTheme}
            aria-label={t("topbar.toggle_theme", "Rejimni almashtirish")}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isDark ? "light_mode" : "dark_mode"}
            </span>
            {t("topbar.mode", "Rejim")}
          </button>
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            {t("topbar.history", "Tarix")}
          </button>
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            {t("topbar.models", "Modellar")}
          </button>
        </div>
      </div>

      <style jsx>{`
        .marquee {
          position: relative;
        }
        .marquee-track {
          animation: shnq-marquee 28s linear infinite;
        }
        @keyframes shnq-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </header>
  );
}
