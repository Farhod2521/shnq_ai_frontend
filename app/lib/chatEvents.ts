"use client";

export const CHAT_UPDATED_EVENT = "shnq-chat-updated";
export const CHAT_SELECT_SESSION_EVENT = "shnq-chat-select-session";
export const CHAT_NEW_SESSION_EVENT = "shnq-chat-new-session";

export type ChatUpdatedDetail = {
  sessionId?: string | null;
};

export type ChatSelectSessionDetail = {
  sessionId: string;
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function dispatchChatUpdated(detail: ChatUpdatedDetail = {}) {
  if (!isBrowser()) {
    return;
  }
  window.dispatchEvent(new CustomEvent<ChatUpdatedDetail>(CHAT_UPDATED_EVENT, { detail }));
}

export function dispatchChatSelectSession(sessionId: string) {
  if (!isBrowser()) {
    return;
  }
  window.dispatchEvent(
    new CustomEvent<ChatSelectSessionDetail>(CHAT_SELECT_SESSION_EVENT, {
      detail: { sessionId },
    })
  );
}

export function dispatchChatNewSession() {
  if (!isBrowser()) {
    return;
  }
  window.dispatchEvent(new Event(CHAT_NEW_SESSION_EVENT));
}
