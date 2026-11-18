"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Mail } from "lucide-react";
import {
  AuthShell,
  buttonClass,
  errorClass,
  inputClass,
} from "@/components/AuthShell";
import { api } from "@/lib/api";
import { useRedirectIfSignedIn } from "@/lib/useRediretIfSignedIn";

export default function LoginEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  useRedirectIfSignedIn();

  const requestCode = useMutation({
    mutationFn: (address: string) =>
      api<void>("/api/v1/auth/request-otp", {
        method: "POST",
        body: { email: address },
        auth: false,
      }),
    onSuccess: (_data, address) => {
      router.push(`/login/code?email=${encodeURIComponent(address)}`);
      setEmail("");
    },
  });

  return (
    <AuthShell title="Sign in">
      <form
        className="mt-4 flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          requestCode.mutate(email.trim());
        }}
      >
        <p className="text-muted">
          Enter your email and we&rsquo;ll send you a 6-digit code.
        </p>
        <label className="flex flex-col gap-1 text-sm text-muted">
          Email
          <input
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </label>
        {requestCode.error && (
          <p role="alert" className={errorClass}>
            {requestCode.error.message}
          </p>
        )}
        <button
          type="submit"
          disabled={requestCode.isPending || !email.trim()}
          className={buttonClass}
        >
          {requestCode.isPending ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Mail className="size-5" />
          )}
          {requestCode.isPending ? "Sending…" : "Send code"}
        </button>
      </form>
    </AuthShell>
  );
}