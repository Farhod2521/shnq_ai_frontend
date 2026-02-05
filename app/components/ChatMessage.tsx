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
  const summaryMatch = message.content.match(/(Qisqa qilib aytganda:)([\s\S]*)/i);
  const detailText = summaryMatch
    ? message.content.slice(0, summaryMatch.index).trim()
    : message.content;
  const summaryLabel = summaryMatch?.[1] || "";
  const summaryText = summaryMatch?.[2]?.trim() || "";
  const summaryParts = summaryText.split(/(\d+(?:[.,]\d+)?%?)/g);
  const renderedTableHtml = tableHtml
    ? `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      html, body {
        margin: 0;
        padding: 0;
        background: #fff;
        color: #111827;
      }
      body {
        padding: 10px;
        font-family: "Times New Roman", serif;
      }
      * {
        box-sizing: border-box;
      }
      table {
        width: 100% !important;
        max-width: 100% !important;
        border-collapse: collapse;
        table-layout: auto;
      }
      th, td {
        max-width: none !important;
        white-space: normal;
        word-break: break-word;
      }
      img {
        max-width: 100% !important;
        height: auto !important;
      }
    </style>
  </head>
  <body>${tableHtml}</body>
</html>`
    : undefined;

  return (
    <div className="flex w-full items-start gap-3">
      <div className="mt-1 flex size-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        <span className="material-symbols-outlined text-[16px]">smart_toy</span>
      </div>
      <div
        className={`break-words rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 ${
          tableHtml ? "w-full max-w-none" : "w-fit max-w-[70%]"
        }`}
      >
        <div className="leading-relaxed whitespace-pre-wrap">
          {summaryMatch ? (
            <>
              {detailText ? <div>{detailText}</div> : null}
              <div className="mt-3 rounded-md bg-slate-100 px-2 py-1">
                <span className="font-bold text-black">{summaryLabel}</span>
                {summaryText ? " " : ""}
                {summaryParts.map((part, index) =>
                  /^\d+(?:[.,]\d+)?%?$/.test(part) ? (
                    <span key={`${part}-${index}`} className="font-semibold text-black">
                      {part}
                    </span>
                  ) : (
                    <span key={`${part}-${index}`}>{part}</span>
                  )
                )}
              </div>
            </>
          ) : (
            message.content
          )}
        </div>
        {firstSource ? <SourceRow source={firstSource} /> : null}
        {tableHtml ? (
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-950/60">
            <div className="mb-2 text-xs font-medium text-slate-600 dark:text-slate-300">
              {tableTitle || "Jadval"}
            </div>
            <iframe
              title={tableTitle || "SHNQ jadval"}
              sandbox=""
              srcDoc={renderedTableHtml}
              className="h-[75vh] min-h-[520px] w-full rounded-md border border-slate-200 bg-white dark:border-slate-700"
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
