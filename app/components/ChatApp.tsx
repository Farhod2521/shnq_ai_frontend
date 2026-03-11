"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ApiError,
  getSessionMessages,
  listChatSessions,
  sendChatMessage,
  type ChatHistoryMessage,
  type ChatSendResponse,
} from "../lib/backendApi";
import {
  ensureGuestRoomId,
  replaceGuestRoomId,
  setGuestRoomId,
  useAuthSession,
} from "../lib/authSession";
import {
  CHAT_NEW_SESSION_EVENT,
  CHAT_SELECT_SESSION_EVENT,
  dispatchChatUpdated,
  type ChatSelectSessionDetail,
} from "../lib/chatEvents";
import { useI18n } from "../providers";
import ChatComposer from "./ChatComposer";
import ChatMessage from "./ChatMessage";
import type { ChatMessage as ChatMessageType, SourceItem } from "./types";

function mapHistoryItemToUi(item: ChatHistoryMessage): ChatMessageType {
  const imageUrls = Array.isArray(item.image_urls)
    ? item.image_urls
        .filter((url): url is string => typeof url === "string")
        .map((url) => url.trim())
        .filter((url) => url.length > 0)
    : [];

  return {
    id: item.id,
    role: item.role === "user" ? "user" : "assistant",
    content: item.content,
    sources: Array.isArray(item.sources) ? (item.sources as SourceItem[]) : [],
    tableHtml: item.table_html || undefined,
    imageUrls,
  };
}

function extractAssistantContent(data: ChatSendResponse, fallback: string) {
  return data.answer || data.response || data.message || data.output || fallback;
}

export default function ChatApp() {
  const { t } = useI18n();
  const authSession = useAuthSession();
  const token = authSession?.token ?? null;

  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [showGuestLimitModal, setShowGuestLimitModal] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);
  const typingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!listRef.current) {
      return;
    }
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, isSending]);

  useEffect(() => {
    return () => {
      if (typingRef.current) {
        clearInterval(typingRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (token) {
      setShowGuestLimitModal(false);
    }
  }, [token]);

  const pushErrorMessage = useCallback((message: string) => {
    const errorMessage: ChatMessageType = {
      id: `${Date.now()}-error`,
      role: "error",
      content: message,
    };
    setMessages((prev) => [...prev, errorMessage]);
  }, []);

  const loadSessionMessages = useCallback(
    async (sessionId: string, opts: { token: string | null; roomId: string | null }) => {
      const data = await getSessionMessages({
        sessionId,
        token: opts.token,
        roomId: opts.roomId,
      });
      setActiveSessionId(data.session.id);
      setMessages(data.messages.map(mapHistoryItemToUi));
      dispatchChatUpdated({ sessionId: data.session.id });
    },
    []
  );

  useEffect(() => {
    let isCancelled = false;

    const bootstrap = async () => {
      setIsBootstrapping(true);
      const nextRoomId = token ? null : ensureGuestRoomId();
      if (!isCancelled) {
        setRoomId(nextRoomId);
      }

      try {
        const sessions = await listChatSessions({ token, roomId: nextRoomId });
        if (isCancelled) {
          return;
        }

        if (sessions.length === 0) {
          setMessages([]);
          setActiveSessionId(null);
          dispatchChatUpdated({ sessionId: null });
          return;
        }

        await loadSessionMessages(sessions[0].id, {
          token,
          roomId: nextRoomId,
        });
      } catch (error) {
        if (!isCancelled) {
          pushErrorMessage(
            error instanceof Error ? error.message : t("chat.error.generic", "Xatolik yuz berdi")
          );
        }
      } finally {
        if (!isCancelled) {
          setIsBootstrapping(false);
        }
      }
    };

    void bootstrap();

    return () => {
      isCancelled = true;
    };
  }, [loadSessionMessages, pushErrorMessage, t, token]);

  useEffect(() => {
    const handleSessionSelect = (event: Event) => {
      const detail = (event as CustomEvent<ChatSelectSessionDetail>).detail;
      const selectedSessionId = detail?.sessionId;
      if (!selectedSessionId) {
        return;
      }

      const effectiveRoom = token ? null : roomId || ensureGuestRoomId();
      if (!token && effectiveRoom && effectiveRoom !== roomId) {
        setRoomId(effectiveRoom);
      }

      void loadSessionMessages(selectedSessionId, {
        token,
        roomId: effectiveRoom,
      }).catch((error) => {
        pushErrorMessage(
          error instanceof Error ? error.message : t("chat.error.generic", "Xatolik yuz berdi")
        );
      });
    };

    const handleNewSession = () => {
      setMessages([]);
      setActiveSessionId(null);
      if (!token) {
        const freshRoom = replaceGuestRoomId();
        setRoomId(freshRoom);
      }
      dispatchChatUpdated({ sessionId: null });
    };

    window.addEventListener(CHAT_SELECT_SESSION_EVENT, handleSessionSelect);
    window.addEventListener(CHAT_NEW_SESSION_EVENT, handleNewSession);

    return () => {
      window.removeEventListener(CHAT_SELECT_SESSION_EVENT, handleSessionSelect);
      window.removeEventListener(CHAT_NEW_SESSION_EVENT, handleNewSession);
    };
  }, [loadSessionMessages, pushErrorMessage, roomId, t, token]);

  const requestAnswer = async (message: string, appendUser: boolean) => {
    const optimisticUserMessageId = appendUser ? `${Date.now()}-user` : null;
    if (appendUser) {
      const userMessage: ChatMessageType = {
        id: optimisticUserMessageId as string,
        role: "user",
        content: message,
      };
      setMessages((prev) => [...prev, userMessage]);
    }

    setIsSending(true);

    try {
      const effectiveRoomId = token ? null : roomId || ensureGuestRoomId();
      if (!token && effectiveRoomId && effectiveRoomId !== roomId) {
        setRoomId(effectiveRoomId);
      }

      const data = await sendChatMessage({
        token,
        message,
        sessionId: activeSessionId,
        roomId: effectiveRoomId,
      });

      const nextSessionId = typeof data.session_id === "string" ? data.session_id : activeSessionId;
      if (nextSessionId) {
        setActiveSessionId(nextSessionId);
      }

      if (typeof data.room_id === "string" && data.room_id) {
        setGuestRoomId(data.room_id);
        if (!token) {
          setRoomId(data.room_id);
        }
      }

      dispatchChatUpdated({ sessionId: nextSessionId || null });

      const content = extractAssistantContent(
        data,
        t("chat.error.no_answer", "Javob topilmadi")
      );
      const imageUrls = Array.isArray(data.image_urls)
        ? data.image_urls
            .filter((url): url is string => typeof url === "string")
            .map((url) => url.trim())
            .filter((url) => url.length > 0)
        : [];

      const assistantId = `${Date.now()}-assistant`;
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", sources: [], imageUrls: [] },
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
                    sources: Array.isArray(data.sources)
                      ? (data.sources as SourceItem[])
                      : [],
                    tableHtml: data.table_html || data.sources?.[0]?.html || undefined,
                    imageUrls,
                  }
                : item
            )
          );
        }
      }, 20);
    } catch (error) {
      if (error instanceof ApiError && error.code === "guest_limit_reached") {
        if (optimisticUserMessageId) {
          setMessages((prev) => prev.filter((item) => item.id !== optimisticUserMessageId));
        }
        setShowGuestLimitModal(true);
        return;
      }
      pushErrorMessage(
        error instanceof Error ? error.message : t("chat.error.generic", "Xatolik yuz berdi")
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleSend = async (message: string) => {
    await requestAnswer(message, true);
  };

  const handleDislike = (messageId: string) => {
    void messageId;
    if (isSending) {
      return;
    }
    const lastUser = [...messages].reverse().find((item) => item.role === "user");
    if (!lastUser) {
      return;
    }

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

    void requestAnswer(lastUser.content, false);
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
              {isBootstrapping
                ? t("chat.history.loading", "Suhbat tarixi yuklanmoqda...")
                : t(
                    "chat.welcome",
                    "Assalomu alaykum! SHNQ AI maslahatchisi sizga shaharsozlik normalari bo'yicha yordam beradi. Savolingizni quyida yozing."
                  )}
            </div>
            <ChatComposer onSend={handleSend} disabled={isSending || isBootstrapping} variant="inline" />
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
        <ChatComposer onSend={handleSend} disabled={isSending || isBootstrapping} variant="footer" />
      ) : null}
      {showGuestLimitModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {t("chat.guest_limit.title", "Mehmon limitiga yetdingiz")}
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {t(
                "chat.guest_limit.body",
                "3 ta savoldan keyin davom etish uchun tizimga kirishingiz kerak."
              )}
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowGuestLimitModal(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {t("chat.guest_limit.close", "Yopish")}
              </button>
              <Link
                href="/?auth=login"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                {t("chat.guest_limit.login", "Kirish")}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
