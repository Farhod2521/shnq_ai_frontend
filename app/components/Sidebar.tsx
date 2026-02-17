"use client";

import { useI18n } from "../providers";

export default function Sidebar() {
  const { t } = useI18n();

  return (
    <aside className="hidden h-screen w-[280px] flex-col border-r border-slate-200 bg-white lg:flex dark:border-slate-800 dark:bg-slate-950">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white">
            <span className="material-symbols-outlined text-[20px]">smart_toy</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              SHNQ AI
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {t("sidebar.advisor", "Shaharsozlik maslahatchisi")}
            </div>
          </div>
        </div>
        <button
          type="button"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          {t("sidebar.new_chat", "Yangi muloqot")}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {t("sidebar.today", "Bugun")}
        </div>
        <div className="mt-3 space-y-2">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-left text-sm font-medium text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-200"
          >
            <span className="material-symbols-outlined text-[18px]">
              chat_bubble
            </span>
            {t("sidebar.item.procurement_analysis", "Xarid siyosati tahlili")}
          </button>
     
        </div>
  

      </div>
      <div className="mt-auto border-t border-slate-200 p-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div>
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Artur Miller
            </div>
            <div className="text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
              {t("sidebar.user.role", "Admin 4-daraja")}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
