"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { KeyRound, Loader2 } from "lucide-react";
import {
  AuthShell,
  buttonClass,
  errorClass,
  inputClass,
} from "@/components/AuthShell";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Role } from "@/lib/session";
import { useRedirectIfSignedIn } from "@/lib/useRediretIfSignedIn";

type VerifyResponse = {
  token: string;
  token_type: string;
  expires_in: number;
  user_id: string;
  role: Role;
};

function CodeForm() {
  const router = useRouter();
  const email = (useSearchParams().get("email") ?? "").trim();
  const { login } = useAuth();
  const [code, setCode] = useState("");
  useRedirectIfSignedIn();

  // Opened without an email (for example a typed URL): back to step 1.
  useEffect(() => {
    if (!email) router.replace("/login");
  }, [email, router]);

  const resend = useMutation({
    mutationFn: () =>
      api<void>("/api/v1/auth/request-otp", {
        method: "POST",
        body: { email },
        auth: false,
      }),
    onSuccess: () => setCode(""),
  });

  const verify = useMutation({
    mutationFn: () =>
      api<VerifyResponse>("/api/v1/auth/verify-otp", {
        method: "POST",
        body: { email, code },
        auth: false,
      }),
    onSuccess: (r) => {
      login({
        token: r.token,
        userId: r.user_id,
        role: r.role,
        expiresAt: Date.now() + r.expires_in * 1000,
      });
      setCode("");
      router.replace("/orders");
    },
  });

  const verifyError =
    verify.error instanceof ApiError && verify.error.status === 401
      ? "That code is wrong or has expired. Request a new one."
      : verify.error?.message;

  if (!email) return null;

  return (
    <AuthShell title="Enter your code">
      <form
        className="mt-4 flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          verify.mutate();
        }}
      >
        <p className="text-muted">
          If <span className="text-ink">{email}</span> has an account, a code is
          on its way. It stays valid for 5 minutes.
        </p>
        <label className="flex flex-col gap-1 text-sm text-muted">
          6-digit code
          <input
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            autoFocus
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className={`${inputClass} text-center font-primary text-2xl tracking-[0.4em]`}
          />
        </label>
        {verifyError && (
          <p role="alert" className={errorClass}>
            {verifyError}
          </p>
        )}
        {resend.isSuccess && !verifyError && (
          <p className="text-sm text-muted">A new code is on its way.</p>
        )}
        {resend.error && (
          <p role="alert" className={errorClass}>
            {resend.error.message}
          </p>
        )}
        <button
          type="submit"
          disabled={verify.isPending || code.length !== 6}
          className={buttonClass}
        >
          {verify.isPending ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <KeyRound className="size-5" />
          )}
          {verify.isPending ? "Checking…" : "Sign in"}
        </button>
        <div className="flex justify-between text-sm">
          <button
            type="button"
            onClick={() => router.replace("/login")}
            className="text-brand hover:underline"
          >
            Use a different email
          </button>
          <button
            type="button"
            disabled={resend.isPending}
            onClick={() => {
              verify.reset();
              resend.mutate();
            }}
            className="text-brand hover:underline disabled:opacity-50"
          >
            {resend.isPending ? "Sending…" : "Send a new code"}
          </button>
        </div>
      </form>
    </AuthShell>
  );
}

export default function LoginCodePage() {
  return (
    <Suspense fallback={<p className="p-4 text-muted">Loading…</p>}>
      <CodeForm />
    </Suspense>
  );
}