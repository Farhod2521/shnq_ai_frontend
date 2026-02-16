import MarketingLayout from "../components/marketing/MarketingLayout";

export default function ContactPage() {
  return (
    <MarketingLayout>
      <section className="mx-auto w-full max-w-7xl px-6 pb-20 pt-16 lg:px-10 lg:pt-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
              Bog'lanish
            </p>
            <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Biz bilan aloqaga chiqing
            </h2>
            <p className="text-base leading-7 text-slate-600 dark:text-slate-300">
              SHNQ AI platformasi bo&apos;yicha savollaringiz, takliflaringiz yoki hamkorlik
              masalalari bo&apos;yicha yozing. Mutaxassislarimiz tez orada javob beradi.
            </p>

            <div className="grid gap-3 pt-2 text-sm text-slate-700 dark:text-slate-200">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-300">
                  mail
                </span>
                support@shnq.ai
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-300">
                  call
                </span>
                +998 90 000 00 00
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-300">
                  location_on
                </span>
                Toshkent, O'zbekiston
              </div>
            </div>
          </div>

          <form className="rounded-[28px] border border-slate-200 bg-white/95 p-6 shadow-lg shadow-blue-600/10 dark:border-slate-800 dark:bg-slate-900/70">
            <div className="grid gap-4">
              <label className="grid gap-1.5 text-sm font-semibold text-slate-800 dark:text-slate-100">
                Ismingiz
                <input className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 dark:border-slate-700 dark:bg-slate-950" />
              </label>
              <label className="grid gap-1.5 text-sm font-semibold text-slate-800 dark:text-slate-100">
                Email
                <input
                  type="email"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 dark:border-slate-700 dark:bg-slate-950"
                />
              </label>
              <label className="grid gap-1.5 text-sm font-semibold text-slate-800 dark:text-slate-100">
                Xabar
                <textarea
                  rows={5}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 dark:border-slate-700 dark:bg-slate-950"
                />
              </label>
            </div>

            <button
              type="button"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-blue-500"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              Yuborish
            </button>
          </form>
        </div>
      </section>
    </MarketingLayout>
  );
}

