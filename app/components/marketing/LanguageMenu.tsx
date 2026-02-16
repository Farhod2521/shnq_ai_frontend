"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { LANGUAGES, type LanguageCode } from "../../i18n";
import { useI18n } from "../../providers";

type LangOption = {
  code: LanguageCode;
  flagSrc: string;
  flagAlt: string;
};

const OPTIONS: LangOption[] = [
  { code: "uz", flagSrc: "/flags/uz.svg", flagAlt: "Uzbekistan flag" },
  { code: "en", flagSrc: "/flags/gb.svg", flagAlt: "United Kingdom flag" },
  { code: "ru", flagSrc: "/flags/ru.svg", flagAlt: "Russia flag" },
  { code: "ko", flagSrc: "/flags/kr.svg", flagAlt: "South Korea flag" },
];

export default function LanguageMenu() {
  const { lang, setLang, t } = useI18n();
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

  const current = useMemo(() => {
    return OPTIONS.find((opt) => opt.code === lang) ?? OPTIONS[0];
  }, [lang]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Image
          src={current.flagSrc}
          alt={current.flagAlt}
          width={24}
          height={16}
          className="h-4 w-6 rounded-sm object-cover"
        />
        <span>{t(`lang.${lang}`, t("lang.current"))}</span>
        <span className="material-symbols-outlined text-[18px] text-slate-500">expand_more</span>
      </button>

      {open ? (
        <div className="absolute right-0 z-[60] mt-2 w-56 rounded-3xl border border-blue-100 bg-white p-2 shadow-xl shadow-blue-600/10 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-1">
            {OPTIONS.filter((opt) => LANGUAGES.includes(opt.code)).map((opt) => {
              const active = opt.code === lang;
              return (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => {
                    setLang(opt.code);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm font-semibold transition-all ${
                    active
                      ? "bg-blue-50 text-slate-900 dark:bg-slate-800 dark:text-white"
                      : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/80"
                  }`}
                  role="menuitem"
                >
                  <Image
                    src={opt.flagSrc}
                    alt={opt.flagAlt}
                    width={24}
                    height={16}
                    className="h-4 w-6 rounded-sm object-cover"
                  />
                  <span>{t(`lang.${opt.code}`)}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
