"use client";

import { useSyncExternalStore } from "react";
import type { AuthUser } from "./backendApi";

const AUTH_STORAGE_KEY = "shnq_auth_session";
const GUEST_ROOM_STORAGE_KEY = "shnq_guest_room_id";
const AUTH_CHANGED_EVENT = "shnq-auth-changed";
const SERVER_SNAPSHOT: AuthSession | null = null;

export type AuthSession = {
  token: string;
  user: AuthUser;
};

function isBrowser() {
  return typeof window !== "undefined";
}

function safeDispatchAuthChanged() {
  if (!isBrowser()) {
    return;
  }
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

function safeParse<T>(value: string | null): T | null {
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function isValidAuthSession(value: unknown): value is AuthSession {
  if (!value || typeof value !== "object") {
    return false;
  }
  const token = (value as { token?: unknown }).token;
  const user = (value as { user?: unknown }).user;
  if (typeof token !== "string" || !token.trim()) {
    return false;
  }
  if (!user || typeof user !== "object") {
    return false;
  }
  const firstName = (user as { first_name?: unknown }).first_name;
  const lastName = (user as { last_name?: unknown }).last_name;
  return typeof firstName === "string" && typeof lastName === "string";
}

function createUuid() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = Math.random() * 16;
    const value = char === "x" ? random : (random % 4) + 8;
    return Math.floor(value).toString(16);
  });
}

let authSnapshot: AuthSession | null = null;
let authSnapshotInitialized = false;

function loadAuthSessionFromStorage(): AuthSession | null {
  if (!isBrowser()) {
    return null;
  }
  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  const parsed = safeParse<AuthSession>(raw);
  return isValidAuthSession(parsed) ? parsed : null;
}

function setAuthSnapshot(next: AuthSession | null) {
  authSnapshot = next;
  authSnapshotInitialized = true;
}

function syncAuthSnapshotFromStorage() {
  setAuthSnapshot(loadAuthSessionFromStorage());
}

function getAuthSnapshot() {
  if (!isBrowser()) {
    return SERVER_SNAPSHOT;
  }
  if (!authSnapshotInitialized) {
    syncAuthSnapshotFromStorage();
  }
  return authSnapshot;
}

export function readAuthSession(): AuthSession | null {
  return getAuthSnapshot();
}

export function writeAuthSession(session: AuthSession) {
  if (!isBrowser()) {
    return;
  }
  setAuthSnapshot(session);
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  safeDispatchAuthChanged();
}

export function clearAuthSession() {
  if (!isBrowser()) {
    return;
  }
  setAuthSnapshot(null);
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  safeDispatchAuthChanged();
}

export function getGuestRoomId() {
  if (!isBrowser()) {
    return null;
  }
  return window.localStorage.getItem(GUEST_ROOM_STORAGE_KEY);
}

export function ensureGuestRoomId() {
  if (!isBrowser()) {
    return null;
  }
  const existing = getGuestRoomId();
  if (existing) {
    return existing;
  }
  const created = createUuid();
  window.localStorage.setItem(GUEST_ROOM_STORAGE_KEY, created);
  return created;
}

export function replaceGuestRoomId() {
  if (!isBrowser()) {
    return null;
  }
  const created = createUuid();
  window.localStorage.setItem(GUEST_ROOM_STORAGE_KEY, created);
  return created;
}

export function setGuestRoomId(roomId: string) {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(GUEST_ROOM_STORAGE_KEY, roomId);
}

function subscribeAuthSessionStore(onStoreChange: () => void) {
  if (!isBrowser()) {
    return () => {};
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key !== AUTH_STORAGE_KEY) {
      return;
    }
    syncAuthSnapshotFromStorage();
    onStoreChange();
  };
  const onLocalAuthChanged = () => {
    syncAuthSnapshotFromStorage();
    onStoreChange();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(AUTH_CHANGED_EVENT, onLocalAuthChanged);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(AUTH_CHANGED_EVENT, onLocalAuthChanged);
  };
}

export function useAuthSession() {
  return useSyncExternalStore(subscribeAuthSessionStore, getAuthSnapshot, () => SERVER_SNAPSHOT);
}
