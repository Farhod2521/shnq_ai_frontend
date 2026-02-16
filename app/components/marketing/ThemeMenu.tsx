"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n, useTheme, type ThemeMode } from "../../providers";

type ThemeOption = {
  mode: ThemeMode;
  icon: string;
  labelKey: string;
};

const OPTIONS: ThemeOption[] = [
  { mode: "light", icon: "light_mode", labelKey: "theme.light" },
  { mode: "dark", icon: "dark_mode", labelKey: "theme.dark" },
  { mode: "system", icon: "auto_awesome", labelKey: "theme.system" },
];

export default function ThemeMenu() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onClick = (event: MouseEvent) => {
      if (!rootRef.current) {
        return;
      }
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const currentIcon = useMemo(() => {
    if (theme === "system") {
      return resolvedTheme === "dark" ? "dark_mode" : "light_mode";
    }
    return theme === "dark" ? "dark_mode" : "light_mode";
  }, [theme, resolvedTheme]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="material-symbols-outlined text-[18px] text-slate-600 dark:text-slate-200">
          {currentIcon}
        </span>
        <span>{t(`theme.${theme}`, t("theme.current"))}</span>
        <span className="material-symbols-outlined text-[18px] text-slate-500">expand_more</span>
      </button>

      {open ? (
        <div className="absolute right-0 z-[60] mt-2 w-56 rounded-3xl border border-blue-100 bg-white p-2 shadow-xl shadow-blue-600/10 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-1">
            {OPTIONS.map((opt) => {
              const active = opt.mode === theme;
              return (
                <button
                  key={opt.mode}
                  type="button"
                  onClick={() => {
                    setTheme(opt.mode);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm font-semibold transition-all ${
                    active
                      ? "bg-blue-50 text-slate-900 dark:bg-slate-800 dark:text-white"
                      : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/80"
                  }`}
                  role="menuitem"
                >
                  <span className="material-symbols-outlined text-[18px]">{opt.icon}</span>
                  <span>{t(opt.labelKey)}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

