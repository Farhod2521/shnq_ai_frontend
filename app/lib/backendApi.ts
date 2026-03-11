import type { SourceItem } from "../components/types";

const DEFAULT_API_BASE_URL = "https://shnq-api.dashboard.iqmath.uz/api";

export type AuthUser = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  login: string;
  created_at: string;
};

export type RegisterPayload = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
};

export type RegisterResponse = {
  token: string;
  generated_password: string;
  user: AuthUser;
};

export type LoginPayload = {
  login: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: AuthUser;
};

export type ChatSessionSummary = {
  id: string;
  title: string | null;
  room_id: string | null;
  created_at: string;
  updated_at: string;
};

export type ChatHistoryMessage = {
  id: string;
  role: string;
  content: string;
  sources: SourceItem[] | null;
  table_html: string | null;
  image_urls: string[] | null;
  created_at: string;
};

export type ChatHistoryResponse = {
  session: ChatSessionSummary;
  messages: ChatHistoryMessage[];
};

export type ChatSendPayload = {
  message: string;
  document_code?: string;
  session_id?: string;
  room_id?: string;
};

export type ChatSendResponse = {
  answer?: string;
  response?: string;
  message?: string;
  output?: string;
  sources?: SourceItem[];
  table_html?: string;
  image_urls?: string[];
  session_id?: string;
  room_id?: string | null;
};

type QueryValue = string | number | null | undefined;

type RequestOptions = {
  method?: "GET" | "POST";
  token?: string | null;
  body?: unknown;
  query?: Record<string, QueryValue>;
};

type ApiErrorPayload = {
  message: string;
  code: string | null;
};

export class ApiError extends Error {
  status: number;
  code: string | null;

  constructor(message: string, status: number, code: string | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

function normalizeBaseUrl(value: string) {
  return value.replace(/\/+$/, "");
}

export function getApiBaseUrl() {
  return normalizeBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL);
}

function buildUrl(path: string, query?: Record<string, QueryValue>) {
  const base = getApiBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${base}${normalizedPath}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        return;
      }
      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
}

async function parseJsonSafe<T>(response: Response): Promise<T | null> {
  const text = await response.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function extractErrorPayload(payload: unknown, fallback: string): ApiErrorPayload {
  let message = fallback;
  let code: string | null = null;

  if (payload && typeof payload === "object") {
    const detail = (payload as { detail?: unknown }).detail;
    if (typeof detail === "string" && detail.trim()) {
      message = detail.trim();
    } else if (detail && typeof detail === "object") {
      const detailMessage = (detail as { message?: unknown }).message;
      const detailCode = (detail as { code?: unknown }).code;
      if (typeof detailMessage === "string" && detailMessage.trim()) {
        message = detailMessage.trim();
      }
      if (typeof detailCode === "string" && detailCode.trim()) {
        code = detailCode.trim();
      }
    }

    const topLevelCode = (payload as { code?: unknown }).code;
    if (!code && typeof topLevelCode === "string" && topLevelCode.trim()) {
      code = topLevelCode.trim();
    }

    const topLevelMessage = (payload as { message?: unknown }).message;
    if (typeof topLevelMessage === "string" && topLevelMessage.trim()) {
      message = topLevelMessage.trim();
    }
    const error = (payload as { error?: unknown }).error;
    if (typeof error === "string" && error.trim()) {
      message = error.trim();
    }
  }

  return { message, code };
}

async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", token, body, query } = options;
  const headers: Record<string, string> = {};

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const data = await parseJsonSafe<T>(response);
  if (!response.ok) {
    const extracted = extractErrorPayload(data, `So'rov bajarilmadi (${response.status})`);
    throw new ApiError(extracted.message, response.status, extracted.code);
  }
  if (data === null) {
    return {} as T;
  }
  return data;
}

export function registerUser(payload: RegisterPayload) {
  return apiRequest<RegisterResponse>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export function loginUser(payload: LoginPayload) {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function getMe(token: string) {
  return apiRequest<AuthUser>("/auth/me", {
    method: "GET",
    token,
  });
}

export function getProfile(token: string) {
  return getMe(token);
}

export function logoutUser(token: string) {
  return apiRequest<{ ok: boolean }>("/auth/logout", {
    method: "POST",
    token,
  });
}

export function listChatSessions(params: { token?: string | null; roomId?: string | null }) {
  return apiRequest<ChatSessionSummary[]>("/chat/sessions", {
    method: "GET",
    token: params.token,
    query: {
      room_id: params.roomId,
    },
  });
}

export function getSessionMessages(params: {
  sessionId: string;
  token?: string | null;
  roomId?: string | null;
}) {
  return apiRequest<ChatHistoryResponse>(`/chat/sessions/${params.sessionId}/messages`, {
    method: "GET",
    token: params.token,
    query: {
      room_id: params.roomId,
    },
  });
}

export function sendChatMessage(params: {
  token?: string | null;
  message: string;
  documentCode?: string;
  sessionId?: string | null;
  roomId?: string | null;
}) {
  const payload: ChatSendPayload = {
    message: params.message,
  };
  if (params.documentCode) {
    payload.document_code = params.documentCode;
  }
  if (params.sessionId) {
    payload.session_id = params.sessionId;
  }
  if (params.roomId) {
    payload.room_id = params.roomId;
  }

  return apiRequest<ChatSendResponse>("/chat/", {
    method: "POST",
    token: params.token,
    body: payload,
  });
}
