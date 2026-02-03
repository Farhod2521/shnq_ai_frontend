"use client";

import Link from "next/link";
import MarketingLayout from "./components/marketing/MarketingLayout";
import { useI18n } from "./providers";

export default function Home() {
  const { t } = useI18n();

  return (
    <MarketingLayout>
      <section className="relative overflow-hidden">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 pb-16 pt-16 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:pb-24 lg:pt-24">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-blue-600 shadow-sm dark:border-blue-900/60 dark:bg-slate-900/70 dark:text-blue-300">
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              {t("hero.badge")}
            </div>

            <h2 className="text-4xl font-black leading-[1.05] tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
              {t("hero.title")}
            </h2>

            <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              {t("hero.description")}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm.items-center">
              <Link
                href="/chat"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:translate-y-[-1px] hover:bg-blue-500"
              >
                <span className="material-symbols-outlined text-[20px]">chat</span>
                {t("hero.cta_chat")}
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:text-white"
              >
                <span className="material-symbols-outlined text-[20px]">menu_book</span>
                {t("hero.cta_docs")}
              </Link>
            </div>

            <div className="flex flex-wrap gap-3 pt-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 dark:border-slate-800 dark:bg-slate-900">
                {t("hero.chip.shnq")}
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 dark:border-slate-800 dark:bg-slate-900">
                {t("hero.chip.qmq")}
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 dark:border-slate-800 dark:bg-slate-900">
                {t("hero.chip.gost")}
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 dark:border-slate-800 dark:bg-slate-900">
                {t("hero.chip.standards")}
              </span>
            </div>
          </div>

          <div className="w-full max-w-xl">
            <div className="rounded-[28px] border border-slate-200/70 bg-white/90 p-6 shadow-[0_30px_80px_-40px_rgba(37,99,235,0.45)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-300">
                    {t("hero.card.badge")}
                  </p>
                  <h3 className="mt-1 text-lg font-black tracking-tight text-slate-900 dark:text-white">
                    {t("hero.card.title")}
                  </h3>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
                  <span className="material-symbols-outlined">forum</span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300">
                  {t("hero.card.q1")}
                </div>
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-slate-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-slate-200">
                  {t("hero.card.a1")}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/60">
                  {t("hero.card.f1")}
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/60">
                  {t("hero.card.f2")}
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/60">
                  {t("hero.card.f3")}
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/60">
                  {t("hero.card.f4")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
