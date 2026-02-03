import Link from "next/link";

export default function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white/80 py-10 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">SHNQ AI Assistent</p>
          <p className="mt-1 text-sm">Qurilish me'yorlari va qoidalari bo'yicha aqlli yordamchi.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
          <Link className="transition-colors hover:text-blue-600 dark:hover:text-blue-300" href="/faq">
            FAQ
          </Link>
          <Link className="transition-colors hover:text-blue-600 dark:hover:text-blue-300" href="/about">
            Hujjatlar
          </Link>
          <Link className="transition-colors hover:text-blue-600 dark:hover:text-blue-300" href="/price">
            Narxlar
          </Link>
          <Link className="transition-colors hover:text-blue-600 dark:hover:text-blue-300" href="/contact">
            Bog'lanish
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-6 w-full max-w-7xl px-6 text-xs text-slate-500 lg:px-10 dark:text-slate-400">
        © 2023 SHNQ AI Assistent. Barcha huquqlar himoyalangan.
      </div>
    </footer>
  );
}

