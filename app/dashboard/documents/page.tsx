"use client";

import { useState } from "react";
import Link from "next/link";

const documents = [
  {
    id: "shnq-201-22",
    designation: "SHNQ 2.01.01-22",
    name: "Iqlimiy ma'lumotlar",
    type: "DOCX",
    status: "Jarayonda",
    statusClass: "bg-amber-500/20 text-amber-200",
    updated: "24 May, 2024",
  },
  {
    id: "shnq-103-08",
    designation: "SHNQ 1.03.01-08",
    name: "Loyiha talablari",
    type: "DOC",
    status: "Tayyor",
    statusClass: "bg-emerald-500/20 text-emerald-200",
    updated: "22 May, 2024",
  },
];

const pipelinePreview = [
  {
    title: "Hujjatni o'qish",
    desc: "PDF/DOC matni ajratib olindi",
    status: "Yakunlandi",
    statusClass: "bg-emerald-500/20 text-emerald-200",
  },
  {
    title: "HTML ga aylantirish",
    desc: "Semantik HTML tayyorlandi",
    status: "Yakunlandi",
    statusClass: "bg-emerald-500/20 text-emerald-200",
  },
  {
    title: "Strukturaga ajratish",
    desc: "Boblar va bandlar aniqlandi",
    status: "Jarayonda",
    statusClass: "bg-blue-500/20 text-blue-200",
  },
];

export default function DocumentsPage() {
  const [openId, setOpenId] = useState<string | null>(documents[0]?.id ?? null);

  return (
    <div className="px-6 pb-12 pt-6 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-slate-500">
            Hujjatlar
          </div>
          <h1 className="mt-2 text-2xl font-semibold text-white">
            Hujjatlar ombori
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Statik ma'lumotlar bilan ko'rsatmalar.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Bosh sahifa
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        {documents.map((doc) => {
          const isOpen = openId === doc.id;
          return (
            <div
              key={doc.id}
              className="rounded-2xl border border-white/5 bg-white/5 shadow-[0_22px_60px_-45px_rgba(15,23,42,0.85)]"
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : doc.id)}
                className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-blue-600/20 text-blue-200">
                    <span className="material-symbols-outlined text-[22px]">
                      description
                    </span>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">
                      {doc.designation}
                    </div>
                    <div className="text-base font-semibold text-white">
                      {doc.name}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
                      <span>{doc.type}</span>
                      <span>Yuklangan: {doc.updated}</span>
                      <span
                        className={`rounded-full px-3 py-1 ${doc.statusClass}`}
                      >
                        {doc.status}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[22px] text-slate-400">
                  {isOpen ? "expand_less" : "expand_more"}
                </span>
              </button>

              {isOpen ? (
                <div className="border-t border-white/5 px-6 py-5">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-white">
                      Pipeline holati
                    </div>
                    <Link
                      href="/dashboard/pipeline"
                      className="text-xs text-blue-300"
                    >
                      Batafsil ko'rish
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {pipelinePreview.map((step, index) => (
                      <div
                        key={step.title}
                        className="rounded-xl border border-white/5 bg-slate-950/40 px-4 py-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold text-white">
                              {index + 1}. {step.title}
                            </div>
                            <div className="mt-1 text-xs text-slate-400">
                              {step.desc}
                            </div>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs ${step.statusClass}`}
                          >
                            {step.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
