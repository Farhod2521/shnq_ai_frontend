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
      <div className="border-b border-blue-100/80 bg-blue-50/80 px-6 py-2 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-200">
        <div className="marquee overflow-hidden whitespace-nowrap">
          <div className="marquee-track inline-block pr-10">
            {t(
              "topbar.marquee",
              "SHNQ 2.07.01-23 “Aholi punktlari hududlarini rivojlantirish va qurishni shaharsozlik jihatidan rejalashtirish” normalari va qoidalarini tasdiqlash to'g'risida"
            )}
          </div>
          <div className="marquee-track inline-block pr-10" aria-hidden="true">
            {t(
              "topbar.marquee",
              "SHNQ 2.07.01-23 “Aholi punktlari hududlarini rivojlantirish va qurishni shaharsozlik jihatidan rejalashtirish” normalari va qoidalarini tasdiqlash to'g'risida"
            )}
          </div>
        </div>
      </div>

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
