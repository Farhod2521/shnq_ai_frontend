import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-[280px] shrink-0 flex-col border-r border-slate-800/60 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900/80 lg:flex">
          <div className="px-6 pt-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-[0_12px_30px_-18px_rgba(59,130,246,0.85)]">
                <span className="material-symbols-outlined text-[22px]">
                  architecture
                </span>
              </div>
              <div>
                <div className="text-sm font-semibold">SHNQ AI</div>
                <div className="text-[11px] text-slate-400">
                  O&#39;zbekiston Qurilish Normalari
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-2 text-sm">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-xl bg-blue-600/20 px-3 py-2.5 font-semibold text-blue-100 shadow-[0_10px_30px_-20px_rgba(59,130,246,0.9)]"
              >
                <span className="material-symbols-outlined text-[20px]">
                  dashboard
                </span>
                Bosh sahifa
              </Link>
              <Link
                href="/dashboard/documents"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-slate-300 transition hover:bg-white/5"
              >
                <span className="material-symbols-outlined text-[20px]">
                  folder
                </span>
                Hujjatlar ombori
              </Link>
              {[
                { icon: "tune", label: "AI Sozlamalari" },
                { icon: "group", label: "Foydalanuvchilar" },
                { icon: "bar_chart", label: "Hisobotlar" },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-slate-300 transition hover:bg-white/5"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-auto border-t border-slate-800/60 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-slate-700/70" />
              <div>
                <div className="text-sm font-semibold">Admin User</div>
                <div className="text-[11px] text-slate-400">
                  admin@shnq.uz
                </div>
              </div>
              <button
                type="button"
                className="ml-auto flex size-9 items-center justify-center rounded-full bg-white/5 text-slate-300 hover:bg-white/10"
                aria-label="Chiqish"
              >
                <span className="material-symbols-outlined text-[18px]">
                  logout
                </span>
              </button>
            </div>
          </div>
        </aside>
        <main className="flex-1 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900/70">
          {children}
        </main>
      </div>
    </div>
  );
}
