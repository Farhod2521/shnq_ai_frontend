"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "../providers";

type ChatComposerProps = {
  onSend: (message: string) => void;
  disabled?: boolean;
  variant?: "footer" | "inline";
};

export default function ChatComposer({
  onSend,
  disabled,
  variant = "footer",
}: ChatComposerProps) {
  const { t } = useI18n();
  const [value, setValue] = useState("");
  const textRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) {
      return;
    }
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }
    onSend(trimmed);
    setValue("");
  };

  return (
    <div
      className={`${
        variant === "footer"
          ? "chat-composer-footer border-t border-slate-200 bg-white px-6 py-3 dark:border-slate-800 dark:bg-slate-900"
          : "rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      }`}
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-blue-300 dark:border-slate-800 dark:bg-slate-800/60">
          <button
            type="button"
            className="text-slate-400 transition hover:text-blue-600"
          >
            <span className="material-symbols-outlined text-[20px]">
              attach_file
            </span>
          </button>
          <textarea
            ref={textRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSend();
              }
            }}
            placeholder={t("chat.input.placeholder", "SHNQ AI ga savol bering...")}
            className="min-h-[28px] max-h-[220px] flex-1 resize-none overflow-y-auto bg-transparent text-sm leading-6 text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-500"
            rows={1}
            disabled={disabled}
          />
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-60"
            onClick={handleSend}
            disabled={disabled}
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </div>
  
      </div>
    </div>
  );
}
