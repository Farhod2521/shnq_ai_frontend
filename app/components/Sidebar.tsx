"use client";

import { useCallback, useEffect, useState } from "react";
import { listChatSessions, logoutUser, type ChatSessionSummary } from "../lib/backendApi";
import { clearAuthSession, ensureGuestRoomId, useAuthSession } from "../lib/authSession";
import {
  CHAT_NEW_SESSION_EVENT,
  CHAT_SELECT_SESSION_EVENT,
  CHAT_UPDATED_EVENT,
  dispatchChatNewSession,
  dispatchChatSelectSession,
  type ChatSelectSessionDetail,
  type ChatUpdatedDetail,
} from "../lib/chatEvents";
import { useI18n } from "../providers";

function toReadableSessionTitle(item: ChatSessionSummary, fallback: string) {
  const compact = (item.title || "").trim();
  if (!compact) {
    return fallback;
  }
  if (compact.length <= 46) {
    return compact;
  }
  return `${compact.slice(0, 43)}...`;
}

export default function Sidebar() {
  const { t } = useI18n();
  const authSession = useAuthSession();
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [loadingSessions, setLoadingSessions] = useState(false);

  const loadSessions = useCallback(async () => {
    const token = authSession?.token ?? null;
    const roomId = token ? null : ensureGuestRoomId();
    setLoadingSessions(true);
    try {
      const data = await listChatSessions({ token, roomId });
      setSessions(data);
      if (activeSessionId && data.some((item) => item.id === activeSessionId)) {
        return;
      }
      setActiveSessionId(data[0]?.id ?? null);
    } catch {
      setSessions([]);
    } finally {
      setLoadingSessions(false);
    }
  }, [activeSessionId, authSession?.token]);

  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  useEffect(() => {
    const onUpdated = (event: Event) => {
      const detail = (event as CustomEvent<ChatUpdatedDetail>).detail;
      if (detail?.sessionId !== undefined) {
        setActiveSessionId(detail.sessionId || null);
      }
      void loadSessions();
    };

    const onSelected = (event: Event) => {
      const detail = (event as CustomEvent<ChatSelectSessionDetail>).detail;
      if (detail?.sessionId) {
        setActiveSessionId(detail.sessionId);
      }
    };

    const onNew = () => {
      setActiveSessionId(null);
    };

    window.addEventListener(CHAT_UPDATED_EVENT, onUpdated);
    window.addEventListener(CHAT_SELECT_SESSION_EVENT, onSelected);
    window.addEventListener(CHAT_NEW_SESSION_EVENT, onNew);

    return () => {
      window.removeEventListener(CHAT_UPDATED_EVENT, onUpdated);
      window.removeEventListener(CHAT_SELECT_SESSION_EVENT, onSelected);
      window.removeEventListener(CHAT_NEW_SESSION_EVENT, onNew);
    };
  }, [loadSessions]);

  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    dispatchChatSelectSession(sessionId);
  };

  const handleNewChat = () => {
    if (!authSession?.token) {
      setSessions([]);
    }
    setActiveSessionId(null);
    dispatchChatNewSession();
  };

  const handleLogout = async () => {
    if (authSession?.token) {
      try {
        await logoutUser(authSession.token);
      } catch {
        // ignore logout network errors
      }
    }
    clearAuthSession();
    setSessions([]);
    setActiveSessionId(null);
    dispatchChatNewSession();
  };

  const displayName = authSession
    ? `${authSession.user.first_name} ${authSession.user.last_name}`.trim()
    : t("sidebar.user.guest", "Mehmon");

  const displayMeta = authSession?.user.phone || t("sidebar.user.role", "Guest");

  return (
    <aside className="hidden h-screen w-[280px] flex-col border-r border-slate-200 bg-white lg:flex dark:border-slate-800 dark:bg-slate-950">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white">
            <span className="material-symbols-outlined text-[20px]">smart_toy</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">SHNQ AI</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {t("sidebar.advisor", "Shaharsozlik maslahatchisi")}
            </div>
          </div>
        </div>
        <button
          type="button"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          onClick={handleNewChat}
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          {t("sidebar.new_chat", "Yangi muloqot")}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {t("sidebar.today", "Bugun")}
        </div>
        <div className="mt-3 space-y-2">
          {loadingSessions ? (
            <div className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
              {t("sidebar.loading", "Yuklanmoqda...")}
            </div>
          ) : null}

          {!loadingSessions && sessions.length === 0 ? (
            <div className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
              {t("sidebar.empty", "Hozircha tarix yo'q")}
            </div>
          ) : null}

          {sessions.map((item) => {
            const isActive = item.id === activeSessionId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectSession(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                  isActive
                    ? "border border-blue-100 bg-blue-50 text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-200"
                    : "border border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 dark:text-slate-300 dark:hover:border-slate-800 dark:hover:bg-slate-900"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                <span className="truncate">
                  {toReadableSessionTitle(item, t("sidebar.untitled", "Yangi muloqot"))}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-auto border-t border-slate-200 p-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
              {displayName}
            </div>
            <div className="truncate text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
              {displayMeta}
            </div>
          </div>
        </div>
        {authSession ? (
          <button
            type="button"
            className="mt-3 w-full rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
            onClick={handleLogout}
          >
            {t("sidebar.logout", "Chiqish")}
          </button>
        ) : null}
      </div>
    </aside>
  );
}
