"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

/** Login pages send already-signed-in users straight to the app. */
export function useRedirectIfSignedIn() {
  const router = useRouter();
  const { session, ready } = useAuth();

  useEffect(() => {
    if (ready && session) router.replace("/orders");
  }, [ready, session, router]);
}