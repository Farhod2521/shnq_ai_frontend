import type { SourceItem } from "./types";

type SourceRowProps = {
  source: SourceItem;
};

export default function SourceRow({ source }: SourceRowProps) {
  const code = source.shnq_code || "SHNQ";
  const chapter = source.chapter || "Noma'lum bob";
  const refLabel = source.table_number
    ? `${source.table_number}-jadval`
    : source.clause_number || "-";
  const anchor = source.html_anchor ? `#${source.html_anchor}` : "";
  const link = source.lex_url ? `${source.lex_url}${anchor}` : null;

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-2 text-[11px] text-slate-500 dark:border-slate-800 dark:text-slate-400">
      <span className="inline-flex items-center gap-1">
        <span className="material-symbols-outlined text-[14px]">description</span>
        {code}
      </span>
      <span className="inline-flex items-center gap-1">
        <span className="material-symbols-outlined text-[14px]">menu_book</span>
        {chapter}
      </span>
      <span className="inline-flex items-center gap-1">
        <span className="material-symbols-outlined text-[14px]">bookmark</span>
        {refLabel}
      </span>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-0.5 text-[10px] text-slate-500 transition hover:bg-slate-100 hover:text-blue-600 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          <span className="material-symbols-outlined text-[12px]">link</span>
          lex.uz
        </a>
      ) : null}
    </div>
  );
}
