"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ChatComposer from "./ChatComposer";
import ChatMessage from "./ChatMessage";
import type { ChatMessage as ChatMessageType, SourceItem } from "./types";
import { useI18n } from "../providers";

type ChatResponse = {
  answer?: string;
  response?: string;
  message?: string;
  output?: string;
  sources?: SourceItem[];
  table_html?: string;
  image_urls?: string[];
};

export default function ChatApp() {
  const { t } = useI18n();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isSending, setIsSending] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const typingRef = useRef<NodeJS.Timeout | null>(null);

  const apiUrl = useMemo(() => {
    const base =
      process.env.NEXT_PUBLIC_API_BASE_URL || "https://shnq-ai.iqmath.uz/api";
    return `${base}/chat/`;
  }, []);

  useEffect(() => {
    if (!listRef.current) {
      return;
    }
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, isSending]);

  const requestAnswer = async (message: string, appendUser: boolean) => {
    if (appendUser) {
      const userMessage: ChatMessageType = {
        id: `${Date.now()}-user`,
        role: "user",
        content: message,
      };
      setMessages((prev) => [...prev, userMessage]);
    }
    setIsSending(true);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = (await response.json()) as ChatResponse;
      if (!response.ok) {
        throw new Error(data.message || t("chat.error.server", "Server xatosi"));
      }
      const content =
        data.answer ||
        data.response ||
        data.message ||
        data.output ||
        t("chat.error.no_answer", "Javob topilmadi");
      const imageUrl = Array.isArray(data.image_urls)
        ? data.image_urls.find((url): url is string => typeof url === "string" && url.trim().length > 0)
        : undefined;
      const assistantId = `${Date.now()}-assistant`;
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", sources: [], imageUrl: undefined },
      ]);
      if (typingRef.current) {
        clearInterval(typingRef.current);
      }
      let index = 0;
      typingRef.current = setInterval(() => {
        index = Math.min(content.length, index + Math.max(1, Math.ceil(content.length / 120)));
        setMessages((prev) =>
          prev.map((item) =>
            item.id === assistantId
              ? { ...item, content: content.slice(0, index) }
              : item
          )
        );
        if (index >= content.length) {
          if (typingRef.current) {
            clearInterval(typingRef.current);
            typingRef.current = null;
          }
          setMessages((prev) =>
            prev.map((item) =>
              item.id === assistantId
                ? {
                    ...item,
                    sources: data.sources || [],
                    tableHtml: data.table_html || data.sources?.[0]?.html || undefined,
                    imageUrl,
                  }
                : item
            )
          );
        }
      }, 20);
    } catch (error) {
      const errorMessage: ChatMessageType = {
        id: `${Date.now()}-error`,
        role: "error",
        content:
          error instanceof Error ? error.message : t("chat.error.generic", "Xatolik yuz berdi"),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSend = async (message: string) => {
    await requestAnswer(message, true);
  };

  const handleDislike = () => {
    if (isSending) {
      return;
    }
    const lastUser = [...messages].reverse().find((item) => item.role === "user");
    if (lastUser) {
      setMessages((prev) => {
        const lastAssistantIndex = [...prev]
          .map((item, index) => ({ item, index }))
          .reverse()
          .find((entry) => entry.item.role === "assistant")?.index;
        if (lastAssistantIndex === undefined) {
          return prev;
        }
        return prev.filter((_, index) => index !== lastAssistantIndex);
      });
      requestAnswer(lastUser.content, false);
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-full flex-1 flex-col bg-slate-50 dark:bg-slate-950">
      <div
        className={`flex-1 px-6 ${
          isEmpty
            ? "flex items-center justify-center py-10"
            : "overflow-y-auto overscroll-contain pb-40 pt-6"
        }`}
        ref={listRef}
      >
        {isEmpty ? (
          <div className="w-full max-w-2xl space-y-6">
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
              {t(
                "chat.welcome",
                "Assalomu alaykum! SHNQ AI maslahatchisi sizga shaharsozlik normalari bo'yicha yordam beradi. Savolingizni quyida yozing."
              )}
            </div>
            <ChatComposer onSend={handleSend} disabled={isSending} variant="inline" />
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onDislike={message.role === "assistant" ? handleDislike : undefined}
              />
            ))}
            {isSending ? (
              <div className="flex items-start gap-3">
                <div className="mt-1 flex size-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                </div>
                <div className="w-fit rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                  <div className="typing-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
      {!isEmpty ? (
        <ChatComposer onSend={handleSend} disabled={isSending} variant="footer" />
      ) : null}
    </div>
  );
}
