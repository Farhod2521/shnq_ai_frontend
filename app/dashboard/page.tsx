"use client";

import Link from "next/link";
import { useState } from "react";

const stats = [
  {
    title: "Jami SHNQ hujjatlar",
    value: "1,284",
    hint: "12% o'sish (bu oy)",
    icon: "description",
    iconBg: "bg-blue-600/20 text-blue-300",
    hintClass: "text-emerald-300",
  },
  {
    title: "Jarayondagi hujjatlar",
    value: "42",
    hint: "Hozirda qayta ishlanmoqda",
    icon: "hourglass",
    iconBg: "bg-amber-500/20 text-amber-300",
    hintClass: "text-slate-400",
  },
  {
    title: "Tayyor embeddinglar",
    value: "1,218",
    hint: "94.8% muvaffaqiyat",
    icon: "task_alt",
    iconBg: "bg-emerald-500/20 text-emerald-300",
    hintClass: "text-emerald-300",
  },
  {
    title: "Xatoliklar",
    value: "24",
    hint: "Xatolarni ko'rish",
    icon: "error",
    iconBg: "bg-rose-500/20 text-rose-300",
    hintClass: "text-rose-300",
  },
];

const recentDocs = [
  {
    name: "SHNQ 2.01.01-22 Iqlimiy...",
    type: "PDF",
    date: "24 May, 2024",
    status: "Tayyor",
    statusClass: "bg-emerald-500/15 text-emerald-200",
  },
  {
    name: "SHNQ 1.03.01-08 Loyi...",
    type: "DOCX",
    date: "23 May, 2024",
    status: "Jarayonda",
    statusClass: "bg-amber-500/15 text-amber-200",
  },
  {
    name: "SHNQ 3.01.01-22 Quril...",
    type: "PDF",
    date: "22 May, 2024",
    status: "Xatolik",
    statusClass: "bg-rose-500/15 text-rose-200",
  },
  {
    name: "SHNQ 2.04.01-97 Suv ...",
    type: "PDF",
    date: "20 May, 2024",
    status: "Tayyor",
    statusClass: "bg-emerald-500/15 text-emerald-200",
  },
];

export default function DashboardPage() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <div className="px-6 pb-12 pt-6 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-2.5 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.9)]">
            <span className="material-symbols-outlined text-[20px] text-slate-400">
              search
            </span>
            <input
              type="text"
              placeholder="Hujjatlarni qidirish..."
              className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full border border-white/5 bg-white/5 text-slate-300 hover:bg-white/10"
            aria-label="Bildirishnomalar"
          >
            <span className="material-symbols-outlined text-[20px]">
              notifications
            </span>
          </button>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full border border-white/5 bg-white/5 text-slate-300 hover:bg-white/10"
            aria-label="Rejim"
          >
            <span className="material-symbols-outlined text-[20px]">
              dark_mode
            </span>
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-4">
        {stats.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-white/5 bg-gradient-to-b from-slate-900/80 to-slate-900/40 p-4 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.9)]"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-slate-400">{card.title}</div>
                <div className="mt-2 text-2xl font-semibold text-white">
                  {card.value}
                </div>
              </div>
              <div
                className={`flex size-10 items-center justify-center rounded-xl ${card.iconBg}`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {card.icon}
                </span>
              </div>
            </div>
            <div className={`mt-3 text-xs ${card.hintClass}`}>
              {card.hint}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[360px,1fr]">
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-center shadow-[0_20px_60px_-40px_rgba(15,23,42,0.9)]">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-blue-600/30 text-blue-200">
            <span className="material-symbols-outlined text-[28px]">
              cloud_upload
            </span>
          </div>
          <h3 className="mt-5 text-lg font-semibold">SHNQ hujjat yuklash</h3>
          <p className="mt-2 text-sm text-slate-400">
            PDF yoki DOCX formatidagi hujjatlarni tanlang yoki bu yerga
            sudrab keltiring.
          </p>
          <button
            type="button"
            onClick={() => setIsUploadOpen(true)}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_40px_-20px_rgba(59,130,246,0.9)] hover:bg-blue-500"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Fayl tanlash
          </button>
          <div className="mt-3 text-xs text-slate-500">
            Maksimal hajm: 50MB
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/5 shadow-[0_22px_60px_-40px_rgba(15,23,42,0.9)]">
          <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
            <h3 className="text-sm font-semibold">Yaqinda yuklanganlar</h3>
            <Link href="/dashboard/pipeline" className="text-xs text-blue-300">
              Barchasini ko&#39;rish
            </Link>
          </div>
          <div className="px-6 py-4 text-xs uppercase tracking-widest text-slate-500">
            <div className="grid grid-cols-[1.6fr,0.6fr,0.8fr,0.7fr,0.4fr] gap-4">
              <span>Hujjat nomi</span>
              <span>Turi</span>
              <span>Yuklangan sana</span>
              <span>Holat</span>
              <span className="text-right">Amallar</span>
            </div>
          </div>
          <div className="divide-y divide-white/5">
            {recentDocs.map((doc) => (
              <div
                key={doc.name}
                className="grid grid-cols-[1.6fr,0.6fr,0.8fr,0.7fr,0.4fr] items-center gap-4 px-6 py-4 text-sm text-slate-200"
              >
                <div className="truncate">{doc.name}</div>
                <div className="text-slate-400">{doc.type}</div>
                <div className="text-slate-400">{doc.date}</div>
                <div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${doc.statusClass}`}
                  >
                    {doc.status}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-2 text-slate-400">
                  <button
                    type="button"
                    className="flex size-8 items-center justify-center rounded-full bg-white/5 hover:bg-white/10"
                    aria-label="Ko'rish"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      visibility
                    </span>
                  </button>
                  <button
                    type="button"
                    className="flex size-8 items-center justify-center rounded-full bg-white/5 hover:bg-white/10"
                    aria-label="O'chirish"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      delete
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-white/5 bg-white/5 p-6 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.9)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Vector Database Holati</h3>
            <p className="mt-1 text-sm text-slate-400">
              Oxirgi yangilanish: Bugun, 14:30
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-slate-300">
            {[
              { label: "INDEX SIZE", value: "1.2 GB" },
              { label: "DIMENSIONS", value: "1536" },
              { label: "MODEL", value: "text-embedding-3" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-white/5 bg-slate-950/60 px-4 py-2.5 text-center"
              >
                <div className="text-[10px] uppercase tracking-widest text-slate-500">
                  {item.label}
                </div>
                <div className="mt-1 text-sm font-semibold text-white">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 text-sm text-slate-400">
            Hujjatlarni vektorlashtrish progressi
          </div>
          <div className="h-2 w-full rounded-full bg-white/5">
            <div className="h-2 w-[88%] rounded-full bg-gradient-to-r from-blue-500 to-blue-400" />
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-blue-500" />
              Muvaffaqiyatli
            </span>
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-amber-400" />
              Kutilmoqda
            </span>
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-rose-400" />
              Xatolik
            </span>
            <span className="ml-auto text-blue-300">88%</span>
          </div>
        </div>
      </div>

      {isUploadOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setIsUploadOpen(false)}
            aria-label="Yopish"
          />
          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900/90 p-6 shadow-[0_25px_80px_-45px_rgba(15,23,42,0.95)]">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Hujjat yuklash
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Hujjat belgilanishi, nomi va DOCX faylini kiriting.
                </p>
              </div>
              <button
                type="button"
                className="flex size-9 items-center justify-center rounded-full bg-white/5 text-slate-300 hover:bg-white/10"
                onClick={() => setIsUploadOpen(false)}
                aria-label="Yopish"
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block text-sm text-slate-300">
                Hujjat belgilanishi
                <input
                  type="text"
                  placeholder="Masalan: SHNQ 2.01.01-22"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </label>
              <label className="block text-sm text-slate-300">
                Hujjat nomi
                <input
                  type="text"
                  placeholder="Iqlimiy ma'lumotlar"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </label>
              <label className="block text-sm text-slate-300">
                DOCX fayli
                <input
                  type="file"
                  accept=".docx"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600/90 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-blue-500"
                />
              </label>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_-18px_rgba(59,130,246,0.9)] hover:bg-blue-500"
              >
                Yuklash
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
