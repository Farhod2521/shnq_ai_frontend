import MarketingLayout from "../components/marketing/MarketingLayout";

const SECTIONS = [
  "1-bob. Umumiy qoidalar",
  "2-bob. Atamalar va ta'riflar",
  "3-bob. Yong'in xavfsizligi talablari",
  "4-bob. Muhandislik jihozlash",
  "5-bob. Kvartira",
  "6-bob. Konstruksiyalar",
  "7-bob. Suv ta'minoti",
  "8-bob. Hududni obodonlashtirish",
];

export default function AboutPage() {
  return (
    <MarketingLayout>
      <section className="mx-auto w-full max-w-7xl px-6 pb-16 pt-10 lg:px-10">
        <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-blue-600/10 dark:border-slate-800 dark:bg-slate-900/70 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              Hujjatlar
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              ShNQ hujjati (Word uslubida)
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
              <span className="material-symbols-outlined text-[18px]">tune</span>
              Filtr
            </button>
            <select
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-blue-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              defaultValue="2024"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
            <a
              href="/shnq123.doc"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/30 transition hover:bg-blue-500"
              download
            >
              <span className="material-symbols-outlined text-[18px]">description</span>
              DOCX
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-400 shadow-sm dark:border-slate-700 dark:bg-slate-950"
              aria-disabled="true"
            >
              <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
              PDF
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-24 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
          <aside className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-lg shadow-blue-600/10 dark:border-slate-800 dark:bg-slate-900/70">
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Katta bo'limlar
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-200">
              {SECTIONS.map((section) => (
                <li key={section}>
                  <button className="w-full rounded-2xl border border-transparent px-4 py-3 text-left font-semibold transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:hover:border-blue-900/40 dark:hover:bg-blue-900/30 dark:hover:text-blue-200">
                    {section}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div className="flex justify-center">
            <iframe
              title="ShNQ hujjati"
              src="/shnq.html"
              className="h-[80vh] w-full rounded-3xl border border-slate-200 bg-white shadow-xl shadow-blue-600/10 dark:border-slate-800"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
