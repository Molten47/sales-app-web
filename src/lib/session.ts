export type Role = "customer" | "staff";

export type Session = {
  token: string;
  userId: string;
  role: Role;
  expiresAt: number; // ms since epoch
};

const KEY = "sales-app.session";
export const SESSION_EVENT = "sales-app:session";

export function readRaw(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function parseSession(raw: string | null): Session | null {
  if (!raw) return null;
  try {
    const s = JSON.parse(raw) as Session;
    return s.token && s.expiresAt > Date.now() ? s : null;
  } catch {
    return null;
  }
}

export function saveSession(s: Session) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* storage blocked: the session just won't persist */
  }
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function clearSession() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function subscribeSession(onChange: () => void) {
  window.addEventListener("storage", onChange); // other tabs
  window.addEventListener(SESSION_EVENT, onChange); // this tab
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(SESSION_EVENT, onChange);
  };
}