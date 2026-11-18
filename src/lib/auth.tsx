"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  clearSession,
  parseSession,
  readRaw,
  saveSession,
  subscribeSession,
  type Session,
} from "@/lib/session";

type AuthState = {
  session: Session | null;
  ready: boolean; // false until the browser has been read (avoids a login flash)
  login: (s: Session) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const qc = useQueryClient();

  // undefined on the server, string | null in the browser
  const raw = useSyncExternalStore<string | null | undefined>(
    subscribeSession,
    readRaw,
    () => undefined,
  );
  const ready = raw !== undefined;
  const session = useMemo(() => (raw ? parseSession(raw) : null), [raw]);

  // Whenever the user ends up logged out, drop every cached API response.
  useEffect(() => {
    if (ready && !session) qc.clear();
  }, [ready, session, qc]);

  const login = useCallback((s: Session) => saveSession(s), []);
  const logout = useCallback(() => clearSession(), []);

  const value = useMemo(
    () => ({ session, ready, login, logout }),
    [session, ready, login, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}