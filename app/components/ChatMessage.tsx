import { useState } from "react";
import SourceRow from "./SourceRow";
import type { ChatMessage as ChatMessageType } from "./types";

type ChatMessageProps = {
  message: ChatMessageType;
  onDislike?: (messageId: string) => void;
};

export default function ChatMessage({ message, onDislike }: ChatMessageProps) {
  const [liked, setLiked] = useState(false);
  if (message.role === "user") {
    return (
      <div className="flex justify-end items-start">
        <div className="w-fit max-w-[70%] break-words rounded-2xl rounded-br-md bg-blue-600 px-4 py-3 text-sm text-white shadow-sm">
          {message.content}
        </div>
      </div>
    );
  }

  if (message.role === "error") {
    return (
      <div className="flex justify-start items-start">
        <div className="w-fit max-w-[70%] break-words rounded-2xl rounded-bl-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {message.content}
        </div>
      </div>
    );
  }

  const firstSource = message.sources?.[0];
  const tableSource = message.sources?.find((item) => item.type === "table");
  const tableHtml = message.tableHtml || tableSource?.html || firstSource?.html;
  const tableTitle =
    tableSource?.table_number && tableSource?.shnq_code
      ? `${tableSource.shnq_code} - ${tableSource.table_number}-jadval`
      : undefined;

  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 flex size-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        <span className="material-symbols-outlined text-[16px]">smart_toy</span>
      </div>
      <div
        className={`w-fit break-words rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 ${
          tableHtml ? "max-w-[95%]" : "max-w-[70%]"
        }`}
      >
        <div className="leading-relaxed">{message.content}</div>
        {firstSource ? <SourceRow source={firstSource} /> : null}
        {tableHtml ? (
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-950/60">
            <div className="mb-2 text-xs font-medium text-slate-600 dark:text-slate-300">
              {tableTitle || "Jadval"}
            </div>
            <iframe
              title={tableTitle || "SHNQ jadval"}
              sandbox=""
              srcDoc={tableHtml}
              className="h-[70vh] min-h-[420px] w-full rounded-md border border-slate-200 bg-white dark:border-slate-700"
            />
          </div>
        ) : null}
        <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
          <button
            type="button"
            className={`inline-flex items-center justify-center rounded-md border p-1 transition dark:hover:bg-slate-800 ${
              liked
                ? "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-700/50 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-emerald-600 dark:border-slate-700 dark:text-slate-400"
            }`}
            aria-label="Foydali"
            onClick={() => setLiked((prev) => !prev)}
          >
            <span className="material-symbols-outlined text-[12px]">thumb_up</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-slate-200 p-1 text-slate-500 transition hover:bg-slate-100 hover:text-red-500 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Foydasiz"
            onClick={() => onDislike?.(message.id)}
          >
            <span className="material-symbols-outlined text-[12px]">thumb_down</span>
          </button>
        </div>
      </div>
    </div>
  );
}
