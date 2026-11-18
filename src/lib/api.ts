import { clearSession, parseSession, readRaw } from "@/lib/session";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type Options = { method?: string; body?: unknown; auth?: boolean };

export async function api<T>(
  path: string,
  { method = "GET", body, auth = true }: Options = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const s = parseSession(readRaw());
    if (s) headers.Authorization = `Bearer ${s.token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(
      0,
      "Can't reach the server. Check your connection and try again.",
    );
  }

  // An expired or invalid token on an authenticated call means: log out.
  if (res.status === 401 && auth) clearSession();

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const msg = (data as { error?: string } | null)?.error;
    throw new ApiError(res.status, msg ?? `Request failed (${res.status})`);
  }
  return data as T;
}