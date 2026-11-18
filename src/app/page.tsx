"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function Home() {
  const router = useRouter();
  const { session, ready } = useAuth();

  useEffect(() => {
    if (ready) router.replace(session ? "/orders" : "/login");
  }, [ready, session, router]);

  return <p className="p-4 text-muted">Loading…</p>;
}